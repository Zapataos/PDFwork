const { app, BrowserWindow, dialog, ipcMain, shell } = require("electron");
const { spawn } = require("child_process");
const path = require("path");
const http = require("http");
const fs = require("fs");

const BACKEND_PORT = 17300;
const BACKEND_URL = `http://127.0.0.1:${BACKEND_PORT}`;
const MAX_BUFFER_SIZE = 500 * 1024 * 1024;

app.commandLine.appendSwitch("disable-gpu-vsync");

let mainWindow = null;
let pythonProcess = null;
let authToken = null;

function startBackend() {
  const serverPath = path.join(__dirname, "backend", "server.py");
  const isWindows = process.platform === "win32";
  const pythonDir = isWindows ? path.join("venv", "Scripts") : path.join("venv", "bin");
  const pythonCmd = isWindows ? "python.exe" : "python3";
  const pythonPath = path.join(__dirname, pythonDir, pythonCmd);
  pythonProcess = spawn(pythonPath, [serverPath], {
    stdio: ["pipe", "pipe", "pipe"],
    env: { ...process.env },
  });

  pythonProcess.stdout.on("data", (d) => {
    const line = d.toString().trim();
    if (line.startsWith("[backend] INFO AUTH_TOKEN:")) {
      authToken = line.split("AUTH_TOKEN:")[1].trim();
      console.log("[electron] Auth token captured");
    } else {
      console.log("[backend]", line);
    }
  });
  pythonProcess.stderr.on("data", (d) => console.log("[backend]", d.toString().trim()));
  pythonProcess.on("close", (code) => console.log("[backend] exited with", code));

  return new Promise((resolve) => {
    function check() {
      http.get(`${BACKEND_URL}/health`, (res) => {
        if (res.statusCode === 200) resolve();
        else setTimeout(check, 500);
      }).on("error", () => setTimeout(check, 500));
    }
    check();
  });
}

function stopBackend() {
  if (pythonProcess) {
    pythonProcess.kill("SIGTERM");
    pythonProcess = null;
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    title: "PDFWorks",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, "renderer", "index.html"));
  mainWindow.setMenuBarVisibility(false);
}

app.whenReady().then(async () => {
  console.log("[electron] Starting Python backend...");
  await startBackend();
  console.log("[electron] Backend ready.");
  createWindow();
});

app.on("window-all-closed", () => {
  stopBackend();
  app.quit();
});

app.on("before-quit", () => {
  stopBackend();
});

ipcMain.handle("get-backend-url", () => BACKEND_URL);
ipcMain.handle("get-auth-token", () => authToken);
ipcMain.handle("select-save-path", async (_, defaultName) => {
  const result = await dialog.showSaveDialog(mainWindow, {
    defaultPath: defaultName,
    filters: [
      { name: "PDF", extensions: ["pdf"] },
      { name: "Word", extensions: ["docx"] },
      { name: "ZIP", extensions: ["zip"] },
      { name: "All Files", extensions: ["*"] },
    ],
  });
  return result.canceled ? null : result.filePath;
});
ipcMain.handle("select-files", async (_, options) => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ["openFile", "multiSelections"],
    filters: options?.filters || [],
  });
  return result.canceled ? [] : result.filePaths;
});

ipcMain.handle("save-file", async (_, filePath, buffer) => {
  try {
    if (buffer.byteLength > MAX_BUFFER_SIZE) {
      return { success: false, error: "File too large" };
    }
    fs.writeFileSync(filePath, Buffer.from(buffer));
    return { success: true, path: filePath };
  } catch (err) {
    return { success: false, error: "Failed to save file" };
  }
});

ipcMain.handle("open-file", async (_, buffer, filename) => {
  try {
    if (buffer.byteLength > MAX_BUFFER_SIZE) {
      return { success: false, error: "File too large" };
    }
    const outDir = path.join(app.getPath("downloads"), "PDFWorks");
    fs.mkdirSync(outDir, { recursive: true });
    const safeName = path.basename(filename);

    const ext = path.extname(safeName);
    const base = path.basename(safeName, ext);
    let filePath = path.join(outDir, safeName);
    let counter = 1;
    while (fs.existsSync(filePath)) {
      filePath = path.join(outDir, `${base}_${counter}${ext}`);
      counter++;
    }

    const tmpPath = filePath + ".tmp";
    fs.writeFileSync(tmpPath, Buffer.from(buffer));
    fs.renameSync(tmpPath, filePath);
    shell.showItemInFolder(filePath);
    return { success: true, path: filePath };
  } catch (err) {
    return { success: false, error: "Failed to open file" };
  }
});

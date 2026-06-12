let backendUrl = "http://127.0.0.1:17300";
let backendAuthToken = "";

const state = {
  currentTool: "office-to-pdf",
  files: {},
};

const translations = {
  es: {
    logo: "PDF", logoSub: "Works",
    toolOfficeToPdf: "Office a PDF", toolMerge: "Combinar", toolSplit: "Dividir",
    toolDeletePages: "Eliminar págs", toolReorderPages: "Ordenar págs",
    toolCompress: "Comprimir", toolPdfToWord: "PDF a Word", toolProtect: "Proteger",
    toolUnprotect: "Desproteger", toolImagesToPdf: "Imágenes a PDF", toolRotate: "Rotar",
    toolPdfToJpg: "PDF a JPG", toolWatermark: "Marca de agua",
    toolExtractImages: "Extraer img", toolDarkmode: "PDF Dark",
    themeDark: "Modo oscuro", themeLight: "Modo claro",
    w2pTitle: "Office a PDF", w2pDesc: "Convierte documentos Word, PowerPoint o Excel a PDF arrastrándolos aquí.",
    w2pDropText: "Arrastra archivos Office aquí", w2pBtn: "Convertir a PDF",
    o2pTitle: "Office a PDF", o2pDesc: "Convierte documentos Word, PowerPoint o Excel a PDF arrastrándolos aquí.",
    o2pDropText: "Arrastra archivos Office aquí", o2pBtn: "Convertir a PDF",
    mergeTitle: "Combinar archivos", mergeDesc: "Une varios PDFs o Word en un solo PDF. Arrástralos en el orden deseado.",
    mergeDropText: "Arrastra PDFs o Word aquí (en orden)", mergeBtn: "Combinar PDFs",
    splitTitle: "Dividir PDF", splitDesc: "Separa las páginas de un PDF o extrae un rango específico.",
    splitDropText: "Arrastra un PDF aquí", splitExtractRange: "Extraer rango de páginas", splitBtn: "Dividir PDF",
    compressTitle: "Comprimir PDF", compressDesc: "Reduce el tamaño de tu archivo PDF sin perder calidad.",
    compressBtn: "Comprimir PDF",
    p2wTitle: "PDF a Word", p2wDesc: "Convierte archivos PDF a documentos Word (.docx) editables.",
    p2wDropText: "Arrastra archivos PDF aquí", p2wBtn: "Convertir a Word",
    protectTitle: "Proteger PDF", protectDesc: "Añade una contraseña para proteger tu PDF.",
    protectBtn: "Proteger PDF",
    unprotectTitle: "Desproteger PDF", unprotectDesc: "Quita la contraseña de un PDF protegido.",
    unprotectBtn: "Desproteger PDF",
    img2pdfTitle: "Imágenes a PDF", img2pdfDesc: "Convierte imágenes (JPG, PNG, GIF, BMP, WEBP) a un solo PDF.",
    img2pdfDropText: "Arrastra imágenes aquí", img2pdfBtn: "Convertir a PDF",
    rotateTitle: "Rotar PDF", rotateDesc: "Gira las páginas de tu PDF (90°, 180°, 270°).",
    rotateBtn: "Rotar PDF",
    deleteTitle: "Eliminar páginas", deleteDesc: "Elimina páginas específicas de un PDF. Indica los números separados por comas.",
    deletePagesLabel: "Páginas a eliminar (Ej: 2,5,7-9):", deletePagesPlaceholder: "Ej: 2,5,7-9",
    deleteBtn: "Eliminar páginas",
    reorderTitle: "Ordenar páginas", reorderDesc: "Reordena las páginas de tu PDF en el orden que desees.",
    reorderLabel: "Nuevo orden (Ej: 3,1,2,5,4):", reorderPlaceholder: "Ej: 3,1,2,5,4",
    reorderBtn: "Reordenar páginas",
    p2jpgTitle: "PDF a JPG", p2jpgDesc: "Convierte cada página de un PDF en una imagen JPG de alta calidad.",
    p2jpgBtn: "Convertir a JPG",
    watermarkTitle: "Marca de agua", watermarkDesc: "Añade una marca de agua de texto a las páginas de tu PDF.",
    wmText: "Texto:", wmTextPlaceholder: "CONFIDENCIAL", wmOpacity: "Opacidad:",
    watermarkBtn: "Añadir marca de agua",
    extractTitle: "Extraer Imágenes", extractDesc: "Extrae todas las imágenes incrustadas en un PDF.",
    extractBtn: "Extraer imágenes",
    darkTitle: "Modo oscuro PDF", darkDesc: "Convierte tu PDF a modo oscuro para lectura nocturna sin cansar la vista. Ideal para leer desde el celular.",
    darkBtn: "Convertir a modo oscuro",
    dropTextSingle: "Arrastra un PDF aquí", or: "o",
    selectFile: "Seleccionar archivo", selectFiles: "Seleccionar archivos",
    pagesLabel: "Páginas (Ej: 1-3,5,7):", allPages: "todas", angle: "Ángulo:",
    password: "Contraseña:", passwordPlaceholder: "Ingresa la contraseña",
    currentPassword: "Contraseña actual:", currentPwPlaceholder: "Contraseña del PDF",
    splitRangePlaceholder: "Ej: 1-3,5,7",
    openBtn: "Abrir", saveBtn: "Guardar",
    processing: "Procesando...",
    processed: "Procesado correctamente",
    opening: "Abriendo:", saving: "Archivo guardado:",
    fileSaved: "Archivo guardado en:",
    errorOpening: "Error al abrir:", errorSaving: "Error al guardar:",
    errorUnknown: "Error desconocido", errorBackend: "Error: no se pudo conectar con el backend",
    errorPageRange: "Ingresa el rango de páginas",
    compressToast: "Comprimido: reducción del",
    resultW2p: "PDF convertido", resultMerge: "PDF combinado", resultSplit: "PDF dividido",
    resultExtractPages: "Páginas extraídas", resultCompress: "PDF comprimido", resultP2w: "Documento Word",
    resultProtect: "PDF protegido", resultUnprotect: "PDF desprotegido",
    resultImg2pdf: "PDF de imágenes", resultRotate: "PDF rotado", resultExtract: "Imágenes extraídas",
    resultDark: "PDF modo oscuro", resultDelete: "PDF recortado", resultReorder: "PDF ordenado",
    resultP2jpg: "Imágenes JPG", resultWatermark: "PDF con marca de agua",
  },
  en: {
    logo: "PDF", logoSub: "Works",
    toolOfficeToPdf: "Office to PDF", toolMerge: "Merge", toolSplit: "Split",
    toolDeletePages: "Delete pages", toolReorderPages: "Reorder",
    toolCompress: "Compress", toolPdfToWord: "PDF to Word", toolProtect: "Protect",
    toolUnprotect: "Unprotect", toolImagesToPdf: "Images to PDF", toolRotate: "Rotate",
    toolPdfToJpg: "PDF to JPG", toolWatermark: "Watermark",
    toolExtractImages: "Extract img", toolDarkmode: "PDF Dark",
    themeDark: "Dark mode", themeLight: "Light mode",
    w2pTitle: "Office to PDF", w2pDesc: "Convert Word, PowerPoint or Excel documents to PDF by dragging them here.",
    w2pDropText: "Drop Office files here", w2pBtn: "Convert to PDF",
    o2pTitle: "Office to PDF", o2pDesc: "Convert Word, PowerPoint or Excel documents to PDF by dragging them here.",
    o2pDropText: "Drop Office files here", o2pBtn: "Convert to PDF",
    mergeTitle: "Merge files", mergeDesc: "Combine multiple PDFs or Word docs into a single PDF. Drop in desired order.",
    mergeDropText: "Drop PDFs or Word files here (in order)", mergeBtn: "Merge PDFs",
    splitTitle: "Split PDF", splitDesc: "Separate PDF pages or extract a specific range.",
    splitDropText: "Drop a PDF here", splitExtractRange: "Extract page range", splitBtn: "Split PDF",
    compressTitle: "Compress PDF", compressDesc: "Reduce your PDF file size without losing quality.",
    compressBtn: "Compress PDF",
    p2wTitle: "PDF to Word", p2wDesc: "Convert PDF files to editable Word documents (.docx).",
    p2wDropText: "Drop PDF files here", p2wBtn: "Convert to Word",
    protectTitle: "Protect PDF", protectDesc: "Add a password to protect your PDF.",
    protectBtn: "Protect PDF",
    unprotectTitle: "Unprotect PDF", unprotectDesc: "Remove the password from a protected PDF.",
    unprotectBtn: "Unprotect PDF",
    img2pdfTitle: "Images to PDF", img2pdfDesc: "Convert images (JPG, PNG, GIF, BMP, WEBP) into a single PDF.",
    img2pdfDropText: "Drop images here", img2pdfBtn: "Convert to PDF",
    rotateTitle: "Rotate PDF", rotateDesc: "Rotate pages of your PDF (90°, 180°, 270°).",
    rotateBtn: "Rotate PDF",
    deleteTitle: "Delete pages", deleteDesc: "Remove specific pages from a PDF. Enter page numbers separated by commas.",
    deletePagesLabel: "Pages to remove (e.g. 2,5,7-9):", deletePagesPlaceholder: "e.g. 2,5,7-9",
    deleteBtn: "Delete pages",
    reorderTitle: "Reorder pages", reorderDesc: "Rearrange your PDF pages in any order you want.",
    reorderLabel: "New order (e.g. 3,1,2,5,4):", reorderPlaceholder: "e.g. 3,1,2,5,4",
    reorderBtn: "Reorder pages",
    p2jpgTitle: "PDF to JPG", p2jpgDesc: "Convert each PDF page into a high-quality JPG image.",
    p2jpgBtn: "Convert to JPG",
    watermarkTitle: "Watermark", watermarkDesc: "Add a text watermark to your PDF pages.",
    wmText: "Text:", wmTextPlaceholder: "CONFIDENTIAL", wmOpacity: "Opacity:",
    watermarkBtn: "Add watermark",
    extractTitle: "Extract Images", extractDesc: "Extract all embedded images from a PDF.",
    extractBtn: "Extract images",
    darkTitle: "PDF Dark Mode", darkDesc: "Convert your PDF to dark mode for night reading. Ideal for mobile reading.",
    darkBtn: "Convert to dark mode",
    dropTextSingle: "Drop a PDF here", or: "or",
    selectFile: "Select file", selectFiles: "Select files",
    pagesLabel: "Pages (e.g. 1-3,5,7):", allPages: "all", angle: "Angle:",
    password: "Password:", passwordPlaceholder: "Enter password",
    currentPassword: "Current password:", currentPwPlaceholder: "PDF password",
    splitRangePlaceholder: "e.g. 1-3,5,7",
    openBtn: "Open", saveBtn: "Save",
    processing: "Processing...",
    processed: "Processed successfully",
    opening: "Opening:", saving: "File saved:",
    fileSaved: "File saved at:",
    errorOpening: "Error opening:", errorSaving: "Error saving:",
    errorUnknown: "Unknown error", errorBackend: "Error: cannot connect to backend",
    errorPageRange: "Enter a page range",
    compressToast: "Compressed: reduction of",
    resultW2p: "Converted PDF", resultMerge: "Merged PDF", resultSplit: "Split PDF",
    resultExtractPages: "Extracted pages", resultCompress: "Compressed PDF", resultP2w: "Word document",
    resultProtect: "Protected PDF", resultUnprotect: "Unprotected PDF",
    resultImg2pdf: "Images PDF", resultRotate: "Rotated PDF", resultExtract: "Extracted images",
    resultDark: "Dark mode PDF", resultDelete: "Trimmed PDF", resultReorder: "Reordered PDF",
    resultP2jpg: "JPG images", resultWatermark: "Watermarked PDF",
  },
  pt: {
    logo: "PDF", logoSub: "Works",
    toolOfficeToPdf: "Office para PDF", toolMerge: "Combinar", toolSplit: "Dividir",
    toolDeletePages: "Apagar págs", toolReorderPages: "Ordenar págs",
    toolCompress: "Comprimir", toolPdfToWord: "PDF para Word", toolProtect: "Proteger",
    toolUnprotect: "Desproteger", toolImagesToPdf: "Imagens p/ PDF", toolRotate: "Girar",
    toolPdfToJpg: "PDF para JPG", toolWatermark: "Marca d'água",
    toolExtractImages: "Extrair img", toolDarkmode: "PDF Escuro",
    themeDark: "Modo escuro", themeLight: "Modo claro",
    w2pTitle: "Office para PDF", w2pDesc: "Converta documentos Word, PowerPoint ou Excel para PDF arrastando-os aqui.",
    w2pDropText: "Arraste arquivos Office aqui", w2pBtn: "Converter para PDF",
    o2pTitle: "Office para PDF", o2pDesc: "Converta documentos Word, PowerPoint ou Excel para PDF arrastando-os aqui.",
    o2pDropText: "Arraste arquivos Office aqui", o2pBtn: "Converter para PDF",
    mergeTitle: "Combinar arquivos", mergeDesc: "Junte vários PDFs ou Word em um só PDF. Arraste na ordem desejada.",
    mergeDropText: "Arraste PDFs ou Word aqui (em ordem)", mergeBtn: "Combinar PDFs",
    splitTitle: "Dividir PDF", splitDesc: "Separe as páginas de um PDF ou extraia um intervalo específico.",
    splitDropText: "Arraste um PDF aqui", splitExtractRange: "Extrair intervalo de páginas", splitBtn: "Dividir PDF",
    compressTitle: "Comprimir PDF", compressDesc: "Reduza o tamanho do seu arquivo PDF sem perder qualidade.",
    compressBtn: "Comprimir PDF",
    p2wTitle: "PDF para Word", p2wDesc: "Converta arquivos PDF para documentos Word (.docx) editáveis.",
    p2wDropText: "Arraste arquivos PDF aqui", p2wBtn: "Converter para Word",
    protectTitle: "Proteger PDF", protectDesc: "Adicione uma senha para proteger seu PDF.",
    protectBtn: "Proteger PDF",
    unprotectTitle: "Desproteger PDF", unprotectDesc: "Remova a senha de um PDF protegido.",
    unprotectBtn: "Desproteger PDF",
    img2pdfTitle: "Imagens para PDF", img2pdfDesc: "Converta imagens (JPG, PNG, GIF, BMP, WEBP) em um único PDF.",
    img2pdfDropText: "Arraste imagens aqui", img2pdfBtn: "Converter para PDF",
    rotateTitle: "Girar PDF", rotateDesc: "Gire as páginas do seu PDF (90°, 180°, 270°).",
    rotateBtn: "Girar PDF",
    deleteTitle: "Apagar páginas", deleteDesc: "Remova páginas específicas de um PDF. Insira os números separados por vírgulas.",
    deletePagesLabel: "Páginas para apagar (ex: 2,5,7-9):", deletePagesPlaceholder: "ex: 2,5,7-9",
    deleteBtn: "Apagar páginas",
    reorderTitle: "Ordenar páginas", reorderDesc: "Reorganize as páginas do seu PDF na ordem desejada.",
    reorderLabel: "Nova ordem (ex: 3,1,2,5,4):", reorderPlaceholder: "ex: 3,1,2,5,4",
    reorderBtn: "Reordenar páginas",
    p2jpgTitle: "PDF para JPG", p2jpgDesc: "Converta cada página do PDF em uma imagem JPG de alta qualidade.",
    p2jpgBtn: "Converter para JPG",
    watermarkTitle: "Marca d'água", watermarkDesc: "Adicione uma marca d'água de texto às páginas do seu PDF.",
    wmText: "Texto:", wmTextPlaceholder: "CONFIDENCIAL", wmOpacity: "Opacidade:",
    watermarkBtn: "Adicionar marca d'água",
    extractTitle: "Extrair Imagens", extractDesc: "Extraia todas as imagens incorporadas em um PDF.",
    extractBtn: "Extrair imagens",
    darkTitle: "PDF Modo Escuro", darkDesc: "Converta seu PDF para modo escuro para leitura noturna. Ideal para ler no celular.",
    darkBtn: "Converter para modo escuro",
    dropTextSingle: "Arraste um PDF aqui", or: "ou",
    selectFile: "Selecionar arquivo", selectFiles: "Selecionar arquivos",
    pagesLabel: "Páginas (ex: 1-3,5,7):", allPages: "todas", angle: "Ângulo:",
    password: "Senha:", passwordPlaceholder: "Digite a senha",
    currentPassword: "Senha atual:", currentPwPlaceholder: "Senha do PDF",
    splitRangePlaceholder: "ex: 1-3,5,7",
    openBtn: "Abrir", saveBtn: "Salvar",
    processing: "Processando...",
    processed: "Processado com sucesso",
    opening: "Abrindo:", saving: "Arquivo salvo:",
    fileSaved: "Arquivo salvo em:",
    errorOpening: "Erro ao abrir:", errorSaving: "Erro ao salvar:",
    errorUnknown: "Erro desconhecido", errorBackend: "Erro: não foi possível conectar ao backend",
    errorPageRange: "Informe o intervalo de páginas",
    compressToast: "Comprimido: redução de",
    resultW2p: "PDF convertido", resultMerge: "PDF combinado", resultSplit: "PDF dividido",
    resultExtractPages: "Páginas extraídas", resultCompress: "PDF comprimido", resultP2w: "Documento Word",
    resultProtect: "PDF protegido", resultUnprotect: "PDF desprotegido",
    resultImg2pdf: "PDF de imagens", resultRotate: "PDF girado", resultExtract: "Imagens extraídas",
    resultDark: "PDF modo escuro", resultDelete: "PDF recortado", resultReorder: "PDF ordenado",
    resultP2jpg: "Imagens JPG", resultWatermark: "PDF com marca d'água",
  },
};

const resultLabelKeys = {
  "office-to-pdf": "resultW2p",
  merge: "resultMerge",
  split: "resultSplit",
  compress: "resultCompress",
  "pdf-to-word": "resultP2w",
  protect: "resultProtect",
  unprotect: "resultUnprotect",
  "images-to-pdf": "resultImg2pdf",
  rotate: "resultRotate",
  "extract-images": "resultExtract",
  darkmode: "resultDark",
  "delete-pages": "resultDelete",
  "reorder-pages": "resultReorder",
  "pdf-to-jpg": "resultP2jpg",
  watermark: "resultWatermark",
};

function t(key) {
  const lang = state.lang || "es";
  return translations[lang]?.[key] || translations["es"][key] || key;
}

function applyTranslations() {
  for (const el of document.querySelectorAll("[data-i18n]")) {
    const key = el.dataset.i18n;
    el.textContent = t(key);
  }
  for (const el of document.querySelectorAll("[data-i18n-placeholder]")) {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  }
  updateThemeLabel();
}

function updateThemeLabel() {
  const label = document.getElementById("theme-label");
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  label.textContent = t(isDark ? "themeLight" : "themeDark");
}

const toolConfig = {
  "office-to-pdf": {
    endpoint: "/convert/office-to-pdf",
    accept: ".doc,.docx,.odt,.ppt,.pptx,.xls,.xlsx",
    multiple: true, extraData: null,
    resultExt: ".pdf", fileListKey: "file",
  },
  merge: {
    endpoint: "/merge/",
    accept: ".pdf,.doc,.docx,.odt",
    multiple: true, extraData: null,
    resultExt: ".pdf", fileListKey: "files",
  },
  split: {
    endpoint: null,
    accept: ".pdf",
    multiple: false, extraData: null,
    resultExt: ".zip", fileListKey: "file",
  },
  compress: {
    endpoint: "/compress/",
    accept: ".pdf",
    multiple: false, extraData: null,
    resultExt: ".pdf", fileListKey: "file",
  },
  "pdf-to-word": {
    endpoint: "/convert/pdf-to-word",
    accept: ".pdf",
    multiple: true, extraData: null,
    resultExt: ".docx", fileListKey: "file",
  },
  protect: {
    endpoint: "/protect/encrypt",
    accept: ".pdf",
    multiple: false, extraData: null,
    resultExt: ".pdf", fileListKey: "file",
  },
  unprotect: {
    endpoint: "/protect/decrypt",
    accept: ".pdf",
    multiple: false, extraData: null,
    resultExt: ".pdf", fileListKey: "file",
  },
  "images-to-pdf": {
    endpoint: "/images/to-pdf",
    accept: ".jpg,.jpeg,.png,.gif,.bmp,.tiff,.webp",
    multiple: true, extraData: null,
    resultExt: ".pdf", fileListKey: "files",
  },
  rotate: {
    endpoint: "/rotate/",
    accept: ".pdf",
    multiple: false, extraData: null,
    resultExt: ".pdf", fileListKey: "file",
  },
  "extract-images": {
    endpoint: "/extract/images",
    accept: ".pdf",
    multiple: false, extraData: null,
    resultExt: ".zip", fileListKey: "file",
  },
  darkmode: {
    endpoint: "/darkmode/",
    accept: ".pdf",
    multiple: false, extraData: null,
    resultExt: ".pdf", fileListKey: "file",
  },
  "delete-pages": {
    endpoint: "/pages/delete",
    accept: ".pdf",
    multiple: false, extraData: null,
    resultExt: ".pdf", fileListKey: "file",
  },
  "reorder-pages": {
    endpoint: "/pages/reorder",
    accept: ".pdf",
    multiple: false, extraData: null,
    resultExt: ".pdf", fileListKey: "file",
  },
  "pdf-to-jpg": {
    endpoint: "/convert/pdf-to-jpg",
    accept: ".pdf",
    multiple: false, extraData: null,
    resultExt: ".zip", fileListKey: "file",
  },
  watermark: {
    endpoint: "/watermark/",
    accept: ".pdf",
    multiple: false, extraData: null,
    resultExt: ".pdf", fileListKey: "file",
  },
};

async function init() {
  try {
    if (window.electronAPI) {
      backendUrl = await window.electronAPI.getBackendUrl();
      backendAuthToken = await window.electronAPI.getAuthToken();
    }
    await fetch(`${backendUrl}/health`);
  } catch {
    showToast(t("errorBackend"), true);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  init();
  initLang();
  initTheme();
  applyTranslations();

  for (const btn of document.querySelectorAll(".tool-btn")) {
    btn.addEventListener("click", () => switchTool(btn.dataset.tool));
  }

  for (const dz of document.querySelectorAll(".dropzone")) {
    dz.addEventListener("dragover", (e) => { e.preventDefault(); dz.classList.add("dragover"); });
    dz.addEventListener("dragleave", () => dz.classList.remove("dragover"));
    dz.addEventListener("drop", (e) => {
      e.preventDefault();
      dz.classList.remove("dragover");
      addFiles(dz.id.replace("dropzone-", ""), e.dataTransfer.files);
    });
    dz.addEventListener("click", (e) => {
      if (e.target.closest("button")) return;
      const tool = dz.id.replace("dropzone-", "");
      createFileInput(tool);
    });
  }

  for (const btn of document.querySelectorAll(".select-files-btn")) {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const panel = btn.closest(".tool-panel");
      if (!panel) return;
      createFileInput(panel.id.replace("panel-", ""));
    });
  }

  for (const btn of document.querySelectorAll(".process-btn")) {
    btn.addEventListener("click", processCurrentTool);
  }

  document.getElementById("split-extract-range")?.addEventListener("change", function () {
    document.getElementById("split-range").style.display = this.checked ? "inline-block" : "none";
  });

  switchTool("office-to-pdf");
});

function createFileInput(tool) {
  const config = toolConfig[tool];
  if (!config) return;
  const input = document.createElement("input");
  input.type = "file";
  input.accept = config.accept || "";
  input.multiple = config.multiple !== false;
  input.onchange = () => { if (input.files.length) addFiles(tool, input.files); };
  input.click();
}

function initLang() {
  const saved = localStorage.getItem("lang") || "es";
  state.lang = saved;
  updateLangButtons();

  for (const btn of document.querySelectorAll(".lang-btn")) {
    btn.addEventListener("click", () => {
      state.lang = btn.dataset.lang;
      localStorage.setItem("lang", state.lang);
      updateLangButtons();
      applyTranslations();
    });
  }
}

function updateLangButtons() {
  for (const btn of document.querySelectorAll(".lang-btn")) {
    btn.classList.toggle("active", btn.dataset.lang === state.lang);
  }
}

function switchTool(tool) {
  state.currentTool = tool;
  for (const btn of document.querySelectorAll(".tool-btn")) {
    btn.classList.toggle("active", btn.dataset.tool === tool);
  }
  for (const panel of document.querySelectorAll(".tool-panel")) {
    panel.classList.toggle("active", panel.id === `panel-${tool}`);
  }
  updateProcessButton(tool);
}

function initTheme() {
  const toggle = document.getElementById("theme-toggle");
  const icon = document.getElementById("theme-icon");
  const saved = localStorage.getItem("theme");
  if (saved === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    icon.textContent = "☀️";
  }
  updateThemeLabel();

  toggle.addEventListener("click", () => {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    if (isDark) {
      document.documentElement.removeAttribute("data-theme");
      icon.textContent = "🌙";
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
      icon.textContent = "☀️";
      localStorage.setItem("theme", "dark");
    }
    updateThemeLabel();
  });
}

function addFiles(tool, files) {
  const config = toolConfig[tool];
  if (!config) return;
  if (!config.multiple) {
    state.files[tool] = [files[0]];
  } else {
    if (!state.files[tool]) state.files[tool] = [];
    for (const f of files) state.files[tool].push(f);
  }
  renderFileList(tool);
  updateProcessButton(tool);
}

function removeFile(tool, index) {
  if (!state.files[tool]) return;
  state.files[tool].splice(index, 1);
  if (state.files[tool].length === 0) delete state.files[tool];
  renderFileList(tool);
  updateProcessButton(tool);
}

function renderFileList(tool) {
  const listEl = document.getElementById(`file-list-${tool}`);
  if (!listEl) return;
  const files = state.files[tool] || [];
  listEl.innerHTML = files.map((f, i) =>
    `<div class="file-item">
      <span class="name" title="${escHtml(f.name)}">${escHtml(f.name)}</span>
      <span style="color:var(--text-muted);font-size:12px;margin-right:8px;">${formatSize(f.size)}</span>
      <button class="remove" data-index="${i}">✕</button>
    </div>`
  ).join("");
  for (const btn of listEl.querySelectorAll(".remove")) {
    btn.addEventListener("click", () => removeFile(tool, parseInt(btn.dataset.index)));
  }
}

function updateProcessButton(tool) {
  const t = tool || state.currentTool;
  const files = state.files[t] || [];
  const panel = document.getElementById(`panel-${t}`);
  if (!panel) return;
  const btn = panel.querySelector(".process-btn");
  if (!btn) return;
  let enabled = files.length > 0;
  if (t === "protect" || t === "unprotect") {
    const pwId = t === "protect" ? "protect-password" : "unprotect-password";
    const pw = document.getElementById(pwId)?.value || "";
    enabled = files.length > 0 && pw.length > 0;
  }
  btn.disabled = !enabled;
}

["protect-password", "unprotect-password"].forEach((id) => {
  const el = document.getElementById(id);
  if (el) el.addEventListener("input", () => updateProcessButton(state.currentTool));
});

async function processCurrentTool() {
  const tool = state.currentTool;
  const config = toolConfig[tool];
  const files = state.files[tool] || [];
  if (!files.length) return;

  const form = new FormData();

  if (tool === "split") {
    const useRange = document.getElementById("split-extract-range")?.checked;
    if (useRange) {
      const range = document.getElementById("split-range")?.value;
      if (!range) { showToast(t("errorPageRange"), true); return; }
      form.append("file", files[0]);
      form.append("pages", range);
      config.endpoint = "/split/extract";
      config.resultExt = ".pdf";
    } else {
      form.append("file", files[0]);
      config.endpoint = "/split/";
      config.resultExt = ".zip";
    }
  } else if (config.multiple === false || config.fileListKey !== "files") {
    for (const f of files) form.append(config.fileListKey, f, f.name);
  } else {
    for (const f of files) form.append("files", f, f.name);
  }

  if (tool === "protect") {
    form.append("password", document.getElementById("protect-password")?.value || "");
  }
  if (tool === "unprotect") {
    form.append("password", document.getElementById("unprotect-password")?.value || "");
  }
  if (tool === "rotate") {
    const pages = document.getElementById("rotate-pages")?.value || "";
    form.append("pages", pages || Array.from({ length: 999 }, (_, i) => i + 1).join(","));
    form.append("angle", document.getElementById("rotate-angle")?.value || "90");
  }
  if (tool === "delete-pages") {
    const pages = document.getElementById("delete-pages-input")?.value;
    if (!pages) { showToast(t("errorPageRange"), true); return; }
    form.append("pages", pages);
  }
  if (tool === "reorder-pages") {
    const order = document.getElementById("reorder-input")?.value;
    if (!order) { showToast(t("errorPageRange"), true); return; }
    form.append("order", order);
  }
  if (tool === "watermark") {
    form.append("text", document.getElementById("watermark-text")?.value || "CONFIDENCIAL");
    form.append("opacity", document.getElementById("watermark-opacity")?.value || "0.12");
  }

  showLoading(true);
  try {
    const url = `${backendUrl}${config.endpoint}`;
    const resp = await fetch(url, {
      method: "POST",
      body: form,
      headers: backendAuthToken ? { "X-Auth-Token": backendAuthToken } : {},
    });

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({ error: t("errorUnknown") }));
      showToast(err.error || err.detail || t("errorUnknown"), true);
      return;
    }

    const blob = await resp.blob();
    const cd = resp.headers.get("content-disposition") || "";
    let filename = "";
    const m = cd.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
    if (m) filename = m[1].replace(/['"]/g, "");
    if (!filename) filename = tool + config.resultExt;

    const compRatio = resp.headers.get("x-compression-ratio");
    if (compRatio) showToast(`${t("compressToast")} ${compRatio}`);

    const resultKey = resultLabelKeys[tool] || "resultW2p";
    const panel = document.getElementById(`panel-${tool}`);
    const resultArea = panel.querySelector(".result-area");
    const safeName = escHtml(filename);
    resultArea.innerHTML = `
      <div class="result-card">
        <div class="info">
          <span class="icon">✅</span>
          <span>${t(resultKey)}: <strong>${safeName}</strong> (${formatSize(blob.size)})</span>
        </div>
        <div class="result-actions">
          <button class="btn-open">${t("openBtn")}</button>
          <button class="btn-download">${t("saveBtn")}</button>
        </div>
      </div>
    `;
    resultArea.querySelector(".btn-download").addEventListener("click", () => downloadBlob(blob, filename));
    resultArea.querySelector(".btn-open").addEventListener("click", () => openBlob(blob, filename));

    showToast(t("processed"));
  } catch (err) {
    showToast(t("errorUnknown"), true);
  } finally {
    showLoading(false);
  }
}

async function downloadBlob(blob, filename) {
  if (window.electronAPI) {
    const savePath = await window.electronAPI.selectSavePath(filename);
    if (!savePath) return;
    const buffer = await blob.arrayBuffer();
    const result = await window.electronAPI.saveFile(savePath, buffer);
    if (result.success) {
      showToast(`${t("saving")} ${savePath}`);
    } else {
      showToast(`${t("errorSaving")} ${result.error}`, true);
    }
  } else {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  }
}

async function openBlob(blob, filename) {
  try {
    if (window.electronAPI) {
      const buffer = await blob.arrayBuffer();
      const result = await window.electronAPI.openFile(buffer, filename);
      if (result.success) {
        showToast(t("fileSaved") + " " + result.path);
      } else {
        showToast(`${t("errorOpening")} ${result.error}`, true);
      }
    } else {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 60000);
      showToast(t("fileSaved"));
    }
  } catch (err) {
    showToast(`${t("errorOpening")} ${err.message}`, true);
  }
}

function showLoading(show) {
  document.getElementById("loading-overlay").classList.toggle("show", show);
}

function showToast(msg, isError) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.className = "toast show" + (isError ? " error" : "");
  setTimeout(() => toast.classList.remove("show"), 3000);
}

function formatSize(bytes) {
  if (!bytes) return "0 B";
  const u = ["B", "KB", "MB", "GB"];
  let i = 0, s = bytes;
  while (s >= 1024 && i < u.length - 1) { s /= 1024; i++; }
  return `${s.toFixed(i > 0 ? 1 : 0)} ${u[i]}`;
}

function escHtml(str) {
  const d = document.createElement("div");
  d.textContent = str;
  return d.innerHTML;
}

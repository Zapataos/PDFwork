# PDFWorks

Aplicación de escritorio para manipulación de PDFs — convertir Office a PDF, combinar, dividir, comprimir, proteger, rotar, marcas de agua y más. Construida con Electron + FastAPI.

## Funcionalidades

- Office a PDF (Word, PowerPoint, Excel)
- PDF a Word
- PDF a JPG
- Imágenes a PDF
- Combinar PDFs
- Dividir PDF
- Eliminar y reordenar páginas
- Comprimir PDF
- Proteger / Desproteger con contraseña
- Rotar páginas
- Marca de agua de texto
- Extraer imágenes
- Modo oscuro PDF

Español, inglés y portugués.

## Requisitos

| Dependencia   | Uso                       |
|---------------|---------------------------|
| Node.js >= 18 | Electron + npm            |
| Python >= 3.10| Backend FastAPI           |
| LibreOffice   | Conversiones Office → PDF |

En **Windows**, LibreOffice debe estar en el PATH del sistema.  
En **macOS/Linux** se instala con el gestor de paquetes (`brew install libreoffice`, `apt install libreoffice`).

## Instalación

```bash
git clone git@github.com:Zapataos/PDFwork.git
cd PDFwork
npm install
```

### Entorno virtual Python

**Linux / macOS**
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r backend/requirements.txt
```

**Windows (PowerShell)**
```powershell
python -m venv venv
venv\Scripts\Activate.ps1
pip install -r backend\requirements.txt
```

## Ejecutar

```bash
npm start
```

Esto inicia el backend FastAPI en `127.0.0.1:17300` y lanza la ventana de Electron automáticamente.

### Acceso directo (Linux)

El script `pdfwork.sh` lanza la aplicación con un solo clic:

```bash
chmod +x pdfwork.sh
./pdfwork.sh
```

Creá un acceso directo `.desktop` para el menú de aplicaciones:

```ini
# ~/.local/share/applications/pdfwork.desktop
[Desktop Entry]
Name=PDFWorks
Comment=Editor de PDFs — convertir, combinar, comprimir y más
Exec=/ruta/a/PDFwork/pdfwork.sh
Icon=/ruta/a/PDFwork/assets/icon.png
Terminal=false
Type=Application
Categories=Office;
```

Reemplazá `/ruta/a/PDFwork` por la ubicación real donde clonaste el proyecto.

### Solo backend (desarrollo)

```bash
# Linux/macOS
source venv/bin/activate && python backend/server.py

# Windows
venv\Scripts\activate && python backend\server.py
```

## Generar ejecutable (.exe / .AppImage / .dmg)

Instalá `electron-builder` y empaquetá:

```bash
npm install --save-dev electron-builder
npx electron-builder build
```

Requiere que el entorno virtual `venv/` esté presente junto al ejecutable o empaquetado.

## Estructura

```
.
├── backend/
│   ├── server.py         # API FastAPI
│   ├── routes/           # Endpoints: convert, merge, split, compress...
│   ├── utils.py          # Utilidades (uploads, resultados, LibreOffice)
│   ├── results/          # Archivos generados (gitignored)
│   └── uploads/          # Temporales (gitignored)
├── renderer/
│   ├── index.html
│   ├── app.js
│   └── style.css
├── main.js               # Proceso principal de Electron
├── preload.js            # Context bridge seguro
├── pdfwork.sh            # Lanzador rápido Linux
└── assets/
```

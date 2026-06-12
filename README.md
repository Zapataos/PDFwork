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

- Node.js >= 18
- Python >= 3.10
- LibreOffice (para conversiones Office)

## Instalación

```bash
# Clonar e instalar dependencias Node
npm install

# Crear entorno virtual e instalar dependencias Python
python3 -m venv venv
source venv/bin/activate
pip install -r backend/requirements.txt
```

## Ejecutar

### Desarrollo

```bash
npm run dev
```

Esto inicia el backend FastAPI y luego lanza la ventana de Electron.

### Solo backend

```bash
source venv/bin/activate
python backend/server.py
```

## Estructura

```
.
├── backend/          # API FastAPI (rutas por funcionalidad)
│   ├── server.py     # Punto de entrada
│   ├── routes/       # Endpoints: convert, merge, split, compress, etc.
│   └── utils.py      # Utilidades (uploads, resultados, LibreOffice)
├── renderer/         # Frontend Electron
│   ├── index.html
│   ├── app.js
│   └── style.css
├── main.js           # Proceso principal de Electron
├── preload.js        # Preload script (contextBridge)
└── assets/
```

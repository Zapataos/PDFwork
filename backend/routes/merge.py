from pathlib import Path
from fastapi import APIRouter, UploadFile, File
from fastapi.responses import FileResponse
from pypdf import PdfWriter, PdfReader

from utils import save_upload, result_path, cleanup_files, libreoffice_convert, UPLOAD_DIR, MAX_FILES, validate_file_size

router = APIRouter(prefix="/merge", tags=["merge"])

PDF_EXT = {".pdf"}
WORD_EXT = {".doc", ".docx", ".odt"}


@router.post("/")
async def merge_pdfs(files: list[UploadFile] = File(...)):
    if len(files) > MAX_FILES:
        return {"error": f"Demasiados archivos (max {MAX_FILES})"}

    temp_files = []
    pdf_paths = []

    for f in files:
        ext = Path(f.filename).suffix.lower()
        if ext not in PDF_EXT and ext not in WORD_EXT:
            return {"error": f"'{f.filename}': formato no soportado. Usa PDF, DOCX o DOC"}

        validate_file_size(f)

        saved = save_upload(f, ext)
        temp_files.append(saved)

        if ext in WORD_EXT:
            pdf = libreoffice_convert(saved, UPLOAD_DIR, "pdf")
            pdf_paths.append(pdf)
            temp_files.append(pdf)
        else:
            pdf_paths.append(saved)

    try:
        writer = PdfWriter()
        for p in pdf_paths:
            reader = PdfReader(str(p))
            for page in reader.pages:
                writer.add_page(page)

        out = result_path(".pdf")
        with open(out, "wb") as f:
            writer.write(f)

        return FileResponse(out, media_type="application/pdf",
                            filename="combinado.pdf")
    finally:
        cleanup_files(*temp_files)

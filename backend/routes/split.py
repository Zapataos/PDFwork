import zipfile
import os
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import FileResponse
from pypdf import PdfReader, PdfWriter

from utils import save_upload, result_path, cleanup_files, safe_stem, validate_pdf, validate_file_size, parse_page_range, MAX_PAGES

router = APIRouter(prefix="/split", tags=["split"])


@router.post("/")
async def split_pdf(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        return {"error": "Solo se aceptan archivos PDF"}

    validate_file_size(file)
    validate_pdf(file)

    input_path = save_upload(file)
    try:
        reader = PdfReader(str(input_path))
        total = len(reader.pages)
        if total == 1:
            return {"error": "El PDF tiene una sola pagina"}
        if total > MAX_PAGES:
            return {"error": f"El PDF tiene demasiadas paginas (max {MAX_PAGES})"}

        pdf_files = []
        for i in range(total):
            writer = PdfWriter()
            writer.add_page(reader.pages[i])
            out = result_path(".pdf")
            with open(out, "wb") as f:
                writer.write(f)
            pdf_files.append(out)

        zip_path = result_path(".zip")
        stem = safe_stem(file.filename)
        with zipfile.ZipFile(str(zip_path), "w") as zf:
            for i, pdf in enumerate(pdf_files, 1):
                zf.write(str(pdf), arcname=f"{stem}_pagina_{i}.pdf")

        cleanup_files(*pdf_files)
        return FileResponse(zip_path, media_type="application/zip",
                            filename=stem + "_dividido.zip")
    finally:
        cleanup_files(input_path)


@router.post("/extract")
async def extract_pages(
    file: UploadFile = File(...),
    pages: str = Form(...),
):
    if not file.filename.lower().endswith(".pdf"):
        return {"error": "Solo se aceptan archivos PDF"}

    validate_file_size(file)
    validate_pdf(file)

    input_path = save_upload(file)
    try:
        reader = PdfReader(str(input_path))
        total = len(reader.pages)

        selected = parse_page_range(pages, total)
        if not selected:
            return {"error": "No se seleccionaron paginas validas"}

        writer = PdfWriter()
        for i in selected:
            writer.add_page(reader.pages[i])

        out = result_path(".pdf")
        with open(out, "wb") as f:
            writer.write(f)

        return FileResponse(out, media_type="application/pdf",
                            filename=safe_stem(file.filename) + "_extraido.pdf")
    finally:
        cleanup_files(input_path)

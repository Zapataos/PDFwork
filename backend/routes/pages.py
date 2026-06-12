from pathlib import Path
from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import FileResponse
from pypdf import PdfReader, PdfWriter

from utils import save_upload, result_path, cleanup_files, safe_stem, validate_pdf, validate_file_size, parse_page_range

router = APIRouter(prefix="/pages", tags=["pages"])


@router.post("/delete")
async def delete_pages(
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

        to_remove = parse_page_range(pages, total)
        if not to_remove:
            return {"error": "No se especificaron paginas validas para eliminar"}

        writer = PdfWriter()
        for i in range(total):
            if i not in to_remove:
                writer.add_page(reader.pages[i])

        if len(writer.pages) == 0:
            return {"error": "No quedan paginas despues de eliminar"}

        out = result_path(".pdf")
        with open(out, "wb") as f:
            writer.write(f)

        return FileResponse(out, media_type="application/pdf",
                            filename=safe_stem(file.filename) + "_recortado.pdf")
    finally:
        cleanup_files(input_path)


@router.post("/reorder")
async def reorder_pages(
    file: UploadFile = File(...),
    order: str = Form(...),
):
    if not file.filename.lower().endswith(".pdf"):
        return {"error": "Solo se aceptan archivos PDF"}

    validate_file_size(file)
    validate_pdf(file)

    input_path = save_upload(file)
    try:
        reader = PdfReader(str(input_path))
        total = len(reader.pages)

        new_order = []
        for part in order.split(","):
            part = part.strip()
            try:
                n = int(part)
                if 1 <= n <= total:
                    new_order.append(n - 1)
            except ValueError:
                pass

        if not new_order:
            return {"error": "No se especifico un orden valido"}

        writer = PdfWriter()
        for i in new_order:
            writer.add_page(reader.pages[i])

        out = result_path(".pdf")
        with open(out, "wb") as f:
            writer.write(f)

        return FileResponse(out, media_type="application/pdf",
                            filename=safe_stem(file.filename) + "_ordenado.pdf")
    finally:
        cleanup_files(input_path)

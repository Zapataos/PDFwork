from pathlib import Path
from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import FileResponse
from pypdf import PdfReader, PdfWriter

from utils import save_upload, result_path, cleanup_files, safe_stem, validate_pdf, validate_file_size, parse_page_range

router = APIRouter(prefix="/rotate", tags=["rotate"])


@router.post("/")
async def rotate_pdf(
    file: UploadFile = File(...),
    pages: str = Form(...),
    angle: int = Form(..., ge=-360, le=360),
):
    if not file.filename.lower().endswith(".pdf"):
        return {"error": "Solo se aceptan archivos PDF"}

    if angle % 90 != 0:
        return {"error": "El angulo debe ser multiplo de 90 (90, 180, 270)"}

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
        for i in range(total):
            page = reader.pages[i]
            if i in selected:
                page.rotate(angle)
            writer.add_page(page)

        out = result_path(".pdf")
        with open(out, "wb") as f:
            writer.write(f)

        return FileResponse(out, media_type="application/pdf",
                            filename=f"rotado_{safe_stem(file.filename)}.pdf")
    finally:
        cleanup_files(input_path)

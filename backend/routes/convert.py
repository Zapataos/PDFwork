import zipfile
import os
from pathlib import Path
from fastapi import APIRouter, UploadFile, File
from fastapi.responses import FileResponse
import fitz

from utils import save_upload, result_path, cleanup_files, libreoffice_convert, RESULT_DIR, safe_stem, safe_basename, validate_pdf, validate_file_size, MAX_PAGES

router = APIRouter(prefix="/convert", tags=["convert"])

OFFICE_EXT = {".doc", ".docx", ".odt", ".ppt", ".pptx", ".xls", ".xlsx"}


@router.post("/office-to-pdf")
async def office_to_pdf(file: UploadFile = File(...)):
    suffix = Path(file.filename).suffix.lower()
    if suffix not in OFFICE_EXT:
        return {"error": f"Formato no soportado: {suffix}"}

    validate_file_size(file)

    input_path = save_upload(file, suffix)
    try:
        pdf_path = libreoffice_convert(input_path, RESULT_DIR, "pdf")
        return FileResponse(pdf_path, media_type="application/pdf",
                            filename=safe_stem(file.filename) + ".pdf")
    finally:
        cleanup_files(input_path)


@router.post("/pdf-to-word")
async def pdf_to_word(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        return {"error": "Solo se aceptan archivos PDF"}

    validate_file_size(file)
    validate_pdf(file)

    input_path = save_upload(file)
    try:
        from pdf2docx import Converter
        out_path = result_path(".docx")
        cv = Converter(str(input_path))
        cv.convert(str(out_path), start=0, end=None)
        cv.close()
        return FileResponse(out_path,
                            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                            filename=safe_stem(file.filename) + ".docx")
    finally:
        cleanup_files(input_path)


@router.post("/pdf-to-jpg")
async def pdf_to_jpg(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        return {"error": "Solo se aceptan archivos PDF"}

    validate_file_size(file)
    validate_pdf(file)

    input_path = save_upload(file)
    temp_images = []
    try:
        doc = fitz.open(str(input_path))
        page_count = len(doc)
        if page_count > MAX_PAGES:
            doc.close()
            return {"error": f"El PDF tiene demasiadas paginas (max {MAX_PAGES})"}

        for page_num in range(page_count):
            page = doc[page_num]
            mat = fitz.Matrix(2.0, 2.0)
            pix = page.get_pixmap(matrix=mat)
            img_path = RESULT_DIR / f"page_{page_num + 1}.jpg"
            pix.pil_save(str(img_path), format="JPEG", quality=92, optimize=True)
            temp_images.append(img_path)
        doc.close()

        if len(temp_images) == 1:
            img = temp_images[0]
            return FileResponse(img, media_type="image/jpeg",
                                filename=safe_stem(file.filename) + ".jpg")

        zip_path = result_path(".zip")
        with zipfile.ZipFile(str(zip_path), "w") as zf:
            for img in temp_images:
                zf.write(str(img), arcname=safe_basename(img.name))

        cleanup_files(*temp_images)
        return FileResponse(zip_path, media_type="application/zip",
                            filename=safe_stem(file.filename) + "_jpg.zip")
    finally:
        cleanup_files(input_path)

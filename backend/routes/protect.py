from pathlib import Path
from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import FileResponse
from pypdf import PdfReader, PdfWriter

from utils import save_upload, result_path, cleanup_files, safe_stem, validate_pdf, validate_file_size

router = APIRouter(prefix="/protect", tags=["protect"])


@router.post("/encrypt")
async def encrypt_pdf(
    file: UploadFile = File(...),
    password: str = Form(...),
):
    if not file.filename.lower().endswith(".pdf"):
        return {"error": "Solo se aceptan archivos PDF"}
    if not password:
        return {"error": "La contraseña no puede estar vacia"}

    validate_file_size(file)
    validate_pdf(file)

    input_path = save_upload(file)
    try:
        reader = PdfReader(str(input_path))
        writer = PdfWriter()

        for page in reader.pages:
            writer.add_page(page)

        writer.encrypt(password, algorithm="AES-256")

        out = result_path(".pdf")
        with open(out, "wb") as f:
            writer.write(f)

        return FileResponse(out, media_type="application/pdf",
                            filename=f"protegido_{safe_stem(file.filename)}.pdf")
    finally:
        cleanup_files(input_path)


@router.post("/decrypt")
async def decrypt_pdf(
    file: UploadFile = File(...),
    password: str = Form(...),
):
    if not file.filename.lower().endswith(".pdf"):
        return {"error": "Solo se aceptan archivos PDF"}
    if not password:
        return {"error": "La contraseña no puede estar vacia"}

    validate_file_size(file)
    validate_pdf(file)

    input_path = save_upload(file)
    try:
        reader = PdfReader(str(input_path))

        if reader.is_encrypted:
            result = reader.decrypt(password)
            if result == 0:
                return {"error": "Contraseña incorrecta"}

        writer = PdfWriter()
        for page in reader.pages:
            writer.add_page(page)

        out = result_path(".pdf")
        with open(out, "wb") as f:
            writer.write(f)

        return FileResponse(out, media_type="application/pdf",
                            filename=f"desprotegido_{safe_stem(file.filename)}.pdf")
    finally:
        cleanup_files(input_path)

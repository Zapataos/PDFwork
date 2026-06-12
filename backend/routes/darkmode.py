import os
from pathlib import Path
from fastapi import APIRouter, UploadFile, File
from fastapi.responses import FileResponse
import fitz
from PIL import Image, ImageOps
import img2pdf

from utils import save_upload, result_path, cleanup_files, RESULT_DIR, safe_stem, validate_pdf, validate_file_size, MAX_PAGES

router = APIRouter(prefix="/darkmode", tags=["darkmode"])


@router.post("/")
async def dark_mode_pdf(file: UploadFile = File(...)):
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
            img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
            img = ImageOps.invert(img)
            img_path = RESULT_DIR / f"dark_p{page_num}.png"
            img.save(str(img_path), "PNG")
            temp_images.append(img_path)
        doc.close()

        out = result_path(".pdf")
        with open(out, "wb") as f:
            f.write(img2pdf.convert([str(p) for p in temp_images]))

        return FileResponse(out, media_type="application/pdf",
                            filename=f"dark_{safe_stem(file.filename)}.pdf")
    finally:
        cleanup_files(input_path, *temp_images)

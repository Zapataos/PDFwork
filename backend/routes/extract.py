import zipfile
import os
from pathlib import Path
from fastapi import APIRouter, UploadFile, File
from fastapi.responses import FileResponse
from pypdf import PdfReader

import re

from utils import save_upload, result_path, cleanup_files, RESULT_DIR, safe_stem, safe_basename, validate_pdf, validate_file_size

router = APIRouter(prefix="/extract", tags=["extract"])


@router.post("/images")
async def extract_images(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        return {"error": "Solo se aceptan archivos PDF"}

    validate_file_size(file)
    validate_pdf(file)

    input_path = save_upload(file)
    try:
        reader = PdfReader(str(input_path))
        extracted = []
        img_count = 0

        for page_num, page in enumerate(reader.pages):
            for img_obj in page.images:
                img_count += 1
                ext = img_obj.name.rsplit(".", 1)[-1] if "." in img_obj.name else "png"
                ext = re.sub(r"[^a-zA-Z0-9]", "", ext)[:10] or "png"
                out_img = RESULT_DIR / f"img_p{page_num + 1}_{img_count}.{ext}"
                with open(out_img, "wb") as f:
                    f.write(img_obj.data)
                extracted.append(out_img)

        if not extracted:
            return {"error": "No se encontraron imagenes en el PDF"}

        if len(extracted) == 1:
            img = extracted[0]
            return FileResponse(img, media_type="image/png",
                                filename=safe_basename(img.name))

        zip_path = result_path(".zip")
        with zipfile.ZipFile(str(zip_path), "w") as zf:
            for img in extracted:
                safe_name = safe_basename(img.name)
                zf.write(str(img), arcname=safe_name)

        cleanup_files(*extracted)
        return FileResponse(zip_path, media_type="application/zip",
                            filename=safe_stem(file.filename) + "_imagenes.zip")
    finally:
        cleanup_files(input_path)

from pathlib import Path
from fastapi import APIRouter, UploadFile, File
from fastapi.responses import FileResponse
from PIL import Image
from pypdf import PdfWriter
import img2pdf

from utils import save_upload, result_path, cleanup_files, UPLOAD_DIR, MAX_FILES, validate_file_size

router = APIRouter(prefix="/images", tags=["images"])

IMG_EXT = {".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tiff", ".webp"}


@router.post("/to-pdf")
async def images_to_pdf(files: list[UploadFile] = File(...)):
    if len(files) > MAX_FILES:
        return {"error": f"Demasiados archivos (max {MAX_FILES})"}

    img_paths = []
    for f in files:
        ext = Path(f.filename).suffix.lower()
        if ext not in IMG_EXT:
            return {"error": f"'{f.filename}' no es una imagen soportada"}
        validate_file_size(f)
        img_paths.append(save_upload(f, ext))

    try:
        out = result_path(".pdf")
        with open(out, "wb") as fp:
            fp.write(img2pdf.convert([str(p) for p in img_paths]))

        return FileResponse(out, media_type="application/pdf",
                            filename="imagenes.pdf")
    finally:
        cleanup_files(*img_paths)

import os
import io
from pathlib import Path
from fastapi import APIRouter, UploadFile, File
from fastapi.responses import FileResponse
from PIL import Image
import pikepdf

from utils import save_upload, result_path, cleanup_files, safe_stem, validate_pdf, validate_file_size, logger

router = APIRouter(prefix="/compress", tags=["compress"])


@router.post("/")
async def compress_pdf(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        return {"error": "Solo se aceptan archivos PDF"}

    validate_file_size(file)
    validate_pdf(file)

    input_path = save_upload(file)
    try:
        pdf = pikepdf.open(str(input_path))
        _compress_images(pdf)
        pdf.remove_unreferenced_resources()

        out = result_path(".pdf")
        pdf.save(
            str(out),
            compress_streams=True,
            object_stream_mode=pikepdf.ObjectStreamMode.generate,
            stream_decode_level=pikepdf.StreamDecodeLevel.specialized,
        )
        pdf.close()

        orig_size = os.path.getsize(str(input_path))
        comp_size = os.path.getsize(str(out))
        ratio = (1 - comp_size / orig_size) * 100 if orig_size > 0 else 0

        return FileResponse(
            out, media_type="application/pdf",
            filename=f"comprimido_{safe_stem(file.filename)}.pdf",
            headers={"X-Compression-Ratio": f"{ratio:.1f}%"}
        )
    finally:
        cleanup_files(input_path)


def _compress_images(pdf):
    for page in pdf.pages:
        for name, img in page.images.items():
            try:
                raw = img.read_raw_bytes()
                pil_img = _compress_pil(raw)
                if pil_img is None:
                    continue

                if pil_img.mode in ("RGBA", "LA", "P"):
                    ext = ".png"
                    buf = io.BytesIO()
                    pil_img.save(buf, format="PNG", optimize=True)
                else:
                    ext = ".jpg"
                    pil_img = pil_img.convert("RGB")
                    buf = io.BytesIO()
                    pil_img.save(buf, format="JPEG", quality=60, optimize=True)

                img.write(buf.getvalue(), filter=pikepdf.Name.DCTDecode if ext == ".jpg" else pikepdf.Name.FlateDecode)
            except Exception as e:
                logger.warning("Failed to compress image '%s': %s", name, e)


def _compress_pil(raw):
    try:
        img = Image.open(io.BytesIO(raw))
        w, h = img.size
        if w * h > 2500000:
            scale = (2500000 / (w * h)) ** 0.5
            img = img.resize((int(w * scale), int(h * scale)), Image.LANCZOS)
        return img
    except Exception as e:
        logger.warning("Failed to open image for compression: %s", e)
        return None

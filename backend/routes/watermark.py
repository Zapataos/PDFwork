import re
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import FileResponse
from pypdf import PdfReader, PdfWriter
import io
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import Color
from reportlab.lib.utils import ImageReader

from utils import save_upload, result_path, cleanup_files, safe_stem, validate_pdf, validate_file_size

router = APIRouter(prefix="/watermark", tags=["watermark"])


@router.post("/")
async def add_watermark(
    file: UploadFile = File(...),
    text: str = Form(...),
    opacity: float = Form(0.15, ge=0.0, le=1.0),
    font_size: int = Form(60, ge=4, le=500),
    rotation: int = Form(35),
    color: str = Form("808080"),
):
    if not file.filename.lower().endswith(".pdf"):
        return {"error": "Solo se aceptan archivos PDF"}

    validate_file_size(file)
    validate_pdf(file)

    if not re.match(r"^#?[0-9a-fA-F]{6}$", color):
        raise HTTPException(400, "Color must be a valid hex (e.g. 808080)")

    input_path = save_upload(file)
    try:
        reader = PdfReader(str(input_path))
        watermark_pdf = _make_watermark(
            text, reader.pages[0].mediabox, opacity, font_size, rotation, color
        )
        watermark_page = PdfReader(watermark_pdf).pages[0]

        writer = PdfWriter()
        for page in reader.pages:
            page.merge_page(watermark_page)
            writer.add_page(page)

        out = result_path(".pdf")
        with open(out, "wb") as f:
            writer.write(f)

        return FileResponse(out, media_type="application/pdf",
                            filename=f"wm_{safe_stem(file.filename)}.pdf")
    finally:
        cleanup_files(input_path)


def _make_watermark(text, mediabox, opacity, font_size, rotation, color_hex):
    w = float(mediabox.width)
    h = float(mediabox.height)
    buf = io.BytesIO()

    r, g, b = _hex_to_rgb(color_hex)
    c = Color(r, g, b, alpha=opacity)

    c_pdf = canvas.Canvas(buf, pagesize=(w, h))
    c_pdf.setFont("Helvetica-Bold", font_size)
    c_pdf.setFillColor(c, alpha=opacity)
    c_pdf.saveState()
    c_pdf.translate(w / 2, h / 2)
    c_pdf.rotate(rotation)
    c_pdf.drawCentredString(0, 0, text)
    c_pdf.restoreState()
    c_pdf.save()
    buf.seek(0)
    return buf


def _hex_to_rgb(hex_str):
    h = hex_str.lstrip("#")
    return int(h[0:2], 16) / 255, int(h[2:4], 16) / 255, int(h[4:6], 16) / 255

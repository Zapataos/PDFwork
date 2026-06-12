import os
import re
import uuid
import shutil
import subprocess
import secrets
import logging
from pathlib import Path
from fastapi import UploadFile, HTTPException

logging.basicConfig(level=logging.INFO, format="[backend] %(levelname)s %(message)s")
logger = logging.getLogger(__name__)

BASE_DIR = Path(__file__).resolve().parent
UPLOAD_DIR = BASE_DIR / "uploads"
RESULT_DIR = BASE_DIR / "results"

MAX_UPLOAD_SIZE = 200 * 1024 * 1024
MAX_FILES = 50
MAX_PAGES = 500
MAX_PAGE_RANGE = 10000


def generate_auth_token():
    return secrets.token_urlsafe(32)


def ensure_dirs():
    UPLOAD_DIR.mkdir(exist_ok=True)
    RESULT_DIR.mkdir(exist_ok=True)


def safe_stem(filename):
    return re.sub(r"[\\/]", "_", Path(filename).stem)


def safe_basename(name):
    return os.path.basename(name) or "unknown"


def validate_pdf(file: UploadFile):
    header = file.file.read(5)
    file.file.seek(0)
    if header != b"%PDF-":
        raise HTTPException(400, "Not a valid PDF file")
    return True


def validate_file_size(file: UploadFile):
    file.file.seek(0, 2)
    size = file.file.tell()
    file.file.seek(0)
    if size > MAX_UPLOAD_SIZE:
        raise HTTPException(413, f"File too large (max {MAX_UPLOAD_SIZE // (1024*1024)} MB)")


def save_upload(upload_file, suffix=None) -> Path:
    ext = suffix or Path(upload_file.filename).suffix
    file_id = uuid.uuid4().hex
    filepath = UPLOAD_DIR / f"{file_id}{ext}"
    upload_file.file.seek(0)
    with open(filepath, "wb") as f:
        shutil.copyfileobj(upload_file.file, f)
    return filepath


def result_path(suffix: str) -> Path:
    RESULT_DIR.mkdir(exist_ok=True)
    return RESULT_DIR / f"{uuid.uuid4().hex}{suffix}"


def cleanup_files(*paths):
    for p in paths:
        try:
            if os.path.isfile(p):
                os.remove(p)
        except OSError:
            pass


def libreoffice_convert(input_path: Path, output_dir: Path, fmt: str = "pdf") -> Path:
    subprocess.run(
        ["soffice", "--headless", "--convert-to", fmt, "--outdir",
         str(output_dir), str(input_path)],
        check=True, timeout=120,
    )
    name = input_path.stem + "." + fmt
    return output_dir / name


def parse_page_range(pages_str, total, max_range=MAX_PAGE_RANGE):
    selected = set()
    for part in pages_str.split(","):
        part = part.strip()
        try:
            if "-" in part:
                a, b = part.split("-", 1)
                start, end = int(a), int(b)
                if end - start > max_range:
                    continue
                selected.update(range(start - 1, min(end, total)))
            else:
                selected.add(int(part) - 1)
        except (ValueError, IndexError):
            continue
    return sorted(i for i in selected if 0 <= i < total)

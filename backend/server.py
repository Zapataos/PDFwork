import time
import asyncio
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn

from routes import convert, merge, split, compress, protect, images, rotate, extract, darkmode, pages, watermark
from utils import ensure_dirs, generate_auth_token, logger

AUTH_TOKEN = generate_auth_token()
RATE_LIMIT_WINDOW = 60
RATE_LIMIT_MAX = 120
_rate_store: dict[str, list[float]] = {}


@asynccontextmanager
async def lifespan(app: FastAPI):
    ensure_dirs()
    logger.info(f"AUTH_TOKEN:{AUTH_TOKEN}")
    yield


app = FastAPI(title="PDFWorks", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["app://."],
    allow_methods=["POST"],
    allow_headers=["Content-Type", "X-Auth-Token"],
)


@app.middleware("http")
async def auth_and_rate_limit(request: Request, call_next):
    if request.url.path == "/health":
        return await call_next(request)

    token = request.headers.get("X-Auth-Token", "")
    if token != AUTH_TOKEN:
        return JSONResponse({"error": "Forbidden"}, status_code=403)

    client_ip = request.client.host if request.client else "unknown"
    now = time.time()
    bucket = _rate_store.get(client_ip, [])
    bucket = [t for t in bucket if now - t < RATE_LIMIT_WINDOW]
    if len(bucket) >= RATE_LIMIT_MAX:
        return JSONResponse({"error": "Too many requests"}, status_code=429)
    bucket.append(now)
    _rate_store[client_ip] = bucket

    try:
        return await asyncio.wait_for(call_next(request), timeout=300)
    except asyncio.TimeoutError:
        return JSONResponse({"error": "Request timed out"}, status_code=504)


app.include_router(convert.router)
app.include_router(merge.router)
app.include_router(split.router)
app.include_router(compress.router)
app.include_router(protect.router)
app.include_router(images.router)
app.include_router(rotate.router)
app.include_router(extract.router)
app.include_router(darkmode.router)
app.include_router(pages.router)
app.include_router(watermark.router)


@app.get("/health")
def health():
    return {"status": "ok"}


if __name__ == "__main__":
    ensure_dirs()
    logger.info(f"AUTH_TOKEN:{AUTH_TOKEN}")
    uvicorn.run(app, host="127.0.0.1", port=17300)

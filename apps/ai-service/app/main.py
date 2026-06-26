"""Servicio de IA de la Bio Call (fase 2).

Esqueleto de FastAPI. Las capacidades de IA avanzada (OCR, extraccion y
autocompletado) se implementaran en fases posteriores.
"""

from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="BioCall AI Service", version="0.1.0")


class HealthResponse(BaseModel):
    ok: bool
    service: str
    phase: str


@app.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    return HealthResponse(ok=True, service="biocall-ai-service", phase="2")

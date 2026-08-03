"""Mock API for the Catalog Enrichment demo.

Everything here returns canned data. The point is to keep the front end honest
about where a real deployment would call out to Vertex AI, not to reimplement
the pipeline. Swap the handlers for real Gemini / Vector Search calls and the
UI does not need to change.
"""

from __future__ import annotations

import asyncio
from pathlib import Path

from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

ROOT = Path(__file__).resolve().parent.parent
ASSETS = ROOT / "assets" / "sample_product"

app = FastAPI(
    title="Catalog Enrichment API (demo)",
    description="Mock endpoints backing the Product Listing Portal and Insights pages.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── The enriched record the pipeline "produces" ──────────────────────────

ENRICHED_PRODUCT = {
    "product_id": "DR-847392",
    "title": "Women's Black Floral Smocked Mini Dress",
    "brand": "Aria Studio",
    "taxonomy": {
        "google_product_category": "Apparel & Accessories > Clothing > Dresses",
        "site_category": "Women > Dresses > Casual & Day Dresses",
    },
    "attributes": {
        "primary_color": "Black",
        "secondary_colors": ["White"],
        "pattern": "Floral",
        "neckline": "V-Neck",
        "sleeve_length": "3/4 Sleeve",
        "sleeve_style": "Sheer",
        "length": "Mini / Above Knee",
        "fit": "A-Line",
        "fabric_type": "Chiffon / Georgette",
        "special_features": ["Smocked bodice", "Ruffle hem", "Pockets", "Sheer sleeves"],
    },
    "enrichment": {
        "descriptions": {
            "short": (
                "A versatile black and white floral mini dress featuring a smocked "
                "bodice, sheer sleeves, and pockets."
            ),
            "seo_optimized": (
                "Shop the Women's Black Floral Smocked Mini Dress. Featuring a "
                "flattering V-neck, sheer 3/4 sleeves, and a playful ruffle hem. "
                "Perfect for casual outings or transitioning into fall fashion. "
                "Pair with knee-high boots for a complete look."
            ),
        },
        "tags": [
            "floral dress",
            "smocked waist",
            "mini dress",
            "fall fashion",
            "casual dress",
            "boho chic",
        ],
        "multimodal_embeddings": "mm-emb-v1 · 1408-dim · 984375983475…",
        "visually_similar_ids": ["DR-847393", "DR-102938"],
    },
    "confidence": {
        "title": 0.96,
        "brand": 0.88,
        "google_product_category": 0.93,
        "site_category": 0.90,
        "primary_color": 0.98,
        "pattern": 0.95,
        "neckline": 0.91,
        "sleeve_length": 0.89,
        "sleeve_style": 0.87,
        "length": 0.92,
        "fit": 0.84,
        "fabric_type": 0.86,
        "short_description": 0.94,
        "seo_optimized": 0.82,
        "tags": 0.88,
    },
}


@app.get("/health")
async def health():
    return {"status": "ok", "assets": ASSETS.is_dir()}


@app.post("/api/product/enrich")
async def enrich_product(
    document: UploadFile | None = File(default=None),
    image: UploadFile | None = File(default=None),
    video: UploadFile | None = File(default=None),
):
    """Pretend to run the multimodal enrichment pipeline.

    A real implementation would upload the inputs to GCS, call Gemini with the
    document + image + video parts, map the result onto the catalog schema and
    write the embedding to Vector Search.
    """
    received = [
        name
        for name, f in (("document", document), ("image", image), ("video", video))
        if f is not None
    ]
    if not received:
        raise HTTPException(status_code=400, detail="Provide at least one input file.")

    await asyncio.sleep(1.2)  # stand-in for model latency
    return {"inputs_received": received, "product": ENRICHED_PRODUCT}


@app.get("/api/product/sample")
async def sample_product():
    return ENRICHED_PRODUCT


@app.get("/api/product/sample-image/{name}")
async def sample_image(name: str):
    """Serve a bundled sample asset. Path traversal is rejected outright."""
    if "/" in name or "\\" in name or name.startswith("."):
        raise HTTPException(status_code=400, detail="Invalid asset name.")
    path = ASSETS / name
    if not path.is_file():
        raise HTTPException(status_code=404, detail=f"No such asset: {name}")
    return FileResponse(path)


@app.post("/api/product/generate-image")
async def generate_image():
    """GenMedia recontextualization — flat product shot to on-model lifestyle."""
    await asyncio.sleep(1.5)
    return {
        "model": "imagen-3",
        "prompt": "on-model studio lifestyle shot, natural light, neutral backdrop",
        "url": "/api/product/sample-image/generated_photo.png",
    }


@app.get("/api/insights/summary")
async def insights_summary():
    return {
        "attribute_coverage_pct": 87,
        "coverage_delta_pts": 23,
        "items_enriched_30d": 42180,
        "auto_approved_pct": 76,
        "overlaps_flagged": 312,
    }


@app.get("/api/insights/overlap")
async def insights_overlap():
    return {
        "clusters": [
            {"cluster": "Linen blazers, spring drop", "items": 4, "similarity": 93, "teams": 3},
            {"cluster": "Smocked mini dresses", "items": 3, "similarity": 88, "teams": 2},
            {"cluster": "Pour-over coffee sets", "items": 2, "similarity": 84, "teams": 2},
        ]
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)

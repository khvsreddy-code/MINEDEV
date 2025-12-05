# AetherForge Nexus V15.3 Backend - ENHANCED with Game Dev Features
# Complete API with productivity tools

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, FileResponse
from pydantic import BaseModel
from typing import List, Optional
import asyncio
import json
import os
from pathlib import Path

app = FastAPI(title="MINEDEV - AetherForge Nexus API V15.3")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class GenerationRequest(BaseModel):
    prompt: str
    type: str
    features: dict
    
class BatchRequest(BaseModel):
    prompt: str
    type: str
    count: int = 10
    variation_type: str = "style"

class LODRequest(BaseModel):
    mesh_id: str
    levels: List[int] = [8000, 4000, 1000, 100]

class AssetPackRequest(BaseModel):
    theme: str
    asset_types: List[str]
    count_per_type: int = 5

# Import pipeline stages
from pipeline.stage1_multiview import generate_multiview_images
from pipeline.stage2_reconstruction import reconstruct_3d_mesh
from pipeline.stage3_cleanup import cleanup_mesh
from pipeline.stage4_textures import generate_pbr_textures
from pipeline.stage5_rigging import auto_rig_character
from pipeline.export import export_glb

# Import game dev features
from pipeline.gamedev_features import (
    generate_batch_variations,
    generate_lod_chain,
    generate_collision_mesh,
    generate_asset_pack,
    optimize_for_platform
)
from pipeline.engine_export import export_for_unity, export_for_unreal

@app.get("/")
async def root():
    return {
        "name": "MINEDEV - AetherForge Nexus V15.3",
        "status": "online",
        "features": [
            "text-to-3d",
            "image-to-3d",
            "batch-generation",
            "lod-chains",
            "collision-meshes",
            "asset-packs",
            "unity-export",
            "unreal-export",
            "platform-optimization"
        ]
    }

@app.post("/api/generate")
async def generate_3d(request: GenerationRequest):
    """Standard single generation with full pipeline"""
    async def stream_progress():
        try:
            yield json.dumps({"stage": "multiview", "progress": 0, "message": "HIGH-QUALITY multi-view generation..."}) + "\n"
            
            views = await asyncio.to_thread(
                generate_multiview_images,
                prompt=request.prompt,
                num_views=8  # ENHANCED quality
            )
            
            yield json.dumps({"stage": "multiview", "progress": 40, "message": "8 high-quality views generated"}) + "\n"
            
            yield json.dumps({"stage": "reconstruction", "progress": 40, "message": "Reconstructing with 512 resolution..."}) + "\n"
            
            mesh = await asyncio.to_thread(
                reconstruct_3d_mesh,
                multiview_images=views
            )
            
            yield json.dumps({"stage": "reconstruction", "progress": 70, "message": "High-detail mesh reconstructed"}) + "\n"
            
            yield json.dumps({"stage": "cleanup", "progress": 70, "message": "Professional cleanup (8K faces, Taubin smooth)..."}) + "\n"
            
            mesh = await asyncio.to_thread(
                cleanup_mesh,
                mesh=mesh,
                target_faces=8000  # ENHANCED quality
            )
            
            yield json.dumps({"stage": "cleanup", "progress": 85, "message": "Professional mesh ready"}) + "\n"
            
            if request.features.get("pbr_textures", True):
                yield json.dumps({"stage": "textures", "progress": 85, "message": "Generating 4K PBR textures..."}) + "\n"
                
                textures = await asyncio.to_thread(
                    generate_pbr_textures,
                    mesh=mesh,
                    prompt=request.prompt
                )
                
                yield json.dumps({"stage": "textures", "progress": 95, "message": "ORM-packed textures ready"}) + "\n"
            else:
                textures = None
            
            skeleton = None
            if request.type == "character" and request.features.get("auto_rigging", True):
                yield json.dumps({"stage": "rigging", "progress": 95, "message": "Auto-rigging character..."}) + "\n"
                
                skeleton = await asyncio.to_thread(
                    auto_rig_character,
                    mesh=mesh
                )
            
            yield json.dumps({"stage": "export", "progress": 98, "message": "Exporting GLB..."}) + "\n"
            
            output_path = await asyncio.to_thread(
                export_glb,
                mesh=mesh,
                textures=textures,
                skeleton=skeleton,
                filename=f"output_{request.type}.glb"
            )
            
            yield json.dumps({"stage": "complete", "progress": 100, "file": str(output_path)}) + "\n"
            
        except Exception as e:
            yield json.dumps({"stage": "error", "message": str(e)}) + "\n"
    
    return StreamingResponse(stream_progress(), media_type="application/x-ndjson")

@app.post("/api/batch-generate")
async def batch_generate(request: BatchRequest):
    """Generate multiple variations at once"""
    async def stream_batch():
        try:
            yield json.dumps({"progress": 0, "message": f"Generating {request.count} variations..."}) + "\n"
            
            # Generate base mesh first
            views = await asyncio.to_thread(generate_multiview_images, request.prompt, num_views=6)
            mesh = await asyncio.to_thread(reconstruct_3d_mesh, views)
            mesh = await asyncio.to_thread(cleanup_mesh, mesh)
            
            yield json.dumps({"progress": 50, "message": "Base mesh created, generating variations..."}) + "\n"
            
            # Generate variations
            variations = await asyncio.to_thread(
                generate_batch_variations,
                mesh,
                request.prompt,
                request.count,
                request.variation_type
            )
            
            # Export all
            files = []
            for i, var in enumerate(variations):
                output_path = await asyncio.to_thread(
                    export_glb,
                    mesh=var['mesh'],
                    filename=f"variation_{i:02d}.glb"
                )
                files.append(str(output_path))
            
            yield json.dumps({
                "progress": 100,
                "message": f"{request.count} variations complete",
                "files": files
            }) + "\n"
            
        except Exception as e:
            yield json.dumps({"error": str(e)}) + "\n"
    
    return StreamingResponse(stream_batch(), media_type="application/x-ndjson")

@app.post("/api/generate-lods")
async def create_lod_chain(request: LODRequest):
    """Generate LOD chain for performance"""
    # Load mesh (simplified - in production would retrieve from cache)
    from trimesh import load
    mesh = load("outputs/output.glb")
    
    lods = generate_lod_chain(mesh, request.levels)
    
    # Export LODs
    lod_files = {}
    for lod_name, lod_data in lods.items():
        output_path = export_glb(
            mesh=lod_data['mesh'],
            filename=f"model_{lod_name}.glb"
        )
        lod_files[lod_name] = {
            "file": str(output_path),
            "faces": lod_data['faces'],
            "reduction": lod_data['reduction']
        }
    
    return {"lods": lod_files}

@app.post("/api/generate-collision")
async def create_collision(method: str = "convex_hull"):
    """Generate collision mesh"""
    from trimesh import load
    mesh = load("outputs/output.glb")
    
    collision = generate_collision_mesh(mesh, method=method)
    output_path = export_glb(collision, filename="collision.glb")
    
    return {
        "file": str(output_path),
        "faces": len(collision.faces),
        "method": method
    }

@app.post("/api/asset-pack")
async def create_asset_pack(request: AssetPackRequest):
    """Generate complete themed asset pack"""
    async def stream_pack():
        try:
            yield json.dumps({"progress": 0, "message": f"Generating {request.theme} asset pack..."}) + "\n"
            
            pack = await asyncio.to_thread(
                generate_asset_pack,
                request.theme,
                request.asset_types,
                request.count_per_type
            )
            
            yield json.dumps({"progress": 100, "pack": pack['theme']}) + "\n"
            
        except Exception as e:
            yield json.dumps({"error": str(e)}) + "\n"
    
    return StreamingResponse(stream_pack(), media_type="application/x-ndjson")

@app.post("/api/export/unity")
async def export_unity():
    """Export for Unity with prefabs"""
    from trimesh import load
    mesh = load("outputs/output.glb")
    
    output_path = export_for_unity(mesh)
    return {"path": str(output_path), "engine": "Unity"}

@app.post("/api/export/unreal")
async def export_unreal():
    """Export for Unreal Engine"""
    from trimesh import load
    mesh = load("outputs/output.glb")
    
    output_path = export_for_unreal(mesh)
    return {"path": str(output_path), "engine": "Unreal"}

@app.get("/api/download/{filename}")
async def download_model(filename: str):
    """Download generated file"""
    file_path = Path("outputs") / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(file_path, media_type="model/gltf-binary", filename=filename)

if __name__ == "__main__":
    import uvicorn
    print("🚀 AetherForge Nexus V15.3 - Game Dev Edition")
    print("   Features: Batch Gen | LODs | Collision | Asset Packs | Engine Export")
    uvicorn.run(app, host="0.0.0.0", port=8000)

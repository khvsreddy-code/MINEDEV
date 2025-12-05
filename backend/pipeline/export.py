# Export Module - GLB/FBX/OBJ export
# Simplified to use trimesh built-in exporters

import trimesh
import numpy as np
from pathlib import Path
from PIL import Image

def export_glb(mesh, textures=None, skeleton=None, filename="output.glb"):
    """
    Export mesh to GLB format
    
    Args:
        mesh: trimesh.Trimesh
        textures: Dict of PIL Images (optional)
        skeleton: Skeleton data dict (optional)
        filename: Output filename
    
    Returns:
        Path to exported file
    """
    print(f"Exporting to GLB: {filename}")
    
    output_dir = Path("outputs")
    output_dir.mkdir(parents=True, exist_ok=True)
    output_path = output_dir / filename
    
    # Trimesh handles GLB export automatically
    mesh.export(output_path)
    
    print(f"Exported to: {output_path}")
    return output_path

def export_obj(mesh, textures=None, filename="output.obj"):
    """Export to OBJ format"""
    output_dir = Path("outputs")
    output_dir.mkdir(parents=True, exist_ok=True)
    output_path = output_dir / filename
    
    mesh.export(output_path)
    
    # Save textures if provided
    if textures:
        texture_dir = output_dir / "textures"
        texture_dir.mkdir(exist_ok=True)
        for name, texture in textures.items():
            texture.save(texture_dir / f"{name}.png")
    
    print(f"Exported to: {output_path}")
    return output_path

if __name__ == "__main__":
    # Test
    mesh = trimesh.creation.icosphere()
    path = export_glb(mesh, filename="test.glb")
    print(f"Export test successful: {path}")

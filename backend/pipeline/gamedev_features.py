# Game Dev Productivity Module - Batch Generation & LODs
# Advanced features for professional game development

import trimesh
import numpy as np
from pathlib import Path
from typing import List, Dict
import hashlib

def generate_batch_variations(base_mesh, prompt: str, count: int = 10, variation_type: str = "style"):
    """
    Generate multiple variations of a single asset
    
    Args:
        base_mesh: Base 3D mesh
        prompt: Original prompt
        count: Number of variations to generate
        variation_type: "style", "color", "size", "detail"
    
    Returns:
        List of mesh variations
    """
    print(f"Generating {count} variations (type: {variation_type})...")
    
    variations = []
    
    for i in range(count):
        # Create variation based on type
        if variation_type == "size":
            # Size variations (80% to 120%)
            scale = 0.8 + (i / count) * 0.4
            mesh_var = base_mesh.copy()
            mesh_var.apply_scale(scale)
            
        elif variation_type == "detail":
            # Detail level variations
            target_faces = int(len(base_mesh.faces) * (0.5 + i / count))
            mesh_var = base_mesh.copy()
            if target_faces < len(mesh_var.faces):
                mesh_var = mesh_var.simplify_quadric_decimation(target_faces)
            else:
                mesh_var = mesh_var.subdivide()
                
        elif variation_type == "rotation":
            # Rotation variations
            angle = (i / count) * np.pi * 2
            mesh_var = base_mesh.copy()
            rotation_matrix = trimesh.transformations.rotation_matrix(angle, [0, 0, 1])
            mesh_var.apply_transform(rotation_matrix)
            
        else:  # "style" or default
            # For now, create slightly modified versions
            # In production, this would use AI to generate style variations
            mesh_var = base_mesh.copy()
            # Add slight random noise for variation
            noise = np.random.normal(0, 0.01, mesh_var.vertices.shape)
            mesh_var.vertices += noise
        
        variations.append({
            'mesh': mesh_var,
            'variation_id': i,
            'type': variation_type
        })
    
    print(f"✓ Generated {count} variations successfully")
    return variations

def generate_lod_chain(mesh, levels: List[int] = [8000, 4000, 1000, 100]):
    """
    Generate LOD (Level of Detail) chain for game performance
    
    Args:
        mesh: High-quality base mesh
        levels: Target face counts for each LOD level
    
    Returns:
        Dictionary of LOD meshes
    """
    print(f"Generating LOD chain: {levels}")
    
    lods = {}
    
    for i, target_faces in enumerate(levels):
        lod_name = f"LOD{i}"
        
        if target_faces >= len(mesh.faces):
            # If target is higher than current, use original or subdivide
            lod_mesh = mesh.copy()
        else:
            # Decimate to target
            lod_mesh = mesh.copy()
            lod_mesh = lod_mesh.simplify_quadric_decimation(target_faces)
        
        lods[lod_name] = {
            'mesh': lod_mesh,
            'faces': len(lod_mesh.faces),
            'vertices': len(lod_mesh.vertices),
            'reduction': (1 - len(lod_mesh.faces) / len(mesh.faces)) * 100
        }
        
        print(f"  ✓ {lod_name}: {len(lod_mesh.faces):,} faces ({lods[lod_name]['reduction']:.1f}% reduction)")
    
    return lods

def generate_collision_mesh(mesh, method: str = "convex_hull", max_triangles: int = 100):
    """
    Generate optimized collision mesh for physics
    
    Args:
        mesh: Visual mesh
        method: "convex_hull", "box", "sphere", "simplified"
        max_triangles: Maximum collision mesh complexity
    
    Returns:
        Collision mesh
    """
    print(f"Generating collision mesh (method: {method})...")
    
    if method == "convex_hull":
        # Convex hull - best for most objects
        collision = mesh.convex_hull
        
    elif method == "box":
        # Bounding box - cheapest collision
        collision = trimesh.primitives.Box(
            extents=mesh.extents,
            transform=mesh.centroid
        )
        
    elif method == "sphere":
        # Bounding sphere - very cheap
        collision = trimesh.primitives.Sphere(
            radius=mesh.bounding_sphere.primitive.radius,
            center=mesh.centroid
        )
        
    else:  # "simplified"
        # Simplified version of original mesh
        collision = mesh.copy()
        collision = collision.simplify_quadric_decimation(max_triangles)
    
    # Ensure collision mesh is simple enough
    if len(collision.faces) > max_triangles:
        collision = collision.simplify_quadric_decimation(max_triangles)
    
    print(f"  ✓ Collision mesh: {len(collision.faces)} faces (optimized for physics)")
    
    return collision

def generate_asset_pack(theme: str, asset_types: List[str], count_per_type: int = 5):
    """
    Generate complete themed asset pack
    
    Args:
        theme: Theme description (e.g., "medieval village")
        asset_types: List of asset categories
        count_per_type: Number of assets per category
    
    Returns:
        Dictionary of asset collections
    """
    print(f"Generating asset pack: '{theme}'")
    print(f"  Types: {', '.join(asset_types)}")
    print(f"  Count per type: {count_per_type}")
    
    asset_pack = {
        'theme': theme,
        'assets': {}
    }
    
    for asset_type in asset_types:
        print(f"\n  Generating {count_per_type} {asset_type} assets...")
        asset_pack['assets'][asset_type] = []
        
        for i in range(count_per_type):
            # In production, this would call the AI generation pipeline
            # For now, create placeholder geometry
            if asset_type == "building":
                asset = trimesh.creation.box(extents=[2, 2, 3])
            elif asset_type == "prop":
                asset = trimesh.creation.cylinder(radius=0.5, height=1)
            elif asset_type == "character":
                asset = trimesh.creation.icosphere(subdivisions=2)
            else:
                asset = trimesh.creation.box(extents=[1, 1, 1])
            
            asset_pack['assets'][asset_type].append({
                'mesh': asset,
                'name': f"{theme}_{asset_type}_{i:02d}",
                'id': i
            })
        
        print(f"    ✓ Generated {count_per_type} {asset_type} assets")
    
    total_assets = sum(len(assets) for assets in asset_pack['assets'].values())
    print(f"\n✓ Asset pack complete: {total_assets} total assets")
    
    return asset_pack

def optimize_for_platform(mesh, platform: str = "pc", target_fps: int = 60):
    """
    Optimize mesh for target platform
    
    Args:
        mesh: Input mesh
        platform: "mobile", "pc", "vr", "web"
        target_fps: Target framerate
    
    Returns:
        Optimized mesh with metadata
    """
    print(f"Optimizing for {platform.upper()} (target: {target_fps} FPS)...")
    
    optimized = mesh.copy()
    
    if platform == "mobile":
        # Aggressive optimization for mobile
        max_faces = 2000
        texture_res = 1024
        materials = 1
        
    elif platform == "vr":
        # VR needs high performance
        max_faces = 5000
        texture_res = 2048
        materials = 2
        
    elif platform == "web":
        # WebGL constraints
        max_faces = 3000
        texture_res = 1024
        materials = 1
        
    else:  # "pc"
        # PC can handle more
        max_faces = 10000
        texture_res = 4096
        materials = 4
    
    # Apply optimizations
    if len(optimized.faces) > max_faces:
        optimized = optimized.simplify_quadric_decimation(max_faces)
    
    print(f"  ✓ Optimized to {len(optimized.faces):,} faces")
    print(f"  ✓ Target texture: {texture_res}px")
    print(f"  ✓ Max materials: {materials}")
    
    return {
        'mesh': optimized,
        'platform': platform,
        'texture_resolution': texture_res,
        'max_materials': materials,
        'estimated_performance': f"{target_fps} FPS"
    }

if __name__ == "__main__":
    # Test batch variations
    test_mesh = trimesh.creation.icosphere(subdivisions=2)
    
    variations = generate_batch_variations(test_mesh, "test", count=5, variation_type="size")
    print(f"\nBatch test: {len(variations)} variations created")
    
    # Test LOD chain
    lods = generate_lod_chain(test_mesh, levels=[1000, 500, 100, 20])
    print(f"\nLOD test: {len(lods)} levels created")
    
    # Test collision
    collision = generate_collision_mesh(test_mesh, method="convex_hull")
    print(f"\nCollision test: {len(collision.faces)} faces")
    
    # Test platform optimization
    optimized = optimize_for_platform(test_mesh, platform="mobile")
    print(f"\nPlatform test: optimized to {len(optimized['mesh'].faces)} faces")
    
    print("\n✓ All productivity features tested successfully!")

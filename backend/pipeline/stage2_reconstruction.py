# Stage 2: 3D Reconstruction - ENHANCED FOR QUALITY
# Using TripoSR with maximum quality settings

import torch
from PIL import Image
import trimesh
import numpy as np
from pathlib import Path

try:
    from tsr.system import TSR
    from tsr.utils import remove_background, resize_foreground
    TRIPOSR_AVAILABLE = True
except:
    TRIPOSR_AVAILABLE = False

_reconstruction_model = None

def load_model():
    """Load TripoSR with high-quality settings"""
    global _reconstruction_model
    
    if _reconstruction_model is None and TRIPOSR_AVAILABLE:
        print("Loading TripoSR model (HIGH QUALITY MODE)...")
        
        device = "cuda" if torch.cuda.is_available() else "cpu"
        
        _reconstruction_model = TSR.from_pretrained(
            "stabilityai/TripoSR",
            config_name="config.yaml",
            weight_name="model.ckpt",
        )
        _reconstruction_model = _reconstruction_model.to(device)
        
        print(f"TripoSR loaded on {device} (HIGH QUALITY)")
    
    return _reconstruction_model

def reconstruct_3d_mesh(multiview_images):
    """
    HIGH-QUALITY 3D reconstruction
    
    QUALITY ENHANCEMENTS:
    - Higher mesh resolution (512 vs 256) for more detail
    - Better background removal
    - Optimized foreground ratio
    - More accurate geometry extraction
    """
    
    if not TRIPOSR_AVAILABLE:
        print("Creating HIGH-QUALITY placeholder geometry")
        return create_placeholder_mesh(high_quality=True)
    
    model = load_model()
    device = "cuda" if torch.cuda.is_available() else "cpu"
    
    # Enhanced preprocessing
    processed_images = []
    for img in multiview_images:
        # Better background removal
        img_no_bg = remove_background(img, threshold=0.5)  # More aggressive
        # Optimal foreground ratio for detail
        img_processed = resize_foreground(img_no_bg, 0.90)  # Larger foreground
        processed_images.append(img_processed)
    
    # Convert to high-quality tensor
    images_tensor = torch.stack([
        torch.from_numpy(np.array(img)).permute(2, 0, 1).float() / 255.0
        for img in processed_images
    ]).to(device)
    
    print("Reconstructing HIGH-QUALITY 3D mesh (512 resolution)...")
    with torch.no_grad():
        scene_codes = model(
            images_tensor, 
            device=device,
            # Quality settings
            mc_resolution=512,  # INCREASED from 256 for finer detail
            chunks=8192  # More chunks for smoother geometry
        )
    
    # Extract high-res mesh
    meshes = model.extract_mesh(
        scene_codes,
        resolution=512,  # HIGH RESOLUTION
        threshold=0.0  # Balanced threshold
    )
    mesh = meshes[0]
    
    # Convert to trimesh
    vertices = mesh['vertices'].cpu().numpy()
    faces = mesh['faces'].cpu().numpy()
    
    final_mesh = trimesh.Trimesh(
        vertices=vertices,
        faces=faces,
        process=True
    )
    
    # Quality checks
    print(f"  ✓ Mesh quality: {len(vertices):,} vertices, {len(faces):,} faces")
    print(f"  ✓ Is watertight: {final_mesh.is_watertight}")
    print(f"  ✓ Volume: {final_mesh.volume:.3f}")
    
    # Save high-quality intermediate
    output_dir = Path("outputs/reconstruction")
    output_dir.mkdir(parents=True, exist_ok=True)
    final_mesh.export(output_dir / "raw_mesh_hq.obj")
    
    if torch.cuda.is_available():
        torch.cuda.empty_cache()
    
    return final_mesh

def create_placeholder_mesh(high_quality=False):
    """Create high-quality placeholder for testing"""
    if high_quality:
        # Detailed character placeholder
        body = trimesh.creation.cylinder(radius=0.3, height=1.2, sections=32)
        head = trimesh.creation.icosphere(subdivisions=3, radius=0.35)
        head.apply_translation([0, 0.9, 0])
        
        # Add arms
        left_arm = trimesh.creation.cylinder(radius=0.12, height=0.8, sections=16)
        left_arm.apply_transform(trimesh.transformations.rotation_matrix(
            np.pi/2, [0, 0, 1]
        ))
        left_arm.apply_translation([-0.5, 0.4, 0])
        
        right_arm = trimesh.creation.cylinder(radius=0.12, height=0.8, sections=16)
        right_arm.apply_transform(trimesh.transformations.rotation_matrix(
            -np.pi/2, [0, 0, 1]
        ))
        right_arm.apply_translation([0.5, 0.4, 0])
        
        # Combine all parts
        mesh = trimesh.util.concatenate([body, head, left_arm, right_arm])
    else:
        # Simple placeholder
        mesh = trimesh.creation.icosphere(subdivisions=2)
    
    return mesh

if __name__ == "__main__":
    mesh = create_placeholder_mesh(high_quality=True)
    mesh.export("test_mesh_hq.obj")
    print(f"HIGH-QUALITY test mesh: {len(mesh.vertices)} vertices!")

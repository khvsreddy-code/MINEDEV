# Stage 2: Extract mesh from Shap-E latent or use TripoSR
# Handles AI-generated 3D reconstruction

import torch
from PIL import Image
import trimesh
import numpy as np
from pathlib import Path

def reconstruct_3d_mesh(multiview_data):
    """
    Reconstruct 3D mesh from AI generation
    
    Args:
        multiview_data: Either Shap-E latent dict or list of images
    
    Returns:
        trimesh.Trimesh object
    """
    
    # Check if we have Shap-E latent
    if isinstance(multiview_data, dict) and multiview_data.get('type') == 'shap_e_latent':
        return extract_shap_e_mesh(multiview_data)
    else:
        # Fallback to placeholder
        return create_placeholder_mesh(high_quality=True)

def extract_shap_e_mesh(latent_data):
    """Extract mesh from Shap-E latent"""
    print("Extracting mesh from Shap-E latent...")
    
    try:
        from shap_e.util.notebooks import decode_latent_mesh
        
        latent = latent_data['latent']
        xm = latent_data['xm']
        device = latent_data['device']
        
        # Decode latent to mesh
        print("  Decoding latent to mesh...")
        t = decode_latent_mesh(xm, latent[0]).tri_mesh()
        
        # Convert to trimesh
        vertices = t.verts.cpu().numpy()
        faces = t.faces.cpu().numpy()
        
        mesh = trimesh.Trimesh(
            vertices=vertices,
            faces=faces,
            process=True
        )
        
        print(f"  ✓ Mesh extracted: {len(vertices):,} vertices, {len(faces):,} faces")
        
        # Save
        output_dir = Path("outputs/reconstruction")
        output_dir.mkdir(parents=True, exist_ok=True)
        mesh.export(output_dir / "ai_generated.obj")
        
        return mesh
        
    except Exception as e:
        print(f"  Error extracting Shap-E mesh: {e}")
        print("  Using high-quality placeholder instead")
        return create_placeholder_mesh(high_quality=True)

def create_placeholder_mesh(high_quality=True):
    """Create high-quality placeholder for testing"""
    print("Creating placeholder mesh...")
    
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
        mesh = trimesh.creation.icosphere(subdivisions=2)
    
    print(f"  ✓ Placeholder: {len(mesh.vertices)} vertices, {len(mesh.faces)} faces")
    return mesh

if __name__ == "__main__":
    mesh = create_placeholder_mesh(high_quality=True)
    mesh.export("test_mesh.obj")
    print("Test mesh created!")

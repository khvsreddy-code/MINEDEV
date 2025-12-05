# Stage 5: Auto-Rigging for Characters
# Automatic skeleton generation optimized for low-end hardware

import trimesh
import numpy as np
from pathlib import Path

def auto_rig_character(mesh, bone_limit=30):
    """
    Generate skeleton and weights for character mesh
    
    Args:
        mesh: trimesh.Trimesh object
        bone_limit: Maximum bones (low for iGPU performance)
    
    Returns:
        Dictionary with skeleton data
    """
    print(f"Stage 5: Auto-rigging character ({bone_limit} bones max)...")
    
    # Analyze mesh to find body parts
    skeleton = generate_humanoid_skeleton(mesh, bone_limit)
    
    # Generate skinning weights
    weights = automatic_skinning(mesh, skeleton)
    
    # Save skeleton data
    output_dir = Path("outputs/rigging")
    output_dir.mkdir(parents=True, exist_ok=True)
    
    save_skeleton(skeleton, output_dir / "skeleton.json")
    
    print(f"Rigging complete: {len(skeleton['bones'])} bones")
    
    return {
        'skeleton': skeleton,
        'weights': weights
    }

def generate_humanoid_skeleton(mesh, bone_limit):
    """
    Generate basic humanoid skeleton
    Optimized bone structure for low-end GPUs
    """
    vertices = mesh.vertices
    
    # Find center and extents
    center = vertices.mean(axis=0)
    min_bounds = vertices.min(axis=0)
    max_bounds = vertices.max(axis=0)
    height = max_bounds[2] - min_bounds[2]
    
    # Create bone structure
    bones = []
    
    # Root
    bones.append({
        'name': 'root',
        'position': [center[0], center[1], min_bounds[2]],
        'parent': None
    })
    
    # Spine (3 bones)
    for i in range(3):
        y = min_bounds[2] + (height * (0.3 + i * 0.2))
        bones.append({
            'name': f'spine_{i}',
            'position': [center[0], center[1], y],
            'parent': 'root' if i == 0 else f'spine_{i-1}'
        })
    
    # Head
    bones.append({
        'name': 'head',
        'position': [center[0], center[1], max_bounds[2] * 0.9],
        'parent': 'spine_2'
    })
    
    # Arms (simplified)
    for side in ['left', 'right']:
        x_offset = (max_bounds[0] - min_bounds[0]) * 0.3 * (1 if side == 'right' else -1)
        
        # Shoulder
        bones.append({
            'name': f'{side}_shoulder',
            'position': [center[0] + x_offset, center[1], height * 0.7],
            'parent': 'spine_2'
        })
        
        # Upper arm
        bones.append({
            'name': f'{side}_upper_arm',
            'position': [center[0] + x_offset * 1.5, center[1], height * 0.5],
            'parent': f'{side}_shoulder'
        })
        
        # Lower arm
        bones.append({
            'name': f'{side}_lower_arm',
            'position': [center[0] + x_offset * 1.5, center[1], height * 0.3],
            'parent': f'{side}_upper_arm'
        })
        
        # Hand
        bones.append({
            'name': f'{side}_hand',
            'position': [center[0] + x_offset * 1.5, center[1], height * 0.1],
            'parent': f'{side}_lower_arm'
        })
    
    # Legs (simplified)
    for side in ['left', 'right']:
        x_offset = (max_bounds[0] - min_bounds[0]) * 0.15 * (1 if side == 'right' else -1)
        
        # Upper leg
        bones.append({
            'name': f'{side}_upper_leg',
            'position': [center[0] + x_offset, center[1], height * 0.3],
            'parent': 'root'
        })
        
        # Lower leg
        bones.append({
            'name': f'{side}_lower_leg',
            'position': [center[0] + x_offset, center[1], height * 0.15],
            'parent': f'{side}_upper_leg'
        })
        
        # Foot
        bones.append({
            'name': f'{side}_foot',
            'position': [center[0] + x_offset, center[1] + 0.1, min_bounds[2]],
            'parent': f'{side}_lower_leg'
        })
    
    return {
        'bones': bones[:bone_limit],  # Limit for performance
        'root': 'root'
    }

def automatic_skinning(mesh, skeleton):
    """
    Generate skinning weights using closest bone
    """
    vertices = mesh.vertices
    bones = skeleton['bones']
    
    # Calculate distance from each vertex to each bone
    weights = np.zeros((len(vertices), len(bones)))
    
    for i, vertex in enumerate(vertices):
        for j, bone in enumerate(bones):
            bone_pos = np.array(bone['position'])
            distance = np.linalg.norm(vertex - bone_pos)
            weights[i, j] = 1.0 / (distance + 0.01)  # Inverse distance weighting
    
    # Normalize weights
    weights = weights / weights.sum(axis=1, keepdims=True)
    
    return weights

def save_skeleton(skeleton, filepath):
    """Save skeleton to JSON"""
    import json
    with open(filepath, 'w') as f:
        json.dump(skeleton, f, indent=2)

if __name__ == "__main__":
    # Test
    mesh = trimesh.creation.cylinder(height=2, radius=0.3, sections=8)
    rig = auto_rig_character(mesh, bone_limit=20)
    print(f"Rigging test successful! {len(rig['skeleton']['bones'])} bones created")

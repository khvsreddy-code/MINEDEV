# Unity & Unreal Engine Export Module
# Direct integration with game engines

import trimesh
import json
from pathlib import Path
import numpy as np

def export_for_unity(mesh, textures=None, lods=None, collision=None, output_dir="outputs/unity"):
    """Export mesh with Unity-specific setup"""
    print("Exporting for Unity...")
    
    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)
    
    # Export main mesh
    main_file = output_path / "model.glb"
    mesh.export(main_file)
    print(f"  ✓ Main mesh: {main_file}")
    
    # Export LODs if provided
    if lods:
        for lod_name, lod_data in lods.items():
            lod_file = output_path / f"model_{lod_name}.glb"
            lod_data['mesh'].export(lod_file)
            print(f"  ✓ {lod_name}: {lod_file}")
    
    # Export collision
    if collision:
        collision_file = output_path / "model_collision.obj"
        collision.export(collision_file)
        print(f"  ✓ Collision: {collision_file}")
    
    # Create Unity prefab metadata
    prefab_data = {
        "PrefabMetadata": {
            "Name": "GeneratedAsset",
            "Type": "StaticMesh",
            "Renderer": "MeshRenderer",
            "Materials": ["Material_PBR"],
            "LODLevels": len(lods) if lods else 1,
            "HasCollision": collision is not None,
            "ImportSettings": {
                "MeshCompression": "Medium",
                "ReadWriteEnabled": False,
                "OptimizeMesh": True,
                "ImportBlendShapes": False
            }
        }
    }
    
    # Save prefab metadata
    prefab_file = output_path / "prefab_metadata.json"
    with open(prefab_file, 'w') as f:
        json.dump(prefab_data, f, indent=2)
    print(f"  ✓ Prefab metadata: {prefab_file}")
    
    # Create URP material template
    material_template = {
        "Material": {
            "Shader": "Universal Render Pipeline/Lit",
            "Properties": {
                "_BaseMap": "textures/albedo.png",
                "_BumpMap": "textures/normal.png",
                "_OcclusionMap": "textures/orm.png",
                "_Smoothness": 0.5,
                "_Metallic": 0.0
            }
        }
    }
    
    material_file = output_path / "material_urp.json"
    with open(material_file, 'w') as f:
        json.dump(material_template, f, indent=2)
    print(f"  ✓ URP material: {material_file}")
    
    print(f"\n✓ Unity export complete: {output_path}")
    return output_path

def export_for_unreal(mesh, textures=None, lods=None, collision=None, output_dir="outputs/unreal"):
    """Export mesh with Unreal Engine-specific setup"""
    print("Exporting for Unreal Engine...")
    
    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)
    
    # Export main mesh as GLB (FBX export requires pyassimp which is complex)
    main_file = output_path / "SM_Asset.glb"
    mesh.export(main_file)
    print(f"  ✓ Main mesh (GLB): {main_file}")
    
    # Export collision with UE naming convention
    if collision:
        collision_file = output_path / "UCX_SM_Asset.obj"
        collision.export(collision_file)
        print(f"  ✓ Collision (UCX): {collision_file}")
    
    # Create Unreal metadata
    ue_metadata = {
        "UnrealAsset": {
            "Type": "StaticMesh",
            "Name": "SM_Asset",
            "Nanite": {
                "Enabled": True,
                "PositionPrecision": "Auto",
                "NormalPrecision": "Auto"
            },
            "LODSettings": {
                "AutoComputeLODs": False,
                "LODCount": len(lods) if lods else 1,
                "MinLOD": 0
            },
            "Collision": {
                "ComplexCollisionMesh": "UCX_SM_Asset",
                "CollisionPreset": "BlockAll"
            },
            "Materials": [
                {
                    "Name": "M_Asset",
                    "Slot": 0,
                    "Lumen": True,
                    "Nanite": True
                }
            ]
        }
    }
    
    metadata_file = output_path / "asset_metadata.json"
    with open(metadata_file, 'w') as f:
        json.dump(ue_metadata, f, indent=2)
    print(f"  ✓ Unreal metadata: {metadata_file}")
    
    print(f"\n✓ Unreal Engine export complete: {output_path}")
    return output_path

if __name__ == "__main__":
    # Test export
    test_mesh = trimesh.creation.icosphere(subdivisions=2)
    test_collision = test_mesh.convex_hull
    
    export_for_unity(test_mesh, collision=test_collision)
    export_for_unreal(test_mesh, collision=test_collision)
    
    print("\n✓ Engine export tests successful!")

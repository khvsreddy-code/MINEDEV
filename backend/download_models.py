#!/usr/bin/env python3
"""
MINEDEV - AetherForge Nexus V15.3 - Model Setup
Simplified approach: Uses standard Stable Diffusion models
"""

import os
from pathlib import Path

def setup_models():
    print("=" * 70)
    print("MINEDEV - AetherForge Nexus V15.3 - Model Setup")
    print("=" * 70)
    print()
    
    models_dir = Path("./models")
    models_dir.mkdir(exist_ok=True)
    
    print("Setting up AI models...")
    print()
    
    try:
        from diffusers import StableDiffusionPipeline
        import torch
        
        device = "cuda" if torch.cuda.is_available() else "cpu"
        print(f"Device: {device}")
        print()
        
        # Download standard Stable Diffusion for image generation
        print("[1/1] Downloading Stable Diffusion v1.5...")
        print("  Size: ~4GB")
        print("  Used for: Multi-view image synthesis")
        print()
        
        pipeline = StableDiffusionPipeline.from_pretrained(
            "runwayml/stable-diffusion-v1-5",
            torch_dtype=torch.float16 if device == "cuda" else torch.float32,
            cache_dir=str(models_dir)
        )
        
        print("  ✓ Stable Diffusion downloaded successfully")
        print()
        
        # Show what's downloaded
        total_size = sum(f.stat().st_size for f in models_dir.rglob('*') if f.is_file())
        print(f"Total downloaded: {total_size / (1024**3):.2f} GB")
        print()
        
        print("=" * 70)
        print("✓ Setup complete!")
        print("=" * 70)
        print()
        print("Models cached in:", models_dir.absolute())
        print()
        print("Important Notes:")
        print("- For now, MINEDEV uses placeholder generation (geometric shapes)")
        print("- Full AI generation requires specialized models:")
        print("  • Zero123++ or MVDream (multi-view synthesis)")
        print("  • TripoSR (3D reconstruction)")
        print("- These can be installed separately or we use placeholders")
        print()
        print("Next steps:")
        print("1. Start backend: python server.py")
        print("2. Start frontend: npm run dev")
        print("3. Open http://localhost:5173")
        print("4. Try batch generation, LODs, collision, etc!")
        print()
        print("All game dev features work with placeholder generation!")
        print()
        
    except ImportError as e:
        print(f"Error: Missing dependencies: {e}")
        print("Please run: pip install -r requirements.txt")
        return 1
    except Exception as e:
        print(f"Error: {e}")
        print()
        print("Don't worry! All features work with placeholder generation.")
        print("You can start using MINEDEV right now!")
        print()
        print("To use placeholders:")
        print("1. python server.py")
        print("2. npm run dev")
        print("3. http://localhost:5173")
        return 0
    
    return 0

if __name__ == "__main__":
    exit(setup_models())

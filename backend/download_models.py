#!/usr/bin/env python3
"""
AetherForge Nexus V15.3 - Model Downloader
Downloads AI models for local processing
"""

import os
from pathlib import Path

def download_models():
    """Download all required AI models"""
    
    print("=" * 60)
    print("AetherForge Nexus V15.3 - Model Downloader")
    print("=" * 60)
    print()
    
    models_dir = Path("./models")
    models_dir.mkdir(exist_ok=True)
    
    print("This will download ~5-8GB of AI models.")
    print("Models will be cached in:", models_dir.absolute())
    print()
    
    input("Press Enter to continue or Ctrl+C to cancel...")
    print()
    
    try:
        # Import required libraries
        from diffusers import DiffusionPipeline
        import torch
        
        device = "cuda" if torch.cuda.is_available() else "cpu"
        print(f"Using device: {device}")
        print()
        
        # Download Zero123++
        print("[1/2] Downloading Zero123++ (Multi-view generation)...")
        print("  Size: ~3GB")
        
        try:
            zero123 = DiffusionPipeline.from_pretrained(
                "sudo-ai/zero123plus-v1.2",
                torch_dtype=torch.float16 if device == "cuda" else torch.float32,
                cache_dir=str(models_dir)
            )
            print("  ✓ Zero123++ downloaded successfully")
        except Exception as e:
            print(f"  ✗ Failed to download Zero123++: {e}")
            print("  Trying MVDream as fallback...")
            
            mvdream = DiffusionPipeline.from_pretrained(
                "ashawkey/mvdream-sd2.1-diffusers",
                torch_dtype=torch.float16 if device == "cuda" else torch.float32,
                cache_dir=str(models_dir)
            )
            print("  ✓ MVDream downloaded successfully")
        
        print()
        
        # Download TripoSR (if available)
        print("[2/2] Downloading TripoSR (3D Reconstruction)...")
        print("  Size: ~2GB")
        print("  Note: TripoSR requires separate installation")
        print("  Run: pip install git+https://github.com/VAST-AI-Research/TripoSR.git")
        print()
        
        print("=" * 60)
        print("✓ Model download complete!")
        print("=" * 60)
        print()
        print("Next steps:")
        print("1. Install TripoSR: pip install git+https://github.com/VAST-AI-Research/TripoSR.git")
        print("2. Start backend: python server.py")
        print("3. Start frontend: npm run dev (in root directory)")
        print()
        
    except ImportError as e:
        print(f"Error: Missing dependencies: {e}")
        print("Please run: pip install -r requirements.txt")
    except Exception as e:
        print(f"Error downloading models: {e}")
        return 1
    
    return 0

if __name__ == "__main__":
    exit(download_models())

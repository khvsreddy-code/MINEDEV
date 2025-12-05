#!/usr/bin/env python3
"""
Download AI models for AetherForge Nexus
Simplified version that downloads models with proper trust settings
"""

import os
from pathlib import Path

def download_models():
    print("=" * 60)
    print("MINEDEV - AetherForge Nexus V15.3 - Model Downloader")
    print("=" * 60)
    print()
    
    models_dir = Path("./models")
    models_dir.mkdir(exist_ok=True)
    
    print("Downloading AI models (~5-8GB)...")
    print("This is a one-time download. Models will be cached locally.")
    print()
    
    try:
        from diffusers import DiffusionPipeline
        import torch
        
        device = "cuda" if torch.cuda.is_available() else "cpu"
        print(f"Using device: {device}")
        print()
        
        # Download Zero123++ with trust_remote_code
        print("[1/2] Downloading Zero123++ (Multi-view generation)...")
        print("  Size: ~3GB")
        print("  This may take 10-30 minutes depending on internet speed...")
        
        try:
            zero123 = DiffusionPipeline.from_pretrained(
                "sudo-ai/zero123plus-v1.2",
                torch_dtype=torch.float16 if device == "cuda" else torch.float32,
                cache_dir=str(models_dir),
                trust_remote_code=True  # Required for custom models
            )
            print("  ✓ Zero123++ downloaded successfully")
        except Exception as e:
            print(f"  ⚠ Zero123++ download failed: {e}")
            print("  Trying MVDream as fallback...")
            
            mvdream = DiffusionPipeline.from_pretrained(
                "ashawkey/mvdream-sd2.1-diffusers",
                torch_dtype=torch.float16 if device == "cuda" else torch.float32,
                cache_dir=str(models_dir),
                trust_remote_code=True
            )
            print("  ✓ MVDream downloaded successfully")
        
        print()
        print("=" * 60)
        print("✓ Model download complete!")
        print("=" * 60)
        print()
        print("Models cached in:", models_dir.absolute())
        print()
        print("Next steps:")
        print("1. Install TripoSR (optional): pip install git+https://github.com/VAST-AI-Research/TripoSR.git")
        print("2. Start backend: python server.py")
        print("3. Start frontend: npm run dev (in root directory)")
        print("4. Open http://localhost:5173 and start creating!")
        print()
        
    except ImportError as e:
        print(f"Error: Missing dependencies: {e}")
        print("Please run: pip install -r requirements.txt")
        return 1
    except Exception as e:
        print(f"Error downloading models: {e}")
        print()
        print("Troubleshooting:")
        print("- Check your internet connection")
        print("- Ensure you have ~10GB free disk space")
        print("- Try running again (downloads resume automatically)")
        return 1
    
    return 0

if __name__ == "__main__":
    exit(download_models())

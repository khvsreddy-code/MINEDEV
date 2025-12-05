#!/usr/bin/env python3
"""
MINEDEV - Download Shap-E Model for Real 3D Generation
"""

import os
from pathlib import Path

def download_models():
    print("=" * 70)
    print("MINEDEV - Downloading AI Models")
    print("=" * 70)
    print()
    
    print("Installing Shap-E (OpenAI's Text-to-3D model)...")
    print("This will download ~2GB of model weights")
    print()
    
    try:
        # Import will trigger download of models
        from shap_e.diffusion.sample import sample_latents
        from shap_e.models.download import load_model, load_config
        import torch
        
        device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        print(f"Using device: {device}")
        print()
        
        # Download models
        print("[1/3] Downloading text encoder...")
        model = load_model('text300M', device=device)
        print("  ✓ Text encoder downloaded")
        
        print("[2/3] Downloading transmitter (mesh decoder)...")
        xm = load_model('transmitter', device=device)
        print("  ✓ Transmitter downloaded")
        
        print("[3/3] Loading diffusion config...")
        config = load_config('diffusion')
        print("  ✓ Config loaded")
        
        print()
        print("=" * 70)
        print("✓ Shap-E models downloaded successfully!")
        print("=" * 70)
        print()
        print("You can now generate REAL 3D models from text!")
        print()
        print("Next steps:")
        print("1. Start backend: python server.py")
        print("2. Start frontend: npm run dev")
        print("3. Go to http://localhost:5173")
        print("4. Enter a prompt and generate!")
        print()
        
        return 0
        
    except ImportError as e:
        print(f"Error: {e}")
        print()
        print("Please install shap-e first:")
        print("  pip install shap-e")
        return 1
    except Exception as e:
        print(f"Error downloading models: {e}")
        return 1

if __name__ == "__main__":
    exit(download_models())

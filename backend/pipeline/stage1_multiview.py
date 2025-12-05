# Stage 1: REAL AI Multi-View/3D Generation using Shap-E
# OpenAI's text-to-3D model

import torch
import numpy as np
from PIL import Image
from pathlib import Path

_shap_e_model = None

def load_model():
    """Load Shap-E text-to-3D model"""
    global _shap_e_model
    
    if _shap_e_model is None:
        print("Loading Shap-E text-to-3D model...")
        
        try:
            from shap_e.diffusion.sample import sample_latents
            from shap_e.diffusion.gaussian_diffusion import diffusion_from_config
            from shap_e.models.download import load_model as load_shap_e_model, load_config
            from shap_e.util.notebooks import decode_latent_mesh
            
            device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
            
            print(f"Loading models on {device}...")
            xm = load_shap_e_model('transmitter', device=device)
            model = load_shap_e_model('text300M', device=device)
            diffusion = diffusion_from_config(load_config('diffusion'))
            
            _shap_e_model = {
                'xm': xm,
                'model': model,
                'diffusion': diffusion,
                'device': device,
                'sample_latents': sample_latents,
                'decode_latent_mesh': decode_latent_mesh
            }
            
            print(f"✓ Shap-E loaded successfully on {device}")
            
        except ImportError:
            print("WARNING: Shap-E not installed. Using placeholder generation.")
            _shap_e_model = None
            return None
    
    return _shap_e_model

def generate_multiview_images(prompt: str, num_views: int = 8):
    """
    Generate 3D model using Shap-E text-to-3D
    Returns mesh directly instead of multi-view images
    """
    model_dict = load_model()
    
    if model_dict is None:
        print("Using placeholder generation (Shap-E not available)")
        return generate_placeholder_views(num_views)
    
    print(f"Generating 3D model with Shap-E from prompt: '{prompt}'")
    
    try:
        device = model_dict['device']
        
        # Set random seed for reproducibility
        batch_size = 1
        guidance_scale = 15.0
        
        # Generate latent representation
        latents = model_dict['sample_latents'](
            batch_size=batch_size,
            model=model_dict['model'],
            diffusion=model_dict['diffusion'],
            guidance_scale=guidance_scale,
            model_kwargs=dict(texts=[prompt] * batch_size),
            progress=True,
            clip_denoised=True,
            use_fp16=True,
            use_karras=True,
            karras_steps=64,
            sigma_min=1e-3,
            sigma_max=160,
            s_churn=0,
        )
        
        print("✓ 3D model generated from text")
        
        # Store the latent for later mesh extraction
        # We'll return this as a special marker that stage2 will recognize
        return {
            'type': 'shap_e_latent',
            'latent': latents,
            'xm': model_dict['xm'],
            'device': device,
            'prompt': prompt
        }
        
    except Exception as e:
        print(f"Error in Shap-E generation: {e}")
        print("Falling back to placeholder")
        return generate_placeholder_views(num_views)

def generate_placeholder_views(num_views):
    """Fallback: Generate placeholder data"""
    print(f"Generating {num_views} placeholder views...")
    
    # Create simple colored images as placeholders
    views = []
    for i in range(num_views):
        # Create a simple gradient image
        img = Image.new('RGB', (512, 512), color=(100 + i * 20, 150, 200))
        views.append(img)
    
    return views

if __name__ == "__main__":
    result = generate_multiview_images("a futuristic robot", num_views=6)
    if isinstance(result, dict) and result.get('type') == 'shap_e_latent':
        print("✓ Real AI generation successful!")
    else:
        print("✓ Placeholder generation successful!")

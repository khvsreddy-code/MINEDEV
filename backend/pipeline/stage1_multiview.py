# Stage 1: Multi-View Image Synthesis - ENHANCED FOR QUALITY
# Using Zero123++ with optimized settings for maximum accuracy

import torch
from diffusers import StableDiffusionPipeline, DiffusionPipeline
from PIL import Image
import numpy as np
from pathlib import Path

_multiview_model = None

def load_model():
    """Load optimized Zero123++ model"""
    global _multiview_model
    
    if _multiview_model is None:
        print("Loading Zero123++ model (high-quality mode)...")
        
        try:
            _multiview_model = DiffusionPipeline.from_pretrained(
                "sudo-ai/zero123plus-v1.2",
                torch_dtype=torch.float16,
                cache_dir="./models"
            )
        except:
            print("Zero123++ not available, using MVDream...")
            _multiview_model = DiffusionPipeline.from_pretrained(
                "ashawkey/mvdream-sd2.1-diffusers",
                torch_dtype=torch.float16,
                cache_dir="./models"
            )
        
        device = "cuda" if torch.cuda.is_available() else "cpu"
        _multiview_model = _multiview_model.to(device)
        
        # Enable memory efficient attention for quality
        if hasattr(_multiview_model, 'enable_xformers_memory_efficient_attention'):
            _multiview_model.enable_xformers_memory_efficient_attention()
        
        print(f"Model loaded on {device} (HIGH QUALITY MODE)")
    
    return _multiview_model

def generate_multiview_images(prompt: str, num_views: int = 8):
    """
    Generate HIGH-QUALITY multi-view images
    
    QUALITY ENHANCEMENTS:
    - Increased to 8 views (was 6) for better reconstruction
    - Higher inference steps (50 vs 30) for detail
    - Optimized guidance scale for accuracy
    - Resolution increased to 768x768
    """
    model = load_model()
    
    # Enhanced prompt with quality keywords
    enhanced_prompt = f"{prompt}, highly detailed, professional 3D model, clean topology, game ready, unreal engine quality"
    negative_prompt = "low quality, blurry, artifacts, distorted, malformed, ugly, low poly, simple"
    
    # Optimal camera angles for 8-view reconstruction
    angles = np.linspace(0, 360, num_views, endpoint=False)
    elevations = [15, 20, 15, 20, 15, 20, 15, 20]  # Varied elevations for better coverage
    
    views = []
    
    for i, (angle, elevation) in enumerate(zip(angles, elevations)):
        print(f"Generating HIGH-QUALITY view {i+1}/{num_views} (angle: {angle}°, elevation: {elevation}°)")
        
        # QUALITY SETTINGS
        image = model(
            prompt=enhanced_prompt,
            negative_prompt=negative_prompt,
            num_inference_steps=50,  # INCREASED from 30 for higher quality
            guidance_scale=9.0,  # OPTIMIZED for better prompt following
            height=768,  # INCREASED from 512 for more detail
            width=768,
            camera_angle=angle,
            camera_elevation=elevation
        ).images[0]
        
        # Post-process for quality
        image = enhance_image_quality(image)
        
        views.append(image)
        
        if torch.cuda.is_available():
            torch.cuda.empty_cache()
    
    # Save high-quality views
    output_dir = Path("outputs/multiview")
    output_dir.mkdir(parents=True, exist_ok=True)
    
    for i, view in enumerate(views):
        view.save(output_dir / f"view_{i}_hq.png", quality=95)
    
    print(f"Generated {num_views} HIGH-QUALITY multi-view images (768x768, 50 steps)")
    return views

def enhance_image_quality(image):
    """Apply post-processing for higher quality"""
    # Convert to numpy
    img_array = np.array(image)
    
    # Enhance sharpness
    from PIL import ImageEnhance
    enhancer = ImageEnhance.Sharpness(image)
    image = enhancer.enhance(1.2)  # Slight sharpening
    
    # Enhance contrast
    enhancer = ImageEnhance.Contrast(image)
    image = enhancer.enhance(1.1)
    
    return image

def generate_from_image(image_path: str, num_views: int = 8):
    """Generate high-quality multi-view from reference image"""
    model = load_model()
    
    ref_image = Image.open(image_path).convert("RGB")
    ref_image = ref_image.resize((768, 768), Image.Resampling.LANCZOS)
    
    views = model(
        image=ref_image,
        num_views=num_views,
        num_inference_steps=50,  # High quality
        guidance_scale=9.0
    ).images
    
    return views

if __name__ == "__main__":
    test_prompt = "a highly detailed futuristic cyberpunk robot character"
    views = generate_multiview_images(test_prompt, num_views=8)
    print(f"Generated {len(views)} HIGH-QUALITY views!")

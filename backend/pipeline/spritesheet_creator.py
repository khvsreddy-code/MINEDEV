# Spritesheet Creator and Animator
# Generate and animate spritesheets for 2D games

import cv2
import numpy as np
from PIL import Image
import imageio
from pathlib import Path

class SpritesheetCreator:
    """Create and animate spritesheets"""
    
    def __init__(self):
        self.frame_size = (64, 64)  # Default sprite size
    
    def create_spritesheet(self, frames: list, cols: int = 8, padding: int = 2) -> np.ndarray:
        """
        Create spritesheet from individual frames
        
        Args:
            frames: List of frame images (numpy arrays)
            cols: Number of columns in spritesheet
            padding: Pixels between frames
        
        Returns:
            Combined spritesheet image
        """
        if not frames:
            return None
        
        # Calculate dimensions
        frame_h, frame_w = frames[0].shape[:2]
        rows = (len(frames) + cols - 1) // cols
        
        sheet_w = cols * frame_w + (cols - 1) * padding
        sheet_h = rows * frame_h + (rows - 1) * padding
        
        # Create spritesheet
        channels = 4 if len(frames[0].shape) == 3 and frames[0].shape[2] == 4 else 3
        spritesheet = np.zeros((sheet_h, sheet_w, channels), dtype=np.uint8)
        
        # Place frames
        for idx, frame in enumerate(frames):
            row = idx // cols
            col = idx % cols
            
            y = row * (frame_h + padding)
            x = col * (frame_w + padding)
            
            spritesheet[y:y+frame_h, x:x+frame_w] = frame
        
        return spritesheet
    
    def generate_animation_frames(self, animation_type: str, sprite_size: tuple = (64, 64)) -> list:
        """
        Generate animation frames for common actions
        
        Args:
            animation_type: 'walk', 'run', 'jump', 'idle', 'attack'
            sprite_size: Size of each frame
        
        Returns:
            List of animation frames
        """
        frames = []
        w, h = sprite_size
        
        if animation_type == 'walk':
            # Generate 8-frame walk cycle
            for i in range(8):
                frame = np.zeros((h, w, 4), dtype=np.uint8)
                # Simple stick figure walk animation
                # (In production, this would be actual sprite art or AI-generated)
                frame = self._draw_stick_figure(frame, i, 'walk')
                frames.append(frame)
        
        elif animation_type == 'idle':
            # Generate 4-frame idle animation
            for i in range(4):
                frame = np.zeros((h, w, 4), dtype=np.uint8)
                frame = self._draw_stick_figure(frame, i, 'idle')
                frames.append(frame)
        
        elif animation_type == 'jump':
            # Generate 6-frame jump animation
            for i in range(6):
                frame = np.zeros((h, w, 4), dtype=np.uint8)
                frame = self._draw_stick_figure(frame, i, 'jump')
                frames.append(frame)
        
        elif animation_type == 'attack':
            # Generate 5-frame attack animation
            for i in range(5):
                frame = np.zeros((h, w, 4), dtype=np.uint8)
                frame = self._draw_stick_figure(frame, i, 'attack')
                frames.append(frame)
        
        return frames
    
    def _draw_stick_figure(self, frame: np.ndarray, step: int, action: str) -> np.ndarray:
        """
        Draw simple stick figure for animation
        (Placeholder - in production would be actual sprites or AI-generated)
        """
        h, w = frame.shape[:2]
        center_x, center_y = w // 2, h // 2
        
        # Head
        cv2.circle(frame, (center_x, center_y - 15), 8, (255, 200, 150, 255), -1)
        
        # Body
        cv2.line(frame, (center_x, center_y - 7), (center_x, center_y + 10), (100, 100, 255, 255), 2)
        
        # Legs (animated based on step)
        if action == 'walk':
            leg_offset = int(np.sin(step * np.pi / 4) * 5)
            cv2.line(frame, (center_x, center_y + 10), (center_x - 5, center_y + 25 + leg_offset), (100, 100, 255, 255), 2)
            cv2.line(frame, (center_x, center_y + 10), (center_x + 5, center_y + 25 - leg_offset), (100, 100, 255, 255), 2)
        elif action == 'jump':
            y_offset = int(np.sin(step * np.pi / 3) * 10)
            cv2.line(frame, (center_x, center_y + 10), (center_x - 5, center_y + 20 - y_offset), (100, 100, 255, 255), 2)
            cv2.line(frame, (center_x, center_y + 10), (center_x + 5, center_y + 20 - y_offset), (100, 100, 255, 255), 2)
        else:
            cv2.line(frame, (center_x, center_y + 10), (center_x - 5, center_y + 25), (100, 100, 255, 255), 2)
            cv2.line(frame, (center_x, center_y + 10), (center_x + 5, center_y + 25), (100, 100, 255, 255), 2)
        
        # Arms
        arm_offset = int(np.sin(step * np.pi / 4) * 3) if action == 'walk' else 0
        cv2.line(frame, (center_x, center_y), (center_x - 10, center_y + 5 + arm_offset), (100, 100, 255, 255), 2)
        cv2.line(frame, (center_x, center_y), (center_x + 10, center_y + 5 - arm_offset), (100, 100, 255, 255), 2)
        
        return frame
    
    def export_spritesheet(self, spritesheet: np.ndarray, output_path: str):
        """Export spritesheet to file"""
        output_path = Path(output_path)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        
        Image.fromarray(spritesheet).save(output_path)
        print(f"Spritesheet saved to: {output_path}")
    
    def export_gif(self, frames: list, output_path: str, duration: float = 0.1):
        """Export frames as animated GIF"""
        output_path = Path(output_path)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        
        # Convert to PIL images
        pil_frames = [Image.fromarray(f) for f in frames]
        
        # Save as GIF
        pil_frames[0].save(
            output_path,
            save_all=True,
            append_images=pil_frames[1:],
            duration=int(duration * 1000),
            loop=0
        )
        print(f"Animation saved to: {output_path}")

# Example usage
if __name__ == "__main__":
    creator = SpritesheetCreator()
    
    # Generate walk animation
    walk_frames = creator.generate_animation_frames('walk', (64, 64))
    walk_sheet = creator.create_spritesheet(walk_frames, cols=8)
    creator.export_spritesheet(walk_sheet, "outputs/walk_spritesheet.png")
    creator.export_gif(walk_frames, "outputs/walk_animation.gif")
    
    print("Spritesheet and animation created!")

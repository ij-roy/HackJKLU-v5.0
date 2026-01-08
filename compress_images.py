import os
from PIL import Image

gallery_path = r"c:\Users\HP\OneDrive\Desktop\HackJKLU-v5.0\src\assets\gallery"
max_dimension = 1200
quality = 70

print(f"Compressing images in {gallery_path}...")

for filename in os.listdir(gallery_path):
    if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
        filepath = os.path.join(gallery_path, filename)
        try:
            with Image.open(filepath) as img:
                # Calculate new size
                width, height = img.size
                if width > max_dimension or height > max_dimension:
                    if width > height:
                        new_width = max_dimension
                        new_height = int(height * (max_dimension / width))
                    else:
                        new_height = max_dimension
                        new_width = int(width * (max_dimension / height))
                    
                    img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
                    
                # Save
                # Force convert to RGB for JPG compatibility
                if img.mode in ('RGBA', 'P'): 
                    img = img.convert('RGB')
                
                img.save(filepath, "JPEG", quality=quality, optimize=True)
                print(f"Compressed {filename}")
        except Exception as e:
            print(f"Error processing {filename}: {e}")

print("Compression complete.")

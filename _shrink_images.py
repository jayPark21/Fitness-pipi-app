from PIL import Image
import os

path = "src/assets/pipi/"
files = [f for f in os.listdir(path) if f.endswith(".png")]

for f in files:
    img_path = os.path.join(path, f)
    with Image.open(img_path) as img:
        print(f"Processing {f}: {img.size}")
        
        # Calculate new size (max width 600 or height 600, maintain aspect ratio)
        max_size = 600
        width, height = img.size
        
        if width > max_size or height > max_size:
            if width > height:
                new_width = max_size
                new_height = int(height * (max_size / width))
            else:
                new_height = max_size
                new_width = int(width * (max_size / height))
            
            img = img.resize((new_width, new_height), Image.LANCZOS)
            print(f"Resized to {img.size}")
        
        # Save with optimization
        img.save(img_path, "PNG", optimize=True)
        new_size = os.path.getsize(img_path) / 1024
        print(f"Saved {f}, new size: {new_size:.2f} KB")

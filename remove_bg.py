import os
from PIL import Image

def remove_background(file_path):
    if not os.path.exists(file_path):
        print(f'File not found: {file_path}')
        return
    try:
        img = Image.open(file_path).convert('RGBA')
        datas = img.getdata()
        
        newData = []
        for item in datas:
            # If the pixel is very white (R,G,B > 245), make it transparent
            if item[0] > 245 and item[1] > 245 and item[2] > 245:
                # Keep original color but set alpha to 0
                newData.append((item[0], item[1], item[2], 0))
            else:
                newData.append(item)
        
        img.putdata(newData)
        img.save(file_path, 'PNG')
        print(f'Successfully processed {file_path}')
    except Exception as e:
        print(f'Error processing {file_path}: {e}')

base_path = 'src/assets/pipi/'
targets = ['egg.png', 'cracked.png', 'baby.png', 'adult.png', 'adult_cap.png', 'adult_crown.png', 'adult_shades.png']

for target in targets:
    remove_background(os.path.join(base_path, target))

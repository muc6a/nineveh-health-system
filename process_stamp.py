from PIL import Image

def remove_white_bg(img_path, out_path):
    img = Image.open(img_path).convert("RGBA")
    data = img.getdata()
    
    new_data = []
    for item in data:
        # Check if the pixel is white or almost white
        # We also want to smooth the edges slightly by adjusting alpha based on whiteness if possible
        # but a simple threshold is usually enough for a quick fix
        if item[0] > 230 and item[1] > 230 and item[2] > 230:
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)
            
    img.putdata(new_data)
    img.save(out_path, "PNG")

remove_white_bg(
    "/Users/admin/.gemini/antigravity-ide/brain/f0ef84cf-fdc1-4a81-b542-aca69f79b713/media__1784975294775.jpg",
    "/Users/admin/web/منظومة الرقابة الصحية الرقمية/public/stamp-transparent.png"
)

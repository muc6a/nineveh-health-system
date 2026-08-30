import os
import glob

def patch_file(filepath, replacements):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    new_content = content
    for old_str, new_str in replacements:
        new_content = new_content.replace(old_str, new_str)
        
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")

def main():
    src_dir = 'src'
    
    # 1. Rename "الأوامر والتوجيهات الرسمية" -> "التبليغات"
    # 2. Rename "تقارير مالية الغرامات" -> "المالية"
    # 3. Rename "التقارير المالية (الغرامات)" -> "المالية"
    # 4. Rename "التقييمات العامة (الشكاوى)" -> "شكاوى المواطنين"
    # 5. Rename "تطبيق كراس الغرامات: " -> "" (empty)
    # 6. Rename "تاريخ الاستلام" -> "تاريخ إصدار المخالفة"
    
    replacements = [
        ("الأوامر والتوجيهات الرسمية", "التبليغات"),
        ("تقارير مالية الغرامات", "المالية"),
        ("التقارير المالية (الغرامات)", "المالية"),
        ("التقييمات العامة (الشكاوى)", "شكاوى المواطنين"),
        ("تطبيق كراس الغرامات: ", ""),
        ("تاريخ الاستلام", "تاريخ إصدار المخالفة")
    ]
    
    for filepath in glob.glob(f"{src_dir}/**/*.jsx", recursive=True):
        patch_file(filepath, replacements)
        
    for filepath in glob.glob(f"{src_dir}/**/*.js", recursive=True):
        patch_file(filepath, replacements)

if __name__ == "__main__":
    main()

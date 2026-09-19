import re

def clean_bottom():
    path = "src/components/OperationsRoom.jsx"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # Find the string "</div>\n      )}\n    \n      {(user?.permissions?.showSectorMap"
    idx = content.find("</div>\n      )}\n    \n      {(user?.permissions?.showSectorMap")
    if idx != -1:
        # Keep everything up to "</div>\n      )}"
        new_content = content[:idx] + "</div>\n      )}\n\n    </div>\n  );\n}\n"
        with open(path, "w", encoding="utf-8") as f:
            f.write(new_content)
        print("Cleaned bottom map and smart tasks")
    else:
        print("Could not find the target string")
        
if __name__ == "__main__":
    clean_bottom()

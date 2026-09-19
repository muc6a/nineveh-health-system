import re

def update_lab():
    path = "src/utils/constants.jsx"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # Remove 'centralLabView' from the keys of lab in PERMISSIONS_TABS
    content = content.replace(", 'centralLabView'", "")
    content = content.replace("'centralLabView', ", "")

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

if __name__ == "__main__":
    update_lab()

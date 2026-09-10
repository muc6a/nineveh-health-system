import re

with open("src/components/NotificationBell.jsx", "r", encoding="utf-8") as f:
    content = f.read()

# Update sound type
if "playBeep('info')" in content:
    content = content.replace("playBeep('info')", "playBeep('notification')")

with open("src/components/NotificationBell.jsx", "w", encoding="utf-8") as f:
    f.write(content)

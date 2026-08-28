import re

filepath = "/Users/admin/web/منظومة الرقابة الصحية الرقمية/src/pages/LoginGate.jsx"
with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Remove the glowing divs
target_glows = """      <div className="w-full max-w-lg glassmorphic-card p-6 md:p-8 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>"""

replacement_glows = """      <div className="w-full max-w-lg glassmorphism-card p-6 md:p-8 relative overflow-hidden">"""
content = content.replace(target_glows, replacement_glows)

# 2. Update copyright text
target_copy = """            جميع الحقوق محفوظة © 2026 - تم التصميم والتطوير بواسطة نعناع تك LLC"""
replacement_copy = """            جميع الحقوق محفوظة © 2026 - تم التصميم والتطوير بواسطة Nana Tech"""
content = content.replace(target_copy, replacement_copy)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated LoginGate.jsx")

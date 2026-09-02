import re

with open('src/pages/AccountantPanel.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

start = content.find("Tab: Reconciliation")
end = content.find("Tab: Comprehensive Reports")

block = content[start:end]
div_open = block.count('<div')
div_close = block.count('</div')
print(f"reconciliation: open {div_open}, close {div_close}, diff {div_open - div_close}")

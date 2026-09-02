with open('src/pages/AccountantPanel.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

main_start = content.find('<main')
main_end = content.find('</main>')

main_content = content[main_start:main_end]

div_open = main_content.count('<div')
div_close = main_content.count('</div')

print(f"div open: {div_open}, div close: {div_close}")

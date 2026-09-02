with open('src/pages/AccountantPanel.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

modal_start = content.find('{showPayFineModal && (')
if modal_start != -1:
    modal_snippet = content[modal_start:modal_start+500]
    print(modal_snippet)
else:
    print("Modal not found!")

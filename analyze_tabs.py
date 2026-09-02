import re

with open('src/pages/AccountantPanel.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

def analyze_block(name, start_str, end_str):
    start = content.find(start_str)
    end = content.find(end_str, start)
    if start == -1 or end == -1:
        print(f"Could not find {name}")
        return
    block = content[start:end]
    div_open = block.count('<div')
    div_close = block.count('</div')
    print(f"{name}: open {div_open}, close {div_close}, diff {div_open - div_close}")

analyze_block('dashboard', "{activeTab === 'dashboard' && (", "{showPayFineModal && (")
analyze_block('modal', "{showPayFineModal && (", "{activeTab === 'directives' && (")
analyze_block('directives', "{activeTab === 'directives' && (", "{activeTab === 'reconciliation' && (")
analyze_block('reconciliation', "{activeTab === 'reconciliation' && (", "{activeTab === 'comprehensive_reports' && (")
analyze_block('comprehensive', "{activeTab === 'comprehensive_reports' && hasPerm", "{/* Embedded Tabs */}")


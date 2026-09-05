import re

with open("src/components/FinancialReports.jsx", "r", encoding="utf-8") as f:
    content = f.read()

# Wrap the detailed ledger (السجل التفصيلي)
ledger_pattern = r"(<div className=\"glassmorphic-card p-6 mt-8 overflow-x-auto\">.*?</table>\s*</div>\s*</div>)"
content = re.sub(ledger_pattern, r"{hasPerm('financialReports') && \1}", content, flags=re.DOTALL)

with open("src/components/FinancialReports.jsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Wrapped ledger in FinancialReports")

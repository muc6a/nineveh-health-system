import re

def fix_sidebar(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Fix sidebar button
    pattern = r"\{hasPerm\('financialReports'\) && \(\s*<button\s*onClick=\{\(\) => \{ setActiveTab\('financials'\);"
    replacement = r"{(hasPerm('financialReports') || hasPerm('payFines') || hasPerm('dailyInventory')) && (\n              <button\n                onClick={() => { setActiveTab('financials');"
    content = re.sub(pattern, replacement, content)

    # 2. Fix the activeTab rendering block
    pattern2 = r"\{activeTab === 'financials' && hasPerm\('financialReports'\) && \("
    replacement2 = r"{activeTab === 'financials' && (hasPerm('financialReports') || hasPerm('payFines') || hasPerm('dailyInventory')) && ("
    content = re.sub(pattern2, replacement2, content)

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

fix_sidebar("src/pages/TeamDashboard.jsx")
fix_sidebar("src/pages/ExecutivePortal.jsx")
print("Fixed TeamDashboard & ExecutivePortal")

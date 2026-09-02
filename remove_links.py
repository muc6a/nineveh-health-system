import re

def remove_link_team_dashboard():
    with open('src/pages/TeamDashboard.jsx', 'r', encoding='utf-8') as f:
        content = f.read()

    # The button starts with <button and contains "انتقال للصفحة" and ends with </button>
    pattern = r'<button[^>]*onClick=\{[^}]*window\.open[^}]*\}[^>]*>[\s\S]*?🔗 انتقال للصفحة[\s\S]*?</button>'
    
    content = re.sub(pattern, '', content)

    with open('src/pages/TeamDashboard.jsx', 'w', encoding='utf-8') as f:
        f.write(content)

def remove_link_est_modal():
    with open('src/components/EstablishmentModal.jsx', 'r', encoding='utf-8') as f:
        content = f.read()

    # The button contains "انتقال لصفحة السجل"
    pattern = r'<button[^>]*onClick=\{[^}]*window\.open[^}]*\}[^>]*>[\s\S]*?🔗 انتقال لصفحة السجل[\s\S]*?</button>'
    
    content = re.sub(pattern, '', content)

    with open('src/components/EstablishmentModal.jsx', 'w', encoding='utf-8') as f:
        f.write(content)

remove_link_team_dashboard()
remove_link_est_modal()
print("Removed dead links")

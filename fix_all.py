import re

# --- 1. Fix Duplicated Edit Button in TeamDashboard ---
with open('src/pages/TeamDashboard.jsx', 'r', encoding='utf-8') as f:
    team_dash = f.read()

# We need to find "تعديل منشأة". Let's print out the lines with it.

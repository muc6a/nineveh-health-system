import re

path_acc = "src/pages/AccountantPanel.jsx"
with open(path_acc, "r", encoding="utf-8") as f:
    acc_content = f.read()

# 1. Fix sectorFines logic
bad_sectorFines_regex = r"const sectorFines = allFines\.filter\(f => \{\s*const estSector = getEstablishmentSector\(f\.establishmentId \|\| f\.estId\);\s*\}\);"
fixed_sectorFines = """const sectorFines = allFines.filter(f => {
    const estSector = getEstablishmentSector(f.establishmentId || f.estId);
    return targetSector === 'الكل' || estSector === targetSector || (estSector && estSector.includes(targetSector));
  });"""
acc_content = re.sub(bad_sectorFines_regex, fixed_sectorFines, acc_content)

# 2. Remove permissions text
permissions_regex = r'<span className="text-\[9px\] text-slate-500 font-bold mt-1">\s*الصلاحيات المفعلة:.*?</span>'
acc_content = re.sub(permissions_regex, "", acc_content, flags=re.DOTALL)

with open(path_acc, "w", encoding="utf-8") as f:
    f.write(acc_content)


path_live = "src/components/LiveSupportWidget.jsx"
with open(path_live, "r", encoding="utf-8") as f:
    live_content = f.read()

live_content = live_content.replace("'غرفة العمليات المركزية'", "'الرقابة المركزية'")
live_content = live_content.replace("'operations', label: 'غرفة العمليات المركزية'", "'operations', label: 'الرقابة المركزية'")
live_content = live_content.replace("الدعم المباشر", "الرقابة المركزية والدعم")

roles_logic_pattern = r"""\s*// 2\. Accountants.*?// 4\. Labs"""
roles_logic_replacement = """
  // 2. Accountants
  (accountants || []).forEach(acc => {
    if (acc.id === user?.id) return;
    if (user?.role === 'financial_accountant' || user?.role === 'team_leader') {
      if (user?.sector && user?.sector !== 'الكل' && acc.sector && !acc.sector.includes(user.sector) && !user.sector.includes(acc.sector)) return;
    }
    roles.push({
      id: acc.id,
      label: `محاسب ${acc.name} - ${acc.sector || 'عموم نينوى'}`,
      sector: acc.sector || 'all'
    });
  });

  // 3. Teams
  (teams || []).forEach(t => {
    if (t.id === user?.id) return;
    if (user?.role === 'financial_accountant' || user?.role === 'team_leader') {
      if (user?.sector && user?.sector !== 'الكل' && t.sector && !t.sector.includes(user.sector) && !user.sector.includes(t.sector)) return;
    }
    roles.push({
      id: t.id,
      label: `فريق: ${t.name} - ${t.sector || 'عموم نينوى'}`,
      sector: t.sector || 'all'
    });
  });

  // 4. Labs"""
live_content = re.sub(roles_logic_pattern, roles_logic_replacement, live_content, flags=re.DOTALL)

with open(path_live, "w", encoding="utf-8") as f:
    f.write(live_content)

print("Done")

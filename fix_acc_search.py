import re

file_path = "src/pages/AccountantPanel.jsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Fix getEstablishmentSector case sensitivity
sec_target = "const est = establishments.find(e => e.id === estId);"
sec_replace = "const est = establishments.find(e => String(e.id).toLowerCase() === String(estId).toLowerCase());"
content = content.replace(sec_target, sec_replace)

# Fix handleSearchFine case sensitivity for targetFine and targetEst
# It currently has:
# targetEst = establishments.find(e => String(e.id) === String(targetFine.establishmentId || targetFine.estId));
# targetFine = pendingFines.find(f => String(f.establishmentId || f.estId) === String(est.id));
targetEst_match = "targetEst = establishments.find(e => String(e.id) === String(targetFine.establishmentId || targetFine.estId));"
targetEst_replace = "targetEst = establishments.find(e => String(e.id).toLowerCase() === String(targetFine.establishmentId || targetFine.estId).toLowerCase());"
content = content.replace(targetEst_match, targetEst_replace)

targetFine_match = "targetFine = pendingFines.find(f => String(f.establishmentId || f.estId) === String(est.id));"
targetFine_replace = "targetFine = pendingFines.find(f => String(f.establishmentId || f.estId).toLowerCase() === String(est.id).toLowerCase());"
content = content.replace(targetFine_match, targetFine_replace)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Accountant search fixed.")

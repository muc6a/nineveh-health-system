import re

with open('src/pages/TeamDashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove the fallback screen entirely if the user role is team.
# Since team always has core basics, it never needs this screen.
# The fallback screen looks like:
#         {!hasPerm('showMainDashboard') && !hasPerm('manageEstablishments') && !hasPerm('showReportsPage') && !hasPerm('showDirectivesPage') && !hasPerm('showDeliveryPage') && !hasPerm('showPublicEvalsPage') && (
#           <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
#             ...
#           </div>
#         )}

fallback_pattern = r"\{!hasPerm\('showMainDashboard'\) && !hasPerm\('manageEstablishments'\) && !hasPerm\('showReportsPage'\) && !hasPerm\('showDirectivesPage'\) && !hasPerm\('showDeliveryPage'\) && !hasPerm\('showPublicEvalsPage'\) && \(\s*<div className=\"flex flex-col items-center justify-center h-\[60vh\] text-center space-y-4\">[\s\S]*?</p>\s*</div>\s*\)\}"
content = re.sub(fallback_pattern, "", content)

# Remove it from ExecutivePortal as well to be safe, if we are modifying fallback logic.
# Wait, ExecutivePortal DOES need a fallback if an admin revokes all their permissions.
# But for Team, the core basics are indestructible.

with open('src/pages/TeamDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(content)


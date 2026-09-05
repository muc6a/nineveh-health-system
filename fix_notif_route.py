import re

with open('src/components/NotificationBell.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Update NotificationBell routing for team
old_route = """                      if (user.role === 'operations' || user.role === 'central_director') {
                        window.location.hash = '/dashboard/director';
                        setTimeout(() => window.dispatchEvent(new CustomEvent('navToLabResults')), 100);
                      } else if (user.role === 'lab') {
                         window.location.hash = '/dashboard/lab';
                      }"""

new_route = """                      if (user.role === 'operations' || user.role === 'central_director' || user.role === 'director' || user.isDirector) {
                        window.location.hash = '/dashboard/director';
                        setTimeout(() => window.dispatchEvent(new CustomEvent('navToLabResults')), 100);
                      } else if (user.role === 'lab') {
                         window.location.hash = '/dashboard/lab';
                      } else if (user.role === 'team' || user.isTeam) {
                         window.location.hash = '/dashboard/team';
                         setTimeout(() => window.dispatchEvent(new CustomEvent('navToLabResults')), 100);
                      }"""

content = content.replace(old_route, new_route)

with open('src/components/NotificationBell.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated NotificationBell routing")

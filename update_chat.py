import os

file_path = "src/components/LiveSupportWidget.jsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

import re

# We will replace the roles building logic from line 18 to 70 with a new robust logic

new_logic = """
  // Build contact list (roles)
  const roles = [];
  
  // Add Operations roles
  if (user?.role !== 'operations') {
    roles.push({ id: 'operations', label: 'غرفة العمليات المركزية', sector: 'all' });
  }
  if (user?.role !== 'central_director') {
    roles.push({ id: 'central_director', label: 'مدير الرقابة المركزية', sector: 'all' });
  }
  if (user?.role !== 'director') {
    roles.push({ id: 'director', label: 'مدير عام صحة نينوى', sector: 'all' });
  }

  // Helper to check sector match
  const matchesSector = (itemSector) => {
    if (isOperations) return true; // Ops sees all
    if (!user?.sector || user?.sector === 'الكل' || itemSector === 'الكل') return true;
    return user.sector.includes(itemSector) || itemSector.includes(user.sector);
  };

  // Add Accountants to contacts
  (accountants || []).forEach(acc => {
    if (acc.id === user?.id) return;
    if (isOperations || (!isAccountant && matchesSector(acc.sector))) {
      roles.push({ id: acc.id, label: `محاسب: ${acc.name} - ${acc.sector || 'عموم'}`, sector: acc.sector || 'all' });
    }
  });

  // Add Teams to contacts
  (teams || []).forEach(t => {
    if (t.id === user?.id) return;
    if (isOperations || matchesSector(t.sector)) {
      roles.push({ id: t.id, label: `فريق: ${t.name} - ${t.sector || 'عموم'}`, sector: t.sector || 'all' });
    }
  });
  
  // Add Trackers to contacts
  (trackers || []).forEach(tr => {
    if (tr.id === user?.id) return;
    if (isOperations || matchesSector(tr.sector)) {
      roles.push({ id: tr.id, label: `متابع ميداني: ${tr.name} - ${tr.sector || 'عموم'}`, sector: tr.sector || 'all' });
    }
  });

  // Add Labs to contacts
  (labs || []).forEach(l => {
    if (l.id === user?.id) return;
    if (isOperations || matchesSector(l.sector)) {
      roles.push({ id: l.id, label: `المختبر: ${l.name}`, sector: 'all' });
    }
  });
  
  // Also add anyone who has actively sent us a message recently if they aren't in the list
  (chatMessages || []).forEach(msg => {
    // If msg is sent to me or my role
    if (msg.targetRole === user?.id || msg.targetRole === user?.role || (isOperations && msg.targetRole === 'operations')) {
       // if the sender is not me, and not already in roles
       if (msg.senderId !== user?.id && !roles.find(r => r.id === msg.senderId) && !roles.find(r => r.id === msg.senderRole)) {
           roles.push({ id: msg.senderId || msg.senderRole, label: msg.senderName || 'جهة اتصال غير معروفة', sector: 'all' });
       }
    }
  });
"""

# Replace the block from `// Build contact list (roles)` down to `// Add Labs to contacts ... });`
start_marker = "// Build contact list (roles)"
end_marker = "const currentRoleObj = roles.find(r => r.id === targetRole);"

pattern = re.compile(re.escape(start_marker) + r".*?" + r"(?=" + re.escape(end_marker) + r")", re.DOTALL)
content = pattern.sub(new_logic + "\n  ", content)

# Also fix the `relevantMessages` logic so it works with the new flexible targetRole

new_relevant_logic = """
  // Isolate conversation to prevent crosstalk
  const relevantMessages = (chatMessages || []).filter(msg => {
    // Basic definition of me
    const toMe = msg.targetRole === user?.id || msg.targetRole === user?.role || (isOperations && msg.targetRole === 'operations');
    const fromMe = msg.senderId === user?.id || msg.senderRole === user?.role;
    
    // Target could be an ID (user id) or a Role (e.g. operations)
    const toTarget = msg.targetRole === targetRole;
    const fromTarget = msg.senderId === targetRole || msg.senderRole === targetRole;
    
    if (targetRole === 'operations' || targetRole === 'central_director' || targetRole === 'director') {
       // Chatting with a role
       return (fromMe && toTarget) || (fromTarget && toMe);
    } else {
       // Chatting with a specific user (id)
       return (fromMe && msg.targetRole === targetRole) || (msg.senderId === targetRole && toMe);
    }
  }).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
"""

start_marker2 = "// Isolate conversation to prevent crosstalk"
end_marker2 = "// Global unread badge for me"

pattern2 = re.compile(re.escape(start_marker2) + r".*?" + r"(?=" + re.escape(end_marker2) + r")", re.DOTALL)
content = pattern2.sub(new_relevant_logic + "\n  ", content)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("LiveSupportWidget updated.")

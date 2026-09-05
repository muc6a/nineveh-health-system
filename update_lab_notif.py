import re

with open('src/pages/LabDashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_notif = """    // Notify operations if contaminated
    if (isContaminated) {
      setSystemNotifications(prev => [{
        id: 'notif_' + Date.now(),
        title: '🚨 عينة ملوثة مختبرياً!',
        message: `تم ثبوت تلوث العينة المرسلة من ${resultModal.request.teamName} للمنشأة (${resultModal.request.estName}). يرجى اتخاذ القرار الإداري بالغلق أو الغرامة.`,
        date: new Date().toISOString(),
        isRead: false,
        targetRole: 'operations',
        relatedLabRequestId: reqId
      }, ...prev]);"""

new_notif = """    // Notify operations if contaminated
    if (isContaminated) {
      setSystemNotifications(prev => [{
        id: 'notif_' + Date.now() + '1',
        title: '🚨 عينة ملوثة مختبرياً!',
        message: `تم ثبوت تلوث العينة المرسلة من ${resultModal.request.teamName} للمنشأة (${resultModal.request.estName}). يرجى اتخاذ القرار الإداري بالغلق أو الغرامة.`,
        date: new Date().toISOString(),
        isRead: false,
        targetRole: 'operations',
        relatedLabRequestId: reqId
      },
      {
        id: 'notif_' + Date.now() + '2',
        title: '🚨 عينة ملوثة مختبرياً!',
        message: `تم ثبوت تلوث العينة المرسلة من قبلكم للمنشأة (${resultModal.request.estName}).`,
        date: new Date().toISOString(),
        isRead: false,
        targetRole: resultModal.request.teamId,
        relatedLabRequestId: reqId
      }, ...prev]);"""

content = content.replace(old_notif, new_notif)

with open('src/pages/LabDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated lab notification routing")

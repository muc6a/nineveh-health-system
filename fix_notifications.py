import os

replacements = {
    "src/pages/TrackerDashboard.jsx": [
        ("addSystemNotification(\n        'تم تأكيد إغلاق منشأة 🔒',\n        `المتابع السري (${user.name}) أكد إغلاق منشأة (${est.name})`,\n        'operations'\n      );",
         "addSystemNotification(\n        'تم تأكيد إغلاق منشأة 🔒',\n        `المتابع السري (${user.name}) أكد إغلاق منشأة (${est.name})`,\n        'operations',\n        'closures'\n      );"),
        ("addSystemNotification(\n        'مخالفة لقرار الإغلاق 🚨',\n        `المتابع السري (${user.name}) أفاد بأن منشأة (${est.name}) مفتوحة وتمارس العمل رغم قرار الإغلاق!`,\n        'operations'\n      );",
         "addSystemNotification(\n        'مخالفة لقرار الإغلاق 🚨',\n        `المتابع السري (${user.name}) أفاد بأن منشأة (${est.name}) مفتوحة وتمارس العمل رغم قرار الإغلاق!`,\n        'operations',\n        'closures'\n      );")
    ],
    "src/pages/OwnerPortal.jsx": [
        ("addSystemNotification('مهمة ميدانية جديدة 📋', `المنشأة (${ownerEst.name}) تطلب إعادة كشف.`, 'team');",
         "addSystemNotification('مهمة ميدانية جديدة 📋', `المنشأة (${ownerEst.name}) تطلب إعادة كشف.`, 'team', 'tasks');"),
        ("addSystemNotification('طلب إعادة كشف وارد 🔄', `صاحب المنشأة (${ownerEst.name}) يطلب إعادة كشف.`, 'admin');",
         "addSystemNotification('طلب إعادة كشف وارد 🔄', `صاحب المنشأة (${ownerEst.name}) يطلب إعادة كشف.`, 'admin', 'tasks');")
    ],
    "src/components/OperationsRoom.jsx": [
        ("addSystemNotification(\n        'توجيه بإغلاق منشأة 🔒',\n        `تم توجيه أمر إغلاق فوري للمنشأة (${est.name}).`,\n        teamId\n      );",
         "addSystemNotification(\n        'توجيه بإغلاق منشأة 🔒',\n        `تم توجيه أمر إغلاق فوري للمنشأة (${est.name}).`,\n        teamId,\n        'closures'\n      );"),
        ("addSystemNotification(\n      'تم استيفاء غرامة 💰',\n      `تم استيفاء غرامة مالية قدرها ${formatCurrency(amount)} من منشأة (${est.name})`,\n      'admin'\n    );",
         "addSystemNotification(\n      'تم استيفاء غرامة 💰',\n      `تم استيفاء غرامة مالية قدرها ${formatCurrency(amount)} من منشأة (${est.name})`,\n      'admin',\n      'penalties'\n    );"),
        ("addSystemNotification(\n      'تم رفع قرار الإغلاق 🔓',\n      `تم السماح بفتح منشأة (${est.name}) مجدداً.`,\n      teamId\n    );",
         "addSystemNotification(\n      'تم رفع قرار الإغلاق 🔓',\n      `تم السماح بفتح منشأة (${est.name}) مجدداً.`,\n      teamId,\n      'closures'\n    );")
    ],
    "src/components/CriticalAlertModal.jsx": [
        ("addSystemNotification(\n      'طلب إغلاق منشأة 🚨',\n      `طلب فريق (${user.name}) إغلاق منشأة (${estName}) لسبب: ${reason}`,\n      'operations'\n    );",
         "addSystemNotification(\n      'طلب إغلاق منشأة 🚨',\n      `طلب فريق (${user.name}) إغلاق منشأة (${estName}) لسبب: ${reason}`,\n      'operations',\n      'closures'\n    );"),
        ("addSystemNotification(\n      'طلب فرض غرامة 💰',\n      `طلب فريق (${user.name}) فرض غرامة (${amount} دينار) على منشأة (${estName}) لسبب: ${reason}`,\n      'operations'\n    );",
         "addSystemNotification(\n      'طلب فرض غرامة 💰',\n      `طلب فريق (${user.name}) فرض غرامة (${amount} دينار) على منشأة (${estName}) لسبب: ${reason}`,\n      'operations',\n      'penalties'\n    );")
    ],
    "src/components/SmartTasks.jsx": [
        ("addSystemNotification(\n      'مهمة رقابية جديدة 🚨',\n      `تم توجيهك لفحص منشأة (${targetEst.name}).\\nالسبب: ${task.description}`,\n      task.assignedTo\n    );",
         "addSystemNotification(\n      'مهمة رقابية جديدة 🚨',\n      `تم توجيهك لفحص منشأة (${targetEst.name}).\\nالسبب: ${task.description}`,\n      task.assignedTo,\n      'tasks'\n    );")
    ]
}

for file_path, reps in replacements.items():
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    for old, new in reps:
        content = content.replace(old, new)
        
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

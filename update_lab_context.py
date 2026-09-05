import re

with open("src/pages/LabDashboard.jsx", "r", encoding="utf-8") as f:
    content = f.read()

# Add setEstablishments to the context extraction
old_context = "const { user, establishments, systemNotifications, setSystemNotifications, labRequests, setLabRequests, uiPreferences, playBeep, globalLogout } = useAppContext();"
new_context = "const { user, establishments, setEstablishments, systemNotifications, setSystemNotifications, labRequests, setLabRequests, uiPreferences, playBeep, globalLogout } = useAppContext();"
content = content.replace(old_context, new_context)

# Inject document addition into handleSaveResult
old_save_result_end = """    } else {
      // Notify team that it is safe
      setSystemNotifications(prev => [{
        id: 'notif_' + Date.now(),
        title: '✅ نتيجة عينة سليمة',
        message: `عينات المنشأة (${resultModal.request.estName}) سليمة ومطابقة للمواصفات.`,
        date: new Date().toISOString(),
        isRead: false,
        targetRole: resultModal.request.teamId
      }, ...prev]);
    }

    setResultModal({ isOpen: false, request: null });
    setResultStatus('safe');
    setResultNotes('');
    playBeep && playBeep('success');
  };"""

new_save_result_end = """    } else {
      // Notify team that it is safe
      setSystemNotifications(prev => [{
        id: 'notif_' + Date.now(),
        title: '✅ نتيجة عينة سليمة',
        message: `عينات المنشأة (${resultModal.request.estName}) سليمة ومطابقة للمواصفات.`,
        date: new Date().toISOString(),
        isRead: false,
        targetRole: resultModal.request.teamId
      }, ...prev]);
    }

    // Attach lab document to establishment
    if (resultModal.request.establishmentId) {
      setEstablishments(prev => prev.map(est => {
        if (est.id === resultModal.request.establishmentId) {
          const doc = {
            id: 'doc_' + Date.now(),
            name: `نتيجة فحص مختبري - ${resultModal.request.sampleType || 'عينة'}`,
            type: 'وثيقة رسمية',
            url: '#',
            date: new Date().toISOString().split('T')[0],
            isLabResult: true,
            status: isContaminated ? 'سلبية' : 'سليمة'
          };
          return { ...est, documents: [...(est.documents || []), doc] };
        }
        return est;
      }));
    }

    setResultModal({ isOpen: false, request: null });
    setResultStatus('safe');
    setResultNotes('');
    playBeep && playBeep('success');
  };"""

content = content.replace(old_save_result_end, new_save_result_end)

with open("src/pages/LabDashboard.jsx", "w", encoding="utf-8") as f:
    f.write(content)

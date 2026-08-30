import re

file_path = "src/pages/AccountantPanel.jsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace the entire handleSearchFine function
target_function = r"  const handleSearchFine = \(\) => \{.*?\n  \};\n"

new_function = """  const handleSearchFine = () => {
    try {
      const code = (searchCode || '').trim().toLowerCase();
      if (!code) {
        notify('يرجى إدخال كود المنشأة أو رقم الغرامة', 'warning');
        return;
      }
      
      const safeString = (val) => (val ? String(val).trim().toLowerCase() : '');

      let est = (establishments || []).find(e => safeString(e.id) === code || (e.name || '').includes(searchCode));
      let fineByFineId = (pendingFines || []).find(f => safeString(f.id) === code);

      let targetEst = null;
      let targetFine = null;

      if (fineByFineId) {
        targetFine = fineByFineId;
        const targetEstId = safeString(targetFine.establishmentId || targetFine.estId);
        targetEst = (establishments || []).find(e => safeString(e.id) === targetEstId);
      } else if (est) {
        targetEst = est;
        const estId = safeString(est.id);
        targetFine = (pendingFines || []).find(f => safeString(f.establishmentId || f.estId) === estId);
      }

      if (targetEst) {
        setSearchedEstablishment(targetEst);
        if (targetFine) {
          setSearchedFine(targetFine);
          setPaymentMethod('cash');
          setReceiptNumber('');
        } else {
          setSearchedFine(null);
          notify('لا توجد غرامة معلقة على هذه المنشأة.', 'info');
        }
      } else {
        setSearchedEstablishment(null);
        setSearchedFine(null);
        notify('المنشأة غير متوفرة في قاعدة البيانات ولم يتم العثور على غرامة مسجلة بهذا الكود', 'error');
      }
    } catch (error) {
      console.error("Search error:", error);
      notify('حدث خطأ برمجي أثناء البحث: ' + error.message, 'error');
    }
  };
"""

content = re.sub(target_function, new_function, content, flags=re.DOTALL)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("handleSearchFine patched.")

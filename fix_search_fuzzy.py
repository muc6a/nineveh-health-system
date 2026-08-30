import re

file_path = "src/pages/AccountantPanel.jsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace the try block inside handleSearchFine
func_target = """      const code = (searchCode || '').trim().toLowerCase();
      
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
      }"""

func_replace = """      const code = (searchCode || '').trim().toLowerCase();
      let extractedCode = code;
      // Handle QR Code URL if scanned
      if (code.includes('/qr/')) {
        extractedCode = code.split('/qr/').pop().split('?')[0].trim();
      }
      
      const safeString = (val) => (val ? String(val).trim().toLowerCase() : '');
      const fuzzyMatch = (a, b) => safeString(a).replace(/[-_\\s]/g, '') === safeString(b).replace(/[-_\\s]/g, '');

      // Broaden the search: try exact ID, fuzzy ID, QR extracted ID, or partial name
      let est = (establishments || []).find(e => 
        safeString(e.id) === code || 
        safeString(e.id) === extractedCode ||
        fuzzyMatch(e.id, code) ||
        fuzzyMatch(e.id, extractedCode) ||
        (e.name || '').toLowerCase().includes((searchCode || '').trim().toLowerCase())
      );
      
      // Also search in allFines (not just pending) to show if a fine was already paid
      let fineByFineId = (allFines || []).find(f => 
        safeString(f.id) === code || fuzzyMatch(f.id, code)
      );

      let targetEst = null;
      let targetFine = null;

      if (fineByFineId) {
        targetFine = fineByFineId;
        const targetEstId = safeString(targetFine.establishmentId || targetFine.estId);
        targetEst = (establishments || []).find(e => safeString(e.id) === targetEstId || fuzzyMatch(e.id, targetEstId));
      } else if (est) {
        targetEst = est;
        const estId = safeString(est.id);
        // Find the fine in allFines, prioritize pending fines if multiple exist
        const estFines = (allFines || []).filter(f => safeString(f.establishmentId || f.estId) === estId || fuzzyMatch(f.establishmentId || f.estId, estId));
        targetFine = estFines.find(f => f.paymentStatus !== 'paid') || estFines[0] || null;
      }"""

if func_target in content:
    content = content.replace(func_target, func_replace)
else:
    print("WARNING: target block not found!")

# Now replace the success rendering if targetFine is paid
render_target = """      if (targetEst) {
        setSearchedEstablishment(targetEst);
        if (targetFine) {
          setSearchedFine(targetFine);
          setPaymentMethod('cash');
          setReceiptNumber('');
        } else {
          setSearchedFine(null);
          notify('لا توجد غرامة معلقة على هذه المنشأة.', 'info');
        }
      } else {"""

render_replace = """      if (targetEst) {
        setSearchedEstablishment(targetEst);
        if (targetFine) {
          setSearchedFine(targetFine);
          setPaymentMethod('cash');
          setReceiptNumber('');
          if (targetFine.paymentStatus === 'paid') {
            notify('تنبيه: تم العثور على غرامة سابقة ولكنها مسددة.', 'warning');
          }
        } else {
          setSearchedFine(null);
          notify('تم العثور على المنشأة، ولا توجد غرامات معلقة عليها.', 'info');
        }
      } else {"""

if render_target in content:
    content = content.replace(render_target, render_replace)

# Modify JSX to disable the Payment button if the fine is already paid
button_target = """                <div className="border-t border-slate-200 dark:border-slate-700 pt-6 relative z-10 space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-2">طريقة الدفع المستلمة:</label>"""

button_replace = """                <div className="border-t border-slate-200 dark:border-slate-700 pt-6 relative z-10 space-y-4">
                  {searchedFine?.paymentStatus === 'paid' ? (
                    <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl mb-6 text-center">
                      <p className="text-emerald-700 dark:text-emerald-400 font-bold text-sm">
                        هذه الغرامة مسددة مسبقاً ولا تتطلب إجراء آخر.
                      </p>
                    </div>
                  ) : (
                    <>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-2">طريقة الدفع المستلمة:</label>"""

if button_target in content:
    content = content.replace(button_target, button_replace)
    
# We also need to close the Fragment we opened
button_close_target = """                  <button 
                    onClick={submitPayment}
                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    تأكيد الاستلام وتسديد الغرامة
                  </button>
                </div>"""

button_close_replace = """                  <button 
                    onClick={submitPayment}
                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    تأكيد الاستلام وتسديد الغرامة
                  </button>
                  </>
                  )}
                </div>"""

if button_close_target in content:
    content = content.replace(button_close_target, button_close_replace)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Super-fuzzy search applied successfully.")

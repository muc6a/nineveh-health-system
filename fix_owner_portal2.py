import re
import sys

def main():
    with open('src/pages/OwnerPortal.jsx', 'r', encoding='utf-8') as f:
        code = f.read()

    # 1. Add Archive to imports
    code = code.replace("History\n, Eye } from 'lucide-react';", "History\n, Eye, Archive } from 'lucide-react';")

    # 2. Fix fines logic
    old_fines = """                  const allMyFines = [...(fines || []), ...(penaltyRequests || [])]
                    .filter(f => (f.type === 'fine' || f.type === 'closure' || !f.type) && (f.targetEstId === ownerEst.id || f.establishmentId === ownerEst.id || f.estId === ownerEst.id));"""
    new_fines = """                  const allMyFines = [...(fines || []), ...(penaltyRequests || [])]
                    .filter(f => (f.type === 'fine' || f.type === 'closure' || !f.type) && (String(f.targetEstId) === String(ownerEst.id) || String(f.establishmentId) === String(ownerEst.id) || String(f.estId) === String(ownerEst.id)));"""
    code = code.replace(old_fines, new_fines)

    # 3. Update getTaskDetails
    old_task_details = """  const getTaskDetails = (id) => {
    // Specific hardcoded details for certain criteria
    const details = {
      '1': { reason: 'تم رصد تدني في مستوى النظافة وتراكم الأوساخ.', solution: 'إجراء حملة تنظيف شاملة باستخدام المعقمات القياسية.' },
      '5': { reason: 'رصد مواد منتهية الصلاحية أو غير صالحة للاستهلاك.', solution: 'إتلاف المواد التالفة فوراً وتوثيق عملية الإتلاف.' },
      '10': { reason: 'عدم وجود بطاقات فحص طبي سارية المفعول للعمال.', solution: 'توجيه العمال لمراجعة المركز الصحي لتجديد بطاقات الفحص الطبي فوراً.' },
      '18': { reason: 'الإجازة الصحية منتهية الصلاحية أو غير متوفرة.', solution: 'الإسراع في تجديد الإجازة الصحية من الدائرة المعنية لتجنب الإغلاق.' }
    };

    const item = Object.values(inspectionTemplates || {}).flat().find(i => String(i.id) === String(id));
    const criteriaName = item ? item.text : `معيار رقابي رقم ${id}`;

    if (details[id]) {
      return { ...details[id], criteria: criteriaName };
    }

    return {
      criteria: criteriaName,
      reason: `(تحليل ذكي): تم رصد تقصير وضعف يخص تطبيق معيار [${criteriaName}] أثناء التفتيش الميداني.`,
      solution: `(توجيه ذكي): يرجى مراجعة الاشتراطات الصحية الخاصة بـ [${criteriaName}] وتصحيح الخلل فوراً لتجنب العقوبات الرقابية.`
    };
  };"""

    new_task_details = """  const getTaskDetails = (id) => {
    let item = null;
    for (const catItems of Object.values(inspectionTemplates || {})) {
      if (Array.isArray(catItems)) {
        const found = catItems.find(i => String(i.id) === String(id));
        if (found) {
          item = found;
          break;
        }
      }
    }
    const criteriaName = item ? item.text : `معيار رقابي رقم ${id}`;
    
    return {
      criteria: criteriaName,
      reason: `عدم التزام المنشأة أو تقصيرها الواضح في: ${criteriaName}`,
      solution: `الالتزام الفوري وتصحيح وتطبيق المعيار التالي: ${criteriaName}`
    };
  };"""
    code = code.replace(old_task_details, new_task_details)

    # 4. Handle Logout
    old_logout_btn = """            <button 
             onClick={globalLogout}
             className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 rounded-2xl font-bold transition-all mt-4">
             <LogOut className="w-4 h-4" /> تسجيل الخروج
            </button>"""
    new_logout_btn = """            <button 
             onClick={() => {
               localStorage.removeItem('ownerAuthToken');
               setOwnerEst(null);
               globalLogout();
             }}
             className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 rounded-2xl font-bold transition-all mt-4">
             <LogOut className="w-4 h-4" /> تسجيل الخروج
            </button>"""
    code = code.replace(old_logout_btn, new_logout_btn)

    # 5. Certificate UI Text updates
    old_cert1 = "مبروك لك هذا التميز؟"
    new_cert1 = "مبروك لك هذا التميز"
    code = code.replace(old_cert1, new_cert1)

    old_cert2 = "مديرية الصحة؟"
    new_cert2 = "مديرية الصحة"
    code = code.replace(old_cert2, new_cert2)

    old_promo = "هذه الشهادة تدل على التزامك الصحي الكبير، يمكنك طباعتها وعرضها في المنشأة لزيادة ثقة زبائنك."
    new_promo = "نوصيك بنشر هذه الشهادة على صفحاتك في وسائل التواصل الاجتماعي ليطلع الزبائن على التزامك الصحي وحصولك على تقييم عالي الموثوقية من مديرية الصحة."
    code = code.replace(old_promo, new_promo)

    old_cert_buttons = """              <button onClick={closePrintCertificate} className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 py-4 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2">
                الرجوع للمنصة
              </button>
              <button onClick={handlePrintCertificate} className="flex-[2] bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-2xl font-black text-sm shadow-xl shadow-emerald-500/30 transition-all flex items-center justify-center gap-2">
                <Printer className="w-5 h-5" /> طباعة كـ PDF -
              </button>"""
    new_cert_buttons = """              <button onClick={handlePrintCertificate} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-2xl font-black text-sm shadow-xl shadow-emerald-500/30 transition-all flex items-center justify-center gap-2">
                <Printer className="w-5 h-5" /> طباعة كـ PDF
              </button>"""
    code = code.replace(old_cert_buttons, new_cert_buttons)
    
    # Also update download cert button
    old_cert_dl = """<button onClick={() => handleDownloadImage(certificateRef, `certificate_${ownerEst.id}.png`)} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-slate-800 border-2 border-indigo-100 dark:border-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-2xl font-bold hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all">"""
    new_cert_dl = """<button onClick={() => handleDownloadImage(certificateRef, `certificate_${ownerEst.id}.png`)} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-slate-800 border-2 border-emerald-100 dark:border-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-2xl font-bold hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all">"""
    code = code.replace(old_cert_dl, new_cert_dl)


    # 6. Fix QR Poster design
    # Change "المطعم" font size and remove white screen error (probably due to html2canvas capturing hidden elements)
    # The poster text:
    old_qr_text = """<p className="text-xl font-bold text-slate-800">{ownerEst.type || 'المطعم'}</p>"""
    new_qr_text = """<p className="text-sm font-bold text-slate-800">{ownerEst.type || 'المطعم'}</p>"""
    code = code.replace(old_qr_text, new_qr_text)
    
    old_qr_title = """<h1 className="text-3xl font-black text-indigo-900 mb-1 leading-tight tracking-tight">"""
    new_qr_title = """<h1 className="text-3xl font-black text-indigo-900 mt-2 mb-1 leading-tight tracking-tight">"""
    code = code.replace(old_qr_title, new_qr_title)
    
    # Fix circle progress drawing for QR (use a full stroke array)
    old_circle = """                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    fill="none"
                    stroke={scoreColor}
                    strokeWidth="12"
                    strokeDasharray="440"
                    strokeDashoffset={440 - (440 * scorePercentage) / 100}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                    style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                  />"""
    # Just fix the math for exact circumference: 2 * Math.PI * 70 = 439.82 -> 440 is correct.
    # Wait, the issue with crescent or cut off might be html2canvas rendering strokeDashoffset weirdly or the SVG box.
    # A cleaner approach is simply setting strokeDasharray to `439.82`
    new_circle = """                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    fill="none"
                    stroke={scoreColor}
                    strokeWidth="12"
                    strokeDasharray="439.82"
                    strokeDashoffset={439.82 - (439.82 * scorePercentage) / 100}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                    style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                  />"""
    code = code.replace(old_circle, new_circle)

    with open('src/pages/OwnerPortal.jsx', 'w', encoding='utf-8') as f:
        f.write(code)

    print("OwnerPortal.jsx updated successfully!")

if __name__ == '__main__':
    main()

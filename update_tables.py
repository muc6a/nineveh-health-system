import os

def main():
    # 1. Update FinancialReports.jsx
    fin_rep = 'src/components/FinancialReports.jsx'
    with open(fin_rep, 'r', encoding='utf-8') as f:
        content = f.read()

    # Table headers
    headers_old = """              <th className="pb-3 px-2 font-bold">تاريخ إصدار المخالفة</th>
              <th className="pb-3 px-2 font-bold">المحاسب المستلم</th>"""
    headers_new = """              <th className="pb-3 px-2 font-bold">تاريخ إصدار المخالفة</th>
              <th className="pb-3 px-2 font-bold">تاريخ التسديد (مدة التأخير)</th>
              <th className="pb-3 px-2 font-bold">المحاسب المستلم</th>"""
    content = content.replace(headers_old, headers_new)

    # Table row
    row_old = """                <td className="py-4 px-2 text-slate-500">{fine.paymentDate ? new Date(fine.paymentDate).toLocaleDateString('ar-IQ') : '---'}</td>
                <td className="py-4 px-2 font-bold text-slate-600 dark:text-slate-400">{fine.accountantName || '---'}</td>"""
    row_new = """                <td className="py-4 px-2 text-slate-500">{fine.timestamp ? new Date(fine.timestamp).toLocaleDateString('en-GB') : (fine.date ? new Date(fine.date).toLocaleDateString('en-GB') : '---')}</td>
                <td className="py-4 px-2 text-slate-500">
                  {fine.paymentDate ? (
                    <div className="flex flex-col gap-1">
                      <span>{new Date(fine.paymentDate).toLocaleDateString('en-GB')}</span>
                      <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold w-fit">
                        {Math.ceil(Math.abs(new Date(fine.paymentDate) - new Date(fine.timestamp || fine.date || fine.paymentDate)) / (1000 * 60 * 60 * 24)) === 0 ? 'بنفس اليوم' : `${Math.ceil(Math.abs(new Date(fine.paymentDate) - new Date(fine.timestamp || fine.date || fine.paymentDate)) / (1000 * 60 * 60 * 24))} يوم`}
                      </span>
                    </div>
                  ) : '---'}
                </td>
                <td className="py-4 px-2 font-bold text-slate-600 dark:text-slate-400">{fine.accountantName || '---'}</td>"""
    content = content.replace(row_old, row_new)

    with open(fin_rep, 'w', encoding='utf-8') as f:
        f.write(content)


    # 2. Update AccountantPanel.jsx (Archive section)
    acc_panel = 'src/pages/AccountantPanel.jsx'
    with open(acc_panel, 'r', encoding='utf-8') as f:
        content2 = f.read()

    acc_headers_old = """                        <th className="p-3">رقم الوصل</th>
                        <th className="p-3">المنشأة</th>
                        <th className="p-3">المبلغ المستلم</th>
                        <th className="p-3">طريقة الدفع</th>
                        <th className="p-3">تاريخ التسديد</th>"""
    acc_headers_new = """                        <th className="p-3">رقم الوصل</th>
                        <th className="p-3">المنشأة</th>
                        <th className="p-3">المبلغ المستلم</th>
                        <th className="p-3">طريقة الدفع</th>
                        <th className="p-3">تاريخ إصدار المخالفة</th>
                        <th className="p-3">تاريخ التسديد</th>"""
    content2 = content2.replace(acc_headers_old, acc_headers_new)

    acc_row_old = """                          <td className="p-3">
                            <span className={`px-2 py-1 text-[10px] rounded-lg ${fine.paymentMethod === 'pos' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'}`}>
                              {fine.paymentMethod === 'pos' ? 'POS' : 'نقدي'}
                            </span>
                          </td>
                          <td className="p-3 text-slate-500 text-[10px]">{new Date(fine.paymentDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}</td>"""
    
    acc_row_new = """                          <td className="p-3">
                            <span className={`px-2 py-1 text-[10px] rounded-lg ${fine.paymentMethod === 'pos' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'}`}>
                              {fine.paymentMethod === 'pos' ? 'POS' : 'نقدي'}
                            </span>
                          </td>
                          <td className="p-3 text-slate-500 text-[10px]">{fine.timestamp ? new Date(fine.timestamp).toLocaleDateString('en-GB') : (fine.date ? new Date(fine.date).toLocaleDateString('en-GB') : '---')}</td>
                          <td className="p-3 text-slate-500 text-[10px]">
                            <div className="flex flex-col gap-1">
                              <span>{new Date(fine.paymentDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                              <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded font-bold w-fit">
                                التأخير: {Math.ceil(Math.abs(new Date(fine.paymentDate) - new Date(fine.timestamp || fine.date || fine.paymentDate)) / (1000 * 60 * 60 * 24)) === 0 ? 'بنفس اليوم' : `${Math.ceil(Math.abs(new Date(fine.paymentDate) - new Date(fine.timestamp || fine.date || fine.paymentDate)) / (1000 * 60 * 60 * 24))} يوم`}
                              </span>
                            </div>
                          </td>"""
    content2 = content2.replace(acc_row_old, acc_row_new)

    # Change "التاريخ" to "تاريخ إصدار المخالفة" in the pending fines table
    acc_headers2_old = """                      <th className="p-3">المنشأة</th>
                      <th className="p-3">المبلغ المطلوب</th>
                      <th className="p-3">التاريخ</th>
                      <th className="p-3">حالة الإغلاق</th>"""
    acc_headers2_new = """                      <th className="p-3">المنشأة</th>
                      <th className="p-3">المبلغ المطلوب</th>
                      <th className="p-3">تاريخ إصدار المخالفة</th>
                      <th className="p-3">حالة الإغلاق</th>"""
    content2 = content2.replace(acc_headers2_old, acc_headers2_new)

    # And maybe in the generic table?
    acc_headers3_old = """                      <th className="p-4">طريقة الدفع</th>
                      <th className="p-4">التاريخ</th>"""
    acc_headers3_new = """                      <th className="p-4">طريقة الدفع</th>
                      <th className="p-4">تاريخ التسديد</th>"""
    content2 = content2.replace(acc_headers3_old, acc_headers3_new)

    with open(acc_panel, 'w', encoding='utf-8') as f:
        f.write(content2)

    print("Updated tables successfully.")

if __name__ == "__main__":
    main()

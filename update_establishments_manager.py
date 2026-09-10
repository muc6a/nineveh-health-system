import re

with open("src/components/EstablishmentsManager.jsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add labRequests to useContext(AppContext)
content = content.replace("penaltyRequests, activityTypes, reports } = useContext(AppContext);", "penaltyRequests, activityTypes, reports, labRequests } = useContext(AppContext);")

# 2. Add Live Status function
if "const getLiveStatus" not in content:
    live_status_func = """
  const getLiveStatus = (est) => {
    if (est.status === 'closed') return { text: 'مغلق بالشمع الأحمر 🚫', color: 'bg-red-600 text-white animate-pulse' };
    
    if (est.lastInspection === 'تحت المعالجة ⏳') return { text: 'تحت المعالجة ⏳', color: 'bg-amber-100 text-amber-700' };

    // Check for active legal action (pending penalties)
    const hasPendingPenalty = penaltyRequests && penaltyRequests.some(pr => pr.establishmentId === est.id && pr.status === 'pending');
    if (hasPendingPenalty) return { text: 'قيد الإجراء القانوني ⚖️', color: 'bg-rose-100 text-rose-700 font-bold' };

    // Check for active lab requests
    const hasActiveLab = labRequests && labRequests.some(lr => lr.establishmentId === est.id && lr.status !== 'finished');
    if (hasActiveLab) return { text: 'بانتظار النتيجة المخبرية 🧪', color: 'bg-indigo-100 text-indigo-700 font-bold' };

    if (est.lastInspection === 'لم يزر بعد') return { text: 'معلق (لم يزر بعد) ⏳', color: 'bg-slate-100 text-slate-500' };

    // Default based on score if recently visited
    if (est.score >= 90) return { text: 'مطابق للمواصفات ✅', color: 'bg-emerald-100 text-emerald-700' };
    if (est.score >= 50) return { text: 'متابعة مستمرة ⚠️', color: 'bg-amber-100 text-amber-700' };
    
    return { text: 'مخالف للشروط ❌', color: 'bg-red-100 text-red-700' };
  };
"""
    content = content.replace("const uniqueSectors =", live_status_func + "\n  const uniqueSectors =")

# 3. Separate Columns in the header
header_target = r"\{user\?\.role !== 'admin' && \(\s*<th className=\"p-3\.5 font-bold text-center\">التقييم والحالة<\/th>\s*\)\}"
header_replace = """{user?.role !== 'admin' && (
                  <>
                    <th className="p-3.5 font-bold text-center">تقييم المنشأة</th>
                    <th className="p-3.5 font-bold text-center">الحالة الحية</th>
                  </>
                )}"""
content = re.sub(header_target, header_replace, content)


# 4. Separate Columns in the body and format rating
body_target = r'\{user\?\.role !== \'admin\' && \(\s*<td className="p-3\.5 text-center">[\s\S]*?<\/td>\s*\)\}'
body_replace = """{user?.role !== 'admin' && (
                      <>
                        <td className="p-3.5 text-center">
                          <div className={`text-xl font-black ${
                            est.score >= 90 ? 'text-emerald-600 dark:text-emerald-400' :
                            est.score >= 50 ? 'text-amber-500 dark:text-amber-400' : 'text-red-600 dark:text-red-500'
                          }`}>
                            {est.lastInspection === 'لم يزر بعد' ? '-' : `${est.score}%`}
                          </div>
                        </td>
                        <td className="p-3.5 text-center">
                          {(() => {
                            const statusObj = getLiveStatus(est);
                            return (
                              <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black inline-block text-center shadow-sm ${statusObj.color}`}>
                                {statusObj.text}
                              </span>
                            );
                          })()}
                        </td>
                      </>
                    )}"""
content = re.sub(body_target, body_replace, content)

with open("src/components/EstablishmentsManager.jsx", "w", encoding="utf-8") as f:
    f.write(content)


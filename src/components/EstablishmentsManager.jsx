import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Search, X } from 'lucide-react';

export const EstablishmentsManager = () => {
  const { establishments, setEstablishments, teams, activeTab } = useContext(AppContext);
  const [estSearchTerm, setEstSearchTerm] = useState('');
  const [sectorFilter, setSectorFilter] = useState('all');
  const [selectedEstDetails, setSelectedEstDetails] = useState(null);
  const [editingEst, setEditingEst] = useState(null);

  const uniqueSectors = [...new Set(establishments.map(e => e.sector))].filter(Boolean);

  const handleEditEstSubmit = (e) => {
    e.preventDefault();
    setEstablishments(prev => prev.map(est => est.id === editingEst.id ? editingEst : est));
    setEditingEst(null);
  };

  return (
    <section className="glassmorphic-card p-6 text-right space-y-6 animate-fade-in print:hidden">
      <div>
        <h2 className="text-base font-black text-slate-800 dark:text-white">🍽️ إدارة المنشآت والتحكم بالبيانات</h2>
        <p className="text-[11px] text-slate-500 mt-1">عرض، وتعديل بيانات المطاعم وتصدير ملصقات الـ QR</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="ابحث باسم المطعم أو المالك أو صنف النشاط..."
            value={estSearchTerm}
            onChange={(e) => setEstSearchTerm(e.target.value)}
            className="w-full pl-4 pr-10 py-3 rounded-2xl bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-xs font-bold outline-none text-slate-800 dark:text-slate-200 focus:border-teal-500 transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
        </div>
        
        <select 
          value={sectorFilter} 
          onChange={(e) => setSectorFilter(e.target.value)}
          className="w-full md:w-64 p-3 rounded-2xl bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-xs font-bold outline-none text-slate-800 dark:text-slate-200 focus:border-teal-500 transition-all shadow-sm"
        >
          <option value="all">الكل (جميع القطاعات والأقضية)</option>
          {uniqueSectors.map(sector => (
            <option key={sector} value={sector}>{sector}</option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                <th className="p-3.5 font-bold">اسم المنشأة / الرخصة</th>
                <th className="p-3.5 font-bold">نوع النشاط</th>
                <th className="p-3.5 font-bold">المالك / الهاتف</th>
                <th className="p-3.5 font-bold text-center">كود البوابة</th>
                <th className="p-3.5 font-bold">القطاع</th>
                <th className="p-3.5 font-bold">التقييم</th>
                <th className="p-3.5 font-bold text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
              {establishments
                .filter(e => sectorFilter === 'all' || e.sector === sectorFilter)
                .filter(e => 
                  e.name.toLowerCase().includes(estSearchTerm.toLowerCase()) ||
                  e.owner.toLowerCase().includes(estSearchTerm.toLowerCase()) ||
                  e.type.toLowerCase().includes(estSearchTerm.toLowerCase())
                )
                .map(est => (
                  <tr key={est.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10">
                    <td className="p-3.5">
                      <div className="flex flex-col">
                        <span className={`font-black ${est.status === 'closed' ? 'text-red-500 line-through opacity-70' : 'text-slate-800 dark:text-slate-200'}`}>
                          {est.name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">الرخصة: {est.licenseNumber}</span>
                      </div>
                    </td>
                    <td className="p-3.5 font-bold text-slate-600 dark:text-slate-300">{est.type}</td>
                    <td className="p-3.5">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-700 dark:text-slate-300">{est.owner}</span>
                        <span className="text-[10px] text-slate-400">{est.phone}</span>
                      </div>
                    </td>
                    <td className="p-3.5 font-bold text-center">
                      <span className="px-3 py-1.5 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 dir-ltr inline-block">
                        {est.accessCode}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <div className="flex flex-col">
                        <span className="text-slate-500 font-bold">{est.sector}</span>
                        <span className="text-[9px] text-teal-600 dark:text-teal-400 mt-1 font-black">
                          {teams.find(t => t.sector === est.sector) 
                            ? `مسؤولية: ${teams.find(t => t.sector === est.sector).name}`
                            : '⚠️ غير مخصص لفريق'}
                        </span>
                      </div>
                    </td>
                    <td className="p-3.5">
                      {est.status === 'closed' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-black bg-red-600 text-white animate-pulse">
                          مغلق بالشمع الأحمر 🚫
                        </span>
                      ) : (
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                          est.score >= 90 ? 'bg-emerald-500/10 text-emerald-600' :
                          est.score >= 70 ? 'bg-amber-500/10 text-amber-500' : 'bg-red-500/10 text-red-500'
                        }`}>
                          {est.lastInspection === 'لم يزر بعد' ? 'معلق ⏳' : `${est.score}%`}
                        </span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => setSelectedEstDetails(est)}
                          className="px-2.5 py-1.5 rounded-xl bg-slate-550/10 hover:bg-slate-500/20 text-slate-600 dark:text-slate-400 font-bold cursor-pointer transition-all"
                        >
                          🔗 رمز الـ QR
                        </button>
                        <button
                          onClick={() => setEditingEst(est)}
                          className="px-2.5 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 font-bold cursor-pointer transition-all"
                        >
                          📝 تعديل
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editingEst && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700/60 p-6 rounded-3xl text-white shadow-2xl relative max-h-[90vh] overflow-y-auto text-right">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-800 mb-4">
              <h3 className="text-sm font-black text-teal-400">📝 تعديل بيانات المنشأة</h3>
              <button onClick={() => setEditingEst(null)} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400">
                <X className="w-4.5 h-4.5" />
              </button>
            </div>
            <form onSubmit={handleEditEstSubmit} className="space-y-4 text-xs font-bold">
              <div>
                <label className="text-slate-300 block mb-1">اسم المنشأة</label>
                <input type="text" required value={editingEst.name} onChange={(e) => setEditingEst({...editingEst, name: e.target.value})} className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 block mb-1">نوع النشاط</label>
                  <input type="text" required value={editingEst.type} onChange={(e) => setEditingEst({...editingEst, type: e.target.value})} className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none" />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">رقم الترخيص</label>
                  <input type="text" required value={editingEst.licenseNumber} onChange={(e) => setEditingEst({...editingEst, licenseNumber: e.target.value})} className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 block mb-1">اسم المالك</label>
                  <input type="text" required value={editingEst.owner} onChange={(e) => setEditingEst({...editingEst, owner: e.target.value})} className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none" />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">رقم هاتف المالك</label>
                  <input type="text" required value={editingEst.phone} onChange={(e) => setEditingEst({...editingEst, phone: e.target.value})} className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none" />
                </div>
              </div>
              <div>
                <label className="text-slate-300 block mb-1">القطاع</label>
                <input type="text" required value={editingEst.sector} onChange={(e) => setEditingEst({...editingEst, sector: e.target.value})} className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none" />
              </div>
              <button type="submit" className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs transition-all mt-4">حفظ التعديلات</button>
            </form>
          </div>
        </div>
      )}

      {/* QR Details Modal */}
      {selectedEstDetails && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm text-right print:hidden">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700/60 p-6 rounded-3xl text-white shadow-2xl relative">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-800 mb-4">
              <h3 className="text-sm font-black text-teal-400">🔗 رمز الـ QR وتفاصيل المنشأة</h3>
              <button onClick={() => setSelectedEstDetails(null)} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-800 border border-slate-800 text-right space-y-1.5">
                <h4 className="text-sm font-black text-white">{selectedEstDetails.name}</h4>
                <p className="text-[10.5px] text-slate-300">النشاط: {selectedEstDetails.type}</p>
                <p className="text-[10.5px] text-slate-300">التقييم: <strong className={selectedEstDetails.score >= 90 ? 'text-teal-400' : 'text-amber-500'}>{selectedEstDetails.lastInspection === 'لم يزر بعد' ? 'معلق' : `${selectedEstDetails.score}%`}</strong></p>
                <div className="mt-3 p-2 bg-orange-500/10 rounded-xl text-center">
                  <p className="text-xs text-orange-400 font-bold">🔑 كود بوابة المالك:</p>
                  <p className="text-xl font-black text-white dir-ltr">{selectedEstDetails.accessCode}</p>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center p-6 bg-white rounded-3xl border border-slate-700">
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`${window.location.origin}/scan/${selectedEstDetails.id}`)}`} alt="QR" className="w-48 h-48 block rounded-lg" />
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <a href={`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(`${window.location.origin}/scan/${selectedEstDetails.id}`)}`} target="_blank" rel="noreferrer" className="py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-center font-black">تحميل الصورة</a>
                <button type="button" onClick={() => window.print()} className="py-2.5 rounded-xl bg-slate-800 text-center font-black">طباعة ملصق الباركود</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

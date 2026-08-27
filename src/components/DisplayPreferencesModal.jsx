import React, { useState, useEffect, useContext } from 'react';
import { Eye, X, ChevronUp, ChevronDown, ListOrdered } from 'lucide-react';
import { AppContext } from '../context/AppContext';

export const DisplayPreferencesModal = ({ isOpen, onClose }) => {
  const { uiPreferences, setUiPreferences, notify } = useContext(AppContext);
  const [draftUiPreferences, setDraftUiPreferences] = useState(uiPreferences);

  const TAB_LABELS = {
    strategic: 'اللوحة الرئيسية (الاستراتيجية)',
    team_reports: 'تقارير الفرق الميدانية',
    operations_room: 'غرفة العمليات المركزية',
    geographic: 'الخريطة الجغرافية',
    directives: 'التبليغات والتوجيهات',
    complaints: 'التقييمات العامة (الشكاوى)',
    establishments: 'إدارة المنشآت'
  };

  const moveTab = (index, direction) => {
    const newOrder = [...(draftUiPreferences.tabOrder || Object.keys(TAB_LABELS))];
    if (direction === 'up' && index > 0) {
      [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
    } else if (direction === 'down' && index < newOrder.length - 1) {
      [newOrder[index + 1], newOrder[index]] = [newOrder[index], newOrder[index + 1]];
    }
    setDraftUiPreferences({ ...draftUiPreferences, tabOrder: newOrder });
  };

  useEffect(() => {
    if (isOpen) {
      setDraftUiPreferences(uiPreferences);
    }
  }, [isOpen, uiPreferences]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in" dir="rtl">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-slate-200 dark:border-slate-800">
        <div className="shrink-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-4 flex justify-between items-center border-b border-slate-100 dark:border-slate-800 z-10">
          <h2 className="text-sm font-black text-slate-800 dark:text-white flex items-center gap-2">
            <Eye className="w-5 h-5 text-teal-600" />
            <span>تخصيص العرض والمظهر الشخصي</span>
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
            تحكم بمقاسات الخطوط وكثافة عرض البيانات لراحتك. يتم حفظ هذه التفضيلات في حسابك الخاص ولا تؤثر على المستخدمين الآخرين.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Controls */}
            <div className="space-y-6 text-right">
              {/* Density Control */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">كثافة البيانات (Density Mode)</label>
                <div className="flex gap-4">
                  <label className={`flex-1 cursor-pointer p-4 rounded-xl border-2 transition-all ${(draftUiPreferences?.density || "comfortable") === 'comfortable' ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'}`}>
                    <input
                      type="radio"
                      name="density"
                      value="comfortable"
                      className="hidden"
                      checked={(draftUiPreferences?.density || "comfortable") === 'comfortable'}
                      onChange={(e) => setDraftUiPreferences({...draftUiPreferences, density: e.target.value})}
                    />
                    <div className="text-center">
                      <div className="text-sm font-black text-slate-700 dark:text-slate-300">مريح (Comfortable)</div>
                      <p className="text-[10px] text-slate-500 mt-1">مسافات واسعة مناسبة للحواسيب</p>
                    </div>
                  </label>
                  <label className={`flex-1 cursor-pointer p-4 rounded-xl border-2 transition-all ${(draftUiPreferences?.density || "comfortable") === 'compact' ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'}`}>
                    <input
                      type="radio"
                      name="density"
                      value="compact"
                      className="hidden"
                      checked={(draftUiPreferences?.density || "comfortable") === 'compact'}
                      onChange={(e) => setDraftUiPreferences({...draftUiPreferences, density: e.target.value})}
                    />
                    <div className="text-center">
                      <div className="text-sm font-black text-slate-700 dark:text-slate-300">مضغوط (Compact)</div>
                      <p className="text-[10px] text-slate-500 mt-1">مسافات أقل مناسبة للأجهزة المحمولة</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Typography Controls */}
              <div className="space-y-4">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">حجم الخطوط (Typography)</label>
                
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 flex justify-between">
                    <span>حجم العناوين</span>
                    <span className="font-bold dir-ltr">{(draftUiPreferences?.headingSize || "18px")}</span>
                  </label>
                  <input 
                    type="range" 
                    min="14" 
                    max="32" 
                    value={parseInt((draftUiPreferences?.headingSize || "18px"))} 
                    onChange={(e) => setDraftUiPreferences({...draftUiPreferences, headingSize: e.target.value + 'px'})}
                    className="w-full accent-teal-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 flex justify-between">
                    <span>حجم النصوص</span>
                    <span className="font-bold dir-ltr">{(draftUiPreferences?.bodySize || "12px")}</span>
                  </label>
                  <input 
                    type="range" 
                    min="10" 
                    max="20" 
                    value={parseInt((draftUiPreferences?.bodySize || "12px"))} 
                    onChange={(e) => setDraftUiPreferences({...draftUiPreferences, bodySize: e.target.value + 'px'})}
                    className="w-full accent-teal-600"
                  />
                </div>
              </div>
              {/* Tab Reordering Control */}
              <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <ListOrdered className="w-4 h-4 text-teal-600" />
                  ترتيب القوائم الجانبية (Sidebar Tabs Order)
                </label>
                <div className="space-y-2 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                  {(draftUiPreferences?.tabOrder || Object.keys(TAB_LABELS)).map((tabKey, idx, arr) => (
                    <div key={tabKey} className="flex items-center justify-between bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{TAB_LABELS[tabKey] || tabKey}</span>
                      <div className="flex items-center gap-1">
                        <button
                          disabled={idx === 0}
                          onClick={() => moveTab(idx, 'up')}
                          className="p-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/30 disabled:opacity-30 transition-all cursor-pointer"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          disabled={idx === arr.length - 1}
                          onClick={() => moveTab(idx, 'down')}
                          className="p-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/30 disabled:opacity-30 transition-all cursor-pointer"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Live Preview */}
            <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 text-right">
              <h3 className="text-sm font-bold text-slate-500 mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">نافذة العرض المباشر (Live Preview)</h3>
              
              <div 
                className="bg-white dark:bg-slate-950 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800"
                style={{
                  padding: draftUiPreferences?.density === 'compact' ? '0.75rem' : '1.5rem',
                }}
              >
                <h4 
                  className="font-black text-slate-800 dark:text-white mb-2"
                  style={{ fontSize: draftUiPreferences?.headingSize || '18px' }}
                >
                  مطعم لاماسو السياحي
                </h4>
                <p 
                  className="text-slate-600 dark:text-slate-400 leading-relaxed"
                  style={{ fontSize: draftUiPreferences?.bodySize || '12px' }}
                >
                  هذا النص مجرد مثال حي لمشاهدة تأثير الإعدادات. عند تصغير الكثافة ستقل المسافات بين العناصر، وعند تكبير الخط ستصبح القراءة أسهل لبعض المستخدمين.
                </p>
                <div 
                  className="mt-4 flex gap-2"
                  style={{ marginTop: draftUiPreferences?.density === 'compact' ? '0.5rem' : '1rem' }}
                >
                  <button className="bg-teal-600 text-white px-4 py-2 rounded-lg" style={{ fontSize: draftUiPreferences?.bodySize || '12px' }}>قبول</button>
                  <button className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg" style={{ fontSize: draftUiPreferences?.bodySize || '12px' }}>رفض</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="shrink-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 rounded-b-2xl z-10">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold transition-all text-sm"
          >
            إلغاء
          </button>
          <button
            onClick={() => { 
              setUiPreferences(draftUiPreferences); 
              onClose(); 
              if (notify) notify('تم حفظ تفضيلات المظهر بنجاح', 'success'); 
            }}
            className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-black shadow-md shadow-teal-500/20 transition-all text-sm"
          >
            حفظ وتطبيق التغييرات
          </button>
        </div>
      </div>
    </div>
  );
};

export default DisplayPreferencesModal;

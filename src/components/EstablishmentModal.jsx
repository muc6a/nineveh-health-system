import React, { useState, useEffect } from 'react';
import { X, MapPin, Store, User, Hash, Phone, FileBadge } from 'lucide-react';
import { NINEVEH_GEOGRAPHY } from '../utils/constants';

export const EstablishmentModal = ({ isOpen, mode, initialData, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: '🍽️ إعداد وتحضير وتقديم الأطعمة والمشروبات',
    owner: '',
    phone: '',
    licenseNumber: '',
    propertyNumber: '',
    geoMain: 'mosul_right', // mosul_right, mosul_left, hamdaniya, etc.
    geoSub: '', // neighborhood or subdistrict
    status: 'compliant'
  });

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && initialData) {
        // Try to parse existing sector string back into geoMain and geoSub
        let parsedMain = 'mosul_right';
        let parsedSub = '';
        const sector = initialData.sector || '';
        
        if (sector.includes('الجانب الأيمن')) {
          parsedMain = 'mosul_right';
          parsedSub = sector.split(' - ')[1] || '';
        } else if (sector.includes('الجانب الأيسر')) {
          parsedMain = 'mosul_left';
          parsedSub = sector.split(' - ')[1] || '';
        } else {
          // Look for district match
          NINEVEH_GEOGRAPHY.districts.forEach(d => {
            if (sector.includes(d.label)) {
              parsedMain = d.id;
              parsedSub = sector.split(' - ')[1] || '';
            }
          });
        }

        setFormData({
          ...initialData,
          geoMain: parsedMain,
          geoSub: parsedSub
        });
      } else {
        setFormData({
          name: '',
          type: '🍽️ إعداد وتحضير وتقديم الأطعمة والمشروبات',
          owner: '',
          phone: '',
          licenseNumber: '',
          propertyNumber: '',
          geoMain: 'mosul_right',
          geoSub: '',
          status: 'compliant'
        });
      }
    }
  }, [isOpen, mode, initialData]);

  if (!isOpen) return null;

  // Generate geographic options
  let subOptions = [];
  if (formData.geoMain === 'mosul_right') {
    subOptions = NINEVEH_GEOGRAPHY.mosul.sides.right.neighborhoods;
  } else if (formData.geoMain === 'mosul_left') {
    subOptions = NINEVEH_GEOGRAPHY.mosul.sides.left.neighborhoods;
  } else {
    const dist = NINEVEH_GEOGRAPHY.districts.find(d => d.id === formData.geoMain);
    if (dist) subOptions = dist.subdistricts;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // Build the final sector string
    let finalSector = '';
    if (formData.geoMain === 'mosul_right') {
      finalSector = `الجانب الأيمن - ${formData.geoSub || subOptions[0]}`;
    } else if (formData.geoMain === 'mosul_left') {
      finalSector = `الجانب الأيسر - ${formData.geoSub || subOptions[0]}`;
    } else {
      const dist = NINEVEH_GEOGRAPHY.districts.find(d => d.id === formData.geoMain);
      finalSector = `${dist?.label || ''} - ${formData.geoSub || subOptions[0]}`;
    }

    const payload = {
      ...formData,
      sector: finalSector,
      score: formData.score || 100 // default score if new
    };

    onSave(payload);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-md text-right" dir="rtl">
      <div className="w-full max-w-2xl bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-[2rem] text-slate-800 dark:text-slate-800 dark:text-white shadow-[0_0_50px_-12px_rgba(20,184,166,0.3)] relative overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/50 dark:bg-slate-900/40 sticky top-0 z-20 backdrop-blur-sm shrink-0">
          <h3 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-l from-teal-600 to-emerald-600 dark:from-teal-400 dark:to-emerald-400 flex items-center gap-3 drop-shadow-md">
            <div className="p-2.5 rounded-xl bg-slate-800/80 border border-white/10 text-teal-600 dark:text-teal-400 shadow-inner">
              <Store className="w-5 h-5" />
            </div>
            {mode === 'edit' ? 'تعديل بيانات المنشأة الصحية' : 'تسجيل منشأة جديدة'}
          </h3>
          <button 
            onClick={onClose}
            className="flex p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 transition-all items-center justify-center group shadow-sm border border-slate-200 dark:border-white/5"
          >
            <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>

        {/* Body */}
        {/* Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          <form id="establishment-form" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                  <Store className="w-3.5 h-3.5 text-teal-500" />
                  اسم المنشأة التجاري
                </label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="مثال: مطعم لاماسو"
                  className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-white outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/30 transition-all shadow-inner font-bold text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                  <FileBadge className="w-3.5 h-3.5 text-teal-500" />
                  صنف النشاط
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-white outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/30 transition-all shadow-inner font-bold text-sm"
                >
                  <option>🍽️ إعداد وتحضير وتقديم الأطعمة والمشروبات</option>
                  <option>🪒 صالون حلاقة وتجميل</option>
                  <option>🍞 مخابز وأفران</option>
                  <option>☕ بيع وطحن القهوة</option>
                  <option>💧 محطة تعبئة وتصفية المياه R.O</option>
                  <option>🛒 أسواق ومجمعات غذائية</option>
                </select>
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-teal-500" />
                  اسم المالك الحقيقي (صاحب الإجازة)
                </label>
                <input
                  required
                  type="text"
                  value={formData.owner}
                  onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                  placeholder="الاسم الرباعي واللقب"
                  className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-white outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/30 transition-all shadow-inner font-bold text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-teal-500" />
                  رقم الهاتف (اختياري)
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="07..."
                  className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-white outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/30 transition-all shadow-inner font-bold text-sm text-left"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                  <FileBadge className="w-3.5 h-3.5 text-teal-500" />
                  رقم الإجازة الصحية
                </label>
                <input
                  required
                  type="text"
                  value={formData.licenseNumber}
                  onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                  placeholder="مثال: LIC-2026-X11"
                  className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-white outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/30 transition-all shadow-inner font-bold text-sm text-left"
                  dir="ltr"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-teal-500" />
                  رقم العقار (البلدية)
                </label>
                <input
                  required
                  type="text"
                  value={formData.propertyNumber}
                  onChange={(e) => setFormData({ ...formData, propertyNumber: e.target.value })}
                  placeholder="مثال: 4م/771/01"
                  className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-white outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/30 transition-all shadow-inner font-bold text-sm text-left"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Location Tree */}
            <div className="bg-slate-100/40 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-white/5 shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]">
              <h4 className="text-xs font-black text-teal-600 dark:text-teal-400 mb-4 flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                التبعية الجغرافية للمنشأة
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500">القاطع الرئيسي (القضاء / الجانب)</label>
                  <select
                    value={formData.geoMain}
                    onChange={(e) => {
                      const newMain = e.target.value;
                      let newSubOptions = [];
                      if (newMain === 'mosul_right') newSubOptions = NINEVEH_GEOGRAPHY.mosul.sides.right.neighborhoods;
                      else if (newMain === 'mosul_left') newSubOptions = NINEVEH_GEOGRAPHY.mosul.sides.left.neighborhoods;
                      else {
                        const dist = NINEVEH_GEOGRAPHY.districts.find(d => d.id === newMain);
                        if (dist) newSubOptions = dist.subdistricts;
                      }
                      setFormData({ ...formData, geoMain: newMain, geoSub: newSubOptions[0] || '' });
                    }}
                    className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-white outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/30 transition-all shadow-inner font-bold text-xs"
                  >
                    <optgroup label="مركز محافظة نينوى">
                      <option value="mosul_right">الجانب الأيمن</option>
                      <option value="mosul_left">الجانب الأيسر</option>
                    </optgroup>
                    <optgroup label="الأقضية والنواحي">
                      {NINEVEH_GEOGRAPHY.districts.map(d => (
                        <option key={d.id} value={d.id}>{d.label}</option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500">المنطقة الفرعية (الحي / الناحية)</label>
                  <select
                    value={formData.geoSub}
                    onChange={(e) => setFormData({ ...formData, geoSub: e.target.value })}
                    className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-white outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/30 transition-all shadow-inner font-bold text-xs"
                  >
                    {subOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

          </form>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-200 dark:border-white/5 bg-white/50 dark:bg-slate-900/40 flex items-center justify-end gap-3 shrink-0 backdrop-blur-sm">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3.5 rounded-2xl text-xs font-black text-slate-300 hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
          >
            إلغاء
          </button>
          <button
            type="submit"
            form="establishment-form"
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-l from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white text-sm font-black transition-all flex items-center gap-2 shadow-[0_10px_25px_-5px_rgba(20,184,166,0.4)] hover:shadow-[0_15px_35px_-5px_rgba(20,184,166,0.5)] hover:-translate-y-0.5 active:translate-y-0"
          >
            <Store className="w-4 h-4" />
            {mode === 'edit' ? 'حفظ التعديلات المدخلة' : 'إضافة المنشأة للشبكة'}
          </button>
        </div>

      </div>
    </div>
  );
};

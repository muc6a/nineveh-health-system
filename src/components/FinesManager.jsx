import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Edit2, Trash2, Plus, AlertCircle, Save, X, DollarSign } from 'lucide-react';

export const FinesManager = () => {
  const { finesBooklet, setFinesBooklet } = useContext(AppContext);
  const [editingFine, setEditingFine] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ type: '', amount: 0, requiresClosure: false });

  const handleSave = () => {
    if (!formData.type || formData.amount <= 0) return;
    
    if (editingFine) {
      setFinesBooklet(prev => prev.map(f => f.id === editingFine.id ? { ...formData, id: f.id } : f));
      setEditingFine(null);
    } else {
      setFinesBooklet(prev => [...prev, { ...formData, id: 'fine_' + Date.now() }]);
      setIsAdding(false);
    }
    setFormData({ type: '', amount: 0, requiresClosure: false });
  };

  const handleDelete = (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذه الغرامة؟')) {
      setFinesBooklet(prev => prev.filter(f => f.id !== id));
    }
  };

  return (
    <div className="glassmorphic-card p-6 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-base font-black text-slate-800 dark:text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-red-500" />
            <span>كراس الغرامات القانونية</span>
          </h2>
          <p className="text-[10px] text-slate-400 mt-1 text-right">إدارة أنواع المخالفات وقيمة الغرامات المقررة رسمياً</p>
        </div>
        <button 
          onClick={() => { setIsAdding(true); setEditingFine(null); setFormData({ type: '', amount: 0, requiresClosure: false }); }}
          className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة غرامة جديدة</span>
        </button>
      </div>

      {(isAdding || editingFine) && (
        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5 text-right">
              <label className="text-xs font-bold text-slate-500">نوع المخالفة</label>
              <input 
                type="text" 
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value})}
                placeholder="مثال: عدم وجود إجازة صحية"
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm text-right focus:outline-none focus:border-red-500"
              />
            </div>
            <div className="space-y-1.5 text-right">
              <label className="text-xs font-bold text-slate-500">مبلغ الغرامة (دينار عراقي)</label>
              <input 
                type="text" 
                value={formData.amount === 0 ? '' : formData.amount.toLocaleString()}
                onChange={e => {
                  const rawValue = e.target.value.replace(/,/g, '');
                  if (!isNaN(rawValue) && rawValue !== '') {
                    setFormData({...formData, amount: Number(rawValue)});
                  } else if (rawValue === '') {
                    setFormData({...formData, amount: 0});
                  }
                }}
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm text-right focus:outline-none focus:border-red-500"
              />
            </div>
          </div>
          <div className="flex items-center justify-between text-right">
             <div className="flex items-center gap-2">
               <input 
                 type="checkbox" 
                 checked={formData.requiresClosure}
                 onChange={e => setFormData({...formData, requiresClosure: e.target.checked})}
                 className="w-5 h-5 accent-red-500"
               />
               <span className="text-xs font-bold text-slate-700 dark:text-slate-300">هذه المخالفة تتطلب إغلاق المنشأة فوراً</span>
             </div>
             <div className="flex gap-2">
               <button onClick={() => { setIsAdding(false); setEditingFine(null); }} className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold">إلغاء</button>
               <button onClick={handleSave} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-2">
                 <Save className="w-4 h-4" /> حفظ
               </button>
             </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {finesBooklet?.map(fine => (
          <div key={fine.id} className="flex flex-col md:flex-row items-center justify-between p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl group hover:border-red-300 transition-colors">
            <div className="flex items-center gap-4 w-full md:w-auto text-right mb-4 md:mb-0">
              <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-800 dark:text-white">{fine.type}</h3>
                <p className="text-xs text-slate-500 font-medium">مبلغ الغرامة: <span className="text-red-600 font-black">{fine.amount.toLocaleString()} د.ع</span></p>
                {fine.requiresClosure && <span className="inline-block mt-1 text-[9px] px-2 py-0.5 rounded border bg-amber-100 text-amber-700 border-amber-200">تتطلب إغلاق</span>}
              </div>
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <button 
                onClick={() => { setEditingFine(fine); setFormData({ type: fine.type, amount: fine.amount, requiresClosure: fine.requiresClosure || false }); setIsAdding(false); }}
                className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 flex items-center justify-center transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleDelete(fine.id)}
                className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

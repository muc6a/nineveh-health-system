import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Book, X, Search, ShieldAlert, Check, DollarSign } from 'lucide-react';

export const FinesBookletModal = ({ isOpen, onClose, establishment, requestType = 'fine' }) => {
  const { finesBooklet, user, setPenaltyRequests, notify } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFineId, setSelectedFineId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !establishment) return null;

  // If requestType is closure, we might want to show all fines, but require the user to pick one. 
  // All closures come with fines in this system.
  const filteredFines = finesBooklet.filter(f => 
    f.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedFine = finesBooklet.find(f => f.id === selectedFineId);

  const handleSubmit = () => {
    if (!selectedFine) return;
    
    setIsSubmitting(true);
    setTimeout(() => {
      const newRequest = {
        id: 'req_' + Date.now(),
        establishmentId: establishment.id,
        establishmentName: establishment.name,
        teamId: user?.id || 'team_1',
        teamName: user?.name || 'اللجنة الرقابية',
        date: new Date().toISOString(),
        type: requestType,
        status: 'pending',
        reason: `تطبيق كراس الغرامات: ${selectedFine.type}`,
        amount: selectedFine.amount,
        fineId: selectedFine.id
      };

      if (setPenaltyRequests) {
        setPenaltyRequests(prev => [newRequest, ...prev]);
      }
      
      const msg = requestType === 'closure' 
        ? `تم رفع طلب إغلاق وتشميع مع غرامة (${selectedFine.amount.toLocaleString()} د.ع) لمنشأة ${establishment.name} بنجاح.`
        : `تم رفع طلب غرامة مالية بمبلغ ${selectedFine.amount.toLocaleString()} د.ع لمنشأة ${establishment.name} بنجاح.`;
        
      notify(msg, 'success', true);
      
      setIsSubmitting(false);
      onClose();
    }, 800);
  };

  const isClosure = requestType === 'closure';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[2rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className={`p-6 flex items-center justify-between border-b ${isClosure ? 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900/50' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800'}`}>
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isClosure ? 'bg-red-500/10 text-red-600' : 'bg-rose-500/10 text-rose-600'}`}>
              {isClosure ? <ShieldAlert className="w-6 h-6" /> : <Book className="w-6 h-6" />}
            </div>
            <div>
              <h2 className={`text-xl font-black ${isClosure ? 'text-red-700 dark:text-red-400' : 'text-slate-800 dark:text-white'}`}>
                {isClosure ? 'طلب إغلاق وتشميع رسمي' : 'كراس الغرامات القانونية'}
              </h2>
              <p className="text-xs text-slate-500 font-bold mt-1">تحديد المخالفة لمنشأة: <span className="text-teal-600 dark:text-teal-400">{establishment.name}</span></p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-600 transition-colors shadow-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="relative mb-6">
            <Search className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="ابحث في المخالفات القانونية..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-12 py-3 text-sm font-bold outline-none transition-colors text-slate-800 dark:text-slate-200 ${isClosure ? 'focus:border-red-500' : 'focus:border-rose-500'}`}
            />
          </div>

          <div className="space-y-3">
            {filteredFines.length > 0 ? filteredFines.map(fine => (
              <label 
                key={fine.id}
                className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  selectedFineId === fine.id 
                    ? (isClosure ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-rose-500 bg-rose-50 dark:bg-rose-900/20') 
                    : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/30'
                }`}
                onClick={() => setSelectedFineId(fine.id)}
              >
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                  selectedFineId === fine.id 
                    ? (isClosure ? 'border-red-500 bg-red-500 text-white' : 'border-rose-500 bg-rose-500 text-white') 
                    : 'border-slate-300 dark:border-slate-600'
                }`}>
                  {selectedFineId === fine.id && <Check className="w-4 h-4" />}
                </div>
                <div className="flex-1">
                  <h3 className={`text-sm font-black ${
                    selectedFineId === fine.id 
                      ? (isClosure ? 'text-red-700 dark:text-red-400' : 'text-rose-700 dark:text-rose-400') 
                      : 'text-slate-700 dark:text-slate-300'
                  }`}>{fine.type}</h3>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-bold">
                      <DollarSign className="w-3.5 h-3.5" />
                      {fine.amount.toLocaleString()} دينار
                    </span>
                    {fine.requiresClosure && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-bold">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        يستوجب الإغلاق
                      </span>
                    )}
                  </div>
                </div>
              </label>
            )) : (
              <div className="text-center p-8 text-slate-400 text-sm font-bold">
                لا توجد مخالفات تطابق بحثك.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            {selectedFine && (
              <p className="text-sm font-bold text-slate-600 dark:text-slate-400">
                المبلغ الإجمالي المرفق: <span className={`${isClosure ? 'text-red-600' : 'text-rose-600'} font-black text-lg`}>{selectedFine.amount.toLocaleString()} د.ع</span>
              </p>
            )}
          </div>
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="px-6 py-3 rounded-xl font-bold text-sm text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              إلغاء
            </button>
            <button
              onClick={handleSubmit}
              disabled={!selectedFine || isSubmitting}
              className={`px-8 py-3 rounded-xl text-white font-black text-sm shadow-lg disabled:opacity-50 transition-all active:scale-95 flex items-center gap-2 ${
                isClosure 
                  ? 'bg-gradient-to-l from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 shadow-red-500/30' 
                  : 'bg-gradient-to-l from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 shadow-rose-500/30'
              }`}
            >
              {isSubmitting ? 'جاري الإرسال...' : (isClosure ? 'إرسال طلب الإغلاق' : 'إرسال طلب الغرامة للمالية')}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

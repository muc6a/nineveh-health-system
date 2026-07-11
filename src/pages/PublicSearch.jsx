import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { AnimatedLogo } from '../components/AnimatedLogo';
import { ThemeToggle } from '../components/ThemeToggle';
import { Search, MapPin, Building, Star, ArrowLeft, AlertCircle, X, Camera, Upload, Map as MapIcon } from 'lucide-react';
import { NinevehMap } from '../components/NinevehMap';

export const PublicSearch = () => {
  const { establishments, navigate, publicCMS, addReport } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [submittedSearchTerm, setSubmittedSearchTerm] = useState('');

  // Report Modal States
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportEstName, setReportEstName] = useState('');
  const [reportEstAddress, setReportEstAddress] = useState('');
  const [reportSuccess, setReportSuccess] = useState(false);

  const handleReportSubmit = (e) => {
    e.preventDefault();
    if (!reportEstName || !reportEstAddress) return;
    
    addReport({
      estName: reportEstName,
      sector: reportEstAddress,
      text: 'بلاغ عن منشأة غير مدرجة في النظام ويرجى فحصها.',
      type: 'غير مدرج',
      status: 'pending'
    });
    
    setReportSuccess(true);
    setTimeout(() => {
      setShowReportModal(false);
      setReportSuccess(false);
      setReportEstName('');
      setReportEstAddress('');
    }, 3000);
  };

  const filteredEstablishments = establishments.filter(est => {
    return est.name.toLowerCase().includes(submittedSearchTerm.toLowerCase()) || 
           est.owner.toLowerCase().includes(submittedSearchTerm.toLowerCase());
  });

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    setSubmittedSearchTerm(searchTerm);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-300">
      
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10 p-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AnimatedLogo variant="default" className="w-12 h-12" />
            <div className="text-right">
              <h1 className="text-sm font-black text-slate-800 dark:text-white">بوابة المواطن للرقابة الصحية</h1>
              <p className="text-[10px] text-teal-600 dark:text-teal-400 font-bold">دائرة صحة نينوى - قسم الصحة العامة</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/login')}
              className="text-[10px] font-bold text-slate-500 hover:text-teal-600 transition-colors"
            >
              دخول الموظفين
            </button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Announcement Bar */}
      {publicCMS?.announcement && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 text-center py-2 px-4">
          <p className="text-xs font-bold text-amber-700 dark:text-amber-400 flex justify-center items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {publicCMS.announcement}
          </p>
        </div>
      )}

      {/* Hero Search Area */}
      <div className="bg-gradient-to-b from-teal-600/10 to-transparent py-12 px-4 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white">
            {publicCMS?.heroTitle || 'البحث والتقصي عن المنشآت الصحية والتجارية في نينوى'}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {publicCMS?.heroSubtext || 'استعلم عن التقييم الصحي ومدى التزام المنشآت الغذائية بالشروط الصحية قبل الشراء، أو قدم شكوى مباشرة لفرق التفتيش.'}
          </p>

          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 pt-4">
            <div className="relative flex-1">
              <input
                type="search"
                placeholder="ابحث باسم المنشأة (مطعم، صالون، معمل، قاعة...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-4 pr-12 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-bold shadow-lg shadow-slate-200/50 dark:shadow-none outline-none focus:border-teal-500 text-right text-slate-800 dark:text-white transition-all"
              />
              <Search className="w-5 h-5 text-slate-400 absolute right-4 top-4" />
            </div>
            
            <button
              type="submit"
              className="sm:w-32 py-4 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-black shadow-lg shadow-teal-500/20 transition-all active:scale-[0.98] cursor-pointer"
            >
              البحث
            </button>
          </form>
        </div>
      </div>

      {/* Results */}
      <main className="flex-1 max-w-5xl mx-auto w-full p-4 md:p-8">

        {submittedSearchTerm ? (
          <>
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-700 dark:text-slate-300">
                نتائج البحث عن "{submittedSearchTerm}" ({filteredEstablishments.length})
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEstablishments.map((est) => (
                <div 
                  key={est.id} 
                  onClick={() => navigate(`/scan/${est.id}`)}
                  className="glassmorphic-card p-5 cursor-pointer hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black ${
                      est.lastInspection === 'لم يزر بعد' 
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-500' 
                        : est.score >= 90 
                          ? 'bg-teal-500/10 text-teal-600 border border-teal-500/20' 
                          : est.score >= 70 
                            ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20' 
                            : 'bg-red-500/10 text-red-600 border border-red-500/20'
                    }`}>
                      {est.lastInspection === 'لم يزر بعد' ? 'غير مقيم بعد' : `${est.score}% التزام`}
                    </span>
                    <span className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                      <ArrowLeft className="w-4 h-4" />
                    </span>
                  </div>
                  
                  <h3 className="text-base font-black text-slate-800 dark:text-white mb-1.5">{est.name}</h3>
                  
                  <div className="space-y-2 text-xs font-bold text-slate-500 dark:text-slate-400 mt-4">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      <span>{est.type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{est.sector}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredEstablishments.length === 0 && (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
                  <Search className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-lg font-black text-slate-700 dark:text-slate-300">لم يتم العثور على نتائج مطابقة</h3>
                <p className="text-sm text-slate-500 mt-2">إذا لم تجد المنشأة، يمكنك الإبلاغ عنها ليتم تسجيلها وتفتيشها.</p>
              </div>
            )}

            {/* Unlisted Establishment Button */}
            <div className="mt-8 text-center border-t border-slate-200 dark:border-slate-800 pt-8">
              <h4 className="text-sm font-bold text-slate-600 dark:text-slate-400 mb-3">المنشأة غير موجودة في قاعدة البيانات؟</h4>
              <button 
                onClick={() => setShowReportModal(true)}
                className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs transition-all shadow-md shadow-amber-500/20"
              >
                أبلغ عن منشأة غير موجودة الآن
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-24 opacity-60">
            <Search className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400 font-bold text-sm">قم بالبحث عن اسم المنشأة أو صاحبها لإظهار التقييم الصحي</p>
          </div>
        )}
      </main>

      {/* Report Unlisted Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              <h2 className="text-sm font-black text-slate-800 dark:text-white flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-500" />
                الإبلاغ عن منشأة غير مسجلة
              </h2>
              <button onClick={() => setShowReportModal(false)} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              {reportSuccess ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-black text-slate-800 dark:text-white mb-2">تم الإرسال بنجاح!</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    تم إيصال بيانات المنشأة للإدارة لغرض تسجيلها في النظام وتوجيه أقرب فريق ميداني لزيارتها. شكراً لتعاونك.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleReportSubmit} className="space-y-4 text-right">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-300">اسم المطعم أو المنشأة</label>
                    <input 
                      type="text" 
                      required
                      value={reportEstName}
                      onChange={(e) => setReportEstName(e.target.value)}
                      placeholder="اكتب اسم المطعم كما هو في اللوحة"
                      className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold focus:border-amber-500 outline-none text-slate-800 dark:text-white"
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-300">عنوان المنشأة التقريبي</label>
                    <input 
                      type="text" 
                      required
                      value={reportEstAddress}
                      onChange={(e) => setReportEstAddress(e.target.value)}
                      placeholder="مثال: الجانب الأيسر - حي الزهور - قرب التقاطع"
                      className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold focus:border-amber-500 outline-none text-slate-800 dark:text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-300">إرفاق صورة للمنشأة (اختياري)</label>
                    <div className="w-full border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group">
                      <Camera className="w-8 h-8 text-slate-400 group-hover:text-amber-500 mx-auto mb-2 transition-colors" />
                      <span className="text-[10px] font-bold text-slate-500 block">اضغط لالتقاط أو رفع صورة للواجهة</span>
                      <input type="file" accept="image/*" className="hidden" />
                    </div>
                  </div>

                  <button type="submit" className="w-full py-3.5 mt-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs transition-all shadow-md shadow-amber-500/20">
                    إرسال البيانات للتدقيق
                  </button>
                  <button type="button" onClick={() => setShowReportModal(false)} className="w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                    إغلاق وخروج
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PublicSearch;

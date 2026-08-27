import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { ThemeToggle } from '../components/ThemeToggle';
import { LogOut, DollarSign, Activity, FileText } from 'lucide-react';

export const AccountantPanel = () => {
  const { user, setUser, navigate, notify, darkMode } = useContext(AppContext);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('auth_token');
    notify('تم تسجيل الخروج بنجاح', 'info');
    navigate('/');
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'} font-sans dir-rtl transition-colors duration-300`}>
      {/* Top Navbar */}
      <div className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border-b sticky top-0 z-40 shadow-sm px-4 py-3 flex justify-between items-center transition-colors duration-300`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-teal-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/20">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-black text-sm md:text-base">بوابة المحاسبين (الإدارة المالية)</h1>
            <p className="text-[10px] md:text-xs text-slate-500 font-bold">مرحباً، {user?.name || 'المحاسب'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors cursor-pointer text-xs font-bold"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline">تسجيل خروج</span>
          </button>
        </div>
      </div>

      <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-2xl p-6 text-center">
          <h2 className="text-xl font-black text-amber-600 dark:text-amber-400 mb-2">واجهة قيد الإنشاء 🚧</h2>
          <p className="text-slate-600 dark:text-slate-400 font-bold">هذه الواجهة مخصصة لاستلام طلبات الغرامات وإصدار وصل القبض. جاري تطويرها حالياً.</p>
        </div>
      </div>
    </div>
  );
};

import React, { useContext } from 'react';
import { AppProvider, AppContext } from './context/AppContext';
import { Router } from './components/Router';
import { NotificationToast } from './components/NotificationToast';
import { BroadcastModal } from './components/BroadcastModal';
import { Hammer } from 'lucide-react';

// Sizing wrapper that reads the configuration globally
const AppContent = () => {
  const { config, notification, notify, user } = useContext(AppContext);

  const getScaleClass = () => {
    if (config.uiScale === 'small') return 'scale-95 origin-top';
    if (config.uiScale === 'large') return 'text-lg';
    return ''; // normal
  };

  const isMaintenance = config.maintenanceMode && user?.role !== 'admin';

  return (
    <div className={`min-h-screen transition-all duration-300 ${getScaleClass()}`}>
      {isMaintenance ? (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 p-6 text-center dir-rtl">
          <div className="bg-slate-800 p-10 rounded-3xl border border-slate-700 shadow-2xl max-w-lg w-full flex flex-col items-center">
            <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mb-6 border border-red-500/30">
              <Hammer className="w-12 h-12 text-red-500 animate-bounce" />
            </div>
            <h1 className="text-3xl font-black text-white mb-4">النظام تحت الصيانة الشاملة 🛑</h1>
            <p className="text-slate-400 font-bold leading-relaxed mb-8">
              عذراً، منظومة الرقابة الصحية تخضع حالياً لتحديثات هامة وجوهرية من قبل إدارة الموقع. لا يمكن الدخول أو تنفيذ أي مهام في الوقت الحالي، يرجى المحاولة لاحقاً.
            </p>
            <div className="w-full bg-slate-900 rounded-xl p-4 text-xs text-slate-500 font-bold border border-slate-700">
              {new Date().toLocaleString('ar-IQ')} - نينوى
            </div>
          </div>
        </div>
      ) : (
        <Router />
      )}
      <NotificationToast 
        key={notification.id} 
        message={notification.message} 
        type={notification.type} 
        onClose={() => notify('', 'info')} 
      />
      <BroadcastModal />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;

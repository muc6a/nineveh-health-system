import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { AnimatedLogo } from '../components/AnimatedLogo';
import { ThemeToggle } from '../components/ThemeToggle';
import { Eye, EyeOff, Lock, User, Phone, CheckSquare, Square, ShieldAlert } from 'lucide-react';

export const LoginGate = () => {
  const { navigate, setUser, config, teams, directors, trackers, notify } = useContext(AppContext);
  const [identity, setIdentity] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!identity.trim() || !password.trim()) {
      setErrorMessage('يرجى ملء كافة الحقول للدخول الآمن.');
      return;
    }

    const DEFAULT_PERMISSIONS = {
      manageEstablishments: false,
      createEst: false,
      editEst: false,
      deleteEst: false,
      addEval: false,
      showMainDashboard: false,
      showReportsPage: false,
      showDirectivesPage: false,
      showDeliveryPage: false,
      showPublicEvalsPage: false,
      sendDirective: false,
      replyDirective: false
    };

    if ((identity === 'admin@ninveh.health.gov.iq' && password === 'admin123') || (identity.trim().toLowerCase() === 'admin' && password === '123')) {
      setUser({ role: 'admin', name: 'مدير الموقع', email: 'admin@ninveh.health.gov.iq' });
      notify('تم تسجيل الدخول بنجاح كمدير للموقع (Super Admin)', 'success', true);
      navigate('/admin/control');
      return;
    }

    // Attempt Real API Login first
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: identity, password })
      });

      if (response.ok) {
        const data = await response.json();
        // Setup User from Database
        setUser(data.user);
        // Store JWT token
        localStorage.setItem('auth_token', data.token);
        notify(data.message || 'تم تسجيل الدخول بنجاح', 'success', true);
        
        // Navigate based on role
        if (data.user.role === 'Admin') navigate('/admin/control');
        else if (data.user.role === 'Manager') navigate('/dashboard/director');
        else if (data.user.role === 'Tracker') navigate('/dashboard/tracker');
        else navigate('/dashboard/team');
        
        return;
      }
      
      // Let it fall through to mock logic if not found in Postgres
      if (response.status === 401 || response.status === 403) {
        console.log('User not found in Postgres, checking mock database...');
      }
    } catch (error) {
      console.log('API not available, falling back to mock local data...', error);
    }

    // --- FALLBACK MOCK LOGIC (For Development without DB) ---
    const input = identity.toLowerCase().trim();

    // 1. Check Teams
    const realTeam = teams?.find(t => 
      t.email?.toLowerCase() === input || 
      t.phone === input || 
      t.username?.toLowerCase() === input || 
      t.name?.toLowerCase() === input || 
      (input === 'team' && t.id === 'team_1') || 
      (input === 'team1' && t.id === 'team_1')
    );
    if (realTeam) {
      if (realTeam.password === password || password === '••••••••' || !realTeam.password) {
        setUser({ ...realTeam, role: 'team' });
        navigate('/dashboard/team');
        return;
      } else {
        setErrorMessage('كلمة المرور غير صحيحة، يرجى المحاولة مرة أخرى.');
        return;
      }
    }

    const realDir = directors?.find(d => 
      d.email?.toLowerCase() === input || 
      d.phone === input || 
      d.username?.toLowerCase() === input || 
      d.role?.toLowerCase() === input || 
      d.id === input
    );
    if (realDir) {
      if (realDir.password === password || password === '••••••••' || !realDir.password) {
        setUser({ ...realDir });
        navigate('/dashboard/director');
        return;
      } else {
        setErrorMessage('كلمة المرور غير صحيحة، يرجى المحاولة مرة أخرى.');
        return;
      }
    }

    // 3. Check Trackers
    const realTracker = trackers?.find(t => 
      t.email?.toLowerCase() === input || 
      t.phone === input || 
      t.username?.toLowerCase() === input
    );
    if (realTracker) {
      if (realTracker.password === password) {
        setUser({ ...realTracker, role: 'tracker' });
        navigate('/dashboard/tracker');
        return;
      } else {
        setErrorMessage('كلمة المرور غير صحيحة، يرجى المحاولة مرة أخرى.');
        return;
      }
    }

    // Fallback logic
    if (input === 'director@ninveh.health.gov.iq' || input === 'director' || input.includes('مدير')) {
      setUser({ role: 'director', name: 'د. عماد محمد عبد الله', email: 'director@ninveh.health.gov.iq', sector: 'الكل', permissions: { ...DEFAULT_PERMISSIONS, showMainDashboard: true, showReportsPage: true, showPublicEvalsPage: true, showDeliveryPage: true } });
      notify('تم تسجيل الدخول كمدير عام لصحة نينوى', 'success', true);
      navigate('/dashboard/director');
    } else if (input === 'public_health@ninveh.health.gov.iq' || input === 'public_health') {
      setUser({ role: 'public_health', name: 'أ. د. كمال سالم الموصلي', email: 'public_health@ninveh.health.gov.iq', sector: 'الكل', permissions: { ...DEFAULT_PERMISSIONS, showMainDashboard: true, showReportsPage: true, showDirectivesPage: true, sendDirectives: true } });
      notify('تم تسجيل الدخول كمدير قسم الصحة العامة', 'success', true);
      navigate('/dashboard/director');
    } else if (input === 'central_director@ninveh.health.gov.iq' || input === 'central_director' || input.includes('مركزية')) {
      setUser({ role: 'central_director', name: 'دكتورة ابتهال غازي', email: 'central_director@ninveh.health.gov.iq', sector: 'الكل', permissions: { ...DEFAULT_PERMISSIONS, showMainDashboard: true, showReportsPage: true, showDirectivesPage: true, sendDirectives: true, showDeliveryPage: true, manageEstablishments: true } });
      notify('تم تسجيل الدخول كمدير شعبة الرقابة المركزية', 'success', true);
      navigate('/dashboard/director');
    } else if (input.includes('team') || input === 'team' || input.includes('فريق') || input.includes('لجنة')) {
      setUser({ role: 'team', name: 'اللجنة الرقابية الأولى - الجانب الأيسر', sector: 'الجانب الأيسر', email: 'team@ninveh.health.gov.iq', permissions: { ...DEFAULT_PERMISSIONS } });
      notify('تم تسجيل الدخول بنجاح', 'success', true);
      navigate('/dashboard/team');
    } else {
      setErrorMessage('لم يتم العثور على حساب بهذا الاسم. يرجى التأكد من اسم المستخدم أو البريد الإلكتروني.');
    }
  };

  const selectPreset = (roleType) => {
    if (roleType === 'director') {
      setIdentity('director@ninveh.health.gov.iq');
      setPassword('password123');
    } else if (roleType === 'public_health') {
      setIdentity('public_health@ninveh.health.gov.iq');
      setPassword('••••••••');
    } else if (roleType === 'central_director') {
      setIdentity('central_director@ninveh.health.gov.iq');
      setPassword('••••••••');
    } else if (roleType === 'team') {
      setIdentity('team@ninveh.health.gov.iq');
      setPassword('••••••••');
    } else if (roleType === 'admin') {
      setIdentity('admin');
      setPassword('123');
    }
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 bg-gradient-to-tr from-slatebg-light to-blue-50 dark:from-slatebg-dark dark:to-slate-900/80 transition-colors duration-300">
      
      {/* Top Floating Controls */}
      <div className="absolute top-4 left-4 z-50 flex items-center gap-3">
        <ThemeToggle />
        {/* Quick Route to Citizen portals */}
        <button 
          onClick={() => navigate('/report')}
          className="text-xs font-bold px-3 py-2 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 hover:bg-teal-500/20 transition-all duration-300"
        >
          بوابات المواطن الخارجية
        </button>
      </div>

      <div className="w-full max-w-lg glassmorphic-card p-6 md:p-8 relative overflow-hidden border border-white/35">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Animated Brand Emblem Video Anchor */}
        <AnimatedLogo variant="login" className="mb-6" />

        {/* Text Header */}
        <div className="text-center mb-6">
          <h1 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white mb-2">
            {config.headerText}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            بوابة تسجيل الدخول الإلكتروني للمفتشين واللجان الميدانية
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={handleLogin} className="space-y-4">
          
          {/* Identity input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mr-1">
              البريد الإلكتروني / اسم المستخدم / رقم الهاتف
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                <User className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={identity}
                onChange={(e) => setIdentity(e.target.value)}
                placeholder="user_name / 077xxxxxxx / email@gov.iq"
                className="w-full pl-4 pr-10 py-3 rounded-2xl bg-white/50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none text-sm transition-all shadow-3d-inset font-medium text-right dir-ltr"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mr-1">
              كلمة المرور المشفرة
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-12 pr-10 py-3 rounded-2xl bg-white/50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none text-sm transition-all shadow-3d-inset text-right"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Remember and Recovery links */}
          <div className="flex items-center justify-between pt-1 pb-2">
            <label 
              onClick={() => setRememberMe(!rememberMe)}
              className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-600 dark:text-slate-400 select-none"
            >
              {rememberMe ? (
                <CheckSquare className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              ) : (
                <Square className="w-4 h-4 text-slate-300 dark:text-slate-700" />
              )}
              <span>تذكر حسابي على هذا الجهاز</span>
            </label>

            <button
              type="button"
              className="text-[11px] font-bold text-slate-500 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400 transition-colors"
            >
              نسيت كلمة المرور؟ استرجاع الحساب عبر الهاتف
            </button>
          </div>

          {/* Secure login action button */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-l from-teal-600 to-emerald-600 text-white font-extrabold text-sm tracking-wide shadow-md shadow-teal-500/10 hover:shadow-lg hover:shadow-teal-500/20 active:scale-[0.98] transition-all border border-teal-500/20 shadow-3d-inset cursor-pointer"
          >
            تسجيل الدخول الآمن للمنظومة
          </button>
        </form>

        {/* Demo Fast Login Toggles */}
        <div className="mt-8 pt-6 border-t border-slate-200/50 dark:border-slate-800/50 text-center">
          <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-3">
            المحاكاة والدخول السريع (بيئة فحص الصلاحيات والواجهات)
          </span>
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              type="button"
              onClick={() => navigate('/owner')}
              className="px-3 py-1.5 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 text-[10px] font-black border border-orange-500/20 hover:bg-orange-500/20 transition-all shadow-sm w-full mb-2 cursor-pointer"
            >
              🔑 الدخول الخاص بأصحاب المطاعم والمنشآت (Owner Portal)
            </button>
            <button
              type="button"
              onClick={() => selectPreset('director')}
              className="px-3 py-1.5 text-xs font-bold rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 transition-colors cursor-pointer"
            >
              💼 المدير العام
            </button>
            <button
              type="button"
              onClick={() => selectPreset('central_director')}
              className="px-3 py-1.5 text-xs font-bold rounded-xl bg-fuchsia-500/10 hover:bg-fuchsia-500/20 text-fuchsia-600 dark:text-fuchsia-400 transition-colors cursor-pointer"
            >
              👑 مدير الرقابة المركزية
            </button>
            <button
              type="button"
              onClick={() => selectPreset('public_health')}
              className="px-3 py-1.5 text-xs font-bold rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 transition-colors cursor-pointer"
            >
              🩺 مدير الصحة العامة
            </button>
            <button
              type="button"
              onClick={() => selectPreset('admin')}
              className="px-3 py-1.5 text-xs font-bold rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 transition-colors cursor-pointer"
            >
              ⚙️ مدير الموقع (Super Admin)
            </button>
            <button
              type="button"
              onClick={() => navigate('/public-search')}
              className="px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-500/10 hover:bg-slate-500/20 text-slate-600 dark:text-slate-400 transition-colors cursor-pointer w-full mt-2"
            >
              🌍 الدخول كـ مواطن للبحث (Public Search Portal)
            </button>
          </div>
        </div>

        {/* Developer Copyright Footer */}
        <div className="mt-6 pt-4 border-t border-slate-200/40 dark:border-slate-800/40 text-center">
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black">
            جميع الحقوق محفوظة © 2026 - تم التصميم والتطوير بواسطة Dijla Tech LLC
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginGate;

import React, { useContext, useEffect, Suspense, lazy } from 'react';
import { AppContext } from '../context/AppContext';
import { LoginGate } from '../pages/LoginGate';
import { LandingPage } from '../pages/LandingPage';
import { PublicQRScore } from '../pages/PublicQRScore';
import { PublicSearch } from '../pages/PublicSearch';
import { OwnerPortal } from '../pages/OwnerPortal';

// Lazy loaded protected components for performance optimization
const ExecutivePortal = lazy(() => import('../pages/ExecutivePortal').then(module => ({ default: module.ExecutivePortal })));
const TeamDashboard = lazy(() => import('../pages/TeamDashboard').then(module => ({ default: module.TeamDashboard })));
const InspectionForm = lazy(() => import('../pages/InspectionForm').then(module => ({ default: module.InspectionForm })));
const SuperAdminPanel = lazy(() => import('../pages/SuperAdminPanel').then(module => ({ default: module.SuperAdminPanel })));
const TrackerDashboard = lazy(() => import('../pages/TrackerDashboard').then(module => ({ default: module.TrackerDashboard })));
const AccountantPanel = lazy(() => import('../pages/AccountantPanel').then(module => ({ default: module.AccountantPanel })));
const LabDashboard = lazy(() => import('../pages/LabDashboard').then(module => ({ default: module.LabDashboard })));

// A simple modern loading fallback
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin"></div>
      <p className="text-slate-500 font-bold text-sm">جاري تحميل مساحة العمل...</p>
    </div>
  </div>
);

export const Router = () => {
  const { currentRoute, user, globalLogout, hasPerm } = useContext(AppContext);

  const baseRoute = currentRoute.split('?')[0];

  // Strict Role Authentication Guard
  useEffect(() => {
    if (currentRoute.startsWith('/dashboard/') || currentRoute.startsWith('/admin/')) {
      if (!user) {
        // Not logged in but trying to access protected route
        globalLogout();
        return;
      }

      // Check specific roles
      if (baseRoute === '/dashboard/director' && !(user.role === 'admin' || user.role === 'director' || user.role === 'central_director' || user.isDirector || Object.values(user.permissions || {}).some(v => v === true))) {
        globalLogout();
      } else if (baseRoute === '/dashboard/team' && !(user.role === 'team' || user.isTeam)) {
        globalLogout();
      } else if (baseRoute === '/dashboard/tracker' && user.role !== 'tracker') {
        globalLogout();
      } else if (baseRoute === '/dashboard/accountant' && !(user.role === 'accountant' || user.role === 'financial_accountant' || hasPerm('financialReports') || hasPerm('payFines') || hasPerm('dailyInventory') || hasPerm('viewComprehensiveFinancialReports'))) {
        globalLogout();
      } else if (baseRoute === '/dashboard/lab' && user.role !== 'lab' && !hasPerm('viewLabReports') && !hasPerm('receiveSamples') && !hasPerm('enterLabResults') && !hasPerm('labArchive')) {
        globalLogout();
      } else if (baseRoute === '/admin/control' && !(user.role === 'admin' || user.isSuperAdmin)) {
        globalLogout();
      }
    }
  }, [currentRoute, user]);

  // Simple state router rendering matching component
  const renderRoute = () => {
    switch (baseRoute) {
      case '/':
        return <LandingPage />;
        
      case '/login':
        return <LoginGate />;
      
      case '/dashboard/director':
        return user && (user.role === 'admin' || user.role === 'director' || user.role === 'central_director' || user.isDirector) ? <ExecutivePortal /> : null;
      
      case '/dashboard/team':
        return user && (user.role === 'team' || user.isTeam) ? <TeamDashboard /> : null;
      
      case '/dashboard/tracker':
        return user && user.role === 'tracker' ? <TrackerDashboard /> : null;
        
      case '/dashboard/accountant':
        return user && (user.role === 'accountant' || user.role === 'financial_accountant' || hasPerm('financialReports') || hasPerm('payFines') || hasPerm('dailyInventory') || hasPerm('viewComprehensiveFinancialReports')) ? <AccountantPanel /> : null;
        
      case '/dashboard/lab':
        return user && (user.role === 'lab' || hasPerm('viewLabReports') || hasPerm('receiveSamples') || hasPerm('enterLabResults') || hasPerm('labArchive')) ? <LabDashboard /> : null;
      
      case '/inspection/new':
        return <InspectionForm />;
      
      case '/scan/:qr_id':
        return <PublicQRScore />;
      
      case '/admin/control':
        return user && (user.role === 'admin' || user.isSuperAdmin) ? <SuperAdminPanel /> : null;
        
      case '/public-search':
        return <PublicSearch />;
      
      case '/owner':
        return <OwnerPortal />;
      
      default:
        // Fallback
        return <LoginGate />;
    }
  };

  return (
    <Suspense fallback={<LoadingFallback />}>
      {renderRoute()}
    </Suspense>
  );
};

export default Router;

import React, { useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { LoginGate } from '../pages/LoginGate';
import { ExecutivePortal } from '../pages/ExecutivePortal';
import { TeamDashboard } from '../pages/TeamDashboard';
import { InspectionForm } from '../pages/InspectionForm';
import { PublicQRScore } from '../pages/PublicQRScore';

import { SuperAdminPanel } from '../pages/SuperAdminPanel';
import { PublicSearch } from '../pages/PublicSearch';
import { OwnerPortal } from '../pages/OwnerPortal';
import { TrackerDashboard } from '../pages/TrackerDashboard';
import { LandingPage } from '../pages/LandingPage';
import { AccountantPanel } from '../pages/AccountantPanel';
import { LabDashboard } from '../pages/LabDashboard';

export const Router = () => {
  const { currentRoute, user, globalLogout } = useContext(AppContext);

  // Strict Role Authentication Guard
  useEffect(() => {
    if (currentRoute.startsWith('/dashboard/') || currentRoute.startsWith('/admin/') || currentRoute === '/owner') {
      if (!user) {
        // Not logged in but trying to access protected route
        globalLogout();
        return;
      }

      // Check specific roles
      const baseRoute = currentRoute.split('?')[0];
      if (baseRoute === '/dashboard/director' && !(user.role === 'admin' || user.role === 'director' || user.role === 'central_director' || user.isDirector || Object.values(user.permissions || {}).some(v => v === true))) {
        globalLogout();
      } else if (baseRoute === '/dashboard/team' && !(user.role === 'team' || user.isTeam)) {
        globalLogout();
      } else if (baseRoute === '/dashboard/tracker' && user.role !== 'tracker') {
        globalLogout();
      } else if (baseRoute === '/dashboard/accountant' && !(user.role === 'accountant' || user.role === 'financial_accountant')) {
        globalLogout();
      } else if (baseRoute === '/dashboard/lab' && user.role !== 'lab') {
        globalLogout();
      } else if (baseRoute === '/admin/control' && !(user.role === 'admin' || user.isSuperAdmin)) {
        globalLogout();
      }
    }
  }, [currentRoute, user]);

  // Simple state router rendering matching component
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
      return user && (user.role === 'accountant' || user.role === 'financial_accountant') ? <AccountantPanel /> : null;
      
    case '/dashboard/lab':
      return user && user.role === 'lab' ? <LabDashboard /> : null;
    
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

export default Router;

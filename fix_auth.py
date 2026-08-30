import os
import re

def main():
    # 1. Update AppContext.jsx
    app_context = 'src/context/AppContext.jsx'
    with open(app_context, 'r', encoding='utf-8') as f:
        content = f.read()

    logout_func = """
  const globalLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setUser(null);
    window.location.replace('/');
  };

  return (
"""
    content = content.replace("  return (", logout_func)
    
    # Export it
    value_export = """    <AppContext.Provider value={{
      globalLogout,"""
    content = content.replace("<AppContext.Provider value={{", value_export)

    with open(app_context, 'w', encoding='utf-8') as f:
        f.write(content)

    # 2. Update Router.jsx
    router = 'src/components/Router.jsx'
    with open(router, 'r', encoding='utf-8') as f:
        router_content = f.read()

    router_new = """import React, { useContext, useEffect } from 'react';
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
      if (currentRoute === '/dashboard/director' && !(user.role === 'admin' || user.isDirector)) {
        globalLogout();
      } else if (currentRoute === '/dashboard/team' && !(user.role === 'team' || user.isTeam)) {
        globalLogout();
      } else if (currentRoute === '/dashboard/tracker' && user.role !== 'tracker') {
        globalLogout();
      } else if (currentRoute === '/dashboard/accountant' && user.role !== 'financial_accountant') {
        globalLogout();
      } else if (currentRoute === '/dashboard/lab' && user.role !== 'lab') {
        globalLogout();
      } else if (currentRoute === '/admin/control' && !(user.role === 'admin' || user.isSuperAdmin)) {
        globalLogout();
      }
    }
  }, [currentRoute, user]);

  // Simple state router rendering matching component
  switch (currentRoute) {
    case '/':
      return <LandingPage />;
      
    case '/login':
      return <LoginGate />;
    
    case '/dashboard/director':
      return user && (user.role === 'admin' || user.isDirector) ? <ExecutivePortal /> : null;
    
    case '/dashboard/team':
      return user && (user.role === 'team' || user.isTeam) ? <TeamDashboard /> : null;
    
    case '/dashboard/tracker':
      return user && user.role === 'tracker' ? <TrackerDashboard /> : null;
      
    case '/dashboard/accountant':
      return user && user.role === 'financial_accountant' ? <AccountantPanel /> : null;
      
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
"""
    with open(router, 'w', encoding='utf-8') as f:
        f.write(router_new)
        
    print("Updated Context and Router.")

if __name__ == "__main__":
    main()

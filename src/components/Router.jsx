import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { LoginGate } from '../pages/LoginGate';
import { ExecutivePortal } from '../pages/ExecutivePortal';
import { TeamDashboard } from '../pages/TeamDashboard';
import { InspectionForm } from '../pages/InspectionForm';
import { PublicQRScore } from '../pages/PublicQRScore';
import { DeliveryReports } from '../pages/DeliveryReports';
import { SuperAdminPanel } from '../pages/SuperAdminPanel';
import { PublicSearch } from '../pages/PublicSearch';
import { OwnerPortal } from '../pages/OwnerPortal';
import { TrackerDashboard } from '../pages/TrackerDashboard';

export const Router = () => {
  const { currentRoute } = useContext(AppContext);

  // Simple state router rendering matching component
  switch (currentRoute) {
    case '/login':
    case '/':
      return <LoginGate />;
    
    case '/dashboard/director':
      return <ExecutivePortal />;
    
    case '/dashboard/team':
      return <TeamDashboard />;
    
    case '/dashboard/tracker':
      return <TrackerDashboard />;
    
    case '/inspection/new':
      return <InspectionForm />;
    
    case '/scan/:qr_id':
      return <PublicQRScore />;
    
    case '/report':
      return <DeliveryReports />;
    
    case '/admin/control':
      return <SuperAdminPanel />;
      
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

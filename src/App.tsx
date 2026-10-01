/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Bot, X } from 'lucide-react';
import { LabDataProvider, useLabData } from './context/LabDataContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DemoWalkthroughBar } from './components/DemoWalkthroughBar';
import { LandingScreen } from './components/LandingScreen';
import LabDirectorLogin, { RoleSelectionLogin } from './pages/login/LabDirectorLogin';
import { LOGIN_ROLES } from './pages/login/loginRoles';
import { UserProfileModal } from './components/UserProfileModal';
import { InspectTraceModal } from './components/InspectTraceModal';

// Operational Views
import { DashboardView } from './components/DashboardView';
import { PatientsView } from './components/PatientsView';
import { TestOrdersView } from './components/TestOrdersView';
import { LabTestsCatalogView } from './components/LabTestsCatalogView';
import { ResultsView } from './components/ResultsView';
import { InventoryView } from './components/InventoryView';
import { EquipmentView } from './components/EquipmentView';
import { StaffView } from './components/StaffView';
import { SuppliersView } from './components/SuppliersView';
import { BillingView } from './components/BillingView';

// Railway-HMIS Clinical Modules
import { DoctorAvailabilityView } from './components/DoctorAvailabilityView';
import { PharmacyView } from './components/PharmacyView';
import { PharmacyBillsView } from './components/PharmacyView';
import { PatientPortalView } from './components/PatientPortalView';

// AI Intelligence & Sovereign Views
import { ExecutiveBriefView } from './components/ExecutiveBriefView';
import { RiskCenterView } from './components/RiskCenterView';
import { RecommendationsView } from './components/RecommendationsView';
import { WhatIfSimulatorView } from './components/WhatIfSimulatorView';
import { CopilotView } from './components/CopilotView';

import { ControlCenterView } from './components/ControlCenterView';
import { PrivateProcessingView } from './components/PrivateProcessingView';
import { AuditLogView } from './components/AuditLogView';
import { UploadDataView } from './components/UploadDataView';
import { DataGovernanceView } from './components/DataGovernanceView';
import { ImpactDashboardView } from './components/ImpactDashboardView';
import { IntegrationCenterView } from './components/IntegrationCenterView';

const MainLayout: React.FC = () => {
  const { activeTab, setActiveTab } = useLabData();
  const { currentUser, effectiveRole } = useAuth();
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const canUseCopilot = currentUser?.permissions?.includes('ai:use') === true;

  useEffect(() => {
    const initialTab: Record<string, string> = {
      administrator: 'dashboard',
      lab_manager: 'dashboard',
      technician: 'orders',
      pathologist: 'results',
      finance: 'billing',
      pharmacist: 'pharmacy',
      patient: 'patient-portal',
    };
    setActiveTab(initialTab[effectiveRole] || 'dashboard');
  }, [effectiveRole, setActiveTab]);

  const roleHome: Record<string, string> = {
    administrator: 'dashboard', lab_manager: 'dashboard', technician: 'orders',
    pathologist: 'results', finance: 'billing', pharmacist: 'pharmacy', patient: 'patient-portal',
  };
  const visibleTab = currentUser && !currentUser.permissions.includes('dashboard:read') && activeTab === 'dashboard'
    ? roleHome[effectiveRole]
    : activeTab;

  const renderActiveView = () => {
    // If authenticated as patient, default to patient-centric views
    if (effectiveRole === 'patient') {
      return (
        <ErrorBoundary sectionName="Patient Health Portal" onResetToSafeView={() => setActiveTab('patient-portal')}>
          <PatientPortalView />
        </ErrorBoundary>
      );
    }

    switch (visibleTab) {
      case 'dashboard':
        return (
          <ErrorBoundary sectionName="Dashboard & Operational Overview" onResetToSafeView={() => setActiveTab('dashboard')}>
            <DashboardView />
          </ErrorBoundary>
        );
      case 'doctors':
        return (
          <ErrorBoundary sectionName="Doctor Availability & OPD Roster" onResetToSafeView={() => setActiveTab('dashboard')}>
            <DoctorAvailabilityView />
          </ErrorBoundary>
        );
      case 'pharmacy':
        return (
          <ErrorBoundary sectionName="Hospital Pharmacy & Formulary" onResetToSafeView={() => setActiveTab('dashboard')}>
            <PharmacyView />
          </ErrorBoundary>
        );
      case 'pharmacy-bills':
        return (
          <ErrorBoundary sectionName="Pharmacy Bills" onResetToSafeView={() => setActiveTab('billing')}>
            <PharmacyBillsView />
          </ErrorBoundary>
        );
      case 'patient-portal':
        return (
          <ErrorBoundary sectionName="Patient Health Portal" onResetToSafeView={() => setActiveTab('dashboard')}>
            <PatientPortalView />
          </ErrorBoundary>
        );
      case 'integrations':
        return (
          <ErrorBoundary sectionName="Integrations & EDI Feeds" onResetToSafeView={() => setActiveTab('dashboard')}>
            <IntegrationCenterView />
          </ErrorBoundary>
        );
      case 'patients':
        return (
          <ErrorBoundary sectionName="Patients Management" onResetToSafeView={() => setActiveTab('dashboard')}>
            <PatientsView />
          </ErrorBoundary>
        );
      case 'orders':
        return (
          <ErrorBoundary sectionName="Test Orders Worklist" onResetToSafeView={() => setActiveTab('dashboard')}>
            <TestOrdersView />
          </ErrorBoundary>
        );
      case 'tests':
        return (
          <ErrorBoundary sectionName="Laboratory Test Catalog" onResetToSafeView={() => setActiveTab('dashboard')}>
            <LabTestsCatalogView />
          </ErrorBoundary>
        );
      case 'results':
        return (
          <ErrorBoundary sectionName="Test Results & Verification" onResetToSafeView={() => setActiveTab('dashboard')}>
            <ResultsView />
          </ErrorBoundary>
        );
      case 'inventory':
        return (
          <ErrorBoundary sectionName="Reagents & Consumables Inventory" onResetToSafeView={() => setActiveTab('dashboard')}>
            <InventoryView />
          </ErrorBoundary>
        );
      case 'equipment':
        return (
          <ErrorBoundary sectionName="Analyzers & Equipment" onResetToSafeView={() => setActiveTab('dashboard')}>
            <EquipmentView />
          </ErrorBoundary>
        );
      case 'staff':
        return (
          <ErrorBoundary sectionName="Staff Directory & Rosters" onResetToSafeView={() => setActiveTab('dashboard')}>
            <StaffView />
          </ErrorBoundary>
        );
      case 'suppliers':
        return (
          <ErrorBoundary sectionName="Suppliers & Vendors" onResetToSafeView={() => setActiveTab('dashboard')}>
            <SuppliersView />
          </ErrorBoundary>
        );
      case 'billing':
        return (
          <ErrorBoundary sectionName="Billing & Revenue Ledger" onResetToSafeView={() => setActiveTab('dashboard')}>
            <BillingView />
          </ErrorBoundary>
        );

      case 'executive-brief':
        return (
          <ErrorBoundary sectionName="Executive Intelligence Brief" onResetToSafeView={() => setActiveTab('dashboard')}>
            <ExecutiveBriefView />
          </ErrorBoundary>
        );
      case 'risk-center':
        return (
          <ErrorBoundary sectionName="AI Risk Center" onResetToSafeView={() => setActiveTab('dashboard')}>
            <RiskCenterView />
          </ErrorBoundary>
        );
      case 'recommendations':
        return (
          <ErrorBoundary sectionName="AI Prescriptive Recommendations" onResetToSafeView={() => setActiveTab('dashboard')}>
            <RecommendationsView />
          </ErrorBoundary>
        );
      case 'what-if':
        return (
          <ErrorBoundary sectionName="What-If Operational Simulator" onResetToSafeView={() => setActiveTab('dashboard')}>
            <WhatIfSimulatorView />
          </ErrorBoundary>
        );
      case 'copilot':
        return (
          <ErrorBoundary sectionName="Smart Lab Copilot" onResetToSafeView={() => setActiveTab('dashboard')}>
            <CopilotView />
          </ErrorBoundary>
        );

      case 'control-center':
        return (
          <ErrorBoundary sectionName="Sovereign Control Center" onResetToSafeView={() => setActiveTab('dashboard')}>
            <ControlCenterView />
          </ErrorBoundary>
        );
      case 'private-processing':
        return (
          <ErrorBoundary sectionName="Private Processing Safeguards" onResetToSafeView={() => setActiveTab('dashboard')}>
            <PrivateProcessingView />
          </ErrorBoundary>
        );
      case 'audit':
        return (
          <ErrorBoundary sectionName="Audit Trail & Cryptographic Logs" onResetToSafeView={() => setActiveTab('dashboard')}>
            <AuditLogView />
          </ErrorBoundary>
        );

      case 'upload':
        return (
          <ErrorBoundary sectionName="CSV Upload & Telemetry Import" onResetToSafeView={() => setActiveTab('dashboard')}>
            <UploadDataView />
          </ErrorBoundary>
        );
      case 'governance':
        return (
          <ErrorBoundary sectionName="Data Governance & Compliance" onResetToSafeView={() => setActiveTab('dashboard')}>
            <DataGovernanceView />
          </ErrorBoundary>
        );
      case 'impact':
        return (
          <ErrorBoundary sectionName="Impact & Operational Metrics" onResetToSafeView={() => setActiveTab('dashboard')}>
            <ImpactDashboardView />
          </ErrorBoundary>
        );

      default:
        return (
          <ErrorBoundary sectionName="Dashboard" onResetToSafeView={() => setActiveTab('dashboard')}>
            <DashboardView />
          </ErrorBoundary>
        );
    }
  };

  return (
    <div className="h-dvh max-h-dvh overflow-hidden bg-slate-50 flex flex-col font-sans text-slate-800 antialiased">
      <Navbar />

      <div className="flex flex-1 min-h-0 min-w-0 overflow-hidden">
        <Sidebar />
        <section className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <DemoWalkthroughBar />
          <main className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8">
            <div className="mx-auto w-full max-w-7xl">
              {renderActiveView()}
            </div>
          </main>
        </section>
      </div>

      {/* Persistent Global Modals */}
      <UserProfileModal />
      <InspectTraceModal />

      {canUseCopilot && (
        <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
          <section
            id="copilot-widget-panel"
            role="dialog"
            aria-label="LABGUARD Copilot"
            aria-hidden={!isCopilotOpen}
            hidden={!isCopilotOpen}
            className="h-[min(44rem,calc(100dvh-6.5rem))] w-[min(26rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-teal-200 bg-white shadow-[0_24px_60px_-20px_rgba(15,118,110,0.4)]"
          >
            <ErrorBoundary sectionName="Smart Lab Copilot">
              <CopilotView compact onClose={() => setIsCopilotOpen(false)} />
            </ErrorBoundary>
          </section>
          <button
            type="button"
            onClick={() => setIsCopilotOpen(open => !open)}
            aria-label={isCopilotOpen ? 'Close LABGUARD Copilot' : 'Open LABGUARD Copilot'}
            aria-expanded={isCopilotOpen}
            aria-controls="copilot-widget-panel"
            title={isCopilotOpen ? 'Close Copilot' : 'Open Copilot'}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-700 text-white shadow-lg transition-colors hover:bg-teal-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-300"
          >
            {isCopilotOpen ? <X className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
          </button>
        </div>
      )}
    </div>
  );
};

const AppContent: React.FC<{ onEnter: () => void; onChooseRole: () => void }> = ({ onEnter, onChooseRole }) => {
  const { currentUser, isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-mono tracking-wider uppercase text-teal-400">
            Initializing LABGUARD AI Sovereign Runtime...
          </span>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <LandingScreen
        onEnter={onEnter}
        onChooseRole={onChooseRole}
      />
    );
  }

  return (
    <ErrorBoundary sectionName="Application Shell">
      <LabDataProvider>
        <MainLayout />
      </LabDataProvider>
    </ErrorBoundary>
  );
};

const AppRouter: React.FC = () => {
  const { refreshSession } = useAuth();
  const [pathname, setPathname] = useState(() => window.location.pathname);
  const navigate = (path: string) => {
    if (window.location.pathname !== path) window.history.pushState({}, '', path);
    setPathname(path);
  };

  useEffect(() => {
    const syncPath = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', syncPath);
    return () => window.removeEventListener('popstate', syncPath);
  }, []);

  const finishSignIn = async () => {
    const authenticated = await refreshSession();
    if (!authenticated) {
      throw new Error('Sign-in succeeded, but the authenticated session could not be loaded. Please try again.');
    }
    navigate('/');
  };

  const loginPath = pathname.replace(/^\/login\/?/, '');
  const loginRole = LOGIN_ROLES.find((item) => item.path === loginPath);

  if (pathname === '/login' || pathname === '/login/') return <RoleSelectionLogin onNavigate={navigate} />;
  if (loginRole) return <LabDirectorLogin role={loginRole.role} onNavigate={navigate} onSuccess={finishSignIn} />;

  return <AppContent onEnter={() => navigate('/login/laboratory-director')} onChooseRole={() => navigate('/login')} />;
};

export default function App() {
  return (
    <ErrorBoundary sectionName="Hospital Infrastructure Engine">
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <AppRouter />
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

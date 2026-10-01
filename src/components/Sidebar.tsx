import React from 'react';
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  FlaskConical,
  FileCheck2,
  Boxes,
  Cpu,
  UserCheck,
  Building2,
  Receipt,
  Sparkles,
  AlertOctagon,
  Lightbulb,
  SlidersHorizontal,
  Bot,
  ShieldAlert,
  Binary,
  ScrollText,
  UploadCloud,
  FileLock2,
  Activity,
  ChevronRight,
  Network,
  Stethoscope,
  Pill,
  User,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLabData } from '../context/LabDataContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  badgeColor?: 'red' | 'amber' | 'teal' | 'slate' | 'emerald';
}

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, risks, inventory, equipment, prescriptions, appointments } = useLabData();
  const { currentUser, effectiveRole } = useAuth();
  const { t } = useLanguage();
  const [collapsed, setCollapsed] = useState(() => {
    try { return window.localStorage.getItem('labguard-sidebar-collapsed') === 'true'; } catch { return false; }
  });
  const [isSmallScreen, setIsSmallScreen] = useState(() => window.matchMedia('(max-width: 639px)').matches);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  useEffect(() => {
    const media = window.matchMedia('(max-width: 639px)');
    const update = () => setIsSmallScreen(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  const isCollapsed = isSmallScreen ? !mobileNavOpen : collapsed;
  const toggleCollapsed = () => {
    if (isSmallScreen) {
      setMobileNavOpen((open) => !open);
      return;
    }
    setCollapsed((value) => {
      const next = !value;
      try { window.localStorage.setItem('labguard-sidebar-collapsed', String(next)); } catch { /* Storage may be unavailable. */ }
      return next;
    });
  };

  // Computed badges
  const criticalRisksCount = risks.filter(r => r.level === 'critical').length;
  const lowInventoryCount = inventory.filter(i => i.status === 'Low Stock' || i.status === 'Critical').length;
  const maintenanceDueCount = equipment.filter(e => e.operationalStatus === 'Maintenance Due').length;
  const pendingRxCount = prescriptions.filter(p => p.prescriptionStatus === 'ACTIVE').length;
  const todayAptsCount = appointments.filter(a => a.status === 'CONFIRMED' || a.status === 'CHECKED-IN' || (a.status as any) === 'SCHEDULED' || (a.status as any) === 'CHECKED IN').length;

  const can = (permission: string) => currentUser?.permissions?.includes(permission) === true;
  const isPatient = effectiveRole === 'patient';
  const staffNav: NavItem[] = [
    { id: 'dashboard', label: t('navDashboard'), icon: LayoutDashboard },
    { id: 'patients', label: t('navPatients'), icon: Users },
    { id: 'orders', label: t('navOrders'), icon: ClipboardList, badge: 72, badgeColor: 'amber' },
    { id: 'tests', label: t('navTests'), icon: FlaskConical },
    { id: 'results', label: t('navResults'), icon: FileCheck2 },
    { id: 'inventory', label: t('navInventory'), icon: Boxes, badge: lowInventoryCount, badgeColor: 'red' },
    { id: 'equipment', label: t('navEquipment'), icon: Cpu, badge: maintenanceDueCount, badgeColor: 'amber' },
    { id: 'doctors', label: t('navDoctors'), icon: Stethoscope, badge: todayAptsCount, badgeColor: 'teal' },
    { id: 'pharmacy', label: t('navPharmacy'), icon: Pill, badge: pendingRxCount, badgeColor: 'emerald' },
    { id: 'pharmacy-bills', label: 'Pharmacy Bills', icon: Receipt },
    { id: 'staff', label: t('navStaff'), icon: UserCheck },
    { id: 'suppliers', label: t('navSuppliers'), icon: Building2 },
    { id: 'billing', label: t('navBilling'), icon: Receipt },
  ];
  const navPermission: Record<string, string> = {
    dashboard: 'dashboard:read', patients: 'patients:read', orders: 'orders:read',
    results: 'results:read', inventory: 'inventory:read', equipment: 'equipment:read',
    doctors: 'doctors:read', pharmacy: 'pharmacy:read', staff: 'staff:read',
    suppliers: 'suppliers:read', billing: 'billing:read',
  };
  const coreNav: NavItem[] = isPatient
    ? [{ id: 'patient-portal', label: 'My Health Record', icon: User }]
    : staffNav.filter((item) => {
        if (item.id === 'tests') return effectiveRole === 'administrator' || effectiveRole === 'lab_manager';
        if (item.id === 'pharmacy-bills') return can('pharmacy:bills');
        if (item.id === 'pharmacy') return can('pharmacy:read');
        return can(navPermission[item.id] || '');
      });

  const aiNav: NavItem[] = isPatient ? [] : [
    ...(can('analytics:read') ? [{ id: 'executive-brief', label: t('navExecutiveBrief'), icon: Sparkles }] : []),
    ...(can('analytics:read') ? [{ id: 'risk-center', label: t('navRiskCenter'), icon: AlertOctagon, badge: criticalRisksCount, badgeColor: 'red' as const }] : []),
    ...(can('analytics:read') && can('inventory:write') ? [{ id: 'recommendations', label: t('navRecommendations'), icon: Lightbulb }] : []),
    ...(can('analytics:read') ? [{ id: 'what-if', label: t('navSimulator'), icon: SlidersHorizontal }] : []),
    ...(can('ai:use') ? [{ id: 'copilot', label: t('navCopilot'), icon: Bot }] : []),
  ];

  const sovereignNav: NavItem[] = isPatient ? [] : [
    ...(can('integrations:manage') ? [{ id: 'integrations', label: t('navIntegrations'), icon: Network }] : []),
    ...(can('integrations:manage') ? [{ id: 'control-center', label: t('navControlCenter'), icon: ShieldAlert }] : []),
    ...(can('integrations:manage') ? [{ id: 'private-processing', label: t('navPrivateProcessing'), icon: Binary }] : []),
    ...(can('audit:read') ? [{ id: 'audit', label: t('navAudit'), icon: ScrollText }] : []),
  ];

  const governanceNav: NavItem[] = can('integrations:manage') ? [
    { id: 'upload', label: t('navUpload'), icon: UploadCloud },
    { id: 'governance', label: t('navGovernance'), icon: FileLock2 },
    { id: 'impact', label: t('navImpact'), icon: Activity },
  ] : [];

  const renderNavGroup = (title: string, items: NavItem[]) => (
    <div className="mb-4">
      {!isCollapsed && <div className="px-3 mb-1.5 text-[11px] font-bold tracking-wider text-slate-500 uppercase leading-snug">
        {title}
      </div>}
      <div className="space-y-0.5">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (isSmallScreen) setMobileNavOpen(false);
              }}
              aria-label={item.label}
              title={isCollapsed ? item.label : undefined}
              data-nav-label={item.label}
              className={`group relative w-full flex items-center ${isCollapsed ? 'justify-center px-2' : 'justify-between px-3'} py-2 text-xs font-medium rounded-lg transition-colors text-left ${
                isActive
                  ? 'bg-teal-700 text-white font-semibold shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className={`flex items-center min-w-0 ${isCollapsed ? 'justify-center' : 'gap-2.5 pr-1'}`}>
                <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-600'}`} />
                {!isCollapsed && <span className="truncate leading-normal">{item.label}</span>}
              </div>
              {!isCollapsed && item.badge !== undefined && item.badge !== 0 && (
                <span
                  className={`px-1.5 py-0.5 text-[10px] font-bold rounded-md tabular-nums shrink-0 ml-1.5 ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : item.badgeColor === 'red'
                      ? 'bg-red-100 text-red-700'
                      : item.badgeColor === 'amber'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      {isSmallScreen && mobileNavOpen && <button type="button" aria-label="Close navigation menu" onClick={() => setMobileNavOpen(false)} className="fixed inset-x-0 bottom-0 top-16 z-40 bg-slate-950/40" />}
      <aside className={`${isSmallScreen && mobileNavOpen ? 'fixed inset-y-16 left-0 z-50 h-auto w-64 shadow-xl' : isCollapsed ? 'h-full w-12 sm:w-16' : 'h-full w-60 sm:w-64 lg:w-68'} max-w-[75vw] border-r border-slate-200 bg-white flex flex-col shrink-0 min-h-0 transition-[width] duration-200`}>
      <div className={`flex h-9 shrink-0 border-b border-slate-200 px-1 ${isCollapsed ? 'justify-center' : 'justify-end'}`}>
        <button type="button" onClick={toggleCollapsed} aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'} aria-expanded={!isCollapsed} title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'} className="inline-flex rounded-md p-2 text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500">
          {isCollapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
        </button>
      </div>

      {/* Navigation Sections */}
      <div className={`min-h-0 flex-1 overflow-y-auto overflow-x-hidden ${isCollapsed ? 'px-2' : 'px-3'} py-2 text-xs`}>
        {coreNav.length > 0 && renderNavGroup(isPatient ? t('groupHealthRecords') : t('groupLabOps'), coreNav)}
        {aiNav.length > 0 && renderNavGroup(t('groupAiIntel'), aiNav)}
        {sovereignNav.length > 0 && renderNavGroup(t('groupSovereignGov'), sovereignNav)}
        {governanceNav.length > 0 && renderNavGroup(t('groupDataImpact'), governanceNav)}
      </div>

      {/* Bottom Sovereign AI Status Box */}
      <div className={`border-t border-slate-200 bg-slate-50/80 ${isCollapsed ? 'p-2' : 'p-3'}`}>
        {isCollapsed ? <div className="mx-auto size-2 rounded-full bg-teal-500" title="Governance mode active" aria-label="Governance mode active" /> : <>
        <div className="rounded-lg border border-slate-200 bg-white p-2.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-700">Governance Mode</span>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-teal-700">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-500"></span>
              Sovereign Layer
            </span>
          </div>
          <p className="mt-1 text-[10px] text-slate-600 leading-tight">
            Data access strictly restricted to NovaCare private premises.
          </p>
          {can('integrations:manage') && <button
            onClick={() => setActiveTab('control-center')}
            className="mt-2 w-full flex items-center justify-center gap-1 py-1 text-[11px] font-semibold text-teal-800 hover:text-teal-900 bg-teal-50/80 hover:bg-teal-100/80 rounded transition-colors"
          >
            <span>Review Policy Audit</span>
            <ChevronRight className="h-3 w-3" />
          </button>}
        </div>
        </>}
      </div>
    </aside>
    </>
  );
};

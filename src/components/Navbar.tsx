import { useMemo, useState } from 'react';
import { Bell, ChevronDown, FlaskConical, Languages, LogOut, Moon, Search, Sun, UserRound } from 'lucide-react';
import { useLabData } from '../context/LabDataContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

export function Navbar() {
  const { currentUser, effectiveRole, openProfileModal, logout } = useAuth();
  const {
    setActiveTab, notifications, unreadAlertsCount,
    markNotificationRead, markAllNotificationsRead,
    patients, orders, inventory, equipment, doctors, pharmacyMedicines,
    billing, appointments, prescriptions, staff,
  } = useLabData();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [query, setQuery] = useState('');
  const [menu, setMenu] = useState<'language' | 'notifications' | 'profile' | null>(null);

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    const results: { label: string; detail: string; tab: string }[] = [];
    if (currentUser?.permissions?.includes('inventory:read')) {
      inventory.forEach((item) => {
        if (`${item.itemName} ${item.itemId} ${item.category}`.toLowerCase().includes(q)) {
          results.push({ label: item.itemName, detail: `${item.itemId} · ${item.quantity} ${item.unit}`, tab: 'inventory' });
        }
      });
    }
    if (currentUser?.permissions?.includes('patients:read') || effectiveRole === 'patient') {
      patients.forEach((patient) => {
        if (`${patient.name} ${patient.patientId}`.toLowerCase().includes(q)) {
          if (effectiveRole !== 'patient' || patient.patientId === (currentUser?.patientId || currentUser?.uhid)) {
            results.push({ label: patient.name, detail: patient.patientId, tab: effectiveRole === 'patient' ? 'patient-portal' : 'patients' });
          }
        }
      });
    }
    if (currentUser?.permissions?.includes('orders:read') || effectiveRole === 'patient') {
      orders.forEach((order) => {
        if (`${order.orderId} ${order.patientName} ${order.testName}`.toLowerCase().includes(q)) {
          if (effectiveRole !== 'patient' || order.patientId === (currentUser?.patientId || currentUser?.uhid)) {
            results.push({ label: `${order.orderId} · ${order.testName}`, detail: order.patientName, tab: effectiveRole === 'patient' ? 'patient-portal' : 'orders' });
          }
        }
      });
    }
    if (currentUser?.permissions?.includes('equipment:read')) equipment.forEach((item) => {
      if (`${item.name} ${item.equipmentId} ${item.manufacturer} ${item.model} ${item.department}`.toLowerCase().includes(q)) {
        results.push({ label: item.name, detail: `${item.equipmentId} · ${item.operationalStatus}`, tab: 'equipment' });
      }
    });
    if (currentUser?.permissions?.includes('doctors:read')) doctors.forEach((item) => {
      if (`${item.name} ${item.doctorId} ${item.specialization} ${item.department}`.toLowerCase().includes(q)) {
        results.push({ label: item.name, detail: `${item.doctorId} · ${item.specialization}`, tab: 'doctors' });
      }
    });
    if (currentUser?.permissions?.includes('pharmacy:read')) pharmacyMedicines.forEach((item) => {
      if (`${item.drugName} ${item.drugId} ${item.genericName} ${item.category}`.toLowerCase().includes(q)) {
        results.push({ label: item.drugName, detail: `${item.drugId} · ${item.quantity} in stock`, tab: 'pharmacy' });
      }
    });
    if (effectiveRole !== 'patient' && currentUser?.permissions?.includes('billing:read')) billing.forEach((item) => {
      if (`${item.invoiceId} ${item.patientName} ${item.patientId} ${item.paymentStatus} ${item.tests}`.toLowerCase().includes(q)) {
        results.push({ label: item.invoiceId, detail: `${item.patientName} · ${item.paymentStatus}`, tab: 'billing' });
      }
    });
    if (effectiveRole === 'patient' || currentUser?.permissions?.includes('appointments:read')) appointments.forEach((item) => {
      if (`${item.appointmentId} ${item.patientName} ${item.patientId} ${item.doctorName} ${item.department} ${item.tokenNumber || ''}`.toLowerCase().includes(q)) {
        if (effectiveRole !== 'patient' || item.patientId === (currentUser?.patientId || currentUser?.uhid)) {
          results.push({ label: `Appointment ${item.tokenNumber || item.appointmentId}`, detail: `${item.patientName} · ${item.doctorName}`, tab: effectiveRole === 'patient' ? 'patient-portal' : 'doctors' });
        }
      }
    });
    if (effectiveRole === 'patient' || currentUser?.permissions?.includes('pharmacy:read')) prescriptions.forEach((item) => {
      if (`${item.prescriptionId} ${item.patientName} ${item.patientId} ${item.doctorName || ''} ${(item.medicines || []).map((medicine) => medicine.drugName).join(' ')}`.toLowerCase().includes(q)) {
        if (effectiveRole !== 'patient' || item.patientId === (currentUser?.patientId || currentUser?.uhid)) {
          results.push({ label: `Prescription ${item.prescriptionId}`, detail: item.patientName, tab: effectiveRole === 'patient' ? 'patient-portal' : 'pharmacy' });
        }
      }
    });
    if (currentUser?.permissions?.includes('staff:read')) staff.forEach((item) => {
      if (`${item.name} ${item.staffId} ${item.role} ${item.department}`.toLowerCase().includes(q)) {
        results.push({ label: item.name, detail: `${item.staffId} · ${item.role}`, tab: 'staff' });
      }
    });
    return results.slice(0, 8);
  }, [query, currentUser, effectiveRole, inventory, patients, orders, equipment, doctors, pharmacyMedicines, billing, appointments, prescriptions, staff]);

  const chooseResult = (tab: string) => {
    setActiveTab(tab);
    setQuery('');
  };

  const roleName = effectiveRole === 'lab_manager' ? 'Laboratory Director'
    : effectiveRole === 'administrator' ? 'Chief Administrator'
    : effectiveRole === 'technician' ? 'Senior Lab Technician'
    : effectiveRole === 'pathologist' ? 'Clinical Pathologist'
    : effectiveRole === 'finance' ? 'Finance Controller'
    : effectiveRole === 'pharmacist' ? 'Registered Pharmacist' : 'Verified Patient';

  return (
    <header className="relative z-30 flex h-16 w-full shrink-0 items-center gap-3 border-b border-slate-200 bg-white/95 px-3 backdrop-blur-md sm:gap-5 sm:px-6">
      <button type="button" onClick={() => setActiveTab(effectiveRole === 'patient' ? 'patient-portal' : 'dashboard')} className="flex shrink-0 items-center gap-2.5 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500" aria-label="LABGUARD home">
        <span className="grid size-9 place-items-center rounded-lg bg-teal-700 text-white"><FlaskConical className="size-5" aria-hidden="true" /></span>
        <span className="hidden text-sm font-extrabold tracking-tight text-slate-900 sm:inline">LABGUARD</span>
      </button>

      <div className="relative min-w-0 flex-1">
        <label className="sr-only" htmlFor="global-search">Search LABGUARD</label>
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
        <input id="global-search" value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && searchResults[0]) chooseResult(searchResults[0].tab); if (event.key === 'Escape') setQuery(''); }} placeholder="Search patients, inventory, orders…" className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100" />
        {query.trim().length >= 2 && <div className="absolute left-0 right-0 top-full mt-2 max-h-[min(60dvh,24rem)] overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
          {searchResults.length ? searchResults.map((result, index) => <button key={`${result.tab}-${result.label}-${index}`} type="button" onClick={() => chooseResult(result.tab)} className="block w-full rounded-lg px-3 py-2 text-left hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"><span className="block truncate text-sm font-semibold text-slate-800">{result.label}</span><span className="block truncate text-xs text-slate-500">{result.detail}</span></button>) : <p className="px-3 py-4 text-sm text-slate-500">No matching records found.</p>}
        </div>}
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
        <button type="button" onClick={toggleTheme} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`} title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500">{theme === 'light' ? <Moon className="size-4" /> : <Sun className="size-4" />}</button>

        <div className="relative">
          <button type="button" onClick={() => setMenu(menu === 'language' ? null : 'language')} aria-label={`Language: ${language}`} aria-expanded={menu === 'language'} className="flex items-center gap-1 rounded-lg p-2 text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"><Languages className="size-4" /><span className="hidden text-xs font-semibold uppercase sm:inline">{language}</span></button>
          {menu === 'language' && <div className="absolute right-0 top-full mt-2 w-36 rounded-lg border border-slate-200 bg-white p-1 shadow-lg">{([['en', 'English'], ['hi', 'हिन्दी'], ['kn', 'ಕನ್ನಡ']] as const).map(([code, label]) => <button key={code} type="button" onClick={() => { setLanguage(code); setMenu(null); }} className={`block w-full rounded-md px-3 py-2 text-left text-sm ${language === code ? 'bg-teal-50 font-semibold text-teal-800' : 'text-slate-700 hover:bg-slate-50'}`}>{label}</button>)}</div>}
        </div>

        <div className="relative" hidden={effectiveRole === 'patient'}>
          <button type="button" onClick={() => setMenu(menu === 'notifications' ? null : 'notifications')} aria-label={`Notifications${unreadAlertsCount ? `, ${unreadAlertsCount} unread` : ''}`} aria-expanded={menu === 'notifications'} className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"><Bell className="size-4" />{unreadAlertsCount > 0 && <span className="absolute right-1 top-1 grid size-4 place-items-center rounded-full bg-red-600 text-[10px] font-bold text-white">{unreadAlertsCount}</span>}</button>
          {menu === 'notifications' && <div className="absolute right-0 top-full mt-2 w-[min(21rem,calc(100vw-1.5rem))] rounded-xl border border-slate-200 bg-white p-3 shadow-xl"><div className="mb-2 flex items-center justify-between border-b border-slate-100 pb-2"><h2 className="text-sm font-bold text-slate-900">{t('alerts')}</h2><button type="button" onClick={markAllNotificationsRead} className="text-xs font-semibold text-teal-700 hover:underline">Mark all read</button></div><div className="max-h-72 space-y-2 overflow-y-auto">{notifications.length ? notifications.map((notice) => <button key={notice.id} type="button" onClick={() => { markNotificationRead(notice.id); if (notice.linkTab) chooseResult(notice.linkTab); setMenu(null); }} className={`block w-full rounded-lg border p-2 text-left ${notice.read ? 'border-slate-100 bg-slate-50 text-slate-600' : 'border-slate-200 bg-white hover:bg-slate-50'}`}><span className="block text-xs font-semibold text-slate-800">{notice.title}</span><span className="mt-1 block text-xs text-slate-600">{notice.message}</span></button>) : <p className="py-5 text-center text-sm text-slate-500">No notifications</p>}</div></div>}
        </div>

        <div className="relative border-l border-slate-200 pl-2 sm:pl-3">
          <button type="button" onClick={() => setMenu(menu === 'profile' ? null : 'profile')} aria-expanded={menu === 'profile'} aria-label={`${currentUser?.name || 'User'}, ${roleName}`} className="flex items-center gap-2 rounded-lg p-1.5 text-left hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500">
            {currentUser?.photoUrl ? <img src={currentUser.photoUrl} alt="" className="size-8 rounded-full border border-slate-300 object-cover" onError={(event) => { event.currentTarget.style.display = 'none'; }} /> : <span className="grid size-8 place-items-center rounded-full bg-teal-700 text-xs font-bold text-white">{currentUser?.name?.charAt(0).toUpperCase() || 'U'}</span>}
            <span className="hidden min-w-0 sm:block"><span className="block max-w-36 truncate text-xs font-semibold text-slate-900">{currentUser?.name || 'Authorized User'}</span><span className="block max-w-36 truncate text-[10px] text-slate-500">{roleName}</span></span><ChevronDown className="hidden size-3.5 text-slate-400 sm:block" />
          </button>
          {menu === 'profile' && <div className="absolute right-0 top-full mt-2 w-60 rounded-xl border border-slate-200 bg-white p-2 text-sm shadow-xl"><div className="border-b border-slate-100 px-3 py-2"><p className="font-semibold text-slate-900">{currentUser?.name}</p><p className="text-xs text-slate-500">{currentUser?.email || currentUser?.phone}</p><p className="mt-1 text-xs font-medium text-teal-800">{roleName}</p></div><button type="button" onClick={() => { setMenu(null); openProfileModal(); }} className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-slate-700 hover:bg-slate-50"><UserRound className="size-4" />{t('profileBtn')}</button><button type="button" onClick={() => { setMenu(null); logout(); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-red-600 hover:bg-red-50"><LogOut className="size-4" />{t('logoutBtn')}</button></div>}
        </div>
      </div>
    </header>
  );
}

// src/pages/login/LabDirectorLogin.tsx
import { useId, useRef, useState, type FormEvent, type MouseEvent } from 'react';
import {
  Eye, EyeOff, ShieldCheck, Loader2, ArrowLeft, AlertCircle,
  Gauge, Timer, PackageSearch, Wrench, TriangleAlert, LockKeyhole, Copy, X,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { LOGIN_ROLES } from './loginRoles';
import { LanguageSelector, useLanguage } from '../../context/LanguageContext';
import logoImage from '../../../image.png';

export interface SessionUser {
  id: string;
  name: string;
  role: string;
  department?: string;
  language?: string;
}

interface Props {
  role?: string;
  roleSelectHref?: string;
  onNavigate?: (path: string) => void;
  /** Called after the server has created the session. Default: go to "/". */
  onSuccess?: (user: SessionUser, redirectTo: string) => void | Promise<void>;
}

const DEMO_CREDENTIALS = [
  { role: 'Chief Administrator', identifier: 'EMP-ADM-002', password: 'admin123' },
  { role: 'Laboratory Director', identifier: 'EMP-MGR-001', password: 'manager123' },
  { role: 'Senior Lab Technician', identifier: 'EMP-TEC-004', password: 'tech123' },
  { role: 'Clinical Pathologist', identifier: 'EMP-PAT-003', password: 'path123' },
  { role: 'Finance Controller', identifier: 'EMP-FIN-005', password: 'finance123' },
  { role: 'Registered Pharmacist', identifier: 'EMP-PH-204', password: 'pharma123' },
  { role: 'Verified Patient', identifier: 'PT-1001', password: 'password123' },
] as const;

function DemoCredentialsDialog({ theme, onClose }: { theme: 'light' | 'dark'; onClose: () => void }) {
  const [copiedCredential, setCopiedCredential] = useState<string | null>(null);

  async function copyCredential(key: string, value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedCredential(key);
      window.setTimeout(() => setCopiedCredential(null), 1600);
    } catch {
      setCopiedCredential(null);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="demo-credentials-title" className={`max-h-[min(90dvh,52rem)] w-full max-w-2xl overflow-y-auto rounded-xl border p-5 shadow-2xl sm:p-6 ${theme === 'dark' ? 'border-white/10 bg-[#0a1b31] text-slate-100' : 'border-slate-200 bg-white text-slate-900'}`}>
        <div className="flex items-start justify-between gap-4"><div><h2 id="demo-credentials-title" className="text-lg font-semibold">Demo sign-in credentials</h2><p className={`mt-1 text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Use the ID and password for the role you want to explore.</p></div><button type="button" onClick={onClose} aria-label="Close demo credentials" className={`rounded-md p-1 ${theme === 'dark' ? 'text-slate-400 hover:bg-white/10' : 'text-slate-500 hover:bg-slate-100'}`}><X className="size-4" /></button></div>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[34rem] text-left text-sm">
            <thead className={theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}>
              <tr className="border-b border-slate-200/20">
                <th scope="col" className="pb-2 pr-3 font-semibold">Role</th>
                <th scope="col" className="pb-2 pr-3 font-semibold">ID</th>
                <th scope="col" className="pb-2 pr-3 font-semibold">Password</th>
                <th scope="col" className="pb-2 font-semibold">Copy</th>
              </tr>
            </thead>
            <tbody>
              {DEMO_CREDENTIALS.map(({ role, identifier, password }) => (
                <tr key={role} className="border-b border-slate-200/10 last:border-0">
                  <th scope="row" className="py-3 pr-3 font-medium">{role}</th>
                  <td className="py-3 pr-3"><code>{identifier}</code></td>
                  <td className="py-3 pr-3"><code>{password}</code></td>
                  <td className="py-3">
                    <div className="flex gap-1.5">
                      {([['ID', identifier], ['Password', password]] as const).map(([label, value]) => {
                        const key = `${role}-${label}`;
                        return <button key={label} type="button" onClick={() => void copyCredential(key, value)} aria-label={`Copy ${role} ${label.toLowerCase()}`} className={`inline-flex items-center gap-1 rounded-md border px-2 py-1.5 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${theme === 'dark' ? 'border-white/15 text-slate-200 hover:bg-white/10' : 'border-slate-300 text-slate-700 hover:bg-slate-50'}`}><Copy className="size-3.5" />{copiedCredential === key ? 'Copied' : label}</button>;
                      })}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className={`mt-4 text-xs ${theme === 'dark' ? 'text-amber-300' : 'text-amber-700'}`}>For the local hackathon demo environment.</p>
      </section>
    </div>
  );
}

const RESPONSIBILITIES = {
  administrator: ['System-wide operations and user administration', 'Audit and security oversight', 'Laboratory, finance, and pharmacy workflows'],
  lab_manager: ['Laboratory performance and test throughput', 'Turnaround time against targets', 'Reagent inventory and expiry intelligence', 'Analyzer and equipment status', 'Operational risk flags and recommendations'],
  technician: ['Assigned orders and sample processing', 'Entering and updating test results', 'Inventory, equipment, and staff directory'],
  pathologist: ['Reviewing and verifying laboratory results', 'Approving clinical reports', 'Orders and doctor directory'],
  finance: ['Invoices and billing records', 'Supplier ledger and inventory values', 'Pharmacy bills without dispensing access'],
  pharmacist: ['Medication inventory and prescriptions', 'Dispensing and pharmacy deliveries', 'Patient and doctor directory'],
  patient: ['Your own reports and laboratory results', 'Your appointments and prescriptions', 'Your bills and patient record'],
} as const;

const ROLE_ICONS = [Gauge, Timer, PackageSearch, Wrench, TriangleAlert];
const ROLE_TRANSLATION_KEYS: Record<string, string> = {
  administrator: 'roleAdmin',
  lab_manager: 'roleLabManager',
  technician: 'roleTechnician',
  pathologist: 'rolePathologist',
  finance: 'roleFinance',
  pharmacist: 'rolePharmacist',
  patient: 'rolePatient',
};

export function RoleSelectionLogin({ onNavigate }: { onNavigate?: (path: string) => void }) {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const [showDemoCredentials, setShowDemoCredentials] = useState(false);
  const navigateFromLink = (event: MouseEvent<HTMLAnchorElement>, path: string) => {
    if (!onNavigate) return;
    event.preventDefault();
    onNavigate(path);
  };
  return (
    <main className={`min-h-dvh px-6 py-10 sm:px-10 lg:px-14 ${theme === 'dark' ? 'bg-[#071324] text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between"><div className="flex items-center gap-2"><img src={logoImage} alt="" className="size-8 rounded-lg object-cover" /><p className={`text-sm font-semibold ${theme === 'dark' ? 'text-teal-300' : 'text-teal-700'}`}>LabGuard AI</p></div><div className="flex items-center gap-2"><LanguageSelector /><button type="button" onClick={toggleTheme} className="rounded-lg border border-slate-400/40 px-3 py-1.5 text-xs font-semibold">{theme === 'dark' ? t('lightTheme') : t('darkTheme')}</button></div></div>
        <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">{t('chooseSignIn')}</h1>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
          <span className={theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}>{t('needDemoAccount')}</span>
          <button type="button" onClick={() => setShowDemoCredentials(true)} className={`font-semibold underline underline-offset-2 ${theme === 'dark' ? 'text-teal-300' : 'text-teal-700'}`}>{t('viewDemoCredentials')}</button>
          <a href="/login/laboratory-director" onClick={(event) => navigateFromLink(event, '/login/laboratory-director')} className={`font-semibold hover:underline ${theme === 'dark' ? 'text-teal-300' : 'text-teal-700'}`}>{t('openDirectorSignIn')}</a>
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {LOGIN_ROLES.map((item) => (
            <a key={item.role} href={`/login/${item.path}`} onClick={(event) => navigateFromLink(event, `/login/${item.path}`)} className={`rounded-lg border p-4 transition hover:border-teal-400/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 ${theme === 'dark' ? 'border-white/10 bg-[#0a1b31] hover:bg-[#0d2340]' : 'border-slate-200 bg-white hover:bg-teal-50'}`}>
              <h2 className="font-semibold">{t(ROLE_TRANSLATION_KEYS[item.role])}</h2>
              <p className={`mt-2 text-sm leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>{item.access}</p>
              <p className="mt-2 text-xs text-slate-500">Blocked: {item.blocked}</p>
            </a>
          ))}
        </div>
      </div>
      {showDemoCredentials && <DemoCredentialsDialog theme={theme} onClose={() => setShowDemoCredentials(false)} />}
    </main>
  );
}

function getRoleConfig(role: string) {
  return LOGIN_ROLES.find((item) => item.role === role) || LOGIN_ROLES[1];
}


export default function LabDirectorLogin({ role = 'lab_manager', roleSelectHref = '/login', onNavigate, onSuccess }: Props) {
  const roleConfig = getRoleConfig(role);
  const responsibilities = RESPONSIBILITIES[roleConfig.role];
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const uid = useId();
  const idId = `${uid}-identifier`;
  const pwId = `${uid}-password`;
  const errId = `${uid}-error`;
  const idErrId = `${uid}-identifier-err`;
  const pwErrId = `${uid}-password-err`;

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ identifier?: string; password?: string }>({});
  const [showRecovery, setShowRecovery] = useState(false);
  const [showDemoCredentials, setShowDemoCredentials] = useState(false);
  const idRef = useRef<HTMLInputElement>(null);
  const pwRef = useRef<HTMLInputElement>(null);

  function validate() {
    const e: typeof fieldErrors = {};
    if (identifier.trim().length < 3) e.identifier = 'Enter your work email or employee ID.';
    if (!password) e.password = 'Enter your password.';
    setFieldErrors(e);
    if (e.identifier) idRef.current?.focus();
    else if (e.password) pwRef.current?.focus();
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev: FormEvent) {
    ev.preventDefault();
    setFormError('');
    if (!validate() || loading) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/auth/login/${roleConfig.apiPath}`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: identifier.trim(), password }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        setPassword(''); // do not keep the password in component state
        if (onSuccess) await onSuccess(data.user, data.redirectTo || '/');
        else window.location.assign(data.redirectTo || '/');
        return;
      }
      if (res.status === 429) {
        const mins = Math.max(1, Math.ceil((data.retryAfterSeconds || 900) / 60));
        setFormError(`Too many attempts. Try again in about ${mins} minute${mins > 1 ? 's' : ''}.`);
      } else {
        setFormError(data.error || 'Sign-in failed. Check your details and try again.');
      }
      setPassword('');
      pwRef.current?.focus();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Could not reach the server. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  const inputBase =
    `w-full rounded-lg border ${theme === 'dark' ? 'bg-[#0b1e36] text-slate-100 placeholder:text-slate-400' : 'bg-white text-slate-900 placeholder:text-slate-500'} px-3.5 py-2.5 text-[15px] ` +
    'outline-none transition focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:border-teal-400';
  const navigateFromLink = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!onNavigate) return;
    event.preventDefault();
    onNavigate(roleSelectHref);
  };

  return (
    <main className={`min-h-dvh text-slate-100 lg:grid lg:grid-cols-[1.05fr_1fr] ${theme === 'dark' ? 'bg-[#071324]' : 'bg-slate-50 text-slate-900'}`}>
      {/* Context panel */}
      <section className={`border-b px-5 py-8 sm:px-10 sm:py-10 lg:border-b-0 lg:border-r lg:px-14 lg:py-16 ${theme === 'dark' ? 'border-white/10 bg-gradient-to-b from-[#0a1d36] to-[#071324]' : 'border-slate-200 bg-gradient-to-b from-white to-slate-50 text-slate-900'}`}>
        <div className="mx-auto max-w-xl lg:mx-0">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-lg bg-teal-400/15 text-teal-300 ring-1 ring-teal-400/30">
              <img src={logoImage} alt="" className="size-8 rounded-md object-cover" />
            </span>
            <div>
              <p className="text-lg font-semibold leading-tight tracking-tight">LabGuard AI</p>
              <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Role-specific secure access</p>
            </div>
          </div>

          <h1 className="mt-10 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            {t(ROLE_TRANSLATION_KEYS[roleConfig.role])} {t('roleSignIn')}
          </h1>
          <p className={`mt-3 max-w-md text-[15px] leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
            Oversee how the laboratory is running today: what is moving, what is stuck, and what
            needs a decision.
          </p>

          <ul className="mt-8 space-y-3">
            {responsibilities.map((text, index) => {
              const Icon = ROLE_ICONS[index % ROLE_ICONS.length];
              return (
              <li key={text} className={`flex items-start gap-3 text-[15px] ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>
                <Icon className={`mt-0.5 size-[18px] shrink-0 ${theme === 'dark' ? 'text-teal-300' : 'text-teal-700'}`} aria-hidden="true" />
                <span>{text}</span>
              </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Form */}
      <section className={`flex items-center px-4 py-7 sm:px-10 sm:py-10 lg:px-14 ${theme === 'dark' ? 'bg-[#071324]' : 'bg-slate-50'}`}>
        <div className="mx-auto w-full max-w-md">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
          <a
            href={roleSelectHref}
            onClick={navigateFromLink}
            className={`inline-flex items-center gap-1.5 rounded text-sm hover:text-teal-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            {t('chooseDifferentRole')}
          </a>
          <div className="flex items-center gap-2"><LanguageSelector /><button type="button" onClick={toggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`} className={`rounded-lg border px-3 py-1.5 text-xs font-semibold ${theme === 'dark' ? 'border-white/15 text-slate-200 hover:bg-white/5' : 'border-slate-300 text-slate-700 hover:bg-white'}`}>{theme === 'dark' ? t('lightTheme') : t('darkTheme')}</button></div>
          </div>

          <div className={`rounded-xl border p-6 shadow-xl sm:p-8 ${theme === 'dark' ? 'border-white/10 bg-[#0a1b31] shadow-black/30' : 'border-slate-200 bg-white shadow-slate-200'}`}>
            <h2 className="text-xl font-semibold tracking-tight">{t('signIn')}</h2>
            <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>{t('signInDescription')}</p>
            <button type="button" onClick={() => setShowDemoCredentials(true)} className={`mt-4 inline-flex min-h-10 items-center justify-center rounded-lg border px-3.5 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 ${theme === 'dark' ? 'border-teal-300/30 bg-teal-300/10 text-teal-200 hover:bg-teal-300/15' : 'border-teal-200 bg-teal-50 text-teal-800 hover:bg-teal-100'}`}>{t('viewDemoCredentials')}</button>

            <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5" aria-describedby={formError ? errId : undefined}>
              {formError && (
                <div
                  id={errId}
                  role="alert"
                  className={`flex items-start gap-2.5 rounded-lg border px-3.5 py-3 text-sm ${theme === 'dark' ? 'border-red-400/30 bg-red-500/10 text-red-200' : 'border-red-200 bg-red-50 text-red-800'}`}
                >
                  <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label htmlFor={idId} className={`mb-1.5 block text-sm font-medium ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>
                  {                  roleConfig.role === 'patient' ? t('patientLoginIdentifier') : t('workEmailOrEmployeeId')}
                </label>
                <input
                  ref={idRef}
                  id={idId}
                  type="text"
                  inputMode="email"
                  autoComplete="username"
                  autoCapitalize="none"
                  spellCheck={false}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  aria-invalid={!!fieldErrors.identifier}
                  aria-describedby={fieldErrors.identifier ? idErrId : undefined}
                  className={`${inputBase} ${fieldErrors.identifier ? 'border-red-400/60' : theme === 'dark' ? 'border-white/15' : 'border-slate-300'}`}
                />
                {fieldErrors.identifier && (
                  <p id={idErrId} className="mt-1.5 text-sm text-red-300">{fieldErrors.identifier}</p>
                )}
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label htmlFor={pwId} className={`block text-sm font-medium ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>{t('password')}</label>
                  <button
                    type="button"
                    onClick={() => setShowRecovery((v) => !v)}
                    aria-expanded={showRecovery}
                    className={`rounded text-sm hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 ${theme === 'dark' ? 'text-teal-300' : 'text-teal-700'}`}
                  >
                    {t('forgotPassword')}
                  </button>
                </div>
                <div className="relative">
                  <input
                    ref={pwRef}
                    id={pwId}
                    type={showPw ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    aria-invalid={!!fieldErrors.password}
                    aria-describedby={fieldErrors.password ? pwErrId : undefined}
                    className={`${inputBase} pr-11 ${fieldErrors.password ? 'border-red-400/60' : theme === 'dark' ? 'border-white/15' : 'border-slate-300'}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    aria-label={showPw ? 'Hide password' : 'Show password'}
                    aria-pressed={showPw}
                    className="absolute inset-y-0 right-0 grid w-11 place-items-center rounded-r-lg text-slate-400 hover:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal-400"
                  >
                    {showPw ? <EyeOff className="size-[18px]" aria-hidden="true" /> : <Eye className="size-[18px]" aria-hidden="true" />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p id={pwErrId} className="mt-1.5 text-sm text-red-300">{fieldErrors.password}</p>
                )}
              </div>

              {showRecovery && (
                <p className={`rounded-lg border px-3.5 py-3 text-sm leading-relaxed ${theme === 'dark' ? 'border-white/10 bg-white/[0.03] text-slate-300' : 'border-slate-200 bg-slate-50 text-slate-700'}`}>
                  Self-service password reset is not enabled on this deployment. Ask your Chief
                  Administrator to reset your password.
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`flex w-full items-center justify-center gap-2 rounded-lg bg-teal-400 px-4 py-2.5 text-[15px] font-semibold text-[#04121f] transition hover:bg-teal-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 ${theme === 'dark' ? 'focus-visible:ring-offset-[#0a1b31]' : 'focus-visible:ring-offset-white'} disabled:cursor-not-allowed disabled:opacity-70`}
              >
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />
                    {t('signingIn')}
                  </>
                ) : (
                  t('signIn')
                )}
              </button>
            </form>
          </div>

          {showDemoCredentials && <DemoCredentialsDialog theme={theme} onClose={() => setShowDemoCredentials(false)} />}

          <ul className={`mt-6 space-y-2 text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
            <li className="flex items-start gap-2">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-teal-300" aria-hidden="true" />
              <span>Your role is verified on the server, and sign-ins are recorded in the audit log.</span>
            </li>
            <li className="flex items-start gap-2">
              <LockKeyhole className="mt-0.5 size-4 shrink-0 text-teal-300" aria-hidden="true" />
              <span>Sessions end after inactivity. Demo Simulation is separate and does not use this sign-in.</span>
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}

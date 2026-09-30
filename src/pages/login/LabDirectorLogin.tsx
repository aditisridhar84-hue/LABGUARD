// src/pages/login/LabDirectorLogin.tsx
import { useId, useRef, useState, type FormEvent } from 'react';
import {
  FlaskConical, Eye, EyeOff, ShieldCheck, Loader2, ArrowLeft, AlertCircle,
  Gauge, Timer, PackageSearch, Wrench, TriangleAlert, LockKeyhole,
} from 'lucide-react';

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
  /** Called after the server has created the session. Default: go to "/". */
  onSuccess?: (user: SessionUser, redirectTo: string) => void;
}

export const LOGIN_ROLES = [
  { path: 'administrator', apiPath: 'administrator', role: 'administrator', label: 'Chief Administrator', access: 'Everything, including user administration', blocked: 'Nothing' },
  { path: 'laboratory-director', apiPath: 'laboratory-director', role: 'lab_manager', label: 'Laboratory Director', access: 'All laboratory operations', blocked: 'User administration' },
  { path: 'senior-lab-technician', apiPath: 'senior-lab-technician', role: 'technician', label: 'Senior Lab Technician', access: 'Orders, result entry, inventory, equipment, staff list', blocked: 'Result verification, billing, audit, users' },
  { path: 'clinical-pathologist', apiPath: 'clinical-pathologist', role: 'pathologist', label: 'Clinical Pathologist', access: 'Results, report approval, orders, doctors', blocked: 'Billing, pharmacy, equipment' },
  { path: 'finance-controller', apiPath: 'finance-controller', role: 'finance', label: 'Finance Controller', access: 'Billing, invoices, supplier ledger, inventory, pharmacy bills', blocked: 'Results, dispensing' },
  { path: 'registered-pharmacist', apiPath: 'registered-pharmacist', role: 'pharmacist', label: 'Registered Pharmacist', access: 'Pharmacy, patients, doctors, inventory', blocked: 'Billing, results' },
  { path: 'verified-patient', apiPath: 'verified-patient', role: 'patient', label: 'Verified Patient', access: 'Own record, reports, appointments, prescriptions, bills', blocked: "All staff APIs and other patients' records" },
] as const;

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

export function RoleSelectionLogin() {
  return (
    <main className="min-h-dvh bg-[#071324] px-6 py-10 text-slate-100 sm:px-10 lg:px-14">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-semibold text-teal-300">LabGuard AI</p>
        <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">Choose your sign-in</h1>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {LOGIN_ROLES.map((item) => (
            <a key={item.role} href={`/login/${item.path}`} className="rounded-lg border border-white/10 bg-[#0a1b31] p-4 transition hover:border-teal-400/50 hover:bg-[#0d2340] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400">
              <h2 className="font-semibold">{item.label}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">{item.access}</p>
              <p className="mt-2 text-xs text-slate-500">Blocked: {item.blocked}</p>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}

function getRoleConfig(role: string) {
  return LOGIN_ROLES.find((item) => item.role === role) || LOGIN_ROLES[1];
}


export default function LabDirectorLogin({ role = 'lab_manager', roleSelectHref = '/login', onSuccess }: Props) {
  const roleConfig = getRoleConfig(role);
  const responsibilities = RESPONSIBILITIES[roleConfig.role];
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
        if (onSuccess) onSuccess(data.user, data.redirectTo || '/');
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
    } catch {
      setFormError('Could not reach the server. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  const inputBase =
    'w-full rounded-lg border bg-[#0b1e36] px-3.5 py-2.5 text-[15px] text-slate-100 placeholder:text-slate-500 ' +
    'outline-none transition focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:border-teal-400';

  return (
    <main className="min-h-dvh bg-[#071324] text-slate-100 lg:grid lg:grid-cols-[1.05fr_1fr]">
      {/* Context panel */}
      <section className="border-b border-white/10 bg-gradient-to-b from-[#0a1d36] to-[#071324] px-6 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-14 lg:py-16">
        <div className="mx-auto max-w-xl lg:mx-0">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-lg bg-teal-400/15 text-teal-300 ring-1 ring-teal-400/30">
              <FlaskConical className="size-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-lg font-semibold leading-tight tracking-tight">LabGuard AI</p>
              <p className="text-sm text-slate-400">Role-specific secure access</p>
            </div>
          </div>

          <h1 className="mt-10 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            {roleConfig.label} sign-in
          </h1>
          <p className="mt-3 max-w-md text-[15px] leading-relaxed text-slate-300">
            Oversee how the laboratory is running today: what is moving, what is stuck, and what
            needs a decision.
          </p>

          <ul className="mt-8 space-y-3">
            {responsibilities.map((text, index) => {
              const Icon = ROLE_ICONS[index % ROLE_ICONS.length];
              return (
              <li key={text} className="flex items-start gap-3 text-[15px] text-slate-200">
                <Icon className="mt-0.5 size-[18px] shrink-0 text-teal-300" aria-hidden="true" />
                <span>{text}</span>
              </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Form */}
      <section className="flex items-center px-6 py-10 sm:px-10 lg:px-14">
        <div className="mx-auto w-full max-w-md">
          <a
            href={roleSelectHref}
            className="mb-6 inline-flex items-center gap-1.5 rounded text-sm text-slate-400 hover:text-teal-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Choose a different role
          </a>

          <div className="rounded-xl border border-white/10 bg-[#0a1b31] p-6 shadow-xl shadow-black/30 sm:p-8">
            <h2 className="text-xl font-semibold tracking-tight">Sign in</h2>
            <p className="mt-1 text-sm text-slate-400">Use the credentials issued to you by your organisation.</p>

            <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5" aria-describedby={formError ? errId : undefined}>
              {formError && (
                <div
                  id={errId}
                  role="alert"
                  className="flex items-start gap-2.5 rounded-lg border border-red-400/30 bg-red-500/10 px-3.5 py-3 text-sm text-red-200"
                >
                  <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label htmlFor={idId} className="mb-1.5 block text-sm font-medium text-slate-200">
                  {roleConfig.role === 'patient' ? 'Registered email or patient ID' : 'Work email or employee ID'}
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
                  className={`${inputBase} ${fieldErrors.identifier ? 'border-red-400/60' : 'border-white/15'}`}
                />
                {fieldErrors.identifier && (
                  <p id={idErrId} className="mt-1.5 text-sm text-red-300">{fieldErrors.identifier}</p>
                )}
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label htmlFor={pwId} className="block text-sm font-medium text-slate-200">Password</label>
                  <button
                    type="button"
                    onClick={() => setShowRecovery((v) => !v)}
                    aria-expanded={showRecovery}
                    className="rounded text-sm text-teal-300 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
                  >
                    Forgot password?
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
                    className={`${inputBase} pr-11 ${fieldErrors.password ? 'border-red-400/60' : 'border-white/15'}`}
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
                <p className="rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-3 text-sm leading-relaxed text-slate-300">
                  Self-service password reset is not enabled on this deployment. Ask your Chief
                  Administrator to reset your password.
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-teal-400 px-4 py-2.5 text-[15px] font-semibold text-[#04121f] transition hover:bg-teal-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-200 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1b31] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />
                    Signing in
                  </>
                ) : (
                  'Sign in'
                )}
              </button>
            </form>
          </div>

          <ul className="mt-6 space-y-2 text-sm text-slate-400">
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

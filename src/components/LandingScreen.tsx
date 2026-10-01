import React from 'react';
import { Activity, ArrowRight, CheckCircle2, Database, FileCheck2, LockKeyhole, Play, ShieldCheck, Sparkles } from 'lucide-react';
import logoImage from '../../image.png';
import heroImage from '../assets/images/hero_lab_diagnostics_1790181750611.jpg';

interface LandingScreenProps {
  onEnter: () => void;
  onChooseRole: () => void;
}

const workflow = [
  { icon: Activity, label: 'Monitors operational risks' },
  { icon: Sparkles, label: 'Turns evidence into recommendations' },
  { icon: CheckCircle2, label: 'Records confirmed actions' },
  { icon: FileCheck2, label: 'Provides an auditable trace' }
];

export const LandingScreen: React.FC<LandingScreenProps> = ({ onEnter, onChooseRole }) => (
  <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between selection:bg-teal-500 selection:text-white">
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <img src={logoImage} alt="" className="h-9 w-9 rounded-xl object-cover shadow-sm" />
        <div>
          <div className="flex items-center gap-2">
            <span className="text-base font-bold tracking-tight text-white">LABGUARD</span>
            <span className="rounded bg-teal-950/80 border border-teal-800/80 px-2 py-0.5 text-[10px] font-semibold text-teal-300">Laboratory operations</span>
          </div>
          <div className="text-xs text-slate-400">AI-powered laboratory operations and risk management</div>
        </div>
      </div>
      <button type="button" onClick={onChooseRole} className="text-xs font-semibold text-slate-300 hover:text-white transition-colors">
        Choose a role
      </button>
    </header>

    <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 flex flex-col justify-center">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-950/40 px-3.5 py-1 text-xs font-medium text-teal-300">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
            Evidence-led operational decisions
          </div>
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              AI-powered laboratory operations and risk management
            </h1>
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              LABGUARD helps laboratory teams spot operational risks, understand the evidence, and record decisions with a traceable audit trail.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {workflow.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2.5 rounded-xl border border-slate-800 bg-slate-950/60 px-3.5 py-3 text-sm text-slate-200">
                <Icon className="h-4 w-4 shrink-0 text-teal-400" />
                <span>{label}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button type="button" onClick={onEnter} className="flex items-center gap-2 rounded-xl bg-teal-500 px-6 py-3 text-sm font-bold text-slate-950 hover:bg-teal-400 shadow-lg shadow-teal-500/20 transition-all">
              <Play className="h-4 w-4 fill-current" />
              <span>Enter Demo</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <span className="text-xs text-slate-400">Continues to the existing Laboratory Director sign-in.</span>
          </div>

          <div className="pt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-400 border-t border-slate-800">
            <div className="flex items-center gap-1.5"><LockKeyhole className="h-4 w-4 text-teal-400" /><span>Role-based access</span></div>
            <div className="flex items-center gap-1.5"><Database className="h-4 w-4 text-teal-400" /><span>Server-persisted demo actions</span></div>
            <div className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-teal-400" /><span>Audit trail and integrity evidence</span></div>
          </div>
        </div>

        <div className="lg:col-span-5 relative">
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
            <img src={heroImage} alt="Diagnostic laboratory" className="w-full h-64 object-cover opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            <div className="relative -mt-16 m-3 rounded-xl border-t border-slate-800 bg-slate-900/90 p-5 backdrop-blur-md space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-300">
                <Sparkles className="h-4 w-4" />
                A clear decision trail
              </div>
              <div className="space-y-2 text-sm">
                {['Operational signal', 'Evidence and recommendation', 'Confirmed, persisted action', 'Trace and audit verification'].map((item, index) => (
                  <div key={item} className="flex items-center gap-3 rounded-lg border border-slate-700/70 bg-slate-800/70 p-2.5">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-teal-900 text-xs font-bold text-teal-300">{index + 1}</span>
                    <span className="text-slate-200">{item}</span>
                  </div>
                ))}
              </div>
              <p className="text-[11px] leading-relaxed text-slate-400">The signed-in workspace shows the current demo data and whether each action has already been recorded.</p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <footer className="border-t border-slate-800 bg-slate-950 px-6 py-4 text-center text-xs text-slate-500">
      LABGUARD · Prototype for private diagnostic laboratory operations
    </footer>
  </div>
);

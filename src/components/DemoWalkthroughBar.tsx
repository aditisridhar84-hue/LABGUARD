import React from 'react';
import { CheckCircle, ChevronLeft, ChevronRight, X, ArrowUpRight, FileSearch } from 'lucide-react';
import { useLabData } from '../context/LabDataContext';

export const DemoWalkthroughBar: React.FC = () => {
  const {
    demoModeActive,
    demoStep,
    nextDemoStep,
    prevDemoStep,
    exitDemoMode,
    inventory,
    risks,
    recommendations,
    setActiveTab,
    openInspectTrace
  } = useLabData();

  if (!demoModeActive) return null;

  const vitaminD = inventory.find(item => /vitamin\s*d/i.test(item.itemName));
  const vitaminDRisk = risks.find(risk =>
    (vitaminD && risk.evidence.itemOrEntity?.includes(vitaminD.itemId)) || /vitamin\s*d/i.test(risk.title)
  );
  const vitaminDRecommendation = recommendations.find(rec => /vitamin\s*d/i.test(rec.title));
  const vitaminDRiskStatus = vitaminDRisk ? 'active' : vitaminDRecommendation?.executed ? 'resolved' : 'not currently active';
  const traceEntityId = vitaminDRecommendation?.recId || vitaminDRisk?.riskId || vitaminD?.itemId;
  const recommendationStatus = vitaminDRecommendation?.executed
    ? 'The Vitamin D recommendation is already marked executed in the current data.'
    : vitaminDRecommendation
      ? 'Review the current recommendation status and its supporting evidence.'
      : 'Review the current risk evidence and any linked recommendation.';

  const steps = [
    {
      title: '1. Review current operational status',
      destination: 'Dashboard',
      highlight: vitaminD
        ? `${vitaminD.itemName}: ${vitaminD.quantity} ${vitaminD.unit} (${vitaminD.status}); Vitamin D risk is ${vitaminDRiskStatus}.`
        : 'Review current laboratory KPIs, operational flags, and inventory status.',
      actionLabel: 'Open Dashboard',
      action: () => setActiveTab('dashboard')
    },
    {
      title: '2. Inspect risk and recommendation evidence',
      destination: 'Risk Center and Recommendations',
      highlight: vitaminDRisk
        ? `Vitamin D risk is currently active. ${recommendationStatus}`
        : `Vitamin D risk is not currently active${vitaminD ? ` at ${vitaminD.quantity} ${vitaminD.unit}` : ''}. ${recommendationStatus}`,
      actionLabel: 'Open Risk Center',
      action: () => setActiveTab('risk-center'),
      secondaryLabel: 'Open Recommendations',
      secondaryAction: () => setActiveTab('recommendations')
    },
    {
      title: '3. Inspect the persisted action trace',
      destination: 'Inspect Trace',
      highlight: vitaminDRecommendation?.executed
        ? 'The recommendation is already executed. Inspect the server-backed transaction, related audit records, and integrity evidence; no restock will be replayed.'
        : 'Inspect the current server-backed trace and its available transaction and audit evidence.',
      actionLabel: traceEntityId ? 'Open Inspect Trace' : 'Open Recommendations',
      action: () => traceEntityId ? openInspectTrace(traceEntityId) : setActiveTab('recommendations')
    },
    {
      title: '4. Verify the audit trail and integrity hashes',
      destination: 'Audit Trail and Inspect Trace',
      highlight: 'Find the persisted action in Audit Trail. Its event IDs and integrity hashes are shown in Inspect Trace.',
      actionLabel: 'Open Audit Trail',
      action: () => setActiveTab('audit'),
      secondaryLabel: traceEntityId ? 'Reopen Inspect Trace' : undefined,
      secondaryAction: traceEntityId ? () => openInspectTrace(traceEntityId) : undefined
    }
  ];
  const current = steps[Math.min(Math.max(demoStep - 1, 0), steps.length - 1)];
  const phases = ['STATUS', 'EVIDENCE', 'TRACE', 'AUDIT'];

  return (
    <div className="sticky top-16 z-25 border-b border-amber-200 bg-linear-to-r from-amber-50 via-teal-50 to-amber-50 px-4 py-3 shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500 font-bold text-slate-950 shadow-xs">
            {demoStep}/4
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-900">{current.title}</span>
              <span className="rounded bg-amber-200/80 px-1.5 py-0.5 text-[10px] font-bold text-amber-900 tracking-wider">{current.destination}</span>
            </div>
            <p className="text-xs text-slate-700 font-medium">{current.highlight}</p>
          </div>
        </div>

        <div className="hidden xl:flex items-center gap-1 text-[10px] font-semibold text-slate-500 bg-white/70 px-2.5 py-1.5 rounded-lg border border-slate-200/80">
          {phases.map((phase, index) => (
            <React.Fragment key={phase}>
              <span className={`flex items-center gap-1 ${demoStep === index + 1 ? 'text-teal-700 font-bold' : demoStep > index + 1 ? 'text-slate-700' : 'text-slate-400'}`}>
                {demoStep > index + 1 ? <CheckCircle className="h-3 w-3 text-teal-600" /> : <span className="h-2 w-2 rounded-full bg-slate-300" />}
                {phase}
              </span>
              {index < phases.length - 1 && <span className="text-slate-300 mx-0.5">→</span>}
            </React.Fragment>
          ))}
        </div>

        <div className="flex w-full flex-wrap items-center gap-2 md:w-auto md:flex-nowrap md:shrink-0">
          <button onClick={current.action} className="px-2.5 py-1.5 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-xs transition-colors flex items-center gap-1" title={`Open ${current.destination}`}>
            <ArrowUpRight className="h-3.5 w-3.5" />{current.actionLabel}
          </button>
          {current.secondaryAction && current.secondaryLabel && (
            <button onClick={current.secondaryAction} className="flex px-2.5 py-1.5 text-xs font-semibold text-teal-800 bg-white hover:bg-teal-50 rounded-lg border border-teal-200 items-center gap-1">
              <FileSearch className="h-3.5 w-3.5" />{current.secondaryLabel}
            </button>
          )}
          <button onClick={prevDemoStep} disabled={demoStep === 1} className="p-1.5 text-slate-700 bg-white hover:bg-slate-100 disabled:opacity-40 rounded-lg border border-slate-200" title="Previous step">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button onClick={nextDemoStep} className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-xs">
            <span>{demoStep === 4 ? 'Finish Guide' : 'Next Step'}</span><ChevronRight className="h-4 w-4" />
          </button>
          <button onClick={exitDemoMode} className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg" title="Exit demo guide" aria-label="Exit demo guide">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

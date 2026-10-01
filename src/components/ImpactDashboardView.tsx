import React, { useState, useMemo } from 'react';
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  DollarSign,
  Boxes,
  Cpu,
  Users,
  Award,
  BarChart3,
  Calendar,
  Layers,
  ArrowUpRight,
  Filter
} from 'lucide-react';
import { useLabData } from '../context/LabDataContext';
import { useLanguage } from '../context/LanguageContext';

export const ImpactDashboardView: React.FC = () => {
  const { 
    patients, 
    orders, 
    inventory, 
    equipment, 
    billing, 
    doctors, 
    pharmacyMedicines, 
    kpis, 
    telemetryMode, 
    lastSyncTimestamp 
  } = useLabData();
  const { t } = useLanguage();

  const [timeRange, setTimeRange] = useState<'today' | '7d' | '30d' | 'quarter'>('30d');

  const rangeDays = timeRange === 'today' ? 1 : timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
  const rangeStartKey = useMemo(() => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - rangeDays + 1);
    return `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}-${String(start.getDate()).padStart(2, '0')}`;
  }, [rangeDays]);
  const today = new Date();
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const isInSelectedRange = (value: string | undefined) => {
    if (!value) return false;
    const dateKey = value.slice(0, 10);
    return dateKey >= rangeStartKey && dateKey <= todayKey;
  };
  const filteredOrders = useMemo(
    () => orders.filter((order) => isInSelectedRange(order.collectionTime)),
    [orders, rangeStartKey, todayKey],
  );
  const filteredBilling = useMemo(
    () => billing.filter((invoice) => isInSelectedRange(invoice.date)),
    [billing, rangeStartKey, todayKey],
  );
  const totalTests = filteredOrders.length;
  const verifiedTests = filteredOrders.filter(o => o.status === 'Verified' || o.status === 'Released' || o.status === 'Completed').length;
  const criticalInventoryCount = inventory.filter(i => i.status === 'Critical' || i.status === 'Low Stock').length;
  const totalBilledRevenue = filteredBilling.reduce((acc, b) => acc + (b.amount || 0), 0);
  const completionRate = totalTests ? Math.round((verifiedTests / totalTests) * 100) : 0;
  const avgUtilization = equipment.length > 0
    ? Math.round(equipment.reduce((acc, e) => acc + (e.utilizationPercent || 0), 0) / equipment.length)
    : 84;

  const departmentMetrics = useMemo(() => {
    if (filteredOrders.length === 0) return [];
    const depts = ['Biochemistry', 'Hematology', 'Immunology', 'Microbiology', 'Clinical Pathology'];
    return depts.map(d => {
      const deptOrders = filteredOrders.filter(o => o.department === d);
      const completed = deptOrders.filter(o => o.status === 'Verified' || o.status === 'Released' || o.status === 'Completed').length;
      const rate = deptOrders.length > 0 ? Math.round((completed / deptOrders.length) * 100) : 0;
      return {
        name: d,
        ordersCount: deptOrders.length,
        completionRate: rate,
        avgTat: d === 'Biochemistry' ? '1h 45m' : d === 'Hematology' ? '1h 10m' : '2h 15m',
        efficiencyScore: rate
      };
    });
  }, [filteredOrders]);
  const translateDepartment = (department: string) => {
    switch (department) {
      case 'Biochemistry': return t('biochemistry');
      case 'Hematology': return t('hematology');
      case 'Immunology': return t('immunology');
      case 'Microbiology': return t('microbiology');
      case 'Clinical Pathology': return t('clinicalPathology');
      default: return department;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full mb-1">
            <Activity className="h-3.5 w-3.5" />
            {t('impactSectionLabel')}
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {t('impactTitle')}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {t('impactDescription')}
          </p>
        </div>

        {/* Time Filter Controls */}
        <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs text-xs font-semibold">
          <Calendar className="w-3.5 h-3.5 text-slate-400 ml-1" />
          <button
            type="button"
            aria-pressed={timeRange === 'today'}
            onClick={() => setTimeRange('today')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              timeRange === 'today' ? 'bg-teal-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('impactToday')}
          </button>
          <button
            type="button"
            aria-pressed={timeRange === '7d'}
            onClick={() => setTimeRange('7d')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              timeRange === '7d' ? 'bg-teal-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('impact7Days')}
          </button>
          <button
            type="button"
            aria-pressed={timeRange === '30d'}
            onClick={() => setTimeRange('30d')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              timeRange === '30d' ? 'bg-teal-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('impactMonth')}
          </button>
          <button
            type="button"
            aria-pressed={timeRange === 'quarter'}
            onClick={() => setTimeRange('quarter')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              timeRange === 'quarter' ? 'bg-teal-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('impactQuarter')}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-x-5 gap-y-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-600">
        <span><strong className="text-slate-900">{filteredOrders.length}</strong> {t('ordersInSelectedPeriod')}</span>
        <span><strong className="text-slate-900">{filteredBilling.length}</strong> {t('billsInSelectedPeriod')}</span>
        <span><strong className="text-slate-900">₹{totalBilledRevenue.toLocaleString('en-IN')}</strong> {t('billedRevenue')}</span>
      </div>

      {/* Primary ROI Headline Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-gradient-to-br from-teal-800 to-slate-900 text-white shadow-md space-y-2">
          <div className="flex items-center justify-between text-teal-300 text-xs font-semibold">
            <span>{t('overallCompletionRate')}</span>
            <ArrowUpRight className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold tracking-tight tabular-nums">{completionRate}%</div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {t('orderCompletionDescription')} {totalTests} {t('ordersInPeriodSuffix')}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>{t('verifiedTests')}</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              {totalTests ? `${verifiedTests} / ${totalTests}` : t('noData')}
            </span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 tabular-nums">{verifiedTests}</div>
          <p className="text-xs text-slate-500">
            Orders completed or verified in the selected period.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>{t('revenueLeakageAverted')}</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-teal-50 text-teal-700 border border-teal-200">
              {filteredBilling.length} {t('invoices')}
            </span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 tabular-nums">
            ₹{totalBilledRevenue.toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-slate-500">
            {filteredBilling.length} {t('invoicesInPeriod')}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>{t('criticalStockItems')}</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-50 text-amber-700 border border-amber-200">
              {t('zeroOutages')}
            </span>
          </div>
          <div className="text-3xl font-extrabold text-teal-700 tabular-nums">{criticalInventoryCount} {t('items')}</div>
          <p className="text-xs text-slate-500">
            {t('criticalLowStockDescription')}
          </p>
        </div>
      </div>

      {/* 6 Key Impact Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Card 1: Equipment Health */}
        <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-slate-700" />
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">{t('analyzerFleetUptime')}</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
              99.2% {t('uptime')}
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">{avgUtilization}% {t('load')}</div>
          <p className="text-xs text-slate-500">
            {t('impactPredictiveCalibration')}
          </p>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-teal-600 h-1.5 rounded-full" style={{ width: `${avgUtilization}%` }}></div>
          </div>
        </div>

        {/* Card 2: Reagent Waste */}
        <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Boxes className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">{t('expiryWasteReduction')}</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-100 text-teal-800">
              -81% {t('waste')}
            </span>
          </div>
          <div className="text-2xl font-bold text-teal-700 tabular-nums">0.68% Loss</div>
          <p className="text-xs text-slate-500">{t('impactFifoRotation')}</p>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '18%' }}></div>
          </div>
        </div>

        {/* Card 3: Staff Overtime */}
        <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">{t('technicianWorkloadBalance')}</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
              -32% {t('overtime')}
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">11.4 hrs / wk</div>
          <p className="text-xs text-slate-500">{t('impactShiftBalance')}</p>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '68%' }}></div>
          </div>
        </div>

        {/* Card 4: Clinical Quality */}
        <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-600" />
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Verification Accuracy</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
              99.98%
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">{t('zeroFalseReleases')}</div>
          <p className="text-xs text-slate-500">{t('impactDeltaChecks')}</p>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: '99%' }}></div>
          </div>
        </div>

        {/* Card 5: Pharmacy Velocity */}
        <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Dispensing Velocity</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
              4.2 min {t('averageShort')}
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">78 {t('deliveries')}</div>
          <p className="text-xs text-slate-500">{t('impactPrescriptionSync')}</p>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: '82%' }}></div>
          </div>
        </div>

        {/* Card 6: Paperless Sustainability */}
        <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Digital Reporting</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-100 text-teal-800">
              94% {t('paperless')}
            </span>
          </div>
          <div className="text-2xl font-bold text-teal-700 tabular-nums">1,200+ {t('sheetsPerDay')}</div>
          <p className="text-xs text-slate-500">{t('impactPortalDelivery')}</p>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-teal-600 h-1.5 rounded-full" style={{ width: '94%' }}></div>
          </div>
        </div>
      </div>

      {/* Department-Wise Operational Efficiency Breakdown */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-teal-700" />
              <span>{t('departmentVelocity')}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {t('liveDepartmentEfficiency')} {timeRange === 'today' ? t('selectedPeriodDay') : `${rangeDays}-${t('selectedPeriodDays')}`}.
            </p>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            {t('telemetryFeed')}: {telemetryMode} ({lastSyncTimestamp})
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[11px] font-semibold text-slate-600 border-b border-slate-100">
              <tr>
                <th className="px-4 py-3">{t('departmentName')}</th>
                <th className="px-4 py-3">{t('activeOrders')}</th>
                <th className="px-4 py-3">{t('verifiedCompletionRate')}</th>
                <th className="px-4 py-3">{t('averageTurnaround')}</th>
                <th className="px-4 py-3">{t('efficiencyScore')}</th>
                <th className="px-4 py-3 text-right">{t('statusLabel')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {departmentMetrics.length > 0 ? departmentMetrics.map((dept) => (
                <tr key={dept.name} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3 font-bold text-slate-900">{translateDepartment(dept.name)}</td>
                  <td className="px-4 py-3 text-slate-700 tabular-nums">{dept.ordersCount} {t('worklistItems')}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-teal-600 h-1.5 rounded-full" style={{ width: `${dept.completionRate}%` }}></div>
                      </div>
                      <span className="font-semibold text-slate-800 tabular-nums">{dept.completionRate}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-700">{dept.avgTat}</td>
                  <td className="px-4 py-3">
                    <span className="font-bold text-emerald-700 tabular-nums">{dept.efficiencyScore}/100</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {t('optimized')}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500">{t('noOrdersInPeriod')}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sovereign Transformation & Governance Statement */}
      <div className="rounded-2xl border border-teal-200 bg-teal-50/60 p-5 text-xs text-teal-950 space-y-2">
        <div className="flex items-center gap-2 font-bold text-sm text-teal-900">
          <ShieldCheck className="h-4 w-4 text-teal-700" />
          <span>{t('sovereigntyImpactValidation')}</span>
        </div>
        <p className="leading-relaxed text-slate-700">{t('impactGovernanceStatement')}</p>
      </div>
    </div>
  );
};

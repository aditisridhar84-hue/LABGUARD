import React, { useState } from 'react';
import { Receipt, Search, Filter, DollarSign, CheckCircle2, Clock, CreditCard, ArrowDownRight } from 'lucide-react';
import { useLabData } from '../context/LabDataContext';
import { useLanguage } from '../context/LanguageContext';

export const BillingView: React.FC = () => {
  const { billing, kpis } = useLabData();
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const paidInvoices = billing.filter((invoice) => invoice.paymentStatus === 'Paid').length;
  const outstandingInvoices = billing.filter((invoice) => invoice.paymentStatus !== 'Paid').length;
  const averageBill = billing.length
    ? Math.round(billing.reduce((total, invoice) => total + invoice.amount - invoice.discount + invoice.tax, 0) / billing.length)
    : 0;
  const digitalPayments = billing.filter((invoice) => ['UPI', 'Credit Card'].includes(invoice.paymentMethod)).length;
  const digitalPaymentShare = billing.length ? (digitalPayments / billing.length) * 100 : 0;

  const filteredBilling = billing.filter((b) => {
    const matchesSearch = 
      b.invoiceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.patientName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || b.paymentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full mb-1">
            <Receipt className="h-3.5 w-3.5" />
            {t('navBilling')}
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {t('billingTitle')}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {t('billingDescription')}
          </p>
        </div>

        <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-right">
          <span className="text-[11px] text-teal-800 font-semibold block">{t('todayRealizedRevenue')}</span>
          <span className="text-xl font-bold text-teal-900 tabular-nums">
            ₹{kpis.dailyRevenue.toLocaleString()}
          </span>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[10px] text-slate-500 uppercase">{t('paidInvoices')}</span>
          <div className="text-xl font-bold text-teal-700 tabular-nums mt-0.5">{paidInvoices} Invoices</div>
          <span className="text-[10px] text-teal-600 font-medium">{billing.length ? Math.round((paidInvoices / billing.length) * 100) : 0}% {t('immediateClearance')}</span>
        </div>

        <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[10px] text-slate-500 uppercase">{t('pendingInsurance')}</span>
          <div className="text-xl font-bold text-amber-600 tabular-nums mt-0.5">{outstandingInvoices} Invoices</div>
          <span className="text-[10px] text-slate-500">{t('underClaimAdjudication')}</span>
        </div>

        <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[10px] text-slate-500 uppercase">{t('averageBillValue')}</span>
          <div className="text-xl font-bold text-slate-900 tabular-nums mt-0.5">₹{averageBill.toLocaleString('en-IN')}</div>
          <span className="text-[10px] text-slate-500">{t('perPatientEncounter')}</span>
        </div>

        <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[10px] text-slate-500 uppercase">{t('digitalCollectionShare')}</span>
          <div className="text-xl font-bold text-teal-700 tabular-nums mt-0.5">{digitalPaymentShare.toFixed(1)}%</div>
          <span className="text-[10px] text-teal-600 font-medium">{t('digitalPaymentMethods')}</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('searchInvoices')}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-slate-700 focus:border-teal-500 focus:outline-none"
          >
            <option value="All">{t('allInvoices')}</option>
            <option value="Paid">Paid</option>
            <option value="Pending">{t('pendingInsurance')}</option>
            <option value="Partial">{t('pendingPartial')}</option>
          </select>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[11px] font-semibold text-slate-600 border-b border-slate-200">
              <tr>
                <th className="px-3.5 py-2.5">{t('invoiceId')}</th>
                <th className="px-3.5 py-2.5">{t('patient')}</th>
                <th className="px-3.5 py-2.5">{t('associatedOrder')}</th>
                <th className="px-3.5 py-2.5">{t('billedAmount')}</th>
                <th className="px-3.5 py-2.5">{t('discount')}</th>
                <th className="px-3.5 py-2.5">{t('netPaid')}</th>
                <th className="px-3.5 py-2.5">{t('paymentMethod')}</th>
                <th className="px-3.5 py-2.5">{t('dateTime')}</th>
                <th className="px-3.5 py-2.5">{t('paymentStatus')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBilling.map((b) => (
                <tr key={b.invoiceId} className="hover:bg-slate-50 transition-colors">
                  <td className="px-3.5 py-2 font-mono text-teal-700 font-semibold">{b.invoiceId}</td>
                  <td className="px-3.5 py-2 font-bold text-slate-900">{b.patientName}</td>
                  <td className="px-3.5 py-2 font-mono text-slate-500 text-[11px] truncate max-w-xs">{b.tests}</td>
                  <td className="px-3.5 py-2 font-mono text-slate-800 tabular-nums">₹{b.amount.toLocaleString()}</td>
                  <td className="px-3.5 py-2 font-mono text-slate-500 tabular-nums">₹{b.discount}</td>
                  <td className="px-3.5 py-2 font-mono font-bold text-slate-900 tabular-nums">₹{(b.amount - b.discount + b.tax).toLocaleString()}</td>
                  <td className="px-3.5 py-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                      {b.paymentMethod}
                    </span>
                  </td>
                  <td className="px-3.5 py-2 font-mono text-slate-500 text-[11px] tabular-nums">{b.date}</td>
                  <td className="px-3.5 py-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      b.paymentStatus === 'Paid' ? 'bg-teal-100 text-teal-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {b.paymentStatus}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredBilling.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-3.5 py-10 text-center text-sm text-slate-500">
                    {billing.length ? t('noMatchingInvoices') : t('noBillingRecords')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

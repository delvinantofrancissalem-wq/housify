import React from 'react';
import { HardHat, ShieldCheck, FileCheck2, Percent, DollarSign, Calculator } from 'lucide-react';
import { LaborItem, Currency, BOQSummary } from '../types';
import { formatCurrency, formatNumber } from '../utils/engineeringCalculator';

interface LaborOverheadSectionProps {
  laborItems: LaborItem[];
  summary: BOQSummary;
  currency: Currency;
  contingencyPercent: number;
  supervisionPercent: number;
  architectPercent: number;
}

export const LaborOverheadSection: React.FC<LaborOverheadSectionProps> = ({
  laborItems,
  summary,
  currency,
  contingencyPercent,
  supervisionPercent,
  architectPercent,
}) => {
  return (
    <section id="section-labor" className="space-y-6">
      {/* Section Header */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-semibold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/60">
            SECTION 03
          </span>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Labor, Supervision & Overhead Costs
          </h2>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Contractor trade labor, structural staging, MEP installations, engineering site supervision, statutory municipal permits, and contingency reserves.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Itemized Skilled Trade Labor Table */}
        <div className="lg:col-span-2 border border-slate-800 rounded-2xl overflow-hidden bg-slate-900/60 shadow-lg flex flex-col">
          <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HardHat className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">
                Skilled Trades & Contractor Labor Breakdown
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-cyan-400 tabular-nums">
              Subtotal: {formatCurrency(summary.totalLaborCost, currency)}
            </span>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/40 text-slate-400 font-mono border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4 font-semibold">Trade / Operation</th>
                  <th className="py-3 px-4 font-semibold">Engineering Scope</th>
                  <th className="py-3 px-4 font-semibold text-right">Metric Basis</th>
                  <th className="py-3 px-4 font-semibold text-right">Unit Rate</th>
                  <th className="py-3 px-4 font-semibold text-right">Total Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {laborItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 font-semibold text-white">
                      <div className="text-xs">{item.trade}</div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">{item.note}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-300 text-[11px] leading-relaxed max-w-xs">
                      {item.description}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-400 tabular-nums">
                      {formatNumber(item.quantity)} sq.ft
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-300 tabular-nums">
                      {formatCurrency(item.unitRate, currency)}/sq.ft
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-cyan-400 font-bold tabular-nums">
                      {formatCurrency(item.totalCost, currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-3 bg-slate-950/70 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Total Contractor Skilled Labor:</span>
            <span className="text-white font-bold">{formatCurrency(summary.totalLaborCost, currency)}</span>
          </div>
        </div>

        {/* Right Col: Supervision, Design, Municipal Permits & Contingency */}
        <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-900/60 shadow-lg flex flex-col">
          <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">
                Supervision, Permits & Overheads
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-cyan-400 tabular-nums">
              {formatCurrency(summary.totalOverheadsAndPermits, currency)}
            </span>
          </div>

          <div className="p-5 space-y-4 flex-1">
            {/* Site Supervision */}
            <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800 flex items-start justify-between">
              <div>
                <div className="text-xs font-semibold text-white">Site Supervision & Project Management</div>
                <div className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                  Full-time certified civil engineer quality checks, bar-bending inspection, cube tests & progress auditing ({supervisionPercent}% of direct cost)
                </div>
              </div>
              <div className="text-right font-mono text-xs font-bold text-cyan-400 tabular-nums ml-3 shrink-0">
                {formatCurrency(summary.siteSupervisionFee, currency)}
              </div>
            </div>

            {/* Architectural & Structural Fees */}
            <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800 flex items-start justify-between">
              <div>
                <div className="text-xs font-semibold text-white">Architectural, Structural & MEP Design</div>
                <div className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                  Comprehensive working drawings, 3D structural STAAD/ETABS analysis, column schedules & electrical/plumbing schematics ({architectPercent}% of direct cost)
                </div>
              </div>
              <div className="text-right font-mono text-xs font-bold text-cyan-400 tabular-nums ml-3 shrink-0">
                {formatCurrency(summary.architecturalFee, currency)}
              </div>
            </div>

            {/* Municipal Sanctions & Utility Permits */}
            <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800 flex items-start justify-between">
              <div>
                <div className="text-xs font-semibold text-white">Municipal Sanction & Utility Clearances</div>
                <div className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                  Local municipal corporation plan sanction fees, labor cess, water drainage connection & temporary electricity meter installation
                </div>
              </div>
              <div className="text-right font-mono text-xs font-bold text-cyan-400 tabular-nums ml-3 shrink-0">
                {formatCurrency(summary.totalOverheadsAndPermits - summary.siteSupervisionFee - summary.architecturalFee - summary.contingencyAmount, currency)}
              </div>
            </div>

            {/* Contingency Reserve */}
            <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-800/40 flex items-start justify-between">
              <div>
                <div className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                  <Percent className="w-3.5 h-3.5" />
                  Contingency Reserve Fund ({contingencyPercent}%)
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                  Recommended buffer for sudden raw material inflation (steel/cement spikes), unanticipated subsoil water tables, or on-site design adaptations
                </div>
              </div>
              <div className="text-right font-mono text-xs font-bold text-amber-300 tabular-nums ml-3 shrink-0">
                {formatCurrency(summary.contingencyAmount, currency)}
              </div>
            </div>
          </div>

          <div className="px-6 py-3 bg-slate-950/70 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Total Supervision, Permits & Contingency:</span>
            <span className="text-white font-bold">{formatCurrency(summary.totalOverheadsAndPermits, currency)}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

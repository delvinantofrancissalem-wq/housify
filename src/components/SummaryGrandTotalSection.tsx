import React from 'react';
import { 
  Calculator, 
  Lightbulb, 
  AlertTriangle, 
  TrendingDown, 
  PieChart, 
  Award,
  Layers,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { BOQSummary, Currency, QualityTier } from '../types';
import { formatCurrency, formatNumber } from '../utils/engineeringCalculator';

interface SummaryGrandTotalSectionProps {
  summary: BOQSummary;
  currency: Currency;
  qualityTier: QualityTier;
  builtUpArea: number;
}

export const SummaryGrandTotalSection: React.FC<SummaryGrandTotalSectionProps> = ({
  summary,
  currency,
  qualityTier,
  builtUpArea,
}) => {
  const materialPercent = Math.round((summary.totalMaterialCost / summary.grandTotal) * 100);
  const laborPercent = Math.round((summary.totalLaborCost / summary.grandTotal) * 100);
  const overheadPercent = 100 - materialPercent - laborPercent;

  return (
    <section id="section-summary" className="space-y-6">
      {/* Section Header */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-semibold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/60">
            SECTION 04
          </span>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Summary & Grand Total Construction Cost
          </h2>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Executive budget compilation, cost-per-square-foot benchmarks, regional engineering ratios, and value-engineering optimization.
        </p>
      </div>

      {/* Hero Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Grand Total */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-950/40 via-slate-900 to-slate-900 border border-cyan-500/40 shadow-xl relative overflow-hidden sm:col-span-2">
          <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wider font-mono flex items-center gap-2">
            <Calculator className="w-4 h-4" />
            Grand Total Estimated Construction Cost
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono mt-2 tabular-nums">
            {formatCurrency(summary.grandTotal, currency)}
          </div>
          <div className="flex items-center gap-4 mt-3 text-xs text-slate-300 font-mono">
            <span>
              <strong className="text-cyan-300 font-bold">{formatCurrency(summary.costPerSqFt, currency)}</strong> / sq.ft
            </span>
            <span>·</span>
            <span>
              <strong className="text-cyan-300 font-bold">{formatCurrency(summary.costPerSqM, currency)}</strong> / m²
            </span>
            <span>·</span>
            <span className="text-slate-400 capitalize">{qualityTier} Tier Specification</span>
          </div>
        </div>

        {/* Total Material */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
            Total Material Cost
          </div>
          <div className="text-2xl font-bold text-white font-mono mt-1.5 tabular-nums">
            {formatCurrency(summary.totalMaterialCost, currency)}
          </div>
          <div className="text-xs text-cyan-400 font-mono mt-2">
            {materialPercent}% of overall project budget
          </div>
        </div>

        {/* Total Labor */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
            Total Labor & Trade
          </div>
          <div className="text-2xl font-bold text-white font-mono mt-1.5 tabular-nums">
            {formatCurrency(summary.totalLaborCost, currency)}
          </div>
          <div className="text-xs text-cyan-400 font-mono mt-2">
            {laborPercent}% of overall project budget
          </div>
        </div>
      </div>

      {/* Executive Financial Summary Table */}
      <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-900/60 shadow-lg">
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <PieChart className="w-4 h-4 text-cyan-400" />
            Executive Construction Cost Summary
          </h3>
          <span className="text-xs font-mono text-slate-400">
            Built-Up Area: {builtUpArea.toLocaleString()} sq.ft
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/40 text-slate-400 font-mono border-b border-slate-800">
              <tr>
                <th className="py-3 px-6 font-semibold">Cost Component</th>
                <th className="py-3 px-6 font-semibold">Component Scope</th>
                <th className="py-3 px-6 font-semibold text-center w-28">% Budget</th>
                <th className="py-3 px-6 font-semibold text-right">Cost / Sq.Ft</th>
                <th className="py-3 px-6 font-semibold text-right">Subtotal Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr className="hover:bg-slate-800/30">
                <td className="py-3.5 px-6 font-bold text-white">
                  1. Total Material Cost
                </td>
                <td className="py-3.5 px-6 text-slate-400">
                  Structural civil materials, finishes, woodwork, hardscaping & sanitary MEP
                </td>
                <td className="py-3.5 px-6 text-center font-mono text-cyan-400 font-semibold">
                  {materialPercent}%
                </td>
                <td className="py-3.5 px-6 text-right font-mono text-slate-300 tabular-nums">
                  {formatCurrency(Math.round(summary.totalMaterialCost / builtUpArea), currency)}
                </td>
                <td className="py-3.5 px-6 text-right font-mono text-white font-bold tabular-nums">
                  {formatCurrency(summary.totalMaterialCost, currency)}
                </td>
              </tr>

              <tr className="hover:bg-slate-800/30">
                <td className="py-3.5 px-6 font-bold text-white">
                  2. Total Labor & Contractor Cost
                </td>
                <td className="py-3.5 px-6 text-slate-400">
                  Civil masonry, formwork shuttering, bar-bending, MEP trades, tiling & paint crews
                </td>
                <td className="py-3.5 px-6 text-center font-mono text-cyan-400 font-semibold">
                  {laborPercent}%
                </td>
                <td className="py-3.5 px-6 text-right font-mono text-slate-300 tabular-nums">
                  {formatCurrency(Math.round(summary.totalLaborCost / builtUpArea), currency)}
                </td>
                <td className="py-3.5 px-6 text-right font-mono text-white font-bold tabular-nums">
                  {formatCurrency(summary.totalLaborCost, currency)}
                </td>
              </tr>

              <tr className="hover:bg-slate-800/30">
                <td className="py-3.5 px-6 font-bold text-white">
                  3. Permits, Design & Contingency Reserve
                </td>
                <td className="py-3.5 px-6 text-slate-400">
                  Site civil engineer supervision, architectural/structural fees, sanction permits & contingency reserve
                </td>
                <td className="py-3.5 px-6 text-center font-mono text-cyan-400 font-semibold">
                  {overheadPercent}%
                </td>
                <td className="py-3.5 px-6 text-right font-mono text-slate-300 tabular-nums">
                  {formatCurrency(Math.round(summary.totalOverheadsAndPermits / builtUpArea), currency)}
                </td>
                <td className="py-3.5 px-6 text-right font-mono text-white font-bold tabular-nums">
                  {formatCurrency(summary.totalOverheadsAndPermits, currency)}
                </td>
              </tr>

              {/* Grand Total Row */}
              <tr className="bg-cyan-950/30 border-t-2 border-cyan-500/50">
                <td className="py-4 px-6 text-sm font-extrabold text-cyan-300 uppercase tracking-wide">
                  Grand Total Construction Cost
                </td>
                <td className="py-4 px-6 text-xs text-slate-300 font-mono">
                  Complete turnkey execution (Materials + Labor + Design + Contingency)
                </td>
                <td className="py-4 px-6 text-center font-mono font-bold text-cyan-300 text-sm">
                  100%
                </td>
                <td className="py-4 px-6 text-right font-mono text-cyan-300 text-sm font-bold tabular-nums">
                  {formatCurrency(summary.costPerSqFt, currency)} / sq.ft
                </td>
                <td className="py-4 px-6 text-right font-mono text-cyan-300 text-lg font-extrabold tabular-nums">
                  {formatCurrency(summary.grandTotal, currency)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Visual Budget Progress Bar */}
        <div className="p-5 bg-slate-950/70 border-t border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Budget Distribution:</span>
            <span>
              Material: {materialPercent}% · Labor: {laborPercent}% · Permits/Design/Contingency: {overheadPercent}%
            </span>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden flex">
            <div
              style={{ width: `${materialPercent}%` }}
              className="bg-cyan-500 h-full transition-all"
              title={`Materials: ${materialPercent}%`}
            />
            <div
              style={{ width: `${laborPercent}%` }}
              className="bg-blue-500 h-full transition-all"
              title={`Labor: ${laborPercent}%`}
            />
            <div
              style={{ width: `${overheadPercent}%` }}
              className="bg-amber-500 h-full transition-all"
              title={`Permits & Overheads: ${overheadPercent}%`}
            />
          </div>
        </div>
      </div>

      {/* Standard Regional Engineering Ratios Audit */}
      <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-900/60 p-6 shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-bold text-white tracking-wide">
            Regional Civil Engineering Ratios & Material Density Verification
          </h3>
        </div>
        <p className="text-xs text-slate-400 mb-4 leading-relaxed">
          Standard empirical rules of thumb applied to this residence based on standard residential engineering practice:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
            <div className="text-[11px] text-slate-400 font-mono">Cement Consumption</div>
            <div className="text-lg font-bold text-cyan-400 font-mono mt-1">
              {summary.engineeringRatios.cementBagsPerSqFt}
            </div>
            <div className="text-[10px] text-slate-500 font-mono">bags / sq.ft</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
            <div className="text-[11px] text-slate-400 font-mono">TMT Steel Rebar</div>
            <div className="text-lg font-bold text-cyan-400 font-mono mt-1">
              {summary.engineeringRatios.steelKgPerSqFt}
            </div>
            <div className="text-[10px] text-slate-500 font-mono">kg / sq.ft (~4.1 kg)</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
            <div className="text-[11px] text-slate-400 font-mono">Fine Sand (M-Sand)</div>
            <div className="text-lg font-bold text-cyan-400 font-mono mt-1">
              {summary.engineeringRatios.sandCuFtPerSqFt}
            </div>
            <div className="text-[10px] text-slate-500 font-mono">cu.ft / sq.ft</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
            <div className="text-[11px] text-slate-400 font-mono">Coarse Aggregate</div>
            <div className="text-lg font-bold text-cyan-400 font-mono mt-1">
              {summary.engineeringRatios.aggregateCuFtPerSqFt}
            </div>
            <div className="text-[10px] text-slate-500 font-mono">cu.ft / sq.ft</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
            <div className="text-[11px] text-slate-400 font-mono">Masonry Bricks</div>
            <div className="text-lg font-bold text-cyan-400 font-mono mt-1">
              {summary.engineeringRatios.bricksPerSqFt || 19}
            </div>
            <div className="text-[10px] text-slate-500 font-mono">pcs / sq.ft built-up</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
            <div className="text-[11px] text-slate-400 font-mono">Carpet Efficiency</div>
            <div className="text-lg font-bold text-cyan-400 font-mono mt-1">
              {summary.engineeringRatios.carpetToBuiltUpRatio}%
            </div>
            <div className="text-[10px] text-slate-500 font-mono">usable floor area</div>
          </div>
        </div>
      </div>

      {/* Practical Value-Engineering Recommendations (Section 4 Requirement) */}
      <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-900/60 shadow-lg">
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              Practical Value-Engineering Tips to Optimize Construction Budget
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Strategic civil engineering substitutions that trim costs without compromising structural safety or durability
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-semibold bg-emerald-950/50 px-2.5 py-1 rounded-full border border-emerald-800/50">
            Up to ~16% Potential Savings
          </span>
        </div>

        <div className="p-6 space-y-4">
          {summary.valueEngineeringTips.map((tip, idx) => (
            <div
              key={tip.id}
              className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/90 hover:border-slate-700 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-xs font-mono text-cyan-400 font-bold shrink-0">
                    {idx + 1}
                  </span>
                  <h4 className="text-xs font-bold text-white">{tip.title}</h4>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-slate-400">
                    Saves ~{tip.potentialSavingsPercent}% of direct cost
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
                    ≈ {formatCurrency(tip.savingEstimate, currency)}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed pl-8">
                {tip.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 pl-8 text-[11px]">
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80">
                  <strong className="text-slate-400 block mb-0.5">Trade-off / Consideration:</strong>
                  <span className="text-slate-300">{tip.tradeOff}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80">
                  <strong className="text-cyan-400 block mb-0.5">Engineer's Verdict:</strong>
                  <span className="text-slate-300">{tip.engineerRecommendation}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Geotechnical & Regional Soil Disclaimer (Constraint Requirement) */}
      <div className="p-4 rounded-xl border border-amber-800/40 bg-amber-950/15 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 space-y-1">
          <div className="font-semibold text-amber-300">
            Civil Engineer's Site Geotechnical & Market Volatility Disclaimer
          </div>
          <p className="text-slate-400 leading-relaxed">
            This Bill of Quantities (BOQ) is calculated using empirical civil engineering formulas assuming standard non-cohesive soil with an average Safe Bearing Capacity (SBC) of 150–200 kN/m² and Seismic Zone II/III design criteria. Actual site soil conditions (such as expansive black cotton soil, high subsurface water tables requiring pile foundations or sheet waterproofing) and regional commodity fluctuations in TMT rebar and cement will cause final real-world contractor tenders to vary. Always conduct a professional borehole soil test before finalizing foundation depths.
          </p>
        </div>
      </div>
    </section>
  );
};

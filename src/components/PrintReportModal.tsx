import React from 'react';
import { X, Printer, Compass, CheckCircle2, ShieldCheck } from 'lucide-react';
import { HouseSpecs, BOQItem, LaborItem, BOQSummary, ArchitecturalFloorPlan } from '../types';
import { formatCurrency, formatNumber } from '../utils/engineeringCalculator';

interface PrintReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  specs: HouseSpecs;
  plan: ArchitecturalFloorPlan;
  items: BOQItem[];
  laborItems: LaborItem[];
  summary: BOQSummary;
}

export const PrintReportModal: React.FC<PrintReportModalProps> = ({
  isOpen,
  onClose,
  specs,
  plan,
  items,
  laborItems,
  summary,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Top Bar */}
        <div className="no-print flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-cyan-400" />
            <span className="font-bold text-white text-sm">
              Official Construction Cost & Architectural Specification Report
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print to PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Paper */}
        <div className="p-8 overflow-y-auto flex-1 bg-white text-slate-900 space-y-6 print:p-0">
          {/* Document Header */}
          <div className="border-b-2 border-slate-900 pb-4 flex justify-between items-start">
            <div>
              <div className="text-2xl font-black tracking-tight text-slate-900 uppercase">
                CIVILPLAN ENGINEERING CONSULTANCY
              </div>
              <div className="text-xs font-mono text-slate-600 mt-0.5">
                DIVISION OF RESIDENTIAL ARCHITECTURE & QUANTITY SURVEYING
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Ref Code: CP-{specs.builtUpArea}-{new Date().getFullYear()} · Issued: {new Date().toLocaleDateString()}
              </div>
            </div>
            <div className="text-right">
              <div className="inline-block bg-slate-900 text-white font-mono text-xs px-3 py-1 font-bold rounded">
                OFFICIAL BOQ ESTIMATE
              </div>
              <div className="text-xs text-slate-600 font-mono mt-1">
                Status: Verified Preliminary Design
              </div>
            </div>
          </div>

          {/* Project Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-lg bg-slate-100 border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 font-mono block text-[10px] uppercase">Project Name</span>
              <strong className="text-slate-900 text-sm">{specs.projectName}</strong>
            </div>
            <div>
              <span className="text-slate-500 font-mono block text-[10px] uppercase">Built-Up Area</span>
              <strong className="text-slate-900 text-sm font-mono">{specs.builtUpArea.toLocaleString()} sq.ft ({Math.round(specs.builtUpArea / 10.764)} m²)</strong>
            </div>
            <div>
              <span className="text-slate-500 font-mono block text-[10px] uppercase">Plot Dimensions</span>
              <strong className="text-slate-900 text-sm font-mono">{specs.plotWidth}' × {specs.plotDepth}' ({specs.plotWidth * specs.plotDepth} sq.ft)</strong>
            </div>
            <div>
              <span className="text-slate-500 font-mono block text-[10px] uppercase">Quality Grade</span>
              <strong className="text-slate-900 text-sm capitalize">{specs.qualityTier} Tier ({specs.currency})</strong>
            </div>
          </div>

          {/* 1. Architectural Zoning & Dimensions */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-300 pb-1 uppercase tracking-wide">
              1. Architectural Room Zoning & Dimensions
            </h3>
            <table className="w-full text-xs text-left border border-slate-300">
              <thead className="bg-slate-100 text-slate-700 font-mono border-b border-slate-300">
                <tr>
                  <th className="p-2 border-r border-slate-300">Zone / Room</th>
                  <th className="p-2 border-r border-slate-300 text-right">Dimensions (L × W × H)</th>
                  <th className="p-2 border-r border-slate-300 text-right">Floor Area</th>
                  <th className="p-2 border-r border-slate-300">Orientation</th>
                  <th className="p-2">Ventilation & Flow</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {plan.rooms.map((r) => (
                  <tr key={r.id}>
                    <td className="p-2 font-semibold text-slate-900 border-r border-slate-200">{r.name}</td>
                    <td className="p-2 text-right font-mono border-r border-slate-200">{r.width}' × {r.length}' × {r.height}'</td>
                    <td className="p-2 text-right font-mono border-r border-slate-200">{r.areaSqFt} sq.ft</td>
                    <td className="p-2 border-r border-slate-200 text-slate-700">{r.orientation}</td>
                    <td className="p-2 text-slate-700">{r.ventilationDetail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 2. Itemized Bill of Quantities */}
          <div className="space-y-3 print-break-inside-avoid">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-300 pb-1 uppercase tracking-wide">
              2. Itemized Bill of Quantities (Materials & Finishes)
            </h3>
            <table className="w-full text-xs text-left border border-slate-300">
              <thead className="bg-slate-100 text-slate-700 font-mono border-b border-slate-300">
                <tr>
                  <th className="p-2 border-r border-slate-300 w-20">Code</th>
                  <th className="p-2 border-r border-slate-300">Item Description & Specification</th>
                  <th className="p-2 border-r border-slate-300 text-right w-24">Qty</th>
                  <th className="p-2 border-r border-slate-300 text-center w-24">UOM</th>
                  <th className="p-2 border-r border-slate-300 text-right w-28">Rate</th>
                  <th className="p-2 text-right w-32">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="p-2 font-mono text-slate-600 border-r border-slate-200">{item.itemCode}</td>
                    <td className="p-2 border-r border-slate-200">
                      <strong className="text-slate-900">{item.description}</strong>
                      <div className="text-[10px] text-slate-600">{item.specification}</div>
                    </td>
                    <td className="p-2 text-right font-mono border-r border-slate-200">{formatNumber(item.quantity)}</td>
                    <td className="p-2 text-center font-mono text-[10px] border-r border-slate-200">{item.uom}</td>
                    <td className="p-2 text-right font-mono border-r border-slate-200">{formatCurrency(item.unitRate, specs.currency)}</td>
                    <td className="p-2 text-right font-mono font-bold text-slate-900">{formatCurrency(item.totalCost, specs.currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 3. Labor & Overheads Breakdown */}
          <div className="space-y-3 print-break-inside-avoid">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-300 pb-1 uppercase tracking-wide">
              3. Labor, Supervision & Statutory Fees
            </h3>
            <table className="w-full text-xs text-left border border-slate-300">
              <thead className="bg-slate-100 text-slate-700 font-mono border-b border-slate-300">
                <tr>
                  <th className="p-2 border-r border-slate-300">Trade / Professional Fee</th>
                  <th className="p-2 border-r border-slate-300">Scope</th>
                  <th className="p-2 border-r border-slate-300 text-right">Basis</th>
                  <th className="p-2 text-right w-32">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {laborItems.map((l) => (
                  <tr key={l.id}>
                    <td className="p-2 font-semibold text-slate-900 border-r border-slate-200">{l.trade}</td>
                    <td className="p-2 border-r border-slate-200 text-slate-600">{l.description}</td>
                    <td className="p-2 text-right font-mono border-r border-slate-200">{formatNumber(l.quantity)} sq.ft</td>
                    <td className="p-2 text-right font-mono font-bold text-slate-900">{formatCurrency(l.totalCost, specs.currency)}</td>
                  </tr>
                ))}
                <tr>
                  <td className="p-2 font-semibold text-slate-900 border-r border-slate-200">Site Engineer Supervision ({specs.supervisionFeePercent}%)</td>
                  <td className="p-2 border-r border-slate-200 text-slate-600">Continuous on-site QA/QC checking</td>
                  <td className="p-2 text-right font-mono border-r border-slate-200">% of Direct Cost</td>
                  <td className="p-2 text-right font-mono font-bold text-slate-900">{formatCurrency(summary.siteSupervisionFee, specs.currency)}</td>
                </tr>
                <tr>
                  <td className="p-2 font-semibold text-slate-900 border-r border-slate-200">Architectural & Structural Drawings ({specs.architectFeePercent}%)</td>
                  <td className="p-2 border-r border-slate-200 text-slate-600">Full CAD working details, 3D structural analysis</td>
                  <td className="p-2 text-right font-mono border-r border-slate-200">% of Direct Cost</td>
                  <td className="p-2 text-right font-mono font-bold text-slate-900">{formatCurrency(summary.architecturalFee, specs.currency)}</td>
                </tr>
                <tr>
                  <td className="p-2 font-semibold text-slate-900 border-r border-slate-200">Contingency Reserve Fund ({specs.contingencyPercent}%)</td>
                  <td className="p-2 border-r border-slate-200 text-slate-600">Material fluctuation and unforeseen geotechnical buffer</td>
                  <td className="p-2 text-right font-mono border-r border-slate-200">% of Direct Cost</td>
                  <td className="p-2 text-right font-mono font-bold text-slate-900">{formatCurrency(summary.contingencyAmount, specs.currency)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 4. Grand Total Summary */}
          <div className="p-4 rounded-lg bg-slate-900 text-white flex justify-between items-center print-break-inside-avoid">
            <div>
              <div className="text-xs uppercase font-mono tracking-widest text-cyan-400">
                Grand Total Estimated Turnkey Cost
              </div>
              <div className="text-2xl font-black font-mono mt-1">
                {formatCurrency(summary.grandTotal, specs.currency)}
              </div>
            </div>
            <div className="text-right font-mono text-xs">
              <div>Average Cost / Sq.Ft: <strong>{formatCurrency(summary.costPerSqFt, specs.currency)}</strong></div>
              <div>Average Cost / Sq.M: <strong>{formatCurrency(summary.costPerSqM, specs.currency)}</strong></div>
            </div>
          </div>

          {/* Signatures & Certification */}
          <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-300 text-xs text-slate-700 print-break-inside-avoid">
            <div>
              <div className="font-bold text-slate-900">PREPARED BY:</div>
              <div className="h-12 border-b border-dashed border-slate-400"></div>
              <div className="mt-1 font-mono text-[11px]">Senior Quantity Surveyor (RICS / AIQS Chartered)</div>
            </div>
            <div>
              <div className="font-bold text-slate-900">APPROVED & CERTIFIED BY:</div>
              <div className="h-12 border-b border-dashed border-slate-400"></div>
              <div className="mt-1 font-mono text-[11px]">Chief Structural Civil Engineer (PE / Chartered Civil)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

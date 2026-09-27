import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  Layers, 
  Calculator, 
  HardHat, 
  FileText, 
  SlidersHorizontal, 
  Printer, 
  RotateCcw,
  Sparkles,
  Compass,
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import { HouseSpecs, QualityTier, Currency } from './types';
import { calculateBOQ, formatCurrency } from './utils/engineeringCalculator';
import { generateArchitecturalFloorPlan } from './utils/floorPlanGenerator';
import { Header } from './components/Header';
import { SpecsInputModal, PRESETS } from './components/SpecsInputModal';
import { ArchitecturalPlanSection } from './components/ArchitecturalPlanSection';
import { BOQSection } from './components/BOQSection';
import { LaborOverheadSection } from './components/LaborOverheadSection';
import { SummaryGrandTotalSection } from './components/SummaryGrandTotalSection';
import { PrintReportModal } from './components/PrintReportModal';

const DEFAULT_SPECS: HouseSpecs = {
  projectName: 'Modern Suburban 3BHK Residence',
  builtUpArea: 1800,
  plotWidth: 40,
  plotDepth: 60,
  floors: 1,
  qualityTier: 'standard',
  currency: 'USD',
  unitSystem: 'sqft',
  contingencyPercent: 7.5,
  supervisionFeePercent: 4.0,
  architectFeePercent: 4.5,
  contractorMarginPercent: 10.0,
  exterior: {
    lawnArea: 320,
    parkingSpaces: 1,
    parkingArea: 200,
    entryPorchArea: 84,
    patioBalconyArea: 120,
    compoundWallLength: 200,
    entranceGateWidth: 14,
  },
  rooms: [
    { id: 'living', name: 'Formal Living Room', type: 'living', length: 16, width: 14, height: 10.5 },
    { id: 'kitchen', name: 'Modular Kitchen & Pantry', type: 'kitchen', length: 10, width: 10, height: 10 },
    { id: 'dining', name: 'Central Dining Hall', type: 'dining', length: 12, width: 10, height: 10 },
    { id: 'master', name: 'Master Bedroom Suite', type: 'master-bed', length: 14, width: 13, height: 10, attachedBath: true },
    { id: 'bed2', name: 'Bedroom 2 / Guest', type: 'bedroom', length: 12, width: 11, height: 10 },
    { id: 'bath-master', name: 'En-Suite Master Bath', type: 'bathroom', length: 8, width: 5, height: 9.5 },
    { id: 'bath-common', name: 'Common Restroom', type: 'bathroom', length: 7, width: 4.5, height: 9.5 },
    { id: 'porch', name: 'Entry Porch / Verandah', type: 'foyer', length: 14, width: 6, height: 10 },
  ],
};

export default function App() {
  const [specs, setSpecs] = useState<HouseSpecs>(DEFAULT_SPECS);
  const [customRates, setCustomRates] = useState<Record<string, number>>({});
  const [activeTab, setActiveTab] = useState<'all' | 'plan' | 'boq' | 'labor' | 'summary'>('all');
  const [isSpecsOpen, setIsSpecsOpen] = useState<boolean>(false);
  const [isPrintOpen, setIsPrintOpen] = useState<boolean>(false);

  // Calculate Architectural Floor Plan CAD Geometry
  const plan = useMemo(() => {
    return generateArchitecturalFloorPlan(specs);
  }, [specs]);

  // Calculate Itemized Bill of Quantities (BOQ) & Labor Breakdown
  const { items, laborItems, summary } = useMemo(() => {
    return calculateBOQ(specs, customRates);
  }, [specs, customRates]);

  const handleUpdateRate = (id: string, newRate: number) => {
    setCustomRates(prev => ({ ...prev, [id]: newRate }));
  };

  const handleResetRates = () => {
    setCustomRates({});
  };

  const handleResetAll = () => {
    setSpecs(DEFAULT_SPECS);
    setCustomRates({});
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* 1. Header (Follows Top Bar Contract) */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenSpecs={() => setIsSpecsOpen(true)}
        onPrint={() => setIsPrintOpen(true)}
        onReset={handleResetAll}
        currency={specs.currency}
        qualityTier={specs.qualityTier}
        builtUpArea={specs.builtUpArea}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Project Context & Quick Parameters Strip */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur overflow-hidden shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            {/* Left Col: Project Summary & Fast Toggles */}
            <div className="p-6 lg:col-span-8 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
                  <span>RESIDENTIAL CIVIL ENGINEERING & QUANTITY SURVEYING</span>
                  <span>·</span>
                  <span>PRELIMINARY ESTIMATE</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {specs.projectName}
                </h1>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed max-w-2xl">
                  Optimized architectural layout, structural Bill of Quantities (BOQ), and contractor cost estimation calibrated to empirical civil engineering consumption ratios.
                </p>
              </div>

              {/* Fast Inline Specs Badges & Controls */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[11px] text-slate-400 block font-mono">Built-Up Area</span>
                  <div className="text-sm font-bold text-white font-mono mt-0.5">
                    {specs.builtUpArea.toLocaleString()} sq.ft
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">
                    ≈ {Math.round(specs.builtUpArea / 10.764)} m²
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[11px] text-slate-400 block font-mono">Plot Envelope</span>
                  <div className="text-sm font-bold text-white font-mono mt-0.5">
                    {specs.plotWidth}' × {specs.plotDepth}'
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {(specs.plotWidth * specs.plotDepth).toLocaleString()} sq.ft
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[11px] text-slate-400 block font-mono">Quality Grade</span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <select
                      value={specs.qualityTier}
                      onChange={(e) => setSpecs({ ...specs, qualityTier: e.target.value as QualityTier })}
                      className="bg-transparent text-xs font-bold text-cyan-400 cursor-pointer focus:outline-none capitalize"
                    >
                      <option value="economy" className="bg-slate-900 text-white">Economy</option>
                      <option value="standard" className="bg-slate-900 text-white">Standard</option>
                      <option value="luxury" className="bg-slate-900 text-white">Luxury / Prem</option>
                    </select>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono capitalize">
                    {specs.qualityTier} materials
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[11px] text-slate-400 block font-mono">Currency</span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <select
                      value={specs.currency}
                      onChange={(e) => setSpecs({ ...specs, currency: e.target.value as Currency })}
                      className="bg-transparent text-xs font-bold text-cyan-400 cursor-pointer focus:outline-none"
                    >
                      <option value="USD" className="bg-slate-900 text-white">USD ($)</option>
                      <option value="INR" className="bg-slate-900 text-white">INR (₹)</option>
                      <option value="EUR" className="bg-slate-900 text-white">EUR (€)</option>
                      <option value="GBP" className="bg-slate-900 text-white">GBP (£)</option>
                      <option value="CAD" className="bg-slate-900 text-white">CAD (C$)</option>
                      <option value="AUD" className="bg-slate-900 text-white">AUD (A$)</option>
                    </select>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Local rate index
                  </span>
                </div>
              </div>
            </div>

            {/* Right Col: High-Fidelity Architectural Visual Asset & Grand Estimate Pill */}
            <div className="relative lg:col-span-4 min-h-[220px] bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col justify-end p-6 overflow-hidden">
              <img
                src="/src/assets/images/modern_residence_elevation_1790499735031.jpg"
                alt="Contemporary architectural residential elevation"
                className="absolute inset-0 w-full h-full object-cover opacity-35 hover:opacity-50 transition-opacity"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent"></div>

              <div className="relative z-10 space-y-2">
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block">
                  Grand Turnkey Estimate
                </span>
                <div className="text-2xl sm:text-3xl font-black text-white font-mono tabular-nums">
                  {formatCurrency(summary.grandTotal, specs.currency)}
                </div>
                <div className="text-[11px] font-mono text-slate-300">
                  {formatCurrency(summary.costPerSqFt, specs.currency)} / sq.ft · All-Inclusive
                </div>
                <button
                  onClick={() => setIsSpecsOpen(true)}
                  className="mt-2 w-full py-2 text-xs font-semibold text-slate-200 bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Customize House Parameters</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 1: Architectural Floor Plan & Layout Specification */}
        {(activeTab === 'all' || activeTab === 'plan') && (
          <ArchitecturalPlanSection plan={plan} unitSystem={specs.unitSystem} />
        )}

        {/* SECTION 2: Itemized Material & Component Cost Estimation (BOQ) */}
        {(activeTab === 'all' || activeTab === 'boq') && (
          <BOQSection
            items={items}
            currency={specs.currency}
            onUpdateRate={handleUpdateRate}
            onResetRates={handleResetRates}
          />
        )}

        {/* SECTION 3: Labor, Supervision & Overhead Costs */}
        {(activeTab === 'all' || activeTab === 'labor') && (
          <LaborOverheadSection
            laborItems={laborItems}
            summary={summary}
            currency={specs.currency}
            contingencyPercent={specs.contingencyPercent}
            supervisionPercent={specs.supervisionFeePercent}
            architectPercent={specs.architectFeePercent}
          />
        )}

        {/* SECTION 4: Summary & Grand Total */}
        {(activeTab === 'all' || activeTab === 'summary') && (
          <SummaryGrandTotalSection
            summary={summary}
            currency={specs.currency}
            qualityTier={specs.qualityTier}
            builtUpArea={specs.builtUpArea}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-6 mt-16 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            CivilPlan Architectural & Quantity Surveying Studio · Professional Civil Engineering Specification
          </div>
          <div>
            Empirical civil formulas adhering to residential building codes & IS/ACI standards
          </div>
        </div>
      </footer>

      {/* Modals */}
      <SpecsInputModal
        isOpen={isSpecsOpen}
        onClose={() => setIsSpecsOpen(false)}
        specs={specs}
        onSave={(newSpecs) => setSpecs(newSpecs)}
      />

      <PrintReportModal
        isOpen={isPrintOpen}
        onClose={() => setIsPrintOpen(false)}
        specs={specs}
        plan={plan}
        items={items}
        laborItems={laborItems}
        summary={summary}
      />
    </div>
  );
}

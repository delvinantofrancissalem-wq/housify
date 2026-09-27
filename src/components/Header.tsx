import React from 'react';
import { Compass, Printer, RefreshCw, SlidersHorizontal, Download } from 'lucide-react';
import { Currency, QualityTier } from '../types';

interface HeaderProps {
  activeTab: 'all' | 'plan' | 'boq' | 'labor' | 'summary';
  onTabChange: (tab: 'all' | 'plan' | 'boq' | 'labor' | 'summary') => void;
  onOpenSpecs: () => void;
  onPrint: () => void;
  onReset: () => void;
  currency: Currency;
  qualityTier: QualityTier;
  builtUpArea: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onOpenSpecs,
  onPrint,
  onReset,
  currency,
  qualityTier,
  builtUpArea,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Compass className="w-5 h-5" />
            </div>
            <a href="/" className="text-lg font-bold tracking-tight text-white hover:text-cyan-400 transition-colors">
              CivilPlan Studio
            </a>
            <span className="hidden sm:inline-block text-xs text-slate-500 font-mono">
              v2.4 · {builtUpArea.toLocaleString()} sq.ft · {qualityTier.toUpperCase()}
            </span>
          </div>

          {/* Zone 2: Clean text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
            <button
              onClick={() => onTabChange('all')}
              className={`hover:text-white transition-colors cursor-pointer ${
                activeTab === 'all' ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400 py-5' : 'py-5'
              }`}
            >
              Full Report
            </button>
            <button
              onClick={() => onTabChange('plan')}
              className={`hover:text-white transition-colors cursor-pointer ${
                activeTab === 'plan' ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400 py-5' : 'py-5'
              }`}
            >
              1. Floor Plan & Blueprint
            </button>
            <button
              onClick={() => onTabChange('boq')}
              className={`hover:text-white transition-colors cursor-pointer ${
                activeTab === 'boq' ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400 py-5' : 'py-5'
              }`}
            >
              2. Itemized BOQ
            </button>
            <button
              onClick={() => onTabChange('labor')}
              className={`hover:text-white transition-colors cursor-pointer ${
                activeTab === 'labor' ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400 py-5' : 'py-5'
              }`}
            >
              3. Labor & Overheads
            </button>
            <button
              onClick={() => onTabChange('summary')}
              className={`hover:text-white transition-colors cursor-pointer ${
                activeTab === 'summary' ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400 py-5' : 'py-5'
              }`}
            >
              4. Executive Summary
            </button>
          </nav>

          {/* Zone 3: Primary actions */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenSpecs}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
              title="Configure House Specifications"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
              <span>Configure Specs</span>
            </button>

            <button
              onClick={onPrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors cursor-pointer whitespace-nowrap shadow-sm shadow-cyan-950"
              title="Print or Export PDF Report"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={onReset}
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="Reset to default engineering baseline"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

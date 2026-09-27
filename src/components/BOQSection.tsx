import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  Download, 
  Edit3, 
  Check, 
  RotateCcw, 
  HelpCircle, 
  FileSpreadsheet,
  Hammer,
  Paintbrush,
  Armchair,
  TreePine
} from 'lucide-react';
import { BOQItem, Currency } from '../types';
import { formatCurrency, formatNumber } from '../utils/engineeringCalculator';

interface BOQSectionProps {
  items: BOQItem[];
  currency: Currency;
  onUpdateRate: (id: string, newRate: number) => void;
  onResetRates: () => void;
}

export const BOQSection: React.FC<BOQSectionProps> = ({
  items,
  currency,
  onUpdateRate,
  onResetRates,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [tempRate, setTempRate] = useState<string>('');

  const categories = [
    { id: 'all', label: 'All Categories', icon: Building2 },
    { id: 'structural', label: '1. Structural & Civil', icon: Hammer },
    { id: 'finishing', label: '2. Finishing & Architectural', icon: Paintbrush },
    { id: 'interior', label: '3. Interior & Furnishing', icon: Armchair },
    { id: 'exterior', label: '4. Exterior & Landscaping', icon: TreePine },
  ];

  const filteredItems = items.filter((item) => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesQuery =
      searchQuery === '' ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.itemCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.specification.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const totalMaterialsCost = items.reduce((sum, item) => sum + item.totalCost, 0);
  const currentCategoryCost = filteredItems.reduce((sum, item) => sum + item.totalCost, 0);

  const handleStartEdit = (item: BOQItem) => {
    setEditingItemId(item.id);
    setTempRate(item.unitRate.toString());
  };

  const handleSaveRate = (id: string) => {
    const val = parseFloat(tempRate);
    if (!isNaN(val) && val >= 0) {
      onUpdateRate(id, val);
    }
    setEditingItemId(null);
  };

  const handleExportCSV = () => {
    const headers = ['Item Code', 'Category', 'Description', 'Specification', 'Quantity', 'UOM', 'Unit Rate', 'Total Cost', 'Formula Calculation'];
    const rows = items.map(item => [
      `"${item.itemCode}"`,
      `"${item.category}"`,
      `"${item.description.replace(/"/g, '""')}"`,
      `"${item.specification.replace(/"/g, '""')}"`,
      item.quantity,
      `"${item.uom}"`,
      item.unitRate,
      item.totalCost,
      `"${item.engineeringFormulaNote.replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Bill_of_Quantities_BOQ_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Group items by category for clear presentation
  const groupedCategories: Array<{
    id: 'structural' | 'finishing' | 'interior' | 'exterior';
    title: string;
    description: string;
    items: BOQItem[];
  }> = [
    {
      id: 'structural',
      title: '1. Structural & Civil Materials',
      description: 'Foundations, RCC frame, masonry blocks, cement, reinforcement steel & aggregates',
      items: filteredItems.filter(i => i.category === 'structural'),
    },
    {
      id: 'finishing',
      title: '2. Finishing & Architectural Components',
      description: 'Flooring tiles, doors, UPVC windows, wall paints, sanitary fixtures & electrical cabling',
      items: filteredItems.filter(i => i.category === 'finishing'),
    },
    {
      id: 'interior',
      title: '3. Interior & Basic Furnishing',
      description: 'Modular kitchen cabinetry, quartz/granite counters, and floor-to-ceiling wardrobes',
      items: filteredItems.filter(i => i.category === 'interior'),
    },
    {
      id: 'exterior',
      title: '4. Exterior, Landscaping & Parking',
      description: 'Heavy driveway pavers, lawn sod turfing, perimeter compound wall & steel entrance gate',
      items: filteredItems.filter(i => i.category === 'exterior'),
    },
  ];

  return (
    <section id="section-boq" className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/60">
              SECTION 02
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Itemized Material & Component Cost Estimation (Bill of Quantities)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Empirical civil engineering quantities calculated from standard building codes and structural ratios. Click any unit rate to customize with local supplier quotes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onResetRates}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg transition-colors cursor-pointer"
            title="Reset to default baseline rates"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Rates</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors cursor-pointer shadow-sm"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Category Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
        {/* Category buttons */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64 shrink-0">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search material or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      {/* Itemized Tables by Category */}
      <div className="space-y-6">
        {groupedCategories
          .filter((g) => g.items.length > 0)
          .map((group) => {
            const subtotal = group.items.reduce((sum, item) => sum + item.totalCost, 0);
            const percentOfTotal = Math.round((subtotal / totalMaterialsCost) * 100);

            return (
              <div key={group.id} className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-900/60 shadow-lg">
                {/* Group Header */}
                <div className="px-6 py-3.5 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-wide">
                      {group.title}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      {group.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-cyan-400 tabular-nums">
                      {formatCurrency(subtotal, currency)}
                    </span>
                    <span className="text-[11px] text-slate-500 block font-mono">
                      {percentOfTotal}% of Materials
                    </span>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950/40 text-slate-400 font-mono border-b border-slate-800">
                      <tr>
                        <th className="py-2.5 px-4 font-semibold w-24">Code</th>
                        <th className="py-2.5 px-4 font-semibold">Description & Engineering Spec</th>
                        <th className="py-2.5 px-4 font-semibold text-right">Quantity</th>
                        <th className="py-2.5 px-4 font-semibold text-center w-24">UOM</th>
                        <th className="py-2.5 px-4 font-semibold text-right w-36">Unit Rate</th>
                        <th className="py-2.5 px-4 font-semibold text-right w-36">Total Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      {group.items.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="py-3 px-4 font-mono text-[11px] text-cyan-400 font-semibold">
                            {item.itemCode}
                          </td>
                          <td className="py-3 px-4 max-w-md">
                            <div className="font-semibold text-white text-xs">{item.description}</div>
                            <div className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{item.specification}</div>
                            <div className="text-[10px] text-slate-500 font-mono mt-1 flex items-center gap-1">
                              <HelpCircle className="w-3 h-3 text-cyan-500/70" />
                              <span>{item.engineeringFormulaNote}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right font-mono text-slate-200 tabular-nums font-semibold">
                            {formatNumber(item.quantity, item.uom.includes('Tons') || item.uom.includes('Meters') ? 2 : 0)}
                          </td>
                          <td className="py-3 px-4 text-center font-mono text-[11px] text-slate-400">
                            {item.uom}
                          </td>
                          <td className="py-3 px-4 text-right font-mono tabular-nums">
                            {editingItemId === item.id ? (
                              <div className="flex items-center justify-end gap-1">
                                <input
                                  type="number"
                                  value={tempRate}
                                  onChange={(e) => setTempRate(e.target.value)}
                                  className="w-20 bg-slate-950 border border-cyan-400 rounded px-1.5 py-0.5 text-xs text-white text-right focus:outline-none"
                                  autoFocus
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleSaveRate(item.id);
                                    if (e.key === 'Escape') setEditingItemId(null);
                                  }}
                                />
                                <button
                                  onClick={() => handleSaveRate(item.id)}
                                  className="p-1 bg-cyan-500 text-slate-950 rounded hover:bg-cyan-400"
                                >
                                  <Check className="w-3 h-3" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleStartEdit(item)}
                                className="inline-flex items-center gap-1 group hover:text-cyan-300 cursor-pointer"
                                title="Click to edit unit rate"
                              >
                                <span className={item.userEditedRate ? 'text-amber-300 font-bold' : 'text-slate-300'}>
                                  {formatCurrency(item.unitRate, currency)}
                                </span>
                                <Edit3 className="w-3 h-3 opacity-0 group-hover:opacity-100 text-cyan-400 transition-opacity" />
                              </button>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right font-mono text-cyan-400 font-bold tabular-nums">
                            {formatCurrency(item.totalCost, currency)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
      </div>

      {/* Materials Total Summary Card */}
      <div className="p-4 rounded-xl border border-cyan-500/30 bg-cyan-950/20 flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="text-xs font-semibold text-cyan-300 uppercase tracking-wider font-mono">
            Total Material & Architectural Components Subtotal
          </div>
          <div className="text-xs text-slate-400 mt-0.5">
            Sum of structural civil masonry, finishes, woodwork cabinetry, and exterior hardscaping
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold font-mono text-cyan-300 tabular-nums">
            {formatCurrency(totalMaterialsCost, currency)}
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            Direct material procurement baseline
          </div>
        </div>
      </div>
    </section>
  );
};

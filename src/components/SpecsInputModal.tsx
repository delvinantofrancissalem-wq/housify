import React, { useState } from 'react';
import { X, Check, Building2, Sliders, MapPin, Sparkles, Layers, DollarSign, Home } from 'lucide-react';
import { HouseSpecs, QualityTier, Currency, UnitSystem } from '../types';

interface SpecsInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  specs: HouseSpecs;
  onSave: (newSpecs: HouseSpecs) => void;
}

export const PRESETS: Array<{
  name: string;
  tagline: string;
  specs: Partial<HouseSpecs>;
}> = [
  {
    name: 'Suburban 3BHK Family Villa',
    tagline: '1,800 sq.ft · 40x60 plot · Standard finish',
    specs: {
      projectName: 'Suburban 3BHK Family Villa',
      builtUpArea: 1800,
      plotWidth: 40,
      plotDepth: 60,
      floors: 1,
      qualityTier: 'standard',
      exterior: {
        lawnArea: 320,
        parkingSpaces: 1,
        parkingArea: 200,
        entryPorchArea: 80,
        patioBalconyArea: 120,
        compoundWallLength: 200,
        entranceGateWidth: 14,
      },
    },
  },
  {
    name: 'Compact Modern 2BHK',
    tagline: '1,200 sq.ft · 30x50 plot · Economy finish',
    specs: {
      projectName: 'Compact Modern 2BHK',
      builtUpArea: 1200,
      plotWidth: 30,
      plotDepth: 50,
      floors: 1,
      qualityTier: 'economy',
      exterior: {
        lawnArea: 180,
        parkingSpaces: 1,
        parkingArea: 160,
        entryPorchArea: 60,
        patioBalconyArea: 80,
        compoundWallLength: 160,
        entranceGateWidth: 12,
      },
    },
  },
  {
    name: 'Executive Luxury 4BHK Duplex',
    tagline: '3,200 sq.ft · 50x70 plot · Luxury finish',
    specs: {
      projectName: 'Executive Luxury 4BHK Duplex',
      builtUpArea: 3200,
      plotWidth: 50,
      plotDepth: 70,
      floors: 2,
      qualityTier: 'luxury',
      exterior: {
        lawnArea: 650,
        parkingSpaces: 2,
        parkingArea: 380,
        entryPorchArea: 140,
        patioBalconyArea: 240,
        compoundWallLength: 240,
        entranceGateWidth: 16,
      },
    },
  },
  {
    name: 'Urban Row House (G+1)',
    tagline: '1,500 sq.ft · 25x60 plot · Standard finish',
    specs: {
      projectName: 'Urban Row House',
      builtUpArea: 1500,
      plotWidth: 25,
      plotDepth: 60,
      floors: 2,
      qualityTier: 'standard',
      exterior: {
        lawnArea: 120,
        parkingSpaces: 1,
        parkingArea: 180,
        entryPorchArea: 50,
        patioBalconyArea: 100,
        compoundWallLength: 170,
        entranceGateWidth: 12,
      },
    },
  },
];

export const SpecsInputModal: React.FC<SpecsInputModalProps> = ({
  isOpen,
  onClose,
  specs,
  onSave,
}) => {
  const [formData, setFormData] = useState<HouseSpecs>(specs);
  const [activeTab, setActiveTab] = useState<'general' | 'rooms' | 'exterior' | 'rates'>('general');

  if (!isOpen) return null;

  const handleApplyPreset = (preset: typeof PRESETS[0]) => {
    setFormData(prev => ({
      ...prev,
      ...preset.specs,
      exterior: {
        ...prev.exterior,
        ...(preset.specs.exterior || {}),
      },
    }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const bedCount = formData.rooms.filter(r => r.type === 'master-bed' || r.type === 'bedroom').length;
  const bathCount = formData.rooms.filter(r => r.type === 'bathroom').length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-cyan-400" />
              House Specifications & Engineering Parameters
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Customize plot, room breakdown, structural specifications, and cost tier
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preset Bar */}
        <div className="px-6 py-3 bg-slate-950/30 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Presets:
          </span>
          {PRESETS.map(p => (
            <button
              key={p.name}
              onClick={() => handleApplyPreset(p)}
              className="text-xs px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/60 hover:bg-slate-800 hover:border-cyan-500/50 text-slate-200 transition-colors whitespace-nowrap cursor-pointer"
            >
              {p.name}
            </button>
          ))}
        </div>

        {/* Tab navigation */}
        <div className="flex border-b border-slate-800 px-6 gap-6 bg-slate-900/50">
          <button
            onClick={() => setActiveTab('general')}
            className={`py-3 text-xs font-semibold border-b-2 cursor-pointer transition-colors ${
              activeTab === 'general' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            General & Plot
          </button>
          <button
            onClick={() => setActiveTab('rooms')}
            className={`py-3 text-xs font-semibold border-b-2 cursor-pointer transition-colors ${
              activeTab === 'rooms' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Room Breakdown
          </button>
          <button
            onClick={() => setActiveTab('exterior')}
            className={`py-3 text-xs font-semibold border-b-2 cursor-pointer transition-colors ${
              activeTab === 'exterior' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Exterior & Parking
          </button>
          <button
            onClick={() => setActiveTab('rates')}
            className={`py-3 text-xs font-semibold border-b-2 cursor-pointer transition-colors ${
              activeTab === 'rates' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Tier, Currency & Overheads
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Project Title
                  </label>
                  <input
                    type="text"
                    value={formData.projectName}
                    onChange={e => setFormData({ ...formData, projectName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Total Built-Up Area (sq. ft)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={600}
                      max={10000}
                      step={50}
                      value={formData.builtUpArea}
                      onChange={e => setFormData({ ...formData, builtUpArea: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white font-mono focus:outline-none focus:border-cyan-400"
                    />
                    <span className="text-xs text-slate-400 font-mono shrink-0">
                      ≈ {Math.round(formData.builtUpArea / 10.764)} m²
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Plot Width (feet)
                  </label>
                  <input
                    type="number"
                    min={18}
                    max={150}
                    value={formData.plotWidth}
                    onChange={e => setFormData({ ...formData, plotWidth: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white font-mono focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Plot Depth (feet)
                  </label>
                  <input
                    type="number"
                    min={25}
                    max={200}
                    value={formData.plotDepth}
                    onChange={e => setFormData({ ...formData, plotDepth: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white font-mono focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Total Plot Area
                  </label>
                  <div className="bg-slate-950/70 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-cyan-400 font-mono">
                    {(formData.plotWidth * formData.plotDepth).toLocaleString()} sq.ft
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">
                  Building Height / Number of Floors
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 1, label: 'Single Story (G+0)', desc: 'Ground floor bungalow' },
                    { id: 2, label: 'Duplex (G+1)', desc: 'Ground + First floor' },
                    { id: 3, label: 'Triplex (G+2)', desc: 'Ground + 2 Floors' },
                  ].map(f => (
                    <button
                      key={f.id}
                      onClick={() => setFormData({ ...formData, floors: f.id })}
                      className={`p-3 text-left rounded-xl border transition-all cursor-pointer ${
                        formData.floors === f.id
                          ? 'border-cyan-500 bg-cyan-500/10 text-white'
                          : 'border-slate-800 bg-slate-950 hover:border-slate-700 text-slate-400'
                      }`}
                    >
                      <div className="font-semibold text-xs text-white">{f.label}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{f.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'rooms' && (
            <div className="space-y-5">
              <p className="text-xs text-slate-400">
                Configure primary living spaces, sleeping quarters, and functional sanitary zones.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-white">Bedrooms</span>
                    <span className="text-xs text-cyan-400 font-mono">{bedCount} Rooms</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {[2, 3, 4, 5].map(cnt => (
                      <button
                        key={cnt}
                        onClick={() => {
                          const currentOtherBeds = formData.rooms.filter(r => r.type === 'bedroom');
                          const master = formData.rooms.find(r => r.type === 'master-bed');
                          const newRooms = formData.rooms.filter(r => r.type !== 'bedroom');
                          for (let i = 2; i <= cnt; i++) {
                            newRooms.push({
                              id: `bed-${i}`,
                              name: `Bedroom ${i}`,
                              type: 'bedroom',
                              length: 12,
                              width: 11,
                              height: 10,
                            });
                          }
                          setFormData({ ...formData, rooms: newRooms });
                        }}
                        className={`flex-1 py-1.5 text-xs font-medium rounded-lg border cursor-pointer ${
                          bedCount === cnt
                            ? 'border-cyan-500 bg-cyan-500/20 text-cyan-300'
                            : 'border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        {cnt} BHK
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-white">Bathrooms & Restrooms</span>
                    <span className="text-xs text-cyan-400 font-mono">{bathCount} Baths</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4].map(cnt => (
                      <button
                        key={cnt}
                        onClick={() => {
                          const nonBaths = formData.rooms.filter(r => r.type !== 'bathroom');
                          for (let i = 1; i <= cnt; i++) {
                            nonBaths.push({
                              id: `bath-${i}`,
                              name: i === 1 ? 'Master En-Suite' : `Bathroom ${i}`,
                              type: 'bathroom',
                              length: 8,
                              width: 5,
                              height: 9.5,
                            });
                          }
                          setFormData({ ...formData, rooms: nonBaths });
                        }}
                        className={`flex-1 py-1.5 text-xs font-medium rounded-lg border cursor-pointer ${
                          bathCount === cnt
                            ? 'border-cyan-500 bg-cyan-500/20 text-cyan-300'
                            : 'border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        {cnt} Baths
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60">
                <span className="text-xs font-semibold text-white block mb-2">Room Dimensions Quick Reference</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-300 font-mono">
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Living Room</span>
                    16'0" × 14'0" (10.5' Ht)
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Dining Hall</span>
                    12'0" × 10'0" (10' Ht)
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Modular Kitchen</span>
                    10'0" × 10'0" (10' Ht)
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Master Suite</span>
                    14'0" × 13'0" (10' Ht)
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'exterior' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Lawn & Garden Area (sq. ft)
                  </label>
                  <input
                    type="number"
                    min={50}
                    max={2000}
                    step={25}
                    value={formData.exterior.lawnArea}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        exterior: { ...formData.exterior, lawnArea: Number(e.target.value) },
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white font-mono focus:outline-none focus:border-cyan-400"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Red loam soil, turfing grass, and perimeter shrubs
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Parking / Carport Spaces
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[1, 2].map(num => (
                      <button
                        key={num}
                        onClick={() =>
                          setFormData({
                            ...formData,
                            exterior: {
                              ...formData.exterior,
                              parkingSpaces: num,
                              parkingArea: num === 1 ? 200 : 380,
                            },
                          })
                        }
                        className={`py-2 text-xs font-semibold rounded-lg border cursor-pointer ${
                          formData.exterior.parkingSpaces === num
                            ? 'border-cyan-500 bg-cyan-500/20 text-cyan-300'
                            : 'border-slate-700 bg-slate-950 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        {num} Car ({num === 1 ? '10x20 ft' : '19x20 ft'})
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Compound Wall Perimeter (running feet)
                  </label>
                  <input
                    type="number"
                    min={50}
                    max={1000}
                    value={formData.exterior.compoundWallLength}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        exterior: { ...formData.exterior, compoundWallLength: Number(e.target.value) },
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white font-mono focus:outline-none focus:border-cyan-400"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    6 ft height with RCC plinth and weathercoat plaster
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Main Entrance Gate Width (feet)
                  </label>
                  <input
                    type="number"
                    min={8}
                    max={24}
                    value={formData.exterior.entranceGateWidth}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        exterior: { ...formData.exterior, entranceGateWidth: Number(e.target.value) },
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white font-mono focus:outline-none focus:border-cyan-400"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Sliding MS driveway gate + pedestrian wicket door
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'rates' && (
            <div className="space-y-6">
              {/* Finish Grade / Quality Tier */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">
                  Finish Grade / Quality Tier
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {
                      id: 'economy',
                      name: 'Economy Grade',
                      specs: 'Class-I brick masonry, M20 concrete, Fe500 steel, ceramic tiles (2x2), flush doors, aluminum windows, basic CP fittings.',
                    },
                    {
                      id: 'standard',
                      name: 'Standard Grade',
                      specs: 'AAC/wirecut bricks, M25 concrete, Fe550D TMT rebar, vitrified porcelain tiles (4x2), UPVC double-glazed windows, teak entrance door, modular kitchen.',
                    },
                    {
                      id: 'luxury',
                      name: 'Luxury / Premium',
                      specs: 'Heavy RCC framed, large-format Italian marble/GVT, thermally-broken aluminum windows, solid teak doors, luxury plumbing suites, designer landscaping.',
                    },
                  ].map(t => (
                    <button
                      key={t.id}
                      onClick={() => setFormData({ ...formData, qualityTier: t.id as QualityTier })}
                      className={`p-3.5 text-left rounded-xl border transition-all cursor-pointer ${
                        formData.qualityTier === t.id
                          ? 'border-cyan-500 bg-cyan-500/10 text-white'
                          : 'border-slate-800 bg-slate-950 hover:border-slate-700 text-slate-400'
                      }`}
                    >
                      <div className="font-semibold text-xs text-white flex items-center justify-between">
                        {t.name}
                        {formData.qualityTier === t.id && <Check className="w-4 h-4 text-cyan-400" />}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1 leading-relaxed">{t.specs}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Location & Currency */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">
                  Location & Regional Currency Context
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                  {[
                    { id: 'USD', name: 'USD ($)', region: 'North America' },
                    { id: 'INR', name: 'INR (₹)', region: 'India / S. Asia' },
                    { id: 'EUR', name: 'EUR (€)', region: 'Eurozone' },
                    { id: 'GBP', name: 'GBP (£)', region: 'United Kingdom' },
                    { id: 'CAD', name: 'CAD (C$)', region: 'Canada' },
                    { id: 'AUD', name: 'AUD (A$)', region: 'Australia' },
                  ].map(c => (
                    <button
                      key={c.id}
                      onClick={() => setFormData({ ...formData, currency: c.id as Currency })}
                      className={`p-2.5 text-center rounded-lg border transition-colors cursor-pointer ${
                        formData.currency === c.id
                          ? 'border-cyan-500 bg-cyan-500/20 text-cyan-300'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:bg-slate-900'
                      }`}
                    >
                      <div className="text-xs font-bold">{c.name}</div>
                      <div className="text-[10px] text-slate-500">{c.region}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Overheads & Contingency */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Contingency Reserve ({formData.contingencyPercent}%)
                  </label>
                  <input
                    type="range"
                    min={5}
                    max={12}
                    step={0.5}
                    value={formData.contingencyPercent}
                    onChange={e => setFormData({ ...formData, contingencyPercent: Number(e.target.value) })}
                    className="w-full accent-cyan-400"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>5% (tight)</span>
                    <span>10% (standard)</span>
                    <span>12%</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Site Supervision ({formData.supervisionFeePercent}%)
                  </label>
                  <input
                    type="range"
                    min={2}
                    max={8}
                    step={0.5}
                    value={formData.supervisionFeePercent}
                    onChange={e => setFormData({ ...formData, supervisionFeePercent: Number(e.target.value) })}
                    className="w-full accent-cyan-400"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>2%</span>
                    <span>4% (average)</span>
                    <span>8%</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Architect & Structural Design ({formData.architectFeePercent}%)
                  </label>
                  <input
                    type="range"
                    min={2}
                    max={8}
                    step={0.5}
                    value={formData.architectFeePercent}
                    onChange={e => setFormData({ ...formData, architectFeePercent: Number(e.target.value) })}
                    className="w-full accent-cyan-400"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>2%</span>
                    <span>4.5% (full set)</span>
                    <span>8%</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/70">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              className="px-5 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors cursor-pointer shadow-md shadow-cyan-950"
            >
              Recalculate BOQ & Blueprint
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

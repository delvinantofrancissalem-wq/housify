import React, { useState, useRef } from 'react';
import { 
  Maximize2, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Layers, 
  Eye, 
  EyeOff, 
  Download, 
  Copy, 
  Check, 
  Compass, 
  Wind, 
  Sun, 
  FileCode2, 
  Grid3X3,
  Columns,
  Footprints
} from 'lucide-react';
import { ArchitecturalFloorPlan, RoomLayoutBox, BlueprintTheme } from '../types';

interface ArchitecturalPlanSectionProps {
  plan: ArchitecturalFloorPlan;
  unitSystem: 'sqft' | 'sqm';
}

export const ArchitecturalPlanSection: React.FC<ArchitecturalPlanSectionProps> = ({ plan, unitSystem }) => {
  const [theme, setTheme] = useState<BlueprintTheme>('blueprint-dark');
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  
  // Layer visibility toggles
  const [showColumns, setShowColumns] = useState<boolean>(true);
  const [showDoorsWindows, setShowDoorsWindows] = useState<boolean>(true);
  const [showFurniture, setShowFurniture] = useState<boolean>(true);
  const [showDimensions, setShowDimensions] = useState<boolean>(true);
  const [showCirculation, setShowCirculation] = useState<boolean>(true);
  const [showGrid, setShowGrid] = useState<boolean>(true);

  // Tab between Interactive CAD Blueprint and ASCII Plan
  const [viewMode, setViewMode] = useState<'svg' | 'ascii'>('svg');
  const [copiedAscii, setCopiedAscii] = useState<boolean>(false);

  const svgRef = useRef<SVGSVGElement | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleCopyAscii = () => {
    navigator.clipboard.writeText(plan.asciiDiagram);
    setCopiedAscii(true);
    setTimeout(() => setCopiedAscii(false), 2000);
  };

  const handleDownloadSVG = () => {
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Architectural_Floor_Plan_${plan.houseWidth}x${plan.houseDepth}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Blueprint SVG dimensions and scaling
  const scale = 14; // pixels per foot
  const svgWidth = (plan.plotWidth + 10) * scale;
  const svgHeight = (plan.plotDepth + 12) * scale;
  const houseOriginX = (plan.setbacks.left + 5) * scale;
  const houseOriginY = (plan.setbacks.front + 5) * scale;

  return (
    <section id="section-floor-plan" className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/60">
              SECTION 01
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Architectural Floor Plan & Layout Specification
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Standard residential zoning, solar-optimized orientation, passive cross-ventilation, and 2D CAD scale layout.
          </p>
        </div>

        {/* View mode & theme controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="inline-flex rounded-lg p-1 bg-slate-950 border border-slate-800">
            <button
              onClick={() => setViewMode('svg')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                viewMode === 'svg' ? 'bg-cyan-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Interactive CAD SVG
            </button>
            <button
              onClick={() => setViewMode('ascii')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'ascii' ? 'bg-cyan-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileCode2 className="w-3.5 h-3.5" />
              ASCII Grid Plan
            </button>
          </div>

          {viewMode === 'svg' && (
            <div className="inline-flex rounded-lg p-1 bg-slate-950 border border-slate-800">
              <button
                onClick={() => setTheme('blueprint-dark')}
                className={`px-2.5 py-1 text-xs font-medium rounded cursor-pointer ${
                  theme === 'blueprint-dark' ? 'bg-slate-800 text-cyan-300' : 'text-slate-400 hover:text-white'
                }`}
                title="CAD Blueprint Dark"
              >
                Blueprint Dark
              </button>
              <button
                onClick={() => setTheme('drafting-light')}
                className={`px-2.5 py-1 text-xs font-medium rounded cursor-pointer ${
                  theme === 'drafting-light' ? 'bg-slate-800 text-cyan-300' : 'text-slate-400 hover:text-white'
                }`}
                title="Architectural Drafting Light"
              >
                Drafting Light
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main View Area */}
      {viewMode === 'svg' ? (
        <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950 flex flex-col shadow-xl">
          {/* CAD Toolbar */}
          <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between gap-3 flex-wrap">
            {/* Layer Toggles */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-mono text-slate-400 mr-1 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                Layers:
              </span>
              <button
                onClick={() => setShowColumns(!showColumns)}
                className={`px-2 py-1 text-[11px] rounded border transition-colors cursor-pointer ${
                  showColumns ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' : 'bg-slate-950 text-slate-500 border-slate-800'
                }`}
              >
                Columns (RCC)
              </button>
              <button
                onClick={() => setShowDoorsWindows(!showDoorsWindows)}
                className={`px-2 py-1 text-[11px] rounded border transition-colors cursor-pointer ${
                  showDoorsWindows ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' : 'bg-slate-950 text-slate-500 border-slate-800'
                }`}
              >
                Doors & Windows [D/W]
              </button>
              <button
                onClick={() => setShowFurniture(!showFurniture)}
                className={`px-2 py-1 text-[11px] rounded border transition-colors cursor-pointer ${
                  showFurniture ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' : 'bg-slate-950 text-slate-500 border-slate-800'
                }`}
              >
                Furniture
              </button>
              <button
                onClick={() => setShowCirculation(!showCirculation)}
                className={`px-2 py-1 text-[11px] rounded border transition-colors cursor-pointer ${
                  showCirculation ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' : 'bg-slate-950 text-slate-500 border-slate-800'
                }`}
              >
                Circulation Flow
              </button>
              <button
                onClick={() => setShowDimensions(!showDimensions)}
                className={`px-2 py-1 text-[11px] rounded border transition-colors cursor-pointer ${
                  showDimensions ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' : 'bg-slate-950 text-slate-500 border-slate-800'
                }`}
              >
                Dimensions
              </button>
              <button
                onClick={() => setShowGrid(!showGrid)}
                className={`px-2 py-1 text-[11px] rounded border transition-colors cursor-pointer ${
                  showGrid ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' : 'bg-slate-950 text-slate-500 border-slate-800'
                }`}
              >
                Grid
              </button>
            </div>

            {/* Zoom / Pan & Export Controls */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setZoom(prev => Math.min(2.5, prev + 0.15))}
                className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded border border-slate-700 transition-colors cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoom(prev => Math.max(0.5, prev - 0.15))}
                className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded border border-slate-700 transition-colors cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleResetView}
                className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded border border-slate-700 transition-colors cursor-pointer"
                title="Reset Pan/Zoom"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-mono text-slate-400 px-1">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={handleDownloadSVG}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 transition-colors cursor-pointer ml-1"
                title="Download Scalable Vector (.SVG)"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>Export SVG</span>
              </button>
            </div>
          </div>

          {/* Interactive Canvas */}
          <div
            className={`relative w-full h-[580px] overflow-hidden select-none cursor-grab active:cursor-grabbing ${
              theme === 'blueprint-dark' ? 'bg-[#081224] blueprint-grid' : 'bg-[#f8fafc] blueprint-grid-light'
            }`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <div
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                transformOrigin: 'center center',
                transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg
                ref={svgRef}
                width={svgWidth}
                height={svgHeight}
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="drop-shadow-2xl overflow-visible"
              >
                <defs>
                  {/* Grid pattern */}
                  <pattern id="cad-grid-pattern" width={scale * 2} height={scale * 2} patternUnits="userSpaceOnUse">
                    <path
                      d={`M ${scale * 2} 0 L 0 0 0 ${scale * 2}`}
                      fill="none"
                      stroke={theme === 'blueprint-dark' ? 'rgba(56, 189, 248, 0.12)' : 'rgba(148, 163, 184, 0.25)'}
                      strokeWidth="0.8"
                    />
                  </pattern>
                  {/* Paver pattern */}
                  <pattern id="paver-pattern" width={18} height={12} patternUnits="userSpaceOnUse">
                    <rect width="18" height="12" fill={theme === 'blueprint-dark' ? '#0f243a' : '#e2e8f0'} />
                    <path d="M 0 0 L 18 0 M 0 6 L 18 6 M 0 12 L 18 12 M 9 0 L 9 6 M 0 6 L 0 12 M 18 6 L 18 12" stroke={theme === 'blueprint-dark' ? '#1e3a5f' : '#cbd5e1'} strokeWidth="1" />
                  </pattern>
                  {/* Lawn grass pattern */}
                  <pattern id="lawn-pattern" width={24} height={24} patternUnits="userSpaceOnUse">
                    <rect width="24" height="24" fill={theme === 'blueprint-dark' ? '#06281e' : '#ecfdf5'} />
                    <circle cx="6" cy="6" r="1.5" fill={theme === 'blueprint-dark' ? '#10b981' : '#34d399'} opacity="0.4" />
                    <circle cx="18" cy="18" r="1.5" fill={theme === 'blueprint-dark' ? '#10b981' : '#34d399'} opacity="0.4" />
                  </pattern>
                </defs>

                {/* Plot Boundary / Site Layout */}
                <rect
                  x={5 * scale}
                  y={5 * scale}
                  width={plan.plotWidth * scale}
                  height={plan.plotDepth * scale}
                  fill={showGrid ? 'url(#cad-grid-pattern)' : theme === 'blueprint-dark' ? '#07152a' : '#f8fafc'}
                  stroke={theme === 'blueprint-dark' ? '#38bdf8' : '#0f172a'}
                  strokeWidth="2.5"
                  strokeDasharray="8 4"
                />

                {/* Plot Dimensions string */}
                {showDimensions && (
                  <g className="font-mono text-xs">
                    {/* Top plot dimension */}
                    <line
                      x1={5 * scale}
                      y1={3 * scale}
                      x2={(plan.plotWidth + 5) * scale}
                      y2={3 * scale}
                      stroke={theme === 'blueprint-dark' ? '#38bdf8' : '#334155'}
                      strokeWidth="1.2"
                    />
                    <text
                      x={((plan.plotWidth / 2) + 5) * scale}
                      y={2.4 * scale}
                      fill={theme === 'blueprint-dark' ? '#38bdf8' : '#0f172a'}
                      textAnchor="middle"
                      fontSize="12"
                      fontWeight="bold"
                    >
                      PLOT WIDTH: {plan.plotWidth}' 0"
                    </text>
                    {/* Left plot dimension */}
                    <line
                      x1={2.5 * scale}
                      y1={5 * scale}
                      x2={2.5 * scale}
                      y2={(plan.plotDepth + 5) * scale}
                      stroke={theme === 'blueprint-dark' ? '#38bdf8' : '#334155'}
                      strokeWidth="1.2"
                    />
                    <text
                      x={1.8 * scale}
                      y={((plan.plotDepth / 2) + 5) * scale}
                      fill={theme === 'blueprint-dark' ? '#38bdf8' : '#0f172a'}
                      textAnchor="middle"
                      fontSize="12"
                      fontWeight="bold"
                      transform={`rotate(-90 ${1.8 * scale} ${((plan.plotDepth / 2) + 5) * scale})`}
                    >
                      PLOT DEPTH: {plan.plotDepth}' 0"
                    </text>
                  </g>
                )}

                {/* FRONT SETBACK & EXTERIOR ELEMENTS */}
                {/* Landscaped Front Lawn */}
                <rect
                  x={(plan.setbacks.left + 5) * scale}
                  y={5 * scale}
                  width={plan.lawn.width * scale}
                  height={plan.lawn.length * scale}
                  fill="url(#lawn-pattern)"
                  stroke={theme === 'blueprint-dark' ? '#059669' : '#10b981'}
                  strokeWidth="1.5"
                />
                <text
                  x={(plan.setbacks.left + 5 + plan.lawn.width / 2) * scale}
                  y={(5 + plan.lawn.length / 2) * scale}
                  fill={theme === 'blueprint-dark' ? '#34d399' : '#047857'}
                  textAnchor="middle"
                  fontSize="11"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  LANDSCAPED FRONT LAWN ({plan.lawn.width * plan.lawn.length} sq.ft)
                </text>

                {/* Paved Parking / Driveway Clearance */}
                <rect
                  x={(plan.driveway.x + 5) * scale}
                  y={5 * scale}
                  width={plan.driveway.width * scale}
                  height={plan.driveway.length * scale}
                  fill="url(#paver-pattern)"
                  stroke={theme === 'blueprint-dark' ? '#0284c7' : '#0369a1'}
                  strokeWidth="1.5"
                />
                <text
                  x={(plan.driveway.x + 5 + plan.driveway.width / 2) * scale}
                  y={(5 + plan.driveway.length / 2 - 1) * scale}
                  fill={theme === 'blueprint-dark' ? '#7dd3fc' : '#0369a1'}
                  textAnchor="middle"
                  fontSize="11"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  CARPORT / DRIVEWAY
                </text>
                <text
                  x={(plan.driveway.x + 5 + plan.driveway.width / 2) * scale}
                  y={(5 + plan.driveway.length / 2 + 1.2) * scale}
                  fill={theme === 'blueprint-dark' ? '#94a3b8' : '#64748b'}
                  textAnchor="middle"
                  fontSize="9.5"
                  fontFamily="monospace"
                >
                  {plan.driveway.width}' 0" CLEARANCE [PAVERS]
                </text>

                {/* Main Entrance Sliding Gate */}
                <line
                  x1={(plan.mainGate.x + 5) * scale}
                  y1={5 * scale}
                  x2={(plan.mainGate.x + 5 + plan.mainGate.width) * scale}
                  y2={5 * scale}
                  stroke="#f59e0b"
                  strokeWidth="4"
                />
                <text
                  x={(plan.mainGate.x + 5 + plan.mainGate.width / 2) * scale}
                  y={4.2 * scale}
                  fill="#f59e0b"
                  textAnchor="middle"
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  [MAIN ENTRANCE GATE 14' 0"]
                </text>

                {/* HOUSE BUILDING FOOTPRINT */}
                <g id="house-floor-plan">
                  {/* Outer Main Structural Slab & Walls */}
                  <rect
                    x={houseOriginX}
                    y={houseOriginY}
                    width={plan.houseWidth * scale}
                    height={plan.houseDepth * scale}
                    fill={theme === 'blueprint-dark' ? '#0c1b33' : '#ffffff'}
                    stroke={theme === 'blueprint-dark' ? '#e2e8f0' : '#0f172a'}
                    strokeWidth="3.5"
                  />

                  {/* ROOM ZONES */}
                  {plan.rooms.map((room) => {
                    const rx = houseOriginX + room.x * scale;
                    const ry = houseOriginY + room.y * scale;
                    const rw = room.width * scale;
                    const rl = room.length * scale;

                    return (
                      <g key={room.id} id={`room-${room.id}`}>
                        {/* Room boundary walls */}
                        <rect
                          x={rx}
                          y={ry}
                          width={rw}
                          height={rl}
                          fill={
                            theme === 'blueprint-dark'
                              ? room.type === 'porch'
                                ? 'rgba(56, 189, 248, 0.04)'
                                : 'rgba(30, 58, 138, 0.16)'
                              : room.type === 'porch'
                                ? 'rgba(241, 245, 249, 0.8)'
                                : 'rgba(255, 255, 255, 1)'
                          }
                          stroke={theme === 'blueprint-dark' ? '#60a5fa' : '#334155'}
                          strokeWidth="2.2"
                        />

                        {/* Room Label & Dimensions */}
                        <text
                          x={rx + rw / 2}
                          y={ry + rl / 2 - 8}
                          fill={theme === 'blueprint-dark' ? '#ffffff' : '#0f172a'}
                          textAnchor="middle"
                          fontSize="12.5"
                          fontWeight="700"
                          fontFamily="sans-serif"
                          letterSpacing="0.02em"
                        >
                          {room.name.toUpperCase()}
                        </text>
                        <text
                          x={rx + rw / 2}
                          y={ry + rl / 2 + 10}
                          fill={theme === 'blueprint-dark' ? '#38bdf8' : '#0284c7'}
                          textAnchor="middle"
                          fontSize="11"
                          fontFamily="monospace"
                          fontWeight="600"
                        >
                          {room.width}'0" × {room.length}'0" ({room.areaSqFt} sq.ft)
                        </text>

                        {/* Furniture layout */}
                        {showFurniture &&
                          room.furniture.map((item, fIdx) => (
                            <rect
                              key={fIdx}
                              x={rx + item.x * scale - (item.width * scale) / 2}
                              y={ry + item.y * scale - (item.height * scale) / 2}
                              width={item.width * scale}
                              height={item.height * scale}
                              rx={4}
                              fill={theme === 'blueprint-dark' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(203, 213, 225, 0.6)'}
                              stroke={theme === 'blueprint-dark' ? '#0ea5e9' : '#64748b'}
                              strokeWidth="1"
                              strokeDasharray="3 2"
                            />
                          ))}

                        {/* Circulation directional arrow */}
                        {showCirculation && room.circulationArrow && (
                          <g opacity="0.8">
                            <line
                              x1={rx + room.circulationArrow.fromX * scale}
                              y1={ry + room.circulationArrow.fromY * scale}
                              x2={rx + room.circulationArrow.toX * scale}
                              y2={ry + room.circulationArrow.toY * scale}
                              stroke="#eab308"
                              strokeWidth="1.5"
                              strokeDasharray="4 3"
                            />
                            <circle
                              cx={rx + room.circulationArrow.toX * scale}
                              cy={ry + room.circulationArrow.toY * scale}
                              r={3}
                              fill="#eab308"
                            />
                          </g>
                        )}

                        {/* Doors [D] with swing arc */}
                        {showDoorsWindows &&
                          room.doors.map((d) => {
                            let dx = rx + d.position * rw;
                            let dy = ry;
                            if (d.wall === 'bottom') dy = ry + rl;
                            if (d.wall === 'left') {
                              dx = rx;
                              dy = ry + d.position * rl;
                            }
                            if (d.wall === 'right') {
                              dx = rx + rw;
                              dy = ry + d.position * rl;
                            }

                            return (
                              <g key={d.id} id={`door-${d.id}`}>
                                {/* Door symbol gap */}
                                <circle cx={dx} cy={dy} r={d.width * scale * 0.45} fill="none" stroke="#22c55e" strokeWidth="1" strokeDasharray="3 2" />
                                <line
                                  x1={dx}
                                  y1={dy}
                                  x2={dx + (d.wall === 'left' ? 12 : -12)}
                                  y2={dy + 12}
                                  stroke="#22c55e"
                                  strokeWidth="2.5"
                                />
                                <text
                                  x={dx}
                                  y={dy - 4}
                                  fill="#22c55e"
                                  fontSize="9"
                                  fontFamily="monospace"
                                  fontWeight="bold"
                                  textAnchor="middle"
                                >
                                  {d.tag}
                                </text>
                              </g>
                            );
                          })}

                        {/* Windows [W] */}
                        {showDoorsWindows &&
                          room.windows.map((w) => {
                            let wx = rx + w.position * rw;
                            let wy = ry;
                            let isHoriz = true;
                            if (w.wall === 'bottom') wy = ry + rl;
                            if (w.wall === 'left') {
                              wx = rx;
                              wy = ry + w.position * rl;
                              isHoriz = false;
                            }
                            if (w.wall === 'right') {
                              wx = rx + rw;
                              wy = ry + w.position * rl;
                              isHoriz = false;
                            }

                            const wSpan = (w.width * scale) / 2;

                            return (
                              <g key={w.id} id={`win-${w.id}`}>
                                <line
                                  x1={isHoriz ? wx - wSpan : wx - 3}
                                  y1={isHoriz ? wy - 3 : wy - wSpan}
                                  x2={isHoriz ? wx + wSpan : wx - 3}
                                  y2={isHoriz ? wy - 3 : wy + wSpan}
                                  stroke="#38bdf8"
                                  strokeWidth="3"
                                />
                                <line
                                  x1={isHoriz ? wx - wSpan : wx + 3}
                                  y1={isHoriz ? wy + 3 : wy - wSpan}
                                  x2={isHoriz ? wx + wSpan : wx + 3}
                                  y2={isHoriz ? wy + 3 : wy + wSpan}
                                  stroke="#38bdf8"
                                  strokeWidth="3"
                                />
                                <text
                                  x={wx}
                                  y={wy + 12}
                                  fill="#38bdf8"
                                  fontSize="8.5"
                                  fontFamily="monospace"
                                  fontWeight="bold"
                                  textAnchor="middle"
                                >
                                  {w.tag} ({w.width}')
                                </text>
                              </g>
                            );
                          })}

                        {/* Structural RCC Columns */}
                        {showColumns &&
                          room.columns.map((col, cIdx) => (
                            <g key={cIdx}>
                              <rect
                                x={rx + col.x * scale - 6}
                                y={ry + col.y * scale - 6}
                                width={12}
                                height={12}
                                fill="#ef4444"
                                stroke="#ffffff"
                                strokeWidth="1"
                              />
                              <line
                                x1={rx + col.x * scale - 6}
                                y1={ry + col.y * scale - 6}
                                x2={rx + col.x * scale + 6}
                                y2={ry + col.y * scale + 6}
                                stroke="#ffffff"
                                strokeWidth="0.8"
                              />
                            </g>
                          ))}
                      </g>
                    );
                  })}
                </g>

                {/* North Arrow / Orientation Compass */}
                <g transform={`translate(${svgWidth - 70}, 60)`}>
                  <circle cx="0" cy="0" r="22" fill={theme === 'blueprint-dark' ? '#0b1d3a' : '#ffffff'} stroke={theme === 'blueprint-dark' ? '#38bdf8' : '#0f172a'} strokeWidth="1.5" />
                  <polygon points="0,-18 5,0 0,-4 -5,0" fill="#ef4444" />
                  <polygon points="0,18 5,0 0,4 -5,0" fill={theme === 'blueprint-dark' ? '#94a3b8' : '#475569'} />
                  <text x="0" y="-23" fill="#ef4444" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                    N
                  </text>
                  <text x="0" y="32" fill={theme === 'blueprint-dark' ? '#94a3b8' : '#64748b'} fontSize="8" textAnchor="middle" fontFamily="sans-serif">
                    ENTRY
                  </text>
                </g>
              </svg>
            </div>
          </div>

          {/* Blueprint Footer Bar */}
          <div className="px-4 py-2 bg-slate-900 border-t border-slate-800 text-[11px] text-slate-400 font-mono flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-4">
              <span>Building Footprint: {plan.houseWidth}'0" × {plan.houseDepth}'0"</span>
              <span>·</span>
              <span>Setbacks: Front {plan.setbacks.front}' · Rear {plan.setbacks.rear}' · Sides {plan.setbacks.left}'</span>
              <span>·</span>
              <span className="text-cyan-400 font-semibold">Carpet Area: {plan.totalCarpetSqFt.toLocaleString()} sq.ft (78% Efficiency)</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <span className="w-2.5 h-2.5 rounded-sm bg-red-500 inline-block"></span> Column (9"x12" RCC)
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block ml-2"></span> Door [D]
              <span className="w-2.5 h-2.5 rounded-sm bg-cyan-400 inline-block ml-2"></span> Window [W]
            </div>
          </div>
        </div>
      ) : (
        /* Clean Formatted ASCII Diagram Viewer */
        <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950 p-4 shadow-xl">
          <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <FileCode2 className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                Labeled 2D ASCII Grid Floor Plan
              </span>
            </div>
            <button
              onClick={handleCopyAscii}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors cursor-pointer"
            >
              {copiedAscii ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Copy ASCII Diagram</span>
                </>
              )}
            </button>
          </div>
          <pre className="font-mono text-xs text-cyan-300 bg-slate-900/90 p-4 rounded-xl overflow-x-auto leading-relaxed border border-slate-800/80">
            {plan.asciiDiagram}
          </pre>
        </div>
      )}

      {/* Recommended Room Zoning & Dimensions Specification Table */}
      <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-900/60 shadow-lg">
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/50 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Compass className="w-4 h-4 text-cyan-400" />
              Room Zoning, Dimensions & Ventilation Specifications
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Architectural dimension standards, recommended ceiling heights, and solar daylighting design
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {plan.rooms.length} Architectural Zones
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/70 text-slate-400 font-mono border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 font-semibold">Zone / Room</th>
                <th className="py-3 px-4 font-semibold text-right">Dimensions (L × W × H)</th>
                <th className="py-3 px-4 font-semibold text-right">Floor Area</th>
                <th className="py-3 px-4 font-semibold">Solar Daylighting & Orientation</th>
                <th className="py-3 px-4 font-semibold">Natural Cross-Ventilation Strategy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {plan.rooms.map((room) => (
                <tr key={room.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-semibold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0"></span>
                    {room.name}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-cyan-300 tabular-nums">
                    {room.width}'0" × {room.length}'0" × {room.height}'0"
                  </td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-200">
                    {room.areaSqFt} sq.ft
                    <span className="text-slate-500 text-[11px] block">
                      ({Math.round(room.areaSqFt / 10.764)} m²)
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <Sun className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{room.orientation}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <Wind className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                      <span>{room.ventilationDetail}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

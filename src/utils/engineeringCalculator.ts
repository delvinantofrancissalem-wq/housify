import { Currency, QualityTier, HouseSpecs, BOQItem, LaborItem, BOQSummary, ValueEngineeringTip } from '../types';

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: '$',
  INR: '₹',
  EUR: '€',
  GBP: '£',
  CAD: 'C$',
  AUD: 'A$',
};

export const CURRENCY_CONVERSION_BASE_USD: Record<Currency, number> = {
  USD: 1.0,
  INR: 87.0, // calibrated local purchasing power parity and construction index
  EUR: 0.92,
  GBP: 0.78,
  CAD: 1.36,
  AUD: 1.52,
};

// Base unit rates per currency and quality tier
// In real civil construction, rates vary with location, but these provide realistic, calibrated industry baselines
interface MaterialRateCard {
  cementPerBag: number;
  steelPerKg: number;
  sandPerCuFt: number;
  aggregatePerCuFt: number;
  bricksPerPiece: number;
  concretePerCuM: number;
  flooringPerSqFt: number;
  doorMainEach: number;
  doorRoomEach: number;
  doorBathEach: number;
  windowsPerSqFt: number;
  paintPuttyPerSqFt: number;
  plumbingPerBath: number;
  electricalPerSqFt: number;
  modularKitchenPerRft: number;
  wardrobePerRft: number;
  paverPerSqFt: number;
  lawnTurfPerSqFt: number;
  compoundWallPerRft: number;
  entranceGateTotal: number;
}

interface LaborRateCard {
  civilLaborPerSqFt: number;
  shutteringBarBendingPerSqFt: number;
  mepLaborPerSqFt: number;
  tilingLaborPerSqFt: number;
  paintingLaborPerSqFt: number;
  municipalPermitsBase: number;
}

const BASE_MATERIAL_RATES_USD: Record<QualityTier, MaterialRateCard> = {
  economy: {
    cementPerBag: 9.50,
    steelPerKg: 0.95,
    sandPerCuFt: 1.40,
    aggregatePerCuFt: 1.50,
    bricksPerPiece: 1.20,
    concretePerCuM: 135.0,
    flooringPerSqFt: 3.80,
    doorMainEach: 420.0,
    doorRoomEach: 180.0,
    doorBathEach: 120.0,
    windowsPerSqFt: 22.0,
    paintPuttyPerSqFt: 0.85,
    plumbingPerBath: 850.0,
    electricalPerSqFt: 3.50,
    modularKitchenPerRft: 140.0,
    wardrobePerRft: 110.0,
    paverPerSqFt: 4.50,
    lawnTurfPerSqFt: 1.80,
    compoundWallPerRft: 45.0,
    entranceGateTotal: 950.0,
  },
  standard: {
    cementPerBag: 12.00,
    steelPerKg: 1.15,
    sandPerCuFt: 1.80,
    aggregatePerCuFt: 1.95,
    bricksPerPiece: 1.80,
    concretePerCuM: 165.0,
    flooringPerSqFt: 6.80,
    doorMainEach: 850.0,
    doorRoomEach: 320.0,
    doorBathEach: 210.0,
    windowsPerSqFt: 38.0,
    paintPuttyPerSqFt: 1.45,
    plumbingPerBath: 1450.0,
    electricalPerSqFt: 5.80,
    modularKitchenPerRft: 260.0,
    wardrobePerRft: 195.0,
    paverPerSqFt: 7.20,
    lawnTurfPerSqFt: 2.80,
    compoundWallPerRft: 75.0,
    entranceGateTotal: 1850.0,
  },
  luxury: {
    cementPerBag: 15.50,
    steelPerKg: 1.40,
    sandPerCuFt: 2.40,
    aggregatePerCuFt: 2.60,
    bricksPerPiece: 2.80,
    concretePerCuM: 210.0,
    flooringPerSqFt: 14.50,
    doorMainEach: 2200.0,
    doorRoomEach: 650.0,
    doorBathEach: 420.0,
    windowsPerSqFt: 75.0,
    paintPuttyPerSqFt: 2.60,
    plumbingPerBath: 2900.0,
    electricalPerSqFt: 9.50,
    modularKitchenPerRft: 480.0,
    wardrobePerRft: 360.0,
    paverPerSqFt: 12.50,
    lawnTurfPerSqFt: 4.80,
    compoundWallPerRft: 125.0,
    entranceGateTotal: 4200.0,
  },
};

const BASE_MATERIAL_RATES_INR: Record<QualityTier, MaterialRateCard> = {
  economy: {
    cementPerBag: 370.0,
    steelPerKg: 64.0,
    sandPerCuFt: 52.0,
    aggregatePerCuFt: 38.0,
    bricksPerPiece: 8.50,
    concretePerCuM: 4100.0,
    flooringPerSqFt: 48.0,
    doorMainEach: 14500.0,
    doorRoomEach: 5800.0,
    doorBathEach: 3600.0,
    windowsPerSqFt: 380.0,
    paintPuttyPerSqFt: 22.0,
    plumbingPerBath: 22000.0,
    electricalPerSqFt: 85.0,
    modularKitchenPerRft: 1800.0,
    wardrobePerRft: 1400.0,
    paverPerSqFt: 48.0,
    lawnTurfPerSqFt: 25.0,
    compoundWallPerRft: 1100.0,
    entranceGateTotal: 28000.0,
  },
  standard: {
    cementPerBag: 420.0,
    steelPerKg: 72.0,
    sandPerCuFt: 65.0,
    aggregatePerCuFt: 46.0,
    bricksPerPiece: 11.50,
    concretePerCuM: 4800.0,
    flooringPerSqFt: 85.0,
    doorMainEach: 32000.0,
    doorRoomEach: 11000.0,
    doorBathEach: 6500.0,
    windowsPerSqFt: 580.0,
    paintPuttyPerSqFt: 36.0,
    plumbingPerBath: 38000.0,
    electricalPerSqFt: 135.0,
    modularKitchenPerRft: 3200.0,
    wardrobePerRft: 2400.0,
    paverPerSqFt: 75.0,
    lawnTurfPerSqFt: 42.0,
    compoundWallPerRft: 1800.0,
    entranceGateTotal: 55000.0,
  },
  luxury: {
    cementPerBag: 480.0,
    steelPerKg: 84.0,
    sandPerCuFt: 82.0,
    aggregatePerCuFt: 58.0,
    bricksPerPiece: 16.00,
    concretePerCuM: 5800.0,
    flooringPerSqFt: 195.0,
    doorMainEach: 75000.0,
    doorRoomEach: 24000.0,
    doorBathEach: 14000.0,
    windowsPerSqFt: 980.0,
    paintPuttyPerSqFt: 65.0,
    plumbingPerBath: 78000.0,
    electricalPerSqFt: 220.0,
    modularKitchenPerRft: 6500.0,
    wardrobePerRft: 4500.0,
    paverPerSqFt: 135.0,
    lawnTurfPerSqFt: 75.0,
    compoundWallPerRft: 2900.0,
    entranceGateTotal: 125000.0,
  },
};

const BASE_LABOR_RATES_USD: Record<QualityTier, LaborRateCard> = {
  economy: {
    civilLaborPerSqFt: 28.0,
    shutteringBarBendingPerSqFt: 12.0,
    mepLaborPerSqFt: 10.5,
    tilingLaborPerSqFt: 4.5,
    paintingLaborPerSqFt: 3.2,
    municipalPermitsBase: 2200.0,
  },
  standard: {
    civilLaborPerSqFt: 38.0,
    shutteringBarBendingPerSqFt: 16.5,
    mepLaborPerSqFt: 15.0,
    tilingLaborPerSqFt: 6.8,
    paintingLaborPerSqFt: 4.8,
    municipalPermitsBase: 3500.0,
  },
  luxury: {
    civilLaborPerSqFt: 55.0,
    shutteringBarBendingPerSqFt: 24.0,
    mepLaborPerSqFt: 22.0,
    tilingLaborPerSqFt: 11.5,
    paintingLaborPerSqFt: 7.5,
    municipalPermitsBase: 5800.0,
  },
};

const BASE_LABOR_RATES_INR: Record<QualityTier, LaborRateCard> = {
  economy: {
    civilLaborPerSqFt: 260.0,
    shutteringBarBendingPerSqFt: 110.0,
    mepLaborPerSqFt: 95.0,
    tilingLaborPerSqFt: 38.0,
    paintingLaborPerSqFt: 28.0,
    municipalPermitsBase: 35000.0,
  },
  standard: {
    civilLaborPerSqFt: 340.0,
    shutteringBarBendingPerSqFt: 145.0,
    mepLaborPerSqFt: 135.0,
    tilingLaborPerSqFt: 55.0,
    paintingLaborPerSqFt: 42.0,
    municipalPermitsBase: 55000.0,
  },
  luxury: {
    civilLaborPerSqFt: 480.0,
    shutteringBarBendingPerSqFt: 210.0,
    mepLaborPerSqFt: 195.0,
    tilingLaborPerSqFt: 95.0,
    paintingLaborPerSqFt: 68.0,
    municipalPermitsBase: 95000.0,
  },
};

export function getRateCards(currency: Currency, tier: QualityTier): { materials: MaterialRateCard; labor: LaborRateCard } {
  if (currency === 'INR') {
    return {
      materials: BASE_MATERIAL_RATES_INR[tier],
      labor: BASE_LABOR_RATES_INR[tier],
    };
  }

  // Scale from USD base with currency ratio
  const ratio = CURRENCY_CONVERSION_BASE_USD[currency] || 1.0;
  const baseMat = BASE_MATERIAL_RATES_USD[tier];
  const baseLab = BASE_LABOR_RATES_USD[tier];

  const scaledMat: MaterialRateCard = {
    cementPerBag: Math.round(baseMat.cementPerBag * ratio * 100) / 100,
    steelPerKg: Math.round(baseMat.steelPerKg * ratio * 100) / 100,
    sandPerCuFt: Math.round(baseMat.sandPerCuFt * ratio * 100) / 100,
    aggregatePerCuFt: Math.round(baseMat.aggregatePerCuFt * ratio * 100) / 100,
    bricksPerPiece: Math.round(baseMat.bricksPerPiece * ratio * 100) / 100,
    concretePerCuM: Math.round(baseMat.concretePerCuM * ratio),
    flooringPerSqFt: Math.round(baseMat.flooringPerSqFt * ratio * 100) / 100,
    doorMainEach: Math.round(baseMat.doorMainEach * ratio),
    doorRoomEach: Math.round(baseMat.doorRoomEach * ratio),
    doorBathEach: Math.round(baseMat.doorBathEach * ratio),
    windowsPerSqFt: Math.round(baseMat.windowsPerSqFt * ratio * 100) / 100,
    paintPuttyPerSqFt: Math.round(baseMat.paintPuttyPerSqFt * ratio * 100) / 100,
    plumbingPerBath: Math.round(baseMat.plumbingPerBath * ratio),
    electricalPerSqFt: Math.round(baseMat.electricalPerSqFt * ratio * 100) / 100,
    modularKitchenPerRft: Math.round(baseMat.modularKitchenPerRft * ratio),
    wardrobePerRft: Math.round(baseMat.wardrobePerRft * ratio),
    paverPerSqFt: Math.round(baseMat.paverPerSqFt * ratio * 100) / 100,
    lawnTurfPerSqFt: Math.round(baseMat.lawnTurfPerSqFt * ratio * 100) / 100,
    compoundWallPerRft: Math.round(baseMat.compoundWallPerRft * ratio),
    entranceGateTotal: Math.round(baseMat.entranceGateTotal * ratio),
  };

  const scaledLab: LaborRateCard = {
    civilLaborPerSqFt: Math.round(baseLab.civilLaborPerSqFt * ratio * 10) / 10,
    shutteringBarBendingPerSqFt: Math.round(baseLab.shutteringBarBendingPerSqFt * ratio * 10) / 10,
    mepLaborPerSqFt: Math.round(baseLab.mepLaborPerSqFt * ratio * 10) / 10,
    tilingLaborPerSqFt: Math.round(baseLab.tilingLaborPerSqFt * ratio * 10) / 10,
    paintingLaborPerSqFt: Math.round(baseLab.paintingLaborPerSqFt * ratio * 10) / 10,
    municipalPermitsBase: Math.round(baseLab.municipalPermitsBase * ratio),
  };

  return { materials: scaledMat, labor: scaledLab };
}

export function formatCurrency(amount: number, currency: Currency): string {
  const symbol = CURRENCY_SYMBOLS[currency] || '$';
  if (currency === 'INR') {
    // Indian numbering format (lakhs & crores)
    return `${symbol} ${amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
  }
  return `${symbol}${amount.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}

export function formatNumber(num: number, decimals: number = 0): string {
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Calculates complete Bill of Quantities (BOQ) with civil engineering ratios
 */
export function calculateBOQ(specs: HouseSpecs, customRates?: Record<string, number>): {
  items: BOQItem[];
  laborItems: LaborItem[];
  summary: BOQSummary;
} {
  const { builtUpArea, floors, qualityTier, currency, exterior, rooms } = specs;
  const rateCards = getRateCards(currency, qualityTier);
  const matRates = rateCards.materials;
  const labRates = rateCards.labor;

  // Engineering consumption multipliers
  const cementRatio = qualityTier === 'economy' ? 0.40 : qualityTier === 'standard' ? 0.42 : 0.45; // bags/sq.ft
  const steelRatio = qualityTier === 'economy' ? 3.60 : qualityTier === 'standard' ? 4.10 : 4.65; // kg/sq.ft
  const sandRatio = 1.85; // cu.ft / sq.ft
  const aggregateRatio = 1.30; // cu.ft / sq.ft
  const bricksRatio = qualityTier === 'economy' ? 22 : 19; // bricks per sq.ft built-up area
  const concreteRatio = 0.048; // cu.m / sq.ft for footings, beams, columns, slab (RCC M20/M25)

  // Architectural quantities
  const carpetArea = Math.round(builtUpArea * 0.78);
  const flooringArea = Math.round(carpetArea * 1.10); // +10% for skirting and joint cutting wastage
  const wallSurfaceArea = Math.round(builtUpArea * 3.15); // total internal + external plastered surface area
  const totalGlazingArea = Math.round(carpetArea * 0.14); // 14% daylighting ratio standard

  // Room counts
  const bedCount = rooms.filter(r => r.type === 'master-bed' || r.type === 'bedroom').length;
  const bathCount = Math.max(1, rooms.filter(r => r.type === 'bathroom').length);
  const kitchen = rooms.find(r => r.type === 'kitchen');
  const kitchenRft = kitchen ? Math.round((kitchen.length + kitchen.width) * 0.8) : 16;
  const wardrobeRft = bedCount * 8; // 8 running feet per bedroom standard

  const items: BOQItem[] = [];

  const addItem = (
    id: string,
    category: 'structural' | 'finishing' | 'interior' | 'exterior',
    subCategory: string,
    itemCode: string,
    description: string,
    specification: string,
    quantity: number,
    uom: string,
    defaultRate: number,
    engineeringFormulaNote: string
  ) => {
    const rate = customRates && customRates[id] !== undefined ? customRates[id] : defaultRate;
    items.push({
      id,
      category,
      subCategory,
      itemCode,
      description,
      specification,
      quantity: Math.round(quantity * 100) / 100,
      uom,
      unitRate: rate,
      totalCost: Math.round(quantity * rate),
      engineeringFormulaNote,
      userEditedRate: customRates && customRates[id] !== undefined ? rate : undefined,
    });
  };

  // 1. STRUCTURAL & CIVIL MATERIALS
  const cementBags = Math.round(builtUpArea * cementRatio);
  addItem(
    'mat-cement',
    'structural',
    'Cementitious Binders',
    'CIV-01',
    'Portland Pozzolana / OPC 53 Grade Cement',
    `High-strength structural cement for RCC footings, columns, grade beams, slab & 1:5 masonry mortar (${qualityTier.toUpperCase()} Grade)`,
    cementBags,
    'Bags (50kg)',
    matRates.cementPerBag,
    `Empirical consumption: ${cementRatio} bags/sq.ft × ${builtUpArea} sq.ft`
  );

  const steelKg = Math.round(builtUpArea * steelRatio);
  const steelTons = Math.round((steelKg / 1000) * 100) / 100;
  addItem(
    'mat-steel',
    'structural',
    'Reinforcement',
    'CIV-02',
    'Thermo-Mechanically Treated (TMT) Rebar Steel',
    `Fe500D / Fe550D anti-corrosive high-ductility rebar (8mm, 10mm, 12mm, 16mm & 20mm dia with binding wire)`,
    steelKg,
    'Kilograms',
    matRates.steelPerKg,
    `Structural steel consumption: ${steelRatio} kg/sq.ft (${steelTons} Metric Tons)`
  );

  const sandCuFt = Math.round(builtUpArea * sandRatio);
  addItem(
    'mat-sand',
    'structural',
    'Aggregates',
    'CIV-03',
    'River Sand / Engineered Fine Aggregate (M-Sand)',
    `Washed, silt-free graded sand Zone II for RCC structural mix, bricklaying, and smooth plastering`,
    sandCuFt,
    'Cubic Feet',
    matRates.sandPerCuFt,
    `Fine aggregate rule: ${sandRatio} cu.ft/sq.ft × ${builtUpArea} sq.ft`
  );

  const aggCuFt = Math.round(builtUpArea * aggregateRatio);
  addItem(
    'mat-aggregate',
    'structural',
    'Aggregates',
    'CIV-04',
    'Coarse Aggregate / Crushed Blue Granite Metal',
    `20mm & 10mm down angular graded aggregate for high compressive strength concrete casting`,
    aggCuFt,
    'Cubic Feet',
    matRates.aggregatePerCuFt,
    `Coarse aggregate rule: ${aggregateRatio} cu.ft/sq.ft × ${builtUpArea} sq.ft`
  );

  const brickQty = Math.round(builtUpArea * bricksRatio);
  const brickType = qualityTier === 'luxury' ? 'Precision AAC Autoclaved Blocks' : 'Class-I Wire-Cut Red Clay Bricks';
  addItem(
    'mat-bricks',
    'structural',
    'Masonry',
    'CIV-05',
    brickType,
    `Load-bearing 9" external perimeter walls and 4.5" interior privacy partitions with 1:6 cement mortar`,
    brickQty,
    'Pieces',
    matRates.bricksPerPiece,
    `Masonry density: ~${bricksRatio} pcs/sq.ft for 9" external & 4.5" partition layout`
  );

  const concreteVolumeCuM = Math.round(builtUpArea * concreteRatio * 10) / 10;
  addItem(
    'mat-concrete',
    'structural',
    'Concrete Pour',
    'CIV-06',
    'Design-Mix Structural Concrete (M20 / M25)',
    `Monolithic foundation raft/isolated footings, plinth tie-beams, lintels & 5" roof slab with waterproofing admixture`,
    concreteVolumeCuM,
    'Cubic Meters',
    matRates.concretePerCuM,
    `Structural concrete volume: ~${concreteRatio} cu.m per sq.ft built-up area`
  );

  // 2. FINISHING & ARCHITECTURAL COMPONENTS
  const floorType = qualityTier === 'luxury' 
    ? 'Large Format Italian Glazed Vitrified Tiles (1200x1800mm) / Engineered Hardwood' 
    : qualityTier === 'standard' 
      ? 'Double Charged Vitrified Porcelain Tiles (1200x600mm) with Epoxy Grout' 
      : 'Anti-Skid Premium Ceramic Floor Tiles (600x600mm)';
  addItem(
    'fin-flooring',
    'finishing',
    'Surfacing',
    'FIN-01',
    floorType,
    `Living, dining, bedrooms and corridors including 4" matching wall skirting, underlayment adhesive and spacers`,
    flooringArea,
    'Sq. Feet',
    matRates.flooringPerSqFt,
    `Carpet area (${carpetArea} sq.ft) + 10% wastage & skirting clearance`
  );

  addItem(
    'fin-door-main',
    'finishing',
    'Joinery & Openings',
    'FIN-02',
    'Grand Main Entrance Door Unit',
    `Solid Seasoned Teak / Heavy Engineered Hardwood Frame (7'x3'6") with Smart Digital Mortise Lock, brass tower bolts & brass hinges`,
    1,
    'Unit',
    matRates.doorMainEach,
    'Primary architectural entrance foyer'
  );

  const roomDoorsCount = Math.max(2, bedCount + (rooms.some(r => r.type === 'kitchen') ? 1 : 0) + 1);
  addItem(
    'fin-door-rooms',
    'finishing',
    'Joinery & Openings',
    'FIN-03',
    'Internal Flush Room Doors with Hardwood Laminate',
    `Factory-pressed solid core 32mm flush doors with European veneer/laminate finish, tubular levers, and magnetic door stoppers`,
    roomDoorsCount,
    'Units',
    matRates.doorRoomEach,
    `All bedrooms and private study zones (${roomDoorsCount} doors)`
  );

  addItem(
    'fin-door-bath',
    'finishing',
    'Joinery & Openings',
    'FIN-04',
    'Waterproof WPC / PVC Bathroom & Utility Doors',
    `Rot-proof polymer doors with cylindrical locks, moisture seals, and stainless steel hardware`,
    bathCount + 1,
    'Units',
    matRates.doorBathEach,
    `Restrooms and utility wash yard access (${bathCount + 1} doors)`
  );

  const windowSystem = qualityTier === 'luxury'
    ? 'Thermally Broken Heavy Aluminum 3-Track Sliding/Casement Windows with 6mm Toughened Low-E Glass & SS Mosquito Mesh'
    : 'Multi-Chambered UPVC Casement Windows with 5mm Annealed Clear Float Glass & EPDM Gasket Seals';
  addItem(
    'fin-windows',
    'finishing',
    'Glazing',
    'FIN-05',
    windowSystem,
    `Double-track and 3-track sliding window assemblies with sub-frames, hardware fasteners, and structural silicone caulking`,
    totalGlazingArea,
    'Sq. Feet',
    matRates.windowsPerSqFt,
    `14% daylighting & natural ventilation standard (${totalGlazingArea} sq.ft glazing)`
  );

  addItem(
    'fin-paint-putty',
    'finishing',
    'Wall Finishes',
    'FIN-06',
    'Interior & Exterior Wall Putty, Primer & Emulsion Paint',
    `2 coats polymer acrylic wall putty, 1 coat anti-fungal primer, 2 coats premium washable acrylic emulsion (interior) and weathercoat elastomeric paint (exterior)`,
    wallSurfaceArea,
    'Sq. Feet',
    matRates.paintPuttyPerSqFt,
    `Total wall surface: 3.15 × built-up area (${wallSurfaceArea} sq.ft coverage)`
  );

  addItem(
    'fin-plumbing',
    'finishing',
    'Sanitary & MEP',
    'FIN-07',
    'Complete Bathroom Plumbing Stacks & Sanitary Fixtures',
    `CPVC SDR-11 water supply pipes, PVC SWR drainage lines, wall-hung EWC with concealed cistern, diverters, health faucet & washbasin vanity`,
    bathCount,
    'Sets',
    matRates.plumbingPerBath,
    `Full MEP fixtures for ${bathCount} bathroom wet-wall suites`
  );

  addItem(
    'fin-electrical',
    'finishing',
    'Electrical MEP',
    'FIN-08',
    'Electrical Wiring, Heavy Conduits, MCB Panels & LED Fixtures',
    `FR multi-strand copper cables, heavy-duty rigid PVC conduits, 8-way TPN distribution board, MCBs/ELCB shock protection, modular switches & architect LED lights`,
    builtUpArea,
    'Sq. Feet',
    matRates.electricalPerSqFt,
    `Complete concealed wiring per sq.ft built-up area`
  );

  // 3. INTERIOR & BASIC FURNISHING
  addItem(
    'int-kitchen',
    'interior',
    'Cabinetry',
    'INT-01',
    'Modular Kitchen Countertop & Base/Overhead Cabinets',
    `Polished Jet Black Granite / Quartz countertop (20mm) with bevelled nosing, BWP marine plywood carcass with acrylic/PU shutters, soft-close SS304 baskets`,
    kitchenRft,
    'Running Feet',
    matRates.modularKitchenPerRft,
    `L-shaped / parallel modular kitchen layout (${kitchenRft} R.Ft)`
  );

  addItem(
    'int-wardrobes',
    'interior',
    'Carpentry',
    'INT-02',
    'Full-Height Floor-to-Ceiling Wardrobes',
    `Commercial ply framework with textured laminate finish, hydraulic hinges, internal drawer organizers, and dress vanity mirror`,
    wardrobeRft,
    'Running Feet',
    matRates.wardrobePerRft,
    `Calculated for ${bedCount} bedrooms (${wardrobeRft} R.Ft total)`
  );

  // 4. EXTERIOR, LANDSCAPING & PARKING
  const paverArea = exterior.parkingArea || 220;
  addItem(
    'ext-pavers',
    'exterior',
    'Hardscaping',
    'EXT-01',
    'Heavy-Duty Interlocking Concrete Driveway Pavers',
    `80mm M30 grade zig-zag interlocking pavers over compacted sand bed and 100mm PCC sub-base with perimeter edge kerbs`,
    paverArea,
    'Sq. Feet',
    matRates.paverPerSqFt,
    `Driveway and parking car pad clearance (${paverArea} sq.ft)`
  );

  const lawnArea = exterior.lawnArea || 320;
  addItem(
    'ext-lawn',
    'exterior',
    'Softscaping',
    'EXT-02',
    'Landscape Lawn Turfing, Garden Topsoil & Planting',
    `Screened red loam topsoil with organic vermicompost, Bermuda/Bermuda hybrid grass turf sods, perimeter flowering shrubs and drip bubbler line`,
    lawnArea,
    'Sq. Feet',
    matRates.lawnTurfPerSqFt,
    `Front lawn and setback greenery boundary (${lawnArea} sq.ft)`
  );

  const compoundWallLength = exterior.compoundWallLength || Math.round((specs.plotWidth + specs.plotDepth) * 1.6);
  addItem(
    'ext-compound-wall',
    'exterior',
    'Boundary & Security',
    'EXT-03',
    'Masonry Boundary Wall with RCC Columns & Coping',
    `6' height masonry compound wall with RCC plinth beam, 9" stiffener columns every 10', plastering, and weathercoat paint`,
    compoundWallLength,
    'Running Feet',
    matRates.compoundWallPerRft,
    `Property perimeter compound security boundary (${compoundWallLength} R.Ft)`
  );

  addItem(
    'ext-gate',
    'exterior',
    'Boundary & Security',
    'EXT-04',
    'Main Entrance MS Designer Sliding/Swing Gate',
    `Heavy mild steel / powder-coated hollow section driveway gate (12'–14' wide) with integrated pedestrian wicket gate and heavy drop bolts`,
    1,
    'Lot',
    matRates.entranceGateTotal,
    `Main entrance access gate with lock hardware`
  );

  // 3. LABOR & CONTRACTOR BREAKDOWN
  const laborItems: LaborItem[] = [
    {
      id: 'lab-civil',
      trade: 'Civil Structural & Masonry Labor',
      description: 'Site clearance, earth excavation, foundation footing, plinth masonry, brickwork & scaffolding',
      basis: 'Per sq. ft built-up area',
      quantity: builtUpArea,
      unitRate: labRates.civilLaborPerSqFt,
      totalCost: Math.round(builtUpArea * labRates.civilLaborPerSqFt),
      note: 'Foundations, load-bearing walls and brick partitions',
    },
    {
      id: 'lab-shuttering',
      trade: 'Shuttering, Formwork & Bar-Bending Labor',
      description: 'Centering, ply shuttering erection, steel cutting, bending, rebar placement & RCC casting vibrator operations',
      basis: 'Per sq. ft built-up area',
      quantity: builtUpArea,
      unitRate: labRates.shutteringBarBendingPerSqFt,
      totalCost: Math.round(builtUpArea * labRates.shutteringBarBendingPerSqFt),
      note: 'Beams, columns, lintels and roof slabs',
    },
    {
      id: 'lab-mep',
      trade: 'MEP (Electrician & Plumber) Skilled Labor',
      description: 'Concealed wall chasing, conduit laying, wire pulling, DB terminations, CPVC piping, drainage line testing & fixture installation',
      basis: 'Per sq. ft built-up area',
      quantity: builtUpArea,
      unitRate: labRates.mepLaborPerSqFt,
      totalCost: Math.round(builtUpArea * labRates.mepLaborPerSqFt),
      note: 'Certified tradesmen for electrical & plumbing installations',
    },
    {
      id: 'lab-tiling',
      trade: 'Flooring, Tiling & Cladding Masonry',
      description: 'Sub-floor leveling bed preparation, floor tile laying with spacers, epoxy grouting, bathroom wall dado & marble polishing',
      basis: 'Per sq. ft carpet area',
      quantity: carpetArea,
      unitRate: labRates.tilingLaborPerSqFt,
      totalCost: Math.round(carpetArea * labRates.tilingLaborPerSqFt),
      note: 'Precision tile layout with zero lippage',
    },
    {
      id: 'lab-painting',
      trade: 'Plastering, Putty & Painting Labor',
      description: 'Ceiling and internal plaster sanding, 2 coats blade putty application, primer rolling, and 2 finish coats of acrylic emulsion',
      basis: 'Per sq. ft wall surface area',
      quantity: wallSurfaceArea,
      unitRate: labRates.paintingLaborPerSqFt,
      totalCost: Math.round(wallSurfaceArea * labRates.paintingLaborPerSqFt),
      note: 'Ultra-smooth surface preparation and lint-free paint rolling',
    },
  ];

  // TOTALS & OVERHEADS
  const matByCategory = {
    structural: items.filter(i => i.category === 'structural').reduce((s, i) => s + i.totalCost, 0),
    finishing: items.filter(i => i.category === 'finishing').reduce((s, i) => s + i.totalCost, 0),
    interior: items.filter(i => i.category === 'interior').reduce((s, i) => s + i.totalCost, 0),
    exterior: items.filter(i => i.category === 'exterior').reduce((s, i) => s + i.totalCost, 0),
  };

  const totalMaterialCost = matByCategory.structural + matByCategory.finishing + matByCategory.interior + matByCategory.exterior;
  const totalLaborCost = laborItems.reduce((s, i) => s + i.totalCost, 0);
  const directConstructionCost = totalMaterialCost + totalLaborCost;

  // Site supervision & architectural engineering fees
  const siteSupervisionFee = Math.round(directConstructionCost * (specs.supervisionFeePercent / 100));
  const architecturalFee = Math.round(directConstructionCost * (specs.architectFeePercent / 100));
  const permitsAndSanctions = Math.round(labRates.municipalPermitsBase + builtUpArea * (currency === 'INR' ? 12 : 0.8));
  
  // Contingency
  const contingencyAmount = Math.round(directConstructionCost * (specs.contingencyPercent / 100));
  const totalOverheadsAndPermits = siteSupervisionFee + architecturalFee + permitsAndSanctions + contingencyAmount;

  const grandTotal = directConstructionCost + totalOverheadsAndPermits;
  const costPerSqFt = Math.round((grandTotal / builtUpArea) * 100) / 100;
  const costPerSqM = Math.round((costPerSqFt * 10.764) * 100) / 100;

  // Value Engineering Tips
  const valueEngineeringTips: ValueEngineeringTip[] = [
    {
      id: 've-1',
      title: 'Autoclaved Aerated Concrete (AAC) Block Substitution',
      category: 'Structural',
      potentialSavingsPercent: 4.8,
      savingEstimate: Math.round(directConstructionCost * 0.048),
      description: 'Replace traditional red clay bricks with precision AAC blocks. AAC blocks are 60% lighter, which reduces the dead load on the foundation and column structural grid, saving up to 10-12% in structural steel rebar and 50% in jointing mortar.',
      tradeOff: 'Requires polymer thin-bed adhesive and skilled masons to prevent corner chipping.',
      engineerRecommendation: 'Highly Recommended: Shortens construction timeline by 20% and offers superior thermal insulation (reducing future HVAC energy loads).',
    },
    {
      id: 've-2',
      title: 'Structural Column Grid Rationalization & Standard Spans',
      category: 'Structural',
      potentialSavingsPercent: 5.5,
      savingEstimate: Math.round(directConstructionCost * 0.055),
      description: 'Standardize structural column spacing to consistent 12–15 ft grid bays. Avoiding long unsupported spans (>18 ft) eliminates the need for expensive post-tensioned or deep-drop cantilever beams, reducing shuttering carpentry rework and rebar congestion.',
      tradeOff: 'Requires adhering to aligned column grid across ground and upper floors.',
      engineerRecommendation: 'Standard Best Practice: Minimizes steel wastage from custom lap splices and allows reusable standard formwork ply.',
    },
    {
      id: 've-3',
      title: 'Glazed Vitrified Tiles (GVT) in lieu of Natural Marble/Granite',
      category: 'Finishes',
      potentialSavingsPercent: 6.2,
      savingEstimate: Math.round(directConstructionCost * 0.062),
      description: 'Specify large-format high-definition porcelain/GVT tiles (1200x600mm or 1200x1800mm) instead of raw Italian marble. GVT tiles arrive pre-polished, zero-porosity, and require no expensive multi-stage diamond floor polishing labor or thick mortar screed beds.',
      tradeOff: 'Tile joints exist every 4-6 feet (mitigated by using tone-matching epoxy grout).',
      engineerRecommendation: 'Smart Financial Choice: Delivers near-identical luxury aesthetic at one-third the material cost and zero post-handover staining.',
    },
  ];

  const summary: BOQSummary = {
    totalMaterialCost,
    materialByCategory: matByCategory,
    totalLaborCost,
    totalOverheadsAndPermits,
    subtotalDirectCost: directConstructionCost,
    contingencyAmount,
    architecturalFee,
    siteSupervisionFee,
    grandTotal,
    costPerSqFt,
    costPerSqM,
    engineeringRatios: {
      cementBagsPerSqFt: Math.round((cementBags / builtUpArea) * 100) / 100,
      steelKgPerSqFt: Math.round((steelKg / builtUpArea) * 100) / 100,
      sandCuFtPerSqFt: sandRatio,
      aggregateCuFtPerSqFt: aggregateRatio,
      bricksPerSqFt: bricksRatio,
      carpetToBuiltUpRatio: Math.round((carpetArea / builtUpArea) * 100),
    },
    valueEngineeringTips,
  };

  return { items, laborItems, summary };
}

export type Currency = 'USD' | 'INR' | 'EUR' | 'GBP' | 'CAD' | 'AUD';
export type QualityTier = 'economy' | 'standard' | 'luxury';
export type UnitSystem = 'sqft' | 'sqm';
export type BlueprintTheme = 'blueprint-dark' | 'drafting-light' | 'structural-cad';

export interface RoomSpec {
  id: string;
  name: string;
  type: 'living' | 'kitchen' | 'dining' | 'master-bed' | 'bedroom' | 'bathroom' | 'utility' | 'foyer' | 'balcony' | 'staircase';
  length: number; // in feet
  width: number;  // in feet
  height: number; // in feet
  attachedBath?: boolean;
  walkInCloset?: boolean;
  orientation?: string;
  ventilationNote?: string;
}

export interface ExteriorFeatures {
  lawnArea: number; // sq ft
  parkingSpaces: number; // 1 or 2 cars
  parkingArea: number; // sq ft (e.g. 180 sq ft for 1 car, 360 for 2)
  entryPorchArea: number; // sq ft
  patioBalconyArea: number; // sq ft
  compoundWallLength: number; // running feet
  entranceGateWidth: number; // feet
}

export interface HouseSpecs {
  projectName: string;
  builtUpArea: number; // sq ft
  plotWidth: number;   // feet
  plotDepth: number;   // feet
  floors: number;      // 1, 2, or 3
  qualityTier: QualityTier;
  currency: Currency;
  unitSystem: UnitSystem;
  rooms: RoomSpec[];
  exterior: ExteriorFeatures;
  contingencyPercent: number; // 5 to 10%
  supervisionFeePercent: number; // 3 to 6%
  architectFeePercent: number; // 3 to 6%
  contractorMarginPercent: number; // 8 to 15%
}

export interface BOQItem {
  id: string;
  category: 'structural' | 'finishing' | 'interior' | 'exterior';
  subCategory: string;
  itemCode: string;
  description: string;
  specification: string;
  quantity: number;
  uom: string; // Bags, Tons, Cu.Ft, Sq.Ft, Nos, R.Ft, Cu.M, Sq.M, L.S.
  unitRate: number;
  totalCost: number;
  engineeringFormulaNote: string;
  userEditedRate?: number;
}

export interface LaborItem {
  id: string;
  trade: string;
  description: string;
  basis: string; // e.g. "Per sq. ft built-up", "Lump sum", "% of structural"
  quantity: number;
  unitRate: number;
  totalCost: number;
  note: string;
}

export interface ValueEngineeringTip {
  id: string;
  title: string;
  category: 'Structural' | 'Finishes' | 'MEP & Interiors' | 'Procurement';
  potentialSavingsPercent: number;
  savingEstimate: number;
  description: string;
  tradeOff: string;
  engineerRecommendation: string;
}

export interface BOQSummary {
  totalMaterialCost: number;
  materialByCategory: {
    structural: number;
    finishing: number;
    interior: number;
    exterior: number;
  };
  totalLaborCost: number;
  totalOverheadsAndPermits: number;
  subtotalDirectCost: number;
  contingencyAmount: number;
  architecturalFee: number;
  siteSupervisionFee: number;
  grandTotal: number;
  costPerSqFt: number;
  costPerSqM: number;
  engineeringRatios: {
    cementBagsPerSqFt: number;
    steelKgPerSqFt: number;
    sandCuFtPerSqFt: number;
    aggregateCuFtPerSqFt: number;
    bricksPerSqFt: number;
    carpetToBuiltUpRatio: number;
  };
  valueEngineeringTips: ValueEngineeringTip[];
}

export interface BlueprintDoor {
  id: string;
  tag: string; // [D1], [D2], etc.
  width: number;
  wall: 'top' | 'bottom' | 'left' | 'right';
  position: number; // 0 to 1 along wall
  swing: 'inward-left' | 'inward-right';
}

export interface BlueprintWindow {
  id: string;
  tag: string; // [W1], [W2], [Vent]
  width: number;
  wall: 'top' | 'bottom' | 'left' | 'right';
  position: number;
}

export interface RoomLayoutBox {
  id: string;
  name: string;
  type: string;
  x: number; // in feet relative to house origin
  y: number;
  width: number; // in feet
  length: number; // in feet (depth)
  height: number;
  areaSqFt: number;
  colorTheme: string;
  doors: BlueprintDoor[];
  windows: BlueprintWindow[];
  columns: Array<{ x: number; y: number }>;
  furniture: Array<{ type: string; x: number; y: number; width: number; height: number; rotation?: number }>;
  circulationArrow?: { fromX: number; fromY: number; toX: number; toY: number; label: string };
  orientation: string;
  ventilationDetail: string;
}

export interface ArchitecturalFloorPlan {
  plotWidth: number;
  plotDepth: number;
  houseWidth: number;
  houseDepth: number;
  setbacks: { front: number; rear: number; left: number; right: number };
  rooms: RoomLayoutBox[];
  totalBuiltUpSqFt: number;
  totalCarpetSqFt: number;
  driveway: { x: number; y: number; width: number; length: number; clearWidth: number };
  lawn: { x: number; y: number; width: number; length: number };
  porch: { x: number; y: number; width: number; length: number };
  boundaryWall: { perimeter: number; height: number };
  mainGate: { x: number; y: number; width: number };
  asciiDiagram: string;
}

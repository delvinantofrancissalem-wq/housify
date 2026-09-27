import { HouseSpecs, ArchitecturalFloorPlan, RoomLayoutBox, BlueprintDoor, BlueprintWindow } from '../types';

/**
 * Generates an architectural floor plan layout and CAD geometry
 */
export function generateArchitecturalFloorPlan(specs: HouseSpecs): ArchitecturalFloorPlan {
  const { plotWidth, plotDepth, builtUpArea, rooms, exterior } = specs;

  // Calculate setbacks based on standard residential zoning bylaws
  const frontSetback = Math.max(8, Math.min(16, Math.round(plotDepth * 0.20)));
  const rearSetback = Math.max(5, Math.min(10, Math.round(plotDepth * 0.12)));
  const leftSetback = Math.max(4, Math.min(8, Math.round(plotWidth * 0.12)));
  const rightSetback = Math.max(4, Math.min(8, Math.round(plotWidth * 0.12)));

  // Available building footprint envelope
  const maxHouseWidth = Math.max(20, plotWidth - (leftSetback + rightSetback));
  const maxHouseDepth = Math.max(24, plotDepth - (frontSetback + rearSetback));

  // Determine house dimensions to match target built-up area for the ground floor
  const targetGroundArea = specs.floors > 1 ? Math.round(builtUpArea / specs.floors) : builtUpArea;
  
  // Calculate scaled house width & depth that fit within setbacks
  let houseWidth = Math.min(maxHouseWidth, Math.round(Math.sqrt(targetGroundArea * 1.05)));
  let houseDepth = Math.min(maxHouseDepth, Math.round(targetGroundArea / houseWidth));
  if (houseDepth < 20) {
    houseDepth = 20;
    houseWidth = Math.min(maxHouseWidth, Math.round(targetGroundArea / houseDepth));
  }

  // Adjust house coordinates on the plot
  const houseOriginX = leftSetback;
  const houseOriginY = frontSetback;

  // Split house into a structured architectural 2x3 or 3x3 zoning matrix:
  // Front Zone: Porch, Foyer, Living Room, Carport, Front Lawn
  // Middle Zone: Dining, Kitchen, Common Bath, Staircase/Hallway
  // Rear Zone: Master Bed (with attached bath), Bedroom 2, Utility Yard
  const layoutRooms: RoomLayoutBox[] = [];

  // 1. Porch / Verandah
  const porchWidth = Math.round(houseWidth * 0.35);
  const porchDepth = 6;
  layoutRooms.push({
    id: 'porch-1',
    name: 'Entry Porch / Verandah',
    type: 'porch',
    x: 0,
    y: 0,
    width: porchWidth,
    length: porchDepth,
    height: 10,
    areaSqFt: porchWidth * porchDepth,
    colorTheme: 'slate',
    doors: [
      { id: 'd-main', tag: '[D-MAIN]', width: 3.5, wall: 'top', position: 0.5, swing: 'inward-left' }
    ],
    windows: [],
    columns: [{ x: 0, y: 0 }, { x: porchWidth, y: 0 }],
    furniture: [],
    circulationArrow: { fromX: porchWidth / 2, fromY: 0, toX: porchWidth / 2, toY: porchDepth, label: 'Main Entry 3\'6" Clearance' },
    orientation: 'North-East (Morning Sun & Positive Energy)',
    ventilationDetail: 'Open covered portico for natural air intake and sheltered arrival',
  });

  // 2. Living Room (Front right / central)
  const livingWidth = Math.round(houseWidth * 0.65);
  const livingDepth = Math.round(houseDepth * 0.42);
  layoutRooms.push({
    id: 'living-1',
    name: 'Formal Living Room',
    type: 'living',
    x: porchWidth,
    y: 0,
    width: livingWidth,
    length: livingDepth,
    height: 10.5,
    areaSqFt: livingWidth * livingDepth,
    colorTheme: 'blue',
    doors: [
      { id: 'd-living-in', tag: '[D1]', width: 3.5, wall: 'left', position: 0.25, swing: 'inward-right' },
      { id: 'd-living-dining', tag: '[D-ARCH]', width: 5.0, wall: 'top', position: 0.6, swing: 'inward-left' },
    ],
    windows: [
      { id: 'w-living-front', tag: '[W1]', width: 5.0, wall: 'bottom', position: 0.5 },
      { id: 'w-living-side', tag: '[W2]', width: 4.0, wall: 'right', position: 0.4 },
    ],
    columns: [
      { x: porchWidth, y: 0 },
      { x: porchWidth + livingWidth, y: 0 },
      { x: porchWidth + livingWidth, y: livingDepth },
      { x: porchWidth, y: livingDepth }
    ],
    furniture: [
      { type: 'sofa-set', x: livingWidth * 0.35, y: livingDepth * 0.45, width: 8, height: 6 },
      { type: 'tv-unit', x: livingWidth * 0.85, y: livingDepth * 0.45, width: 1.5, height: 5 }
    ],
    circulationArrow: { fromX: livingWidth * 0.2, fromY: livingDepth * 0.2, toX: livingWidth * 0.6, toY: livingDepth * 0.8, label: 'Central Foyer Flow' },
    orientation: 'North / North-East (Diffused Glare-Free Ambient Light)',
    ventilationDetail: 'Cross ventilation through wide front casement window and dining archway',
  });

  // 3. Dining Area (Central core hub)
  const diningWidth = Math.round(houseWidth * 0.42);
  const diningDepth = Math.round(houseDepth * 0.30);
  const diningX = 0;
  const diningY = porchDepth;
  layoutRooms.push({
    id: 'dining-1',
    name: 'Dining Hall & Hallway',
    type: 'dining',
    x: diningX,
    y: diningY,
    width: diningWidth,
    length: diningDepth,
    height: 10,
    areaSqFt: diningWidth * diningDepth,
    colorTheme: 'amber',
    doors: [
      { id: 'd-dining-kitchen', tag: '[D2]', width: 3.0, wall: 'right', position: 0.3, swing: 'inward-right' },
      { id: 'd-dining-corridor', tag: '[OPEN]', width: 4.0, wall: 'top', position: 0.5, swing: 'inward-left' },
    ],
    windows: [
      { id: 'w-dining', tag: '[W3]', width: 3.5, wall: 'left', position: 0.5 },
    ],
    columns: [
      { x: 0, y: diningY },
      { x: 0, y: diningY + diningDepth },
      { x: diningWidth, y: diningY + diningDepth }
    ],
    furniture: [
      { type: 'dining-table', x: diningWidth * 0.5, y: diningDepth * 0.5, width: 5.5, height: 3.5 }
    ],
    circulationArrow: { fromX: diningWidth * 0.5, fromY: 0, toX: diningWidth * 0.5, toY: diningDepth, label: 'Circulation Spine (4\'0")' },
    orientation: 'East-Facing Central Hub (Family Gathering Core)',
    ventilationDetail: 'Direct access to patio/courtyard ventilation shaft',
  });

  // 4. Kitchen & Utility
  const kitchenWidth = Math.round(houseWidth * 0.58);
  const kitchenDepth = diningDepth;
  const kitchenX = diningWidth;
  const kitchenY = livingDepth; // sits behind living or adjacent to dining
  layoutRooms.push({
    id: 'kitchen-1',
    name: 'Modular Kitchen & Pantry',
    type: 'kitchen',
    x: kitchenX,
    y: diningY,
    width: kitchenWidth,
    length: kitchenDepth,
    height: 10,
    areaSqFt: kitchenWidth * kitchenDepth,
    colorTheme: 'emerald',
    doors: [
      { id: 'd-kit-entry', tag: '[D3]', width: 3.0, wall: 'left', position: 0.3, swing: 'inward-right' },
      { id: 'd-kit-utility', tag: '[D-UTL]', width: 2.8, wall: 'right', position: 0.7, swing: 'inward-left' },
    ],
    windows: [
      { id: 'w-kitchen', tag: '[W-KIT]', width: 4.0, wall: 'right', position: 0.3 },
    ],
    columns: [
      { x: kitchenX + kitchenWidth, y: diningY },
      { x: kitchenX + kitchenWidth, y: diningY + kitchenDepth }
    ],
    furniture: [
      { type: 'kitchen-counter-l', x: kitchenWidth * 0.7, y: kitchenDepth * 0.3, width: 8, height: 2 },
      { type: 'kitchen-sink', x: kitchenWidth * 0.85, y: kitchenDepth * 0.6, width: 2.5, height: 1.8 }
    ],
    circulationArrow: { fromX: 0, fromY: kitchenDepth / 2, toX: kitchenWidth * 0.6, toY: kitchenDepth / 2, label: 'Work Triangle 4\' Clearance' },
    orientation: 'South-East (Agni Vastu / Optimal Morning Sunlight & Natural Sanitization)',
    ventilationDetail: 'High-power exhaust sleeve + 4\' sliding window for rapid steam extraction',
  });

  // 5. Master Bedroom with En-Suite Bathroom (Rear private sanctuary)
  const masterBedWidth = Math.round(houseWidth * 0.58);
  const masterBedDepth = houseDepth - (diningY + diningDepth);
  const masterBedX = 0;
  const masterBedY = diningY + diningDepth;
  layoutRooms.push({
    id: 'master-bed-1',
    name: 'Master Bedroom Suite',
    type: 'master-bed',
    x: masterBedX,
    y: masterBedY,
    width: masterBedWidth,
    length: masterBedDepth,
    height: 10,
    areaSqFt: masterBedWidth * masterBedDepth,
    colorTheme: 'indigo',
    doors: [
      { id: 'd-master', tag: '[D4]', width: 3.2, wall: 'bottom', position: 0.3, swing: 'inward-left' },
      { id: 'd-master-bath', tag: '[D-BATH]', width: 2.6, wall: 'right', position: 0.75, swing: 'inward-right' },
    ],
    windows: [
      { id: 'w-master-rear', tag: '[W4]', width: 5.0, wall: 'top', position: 0.5 },
      { id: 'w-master-side', tag: '[W5]', width: 4.0, wall: 'left', position: 0.4 },
    ],
    columns: [
      { x: 0, y: masterBedY + masterBedDepth },
      { x: masterBedWidth, y: masterBedY + masterBedDepth }
    ],
    furniture: [
      { type: 'bed-king', x: masterBedWidth * 0.45, y: masterBedDepth * 0.55, width: 6.5, height: 6.5 },
      { type: 'wardrobe', x: masterBedWidth * 0.15, y: masterBedDepth * 0.85, width: 7, height: 2 }
    ],
    circulationArrow: { fromX: masterBedWidth * 0.3, fromY: 0, toX: masterBedWidth * 0.8, toY: masterBedDepth * 0.7, label: '3\' Bed Clearance Path' },
    orientation: 'South-West (Master Zone: Quiet, Maximum Privacy & Evening Sea Breeze)',
    ventilationDetail: 'Two-sided cross ventilation to maximize nocturnal cooling and passive comfort',
  });

  // 6. Attached Master Bathroom
  const bathWidth = Math.round(houseWidth * 0.42);
  const bathDepth = Math.round(masterBedDepth * 0.45);
  const bathX = masterBedWidth;
  const bathY = masterBedY;
  layoutRooms.push({
    id: 'bath-attached',
    name: 'En-Suite Master Bath',
    type: 'bathroom',
    x: bathX,
    y: bathY,
    width: bathWidth,
    length: bathDepth,
    height: 9.5,
    areaSqFt: bathWidth * bathDepth,
    colorTheme: 'cyan',
    doors: [
      { id: 'd-bath-1', tag: '[D-B1]', width: 2.6, wall: 'left', position: 0.5, swing: 'inward-left' },
    ],
    windows: [
      { id: 'vent-bath-1', tag: '[VENT1]', width: 2.0, wall: 'right', position: 0.5 },
    ],
    columns: [
      { x: bathX + bathWidth, y: bathY }
    ],
    furniture: [
      { type: 'shower-stall', x: bathWidth * 0.75, y: bathDepth * 0.5, width: 3, height: 3 },
      { type: 'ewc-toilet', x: bathWidth * 0.4, y: bathDepth * 0.3, width: 1.8, height: 2.2 }
    ],
    orientation: 'West Shaft (Vertical Plumbing Stack Alignment)',
    ventilationDetail: 'Dedicated louvered glass ventilator with exhaust fan core',
  });

  // 7. Bedroom 2 / Guest Bedroom
  const bed2Width = bathWidth;
  const bed2Depth = masterBedDepth - bathDepth;
  const bed2X = masterBedWidth;
  const bed2Y = masterBedY + bathDepth;
  layoutRooms.push({
    id: 'bedroom-2',
    name: 'Bedroom 2 / Guest Room',
    type: 'bedroom',
    x: bed2X,
    y: bed2Y,
    width: bed2Width,
    length: bed2Depth,
    height: 10,
    areaSqFt: bed2Width * bed2Depth,
    colorTheme: 'teal',
    doors: [
      { id: 'd-bed2', tag: '[D5]', width: 3.0, wall: 'left', position: 0.4, swing: 'inward-left' },
    ],
    windows: [
      { id: 'w-bed2', tag: '[W6]', width: 4.5, wall: 'right', position: 0.5 },
      { id: 'w-bed2-rear', tag: '[W7]', width: 3.5, wall: 'top', position: 0.5 },
    ],
    columns: [
      { x: bed2X + bed2Width, y: bed2Y + bed2Depth }
    ],
    furniture: [
      { type: 'bed-queen', x: bed2Width * 0.5, y: bed2Depth * 0.5, width: 5.5, height: 6 },
      { type: 'study-desk', x: bed2Width * 0.25, y: bed2Depth * 0.85, width: 3.5, height: 1.8 }
    ],
    circulationArrow: { fromX: 0, fromY: bed2Depth * 0.4, toX: bed2Width * 0.5, toY: bed2Depth * 0.5, label: 'Entry Clearance' },
    orientation: 'North-West (Pleasant Afternoon Daylight & Natural Draft)',
    ventilationDetail: 'Corner window glazing for dual-aspect airflow and backyard garden views',
  });

  // Exterior layout geometry
  const drivewayWidth = Math.max(10, Math.min(18, Math.round(plotWidth * 0.35)));
  const drivewayLength = frontSetback;
  const lawnWidth = plotWidth - drivewayWidth - 4;
  const lawnLength = frontSetback - 2;

  const compoundPerimeter = Math.round((plotWidth + plotDepth) * 2);

  // Generate ASCII diagram matching the user prompt's specification
  const asciiDiagram = generateAsciiPlan(
    plotWidth,
    plotDepth,
    houseWidth,
    houseDepth,
    livingWidth,
    livingDepth,
    diningWidth,
    diningDepth,
    kitchenWidth,
    masterBedWidth,
    masterBedDepth,
    bathWidth
  );

  return {
    plotWidth,
    plotDepth,
    houseWidth,
    houseDepth,
    setbacks: { front: frontSetback, rear: rearSetback, left: leftSetback, right: rightSetback },
    rooms: layoutRooms,
    totalBuiltUpSqFt: Math.round(layoutRooms.reduce((acc, r) => acc + r.areaSqFt, 0)),
    totalCarpetSqFt: Math.round(layoutRooms.reduce((acc, r) => acc + (r.type !== 'porch' ? r.areaSqFt : 0), 0) * 0.92),
    driveway: { x: plotWidth - drivewayWidth - rightSetback, y: 0, width: drivewayWidth, length: drivewayLength, clearWidth: drivewayWidth },
    lawn: { x: leftSetback, y: 0, width: lawnWidth, length: lawnLength },
    porch: { x: leftSetback, y: frontSetback, width: porchWidth, length: porchDepth },
    boundaryWall: { perimeter: compoundPerimeter, height: 6 },
    mainGate: { x: plotWidth - drivewayWidth - rightSetback, y: 0, width: 14 },
    asciiDiagram,
  };
}

/**
 * Creates clean labeled 2D ASCII floor plan diagram with [D], [W], zones
 */
function generateAsciiPlan(
  plotW: number,
  plotD: number,
  hW: number,
  hD: number,
  livW: number,
  livD: number,
  dinW: number,
  dinD: number,
  kitW: number,
  mBedW: number,
  mBedD: number,
  bW: number
): string {
  return `
========================================================================================================
                               ARCHITECTURAL 2D FLOOR PLAN & ZONING BLUEPRINT
========================================================================================================
 Plot Size: ${plotW}'0" x ${plotD}'0"  |  Building Footprint: ${hW}'0" x ${hD}'0"  |  Orientation: North Entry [N ^]
 Key: [D] = Door Opening  |  [W] = Window / Glazing  |  [V] = Ventilator  |  (C) = Structural RCC Column
--------------------------------------------------------------------------------------------------------

        <------------------------------ REAR SETBACK (6'-0" CLEARANCE) ----------------------------->
 (C)=====[W]=============[W]========(C)====================[V]=============[W]====================(C)
  |                                   |                    |                                       |
  |       MASTER BEDROOM SUITE        |   EN-SUITE BATH    |         BEDROOM 2 / GUEST             |
  |       ${mBedW}'0" x ${mBedD}'0" (10' Ht)         |   ${bW}'0" x 6'6"        |         ${bW}'0" x ${mBedD - 7}'0"                   |
  |                                   |                    |                                       |
 [W]     [King Bed Layout]           [D]  [Shower + EWC]   |      [Queen Bed + Desk]              [W]
  |                                   |                    |                                       |
  |                                   +---------[D]--------+                                       |
  |                                   |  COMMON RESTROOM   |                                       |
  |                                   |  7'0" x 4'6"  [V]  |                                       |
 (C)-----[D4]------------------------(C)--------[D]-------(C)--------------[D5]-------------------(C)
  |                                                            |                                   |
  |                 CENTRAL DINING HALL & SPINE                |         MODULAR KITCHEN           |
  |                 ${dinW}'0" x ${dinD}'0" (4'0" Clear Hallway)          |         ${kitW}'0" x ${dinD}'0"                   |
 [W]                                                           [D3]      [L-Counter + Sink]       [W]
  |                     [6-Seater Dining Table]                |                                   |
  |                                                            |               +---[D-UTL]-(Utility)
 (C)---------------------------------(C)========[ARCH OPEN]====(C)                                 |
  |      ENTRY PORCH / VERANDAH       |                                                            |
  |      ${hW - livW}'0" x 6'0" Covered               |               FORMAL LIVING ROOM           |
  |                                   |               ${livW}'0" x ${livD}'0" (10'6" Ceiling)          |
  |       ====[D-MAIN (3'6")]====>    |                                                            |
 [W]                                  |         [Sofa Suite + Audio-Visual Unit]                  [W]
  |                                   |                                                            |
 (C)=================================(C)==============[W1 (5'0")]===============[W2]==============(C)
        <----------------------------- FRONT SETBACK (12'-0") ------------------------------>

 +----------------------------------------------+     +--------------------------------------------+
 |          LANDSCAPED FRONT LAWN & TURF        |     |       PAVED CARPORT / DRIVEWAY CLEARANCE   |
 |           320 Sq.Ft Greenery Buffer          |     |           1 Car / SUV (11'0" x 18'0")      |
 +----------------------------------------------+     +--------------------------------------------+
  ====================================================== [MAIN SLIDING GATE 14'0"] =================
`;
}

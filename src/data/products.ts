export type Wheelbase = "MWB" | "LWB" | "XLWB";
export type Usage = "weekends" | "holidays" | "touring" | "fulltime";
export type Climate = "uk" | "eurosummer" | "fourseason";
export type OffGrid = "low" | "medium" | "high";

export type BuildConfig = {
  make: string;
  model: string;
  wheelbase: Wheelbase;
  occupants: number;
  budget: number;
  usage: Usage;
  climate: Climate;
  offGrid: OffGrid;
  shower: boolean;
  hotWater: boolean;
  gasless: boolean;
};

export type Tier = "budget" | "standard" | "premium";

export type CategoryId =
  | "insulation"
  | "windows"
  | "ventilation"
  | "battery"
  | "solar"
  | "dcdc"
  | "inverter"
  | "heating"
  | "freshwater"
  | "wastewater"
  | "hotwater"
  | "fridge"
  | "toilet"
  | "shower"
  | "cooking"
  | "flooring"
  | "furniture"
  | "consumables";

export type Category = {
  id: CategoryId;
  name: string;
  group: "Shell & Comfort" | "Power" | "Water" | "Living";
  blurb: string;
  scalesWithSize?: boolean;
};

export const CATEGORIES: Category[] = [
  { id: "insulation", name: "Insulation", group: "Shell & Comfort", blurb: "Keeps heat in and condensation out.", scalesWithSize: true },
  { id: "windows", name: "Windows", group: "Shell & Comfort", blurb: "Light, view and ventilation." },
  { id: "ventilation", name: "Roof Ventilation", group: "Shell & Comfort", blurb: "Moisture control and airflow." },
  { id: "flooring", name: "Flooring", group: "Shell & Comfort", blurb: "Subfloor, insulation and finish.", scalesWithSize: true },
  { id: "battery", name: "Battery", group: "Power", blurb: "Your energy store." },
  { id: "solar", name: "Solar", group: "Power", blurb: "Free power while parked." },
  { id: "dcdc", name: "DC-DC Charging", group: "Power", blurb: "Charges the leisure battery as you drive." },
  { id: "inverter", name: "Inverter & Mains", group: "Power", blurb: "240V sockets and hook-up." },
  { id: "heating", name: "Heating", group: "Shell & Comfort", blurb: "Warmth on cold nights." },
  { id: "freshwater", name: "Fresh Water", group: "Water", blurb: "Tank, pump and plumbing." },
  { id: "wastewater", name: "Waste Water", group: "Water", blurb: "Grey water capture." },
  { id: "hotwater", name: "Hot Water", group: "Water", blurb: "Warm taps and showers." },
  { id: "shower", name: "Shower", group: "Water", blurb: "Wet room or outdoor rinse." },
  { id: "fridge", name: "Fridge", group: "Living", blurb: "Cold food storage." },
  { id: "toilet", name: "Toilet", group: "Living", blurb: "Comfort at 3am." },
  { id: "cooking", name: "Cooking", group: "Living", blurb: "Hob, oven and extraction." },
  { id: "furniture", name: "Furniture", group: "Living", blurb: "Bed, units and worktop.", scalesWithSize: true },
  { id: "consumables", name: "Consumables", group: "Living", blurb: "Cable, fixings, sealant, timber.", scalesWithSize: true },
];

export type Product = {
  id: string;
  category: CategoryId;
  name: string;
  brand: string;
  tier: Tier;
  price: number;
  weight: number;
  specs: string[];
  /** hard requirements — product hidden if not compatible */
  gasFree?: boolean;
  usesGas?: boolean;
  buyUrl: string;
};

const shop = (q: string) =>
  `https://www.google.com/search?tbm=shop&q=${encodeURIComponent(q + " campervan UK")}`;

export const PRODUCTS: Product[] = [
  // Insulation
  { id: "ins-1", category: "insulation", brand: "Thinsulate", name: "Thinsulate SM600 Basic Pack", tier: "budget", price: 340, weight: 14, specs: ["SM600 3M Thinsulate", "Walls + doors only", "Hydrophobic, no sag"], buyUrl: shop("Thinsulate SM600 van insulation") },
  { id: "ins-2", category: "insulation", brand: "Thinsulate", name: "Thinsulate SM600 + Armaflex Full Pack", tier: "standard", price: 620, weight: 26, specs: ["19mm Armaflex on ribs & metal", "Thinsulate cavities", "Thermal bridge treatment"], buyUrl: shop("Armaflex XG 19mm van insulation kit") },
  { id: "ins-3", category: "insulation", brand: "Armaflex", name: "Four-Season Armaflex + Sheep Wool System", tier: "premium", price: 1050, weight: 38, specs: ["25mm Armaflex", "Sheep wool cavity fill", "Full sound deadening"], buyUrl: shop("Armaflex 25mm sheep wool van insulation") },

  // Windows
  { id: "win-1", category: "windows", brand: "Seitz", name: "Single Sliding Door Window 500x350", tier: "budget", price: 210, weight: 7, specs: ["Acrylic, tinted", "Sliding vent pane", "1 window"], buyUrl: shop("Seitz S4 campervan window 500x350") },
  { id: "win-2", category: "windows", brand: "Dometic", name: "Dometic S4 Twin Window Set", tier: "standard", price: 480, weight: 15, specs: ["2 x acrylic double-glazed", "Integrated blind & flyscreen", "Slider + rear quarter"], buyUrl: shop("Dometic Seitz S4 window twin set") },
  { id: "win-3", category: "windows", brand: "Dometic", name: "S7P Panoramic Glazing Set (3)", tier: "premium", price: 1180, weight: 30, specs: ["3 x framed acrylic units", "Pleated blackout blinds", "Bonded flush fit"], buyUrl: shop("Dometic S7P campervan window") },

  // Ventilation
  { id: "vent-1", category: "ventilation", brand: "Fiamma", name: "Turbo-Vent Manual Roof Vent", tier: "budget", price: 165, weight: 5, specs: ["40x40cm", "Manual crank", "Flyscreen"], buyUrl: shop("Fiamma Turbo Vent manual roof vent") },
  { id: "vent-2", category: "ventilation", brand: "MaxxAir", name: "MaxxFan Deluxe 12V", tier: "standard", price: 340, weight: 6, specs: ["10-speed reversible fan", "Rain hood — use in rain", "Remote + thermostat"], buyUrl: shop("MaxxAir MaxxFan Deluxe 12v") },
  { id: "vent-3", category: "ventilation", brand: "MaxxAir", name: "Twin MaxxFan Deluxe Cross-Flow", tier: "premium", price: 640, weight: 12, specs: ["2 fans, intake + extract", "Cross-flow ventilation", "Best for showering/cooking humidity"], buyUrl: shop("MaxxAir MaxxFan Deluxe 12v") },

  // Battery
  { id: "bat-1", category: "battery", brand: "Roamer", name: "100Ah LiFePO4 Leisure Battery", tier: "budget", price: 430, weight: 12, specs: ["1.28kWh usable", "Built-in BMS", "~2000 cycles"], buyUrl: shop("100Ah LiFePO4 leisure battery") },
  { id: "bat-2", category: "battery", brand: "Fogstar", name: "Drift 230Ah LiFePO4", tier: "standard", price: 720, weight: 23, specs: ["2.94kWh usable", "200A BMS, Bluetooth", "Heated cells option"], buyUrl: shop("Fogstar Drift 230Ah LiFePO4") },
  { id: "bat-3", category: "battery", brand: "Fogstar", name: "Drift 460Ah Bank (2 x 230Ah)", tier: "premium", price: 1420, weight: 46, specs: ["5.9kWh usable", "Full off-grid autonomy", "Bluetooth monitoring"], buyUrl: shop("Fogstar Drift 230Ah LiFePO4") },

  // Solar
  { id: "sol-1", category: "solar", brand: "Photonic", name: "150W Panel + 75/15 MPPT", tier: "budget", price: 260, weight: 11, specs: ["150W mono panel", "Victron 75/15 MPPT", "Roof brackets & gland"], buyUrl: shop("150W solar panel Victron MPPT kit") },
  { id: "sol-2", category: "solar", brand: "Victron", name: "300W Twin Array + 100/30 MPPT", tier: "standard", price: 520, weight: 22, specs: ["2 x 150W panels", "Victron 100/30 MPPT", "Typical 0.9kWh/day summer"], buyUrl: shop("300w solar panel kit Victron 100/30") },
  { id: "sol-3", category: "solar", brand: "Victron", name: "600W Array + 150/45 MPPT", tier: "premium", price: 1040, weight: 40, specs: ["4 x 150W panels", "Victron 150/45 MPPT", "Winter-capable harvest"], buyUrl: shop("600w campervan solar kit Victron 150/45") },

  // DC-DC
  { id: "dc-1", category: "dcdc", brand: "Victron", name: "Orion-Tr Smart 12/12-18A", tier: "budget", price: 175, weight: 2, specs: ["18A charge while driving", "Bluetooth", "Euro 6 alternator safe"], buyUrl: shop("Victron Orion-Tr Smart 12/12-18") },
  { id: "dc-2", category: "dcdc", brand: "Victron", name: "Orion XS 12/12-50A", tier: "standard", price: 320, weight: 3, specs: ["50A DC-DC", "98% efficient", "Lithium profile"], buyUrl: shop("Victron Orion XS 50A DC-DC charger") },
  { id: "dc-3", category: "dcdc", brand: "Victron", name: "Twin Orion XS 100A + Smart Shunt", tier: "premium", price: 690, weight: 6, specs: ["100A combined charging", "SmartShunt battery monitor", "Fast top-up on short drives"], buyUrl: shop("Victron Orion XS 50A DC-DC charger") },

  // Inverter
  { id: "inv-1", category: "inverter", brand: "Victron", name: "Phoenix 375VA + USB Points", tier: "budget", price: 190, weight: 4, specs: ["375VA pure sine", "Laptop & camera charging", "No mains hook-up"], buyUrl: shop("Victron Phoenix 375VA inverter") },
  { id: "inv-2", category: "inverter", brand: "Victron", name: "Multiplus 12/1200 + Hook-Up Kit", tier: "standard", price: 780, weight: 14, specs: ["1200VA inverter/charger", "Mains hook-up, RCD consumer unit", "Powers induction at low setting"], buyUrl: shop("Victron MultiPlus 12/1200 inverter charger") },
  { id: "inv-3", category: "inverter", brand: "Victron", name: "Multiplus-II 12/3000 Full Mains", tier: "premium", price: 1450, weight: 22, specs: ["3000VA / 120A charger", "Runs induction + kettle", "Full 240V circuit, RCBO board"], buyUrl: shop("Victron MultiPlus-II 12/3000 inverter") },

  // Heating
  { id: "heat-1", category: "heating", brand: "Vevor", name: "2kW Diesel Air Heater", tier: "budget", price: 220, weight: 9, specs: ["2kW blown air", "Own fuel tank", "Basic controller"], gasFree: true, buyUrl: shop("2kw diesel night heater campervan") },
  { id: "heat-2", category: "heating", brand: "Webasto", name: "Air Top 2000 STC Diesel Heater", tier: "standard", price: 890, weight: 11, specs: ["2kW, van-tank feed", "Multicontrol HD timer", "Quiet, altitude sensor"], gasFree: true, buyUrl: shop("Webasto Air Top 2000 STC kit") },
  { id: "heat-3", category: "heating", brand: "Webasto", name: "Dual Top Evo 6 Air + Water", tier: "premium", price: 2150, weight: 19, specs: ["6kW combi heat + hot water", "Ducted to 3 outlets", "Four-season rated"], gasFree: true, buyUrl: shop("Webasto Dual Top Evo 6 combi heater") },

  // Fresh water
  { id: "fw-1", category: "freshwater", brand: "Fiamma", name: "45L Underslung Tank + 12V Pump", tier: "budget", price: 260, weight: 13, specs: ["45L fresh", "Shurflo 7L/min pump", "Single tap"], buyUrl: shop("45L underslung fresh water tank campervan") },
  { id: "fw-2", category: "freshwater", brand: "CAK Tanks", name: "70L Tank + Accumulator System", tier: "standard", price: 480, weight: 20, specs: ["70L internal tank", "Pump + accumulator, smooth flow", "Level gauge, filtered fill"], buyUrl: shop("70L campervan water tank pump accumulator") },
  { id: "fw-3", category: "freshwater", brand: "CAK Tanks", name: "110L Insulated Tank + Whale Pump", tier: "premium", price: 830, weight: 32, specs: ["110L insulated & heated line", "Whale Universal pump", "Inline carbon filter + gauge"], buyUrl: shop("110L campervan fresh water tank insulated") },

  // Waste water
  { id: "ww-1", category: "wastewater", brand: "Hitchman", name: "20L Portable Waste Container", tier: "budget", price: 65, weight: 5, specs: ["20L wheeled container", "Sink drain hose", "No underslung fitting"], buyUrl: shop("20L campervan waste water container") },
  { id: "ww-2", category: "wastewater", brand: "CAK Tanks", name: "42L Underslung Grey Tank", tier: "standard", price: 245, weight: 12, specs: ["42L underslung", "Gate valve dump", "Traps and pipework"], buyUrl: shop("42L underslung grey waste tank van") },
  { id: "ww-3", category: "wastewater", brand: "CAK Tanks", name: "70L Insulated Grey Tank + Heater Pad", tier: "premium", price: 520, weight: 22, specs: ["70L insulated tank", "12V frost heater pad", "Level sensor"], buyUrl: shop("70L insulated grey waste tank heated van") },

  // Hot water
  { id: "hw-0", category: "hotwater", brand: "—", name: "No Hot Water System", tier: "budget", price: 0, weight: 0, specs: ["Kettle on the hob", "Saves space and cost"], gasFree: true, buyUrl: shop("campervan kettle") },
  { id: "hw-1", category: "hotwater", brand: "Elgena", name: "Nautic Compact 10L 12V/240V Boiler", tier: "budget", price: 330, weight: 8, specs: ["10L stored hot water", "240V element + 12V option", "Best on hook-up"], gasFree: true, buyUrl: shop("Elgena Nautic Compact 10L boiler") },
  { id: "hw-2", category: "hotwater", brand: "Propex", name: "Malaga 5E Gas Water Heater", tier: "standard", price: 520, weight: 10, specs: ["13.5L gas storage heater", "Fast reheat", "Requires LPG"], usesGas: true, buyUrl: shop("Propex Malaga 5E water heater") },
  { id: "hw-3", category: "hotwater", brand: "Webasto", name: "Diesel Calorifier 12L Kit", tier: "premium", price: 940, weight: 16, specs: ["Diesel-fed 12L calorifier", "Heat exchanger from air heater", "Gasless, four-season"], gasFree: true, buyUrl: shop("diesel calorifier campervan hot water") },

  // Fridge
  { id: "fr-1", category: "fridge", brand: "Alpicool", name: "35L 12V Compressor Coolbox", tier: "budget", price: 240, weight: 14, specs: ["35L, ~0.4kWh/day", "Chest style", "Portable"], buyUrl: shop("Alpicool 35L 12v compressor fridge") },
  { id: "fr-2", category: "fridge", brand: "Dometic", name: "CRX 50 Slimline Compressor Fridge", tier: "standard", price: 620, weight: 18, specs: ["45L + freezer box", "Danfoss compressor", "~0.5kWh/day"], buyUrl: shop("Dometic CRX 50 fridge") },
  { id: "fr-3", category: "fridge", brand: "Vitrifrigo", name: "DP2600i 90L Fridge Freezer", tier: "premium", price: 1180, weight: 33, specs: ["75L fridge + 15L freezer", "Separate doors", "Family capacity"], buyUrl: shop("Vitrifrigo DP2600i fridge freezer") },

  // Toilet
  { id: "toi-1", category: "toilet", brand: "Thetford", name: "Porta Potti 335 Portable", tier: "budget", price: 95, weight: 4, specs: ["10L waste tank", "Stows under bed", "No plumbing"], buyUrl: shop("Thetford Porta Potti 335") },
  { id: "toi-2", category: "toilet", brand: "Thetford", name: "C224-CW Cassette Toilet", tier: "standard", price: 480, weight: 15, specs: ["Swivel bowl, external hatch", "18L cassette", "Fixed install"], buyUrl: shop("Thetford C224-CW cassette toilet") },
  { id: "toi-3", category: "toilet", brand: "Trelino", name: "Evo L Composting Toilet", tier: "premium", price: 690, weight: 9, specs: ["Separating dry toilet", "No chemicals, no black waste", "Ideal full-time / off-grid"], buyUrl: shop("Trelino Evo L composting toilet") },

  // Shower
  { id: "sh-0", category: "shower", brand: "—", name: "No Shower", tier: "budget", price: 0, weight: 0, specs: ["Frees up ~0.6m of van length"], buyUrl: shop("campervan layout") },
  { id: "sh-1", category: "shower", brand: "Nuova Rade", name: "Outdoor Shower Point + Tailgate Tent", tier: "budget", price: 180, weight: 6, specs: ["Rear shower outlet & hose", "Pop-up privacy tent", "Zero interior space"], buyUrl: shop("campervan outdoor shower point kit") },
  { id: "sh-2", category: "shower", brand: "Custom", name: "Compact Wet Room 700x700", tier: "standard", price: 890, weight: 42, specs: ["GRP tray + wall panels", "Folding door, riser rail", "Doubles as drying room"], buyUrl: shop("campervan shower tray wet room kit") },
  { id: "sh-3", category: "shower", brand: "Custom", name: "Full-Height Wet Room + Extractor", tier: "premium", price: 1650, weight: 60, specs: ["Sealed GRP wet room", "12V extractor & heated rail", "Thermostatic mixer"], buyUrl: shop("campervan wet room shower cubicle") },

  // Cooking
  { id: "ck-1", category: "cooking", brand: "Dometic", name: "2-Burner Gas Hob + Sink Combi", tier: "budget", price: 290, weight: 12, specs: ["Glass lid combi unit", "Refillable LPG bottle & reg", "Gas drop-out vent required"], usesGas: true, buyUrl: shop("Dometic 2 burner hob sink combi") },
  { id: "ck-2", category: "cooking", brand: "Wallas", name: "Diesel Cooktop XC Duo", tier: "standard", price: 1290, weight: 14, specs: ["Diesel hob, no gas locker", "Doubles as cabin heater", "Fully gasless"], gasFree: true, buyUrl: shop("Wallas XC Duo diesel cooktop") },
  { id: "ck-3", category: "cooking", brand: "Dometic", name: "Induction Hob + Combi Oven Grill", tier: "premium", price: 1090, weight: 26, specs: ["2-zone induction (needs 2kW+ inverter)", "Combi oven/grill", "Gasless"], gasFree: true, buyUrl: shop("campervan induction hob combi oven") },

  // Flooring
  { id: "fl-1", category: "flooring", brand: "Trade", name: "9mm Ply + Vinyl Click Floor", tier: "budget", price: 210, weight: 34, specs: ["9mm birch ply subfloor", "Click vinyl finish", "Foil-backed foam"], buyUrl: shop("campervan ply vinyl flooring kit") },
  { id: "fl-2", category: "flooring", brand: "Trade", name: "Insulated 25mm XPS + 12mm Ply + LVT", tier: "standard", price: 420, weight: 46, specs: ["25mm XPS thermal break", "12mm ply, glued LVT", "Wet-room ready edges"], buyUrl: shop("XPS insulation ply LVT van floor") },
  { id: "fl-3", category: "flooring", brand: "Altro", name: "Altro Marine Safety Vinyl System", tier: "premium", price: 780, weight: 52, specs: ["Coved welded vinyl", "Anti-slip, fully waterproof", "Underfloor insulation 30mm"], buyUrl: shop("Altro marine vinyl campervan floor") },

  // Furniture
  { id: "fu-1", category: "furniture", brand: "Trade", name: "Flat-Pack Poplar Ply Base Units", tier: "budget", price: 850, weight: 95, specs: ["Kitchen run + rock-and-roll style bed", "Poplar ply, oiled", "Self-assembly"], buyUrl: shop("campervan flat pack furniture kit ply") },
  { id: "fu-2", category: "furniture", brand: "Trade", name: "CNC Birch Ply Kitchen, Bed & Wardrobe", tier: "standard", price: 1850, weight: 140, specs: ["CNC-cut birch ply", "Soft-close, laminate worktop", "Fixed bed + garage"], buyUrl: shop("CNC campervan furniture kit birch ply") },
  { id: "fu-3", category: "furniture", brand: "Trade", name: "Lightweight Honeycomb Furniture Suite", tier: "premium", price: 3600, weight: 105, specs: ["Honeycomb composite — 30% lighter", "Solid-surface worktop", "Full-width rear lounge/bed"], buyUrl: shop("lightweight honeycomb campervan furniture") },

  // Consumables
  { id: "co-1", category: "consumables", brand: "Trade", name: "Essentials Fixings & Cable Pack", tier: "budget", price: 320, weight: 18, specs: ["Tigerdrive screws, sealant, rivnuts", "Basic 12V cable & fuse box", "Battens and edging"], buyUrl: shop("campervan conversion fixings cable pack") },
  { id: "co-2", category: "consumables", brand: "Trade", name: "Full Build Consumables Pack", tier: "standard", price: 620, weight: 30, specs: ["Tinned cable, MCB/fuse panel", "Sikaflex, ply lining, trim", "Plumbing fittings & clips"], buyUrl: shop("campervan wiring loom consumables kit") },
  { id: "co-3", category: "consumables", brand: "Trade", name: "Premium Marine-Grade Build Pack", tier: "premium", price: 1080, weight: 38, specs: ["Marine tinned cable throughout", "Blue Sea fuse blocks", "Sika bonding, upholstery trim"], buyUrl: shop("marine tinned cable blue sea fuse block") },
];

export const SIZE_FACTOR: Record<Wheelbase, number> = { MWB: 0.85, LWB: 1, XLWB: 1.18 };

export function priceFor(p: Product, config: BuildConfig) {
  const cat = CATEGORIES.find((c) => c.id === p.category)!;
  const f = cat.scalesWithSize ? SIZE_FACTOR[config.wheelbase] : 1;
  return Math.round((p.price * f) / 5) * 5;
}

export function weightFor(p: Product, config: BuildConfig) {
  const cat = CATEGORIES.find((c) => c.id === p.category)!;
  const f = cat.scalesWithSize ? SIZE_FACTOR[config.wheelbase] : 1;
  return Math.round(p.weight * f);
}

export function productsFor(categoryId: CategoryId, config: BuildConfig) {
  return PRODUCTS.filter((p) => p.category === categoryId).filter((p) =>
    config.gasless ? !p.usesGas : true,
  );
}

export const VANS: Record<string, string[]> = {
  "Mercedes-Benz": ["Sprinter", "Vito"],
  Volkswagen: ["Crafter", "Transporter T6.1"],
  Ford: ["Transit", "Transit Custom"],
  Fiat: ["Ducato"],
  Peugeot: ["Boxer"],
  Citroen: ["Relay"],
  Renault: ["Master", "Trafic"],
  Vauxhall: ["Movano", "Vivaro"],
  MAN: ["TGE"],
  Iveco: ["Daily"],
};

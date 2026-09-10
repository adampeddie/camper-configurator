import {
  CATEGORIES,
  productsFor,
  priceFor,
  type BuildConfig,
  type CategoryId,
  type Product,
  type Tier,
} from "@/data/products";

export type Selection = { product: Product; reason: string };
export type Build = Record<CategoryId, Selection>;

const TIERS: Tier[] = ["budget", "standard", "premium"];

/** 0 = lean, 1 = mid, 2 = generous — from budget per metre of van and usage */
function budgetLevel(config: BuildConfig) {
  const scale = { MWB: 0.85, LWB: 1, XLWB: 1.15 }[config.wheelbase];
  const adjusted = config.budget / scale;
  if (adjusted < 9000) return 0;
  if (adjusted < 18000) return 1;
  return 2;
}

function usageLevel(config: BuildConfig) {
  return { weekends: 0, holidays: 1, touring: 2, fulltime: 2 }[config.usage];
}

function offGridLevel(config: BuildConfig) {
  return { low: 0, medium: 1, high: 2 }[config.offGrid];
}

function climateLevel(config: BuildConfig) {
  return { eurosummer: 0, uk: 1, fourseason: 2 }[config.climate];
}

function pick(
  categoryId: CategoryId,
  config: BuildConfig,
  targetTier: Tier,
  reason: string,
  filter?: (p: Product) => boolean,
): Selection {
  let options = productsFor(categoryId, config);
  if (filter) {
    const narrowed = options.filter(filter);
    if (narrowed.length) options = narrowed;
  }
  const wanted = TIERS.indexOf(targetTier);
  const product = options
    .slice()
    .sort(
      (a, b) =>
        Math.abs(TIERS.indexOf(a.tier) - wanted) - Math.abs(TIERS.indexOf(b.tier) - wanted) ||
        a.price - b.price,
    )[0];
  return { product, reason };
}

function tierFrom(score: number): Tier {
  if (score <= 1) return "budget";
  if (score <= 3) return "standard";
  return "premium";
}

export function recommend(config: BuildConfig): Build {
  const b = budgetLevel(config);
  const u = usageLevel(config);
  const o = offGridLevel(config);
  const c = climateLevel(config);
  const family = config.occupants >= 3;

  const build = {} as Build;

  build.insulation = pick(
    "insulation",
    config,
    tierFrom(c + Math.max(u, b)),
    c === 2
      ? "Four-season use means thermal bridges get treated properly — this is the layer you cannot retrofit."
      : c === 1
        ? "A UK climate is damp more than cold, so hydrophobic insulation plus Armaflex on the metal ribs."
        : "Warm-weather touring needs less mass, so a lighter, cheaper insulation pack does the job.",
  );

  build.windows = pick(
    "windows",
    config,
    tierFrom(u + b + (family ? 1 : 0)),
    family
      ? `With ${config.occupants} on board, extra glazing keeps the living space bright and vented.`
      : "Enough glazing for light and cross-ventilation without weakening the shell.",
  );

  build.ventilation = pick(
    "ventilation",
    config,
    tierFrom(c + (config.shower ? 2 : 0) + (u >= 2 ? 1 : 0)),
    config.shower
      ? "Showering indoors puts litres of moisture into the air — strong powered extraction is non-negotiable."
      : "A powered roof fan handles cooking steam and overnight condensation.",
  );

  const powerDemand =
    o * 2 + u + (config.gasless ? 2 : 0) + (family ? 1 : 0) + (config.hotWater ? 1 : 0);
  build.battery = pick(
    "battery",
    config,
    tierFrom(powerDemand / 1.6),
    config.gasless
      ? "A gasless build moves cooking and hot water onto the battery, so capacity is sized generously."
      : o === 2
        ? "High off-grid time means several days of autonomy without hook-up."
        : "Sized for typical nights away with a fridge, lights and device charging.",
  );

  build.solar = pick(
    "solar",
    config,
    tierFrom(o * 1.6 + (c === 2 ? 1 : 0) + (config.gasless ? 1 : 0)),
    o === 0
      ? "Mostly on hook-up or driving daily, so a modest array tops the battery up."
      : "Off-grid stays live or die by solar harvest — the array is matched to the battery bank.",
  );

  build.dcdc = pick(
    "dcdc",
    config,
    tierFrom(powerDemand / 2 + (u >= 2 ? 1 : 0)),
    "Charges the leisure battery from the alternator; sized so a short drive makes a real difference.",
  );

  build.inverter = pick(
    "inverter",
    config,
    config.gasless ? "premium" : tierFrom(u + b),
    config.gasless
      ? "Induction cooking needs serious inverter headroom plus a proper 240V consumer unit."
      : "Enough 240V for laptops and chargers, with hook-up wired in where it earns its space.",
  );

  build.heating = pick(
    "heating",
    config,
    tierFrom(c * 1.5 + u * 0.5 + (config.hotWater && config.gasless ? 1 : 0)),
    c === 2
      ? "Four-season means real heat output, van-tank fuel feed and reliable cold starts."
      : "A diesel air heater keeps the van dry and warm without touching gas.",
  );

  build.freshwater = pick(
    "freshwater",
    config,
    tierFrom(o + (family ? 1 : 0) + (config.shower ? 1 : 0)),
    config.shower
      ? "Showers drink water, so the tank is sized to avoid a fill-up every other day."
      : `Enough capacity for ${config.occupants} on a typical trip away from taps.`,
  );

  build.wastewater = pick(
    "wastewater",
    config,
    tierFrom((config.shower ? 2 : 0) + o + (c === 2 ? 1 : 0)),
    config.shower
      ? "Shower grey water needs a proper underslung tank you can dump responsibly."
      : "Sink-only waste, so a simple container keeps cost and weight down.",
  );

  build.hotwater = config.hotWater
    ? pick(
        "hotwater",
        config,
        tierFrom(o + (config.gasless ? 2 : 0) + (c === 2 ? 1 : 0)),
        config.gasless
          ? "Gasless, so hot water comes off the diesel heater or the 240V element rather than LPG."
          : "A compact water heater gives warm taps without a big power draw.",
        (p) => p.id !== "hw-0",
      )
    : pick("hotwater", config, "budget", "You opted out of hot water — the kettle covers washing up.", (p) => p.id === "hw-0");

  build.shower = config.shower
    ? pick(
        "shower",
        config,
        tierFrom(u + b + (family ? 1 : 0)),
        u >= 2
          ? "Long trips justify an indoor wet room that doubles as a wet-kit drying space."
          : "An indoor shower you'll actually use, kept compact to protect living space.",
        (p) => p.id !== "sh-0",
      )
    : pick("shower", config, "budget", "No shower requested — that frees up roughly half a metre of van.", (p) => p.id === "sh-0");

  build.fridge = pick(
    "fridge",
    config,
    tierFrom((family ? 2 : 0) + u + (o === 2 ? 1 : 0)),
    family
      ? `Feeding ${config.occupants} needs freezer space and a proper front-opening fridge.`
      : "A compressor fridge that sips power and suits two people's shopping.",
  );

  build.toilet = pick(
    "toilet",
    config,
    tierFrom(u * 1.5 + (o === 2 ? 1 : 0)),
    config.usage === "fulltime"
      ? "Living aboard full-time, a separating toilet avoids chemical disposal points entirely."
      : "Simple, legal to empty anywhere with facilities, and easy to stow.",
  );

  build.cooking = pick(
    "cooking",
    config,
    config.gasless ? (b >= 2 ? "premium" : "standard") : tierFrom(u + b),
    config.gasless
      ? "No LPG on board, so cooking runs on diesel or induction — no gas locker, no drop-out vent."
      : "A gas hob and sink combi is the cheapest, simplest way to cook well in a van.",
  );

  build.flooring = pick(
    "flooring",
    config,
    tierFrom(c + (config.shower ? 1 : 0) + b * 0.5),
    config.shower
      ? "A wet room next door means a waterproof, coved floor build-up."
      : "Insulated subfloor stops the biggest cold bridge in the van.",
  );

  build.furniture = pick(
    "furniture",
    config,
    tierFrom(b * 1.5 + u * 0.5),
    b >= 2
      ? "Your budget supports precision-cut, lightweight units — the difference you touch daily."
      : "A solid ply furniture kit that keeps payload and cost sensible.",
  );

  build.consumables = pick(
    "consumables",
    config,
    tierFrom(b + u * 0.5 + (o === 2 ? 1 : 0)),
    "Cable, fixings, sealant and trim — always underestimated, always needed.",
  );

  return build;
}

export function totals(build: Build, config: BuildConfig) {
  let cost = 0;
  let weight = 0;
  for (const cat of CATEGORIES) {
    const sel = build[cat.id];
    if (!sel) continue;
    cost += priceFor(sel.product, config);
    weight += sel.product.weight;
  }
  return { cost, weight };
}

export function alternatives(categoryId: CategoryId, current: Product, config: BuildConfig) {
  const opts = productsFor(categoryId, config).sort((a, b) => a.price - b.price);
  const i = opts.findIndex((p) => p.id === current.id);
  return {
    cheaper: i > 0 ? opts[i - 1] : undefined,
    upgrade: i >= 0 && i < opts.length - 1 ? opts[i + 1] : undefined,
    all: opts,
  };
}

/** Suggested savings when over budget: biggest single downgrades available. */
export function savingSuggestions(build: Build, config: BuildConfig) {
  return CATEGORIES.map((cat) => {
    const sel = build[cat.id];
    if (!sel) return null;
    const { cheaper } = alternatives(cat.id, sel.product, config);
    if (!cheaper) return null;
    const saving = priceFor(sel.product, config) - priceFor(cheaper, config);
    if (saving <= 0) return null;
    return { category: cat, from: sel.product, to: cheaper, saving };
  })
    .filter(Boolean)
    .sort((a, b) => b!.saving - a!.saving)
    .slice(0, 3) as {
    category: (typeof CATEGORIES)[number];
    from: Product;
    to: Product;
    saving: number;
  }[];
}

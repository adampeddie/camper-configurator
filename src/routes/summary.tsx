import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { CATEGORIES, PRODUCTS, priceFor, type CategoryId } from "@/data/products";
import { recommend, totals } from "@/lib/recommend";
import { useBuildStore } from "@/lib/build-store";
import { money } from "@/components/ui-kit";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/summary")({
  head: () => ({
    meta: [
      { title: "Build Summary — Camper Source UK" },
      {
        name: "description",
        content:
          "Your itemised campervan conversion parts list with category subtotals, weights and buy links, ready to order.",
      },
      { property: "og:title", content: "Build Summary — Camper Source UK" },
      {
        property: "og:description",
        content: "Itemised conversion parts list with subtotals, weights and buy links.",
      },
    ],
  }),
  component: Summary,
});

const USAGE = {
  weekends: "Weekends away",
  holidays: "Holidays",
  touring: "Extended touring",
  fulltime: "Full-time living",
} as const;
const CLIMATE = { uk: "UK", eurosummer: "European summer", fourseason: "Four-season" } as const;

function Summary() {
  const stored = useBuildStore();
  const build = useMemo(() => (stored ? recommend(stored.config) : null), [stored]);

  if (!stored || !build) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-sm text-muted-foreground">No build yet.</p>
        <Link to="/" className="rounded-md bg-ember px-4 py-2 text-sm font-semibold text-accent-foreground">
          Start a build
        </Link>
      </main>
    );
  }

  const config = stored.config;
  const resolved = { ...build };
  for (const [cat, id] of Object.entries(stored.overrides)) {
    const p = PRODUCTS.find((x) => x.id === id);
    if (p) resolved[cat as CategoryId] = { product: p, reason: "Your choice." };
  }
  const { cost, weight } = totals(resolved, config);
  const over = cost > config.budget;
  const groups = ["Shell & Comfort", "Power", "Water", "Living"] as const;

  return (
    <main className="min-h-screen bg-background pb-24">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-4">
          <Link to="/build" className="text-sm font-semibold hover:text-ember">
            ← Back to configurator
          </Link>
          <span className="label-caps">Step 3 — Summary</span>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-5 pt-10">
        <h1 className="text-3xl font-extrabold sm:text-4xl">
          {config.make} {config.model} conversion
        </h1>
        <dl className="mt-6 grid gap-4 rounded-lg border border-border bg-card p-5 sm:grid-cols-3">
          {[
            ["Wheelbase", config.wheelbase],
            ["Occupants", `${config.occupants}`],
            ["Usage", USAGE[config.usage]],
            ["Climate", CLIMATE[config.climate]],
            ["Off-grid", config.offGrid],
            ["Gas", config.gasless ? "Gasless build" : "LPG on board"],
            ["Shower", config.shower ? "Yes" : "No"],
            ["Hot water", config.hotWater ? "Yes" : "No"],
            ["Estimated weight", `${weight} kg`],
          ].map(([k, v]) => (
            <div key={k as string}>
              <dt className="label-caps">{k}</dt>
              <dd className="mt-1 text-sm font-semibold capitalize">{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      {groups.map((group) => {
        const cats = CATEGORIES.filter((c) => c.group === group);
        const subtotal = cats.reduce(
          (sum, c) => sum + priceFor(resolved[c.id].product, config),
          0,
        );
        return (
          <section key={group} className="mx-auto max-w-4xl px-5 pt-8">
            <div className="flex items-baseline justify-between border-b border-border pb-2">
              <h2 className="text-lg font-bold">{group}</h2>
              <span className="text-sm font-semibold">{money(subtotal)}</span>
            </div>
            <ul className="divide-y divide-border">
              {cats.map((c) => {
                const p = resolved[c.id].product;
                const price = priceFor(p, config);
                return (
                  <li key={c.id} className="flex items-center justify-between gap-4 py-3">
                    <div>
                      <p className="label-caps">{c.name}</p>
                      <p className="text-sm font-semibold">{p.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {p.brand} · {p.weight} kg
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-semibold">{price ? money(price) : "—"}</span>
                      <a
                        href={p.buyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-md border border-border px-3 py-1.5 text-xs font-semibold hover:bg-sand"
                      >
                        Buy
                      </a>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}

      <section className="mx-auto mt-10 max-w-4xl px-5">
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="label-caps">Total build cost</p>
              <p className="font-display text-4xl font-extrabold">{money(cost)}</p>
              <p
                className={cn(
                  "mt-1 text-sm font-semibold",
                  over ? "text-destructive" : "text-olive-deep",
                )}
              >
                {over
                  ? `${money(cost - config.budget)} over your ${money(config.budget)} budget`
                  : `${money(config.budget - cost)} under your ${money(config.budget)} budget`}
              </p>
            </div>
            <a
              href={resolved.battery.product.buyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md bg-ember px-7 py-4 text-base font-bold text-accent-foreground transition-transform hover:-translate-y-0.5"
            >
              Buy My Build
            </a>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Prices are indicative UK retail estimates and scale with your wheelbase. Buy links open
            product searches — swap in your preferred supplier before ordering.
          </p>
        </div>
      </section>
    </main>
  );
}

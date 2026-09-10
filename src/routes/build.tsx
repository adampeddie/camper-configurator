import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import {
  CATEGORIES,
  priceFor,
  type CategoryId,
  type Product,
} from "@/data/products";
import { alternatives, recommend, savingSuggestions, totals } from "@/lib/recommend";
import { setOverride, resetOverrides, useBuildStore } from "@/lib/build-store";
import { PRODUCTS } from "@/data/products";
import { TierPill, money } from "@/components/ui-kit";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/build")({
  head: () => ({
    meta: [
      { title: "Your Build — Camper Source UK" },
      {
        name: "description",
        content:
          "Your recommended campervan conversion across 18 systems, with live budget, weight and one-click cheaper or premium swaps.",
      },
      { property: "og:title", content: "Your Build — Camper Source UK" },
      {
        property: "og:description",
        content: "Live budget, weight and instant swaps across every system in your conversion.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const stored = useBuildStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (stored === null && typeof window !== "undefined") {
      const t = setTimeout(() => {
        if (!window.localStorage.getItem("camper-source-build-v1")) navigate({ to: "/" });
      }, 50);
      return () => clearTimeout(t);
    }
    return;
  }, [stored, navigate]);

  const build = useMemo(() => (stored ? recommend(stored.config) : null), [stored]);

  if (!stored || !build) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading your build…</p>
      </main>
    );
  }

  const config = stored.config;
  const resolved = { ...build };
  for (const [cat, id] of Object.entries(stored.overrides)) {
    const p = PRODUCTS.find((x) => x.id === id);
    if (p) {
      resolved[cat as CategoryId] = {
        product: p,
        reason: "You chose this yourself, swapping the recommended option.",
      };
    }
  }

  const { cost, weight } = totals(resolved, config);
  const diff = config.budget - cost;
  const over = diff < 0;
  const savings = over ? savingSuggestions(resolved, config) : [];

  const groups = ["Shell & Comfort", "Power", "Water", "Living"] as const;

  return (
    <main className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-20 border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto max-w-6xl px-5 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="label-caps">
                {config.make} {config.model} · {config.wheelbase} · {config.occupants} berth
              </p>
              <div className="mt-1 flex flex-wrap items-baseline gap-x-5 gap-y-1">
                <span className="font-display text-2xl font-bold">{money(cost)}</span>
                <span className="text-sm text-muted-foreground">
                  of {money(config.budget)} budget
                </span>
                <span className="text-sm text-muted-foreground">≈ {weight} kg</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-semibold",
                  over ? "bg-destructive/10 text-destructive" : "bg-olive/12 text-olive-deep",
                )}
              >
                {over ? `Build is ${money(-diff)} over budget` : `${money(diff)} remaining`}
              </span>
              <button
                type="button"
                onClick={resetOverrides}
                className="rounded-md border border-border px-3 py-2 text-sm font-medium hover:bg-sand"
              >
                Reset swaps
              </button>
              <Link
                to="/summary"
                className="rounded-md bg-ember px-4 py-2 text-sm font-semibold text-accent-foreground"
              >
                Build summary
              </Link>
            </div>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary">
            <div
              className={cn("h-full transition-all", over ? "bg-destructive" : "bg-olive")}
              style={{ width: `${Math.min(100, (cost / config.budget) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {over && savings.length ? (
        <div className="mx-auto mt-5 max-w-6xl px-5">
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
            <p className="text-sm font-semibold">Ways to get back on budget</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {savings.map((s) => (
                <button
                  key={s.category.id}
                  onClick={() => setOverride(s.category.id, s.to.id)}
                  className="rounded-md border border-border bg-card p-3 text-left hover:border-olive"
                >
                  <span className="label-caps">{s.category.name}</span>
                  <span className="mt-1 block text-sm font-semibold">Save {money(s.saving)}</span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">{s.to.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {groups.map((group) => (
        <section key={group} className="mx-auto max-w-6xl px-5 pt-10">
          <h2 className="text-lg font-bold">{group}</h2>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {CATEGORIES.filter((c) => c.group === group).map((cat) => {
              const sel = resolved[cat.id];
              const alts = alternatives(cat.id, sel.product, config);
              return (
                <SystemCard
                  key={cat.id}
                  categoryId={cat.id}
                  title={cat.name}
                  blurb={cat.blurb}
                  product={sel.product}
                  reason={sel.reason}
                  price={priceFor(sel.product, config)}
                  cheaper={alts.cheaper}
                  upgrade={alts.upgrade}
                  cheaperDelta={
                    alts.cheaper ? priceFor(sel.product, config) - priceFor(alts.cheaper, config) : 0
                  }
                  upgradeDelta={
                    alts.upgrade ? priceFor(alts.upgrade, config) - priceFor(sel.product, config) : 0
                  }
                />
              );
            })}
          </div>
        </section>
      ))}
    </main>
  );
}

function SystemCard(props: {
  categoryId: CategoryId;
  title: string;
  blurb: string;
  product: Product;
  reason: string;
  price: number;
  cheaper?: Product | undefined;
  upgrade?: Product | undefined;
  cheaperDelta: number;
  upgradeDelta: number;
}) {
  const { product } = props;
  return (
    <article className="flex flex-col rounded-lg border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="label-caps">{props.title}</p>
          <h3 className="mt-1 text-base font-bold">{product.name}</h3>
          <p className="text-xs text-muted-foreground">{product.brand}</p>
        </div>
        <div className="text-right">
          <p className="font-display text-lg font-bold">{props.price ? money(props.price) : "£0"}</p>
          <div className="mt-1">
            <TierPill tier={product.tier} />
          </div>
        </div>
      </div>

      <p className="mt-3 border-l-2 border-ember/60 pl-3 text-sm text-muted-foreground italic">
        {props.reason}
      </p>

      <ul className="mt-3 space-y-1">
        {product.specs.map((s) => (
          <li key={s} className="flex gap-2 text-sm">
            <span className="text-olive">·</span>
            <span>{s}</span>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
        {props.cheaper && props.cheaperDelta > 0 ? (
          <button
            onClick={() => setOverride(props.categoryId, props.cheaper!.id)}
            className="rounded-md border border-border px-3 py-2 text-xs font-semibold hover:border-olive hover:bg-sand"
          >
            Save {money(props.cheaperDelta)} — {props.cheaper.name}
          </button>
        ) : null}
        {props.upgrade && props.upgradeDelta > 0 ? (
          <button
            onClick={() => setOverride(props.categoryId, props.upgrade!.id)}
            className="rounded-md border border-ember/50 bg-ember/10 px-3 py-2 text-xs font-semibold text-ember hover:bg-ember/20"
          >
            Upgrade +{money(props.upgradeDelta)} — {props.upgrade.name}
          </button>
        ) : null}
      </div>
    </article>
  );
}

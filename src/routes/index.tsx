import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { VANS, type BuildConfig, type Climate, type OffGrid, type Usage, type Wheelbase } from "@/data/products";
import { startBuild } from "@/lib/build-store";
import { Field, OptionGroup, money } from "@/components/ui-kit";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Camper Source UK — Campervan Conversion Configurator" },
      {
        name: "description",
        content:
          "Configure a complete UK campervan conversion in minutes: power, heating, water and interior specced to your van, budget and off-grid needs.",
      },
      { property: "og:title", content: "Camper Source UK — Campervan Conversion Configurator" },
      {
        property: "og:description",
        content:
          "Answer ten questions and get a full, costed campervan conversion spec across 18 systems, with swaps and buy links.",
      },
    ],
  }),
  component: Setup,
});

const BUDGET_MIN = 5000;
const BUDGET_MAX = 60000;

const MAKES = Object.keys(VANS);

type FormState = {
  make: string;
  model: string;
  customMake: string;
  customModel: string;
  wheelbase: Wheelbase | null;
  occupants: number | null;
  budget: number;
  budgetText: string;
  usage: Usage | null;
  climate: Climate | null;
  offGrid: OffGrid | null;
  shower: boolean | null;
  hotWater: boolean | null;
  gasless: boolean | null;
};

const initial: FormState = {
  make: "",
  model: "",
  customMake: "",
  customModel: "",
  wheelbase: null,
  occupants: null,
  budget: 18000,
  budgetText: "18000",
  usage: null,
  climate: null,
  offGrid: null,
  shower: null,
  hotWater: null,
  gasless: null,
};

function validate(f: FormState) {
  const e: Partial<Record<keyof FormState, string>> = {};
  if (!f.make) e.make = "Choose a van make, or pick 'Other'.";
  if (f.make === "Other") {
    if (!f.customMake.trim()) e.customMake = "Enter the make of your van.";
    if (!f.customModel.trim()) e.customModel = "Enter the model of your van.";
  } else if (f.make && !f.model) {
    e.model = "Choose a model.";
  }
  if (!f.wheelbase) e.wheelbase = "Select your wheelbase.";
  if (!f.occupants) e.occupants = "How many people will travel?";
  if (!Number.isFinite(f.budget) || f.budget < BUDGET_MIN)
    e.budget = `Minimum realistic conversion budget is ${money(BUDGET_MIN)}.`;
  else if (f.budget > 250000) e.budget = "That looks like a typo — enter a budget under £250,000.";
  if (!f.usage) e.usage = "Tell us how you'll use the van.";
  if (!f.climate) e.climate = "Select the climate you'll travel in.";
  if (!f.offGrid) e.offGrid = "Select your off-grid requirement.";
  if (f.shower === null) e.shower = "Choose yes or no.";
  if (f.hotWater === null) e.hotWater = "Choose yes or no.";
  if (f.gasless === null) e.gasless = "Choose yes or no.";
  return e;
}

function Setup() {
  const navigate = useNavigate();
  const [f, setF] = useState<FormState>(initial);
  const [submitted, setSubmitted] = useState(false);

  const errors = validate(f);
  const show = (k: keyof FormState) => (submitted ? errors[k] : undefined);
  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setF((prev) => ({ ...prev, [k]: v }));

  const completed = 10 - Object.keys(errors).length;

  function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    setSubmitted(true);
    if (Object.keys(errors).length) {
      document.querySelector("[data-error='true']")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    const config: BuildConfig = {
      make: f.make === "Other" ? f.customMake.trim() : f.make,
      model: f.make === "Other" ? f.customModel.trim() : f.model,
      wheelbase: f.wheelbase!,
      occupants: f.occupants!,
      budget: Math.round(f.budget),
      usage: f.usage!,
      climate: f.climate!,
      offGrid: f.offGrid!,
      shower: f.shower!,
      hotWater: f.hotWater!,
      gasless: f.gasless!,
    };
    startBuild(config);
    navigate({ to: "/build" });
  }

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-2.5">
            <span className="h-6 w-6 rounded-sm bg-olive" aria-hidden />
            <span className="font-display text-lg font-bold tracking-tight">Camper Source UK</span>
          </div>
          <span className="label-caps hidden sm:block">Conversion Configurator</span>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-5 pt-12 pb-6">
        <p className="label-caps">Step 1 of 3 — Build setup</p>
        <h1 className="mt-3 max-w-2xl text-4xl leading-[1.05] font-extrabold sm:text-5xl">
          Spec your conversion in ten answers.
        </h1>
        <p className="mt-4 max-w-xl text-base text-muted-foreground">
          Tell us about the van and how you'll live in it. We'll select sensible, costed kit across
          all 18 conversion systems — then you can swap anything.
        </p>
      </section>

      <form onSubmit={onSubmit} noValidate className="mx-auto max-w-5xl px-5 pb-40">
        <div className="grid gap-4 md:grid-cols-2">
          {/* Van */}
          <div
            data-error={submitted && !!(errors.make || errors.model || errors.customMake || errors.customModel)}
            className="rounded-lg border border-border bg-card p-5 md:col-span-2"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Van make" error={show("make")}>
                <select
                  value={f.make}
                  onChange={(e) => setF((p) => ({ ...p, make: e.target.value, model: "" }))}
                  className={cn(
                    "h-11 w-full rounded-md border bg-card px-3 text-sm outline-none focus:border-olive focus:ring-2 focus:ring-olive/20",
                    show("make") ? "border-destructive" : "border-border",
                  )}
                >
                  <option value="">Select a make…</option>
                  {MAKES.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                  <option value="Other">Other / custom entry</option>
                </select>
              </Field>

              {f.make === "Other" ? (
                <Field label="Make (custom)" error={show("customMake")}>
                  <input
                    value={f.customMake}
                    maxLength={40}
                    placeholder="e.g. Nissan"
                    onChange={(e) => set("customMake", e.target.value)}
                    className={cn(
                      "h-11 w-full rounded-md border bg-card px-3 text-sm outline-none focus:border-olive focus:ring-2 focus:ring-olive/20",
                      show("customMake") ? "border-destructive" : "border-border",
                    )}
                  />
                </Field>
              ) : (
                <Field label="Model" error={show("model")}>
                  <select
                    value={f.model}
                    disabled={!f.make}
                    onChange={(e) => set("model", e.target.value)}
                    className={cn(
                      "h-11 w-full rounded-md border bg-card px-3 text-sm outline-none disabled:opacity-50 focus:border-olive focus:ring-2 focus:ring-olive/20",
                      show("model") ? "border-destructive" : "border-border",
                    )}
                  >
                    <option value="">{f.make ? "Select a model…" : "Choose a make first"}</option>
                    {(VANS[f.make] ?? []).map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </Field>
              )}

              {f.make === "Other" ? (
                <Field label="Model (custom)" error={show("customModel")} className="sm:col-span-1">
                  <input
                    value={f.customModel}
                    maxLength={40}
                    placeholder="e.g. NV400"
                    onChange={(e) => set("customModel", e.target.value)}
                    className={cn(
                      "h-11 w-full rounded-md border bg-card px-3 text-sm outline-none focus:border-olive focus:ring-2 focus:ring-olive/20",
                      show("customModel") ? "border-destructive" : "border-border",
                    )}
                  />
                </Field>
              ) : null}
            </div>

            <div className="mt-5">
              <Field label="Wheelbase" error={show("wheelbase")}>
                <OptionGroup
                  name="Wheelbase"
                  columns={3}
                  invalid={!!show("wheelbase")}
                  value={f.wheelbase}
                  onChange={(v) => set("wheelbase", v)}
                  options={[
                    { value: "MWB" as Wheelbase, label: "MWB", sub: "Medium — approx 5.4m" },
                    { value: "LWB" as Wheelbase, label: "LWB", sub: "Long — approx 6.0m" },
                    { value: "XLWB" as Wheelbase, label: "XLWB", sub: "Extra long — 6.8m+" },
                  ]}
                />
              </Field>
            </div>
          </div>

          {/* Occupants */}
          <div data-error={submitted && !!errors.occupants} className="rounded-lg border border-border bg-card p-5">
            <Field label="Occupants" hint="Sleeping and travelling" error={show("occupants")}>
              <OptionGroup
                name="Occupants"
                columns={4}
                invalid={!!show("occupants")}
                value={f.occupants}
                onChange={(v) => set("occupants", v)}
                options={[
                  { value: 1, label: "1" },
                  { value: 2, label: "2" },
                  { value: 3, label: "3" },
                  { value: 4, label: "4+" },
                ]}
              />
            </Field>
          </div>

          {/* Budget */}
          <div data-error={submitted && !!errors.budget} className="rounded-lg border border-border bg-card p-5">
            <Field
              label="Conversion budget"
              hint="Parts only, excluding the van"
              error={show("budget")}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-11 flex-1 items-center rounded-md border bg-card px-3",
                    show("budget") ? "border-destructive" : "border-border",
                  )}
                >
                  <span className="mr-1 text-sm text-muted-foreground">£</span>
                  <input
                    inputMode="numeric"
                    value={f.budgetText}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/[^0-9]/g, "").slice(0, 6);
                      setF((p) => ({ ...p, budgetText: raw, budget: Number(raw) }));
                    }}
                    className="w-full bg-transparent text-sm font-semibold outline-none"
                    aria-label="Conversion budget in pounds"
                  />
                </div>
                <span className="text-sm font-semibold text-olive-deep">{money(f.budget || 0)}</span>
              </div>
              <input
                type="range"
                min={BUDGET_MIN}
                max={BUDGET_MAX}
                step={500}
                value={Math.min(Math.max(f.budget || BUDGET_MIN, BUDGET_MIN), BUDGET_MAX)}
                onChange={(e) =>
                  setF((p) => ({ ...p, budget: Number(e.target.value), budgetText: e.target.value }))
                }
                className="mt-3 w-full accent-[var(--ember)]"
                aria-label="Budget slider"
              />
              <div className="mt-2 flex flex-wrap gap-1.5">
                {[8000, 15000, 25000, 40000].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setF((p) => ({ ...p, budget: t, budgetText: String(t) }))}
                    className={cn(
                      "rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                      f.budget === t
                        ? "border-ember bg-ember text-accent-foreground"
                        : "border-border hover:bg-sand",
                    )}
                  >
                    {money(t)}
                  </button>
                ))}
              </div>
            </Field>
          </div>

          {/* Usage */}
          <div data-error={submitted && !!errors.usage} className="rounded-lg border border-border bg-card p-5">
            <Field label="How you'll use it" error={show("usage")}>
              <OptionGroup
                name="Usage"
                value={f.usage}
                invalid={!!show("usage")}
                onChange={(v) => set("usage", v)}
                options={[
                  { value: "weekends" as Usage, label: "Weekends", sub: "1–3 nights" },
                  { value: "holidays" as Usage, label: "Holidays", sub: "1–2 weeks" },
                  { value: "touring" as Usage, label: "Extended touring", sub: "Months at a time" },
                  { value: "fulltime" as Usage, label: "Full-time", sub: "It's home" },
                ]}
              />
            </Field>
          </div>

          {/* Climate */}
          <div data-error={submitted && !!errors.climate} className="rounded-lg border border-border bg-card p-5">
            <Field label="Climate" error={show("climate")}>
              <OptionGroup
                name="Climate"
                columns={3}
                value={f.climate}
                invalid={!!show("climate")}
                onChange={(v) => set("climate", v)}
                options={[
                  { value: "uk" as Climate, label: "UK", sub: "Damp, mild" },
                  { value: "eurosummer" as Climate, label: "Euro summer", sub: "Warm, dry" },
                  { value: "fourseason" as Climate, label: "Four-season", sub: "Ski & winter" },
                ]}
              />
            </Field>
          </div>

          {/* Off-grid */}
          <div data-error={submitted && !!errors.offGrid} className="rounded-lg border border-border bg-card p-5">
            <Field label="Off-grid requirement" error={show("offGrid")}>
              <OptionGroup
                name="Off grid"
                columns={3}
                value={f.offGrid}
                invalid={!!show("offGrid")}
                onChange={(v) => set("offGrid", v)}
                options={[
                  { value: "low" as OffGrid, label: "Low", sub: "Mostly hook-up" },
                  { value: "medium" as OffGrid, label: "Medium", sub: "2–3 nights wild" },
                  { value: "high" as OffGrid, label: "High", sub: "A week+ unplugged" },
                ]}
              />
            </Field>
          </div>

          {/* Yes / no trio */}
          <div className="grid gap-4 rounded-lg border border-border bg-card p-5 md:col-span-2 sm:grid-cols-3">
            <div data-error={submitted && !!errors.shower}>
              <Field label="Shower" hint="Indoor or outdoor" error={show("shower")}>
                <OptionGroup
                  name="Shower"
                  value={f.shower}
                  invalid={!!show("shower")}
                  onChange={(v) => set("shower", v)}
                  options={[
                    { value: true, label: "Yes" },
                    { value: false, label: "No" },
                  ]}
                />
              </Field>
            </div>
            <div data-error={submitted && !!errors.hotWater}>
              <Field label="Hot water" error={show("hotWater")}>
                <OptionGroup
                  name="Hot water"
                  value={f.hotWater}
                  invalid={!!show("hotWater")}
                  onChange={(v) => set("hotWater", v)}
                  options={[
                    { value: true, label: "Yes" },
                    { value: false, label: "No" },
                  ]}
                />
              </Field>
            </div>
            <div data-error={submitted && !!errors.gasless}>
              <Field label="Gasless build" hint="No LPG on board" error={show("gasless")}>
                <OptionGroup
                  name="Gasless"
                  value={f.gasless}
                  invalid={!!show("gasless")}
                  onChange={(v) => set("gasless", v)}
                  options={[
                    { value: true, label: "Yes" },
                    { value: false, label: "No" },
                  ]}
                />
              </Field>
            </div>
          </div>
        </div>

        <div className="fixed inset-x-0 bottom-0 border-t border-border bg-card/95 backdrop-blur">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-5 py-4">
            <div>
              <p className="text-sm font-semibold">
                {completed} of 10 answered
                {submitted && Object.keys(errors).length ? (
                  <span className="ml-2 text-destructive">
                    — {Object.keys(errors).length} still needed
                  </span>
                ) : null}
              </p>
              <div className="mt-2 h-1.5 w-44 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full bg-olive transition-all"
                  style={{ width: `${(completed / 10) * 100}%` }}
                />
              </div>
            </div>
            <button
              type="submit"
              className="rounded-md bg-ember px-6 py-3 text-sm font-semibold text-accent-foreground transition-transform hover:-translate-y-0.5"
            >
              Build My Camper
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}

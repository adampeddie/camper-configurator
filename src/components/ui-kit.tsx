import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Field({
  label,
  hint,
  error,
  children,
  className,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-baseline justify-between gap-3">
        <span className="label-caps">{label}</span>
        {hint ? <span className="text-xs text-muted-foreground">{hint}</span> : null}
      </div>
      {children}
      {error ? (
        <p role="alert" className="text-xs font-medium text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function OptionGroup<T extends string | number | boolean>({
  options,
  value,
  onChange,
  invalid,
  columns = 2,
  name,
}: {
  options: { value: T; label: string; sub?: string }[];
  value: T | null;
  onChange: (v: T) => void;
  invalid?: boolean;
  columns?: 2 | 3 | 4;
  name: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={name}
      className={cn(
        "grid gap-2",
        columns === 2 && "grid-cols-2",
        columns === 3 && "grid-cols-2 sm:grid-cols-3",
        columns === 4 && "grid-cols-2 sm:grid-cols-4",
      )}
    >
      {options.map((o) => {
        const active = value === o.value;
        return (
          <button
            key={String(o.value)}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value)}
            className={cn(
              "rounded-md border px-3 py-2.5 text-left transition-colors",
              active
                ? "border-olive bg-olive text-primary-foreground"
                : "border-border bg-card hover:border-olive/60 hover:bg-sand",
              invalid && !active && "border-destructive/50",
            )}
          >
            <span className="block text-sm font-semibold">{o.label}</span>
            {o.sub ? (
              <span
                className={cn(
                  "mt-0.5 block text-xs",
                  active ? "text-primary-foreground/80" : "text-muted-foreground",
                )}
              >
                {o.sub}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

export function TierPill({ tier }: { tier: "budget" | "standard" | "premium" }) {
  const map = {
    budget: "Value",
    standard: "Balanced",
    premium: "Premium",
  } as const;
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-[11px] font-semibold tracking-wide",
        tier === "premium"
          ? "bg-ember/15 text-ember"
          : tier === "standard"
            ? "bg-olive/15 text-olive-deep"
            : "bg-secondary text-muted-foreground",
      )}
    >
      {map[tier]}
    </span>
  );
}

export function money(n: number) {
  return "£" + n.toLocaleString("en-GB");
}

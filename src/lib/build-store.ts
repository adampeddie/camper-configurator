import { useSyncExternalStore } from "react";
import type { BuildConfig, CategoryId } from "@/data/products";

export type StoredBuild = {
  config: BuildConfig;
  overrides: Partial<Record<CategoryId, string>>;
};

const KEY = "camper-source-build-v1";

let state: StoredBuild | null = null;
let loaded = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function load(): StoredBuild | null {
  if (typeof window === "undefined") return null;
  if (!loaded) {
    loaded = true;
    try {
      const raw = window.localStorage.getItem(KEY);
      state = raw ? (JSON.parse(raw) as StoredBuild) : null;
    } catch {
      state = null;
    }
  }
  return state;
}

function persist() {
  if (typeof window === "undefined") return;
  try {
    if (state) window.localStorage.setItem(KEY, JSON.stringify(state));
    else window.localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

export function startBuild(config: BuildConfig) {
  loaded = true;
  state = { config, overrides: {} };
  persist();
  emit();
}

export function setOverride(category: CategoryId, productId: string) {
  if (!state) return;
  state = { ...state, overrides: { ...state.overrides, [category]: productId } };
  persist();
  emit();
}

export function resetOverrides() {
  if (!state) return;
  state = { ...state, overrides: {} };
  persist();
  emit();
}

export function clearBuild() {
  state = null;
  loaded = true;
  persist();
  emit();
}

export function useBuildStore() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => load(),
    () => null,
  );
}

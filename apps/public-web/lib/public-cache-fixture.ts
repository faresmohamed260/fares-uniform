import { readFileSync, renameSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

type FixtureState = {
  available: boolean;
  counts: Record<string, number>;
};

const statePath = join(tmpdir(), "fares-public-cache-fixture-state.json");

function initialState(): FixtureState {
  return { available: true, counts: {} };
}

function readState(): FixtureState {
  try {
    const parsed = JSON.parse(readFileSync(statePath, "utf8")) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return initialState();
    const record = parsed as Record<string, unknown>;
    if (typeof record.available !== "boolean" || !record.counts || typeof record.counts !== "object" || Array.isArray(record.counts)) {
      return initialState();
    }
    const counts: Record<string, number> = {};
    for (const [key, value] of Object.entries(record.counts as Record<string, unknown>)) {
      if (typeof value === "number" && Number.isInteger(value) && value >= 0) counts[key] = value;
    }
    return { available: record.available, counts };
  } catch {
    return initialState();
  }
}

function writeState(state: FixtureState) {
  const next = `${statePath}.next`;
  writeFileSync(next, JSON.stringify(state), { encoding: "utf8", mode: 0o600 });
  renameSync(next, statePath);
}

export function publicCacheFixtureState(): FixtureState {
  return readState();
}

export function resetPublicCacheFixture() {
  writeState(initialState());
}

export function setPublicCacheFixtureAvailable(available: boolean) {
  const state = readState();
  state.available = available;
  writeState(state);
}

export function recordPublicCacheFixtureRead(key: string) {
  const state = readState();
  state.counts[key] = (state.counts[key] ?? 0) + 1;
  writeState(state);
  return state.available;
}

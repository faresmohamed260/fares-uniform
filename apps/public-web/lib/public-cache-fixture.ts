type FixtureState = {
  available: boolean;
  counts: Record<string, number>;
};

const globalFixture = globalThis as typeof globalThis & {
  __faresPublicCacheFixture?: FixtureState;
};

export function publicCacheFixtureState(): FixtureState {
  if (!globalFixture.__faresPublicCacheFixture) {
    globalFixture.__faresPublicCacheFixture = { available: true, counts: {} };
  }
  return globalFixture.__faresPublicCacheFixture;
}

export function resetPublicCacheFixture() {
  const state = publicCacheFixtureState();
  state.available = true;
  state.counts = {};
}

export function setPublicCacheFixtureAvailable(available: boolean) {
  publicCacheFixtureState().available = available;
}

export function recordPublicCacheFixtureRead(key: string) {
  const state = publicCacheFixtureState();
  state.counts[key] = (state.counts[key] ?? 0) + 1;
  return state.available;
}

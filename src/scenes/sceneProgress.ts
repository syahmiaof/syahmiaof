/** Imperative animation channel; keeps per-frame updates out of the React tree. */
export function createSceneProgress() {
  const listeners = new Set<() => void>();
  return {
    value: 0,
    set(value: number) { this.value = value; this.notify(); },
    notify() { listeners.forEach(listener => listener()); },
    subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; },
  };
}
export type SceneProgress = ReturnType<typeof createSceneProgress>;

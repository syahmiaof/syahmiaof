export type Award = { title: string; event: string; year: string; description: string; evidenceUrl?: string };
// Publish only owner-supplied recognition; the section has an explicit empty state.
export const awards: Award[] = [];

// src/lib/track.ts
export type TrackEvent = {
  type: string;
  payload?: unknown;
  ts?: number;
};

export async function saveTrackEvent(ev: TrackEvent) {
  // TODO: schrijf naar DB / logservice
  // voorbeeld: console.log(ev);
}


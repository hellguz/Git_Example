const BASE = 'https://v6.db.transport.rest';

export interface HafasStop {
  type: 'stop' | 'station';
  id: string;
  name: string;
  location: { latitude: number; longitude: number };
}

export interface HafasJourney {
  legs: {
    departure: string;
    arrival: string;
    origin: { name: string };
    destination: { name: string };
  }[];
}

/** Search for a stop by name. Returns the best match. */
export async function findStop(query: string): Promise<HafasStop | null> {
  try {
    const res = await fetch(
      `${BASE}/locations?query=${encodeURIComponent(query)}&results=3`,
    );
    if (!res.ok) return null;
    const data: HafasStop[] = await res.json();
    return data.find((d) => d.type === 'stop' || d.type === 'station') ?? null;
  } catch {
    return null;
  }
}

/** Get the fastest journey duration in minutes from `fromId` to `toId`. */
export async function getJourneyMinutes(
  fromId: string,
  toId: string,
): Promise<number | null> {
  try {
    const departure = new Date().toISOString();
    const url =
      `${BASE}/journeys?from=${fromId}&to=${toId}&results=5&departure=${encodeURIComponent(departure)}&transfers=10`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data: { journeys?: HafasJourney[] } = await res.json();
    if (!data.journeys?.length) return null;

    let best = Infinity;
    for (const journey of data.journeys) {
      const legs = journey.legs;
      if (!legs.length) continue;
      const dep = new Date(legs[0].departure).getTime();
      const arr = new Date(legs[legs.length - 1].arrival).getTime();
      const minutes = (arr - dep) / 60000;
      if (minutes > 0 && minutes < best) best = minutes;
    }
    return best === Infinity ? null : Math.round(best);
  } catch {
    return null;
  }
}

import type { Station } from '../types';

// These are the stations we query travel times for.
// Coordinates are approximate and will be replaced with API data once found.
// searchName = what we send to the DB locations API
export const STATIONS: Station[] = [
  // ── Thuringia ──────────────────────────────────────────────────────────────
  { name: 'Erfurt Hbf',            searchName: 'Erfurt Hbf',              lat: 50.9991, lng: 11.0369 },
  { name: 'Jena Paradies',         searchName: 'Jena Paradies',           lat: 50.9258, lng: 11.5868 },
  { name: 'Gera Hbf',             searchName: 'Gera Hbf',               lat: 50.8801, lng: 12.0817 },
  { name: 'Eisenach',             searchName: 'Eisenach',                lat: 50.9812, lng: 10.3226 },
  { name: 'Gotha',                searchName: 'Gotha',                   lat: 50.9496, lng: 10.7063 },
  { name: 'Saalfeld',             searchName: 'Saalfeld(Saale)',         lat: 50.6536, lng: 11.3639 },
  { name: 'Nordhausen',           searchName: 'Nordhausen',              lat: 51.5058, lng: 10.7937 },
  { name: 'Apolda',               searchName: 'Apolda',                  lat: 51.0241, lng: 11.5148 },
  { name: 'Altenburg',            searchName: 'Altenburg',               lat: 50.9898, lng: 12.4346 },
  { name: 'Naumburg',             searchName: 'Naumburg(Saale) Hbf',    lat: 51.1589, lng: 11.8050 },
  { name: 'Sangerhausen',         searchName: 'Sangerhausen',            lat: 51.4722, lng: 11.3000 },
  { name: 'Mühlhausen',          searchName: 'Mühlhausen(Thür)',       lat: 51.2148, lng: 10.4605 },
  { name: 'Meiningen',            searchName: 'Meiningen',               lat: 50.5632, lng: 10.4180 },
  { name: 'Sonneberg',            searchName: 'Sonneberg(Thür) Hbf',    lat: 50.3583, lng: 11.1803 },
  { name: 'Bad Salzungen',        searchName: 'Bad Salzungen',           lat: 50.8132, lng: 10.2295 },
  { name: 'Leinefelde',           searchName: 'Leinefelde',              lat: 51.3857, lng: 10.3222 },
  { name: 'Arnstadt',             searchName: 'Arnstadt Hbf',           lat: 50.8359, lng: 10.9427 },
  { name: 'Rudolstadt',           searchName: 'Rudolstadt-Schwarza',    lat: 50.7140, lng: 11.3343 },
  { name: 'Pößneck',             searchName: 'Pößneck ob Bf',          lat: 50.6992, lng: 11.5966 },
  { name: 'Lichtenfels',         searchName: 'Lichtenfels',             lat: 50.1439, lng: 11.0664 },
  { name: 'Coburg',               searchName: 'Coburg',                  lat: 50.2632, lng: 10.9631 },
  { name: 'Hildburghausen',       searchName: 'Hildburghausen',          lat: 50.4270, lng: 10.7290 },
  // ── Nearby regions ────────────────────────────────────────────────────────
  { name: 'Halle (Saale)',        searchName: 'Halle(Saale) Hbf',       lat: 51.4816, lng: 11.9967 },
  { name: 'Leipzig Hbf',          searchName: 'Leipzig Hbf',             lat: 51.3457, lng: 12.3810 },
  { name: 'Magdeburg Hbf',        searchName: 'Magdeburg Hbf',           lat: 52.1301, lng: 11.6267 },
  { name: 'Bamberg',              searchName: 'Bamberg',                 lat: 49.8988, lng: 10.9017 },
  { name: 'Würzburg Hbf',        searchName: 'Würzburg Hbf',           lat: 49.8017, lng: 9.9334  },
  { name: 'Frankfurt Hbf',        searchName: 'Frankfurt(Main) Hbf',    lat: 50.1069, lng: 8.6635  },
  { name: 'Kassel-Wilhelmshöhe', searchName: 'Kassel-Wilhelmshöhe',   lat: 51.3121, lng: 9.4480  },
  { name: 'Göttingen',           searchName: 'Göttingen',              lat: 51.5369, lng: 9.9318  },
  { name: 'Fulda',                searchName: 'Fulda',                   lat: 50.5547, lng: 9.6817  },
  { name: 'Bebra',                searchName: 'Bebra',                   lat: 50.9695, lng: 9.7934  },
  { name: 'Nürnberg Hbf',        searchName: 'Nürnberg Hbf',           lat: 49.4461, lng: 11.0820 },
  { name: 'Dresden Hbf',          searchName: 'Dresden Hbf',             lat: 51.0504, lng: 13.7373 },
  { name: 'Berlin Hbf',           searchName: 'Berlin Hbf',             lat: 52.5251, lng: 13.3694 },
];

export const WEIMAR: Station = {
  name: 'Weimar',
  searchName: 'Weimar',
  lat: 50.9834,
  lng: 11.3232,
};

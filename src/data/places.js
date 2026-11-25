// Map data for the "places" section (extracted from the original WorldMap.jsx).
//
// THE TOUR (Jason, this is the bit you edit):
//   The touring globe (src/components/TourGlobe.jsx) flies between every place that has `tour`
//   set. `tour: 3` means "third stop"; stops are visited in number order, then it loops.
//   `tour: true` also works (those go after the numbered ones, in list order).
//   To drop a stop, delete its `tour` line (or set `tour: false`). To add one, give it a number.
//   The caption shows the place's `name` and `description`.
//   Current tour: Cambridge (home) -> Wyckoff -> London -> Valencia -> Marrakesh -> Kingston
//                 -> Antigua/Atitlan -> the Bay -> back to Cambridge.
//
// Exports:
//   geoUrl               TopoJSON of world countries (world-atlas 110m) for react-simple-maps.
//                        Country features are matched by numeric id ("840") or properties.ISO_A3.
//   cities               Every VISITED place; each has a marker + popup.
//                        { id, name, coordinates: [lon, lat], countryCode: [ISO_A3, ISO_numeric],
//                          description, images: string[], tour?: number | boolean, home?: true }
//   goingSoon            Country codes (ISO_A3 and numeric, mixed) filled as "going" (no markers).
//   bucketList           Country codes (ISO_A3 and numeric, mixed) filled as "bucket list" (no markers).
//   visitedCountryCodes  Set of every code in cities[].countryCode (a country is "visited" if in it).
//   citiesByCountry      { [numeric country code]: city[] }, used for the per-country glow.
//   getCountryCategory   (geo) => 'visited' | 'goingSoon' | 'bucketList' | null for a geography feature.
//   categoryColors       Colors the original map used for each category.
//   mapDefaults          Original projection / size / initial center constants (geoEqualEarth).
//   homePlace            The city with `home: true` (Cambridge / Boston).
//   tourPlaces           Cities with `tour` set, in tour order (see THE TOUR above).

export const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// City data for VISITED places only (with markers and popups)
export const cities = [
  {
    id: 1,
    name: "Wyckoff, NJ",
    coordinates: [-74.1629, 41.0068],
    countryCode: ["USA", "840"],
    description: "I grew up my entire life here, a suburb of NYC.",
    images: [],
    tour: 2,
  },
  {
    id: 2,
    name: "Charlottesville, VA",
    coordinates: [-78.4767, 38.0293],
    countryCode: ["USA", "840"],
    description: "Wahoowa!",
    images: [],
  },
  {
    id: 3,
    name: "València",
    coordinates: [-0.3763, 39.4699],
    countryCode: ["ESP", "724"],
    description: "I spent a semester abroad here with the two most amazing host parents, shoutout Elena and Enrique.",
    images: [],
    tour: 4,
  },
  {
    id: 4,
    name: "Sevilla",
    coordinates: [-5.9845, 37.3891],
    countryCode: ["ESP", "724"],
    description: "Visited twice, very pretty and fun.",
    images: [],
  },
  {
    id: 5,
    name: "Madrid",
    coordinates: [-3.7038, 40.4168],
    countryCode: ["ESP", "724"],
    description: "Visited many times, got the vibe. I prefer other Spanish cities.",
    images: [],
  },
  {
    id: 6,
    name: "Zahara de la Sierra",
    coordinates: [-5.3920, 36.8406],
    countryCode: ["ESP", "724"],
    description: "2 month workaway summer '25.",
    images: [],
  },
  {
    id: 7,
    name: "London",
    coordinates: [-0.1276, 51.5074],
    countryCode: ["GBR", "826"],
    description: "Visited.",
    images: [],
    tour: 3,
  },
  {
    id: 8,
    name: "Marrakesh",
    coordinates: [-7.9811, 31.6295],
    countryCode: ["MAR", "504"],
    description: "Highlight of trip was playing soccer and rock paper scissors with local kids for an hour.",
    images: [],
    tour: 5,
  },
  {
    id: 9,
    name: "Annecy",
    coordinates: [6.1293, 45.8992],
    countryCode: ["FRA", "250"],
    description: "Beautiful town and awesome hiking.",
    images: [],
  },
  {
    id: 10,
    name: "Geneva",
    coordinates: [6.1432, 46.2044],
    countryCode: ["CHE", "756"],
    description: "Spent just a day here. Super cool (especially the lake), but everything was so expensive.",
    images: [],
  },
  {
    id: 11,
    name: "Rome",
    coordinates: [12.4964, 41.9028],
    countryCode: ["ITA", "380"],
    description: "Fun trip with big group.",
    images: [],
  },
  {
    id: 12,
    name: "Florence",
    coordinates: [11.2558, 43.7696],
    countryCode: ["ITA", "380"],
    description: "Didn't plan anything, wandered around with a friend. Still fun.",
    images: [],
  },
  {
    id: 13,
    name: "Amsterdam",
    coordinates: [4.9041, 52.3676],
    countryCode: ["NLD", "528"],
    description: "Had a local show us around, avoided touristy things for better or for worse.",
    images: [],
  },
  {
    id: 14,
    name: "Kingston",
    coordinates: [-76.7936, 17.9714],
    countryCode: ["JAM", "388"],
    description: "Family vacations.",
    images: [],
    tour: 6,
  },
  {
    id: 15,
    name: "Punta Cana",
    coordinates: [-68.4055, 18.5601],
    countryCode: ["DOM", "214"],
    description: "Family vacation.",
    images: [],
  },
  {
    id: 16,
    name: "Cancun",
    coordinates: [-86.8475, 21.1619],
    countryCode: ["MEX", "484"],
    description: "Family Vacations.",
    images: [],
  },
  {
    id: 17,
    name: "Montreal",
    coordinates: [-73.5673, 45.5017],
    countryCode: ["CAN", "124"],
    description: "Visit 2nd cousins.",
    images: [],
  },
  {
    id: 18,
    name: "East Madison, NH",
    coordinates: [-71.1278, 43.8340],
    countryCode: ["USA", "840"],
    description: "7 week sleepaway camp for 8 summers straight.",
    images: [],
  },
  {
    id: 19,
    name: "Olympic Mountain Range",
    coordinates: [-123.5000, 47.8333],
    countryCode: ["USA", "840"],
    description: "Month long NOLS backpacking trip.",
    images: [],
  },
  {
    id: 20,
    name: "Mt. Pleasant, SC",
    coordinates: [-79.8690, 32.7935],
    countryCode: ["USA", "840"],
    description: "Parents moved south from NJ in late 2025!",
    images: [],
  },
  {
    id: 21,
    name: "Paris",
    coordinates: [2.3522, 48.8566],
    countryCode: ["FRA", "250"],
    description: "Befriended some of the most interesting people I've met, awesome first time solo travelling.",
    images: [],
  },
  {
    id: 22,
    name: "Grand Canyon, AZ",
    coordinates: [-112.1401, 36.0544],
    countryCode: ["USA", "840"],
    description: "Spring break 2025.",
    images: [],
  },
  {
    id: 23,
    name: "Zion National Park, UT",
    coordinates: [-113.0263, 37.2982],
    countryCode: ["USA", "840"],
    description: "Spring break 2025.",
    images: [],
  },
  {
    id: 24,
    name: "Sedona, AZ",
    coordinates: [-111.7610, 34.8697],
    countryCode: ["USA", "840"],
    description: "Spring break 2025.",
    images: [],
  },
  {
    id: 25,
    name: "Antigua, Acatenango & Lago Atitlán",
    coordinates: [-90.7339, 14.5586],
    countryCode: ["GTM", "320"],
    description: "Spring break 2026.",
    images: [],
    tour: 7,
  },
  {
    id: 26,
    name: "Semuc Champey",
    coordinates: [-89.9667, 15.5333],
    countryCode: ["GTM", "320"],
    description: "Spring break 2026.",
    images: [],
  },
  {
    id: 27,
    name: "Tikal & Flores",
    coordinates: [-89.8917, 16.9286],
    countryCode: ["GTM", "320"],
    description: "Spring break 2026.",
    images: [],
  },
  {
    id: 28,
    name: "La Fortuna",
    coordinates: [-84.6453, 10.4706],
    countryCode: ["CRI", "188"],
    description: "May 2026.",
    images: [],
  },
  {
    id: 29,
    name: "Monteverde",
    coordinates: [-84.8260, 10.3010],
    countryCode: ["CRI", "188"],
    description: "May 2026.",
    images: [],
  },
  {
    id: 30,
    name: "Manuel Antonio",
    coordinates: [-84.1370, 9.3920],
    countryCode: ["CRI", "188"],
    description: "May 2026.",
    images: [],
  },
  {
    id: 31,
    name: "Bay",
    coordinates: [-122.3500, 37.8200],
    countryCode: ["USA", "840"],
    description: "Berkeley: Spent a week here in August 2026 for a workshop and conference, met a lot of young AIS folks! San Francisco: Didn't actually explore, only did the Batteries to Bluffs hike shortly after sunset.",
    images: ["/map/SF_hike1.JPG", "/map/SF_hike2.jpg", "/map/SF_hike3.jpg"],
    tour: 8,
  },
  {
    id: 32,
    name: "Cambridge / Boston, MA",
    coordinates: [-71.0942, 42.3601],
    countryCode: ["USA", "840"],
    description: "Moved here Sept 2026 for AI safety field-building.",
    images: [],
    home: true, // where Jason lives now; globes draw this pin differently
    tour: 1,
  },
];

// Countries for going soon and bucket list (solid fill only, no markers)
export const goingSoon = ["ARM", "051"];
export const bucketList = ["IND", "356", "CHN", "156", "MNG", "496", "IDN", "360", "NGA", "566", "KOR", "410"];

export const visitedCountryCodes = new Set(
  cities.flatMap((city) => city.countryCode)
);

// Group cities by country code (numeric code)
export const citiesByCountry = cities.reduce((grouped, city) => {
  const key = city.countryCode[1] || city.countryCode[0];
  (grouped[key] = grouped[key] || []).push(city);
  return grouped;
}, {});

export const getCountryCategory = (geo) => {
  const id = geo.id;
  const iso = geo.properties?.ISO_A3;
  if (visitedCountryCodes.has(id) || visitedCountryCodes.has(iso)) return 'visited';
  if (goingSoon.includes(id) || goingSoon.includes(iso)) return 'goingSoon';
  if (bucketList.includes(id) || bucketList.includes(iso)) return 'bucketList';
  return null;
};

export const categoryColors = {
  visited: '#f4cc67', // marker/glow color; visited country base fill stays `base`
  goingSoon: '#5eb822',
  bucketList: '#A78BFA',
  base: '#374151',
  stroke: '#1F2937',
};

export const mapDefaults = {
  projection: 'geoEqualEarth',
  projectionConfig: { scale: 140, center: [0, 0] },
  width: 800,
  height: 560,
  initialCenter: [8, -34],
};

export const homePlace = cities.find((c) => c.home) || null;

const tourRank = (c) => (typeof c.tour === 'number' ? c.tour : Infinity);
export const tourPlaces = cities
  .map((c, i) => [c, i])
  .filter(([c]) => c.tour)
  .sort((a, b) => tourRank(a[0]) - tourRank(b[0]) || a[1] - b[1])
  .map(([c]) => c);

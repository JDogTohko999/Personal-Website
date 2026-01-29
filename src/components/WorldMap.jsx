import React, { useState, useMemo } from 'react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// City data for VISITED places only (with markers and popups)
const cityData = [
  {
    id: 1,
    name: "Wyckoff, NJ",
    coordinates: [-74.1629, 41.0068],
    countryCode: ["USA", "840"],
    description: "I grew up my entire life here, a suburb of NYC.",
    images: [],
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
    name: "Valencia",
    coordinates: [-0.3763, 39.4699],
    countryCode: ["ESP", "724"],
    description: "I spent a semester abroad here with the two most amazing host parents, shoutout Elena and Enrique.",
    images: [],
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
  },
  {
    id: 8,
    name: "Marrakesh",
    coordinates: [-7.9811, 31.6295],
    countryCode: ["MAR", "504"],
    description: "Highlight of trip was playing rock paper scissors and soccer with local kids for an hour.",
    images: [],
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
];

// Countries for going soon and bucket list (solid fill only, no markers)
const goingSoon = ["ARM", "051", "GTM", "320"];
const bucketList = ["IND", "356", "CHN", "156", "MNG", "496", "IDN", "360", "NGA", "566", "KOR", "410"];

// Get visited country codes from cityData
const getVisitedCountryCodes = () => {
  const codes = new Set();
  cityData.forEach(city => city.countryCode.forEach(code => codes.add(code)));
  return codes;
};

// Group cities by country code
const getCitiesByCountry = () => {
  const grouped = {};
  cityData.forEach(city => {
    const key = city.countryCode[1] || city.countryCode[0];
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(city);
  });
  return grouped;
};

const WorldMap = () => {
  const [selectedCity, setSelectedCity] = useState(null);
  const [tooltipCity, setTooltipCity] = useState(null);
  const [zoom, setZoom] = useState(1);

  const visitedCountryCodes = useMemo(() => getVisitedCountryCodes(), []);
  const citiesByCountry = useMemo(() => getCitiesByCountry(), []);

  // Handle zoom changes
  const handleMoveEnd = (pos) => {
    if (pos.zoom && pos.zoom > 0) {
      setZoom(pos.zoom);
    }
  };

  // Calculate sizes based on zoom
  const baseOuter = 5;
  const baseInner = 3;
  const baseGlow = 30; // Base glow radius
  const scale = Math.max(0.4, 1 / Math.sqrt(Math.max(1, zoom)));
  const markerSize = {
    outer: Math.max(2, baseOuter * scale),
    inner: Math.max(1.5, baseInner * scale),
    stroke: Math.max(0.5, 1 * scale),
    glow: baseGlow * scale
  };

  const getCountryCategory = (geo) => {
    const id = geo.id;
    const iso = geo.properties?.ISO_A3;

    if (visitedCountryCodes.has(id) || visitedCountryCodes.has(iso)) return "visited";
    if (goingSoon.includes(id) || goingSoon.includes(iso)) return "goingSoon";
    if (bucketList.includes(id) || bucketList.includes(iso)) return "bucketList";
    return null;
  };

  return (
    <section id="map" className="py-20 bg-portfolio-bg overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">World Map</h2>
          <div className="w-20 h-1 bg-portfolio-gold mx-auto rounded-full mb-8"></div>

          <div className="flex justify-center gap-6 mb-8 flex-wrap">
            <div className="flex items-center">
              <span className="w-4 h-4 bg-portfolio-gold rounded-full mr-2"></span>
              <span className="text-gray-300">Been</span>
            </div>
            <div className="flex items-center">
              <span className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: '#5eb822' }}></span>
              <span className="text-gray-300">Going</span>
            </div>
            <div className="flex items-center">
              <span className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: '#A78BFA' }}></span>
              <span className="text-gray-300">Bucket</span>
            </div>
          </div>
          <p className="text-gray-400 text-sm">Click on a city marker to learn more</p>
        </motion.div>

        <div className="w-full h-[560px] border border-gray-800 rounded-2xl bg-portfolio-card shadow-2xl overflow-hidden relative cursor-grab active:cursor-grabbing">
          <ComposableMap
            projection="geoEqualEarth"
            projectionConfig={{ scale: 140, center: [0, 0] }}
            width={800}
            height={560}
          >
            <ZoomableGroup onMoveEnd={handleMoveEnd}>
              <Geographies geography={geoUrl}>
                {({ geographies, path }) => (
                  <>
                    {/* Define clipPaths for visited countries */}
                    <defs>
                      {geographies
                        .filter(geo => visitedCountryCodes.has(geo.id) || visitedCountryCodes.has(geo.properties?.ISO_A3))
                        .map(geo => (
                          <clipPath key={`clip-${geo.id}`} id={`clip-${geo.id}`}>
                            <path d={path(geo)} />
                          </clipPath>
                        ))}

                      {/* Radial gradient for glow effect */}
                      <radialGradient id="cityGlow">
                        <stop offset="0%" stopColor="#f4cc67" stopOpacity="0.8" />
                        <stop offset="30%" stopColor="#f4cc67" stopOpacity="0.5" />
                        <stop offset="60%" stopColor="#f4cc67" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#f4cc67" stopOpacity="0" />
                      </radialGradient>
                    </defs>

                    {/* Render countries */}
                    {geographies.map((geo) => {
                      const category = getCountryCategory(geo);

                      let fill = "#374151";
                      if (category === "visited") {
                        fill = "#374151"; // Base color, glow will be added separately
                      } else if (category === "goingSoon") {
                        fill = "#5eb822";
                      } else if (category === "bucketList") {
                        fill = "#A78BFA";
                      }

                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill={fill}
                          stroke="#1F2937"
                          strokeWidth={0.5}
                          style={{
                            default: { outline: "none" },
                            hover: {
                              outline: "none",
                              opacity: 0.85,
                              filter: category ? "brightness(1.15)" : "none"
                            },
                            pressed: { outline: "none" },
                          }}
                        />
                      );
                    })}

                    {/* Render glow circles clipped to country borders */}
                    {geographies
                      .filter(geo => visitedCountryCodes.has(geo.id) || visitedCountryCodes.has(geo.properties?.ISO_A3))
                      .map(geo => {
                        const countryCities = citiesByCountry[geo.id] || [];

                        return (
                          <g key={`glow-group-${geo.id}`} clipPath={`url(#clip-${geo.id})`}>
                            {countryCities.map(city => (
                              <Marker key={`glow-${city.id}`} coordinates={city.coordinates}>
                                <circle
                                  r={markerSize.glow}
                                  fill="url(#cityGlow)"
                                />
                              </Marker>
                            ))}
                          </g>
                        );
                      })}
                  </>
                )}
              </Geographies>

              {/* City Markers (on top of everything) */}
              {cityData.map((city) => (
                <Marker
                  key={city.id}
                  coordinates={city.coordinates}
                  onMouseEnter={() => setTooltipCity(city)}
                  onMouseLeave={() => setTooltipCity(null)}
                  onClick={() => setSelectedCity(city)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Outer glow */}
                  <circle
                    r={markerSize.outer}
                    fill={tooltipCity?.id === city.id ? "#ffffff" : "#f4cc67"}
                    fillOpacity={tooltipCity?.id === city.id ? 0.5 : 0.3}
                    style={{ cursor: 'pointer', transition: 'fill 0.2s, fill-opacity 0.2s' }}
                  />
                  {/* Inner circle */}
                  <circle
                    r={markerSize.inner}
                    fill={tooltipCity?.id === city.id ? "#ffffff" : "#f4cc67"}
                    stroke="#fff"
                    strokeWidth={markerSize.stroke}
                    style={{ cursor: 'pointer', transition: 'fill 0.2s' }}
                  />
                </Marker>
              ))}
            </ZoomableGroup>
          </ComposableMap>

          {/* Tooltip */}
          <AnimatePresence>
            {tooltipCity && !selectedCity && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute top-4 left-4 bg-black/80 backdrop-blur px-3 py-2 rounded-lg text-sm text-white pointer-events-none"
              >
                {tooltipCity.name}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Interactive Map label */}
          <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur px-4 py-2 rounded text-xs text-gray-400 pointer-events-none">
            Scroll to zoom • Drag to pan
          </div>
        </div>

        {/* City Detail Modal */}
        <AnimatePresence>
          {selectedCity && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-4"
              onClick={() => setSelectedCity(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-portfolio-card border border-portfolio-border rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-portfolio-border">
                  <div>
                    <h3 className="text-xl font-bold text-white">{selectedCity.name}</h3>
                    <span className="text-xs px-2 py-1 rounded-full mt-1 inline-block bg-portfolio-gold/30 text-portfolio-gold">
                      Visited
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedCity(null)}
                    className="p-2 hover:bg-portfolio-border rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4">
                  <p className="text-gray-300 mb-4">{selectedCity.description}</p>

                  {/* Images */}
                  {selectedCity.images && selectedCity.images.length > 0 && (
                    <div className="grid grid-cols-2 gap-2">
                      {selectedCity.images.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`${selectedCity.name} ${idx + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  )}

                  {(!selectedCity.images || selectedCity.images.length === 0) && (
                    <div className="text-center py-8 text-gray-500 text-sm border border-dashed border-gray-700 rounded-lg">
                      No images added yet
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default WorldMap;

import React, { useState, useMemo } from 'react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// City data for VISITED places only (with markers and popups)
const cityData = [
  {
    id: 1,
    name: "New York City",
    coordinates: [-74.006, 40.7128],
    countryCode: ["USA", "840"],
    description: "Add your description here - what did you do in NYC?",
    images: [],
  },
  {
    id: 2,
    name: "Kingston",
    coordinates: [-76.7936, 17.9714],
    countryCode: ["JAM", "388"],
    description: "Add your Jamaica experience here.",
    images: [],
  },
  {
    id: 3,
    name: "Madrid",
    coordinates: [-3.7038, 40.4168],
    countryCode: ["ESP", "724"],
    description: "Add your Spain experience here.",
    images: [],
  },
  {
    id: 4,
    name: "Paris",
    coordinates: [2.3522, 48.8566],
    countryCode: ["FRA", "250"],
    description: "Add your Paris experience here.",
    images: [],
  },
  {
    id: 5,
    name: "Zurich",
    coordinates: [8.5417, 47.3769],
    countryCode: ["CHE", "756"],
    description: "Add your Switzerland experience here.",
    images: [],
  },
  {
    id: 6,
    name: "Rome",
    coordinates: [12.4964, 41.9028],
    countryCode: ["ITA", "380"],
    description: "Add your Italy experience here.",
    images: [],
  },
  {
    id: 7,
    name: "London",
    coordinates: [-0.1276, 51.5074],
    countryCode: ["GBR", "826"],
    description: "Add your London experience here.",
    images: [],
  },
  {
    id: 8,
    name: "Santo Domingo",
    coordinates: [-69.9312, 18.4861],
    countryCode: ["DOM", "214"],
    description: "Add your Dominican Republic experience here.",
    images: [],
  },
  {
    id: 9,
    name: "Mexico City",
    coordinates: [-99.1332, 19.4326],
    countryCode: ["MEX", "484"],
    description: "Add your Mexico experience here.",
    images: [],
  },
  {
    id: 10,
    name: "Toronto",
    coordinates: [-79.3832, 43.6532],
    countryCode: ["CAN", "124"],
    description: "Add your Canada experience here.",
    images: [],
  },
  {
    id: 11,
    name: "Amsterdam",
    coordinates: [4.9041, 52.3676],
    countryCode: ["NLD", "528"],
    description: "Add your Netherlands experience here.",
    images: [],
  },
  {
    id: 12,
    name: "Marrakech",
    coordinates: [-7.9811, 31.6295],
    countryCode: ["MAR", "504"],
    description: "Add your Morocco experience here.",
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

const WorldMap = () => {
  const [selectedCity, setSelectedCity] = useState(null);
  const [tooltipCity, setTooltipCity] = useState(null);

  const visitedCountryCodes = useMemo(() => getVisitedCountryCodes(), []);

  // Group cities by country for gradient rendering
  const visitedCitiesByCountry = useMemo(() => {
    const grouped = {};
    cityData.forEach(city => {
      const key = city.countryCode[1] || city.countryCode[0];
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(city);
    });
    return grouped;
  }, []);

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
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">World</h2>
          <div className="w-20 h-1 bg-portfolio-gold mx-auto rounded-full mb-8"></div>

          <div className="flex justify-center gap-6 mb-8 flex-wrap">
            <div className="flex items-center">
              <span className="w-4 h-4 bg-portfolio-gold rounded-full mr-2"></span>
              <span className="text-gray-300">Visited</span>
            </div>
            <div className="flex items-center">
              <span className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: '#5eb822' }}></span>
              <span className="text-gray-300">Going Soon</span>
            </div>
            <div className="flex items-center">
              <span className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: '#A78BFA' }}></span>
              <span className="text-gray-300">Bucket List</span>
            </div>
          </div>
          <p className="text-gray-400 text-sm">Click on a city marker to learn more</p>
        </motion.div>

        <div className="w-full h-[650px] border border-gray-800 rounded-2xl bg-portfolio-card shadow-2xl overflow-hidden relative">
          <ComposableMap projection="geoEqualEarth" projectionConfig={{ scale: 160, center: [0, -20] }}>
            <defs>
              {/* Create radial gradients for visited countries */}
              {Object.entries(visitedCitiesByCountry).map(([countryCode]) => (
                <radialGradient
                  key={`gradient-${countryCode}`}
                  id={`gradient-${countryCode}`}
                  cx="50%"
                  cy="50%"
                  r="80%"
                >
                  <stop offset="0%" stopColor="#f4cc67" stopOpacity="1" />
                  <stop offset="30%" stopColor="#f4cc67" stopOpacity="0.8" />
                  <stop offset="60%" stopColor="#f4cc67" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#f4cc67" stopOpacity="0.2" />
                </radialGradient>
              ))}
            </defs>

            <ZoomableGroup>
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const category = getCountryCategory(geo);
                    const isVisited = category === "visited";

                    let fill = "#374151";
                    if (isVisited) {
                      fill = `url(#gradient-${geo.id})`;
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
                  })
                }
              </Geographies>

              {/* City Markers (visited only) */}
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
                  <circle r={5} fill="#f4cc67" fillOpacity={0.3} />
                  {/* Inner circle */}
                  <circle r={3} fill="#f4cc67" stroke="#fff" strokeWidth={1} />
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

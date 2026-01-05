import React from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { motion } from 'framer-motion';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Visited countries list (ISO 3166-1 alpha-3 codes ideally, or just names to matching logic)
// For simplicity in this demo, we'll style based on IDs or props if we had them.
// Here we'll just style specific 'visited' countries by ID array.
const visitedCountries = ["USA", "GBR", "FRA", "DEU", "JPN", "AUS"]; 
const bucketList = ["ITA", "BRA", "EGY"];

const WorldMap = () => {
  return (
    <section id="map" className="py-20 bg-portfolio-bg overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Where I've Been</h2>
          <div className="w-20 h-1 bg-portfolio-gold mx-auto rounded-full mb-8"></div>
          
          <div className="flex justify-center gap-8 mb-8">
            <div className="flex items-center">
              <span className="w-4 h-4 bg-portfolio-gold rounded-full mr-2"></span>
              <span className="text-gray-300">Visited</span>
            </div>
            <div className="flex items-center">
              <span className="w-4 h-4 bg-portfolio-green rounded-full mr-2"></span>
              <span className="text-gray-300">Bucket List</span>
            </div>
          </div>
        </motion.div>

        <div className="w-full h-[500px] border border-gray-800 rounded-2xl bg-portfolio-card shadow-2xl overflow-hidden relative">
          <ComposableMap projection="geoMercator" projectionConfig={{ scale: 140 }}>
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const isVisited = visitedCountries.includes(geo.properties.ISO_A3) || visitedCountries.includes(geo.id);
                  const isBucket = bucketList.includes(geo.properties.ISO_A3) || bucketList.includes(geo.id);
                  
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={isVisited ? "#D4AF37" : isBucket ? "#1A3C34" : "#374151"}
                      stroke="#1F2937"
                      strokeWidth={0.5}
                      style={{
                        default: { outline: "none" },
                        hover: { fill: isVisited ? "#B5952F" : isBucket ? "#142F29" : "#4B5563", outline: "none" },
                        pressed: { outline: "none" },
                      }}
                    />
                  );
                })
              }
            </Geographies>
            {/* Example Marker for Home */}
             <Marker coordinates={[-74.006, 40.7128]}>
              <circle r={4} fill="#FFFFFF" />
            </Marker>
          </ComposableMap>
          
          {/* Fallback/Overlay Text if Map fails to load or for mobile context */}
          <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur px-4 py-2 rounded text-xs text-gray-400 pointer-events-none">
            Interactive Map
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorldMap;

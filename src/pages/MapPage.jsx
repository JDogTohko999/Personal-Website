import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import TourGlobe from '../components/TourGlobe.jsx';
import Lightbox from '../components/Lightbox.jsx';
import { full, thumb } from '../components/webImage.js';
import { cities, homePlace, tourPlaces } from '../data/places.js';
import { placesByCountry, stats } from '../lib/geo.js';
import useTitle from '../lib/useTitle.js';

/*
  Reference /map page: a large touring globe, then every place grouped by country. Clicking a
  place (in the list or on the globe) flies there and shows its description; the Bay shows the
  SF photos (thumbs, full image on click). ?place=<id> selects on arrival.
  ?motion=reduce forces the reduced-motion path (handy for checking it).
  Styling is deliberately plain; builders restyle.
*/
export default function MapPage() {
  useTitle('Map');
  const [params, setParams] = useSearchParams();
  const globeRef = useRef(null);
  const detailRef = useRef(null);
  const [box, setBox] = useState(null);

  const selectedId = Number(params.get('place')) || null;
  const selected = useMemo(() => cities.find((c) => c.id === selectedId) || null, [selectedId]);
  const reduced = params.get('motion') === 'reduce' ? true : undefined;

  const select = useCallback((place) => {
    const next = new URLSearchParams(params);
    if (place) next.set('place', String(place.id));
    else next.delete('place');
    setParams(next, { replace: true });
  }, [params, setParams]);

  return (
    <>
      <h1>Places</h1>
      <p className="muted">
        {stats.places} places in {stats.countries} countries across {stats.continents} continents. The globe tours{' '}
        {tourPlaces.length} of them; hover to pause, drag to look around, click a pin for its story.
      </p>

      <TourGlobe
        ref={globeRef}
        selectedId={selectedId}
        homeId={homePlace?.id}
        zoomable
        reducedMotion={reduced}
        onPick={(place) => select(place)}
        style={{ aspectRatio: 'auto', height: 'min(78vh, 640px, 110vw)', minHeight: 320 }}
      />

      <div ref={detailRef} aria-live="polite" style={{ minHeight: '4rem', marginTop: '1rem' }}>
        {selected ? (
          <section>
            <h2 style={{ marginTop: 0 }}>{selected.name}</h2>
            <p>{selected.description}</p>
            {selected.images.length > 0 && (
              <div className="thumbs">
                {selected.images.map((src, i) => (
                  <button key={src} type="button" onClick={() => setBox(i)} aria-label={`Open photo ${i + 1} of ${selected.images.length}`}>
                    <img src={thumb(src)} alt="" loading="lazy" />
                  </button>
                ))}
              </div>
            )}
            <p className="small">
              <button type="button" className="text-button" onClick={() => select(null)}>Back to the tour</button>
            </p>
          </section>
        ) : (
          <p className="muted small">Pick a place below or on the globe.</p>
        )}
      </div>

      {placesByCountry.map((country) => (
        <section key={country.iso3}>
          <h3>{country.name}</h3>
          <ul className="plain-list">
            {country.places.map((place) => (
              <li key={place.id} style={{ marginBottom: '0.35rem' }}>
                <button
                  type="button"
                  className="text-button"
                  aria-pressed={place.id === selectedId}
                  style={place.id === selectedId ? { color: 'var(--text)', textDecoration: 'none', fontWeight: 600 } : undefined}
                  onClick={() => {
                    select(place);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  {place.name}
                </button>
                {place.home && <span className="muted small"> · home</span>}
                {place.tour && <span className="muted small"> · on the tour</span>}
              </li>
            ))}
          </ul>
        </section>
      ))}

      {box != null && selected && (
        <Lightbox
          images={selected.images.map(full)}
          index={box}
          alt={`${selected.name} photo`}
          onClose={() => setBox(null)}
          onStep={(d) => setBox((i) => (i + d + selected.images.length) % selected.images.length)}
        />
      )}
    </>
  );
}

import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import TourGlobe from '../components/TourGlobe.jsx';
import Photos from '../components/Photos.jsx';
import { cities, homePlace, tourPlaces } from '../data/places.js';
import { placesByCountry } from '../lib/geo.js';
import useTitle from '../lib/useTitle.js';

/*
  /places (alias /map). The framed globe drifts through the tour; under it, the place it is
  passing and what Jason wrote about it; then every place, a word each, grouped by country.
  Picking a word or a pin sets ?place=<id>, flies there and stays. The Bay has photos.
  ?motion=reduce forces the reduced-motion path. Structure borrowed from hearth's MapPage.

  The text under the globe follows the drift but is not a live region (the globe announces
  only places the visitor asked for); between places it dims rather than going stale.
*/
const finePointer = () => typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches;
const stillMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function Moving({ moving, onChange }) {
  useEffect(() => { onChange(moving); }, [moving, onChange]);
  return null;
}

export default function MapPage() {
  useTitle('Travels');
  const [params, setParams] = useSearchParams();
  const globe = useRef(null);
  const figure = useRef(null);
  const [stop, setStop] = useState(homePlace || tourPlaces[0] || cities[0]);
  const [paused, setPaused] = useState(false);
  const [moving, setMoving] = useState(false);

  const selectedId = Number(params.get('place')) || null;
  const selected = cities.find((c) => c.id === selectedId) || null;
  const shown = selected || stop;
  const forced = params.get('motion') === 'reduce' ? true : undefined;
  const still = forced || stillMotion();

  const pick = (place) => {
    const next = new URLSearchParams(params);
    if (place) next.set('place', String(place.id));
    else next.delete('place');
    setParams(next, { replace: true, preventScrollReset: true });
    if (place) figure.current?.scrollIntoView({ block: 'nearest', behavior: still ? 'auto' : 'smooth' });
  };
  const step = (dir) => {
    if (dir > 0) globe.current?.next();
    else globe.current?.prev();
    if (selected) pick(null);
  };
  const arrive = (place) => {
    setStop(place);
    if (selected && place && place.id !== selected.id) pick(null);
  };
  const toggle = () => {
    if (paused) globe.current?.play();
    else globe.current?.pause();
    setPaused(!paused);
  };

  return (
    <>
      <h1 className="page-title" style={{ marginBottom: "1.5rem" }}>Travels</h1>

      <figure ref={figure} style={{ margin: 0 }}>
        <TourGlobe
          ref={globe}
          aspect="4 / 3"
          showControls={false}
          classNames={{ frame: 'globe-frame' }}
          zoomable={finePointer()}
          reducedMotion={forced}
          selectedId={selected ? selected.id : null}
          onStop={arrive}
          onPick={pick}
          renderCaption={(_, { moving: m }) => <Moving moving={m} onChange={setMoving} />}
        />
        <figcaption>
          <p className="map-controls">
            <button type="button" className="word" onClick={() => step(-1)}>previous</button>
            <button type="button" className="word" onClick={() => step(1)}>next</button>
            {!still && (selected ? (
              <button type="button" className="word" onClick={() => pick(null)}>back to the tour</button>
            ) : (
              <button type="button" className="word" onClick={toggle}>{paused ? 'play' : 'pause'}</button>
            ))}
          </p>
          {shown && (
            <div className="map-shown" data-moving={(!selected && moving) || undefined}>
              <h2 className="map-place">{shown.name}</h2>
              <p>{shown.description}</p>
              {shown.images?.length > 0 && <Photos images={shown.images} alt={shown.name} />}
            </div>
          )}
          <ul className="plain map-key" aria-label="Country colours">
            <li><i style={{ background: 'var(--globe-glow)' }} />been</li>
            <li><i style={{ background: 'var(--globe-pin-home)' }} />home</li>
            <li><i style={{ background: 'var(--globe-bucket)' }} />someday</li>
          </ul>
        </figcaption>
      </figure>

      <div className="countries">
        {placesByCountry.map((country) => (
          <section key={country.iso3}>
            <h3>{country.name}</h3>
            <ul className="plain">
              {country.places.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    className="place-word"
                    aria-pressed={selectedId === p.id}
                    onClick={() => pick(selectedId === p.id ? null : p)}
                  >
                    {p.name}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}

import React, { useEffect, useState } from 'react';

/*
  The two-people ridge photo (Jason's crop), full bleed, behind every page (scripts/make-2ppl-bg.py).
  The standing hiker is at (84%, 61%) in the wide crop and (58%, 58%) in the tall one; the seated
  person is at the bottom-left of the wide crop.

  Art direction: the portrait crop below a 4:5 viewport, the wide crop above. object-position
  is the standing hiker's own spot in each crop (84% 61% wide, 58% 58% tall), so with object-fit: cover
  he lands on exactly that fraction of the screen at every size: cover only ever crops, and
  object-position pins that point of the image to the same point of the box.

  mode="home": the whole screen. mode="inner": the photo becomes a short band across the top of
  the page (index.css), framed so the hiker stands two thirds of the way down it.

  Before the photo arrives the box is the sampled sky (#7f8b80), flat and calm, and the photo
  paints over it as it loads (no fade gate). data-ready is still set on load/error/2.5s for any
  styling that wants it. mode="inner" keeps the same full-screen photo (Jason wanted it to fill
  the screen on every page). The grain is a still SVG noise tile over the photo (.grain).
*/
export default function Backdrop({ mode }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (ready) return undefined;
    const t = setTimeout(() => setReady(true), 2500);
    return () => clearTimeout(t);
  }, [ready]);
  return (
    <div className="backdrop" data-mode={mode} data-ready={ready || undefined} aria-hidden="true">
      <picture>
        <source
          media="(max-aspect-ratio: 4/5)"
          srcSet="/bg4/twoppl-tall-933.jpg?v=3 933w, /bg4/twoppl-tall-1170.jpg?v=3 1170w"
          sizes="100vw"
        />
        <img
          className="backdrop-photo"
          src="/bg4/twoppl-wide-1375.jpg?v=3"
          srcSet="/bg4/twoppl-wide-800.jpg?v=3 800w, /bg4/twoppl-wide-1375.jpg?v=3 1375w, /bg4/twoppl-wide-1920.jpg?v=3 1920w"
          sizes="100vw"
          alt=""
          fetchpriority="high"
          decoding="async"
          ref={(el) => { if (el?.complete && el.naturalWidth && !ready) setReady(true); }}
          onLoad={() => setReady(true)}
          onError={() => setReady(true)}
        />
      </picture>
      <div className="grain" />
    </div>
  );
}

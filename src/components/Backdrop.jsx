import React, { useState } from 'react';

/*
  The hiker-on-the-ridge photo, full bleed, behind every page (public/bg3/README.md).

  Art direction: the portrait crop below a 4:5 viewport, the wide crop above. object-position
  is the hiker's own spot in each crop (62% 76% wide, 61% 71% tall), so with object-fit: cover
  he lands on exactly that fraction of the screen at every size: cover only ever crops, and
  object-position pins that point of the image to the same point of the box.

  mode="home": the whole screen. mode="inner": the same, but below 960px the photo becomes a
  short band at the top of the page (index.css), framed on the hiker.

  The grain is a static-or-drifting SVG noise tile laid over the photo (see .grain in index.css).
*/
export default function Backdrop({ mode }) {
  const [ready, setReady] = useState(false);
  return (
    <div className="backdrop" data-mode={mode} data-ready={ready || undefined} aria-hidden="true">
      <picture>
        <source
          media="(max-aspect-ratio: 4/5)"
          srcSet="/bg3/hiker-tall-760.jpg 760w, /bg3/hiker-tall-1140.jpg 1140w"
          sizes="100vw"
        />
        <img
          className="backdrop-photo"
          src="/bg3/hiker-wide-1310.jpg"
          srcSet="/bg3/hiker-wide-800.jpg 800w, /bg3/hiker-wide-1310.jpg 1310w, /bg3/hiker-wide-1920.jpg 1920w"
          sizes="100vw"
          alt=""
          fetchpriority="high"
          decoding="async"
          ref={(el) => { if (el?.complete && el.naturalWidth && !ready) setReady(true); }}
          onLoad={() => setReady(true)}
        />
      </picture>
      <div className="grain" />
    </div>
  );
}

/*
  Measure text contrast against the photo pixels actually behind it, in the running dev server.

  In the browser console on any page:
    (await import('/scripts/measure-sky.js')).measure()

  Method (after ridge's measure-contrast.js, rewritten for sky):
  1. Redraw the backdrop photo exactly as the page crops it: the <img>'s currentSrc, scaled to
     cover its box, offset by its computed object-position.
  2. The veils (.veil::before radial gradients) are composited over those pixels, from their
     computed geometry and colour stops.
  3. Text on the photo (the home caption; the name and links over the band on narrow inner
     pages): for every text run, look at every pixel under its client rects and compute the WCAG
     ratio of the text colour against it. The grain overlay is included as a worst case: each
     pixel is first pushed the way that hurts dark ink (darker), by the largest step the overlay
     makes (noise value 0.3 at opacity 0.16, overlay blend).
  4. Text on the reading panel (desktop): the panel is rgba(226,229,219,0.9) with a blur. As a
     bound, composite the panel over the DARKEST photo pixel under the text (ignoring the blur,
     which can only average towards lighter neighbours).

  Reports, per text run: min (the single worst pixel), p5 (5th percentile: 95% of the pixels
  behind the text are at least this), and median. Sorted worst first.
*/
const lin = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
const L = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
const rgba = (s) => (s.match(/[\d.]+/g) || []).map(Number);

const GRAIN = { n: 0.3, alpha: 0.16 };
function grainWorst(c) {
  const b = c / 255;
  const o = b < 0.5 ? 2 * b * GRAIN.n : 1 - 2 * (1 - b) * (1 - GRAIN.n);
  return 255 * (b * (1 - GRAIN.alpha) + o * GRAIN.alpha);
}

function pct(sorted, p) {
  return sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * p))];
}

export async function measure() {
  const img = document.querySelector('.backdrop-photo');
  if (!img.complete) await new Promise((ok) => img.addEventListener('load', ok, { once: true }));
  const box = img.getBoundingClientRect();
  const W = innerWidth;
  const H = innerHeight;
  const cv = document.createElement('canvas');
  cv.width = W;
  cv.height = H;
  const ctx = cv.getContext('2d', { willReadFrequently: true });
  const nw = img.naturalWidth;
  const nh = img.naturalHeight;
  const k = Math.max(box.width / nw, box.height / nh);
  const dw = nw * k;
  const dh = nh * k;
  const [px, py] = getComputedStyle(img).objectPosition.split(' ').map((v) => parseFloat(v) / 100);
  const ox = box.left + (box.width - dw) * px;
  const oy = box.top + (box.height - dh) * py;
  ctx.drawImage(img, ox, oy, dw, dh);
  const data = ctx.getImageData(0, 0, W, H).data;
  const raw = (x, y) => { const i = (y * W + x) * 4; return [data[i], data[i + 1], data[i + 2]]; };

  // The veils (.veil::before): a radial-gradient(closest-side, c a0, c a1 55%, c 0) over the photo.
  const veils = [...document.querySelectorAll('.veil')].map((el) => {
    const ps = getComputedStyle(el, '::before');
    if (ps.content === 'none' || ps.display === 'none') return null;
    const r = el.getBoundingClientRect();
    const t = parseFloat(ps.top); const rt = parseFloat(ps.right); const b = parseFloat(ps.bottom); const l = parseFloat(ps.left);
    const x0 = r.left + l; const x1 = r.right - rt; const y0 = r.top + t; const y1 = r.bottom - b;
    const cols = [...ps.backgroundImage.matchAll(/rgba?\(([^)]+)\)/g)].map((m) => m[1].split(',').map(Number));
    const stop = (ps.backgroundImage.match(/\)\s+(\d+)%/) || [0, 55])[1] / 100;
    return { cx: (x0 + x1) / 2, cy: (y0 + y1) / 2, rx: (x1 - x0) / 2, ry: (y1 - y0) / 2, c: cols[0].slice(0, 3), a: [cols[0][3] ?? 1, cols[1][3] ?? 1, cols[2][3] ?? 0], stop };
  }).filter(Boolean);
  const veilAt = (x, y, p) => veils.reduce((px, v) => {
    const d = Math.hypot((x - v.cx) / v.rx, (y - v.cy) / v.ry);
    const a = d <= v.stop ? v.a[0] + (v.a[1] - v.a[0]) * (d / v.stop) : d >= 1 ? v.a[2] : v.a[1] + (v.a[2] - v.a[1]) * ((d - v.stop) / (1 - v.stop));
    return px.map((c, i) => c * (1 - a) + v.c[i] * a);
  }, p);
  const pixel = (x, y) => veilAt(x, y, raw(x, y));

  const panel = document.querySelector('.panel');
  const panelBg = panel ? rgba(getComputedStyle(panel).backgroundColor) : null;
  const panelSolid = panelBg && (panelBg[3] ?? 1) >= 1;

  const roots = [...document.querySelectorAll('.caption, .panel-head, .panel-main')];
  const rows = [];
  for (const root of roots) {
    // The band's name and links sit on the photo only when the head is pulled up over it.
    const onPhoto = root.matches('.caption') || (root.matches('.panel-head') && getComputedStyle(root).position === 'absolute');
    if (!onPhoto && (!panelBg || panelSolid)) continue; // solid panel: checked by the token table
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      if (!n.textContent.trim()) continue;
      const el = n.parentElement;
      const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || cs.display === 'none' || el.closest('.jasoning-frame, .photos, [hidden]')) continue;
      const lt = L(rgba(cs.color));
      const range = document.createRange();
      range.selectNodeContents(n);
      const ratios = [];
      for (const r of range.getClientRects()) {
        const x0 = Math.max(0, Math.floor(r.left)); const x1 = Math.min(W - 1, Math.ceil(r.right));
        const y0 = Math.max(0, Math.floor(r.top)); const y1 = Math.min(H - 1, Math.ceil(r.bottom));
        if (x1 <= x0 || y1 <= y0) continue;
        if (onPhoto) {
          for (let y = y0; y <= y1; y += 1) {
            for (let x = x0; x <= x1; x += 1) ratios.push(ratio(lt, L(pixel(x, y).map(grainWorst))));
          }
        } else {
          let dark = null; let dl = Infinity;
          for (let y = y0; y <= y1; y += 2) {
            for (let x = x0; x <= x1; x += 2) { const p = raw(x, y); const l = L(p); if (l < dl) { dl = l; dark = p; } }
          }
          const a = panelBg[3] ?? 1;
          ratios.push(ratio(lt, L(dark.map((c, i) => c * (1 - a) + panelBg[i] * a))));
        }
      }
      if (!ratios.length) continue;
      ratios.sort((a, b) => a - b);
      rows.push({
        text: n.textContent.trim().slice(0, 32),
        where: onPhoto ? 'photo' : 'panel',
        min: +ratios[0].toFixed(2),
        p5: +pct(ratios, 0.05).toFixed(2),
        median: +pct(ratios, 0.5).toFixed(2),
      });
    }
  }
  rows.sort((a, b) => a.min - b.min);
  const photo = rows.filter((r) => r.where === 'photo');
  const onPanel = rows.filter((r) => r.where === 'panel');
  const lo = (list, key) => (list.length ? Math.min(...list.map((r) => r[key])) : null);
  return {
    viewport: `${W}x${H}`,
    src: img.currentSrc.split('/').pop(),
    objectPosition: getComputedStyle(img).objectPosition,
    veils: veils.length,
    photo: { count: photo.length, min: lo(photo, 'min'), p5: lo(photo, 'p5'), median: lo(photo, 'median') },
    panel: { count: onPanel.length, min: lo(onPanel, 'min') },
    worst: rows.slice(0, 6),
  };
}

/* Where the hiker lands on screen (the brief's check): his spot in the crop (62%,76% wide;
   61%,71% tall) mapped through the same cover + object-position. */
export function hiker() {
  const img = document.querySelector('.backdrop-photo');
  const box = img.getBoundingClientRect();
  const tall = img.naturalHeight > img.naturalWidth;
  const [hx, hy] = tall ? [0.61, 0.71] : [0.62, 0.76];
  const k = Math.max(box.width / img.naturalWidth, box.height / img.naturalHeight);
  const dw = img.naturalWidth * k; const dh = img.naturalHeight * k;
  const [px, py] = getComputedStyle(img).objectPosition.split(' ').map((v) => parseFloat(v) / 100);
  const x = box.left + (box.width - dw) * px + hx * dw;
  const y = box.top + (box.height - dh) * py + hy * dh;
  const cover = [...document.querySelectorAll('.caption, .panel-head, .panel')].find((el) => {
    const r = el.getBoundingClientRect();
    return x >= r.left - 12 && x <= r.right + 12 && y >= r.top - 12 && y <= r.bottom + 12 && getComputedStyle(el).position !== 'static' && el.matches('.caption, .panel-head') ;
  });
  const panel = document.querySelector('.panel');
  const pr = panel?.getBoundingClientRect();
  const underPanel = !!(pr && x >= pr.left && x <= pr.right && y >= pr.top && y <= pr.bottom);
  return {
    viewport: `${innerWidth}x${innerHeight}`,
    hiker: [Math.round(x), Math.round(y)],
    asFraction: [+(x / innerWidth).toFixed(3), +(y / innerHeight).toFixed(3)],
    inFrame: x > 0 && x < innerWidth && y > 0 && y < innerHeight,
    hiddenByText: !!cover,
    underPanel,
    scale: +k.toFixed(3),
  };
}

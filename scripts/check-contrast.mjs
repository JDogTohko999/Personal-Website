#!/usr/bin/env node
/*
  Contrast check for src/theme/themes.css.

    node scripts/check-contrast.mjs            # table of every pair, exits 1 if any is < 4.5
    node scripts/check-contrast.mjs --min 7    # stricter threshold

  It parses every `[data-theme='id'] { ... }` block (a block may list several selectors), checks
  that each palette defines every required token, that the legacy --portfolio-* mapping is
  complete, and prints the WCAG 2.1 contrast ratio of each text pair. Only plain hex colours are
  compared; rgba() tokens (halo, limb) are decoration and are skipped.
*/
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const file = resolve(here, '../src/theme/themes.css');
const argMin = process.argv.indexOf('--min');
const MIN = argMin > -1 ? Number(process.argv[argMin + 1]) : 4.5;

const REQUIRED = [
  '--bg', '--surface', '--text', '--muted', '--faint', '--accent', '--accent-2', '--rule', '--link', '--link-hover',
  '--globe-ocean', '--globe-land', '--globe-visited', '--globe-going', '--globe-bucket', '--globe-border',
  '--globe-pin', '--globe-pin-home', '--globe-halo', '--globe-limb', '--globe-frame',
];
const LEGACY = ['bg', 'text', 'gold', 'muted', 'card', 'card-text', 'border', 'green', 'on-gold'].map((n) => `--portfolio-${n}`);

// [foreground, background]: every token that is used as text, on every surface it sits on.
const PAIRS = [
  ['--text', '--bg'], ['--text', '--surface'],
  ['--muted', '--bg'], ['--muted', '--surface'],
  ['--link', '--bg'], ['--link', '--surface'],
  ['--link-hover', '--bg'],
  ['--accent', '--bg'], ['--accent-2', '--bg'],
];
// (--portfolio-on-gold is --bg ink on a solid --link fill: the same ratio as link/bg.)

const css = readFileSync(file, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');

const blocks = [];
for (const m of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
  const ids = [...m[1].matchAll(/\[data-theme=['"]([\w-]+)['"]\]/g)].map((x) => x[1]);
  const decls = Object.fromEntries([...m[2].matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)].map((x) => [x[1], x[2].trim()]));
  blocks.push({ selector: m[1].trim(), ids, decls });
}

const hex = (v) => {
  const m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(v || '');
  if (!m) return null;
  const h = m[1].length === 3 ? [...m[1]].map((c) => c + c).join('') : m[1];
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
};
const lum = (rgb) => {
  const [r, g, b] = rgb.map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

let failures = 0;
const palettes = blocks.filter((b) => b.ids.length);
if (!palettes.length) {
  console.error(`No [data-theme] blocks found in ${file}`);
  process.exit(1);
}

const legacyBlock = blocks.find((b) => LEGACY.every((t) => t in b.decls));
if (!legacyBlock) {
  const missing = LEGACY.filter((t) => !blocks.some((b) => t in b.decls));
  console.log(`FAIL legacy --portfolio-* mapping incomplete: missing ${missing.join(', ')}`);
  failures++;
}

const col = (s, n) => String(s).padEnd(n);
const head = ['palette', ...PAIRS.map(([f, b]) => `${f.replace('--', '')}/${b.replace('--', '')}`), 'min'];
const widths = head.map((h, i) => Math.max(i === 0 ? 14 : 6, h.length + 1));
console.log(`WCAG 2.1 contrast ratios in src/theme/themes.css (threshold ${MIN}:1)\n`);
console.log(head.map((h, i) => col(h, widths[i])).join(''));

for (const p of palettes) {
  const name = p.ids.join(' = ');
  const missing = REQUIRED.filter((t) => !(t in p.decls));
  if (missing.length) {
    console.log(`FAIL ${name}: missing ${missing.join(', ')}`);
    failures++;
  }
  let min = Infinity;
  const cells = PAIRS.map(([f, b]) => {
    const fg = hex(p.decls[f]);
    const bg = hex(p.decls[b]);
    if (!fg || !bg) {
      failures++;
      return 'n/a';
    }
    const r = ratio(fg, bg);
    min = Math.min(min, r);
    if (r < MIN) failures++;
    return `${r.toFixed(2)}${r < MIN ? '!' : ''}`;
  });
  console.log([name, ...cells, min.toFixed(2)].map((c, i) => col(c, widths[i])).join(''));
}

// The switcher swatches in useTheme.js ([bg, text, accent]) must match the CSS.
const useThemeSrc = readFileSync(resolve(here, '../src/theme/useTheme.js'), 'utf8');
for (const m of useThemeSrc.matchAll(/id: '([\w-]+)'[^\n]*swatch: \[([^\]]+)\]/g)) {
  const p = palettes.find((b) => b.ids.includes(m[1]));
  const sw = [...m[2].matchAll(/'(#[0-9a-f]+)'/gi)].map((x) => x[1].toLowerCase());
  const css3 = p && ['--bg', '--text', '--accent'].map((t) => (p.decls[t] || '').toLowerCase());
  if (!p || sw.join() !== css3.join()) {
    console.log(`FAIL swatch for ${m[1]} in useTheme.js is [${sw}] but themes.css has [${css3 || 'no block'}]`);
    failures++;
  }
}

console.log(failures ?`\n${failures} problem(s) (ratios marked ! are below ${MIN}:1).` : `\nAll ${palettes.length} palettes pass: every pair is at least ${MIN}:1.`);
process.exit(failures ? 1 : 0);

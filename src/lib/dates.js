/*
  Every date on the site goes through here, so there is one format per job:

    shortDate(raw)  lists and the nav: "Oct 7" (the year is added only when it isn't this year)
    longDate(raw)   the head of a page: "April 21, 2026", never a clock time
    years(period)   work rows: "2026 – now", "2025 – 26", "2025"
    span(period)    "Sep 2026 - Present" -> "Sep 2026 – Present" (a proper en dash)

  The data files are written by hand in two shapes: posts say "April 21, 2026, 4:07am" and the
  Now entry says "1:53am, 11/15/2026". Both are read by parts(); anything else is passed through.
*/
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December'];

function parts(raw) {
  const s = String(raw || '');
  let m = /(\d{1,2})\/(\d{1,2})\/(\d{4})/.exec(s); // 11/15/2026
  if (m) return { month: +m[1] - 1, day: +m[2], year: +m[3] };
  m = /([A-Za-z]{3,})\.?\s+(\d{1,2}),?\s+(\d{4})/.exec(s); // October 7, 2026
  if (m) {
    const month = MONTHS.findIndex((name) => name.toLowerCase().startsWith(m[1].slice(0, 3).toLowerCase()));
    if (month > -1) return { month, day: +m[2], year: +m[3] };
  }
  return null;
}

export function shortDate(raw, now = new Date()) {
  const d = parts(raw);
  if (!d) return String(raw || '');
  const s = `${MONTHS[d.month].slice(0, 3)} ${d.day}`;
  return d.year === now.getFullYear() ? s : `${s}, ${d.year}`;
}

export function longDate(raw) {
  const d = parts(raw);
  return d ? `${MONTHS[d.month]} ${d.day}, ${d.year}` : String(raw || '');
}

// Machine-readable, for <time dateTime>.
export function isoDate(raw) {
  const d = parts(raw);
  if (!d) return undefined;
  const two = (n) => String(n).padStart(2, '0');
  return `${d.year}-${two(d.month + 1)}-${two(d.day)}`;
}

export const span = (period) => String(period).replace(/\s+-\s+/g, ' – ');

// "Sep 2026 - Present" -> "2026 – now", "Aug 2025 - May 2026" -> "2025 – 26", "Jan 2025" -> "2025"
// (from trail's work rows).
export function years(period) {
  if (!period) return '';
  const [a, b] = String(period).split(/\s+[-–]\s+/);
  const ya = a.match(/\d{4}/)?.[0] ?? a;
  if (!b) return ya;
  if (/present/i.test(b)) return `${ya} – now`;
  const yb = b.match(/\d{4}/)?.[0];
  if (!yb || yb === ya) return ya;
  return `${ya} – ${yb.slice(2)}`;
}

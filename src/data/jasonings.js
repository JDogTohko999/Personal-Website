export const HEADSHOT = '/jasoning/jason_headshot_grad.png';

// The first spin of a visit always settles on one of these.
export const OPENERS = ['stalling', 'sacking', 'hanging', 'smiling', 'cheesing'];

// Whichever of these the reel lands on fills the circle above. The headshot is
// in the list too, so the reel can always come back to it.
export const JASONINGS = [
  { label: 'smiling', src: HEADSHOT },
  // Space in the filename must stay percent-encoded in the URL.
  { label: 'field rushing', src: '/jasoning/field%20rushing.jpg' },
  { label: 'sacking', src: '/jasoning/sacking.jpg' },
  { label: 'stalling', src: '/jasoning/stalling.JPG' },
  { label: 'jim carey-ing', src: '/jasoning/jim-careying.JPG' },
  { label: 'napoleoning', src: '/jasoning/napoleoning.jpg' },
  { label: 'pointing', src: '/jasoning/pointing.jpg' },
  { label: 'hanging', src: '/jasoning/hanging.jpg' },
  { label: 'speaking', src: '/jasoning/speaking.jpg' },
  { label: 'canvassing', src: '/blog/canvassing_bores.mp4', type: 'video' },
  { label: 'blocking', src: '/jasoning/blocking.JPG' },
  { label: 'protesting', src: '/jasoning/protesting.JPG' },
  { label: 'ranking', src: '/jasoning/ranking.PNG' },
  { label: 'chilling', src: '/jasoning/chilling.jpg' },
  { label: 'LDOCing', src: '/jasoning/LDOCing.jpg' },
  { label: 'hooping', src: '/jasoning/hooping.jpg' },
  { label: 'G-splitting', src: '/jasoning/G-splitting.jpg' },
  { label: 'climbing', src: '/jasoning/climbing.jpg' },
  { label: 'winning', src: '/jasoning/winning.jpg' },
  // Space and '!' in these filenames stay percent-encoded in the URL.
  { label: 'troublemaking', src: '/jasoning/trouble%20making.jpg' },
  { label: 'snowing!', src: '/jasoning/snowing%21.jpg' },
  { label: 'unnecessary risking', src: '/jasoning/unnecessary%20risking.jpg' },
  { label: 'napping', src: '/jasoning/napping.jpg' },
  { label: 'cheesing', src: '/jasoning/cheesing.jpg' },
  { label: 'considering :)', src: '/jasoning/considering.jpg' },
  { label: 'big backing', src: '/jasoning/big%20backing.jpg' },
  { label: 'performing', src: '/jasoning/performing.jpg' },
];

/* Card geometry from Figma: 507px tall, 337px wide, except the third card which
   is 698px wide. Widths are expressed as a ratio of the height so any ticker
   row can scale its cards from a single CSS custom property. */
const NARROW = 337 / 507;
const WIDE = 698 / 507;

export const TICKER_PHOTOS = [
  { src: "/images/model-01.webp", ratio: NARROW },
  { src: "/images/model-02.webp", ratio: NARROW },
  { src: "/images/model-03.webp", ratio: WIDE },
  { src: "/images/model-04.webp", ratio: NARROW },
  { src: "/images/model-05.webp", ratio: NARROW },
  { src: "/images/model-06.webp", ratio: NARROW },
  { src: "/images/model-07.webp", ratio: NARROW },
  { src: "/images/model-08.webp", ratio: NARROW },
  { src: "/images/model-09.webp", ratio: NARROW },
  { src: "/images/model-10.webp", ratio: NARROW },
  { src: "/images/model-11.webp", ratio: NARROW },
  { src: "/images/model-12.webp", ratio: NARROW },
];

/* The five cards nearest the centre are the ones on screen at load, at every
   breakpoint, so those are the only ones worth prioritising. */
export const TICKER_PRELOAD_INDEXES = new Set([3, 4, 5, 6, 7]);

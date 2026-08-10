import Image from "next/image";

/* Card geometry from Figma: 507px tall, 337px wide, except the third card which
   is 698px wide. Widths are expressed as a ratio of the height so the whole
   strip can scale from one custom property on smaller screens. */
const NARROW = 337 / 507;
const WIDE = 698 / 507;

const PHOTOS = [
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
const PRELOAD = new Set([3, 4, 5, 6, 7]);

export type PhotoTickerProps = {
  /** Seconds for one full loop of the strip. Lower is faster. */
  speed?: number;
  /** Which way the strip scrolls. */
  direction?: "left" | "right";
  /** Pause the scroll while the pointer is over the strip. */
  pauseOnHover?: boolean;
  /** Fade the strip into the page background at both edges. */
  fadeEdges?: boolean;
  /** Width of the edge fade, in pixels. Only used when fadeEdges is true. */
  fadeWidth?: number;
  /** Desaturate every card except the one under the pointer. */
  grayscaleUntilHover?: boolean;
  /** Lift and brighten a card slightly when the pointer is over it. */
  liftOnHover?: boolean;
};

export default function PhotoTicker({
  speed = 50,
  direction = "left",
  pauseOnHover = true,
  fadeEdges = true,
  fadeWidth = 160,
  grayscaleUntilHover = false,
  liftOnHover = true,
}: PhotoTickerProps) {
  // Two copies of the strip sit back to back; animating the first one exactly
  // out of view (translateX(-50%)) hands off to the second seamlessly.
  const track = [...PHOTOS, ...PHOTOS];

  const fadeMask = fadeEdges
    ? `linear-gradient(to right, transparent, black ${fadeWidth}px, black calc(100% - ${fadeWidth}px), transparent)`
    : undefined;

  return (
    <div
      className="group/ticker relative flex w-full overflow-hidden [--card-h:clamp(200px,min(37vh,calc(100vh-600px)),560px)]"
      style={fadeMask ? { maskImage: fadeMask, WebkitMaskImage: fadeMask } : undefined}
      role="img"
      aria-label="Examples of AI-generated model photos produced with Foldrise"
    >
      <div
        className={`flex w-max shrink-0 items-center gap-[calc(var(--card-h)*0.0394)] will-change-transform ${
          pauseOnHover ? "group-hover/ticker:[animation-play-state:paused]" : ""
        }`}
        style={{
          animationName: direction === "left" ? "ticker-left" : "ticker-right",
          animationDuration: `${speed}s`,
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
        }}
      >
        {track.map((photo, i) => (
          <div
            key={`${photo.src}-${i < PHOTOS.length ? "a" : "b"}`}
            className="group/card relative shrink-0 overflow-hidden bg-bg-soft"
            style={{
              height: "var(--card-h)",
              width: `calc(var(--card-h) * ${photo.ratio})`,
              /* 16px radius on a 507px card */
              borderRadius: "calc(var(--card-h) * 0.0316)",
            }}
          >
            <Image
              src={photo.src}
              alt=""
              fill
              sizes="(max-width: 640px) 130px, (max-width: 1280px) 300px, 700px"
              priority={i < PHOTOS.length && PRELOAD.has(i)}
              loading={i < PHOTOS.length && PRELOAD.has(i) ? undefined : "eager"}
              className={`object-cover transition-[filter,transform] duration-300 ease-out ${
                grayscaleUntilHover ? "grayscale group-hover/card:grayscale-0" : ""
              } ${liftOnHover ? "group-hover/card:scale-105" : ""}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

import Image from "next/image";

const PHOTOS = [
  "/images/model-01.webp",
  "/images/model-02.webp",
  "/images/model-04.webp",
  "/images/model-05.webp",
  "/images/model-07.webp",
  "/images/model-08.webp",
  "/images/model-09.webp",
  "/images/model-10.webp",
  "/images/model-11.webp",
  "/images/model-12.webp",
];

/* The cards nearest the centre are the ones on screen at load, at every
   breakpoint, so those are the only ones worth prioritising. */
const PRELOAD = new Set([3, 4, 5, 6, 7]);

export type SimpleTickerProps = {
  /** Height every card renders at, in px. Omit to size it from the viewport. */
  cardHeight?: number;
  /** Card width as a fraction of its height — every card uses the same ratio. */
  cardAspect?: number;
  /** Gap between cards, as a fraction of card height. */
  gapRatio?: number;
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
  /** Lift and enlarge a card slightly when the pointer is over it. */
  liftOnHover?: boolean;
};

export default function SimpleTicker({
  cardHeight,
  cardAspect = 0.72,
  gapRatio = 0.08,
  speed = 45,
  direction = "left",
  pauseOnHover = true,
  fadeEdges = true,
  fadeWidth = 160,
  grayscaleUntilHover = false,
  liftOnHover = true,
}: SimpleTickerProps) {
  // Two copies of the strip sit back to back; animating the first one exactly
  // out of view (translateX(-50%)) hands off to the second seamlessly.
  const track = [...PHOTOS, ...PHOTOS];

  const heightVar = cardHeight ? `${cardHeight}px` : "clamp(200px, 32vh, 420px)";

  const fadeMask = fadeEdges
    ? `linear-gradient(to right, transparent, black ${fadeWidth}px, black calc(100% - ${fadeWidth}px), transparent)`
    : undefined;

  return (
    <div
      className="group/ticker relative flex w-full overflow-hidden"
      style={{
        ["--card-h" as string]: heightVar,
        ...(fadeMask ? { maskImage: fadeMask, WebkitMaskImage: fadeMask } : {}),
      }}
      role="img"
      aria-label="Examples of AI-generated model photos produced with Foldrise"
    >
      <div
        className={`flex w-max shrink-0 items-center gap-[calc(var(--card-h)*${gapRatio})] will-change-transform ${
          pauseOnHover ? "group-hover/ticker:[animation-play-state:paused]" : ""
        }`}
        style={{
          animationName: direction === "left" ? "ticker-left" : "ticker-right",
          animationDuration: `${speed}s`,
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
        }}
      >
        {track.map((src, i) => {
          const isFirstCopy = i < PHOTOS.length;
          const priority = isFirstCopy && PRELOAD.has(i);
          return (
            <div
              key={`${src}-${isFirstCopy ? "a" : "b"}`}
              className="group/card relative shrink-0 overflow-hidden bg-bg-soft"
              style={{
                height: "var(--card-h)",
                width: `calc(var(--card-h) * ${cardAspect})`,
                borderRadius: "calc(var(--card-h) * 0.0316)",
              }}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="(max-width: 640px) 160px, 320px"
                priority={priority}
                loading={priority ? undefined : "eager"}
                className={`object-cover transition-[filter,transform] duration-300 ease-out ${
                  grayscaleUntilHover ? "grayscale group-hover/card:grayscale-0" : ""
                } ${liftOnHover ? "group-hover/card:scale-105" : ""}`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

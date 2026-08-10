import Image from "next/image";
import { TICKER_PHOTOS, TICKER_PRELOAD_INDEXES } from "@/data/tickerPhotos";

type Direction = "left" | "right";
type Photo = (typeof TICKER_PHOTOS)[number];

export type ParallaxTickerProps = {
  /** How many stacked rows to render. 1 behaves like a plain single-row ticker. */
  rows?: number;
  /** Fixed height per row, in px. Omit to size rows automatically from the viewport. */
  rowHeight?: number;
  /** Vertical gap between rows, in px. */
  rowGap?: number;
  /** Seconds for row 0 to complete one loop. Lower is faster. */
  speed?: number;
  /** Multiplies `speed` for each row after the first: row i's duration is
   *  `speed * speedStep^i`. Below 1 makes later rows faster, above 1 slower —
   *  this is what actually produces the parallax depth effect. */
  speedStep?: number;
  /** Explicit per-row duration overrides (seconds), takes priority over speed/speedStep. */
  rowSpeeds?: number[];
  /** Row 0's scroll direction. */
  direction?: Direction;
  /** Alternate direction row by row (row 0 left, row 1 right, row 2 left, ...). */
  alternateDirection?: boolean;
  /** Explicit per-row direction overrides, takes priority over direction/alternateDirection. */
  rowDirections?: Direction[];
  /** Rotate which photo each row starts on so identical images don't stack vertically. */
  offsetPhotosPerRow?: boolean;
  /** Pause every row while the pointer is over the ticker. */
  pauseOnHover?: boolean;
  /** Fade the whole ticker into the page background at both edges. */
  fadeEdges?: boolean;
  /** Width of the edge fade, in pixels. Only used when fadeEdges is true. */
  fadeWidth?: number;
  /** Desaturate every card except the one under the pointer. */
  grayscaleUntilHover?: boolean;
  /** Lift and enlarge a card slightly when the pointer is over it. */
  liftOnHover?: boolean;
};

function rotate<T>(arr: T[], by: number): T[] {
  if (arr.length === 0) return arr;
  const shift = ((by % arr.length) + arr.length) % arr.length;
  return [...arr.slice(shift), ...arr.slice(0, shift)];
}

export default function ParallaxTicker({
  rows = 3,
  rowHeight,
  rowGap = 16,
  speed = 50,
  speedStep = 0.82,
  rowSpeeds,
  direction = "left",
  alternateDirection = true,
  rowDirections,
  offsetPhotosPerRow = true,
  pauseOnHover = true,
  fadeEdges = true,
  fadeWidth = 160,
  grayscaleUntilHover = false,
  liftOnHover = true,
}: ParallaxTickerProps) {
  const rowCount = Math.max(1, Math.round(rows));

  // With one row this is the same clamp the original single-row ticker used;
  // with more rows the same budget is divided between them so the stack
  // still roughly fits the space one row used to occupy.
  const rowHeightVar = rowHeight
    ? `${rowHeight}px`
    : `clamp(${Math.max(90, Math.round(200 / rowCount))}px, min(${(37 / rowCount).toFixed(2)}vh, calc((100vh - 600px) / ${rowCount})), ${Math.max(90, Math.round(560 / rowCount))}px)`;

  const fadeMask = fadeEdges
    ? `linear-gradient(to right, transparent, black ${fadeWidth}px, black calc(100% - ${fadeWidth}px), transparent)`
    : undefined;

  const rotateBy = Math.max(1, Math.floor(TICKER_PHOTOS.length / rowCount));

  return (
    <div
      className="flex w-full flex-col"
      style={{
        gap: rowGap,
        ...(fadeMask ? { maskImage: fadeMask, WebkitMaskImage: fadeMask } : {}),
      }}
      role="img"
      aria-label="Examples of AI-generated model photos produced with Foldrise"
    >
      {Array.from({ length: rowCount }, (_, rowIndex) => {
        const photos = offsetPhotosPerRow ? rotate(TICKER_PHOTOS, rowIndex * rotateBy) : TICKER_PHOTOS;

        const rowDirection: Direction =
          rowDirections?.[rowIndex] ??
          (alternateDirection
            ? rowIndex % 2 === 0
              ? direction
              : direction === "left"
                ? "right"
                : "left"
            : direction);

        const rowSpeed = Math.max(4, rowSpeeds?.[rowIndex] ?? speed * speedStep ** rowIndex);

        return (
          <TickerRow
            key={rowIndex}
            rowIndex={rowIndex}
            photos={photos}
            heightVar={rowHeightVar}
            direction={rowDirection}
            speed={rowSpeed}
            pauseOnHover={pauseOnHover}
            grayscaleUntilHover={grayscaleUntilHover}
            liftOnHover={liftOnHover}
          />
        );
      })}
    </div>
  );
}

function TickerRow({
  rowIndex,
  photos,
  heightVar,
  direction,
  speed,
  pauseOnHover,
  grayscaleUntilHover,
  liftOnHover,
}: {
  rowIndex: number;
  photos: Photo[];
  heightVar: string;
  direction: Direction;
  speed: number;
  pauseOnHover: boolean;
  grayscaleUntilHover: boolean;
  liftOnHover: boolean;
}) {
  // Two copies of the row sit back to back; animating the first one exactly
  // out of view (translateX(-50%)) hands off to the second seamlessly.
  const track = [...photos, ...photos];

  return (
    <div
      className="group/ticker relative flex w-full overflow-hidden"
      style={{ "--card-h": heightVar } as React.CSSProperties}
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
        {track.map((photo, i) => {
          const isFirstCopy = i < photos.length;
          const priority = rowIndex === 0 && isFirstCopy && TICKER_PRELOAD_INDEXES.has(i);
          return (
            <div
              key={`r${rowIndex}-${photo.src}-${isFirstCopy ? "a" : "b"}`}
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

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

/* Which cards land on screen depends on the viewport, because the strip is
   centred and overflows on both sides. The five in the middle are visible at
   every width, so they are preloaded; the rest still load eagerly (they are
   small once resized) so no placeholder is ever visible at a wider breakpoint. */
const PRELOAD = new Set([3, 4, 5, 6, 7]);

export default function PhotoStrip() {
  return (
    <div
      className="flex w-full justify-center overflow-hidden [--card-h:184px] sm:[--card-h:300px] lg:[--card-h:420px] xl:[--card-h:507px]"
      role="img"
      aria-label="Examples of AI-generated model photos produced with Foldrise"
    >
      <div className="flex shrink-0 items-center gap-[10px] sm:gap-[14px] xl:gap-5">
        {PHOTOS.map((photo, i) => (
          <div
            key={photo.src}
            className="relative shrink-0 overflow-hidden rounded-[10px] bg-bg-soft sm:rounded-xl xl:rounded-2xl"
            style={{
              height: "var(--card-h)",
              width: `calc(var(--card-h) * ${photo.ratio})`,
            }}
          >
            <Image
              src={photo.src}
              alt=""
              fill
              sizes="(max-width: 640px) 130px, (max-width: 1280px) 300px, 700px"
              priority={PRELOAD.has(i)}
              loading={PRELOAD.has(i) ? undefined : "eager"}
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

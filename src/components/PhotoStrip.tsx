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
      /* 507 of the design's 1371px frame is 37vh, so tying the card height to
         the viewport keeps the strip in frame at any window height, exactly as
         it sits in Figma. The bounds stop it collapsing on short laptops or
         ballooning on very tall displays. */
      className="flex w-full justify-center overflow-hidden [--card-h:clamp(200px,min(37vh,calc(100vh-600px)),560px)]"
      role="img"
      aria-label="Examples of AI-generated model photos produced with Foldrise"
    >
      <div className="flex shrink-0 items-center gap-[calc(var(--card-h)*0.0394)]">
        {PHOTOS.map((photo, i) => (
          <div
            key={photo.src}
            className="relative shrink-0 overflow-hidden bg-bg-soft"
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

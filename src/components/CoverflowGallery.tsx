"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

const PHOTOS = [
  "/images/model-01.webp",
  "/images/model-04.webp",
  "/images/model-07.webp",
  "/images/model-09.webp",
  "/images/model-11.webp",
];

export type CoverflowGalleryProps = {
  /** Height of the centre card, in px. Omit to size it from the viewport. */
  cardHeight?: number;
  /** Card width as a fraction of its height. */
  cardAspect?: number;
  /** Horizontal offset per step from centre, as a multiple of card height. */
  spacingX?: number;
  /** How far back (in Z) each step sits, as a multiple of card height — this is what creates the depth. */
  depthZ?: number;
  /** Y-axis rotation per step, in degrees. */
  rotation?: number;
  /** Scale multiplier applied per step outward (0-1). Lower = side cards shrink more. */
  scaleFalloff?: number;
  /** Opacity multiplier applied per step outward (0-1). Lower = side cards fade more. */
  opacityFalloff?: number;
  /** Width of the visible window, as a multiple of card height. Smaller crops the outer cards more, like the reference. */
  visibleWidthRatio?: number;
  /** Tilt the whole stack toward the cursor. */
  cursorTilt?: boolean;
  /** Max tilt from the cursor, in degrees. */
  cursorTiltStrength?: number;
  /** Nudge the stack as the page scrolls past it. */
  scrollTilt?: boolean;
  /** Max vertical drift from scrolling, in px. */
  scrollTiltStrength?: number;
  /** How quickly the tilt catches up to its target (0-1). Higher is snappier, lower is smoother/laggier. */
  smoothing?: number;
};

export default function CoverflowGallery({
  cardHeight,
  cardAspect = 0.72,
  spacingX = 0.62,
  depthZ = 0.5,
  rotation = 28,
  scaleFalloff = 0.85,
  opacityFalloff = 0.7,
  visibleWidthRatio = 2.7,
  cursorTilt = true,
  cursorTiltStrength = 10,
  scrollTilt = true,
  scrollTiltStrength = 14,
  smoothing = 0.07,
}: CoverflowGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const group = groupRef.current;
    if (!container || !group) return;
    if (!cursorTilt && !scrollTilt) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    let targetTiltX = 0;
    let targetTiltY = 0;
    let targetFloat = 0;
    let tiltX = 0;
    let tiltY = 0;
    let float = 0;
    let rafId = 0;

    function handlePointerMove(e: PointerEvent) {
      if (!cursorTilt || !container) return;
      const rect = container.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;
      targetTiltY = relX * cursorTiltStrength;
      targetTiltX = relY * -cursorTiltStrength * 0.5;
    }

    function handlePointerLeave() {
      targetTiltX = 0;
      targetTiltY = 0;
    }

    function handleScroll() {
      if (!scrollTilt || !container) return;
      const rect = container.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      const elementCenter = rect.top + rect.height / 2;
      const distance = (elementCenter - viewportCenter) / window.innerHeight;
      targetFloat = Math.max(-1, Math.min(1, distance)) * scrollTiltStrength;
    }

    function tick() {
      tiltX += (targetTiltX - tiltX) * smoothing;
      tiltY += (targetTiltY - tiltY) * smoothing;
      float += (targetFloat - float) * smoothing;

      if (group) {
        group.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(${float}px)`;
      }

      rafId = requestAnimationFrame(tick);
    }

    if (cursorTilt) {
      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerleave", handlePointerLeave);
    }
    if (scrollTilt) {
      window.addEventListener("scroll", handleScroll, { passive: true });
      handleScroll();
    }
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, [cursorTilt, cursorTiltStrength, scrollTilt, scrollTiltStrength, smoothing]);

  const heightVar = cardHeight ? `${cardHeight}px` : "clamp(220px, 34vh, 420px)";
  const half = Math.floor(PHOTOS.length / 2);

  return (
    <div
      className="mx-auto w-full overflow-hidden"
      style={{ maxWidth: `calc(${heightVar} * ${visibleWidthRatio})` }}
    >
      <div
        ref={containerRef}
        className="relative mx-auto w-full [--card-h:var(--h)]"
        style={{ "--h": heightVar, perspective: "1400px", height: `calc(${heightVar} * 1.05)` } as React.CSSProperties}
      >
        <div ref={groupRef} className="relative h-full w-full" style={{ transformStyle: "preserve-3d" }}>
          {PHOTOS.map((src, i) => {
            const step = i - half;
            const abs = Math.abs(step);
            return (
              <div
                key={src}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden bg-bg-soft shadow-2xl shadow-black/60"
                style={{
                  height: "var(--card-h)",
                  width: `calc(var(--card-h) * ${cardAspect})`,
                  borderRadius: "calc(var(--card-h) * 0.0316)",
                  transform: `translateX(calc(var(--card-h) * ${spacingX} * ${step})) translateZ(calc(var(--card-h) * -${depthZ} * ${abs})) rotateY(${-rotation * Math.sign(step)}deg) scale(${scaleFalloff ** abs})`,
                  opacity: opacityFalloff ** abs,
                  zIndex: half - abs,
                }}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 200px, 400px"
                  priority={step === 0}
                  loading={step === 0 ? undefined : "eager"}
                  className="object-cover"
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

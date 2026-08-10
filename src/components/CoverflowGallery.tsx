"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

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

export type CoverflowGalleryProps = {
  /** Height of a card at full (centre) scale, in px. Omit to size it from the viewport. */
  cardHeight?: number;
  /** Card width as a fraction of its height (portrait &lt; 1). */
  cardAspect?: number;
  /** Gap between resting (flattened) cards, as a fraction of card height. */
  gapRatio?: number;
  /** How fast the belt moves, in card-widths per second. */
  speed?: number;
  /** Which way the belt drifts. */
  direction?: "left" | "right";
  /** Max Y-axis rotation a card reaches once fully away from centre, in degrees. */
  rotation?: number;
  /** Max recession (translateZ) a card reaches once fully away from centre, as a fraction of card height. */
  depthZ?: number;
  /** Scale at the exact centre. */
  maxScale?: number;
  /** Scale once fully away from centre. */
  minScale?: number;
  /** Opacity once fully away from centre (centre is always 1). */
  minOpacity?: number;
  /** How many card-widths from centre it takes to reach the min scale/max rotation. Larger = more cards stay legible before fading. */
  falloffCards?: number;
};

export default function CoverflowGallery({
  cardHeight,
  cardAspect = 0.72,
  gapRatio = 0.12,
  speed = 0.18,
  direction = "left",
  rotation = 32,
  depthZ = 0.6,
  maxScale = 1,
  minScale = 0.82,
  minOpacity = 0.9,
  falloffCards = 1.8,
}: CoverflowGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const heightVar = cardHeight ? `${cardHeight}px` : "clamp(200px, 30vh, 380px)";

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let rafId = 0;
    let scrollPx = 0;
    let lastTime = performance.now();
    const dir = direction === "left" ? 1 : -1;

    function tick(now: number) {
      const dtSeconds = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;

      if (!prefersReducedMotion && container) {
        const cardHeightPx = container.getBoundingClientRect().height;
        const cardWidthPx = cardHeightPx * cardAspect;
        const stepPx = cardWidthPx * (1 + gapRatio);

        scrollPx += dir * speed * cardWidthPx * dtSeconds;

        const n = PHOTOS.length;
        const totalTrack = stepPx * n;
        const falloffPx = cardWidthPx * falloffCards;

        for (let i = 0; i < n; i++) {
          const card = cardRefs.current[i];
          if (!card) continue;

          let pos = (i * stepPx - scrollPx) % totalTrack;
          if (pos > totalTrack / 2) pos -= totalTrack;
          if (pos < -totalTrack / 2) pos += totalTrack;

          const t = Math.max(-1, Math.min(1, pos / falloffPx));
          const absT = Math.abs(t);
          const eased = absT * absT * (3 - 2 * absT); // smoothstep

          const scale = maxScale - (maxScale - minScale) * eased;
          const rotateY = -rotation * t;
          const z = -depthZ * cardHeightPx * eased;
          const opacity = 1 - (1 - minOpacity) * eased;

          card.style.transform = `translateX(${pos}px) translateZ(${z}px) rotateY(${rotateY}deg) scale(${scale})`;
          card.style.opacity = String(opacity);
          card.style.zIndex = String(Math.round((1 - eased) * 100));
        }
      }

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [cardAspect, gapRatio, speed, direction, rotation, depthZ, maxScale, minScale, minOpacity, falloffCards]);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden"
      style={{ height: heightVar, perspective: "1400px", ["--card-h" as string]: heightVar }}
    >
      <div className="relative mx-auto h-full w-full" style={{ transformStyle: "preserve-3d" }}>
        {PHOTOS.map((src, i) => (
          <div
            key={src}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            className="absolute left-1/2 top-0 -translate-x-1/2 overflow-hidden bg-bg-soft shadow-2xl shadow-black/60"
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
              sizes="(max-width: 640px) 200px, 400px"
              loading="eager"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

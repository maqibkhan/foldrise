"use client";

import { useEffect, useRef } from "react";

type CardConfig = {
  x: number;
  z: number;
  rotateY: number;
  scale: number;
  opacity: number;
  zIndex: number;
  gradient: string;
};

const CARDS: CardConfig[] = [
  { x: -230, z: -180, rotateY: 28, scale: 0.72, opacity: 0.55, zIndex: 1, gradient: "from-blue-200 to-blue-400" },
  { x: -125, z: -70, rotateY: 16, scale: 0.87, opacity: 0.85, zIndex: 2, gradient: "from-blue-300 to-blue-500" },
  { x: 0, z: 0, rotateY: 0, scale: 1, opacity: 1, zIndex: 3, gradient: "from-blue-400 to-blue-600" },
  { x: 125, z: -70, rotateY: -16, scale: 0.87, opacity: 0.85, zIndex: 2, gradient: "from-blue-300 to-blue-500" },
  { x: 230, z: -180, rotateY: -28, scale: 0.72, opacity: 0.55, zIndex: 1, gradient: "from-blue-200 to-blue-400" },
];

export default function PortraitCarousel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const group = groupRef.current;
    if (!container || !group) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    let targetTiltX = 0;
    let targetTiltY = 0;
    let targetFloat = 0;
    let tiltX = 0;
    let tiltY = 0;
    let float = 0;
    let rafId = 0;

    function handlePointerMove(e: PointerEvent) {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;
      targetTiltY = relX * 14;
      targetTiltX = relY * -8;
    }

    function handlePointerLeave() {
      targetTiltX = 0;
      targetTiltY = 0;
    }

    function handleScroll() {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      const elementCenter = rect.top + rect.height / 2;
      const distance = (elementCenter - viewportCenter) / window.innerHeight;
      targetFloat = Math.max(-1, Math.min(1, distance)) * 10;
    }

    function tick() {
      tiltX += (targetTiltX - tiltX) * 0.07;
      tiltY += (targetTiltY - tiltY) * 0.07;
      float += (targetFloat - float) * 0.07;

      if (group) {
        group.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(${float}px)`;
      }

      rafId = requestAnimationFrame(tick);
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative h-[280px] w-full max-w-2xl select-none sm:h-[340px]"
      style={{ perspective: "1400px" }}
      aria-hidden="true"
    >
      <div
        ref={groupRef}
        className="relative mx-auto h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
      >
        {CARDS.map((card, i) => (
          <div
            key={i}
            className="absolute left-1/2 top-1/2 aspect-[3/4] w-[140px] -translate-x-1/2 -translate-y-1/2 rounded-3xl sm:w-[170px]"
            style={{
              transform: `translateX(${card.x}px) translateZ(${card.z}px) rotateY(${card.rotateY}deg) scale(${card.scale})`,
              zIndex: card.zIndex,
              opacity: card.opacity,
            }}
          >
            {/* Placeholder card face — swap for a real portrait image (e.g. next/image) when available */}
            <div
              className={`h-full w-full rounded-3xl bg-gradient-to-b ${card.gradient} shadow-xl shadow-blue-900/10 ring-1 ring-white/40`}
            >
              <div className="flex h-full w-full flex-col items-center justify-end rounded-3xl bg-gradient-to-t from-black/10 via-transparent to-white/20 p-4">
                <div className="mb-3 h-10 w-10 rounded-full bg-white/30" />
                <div className="h-1.5 w-14 rounded-full bg-white/30" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

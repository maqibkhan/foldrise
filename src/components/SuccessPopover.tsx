"use client";

import { useEffect, useRef } from "react";
import { Confetti, type ConfettiRef } from "@/components/magicui/confetti";

export default function SuccessPopover({ open, onClose }: { open: boolean; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const confettiRef = useRef<ConfettiRef>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!prefersReducedMotion) {
      confettiRef.current?.fire({
        particleCount: 220,
        spread: 100,
        startVelocity: 55,
        gravity: 0.9,
        ticks: 300,
        origin: { y: 0.5 },
        zIndex: 9999,
      });
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <Confetti
        ref={confettiRef}
        manualstart
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[60] h-full w-full"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="success-popover-title"
        className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 px-6 backdrop-blur-sm"
        onClick={onClose}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex w-full max-w-sm flex-col items-center gap-4 rounded-2xl border border-border-strong bg-bg-dark px-6 py-8 text-center shadow-2xl"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
            <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-5 w-5">
              <path
                d="M16.7 5.2 8.7 15.7a.75.75 0 0 1-1.13.07l-4.5-4.5a.75.75 0 1 1 1.06-1.06l3.9 3.89 7.48-9.82a.75.75 0 0 1 1.19.92Z"
                fill="currentColor"
                className="text-text-strong"
              />
            </svg>
          </div>

          <div className="flex flex-col gap-1.5">
            <h2 id="success-popover-title" className="text-title-h1 text-[20px] leading-tight text-text-strong">
              You&apos;re on the list!
            </h2>
            <p className="text-paragraph-sm text-text-sub">
              We&apos;ll email you the moment Foldrise launches.
            </p>
          </div>

          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="text-label-sm mt-2 flex h-11 w-full items-center justify-center rounded-xl bg-bg-white px-3.5 text-text-darker transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60"
          >
            Done
          </button>
        </div>
      </div>
    </>
  );
}

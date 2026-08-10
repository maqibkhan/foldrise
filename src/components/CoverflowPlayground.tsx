"use client";

import { useId, useState } from "react";
import CoverflowGallery from "@/components/CoverflowGallery";

type GalleryState = {
  cardAspect: number;
  spacingX: number;
  depthZ: number;
  rotation: number;
  scaleFalloff: number;
  opacityFalloff: number;
  visibleWidthRatio: number;
  cursorTilt: boolean;
  cursorTiltStrength: number;
  scrollTilt: boolean;
  scrollTiltStrength: number;
  smoothing: number;
};

const DEFAULTS: GalleryState = {
  cardAspect: 0.72,
  spacingX: 0.62,
  depthZ: 0.5,
  rotation: 28,
  scaleFalloff: 0.85,
  opacityFalloff: 0.7,
  visibleWidthRatio: 2.7,
  cursorTilt: true,
  cursorTiltStrength: 10,
  scrollTilt: true,
  scrollTiltStrength: 14,
  smoothing: 0.07,
};

/**
 * Wraps CoverflowGallery with a floating on-screen panel for live-tuning every
 * prop. The panel only ever renders in development — production visitors
 * just get the gallery with whatever values you left it on.
 */
export default function CoverflowPlayground() {
  const [state, setState] = useState<GalleryState>(DEFAULTS);

  return (
    <>
      <CoverflowGallery {...state} />
      {process.env.NODE_ENV === "development" && <GalleryControls value={state} onChange={setState} />}
    </>
  );
}

function GalleryControls({
  value,
  onChange,
}: {
  value: GalleryState;
  onChange: (next: GalleryState) => void;
}) {
  const [open, setOpen] = useState(true);
  const id = useId();

  function set<K extends keyof GalleryState>(key: K, val: GalleryState[K]) {
    onChange({ ...value, [key]: val });
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-h-[85vh] w-80 overflow-y-auto rounded-xl border border-white/10 bg-black/85 text-white shadow-2xl backdrop-blur-md">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="sticky top-0 flex w-full items-center justify-between bg-black/85 px-4 py-3 text-xs font-semibold uppercase tracking-wide backdrop-blur-md"
      >
        <span>Coverflow controls (dev only)</span>
        <span className="text-white/50">{open ? "−" : "+"}</span>
      </button>

      {open && (
        <div className="flex flex-col gap-4 border-t border-white/10 px-4 py-4 text-sm">
          <Section title="Shape" />
          <Slider id={`${id}-aspect`} label="Card aspect (w/h)" value={value.cardAspect} min={0.4} max={1.2} step={0.02} onChange={(v) => set("cardAspect", v)} />
          <Slider id={`${id}-visible`} label="Visible width ratio" value={value.visibleWidthRatio} min={1.5} max={5} step={0.1} onChange={(v) => set("visibleWidthRatio", v)} />

          <Section title="Depth" />
          <Slider id={`${id}-spacing`} label="Horizontal spacing" value={value.spacingX} min={0.2} max={1.2} step={0.02} onChange={(v) => set("spacingX", v)} />
          <Slider id={`${id}-depth`} label="Depth (Z) per step" value={value.depthZ} min={0} max={1.2} step={0.02} onChange={(v) => set("depthZ", v)} />
          <Slider id={`${id}-rotation`} label="Rotation per step" value={value.rotation} min={0} max={60} step={1} unit="°" onChange={(v) => set("rotation", v)} />
          <Slider id={`${id}-scale`} label="Scale falloff" value={value.scaleFalloff} min={0.4} max={1} step={0.01} onChange={(v) => set("scaleFalloff", v)} />
          <Slider id={`${id}-opacity`} label="Opacity falloff" value={value.opacityFalloff} min={0.2} max={1} step={0.02} onChange={(v) => set("opacityFalloff", v)} />

          <Section title="Motion" />
          <Toggle label="Cursor tilt" checked={value.cursorTilt} onChange={(v) => set("cursorTilt", v)} />
          <Slider id={`${id}-cursor-strength`} label="Cursor tilt strength" value={value.cursorTiltStrength} min={0} max={30} step={1} unit="°" disabled={!value.cursorTilt} onChange={(v) => set("cursorTiltStrength", v)} />
          <Toggle label="Scroll tilt" checked={value.scrollTilt} onChange={(v) => set("scrollTilt", v)} />
          <Slider id={`${id}-scroll-strength`} label="Scroll tilt strength" value={value.scrollTiltStrength} min={0} max={40} step={2} unit="px" disabled={!value.scrollTilt} onChange={(v) => set("scrollTiltStrength", v)} />
          <Slider id={`${id}-smoothing`} label="Smoothing" value={value.smoothing} min={0.02} max={0.3} step={0.01} onChange={(v) => set("smoothing", v)} />

          <button
            type="button"
            onClick={() => onChange(DEFAULTS)}
            className="mt-1 rounded-lg border border-white/20 py-1.5 text-xs text-white/70 hover:border-white/40"
          >
            Reset to defaults
          </button>
        </div>
      )}
    </div>
  );
}

function Section({ title }: { title: string }) {
  return <div className="text-[11px] font-semibold uppercase tracking-wide text-white/40">{title}</div>;
}

function Slider({
  id,
  label,
  value,
  min,
  max,
  step,
  unit = "",
  disabled = false,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  disabled?: boolean;
  onChange: (value: number) => void;
}) {
  return (
    <label className="flex flex-col gap-1" htmlFor={id}>
      <span className="flex justify-between text-xs text-white/60">
        <span>{label}</span>
        <span>
          {value}
          {unit}
        </span>
      </span>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="accent-white disabled:opacity-40"
      />
    </label>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between text-xs text-white/80">
      <span>{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-white"
      />
    </label>
  );
}

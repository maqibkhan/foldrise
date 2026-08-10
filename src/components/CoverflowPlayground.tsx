"use client";

import { useId, useState } from "react";
import CoverflowGallery from "@/components/CoverflowGallery";

type Direction = "left" | "right";

type GalleryState = {
  cardAspect: number;
  gapRatio: number;
  speed: number;
  direction: Direction;
  rotation: number;
  depthZ: number;
  maxScale: number;
  minScale: number;
  minOpacity: number;
  falloffCards: number;
};

const DEFAULTS: GalleryState = {
  cardAspect: 0.72,
  gapRatio: 0.12,
  speed: 0.18,
  direction: "left",
  rotation: 32,
  depthZ: 0.6,
  maxScale: 1,
  minScale: 0.82,
  minOpacity: 0.9,
  falloffCards: 1.8,
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
          <Slider id={`${id}-gap`} label="Gap between cards" value={value.gapRatio} min={0} max={0.5} step={0.02} onChange={(v) => set("gapRatio", v)} />

          <Section title="Motion" />
          <Slider id={`${id}-speed`} label="Speed" value={value.speed} min={0.02} max={0.8} step={0.02} unit=" card-w/s" onChange={(v) => set("speed", v)} />
          <div className="flex flex-col gap-1">
            <span className="text-xs text-white/60">Direction</span>
            <div className="flex gap-2">
              {(["left", "right"] as const).map((dir) => (
                <button
                  key={dir}
                  type="button"
                  onClick={() => set("direction", dir)}
                  className={`flex-1 rounded-lg border px-2 py-1.5 text-xs capitalize transition-colors ${
                    value.direction === dir
                      ? "border-white bg-white text-black"
                      : "border-white/20 text-white/70 hover:border-white/40"
                  }`}
                >
                  {dir}
                </button>
              ))}
            </div>
          </div>

          <Section title="Depth (applied by distance from centre)" />
          <Slider id={`${id}-rotation`} label="Max rotation" value={value.rotation} min={0} max={75} step={1} unit="°" onChange={(v) => set("rotation", v)} />
          <Slider id={`${id}-depth`} label="Max recession (Z)" value={value.depthZ} min={0} max={2} step={0.05} onChange={(v) => set("depthZ", v)} />
          <Slider id={`${id}-max-scale`} label="Centre scale" value={value.maxScale} min={0.8} max={1.4} step={0.02} onChange={(v) => set("maxScale", v)} />
          <Slider id={`${id}-min-scale`} label="Min scale" value={value.minScale} min={0.3} max={1} step={0.02} onChange={(v) => set("minScale", v)} />
          <Slider id={`${id}-min-opacity`} label="Min opacity" value={value.minOpacity} min={0.2} max={1} step={0.02} onChange={(v) => set("minOpacity", v)} />
          <Slider id={`${id}-falloff`} label="Falloff distance" value={value.falloffCards} min={0.5} max={3} step={0.05} unit=" card-w" onChange={(v) => set("falloffCards", v)} />

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
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
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
        onChange={(e) => onChange(Number(e.target.value))}
        className="accent-white"
      />
    </label>
  );
}

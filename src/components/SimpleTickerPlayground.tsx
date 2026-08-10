"use client";

import { useId, useState } from "react";
import SimpleTicker from "@/components/SimpleTicker";

type Direction = "left" | "right";

type TickerState = {
  cardAspect: number;
  gapRatio: number;
  speed: number;
  direction: Direction;
  pauseOnHover: boolean;
  fadeEdges: boolean;
  fadeWidth: number;
  grayscaleUntilHover: boolean;
  liftOnHover: boolean;
};

const DEFAULTS: TickerState = {
  cardAspect: 0.72,
  gapRatio: 0.08,
  speed: 45,
  direction: "left",
  pauseOnHover: true,
  fadeEdges: true,
  fadeWidth: 160,
  grayscaleUntilHover: false,
  liftOnHover: true,
};

/**
 * Wraps SimpleTicker with a floating on-screen panel for live-tuning every
 * prop. The panel only ever renders in development — production visitors
 * just get the ticker with whatever values you left it on.
 */
export default function SimpleTickerPlayground() {
  const [state, setState] = useState<TickerState>(DEFAULTS);

  return (
    <>
      <SimpleTicker {...state} />
      {process.env.NODE_ENV === "development" && <TickerControls value={state} onChange={setState} />}
    </>
  );
}

function TickerControls({
  value,
  onChange,
}: {
  value: TickerState;
  onChange: (next: TickerState) => void;
}) {
  const [open, setOpen] = useState(true);
  const id = useId();

  function set<K extends keyof TickerState>(key: K, val: TickerState[K]) {
    onChange({ ...value, [key]: val });
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-h-[85vh] w-80 overflow-y-auto rounded-xl border border-white/10 bg-black/85 text-white shadow-2xl backdrop-blur-md">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="sticky top-0 flex w-full items-center justify-between bg-black/85 px-4 py-3 text-xs font-semibold uppercase tracking-wide backdrop-blur-md"
      >
        <span>Ticker controls (dev only)</span>
        <span className="text-white/50">{open ? "−" : "+"}</span>
      </button>

      {open && (
        <div className="flex flex-col gap-4 border-t border-white/10 px-4 py-4 text-sm">
          <Section title="Shape" />
          <Slider id={`${id}-aspect`} label="Card aspect (w/h)" value={value.cardAspect} min={0.4} max={1.2} step={0.02} onChange={(v) => set("cardAspect", v)} />
          <Slider id={`${id}-gap`} label="Gap between cards" value={value.gapRatio} min={0} max={0.4} step={0.01} onChange={(v) => set("gapRatio", v)} />

          <Section title="Motion" />
          <Slider id={`${id}-speed`} label="Speed" value={value.speed} min={10} max={120} step={5} unit="s / loop" onChange={(v) => set("speed", v)} />
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
          <Toggle label="Pause on hover" checked={value.pauseOnHover} onChange={(v) => set("pauseOnHover", v)} />

          <Section title="Look" />
          <Toggle label="Fade edges" checked={value.fadeEdges} onChange={(v) => set("fadeEdges", v)} />
          <Slider id={`${id}-fade-width`} label="Fade width" value={value.fadeWidth} min={0} max={300} step={10} unit="px" onChange={(v) => set("fadeWidth", v)} />
          <Toggle label="Grayscale until hover" checked={value.grayscaleUntilHover} onChange={(v) => set("grayscaleUntilHover", v)} />
          <Toggle label="Lift on hover" checked={value.liftOnHover} onChange={(v) => set("liftOnHover", v)} />

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

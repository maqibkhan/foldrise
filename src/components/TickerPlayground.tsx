"use client";

import { useId, useState } from "react";
import ParallaxTicker from "@/components/ParallaxTicker";

type Direction = "left" | "right";

type TickerState = {
  rows: number;
  rowHeightAuto: boolean;
  rowHeightPx: number;
  rowGap: number;
  speed: number;
  speedStep: number;
  direction: Direction;
  alternateDirection: boolean;
  offsetPhotosPerRow: boolean;
  pauseOnHover: boolean;
  fadeEdges: boolean;
  fadeWidth: number;
  grayscaleUntilHover: boolean;
  liftOnHover: boolean;
};

const DEFAULTS: TickerState = {
  rows: 3,
  rowHeightAuto: true,
  rowHeightPx: 300,
  rowGap: 16,
  speed: 50,
  speedStep: 0.82,
  direction: "left",
  alternateDirection: true,
  offsetPhotosPerRow: true,
  pauseOnHover: true,
  fadeEdges: true,
  fadeWidth: 160,
  grayscaleUntilHover: false,
  liftOnHover: true,
};

/**
 * Wraps ParallaxTicker with a floating on-screen panel for live-tuning every
 * prop. The panel only ever renders in development — production visitors
 * just get the ticker with whatever values you left it on.
 */
export default function TickerPlayground() {
  const [state, setState] = useState<TickerState>(DEFAULTS);

  return (
    <>
      <ParallaxTicker
        rows={state.rows}
        rowHeight={state.rowHeightAuto ? undefined : state.rowHeightPx}
        rowGap={state.rowGap}
        speed={state.speed}
        speedStep={state.speedStep}
        direction={state.direction}
        alternateDirection={state.alternateDirection}
        offsetPhotosPerRow={state.offsetPhotosPerRow}
        pauseOnHover={state.pauseOnHover}
        fadeEdges={state.fadeEdges}
        fadeWidth={state.fadeWidth}
        grayscaleUntilHover={state.grayscaleUntilHover}
        liftOnHover={state.liftOnHover}
      />
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
          <Section title="Layout" />

          <label className="flex flex-col gap-1" htmlFor={`${id}-rows`}>
            <span className="flex justify-between text-xs text-white/60">
              <span>Rows</span>
              <span>{value.rows}</span>
            </span>
            <input
              id={`${id}-rows`}
              type="range"
              min={1}
              max={5}
              step={1}
              value={value.rows}
              onChange={(e) => set("rows", Number(e.target.value))}
              className="accent-white"
            />
          </label>

          <label className="flex flex-col gap-1" htmlFor={`${id}-row-gap`}>
            <span className="flex justify-between text-xs text-white/60">
              <span>Row gap</span>
              <span>{value.rowGap}px</span>
            </span>
            <input
              id={`${id}-row-gap`}
              type="range"
              min={0}
              max={48}
              step={2}
              value={value.rowGap}
              onChange={(e) => set("rowGap", Number(e.target.value))}
              className="accent-white"
            />
          </label>

          <Toggle
            label="Auto row height"
            checked={value.rowHeightAuto}
            onChange={(v) => set("rowHeightAuto", v)}
          />

          <label className="flex flex-col gap-1" htmlFor={`${id}-row-height`}>
            <span className="flex justify-between text-xs text-white/60">
              <span>Row height</span>
              <span>{value.rowHeightPx}px</span>
            </span>
            <input
              id={`${id}-row-height`}
              type="range"
              min={80}
              max={500}
              step={10}
              value={value.rowHeightPx}
              disabled={value.rowHeightAuto}
              onChange={(e) => set("rowHeightPx", Number(e.target.value))}
              className="accent-white disabled:opacity-40"
            />
          </label>

          <Toggle
            label="Offset photos per row"
            checked={value.offsetPhotosPerRow}
            onChange={(v) => set("offsetPhotosPerRow", v)}
          />

          <Section title="Motion" />

          <label className="flex flex-col gap-1" htmlFor={`${id}-speed`}>
            <span className="flex justify-between text-xs text-white/60">
              <span>Speed (row 1)</span>
              <span>{value.speed}s / loop</span>
            </span>
            <input
              id={`${id}-speed`}
              type="range"
              min={10}
              max={120}
              step={5}
              value={value.speed}
              onChange={(e) => set("speed", Number(e.target.value))}
              className="accent-white"
            />
          </label>

          <label className="flex flex-col gap-1" htmlFor={`${id}-speed-step`}>
            <span className="flex justify-between text-xs text-white/60">
              <span>Speed step / row</span>
              <span>×{value.speedStep.toFixed(2)}</span>
            </span>
            <input
              id={`${id}-speed-step`}
              type="range"
              min={0.5}
              max={1.3}
              step={0.02}
              value={value.speedStep}
              onChange={(e) => set("speedStep", Number(e.target.value))}
              className="accent-white"
            />
            <span className="text-[11px] text-white/40">
              Below 1 = each row faster than the last (the parallax effect). Above 1 = slower.
            </span>
          </label>

          <div className="flex flex-col gap-1">
            <span className="text-xs text-white/60">Direction (row 1)</span>
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

          <Toggle
            label="Alternate direction per row"
            checked={value.alternateDirection}
            onChange={(v) => set("alternateDirection", v)}
          />

          <Toggle label="Pause on hover" checked={value.pauseOnHover} onChange={(v) => set("pauseOnHover", v)} />

          <Section title="Look" />

          <Toggle label="Fade edges" checked={value.fadeEdges} onChange={(v) => set("fadeEdges", v)} />

          <label className="flex flex-col gap-1" htmlFor={`${id}-fade-width`}>
            <span className="flex justify-between text-xs text-white/60">
              <span>Fade width</span>
              <span>{value.fadeWidth}px</span>
            </span>
            <input
              id={`${id}-fade-width`}
              type="range"
              min={0}
              max={300}
              step={10}
              value={value.fadeWidth}
              disabled={!value.fadeEdges}
              onChange={(e) => set("fadeWidth", Number(e.target.value))}
              className="accent-white disabled:opacity-40"
            />
          </label>

          <Toggle
            label="Grayscale until hover"
            checked={value.grayscaleUntilHover}
            onChange={(v) => set("grayscaleUntilHover", v)}
          />
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

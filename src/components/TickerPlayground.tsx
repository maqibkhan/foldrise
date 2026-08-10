"use client";

import { useId, useState } from "react";
import PhotoTicker, { type PhotoTickerProps } from "@/components/PhotoTicker";

const DEFAULTS: Required<PhotoTickerProps> = {
  speed: 50,
  direction: "left",
  pauseOnHover: true,
  fadeEdges: true,
  fadeWidth: 160,
  grayscaleUntilHover: false,
  liftOnHover: true,
};

/**
 * Wraps PhotoTicker with a floating on-screen panel for live-tuning every
 * prop. The panel only ever renders in development — production visitors
 * just get the ticker with whatever values you left it on.
 */
export default function TickerPlayground() {
  const [props, setProps] = useState<Required<PhotoTickerProps>>(DEFAULTS);

  return (
    <>
      <PhotoTicker {...props} />
      {process.env.NODE_ENV === "development" && (
        <TickerControls value={props} onChange={setProps} />
      )}
    </>
  );
}

function TickerControls({
  value,
  onChange,
}: {
  value: Required<PhotoTickerProps>;
  onChange: (next: Required<PhotoTickerProps>) => void;
}) {
  const [open, setOpen] = useState(true);
  const id = useId();

  function set<K extends keyof PhotoTickerProps>(key: K, val: Required<PhotoTickerProps>[K]) {
    onChange({ ...value, [key]: val });
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-72 rounded-xl border border-white/10 bg-black/85 text-white shadow-2xl backdrop-blur-md">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-4 py-3 text-xs font-semibold uppercase tracking-wide"
      >
        <span>Ticker controls (dev only)</span>
        <span className="text-white/50">{open ? "−" : "+"}</span>
      </button>

      {open && (
        <div className="flex flex-col gap-4 border-t border-white/10 px-4 py-4 text-sm">
          <label className="flex flex-col gap-1" htmlFor={`${id}-speed`}>
            <span className="flex justify-between text-xs text-white/60">
              <span>Speed</span>
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
            label="Pause on hover"
            checked={value.pauseOnHover}
            onChange={(v) => set("pauseOnHover", v)}
          />
          <Toggle label="Fade edges" checked={value.fadeEdges} onChange={(v) => set("fadeEdges", v)} />
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

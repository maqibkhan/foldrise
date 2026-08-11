"use client";

import { useEffect, useState } from "react";

type SiteContent = {
  headline: string;
  body: string;
  buttonLabel: string;
  footerNote: string;
};

type Status = "idle" | "loading" | "saving" | "saved" | "error";

export default function ContentManager() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/content")
      .then((res) => res.json())
      .then((data) => {
        setContent(data.content);
        setStatus("idle");
      })
      .catch(() => setStatus("error"));
  }, []);

  function set<K extends keyof SiteContent>(key: K, value: SiteContent[K]) {
    setContent((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  async function handleSave() {
    if (!content) return;
    setStatus("saving");
    setError("");
    try {
      const res = await fetch("/api/admin/content", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to save");
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
      setStatus("error");
    }
  }

  if (status === "loading" || !content) {
    return <p className="text-sm text-white/50">Loading…</p>;
  }

  return (
    <div className="flex max-w-xl flex-col gap-4">
      <Field label="Headline" value={content.headline} onChange={(v) => set("headline", v)} />
      <Field label="Body" value={content.body} onChange={(v) => set("body", v)} multiline />
      <Field label="Button label" value={content.buttonLabel} onChange={(v) => set("buttonLabel", v)} />
      <Field label="Footer note" value={content.footerNote} onChange={(v) => set("footerNote", v)} />

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="button"
        onClick={handleSave}
        disabled={status === "saving"}
        className="w-fit rounded-lg bg-white px-4 py-2 text-sm font-medium text-black hover:bg-white/90 disabled:opacity-50"
      >
        {status === "saving" ? "Saving…" : status === "saved" ? "Saved" : "Save changes"}
      </button>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs text-white/60">{label}</span>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-white/40"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-white/40"
        />
      )}
    </label>
  );
}

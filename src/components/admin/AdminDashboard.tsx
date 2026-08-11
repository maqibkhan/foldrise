"use client";

import { useState } from "react";
import ImagesManager from "@/components/admin/ImagesManager";
import ContentManager from "@/components/admin/ContentManager";

const TABS = ["Images", "Content"] as const;
type Tab = (typeof TABS)[number];

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>("Images");

  return (
    <div className="min-h-dvh bg-neutral-950 text-white">
      <header className="border-b border-white/10 px-6 py-5">
        <h1 className="text-lg font-semibold">Foldrise admin</h1>
        <p className="text-sm text-white/50">Local only — this page and its APIs 404 in production.</p>
      </header>

      <nav className="flex gap-1 border-b border-white/10 px-6">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`px-4 py-3 text-sm font-medium transition-colors ${
              tab === t ? "border-b-2 border-white text-white" : "text-white/50 hover:text-white/80"
            }`}
          >
            {t}
          </button>
        ))}
      </nav>

      <main className="p-6">{tab === "Images" ? <ImagesManager /> : <ContentManager />}</main>
    </div>
  );
}

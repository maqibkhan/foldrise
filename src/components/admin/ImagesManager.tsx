"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type TickerImage = {
  id: string;
  url: string;
  storagePath: string;
  sortOrder: number;
};

export default function ImagesManager() {
  const [images, setImages] = useState<TickerImage[] | null>(null);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const dragIndex = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setError("");
    try {
      const res = await fetch("/api/admin/images");
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to load images");
      setImages(data.images);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load images");
    }
  }

  async function handleUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError("");

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await fetch("/api/admin/images", { method: "POST", body: formData });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || `Failed to upload ${file.name}`);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
      }
    }

    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    load();
  }

  async function handleDelete(id: string) {
    setImages((prev) => prev?.filter((img) => img.id !== id) ?? null);
    try {
      const res = await fetch(`/api/admin/images/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error || "Failed to delete image");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete image");
      load();
    }
  }

  async function persistOrder(next: TickerImage[]) {
    setSavingOrder(true);
    try {
      const res = await fetch("/api/admin/images/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: next.map((img) => img.id) }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error || "Failed to save order");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save order");
    } finally {
      setSavingOrder(false);
    }
  }

  function handleDrop(dropIndex: number) {
    if (dragIndex.current === null || !images) return;
    const from = dragIndex.current;
    dragIndex.current = null;
    if (from === dropIndex) return;

    const next = [...images];
    const [moved] = next.splice(from, 1);
    next.splice(dropIndex, 0, moved);
    setImages(next);
    persistOrder(next);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black hover:bg-white/90 disabled:opacity-50"
        >
          {uploading ? "Uploading…" : "Upload images"}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleUpload(e.target.files)}
        />
        {savingOrder && <span className="text-xs text-white/50">Saving order…</span>}
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      {images === null ? (
        <p className="text-sm text-white/50">Loading…</p>
      ) : images.length === 0 ? (
        <p className="text-sm text-white/50">No images yet — upload some above.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {images.map((img, i) => (
            <div
              key={img.id}
              draggable
              onDragStart={() => {
                dragIndex.current = i;
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(i)}
              className="group relative aspect-[3/4] cursor-grab overflow-hidden rounded-lg border border-white/10 bg-white/5 active:cursor-grabbing"
            >
              <Image src={img.url} alt="" fill sizes="200px" className="object-cover" unoptimized />
              <div className="absolute left-1.5 top-1.5 rounded bg-black/70 px-1.5 py-0.5 text-[10px] text-white/80">
                {i + 1}
              </div>
              <button
                type="button"
                onClick={() => handleDelete(img.id)}
                className="absolute right-1.5 top-1.5 rounded bg-black/70 px-2 py-1 text-xs opacity-0 transition-opacity hover:bg-red-600 group-hover:opacity-100"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

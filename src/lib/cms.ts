import { getSupabaseAdmin } from "@/lib/supabase-admin";

const BUCKET = "ticker-images";

export type SiteContent = {
  headline: string;
  body: string;
  buttonLabel: string;
  footerNote: string;
};

export type TickerImage = {
  id: string;
  url: string;
  storagePath: string;
  sortOrder: number;
};

/** Matches the hero copy that was hardcoded in page.tsx before the CMS existed. */
export const DEFAULT_SITE_CONTENT: SiteContent = {
  headline: "Join the waitlist!",
  body: "Foldrise helps clothing brands create premium model photos without the cost and effort of a traditional photoshoot.",
  buttonLabel: "Get early access",
  footerNote: "We will only email you about the Foldrise launch.",
};

/** Matches the photo set SimpleTicker used before the CMS existed. */
export const DEFAULT_TICKER_IMAGES: TickerImage[] = [
  "/images/model-01.webp",
  "/images/model-02.webp",
  "/images/model-04.webp",
  "/images/model-05.webp",
  "/images/model-07.webp",
  "/images/model-08.webp",
  "/images/model-09.webp",
  "/images/model-10.webp",
  "/images/model-11.webp",
  "/images/model-12.webp",
].map((url, i) => ({ id: `default-${i}`, url, storagePath: "", sortOrder: i }));

/** Used on the public page — never throws, so a missing/unreachable Supabase
 *  project degrades to the built-in defaults instead of breaking the page. */
export async function getSiteContent(): Promise<SiteContent> {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("site_content")
      .select("headline, body, button_label, footer_note")
      .eq("id", 1)
      .maybeSingle();

    if (error || !data) return DEFAULT_SITE_CONTENT;

    return {
      headline: data.headline ?? DEFAULT_SITE_CONTENT.headline,
      body: data.body ?? DEFAULT_SITE_CONTENT.body,
      buttonLabel: data.button_label ?? DEFAULT_SITE_CONTENT.buttonLabel,
      footerNote: data.footer_note ?? DEFAULT_SITE_CONTENT.footerNote,
    };
  } catch (err) {
    console.error("getSiteContent fell back to defaults:", err);
    return DEFAULT_SITE_CONTENT;
  }
}

export async function updateSiteContent(content: SiteContent): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("site_content")
    .update({
      headline: content.headline,
      body: content.body,
      button_label: content.buttonLabel,
      footer_note: content.footerNote,
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1);

  if (error) throw new Error(error.message);
}

/** Used on the public page — never throws, so a missing/unreachable Supabase
 *  project degrades to the built-in defaults instead of breaking the page. */
export async function listTickerImages(): Promise<TickerImage[]> {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("ticker_images")
      .select("id, storage_path, sort_order")
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) return DEFAULT_TICKER_IMAGES;

    return data.map((row) => ({
      id: row.id,
      storagePath: row.storage_path,
      sortOrder: row.sort_order,
      url: supabase.storage.from(BUCKET).getPublicUrl(row.storage_path).data.publicUrl,
    }));
  } catch (err) {
    console.error("listTickerImages fell back to defaults:", err);
    return DEFAULT_TICKER_IMAGES;
  }
}

export async function addTickerImage(file: Blob, filename: string): Promise<TickerImage> {
  const supabase = getSupabaseAdmin();
  const ext = filename.split(".").pop() || "webp";
  const path = `${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: file.type || "image/webp",
    upsert: false,
  });
  if (uploadError) throw new Error(uploadError.message);

  const { data: maxRow } = await supabase
    .from("ticker_images")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const nextOrder = (maxRow?.sort_order ?? -1) + 1;

  const { data, error } = await supabase
    .from("ticker_images")
    .insert({ storage_path: path, sort_order: nextOrder })
    .select("id, storage_path, sort_order")
    .single();

  if (error || !data) {
    await supabase.storage.from(BUCKET).remove([path]);
    throw new Error(error?.message ?? "Failed to save image record");
  }

  return {
    id: data.id,
    storagePath: data.storage_path,
    sortOrder: data.sort_order,
    url: supabase.storage.from(BUCKET).getPublicUrl(data.storage_path).data.publicUrl,
  };
}

export async function deleteTickerImage(id: string): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { data: row, error: fetchError } = await supabase
    .from("ticker_images")
    .select("storage_path")
    .eq("id", id)
    .maybeSingle();

  if (fetchError) throw new Error(fetchError.message);
  if (!row) return;

  const { error: deleteRowError } = await supabase.from("ticker_images").delete().eq("id", id);
  if (deleteRowError) throw new Error(deleteRowError.message);

  await supabase.storage.from(BUCKET).remove([row.storage_path]);
}

export async function reorderTickerImages(orderedIds: string[]): Promise<void> {
  const supabase = getSupabaseAdmin();
  await Promise.all(
    orderedIds.map((id, index) => supabase.from("ticker_images").update({ sort_order: index }).eq("id", id))
  );
}

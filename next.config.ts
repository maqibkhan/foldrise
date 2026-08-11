import type { NextConfig } from "next";

/* Ticker images uploaded through /admin live in Supabase Storage and get
   rendered on the public page via next/image, which refuses to optimize a
   remote host it doesn't know about. Deriving the hostname from SUPABASE_URL
   means this works for whichever Supabase project is configured without
   hardcoding a project ref here. */
function supabaseHostname(): string | null {
  const url = process.env.SUPABASE_URL;
  if (!url) return null;
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

const supabaseHost = supabaseHostname();

const nextConfig: NextConfig = {
  images: {
    /* The model photos are exported from Figma at 1200px on their longest edge,
       so there is nothing to gain from the default 1920/2048/3840 breakpoints —
       they would only upscale the source and make the browser decode twelve
       oversized bitmaps at once. Capping the ladder at the source resolution
       keeps the strip sharp while keeping decode cost low. */
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [128, 200, 256, 384],
    remotePatterns: supabaseHost
      ? [{ protocol: "https", hostname: supabaseHost, pathname: "/storage/v1/object/public/**" }]
      : [],
  },
};

export default nextConfig;

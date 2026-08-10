import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /* The model photos are exported from Figma at 1200px on their longest edge,
       so there is nothing to gain from the default 1920/2048/3840 breakpoints —
       they would only upscale the source and make the browser decode twelve
       oversized bitmaps at once. Capping the ladder at the source resolution
       keeps the strip sharp while keeping decode cost low. */
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [128, 200, 256, 384],
  },
};

export default nextConfig;

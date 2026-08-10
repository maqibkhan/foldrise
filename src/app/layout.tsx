import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

/* Figma uses Inter for body copy and Inter Display for titles. Inter Display is
   the same typeface at a display optical size, so both come from one variable
   font — the display face is selected through the `opsz` axis in globals.css. */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  axes: ["opsz"],
});

export const metadata: Metadata = {
  title: "Foldrise — Join the waitlist",
  description:
    "Foldrise helps clothing brands create premium model photos without the cost and effort of a traditional photoshoot.",
};

export const viewport: Viewport = {
  themeColor: "#0F1113",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-bg-dark">{children}</body>
    </html>
  );
}

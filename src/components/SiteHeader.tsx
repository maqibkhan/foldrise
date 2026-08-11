import Image from "next/image";
import Link from "next/link";

const SOCIALS = [
  { href: "https://x.com/foldrise_ai", label: "Foldrise on X", icon: "/icons/x.svg" },
  {
    href: "https://www.instagram.com/foldrise.ai/",
    label: "Foldrise on Instagram",
    icon: "/icons/instagram.svg",
  },
];

export default function SiteHeader() {
  return (
    <header className="relative z-20 flex w-full items-center justify-between px-6 py-4 sm:px-10 sm:py-6 lg:px-[180px]">
      {/* Logo lockup — mark + wordmark, 12.17px apart in Figma. */}
      <Link href="/" className="flex items-center gap-[12px] rounded-lg" aria-label="Foldrise home">
        <Image
          src="/icons/foldrise-mark.svg"
          alt=""
          width={30}
          height={30}
          priority
          className="h-[30px] w-[30px]"
        />
        <span className="text-wordmark text-white">Foldrise</span>
      </Link>

      <nav className="flex items-center gap-2" aria-label="Social links">
        {SOCIALS.map((social) => (
          <a
            key={social.href}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.label}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border-strong transition-colors hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60"
          >
            <Image src={social.icon} alt="" width={20} height={20} className="h-5 w-5" />
          </a>
        ))}
      </nav>
    </header>
  );
}

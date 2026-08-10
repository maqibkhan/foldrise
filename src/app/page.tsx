import EmailSignupForm from "@/components/EmailSignupForm";
import PortraitCarousel from "@/components/PortraitCarousel";

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-1 flex-col items-center justify-center bg-white px-6 py-16">
      <div className="flex w-full max-w-3xl flex-col items-center text-center">
        <span className="rounded-full border border-blue-100 bg-blue-50 px-4 py-1.5 text-xs font-medium tracking-wide text-blue-600">
          AI photo studio for clothing brands
        </span>

        <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
          Create premium model photos
          <br className="hidden sm:block" /> without a photoshoot
        </h1>

        <p className="mt-6 max-w-xl text-balance text-base text-slate-500 sm:text-lg">
          Turn garment photos into consistent model images for every product
          and collection.
        </p>

        <div className="mt-10">
          <EmailSignupForm />
        </div>

        <p className="mt-4 text-xs text-slate-400">
          We will only email you about the launch.
        </p>

        <div className="mt-16 w-full sm:mt-20">
          <PortraitCarousel />
        </div>
      </div>
    </main>
  );
}

import PhotoStrip from "@/components/PhotoStrip";
import SiteHeader from "@/components/SiteHeader";
import WaitlistForm from "@/components/WaitlistForm";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-bg-dark">
      {/* Soft light leak behind the hero — in Figma a 322x798 block rotated 30°
          and blurred by 140, centred at (459, 66) on the 1728-wide frame. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[26.5%] top-[66px] z-0 h-[798px] w-[322px] -translate-x-1/2 -translate-y-1/2 rotate-30 rounded-[50px] bg-bg-soft blur-[140px]"
      />

      <SiteHeader />

      <main className="relative z-10 flex flex-1 flex-col">
        <section className="flex flex-col items-center px-6 pt-14 text-center sm:pt-28 lg:pt-[194px]">
          <div className="flex w-full max-w-[802px] flex-col items-center gap-4">
            <div className="flex w-full flex-col items-center gap-8">
              <div className="flex w-full flex-col items-center gap-5">
                <h1 className="text-title-h1 max-w-[646px] text-[36px] leading-[1.1] text-text-strong sm:text-[44px] lg:text-[56px] lg:leading-[64px]">
                  Join the waitlist!
                </h1>
                <p className="text-paragraph-md max-w-[492px] text-text-sub">
                  Foldrise helps clothing brands create premium model photos without the cost and
                  effort of a traditional photoshoot.
                </p>
              </div>

              <div className="w-full max-w-[400px]">
                <WaitlistForm />
              </div>
            </div>

            <p className="text-paragraph-sm text-text-soft">
              We will only email you about the Foldrise launch.
            </p>
          </div>
        </section>

        <div className="mt-auto pt-14 pb-10 sm:pt-32 lg:pt-[228px] lg:pb-[56px]">
          <PhotoStrip />
        </div>
      </main>
    </div>
  );
}

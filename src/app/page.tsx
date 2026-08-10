import PhotoStrip from "@/components/PhotoStrip";
import SiteHeader from "@/components/SiteHeader";
import WaitlistForm from "@/components/WaitlistForm";

export default function Home() {
  return (
    /* Everything is measured against the viewport height so the strip always
       lands on screen the way it does in the Figma frame. The design's 1371px
       frame is the reference: 194/1371 of it sits above the hero, the cards are
       507/1371 tall, and 56/1371 is left below them. */
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-bg-dark">
      {/* Soft light leak behind the hero — in Figma a 322x798 block rotated 30°
          and blurred by 140, centred at (459, 66) on the 1728-wide frame. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[26.5%] top-[66px] z-0 h-[798px] w-[322px] -translate-x-1/2 -translate-y-1/2 rotate-30 rounded-[50px] bg-bg-soft blur-[140px]"
      />

      <SiteHeader />

      <main className="relative z-10 flex flex-1 flex-col">
        <section className="flex flex-col items-center px-6 pt-10 text-center sm:pt-[8vh] lg:pt-[14.15vh]">
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

        {/* `mt-auto` opens the gap to the design's 228px whenever the window is
            tall enough; the small padding is only the floor for short laptops. */}
        <div className="mt-auto pt-[5vh] pb-[4.1vh]">
          <PhotoStrip />
        </div>
      </main>
    </div>
  );
}

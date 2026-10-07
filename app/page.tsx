import Link from "next/link";
import { ArrowDown, ArrowRight, BookOpen, Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <section className="my-auto w-full py-6 sm:py-12">
      <div className="relative isolate overflow-hidden rounded-[2rem] border border-white/[0.09] bg-gradient-to-br from-[#173f2e] via-[#123625] to-[#0d2b20] px-6 py-12 shadow-2xl shadow-black/20 sm:px-12 sm:py-16 lg:px-20 lg:py-20">
        <div aria-hidden="true" className="pointer-events-none absolute -right-28 -top-32 -z-10 size-[27rem] rounded-full border border-white/[0.06] sm:size-[36rem]">
          <div className="absolute inset-10 rounded-full border border-white/[0.07]" />
          <div className="absolute inset-24 rounded-full border border-white/[0.08]" />
          <div className="absolute inset-[9rem] rounded-full bg-leaf/[0.07] blur-3xl" />
        </div>
        <div className="relative grid items-center gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-8">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-leaf/25 bg-leaf/[0.08] px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.19em] text-moss">
              <Sparkles aria-hidden="true" size={14} /> Stories, ideas &amp; conversation
            </p>
            <h1 className="mt-7 max-w-3xl font-display text-[3.4rem] font-medium leading-[0.98] tracking-[-0.045em] text-paper sm:text-7xl lg:text-[5.5rem]">
              A little room
              <br />
              <span className="italic text-leaf">to think.</span>
            </h1>
            <p className="mt-7 max-w-lg text-base leading-7 text-white/70 sm:text-lg sm:leading-8">
              Essays, observations, and the occasional rabbit hole. Take a breath, find a story that speaks to you, and stay awhile.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                className="group inline-flex items-center gap-3 rounded-full bg-leaf px-6 py-3.5 text-sm font-bold text-forest shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-moss"
                href="/posts"
              >
                Browse the journal
                <ArrowRight aria-hidden="true" className="transition group-hover:translate-x-1" size={17} />
              </Link>
              <Link className="inline-flex items-center gap-2 px-2 py-3 text-sm font-semibold text-white/65 transition hover:text-white" href="/signIn">
                Join the conversation <ArrowDown aria-hidden="true" size={15} />
              </Link>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-sm lg:ml-auto lg:mr-0">
            <div aria-hidden="true" className="absolute -inset-5 rounded-[2rem] bg-leaf/[0.07] blur-2xl" />
            <div className="relative rotate-2 rounded-[1.65rem] border border-white/15 bg-[#f1efdf] p-5 text-forest shadow-2xl shadow-black/30 transition duration-500 hover:rotate-0 sm:p-7">
              <div className="flex items-center justify-between border-b border-forest/15 pb-4">
                <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-forest/55">
                  <BookOpen aria-hidden="true" size={15} /> Field notes
                </span>
                <span className="size-2 rounded-full bg-[#8ba76d]" />
              </div>
              <p className="mt-7 font-display text-3xl leading-tight sm:text-4xl">
                “The best ideas arrive when we give them a little space.”
              </p>
              <div className="mt-10 flex items-end justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-forest/45">A thought to keep</p>
                  <p className="mt-1 font-display text-lg font-semibold">Read. Reflect. Return.</p>
                </div>
                <div aria-hidden="true" className="flex size-11 items-center justify-center rounded-full bg-forest text-leaf">
                  <ArrowRight size={19} />
                </div>
              </div>
              <div aria-hidden="true" className="absolute -bottom-3 -right-2 -z-10 h-full w-full rounded-[1.65rem] border border-leaf/25" />
            </div>
            <p className="mt-7 text-center text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
              An independent corner of the internet
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3 px-2 pt-7 text-xs font-semibold uppercase tracking-[0.18em] text-white/40 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <span>Made for curious minds</span>
        <span className="hidden h-px flex-1 bg-white/10 sm:mx-8 sm:block" />
        <span>Stay a little. Leave inspired.</span>
      </div>
    </section>
  );
}

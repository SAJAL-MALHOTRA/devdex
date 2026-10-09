import Link from 'next/link';

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0a0a0a]">
      <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse at 72% 30%, rgba(232, 93, 74, 0.1) 0%, transparent 48%)' }} />
      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-7 sm:px-10">
        <header className="flex items-center justify-between">
          <Link href="/" className="font-mono text-sm tracking-[0.28em] text-white">DEVDEX</Link>
          <Link href="/login?mode=sign-in" className="rounded-full border border-white/10 px-4 py-2 text-xs text-gray-300 transition hover:border-white/25 hover:text-white">
            Sign in
          </Link>
        </header>

        <section className="grid flex-1 items-center gap-14 py-16 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#e85d4a]">Your developer identity, in one scan</p>
            <h1 className="mt-6 max-w-2xl text-5xl font-semibold leading-[1.07] tracking-tight text-white sm:text-7xl">
              More than a portfolio.
              <span className="mt-2 block text-gray-500">A connection.</span>
            </h1>
            <p className="mt-7 max-w-lg text-base leading-7 text-gray-400">
              Bring your projects, experience, education, and contact details together. Share one personal QR code—let people scan your work and save your contact in a tap.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/login?mode=sign-up" className="rounded-lg bg-[#e85d4a] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#d14e3d]">
                Create your free profile
              </Link>
              <Link href="#how-it-works" className="rounded-lg border border-white/10 px-6 py-3.5 text-sm text-gray-300 transition hover:border-white/25 hover:text-white">
                See how it works
              </Link>
            </div>
            <div id="how-it-works" className="mt-12 flex flex-wrap gap-x-7 gap-y-3 font-mono text-[10px] uppercase tracking-[0.12em] text-gray-600">
              <span>01 — Build your profile</span>
              <span>02 — Get your QR</span>
              <span>03 — Make a connection</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-sm">
            <div className="absolute -inset-8 rounded-full bg-[#e85d4a]/[0.08] blur-3xl" />
            <div className="relative rounded-2xl border border-white/[0.09] bg-[#111]/90 p-6 shadow-2xl shadow-black/50">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[9px] tracking-[0.2em] text-gray-600">DEVDEX / ID CARD</span>
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
              </div>
              <div className="mt-9 flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-sm font-medium text-gray-300">JD</div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Your name</h2>
                  <p className="mt-1 text-xs text-gray-500">Developer · Creator · Builder</p>
                </div>
              </div>
              <div className="mt-7 space-y-3">
                <div className="h-2 w-full rounded-full bg-white/[0.06]" />
                <div className="h-2 w-4/5 rounded-full bg-white/[0.06]" />
                <div className="h-2 w-3/5 rounded-full bg-white/[0.06]" />
              </div>
              <div className="mt-7 flex flex-wrap gap-2">
                {['Projects', 'Experience', 'Education'].map((item) => (
                  <span key={item} className="rounded-md border border-white/[0.07] px-3 py-1.5 font-mono text-[9px] text-gray-500">{item}</span>
                ))}
              </div>
              <div className="mt-8 flex items-center justify-between border-t border-white/[0.07] pt-5">
                <span className="font-mono text-[9px] tracking-[0.15em] text-gray-600">ONE SCAN. YOUR WHOLE STORY.</span>
                <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
                  <path d="M2 2h8v8H2zM16 2h8v8h-8zM2 16h8v8H2zM16 16h3v3h-3zM21 16h3v3h-3zM16 21h3v3h-3zM21 21h3v3h-3z" stroke="#e85d4a" strokeWidth="1.5" />
                  <path d="M5 5h2v2H5zM19 5h2v2h-2zM5 19h2v2H5z" fill="#e85d4a" />
                </svg>
              </div>
            </div>
          </div>
        </section>
        <footer className="border-t border-white/[0.06] py-5 font-mono text-[9px] tracking-[0.12em] text-gray-700">
          YOUR WORK, READY TO MEET THE WORLD.
        </footer>
      </div>
    </main>
  );
}

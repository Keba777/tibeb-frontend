import Link from 'next/link';

// ============================================================
// Landing Page — "The Digital Parchment"
// Matches stitch/landing_page design
// ============================================================

export default function LandingPage() {
  return (
    <div className="bg-background text-on-surface">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 md:pt-24 pb-12 flex flex-col md:flex-row items-center gap-12">
        {/* Left: copy */}
        <div className="w-full md:w-3/5 text-left md:pr-12">
          <span className="text-secondary font-bold tracking-widest uppercase text-sm mb-4 block">
            The Living Manuscript
          </span>
          <h1 className="font-headline text-5xl md:text-7xl font-extrabold text-primary leading-[1.1] mb-6">
            Unlock Your Potential.{' '}
            <br />
            <span className="ethiopic-text font-bold text-4xl md:text-6xl text-secondary-container">
              ጥበብን ይክፈቱ።
            </span>
          </h1>
          <p className="text-on-surface-variant text-lg md:text-xl leading-relaxed mb-8 max-w-xl">
            Experience Ethiopia&apos;s first AI-powered study companion designed for deep work,
            cultural resonance, and academic excellence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/register"
              className="bg-gradient-to-br from-primary to-primary-container text-on-primary px-10 py-4 rounded-lg font-bold text-lg shadow-ambient hover:scale-[1.02] active:scale-[0.99] transition-transform text-center"
            >
              Start Learning Now
            </Link>
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 text-secondary font-bold px-10 py-4 rounded-lg hover:bg-surface-container-high transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Right: hero image + floating AI card (task 11.1.5) */}
        <div className="w-full md:w-2/5 relative">
          <div className="aspect-[4/5] bg-surface-container-low rounded-3xl overflow-hidden rotate-3 hover:rotate-0 transition-transform duration-700 shadow-2xl">
            {/* Placeholder gradient — replace with real image */}
            <div className="w-full h-full bg-gradient-to-br from-primary-container/30 to-tertiary-container/20 flex items-center justify-center">
              <span className="ethiopic-text text-6xl text-primary/30 font-black">ጥበብ</span>
            </div>
          </div>

          {/* Floating AI card */}
          <div className="absolute -bottom-6 -left-8 bg-surface-container-lowest p-5 rounded-2xl shadow-ambient hidden lg:block max-w-[220px]">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-tertiary-fixed flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-on-tertiary-fixed" aria-hidden="true">
                  <path fillRule="evenodd" d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5Z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="font-bold text-primary text-sm">Tibeb AI</span>
            </div>
            <p className="text-xs text-on-surface-variant ethiopic-text leading-relaxed">
              &ldquo;ስለ ኢትዮጵያ ታሪክ መጠየቅ ትፈልጋለህ?&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* ── Bento grid ───────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary mb-4">
            Crafted for Excellence
          </h2>
          <div className="w-24 h-1 bg-secondary mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:auto-rows-[300px]">
          {/* Large: AI */}
          <div className="md:col-span-2 md:row-span-2 bg-surface-container-low p-8 rounded-3xl flex flex-col justify-between hover:bg-surface-container-lowest hover:shadow-ambient transition-all duration-300">
            <div>
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-6">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-on-primary" aria-hidden="true">
                  <path d="M16.5 7.5h-9v9h9v-9Z" />
                  <path fillRule="evenodd" d="M8.25 2.25A.75.75 0 0 1 9 3v.75h2.25V3a.75.75 0 0 1 1.5 0v.75H15V3a.75.75 0 0 1 1.5 0v.75h.75a3 3 0 0 1 3 3v.75H21A.75.75 0 0 1 21 9h-.75v2.25H21a.75.75 0 0 1 0 1.5h-.75V15H21a.75.75 0 0 1 0 1.5h-.75v.75a3 3 0 0 1-3 3h-.75V21a.75.75 0 0 1-1.5 0v-.75h-2.25V21a.75.75 0 0 1-1.5 0v-.75H9V21a.75.75 0 0 1-1.5 0v-.75h-.75a3 3 0 0 1-3-3v-.75H3A.75.75 0 0 1 3 15h.75v-2.25H3a.75.75 0 0 1 0-1.5h.75V9H3a.75.75 0 0 1 0-1.5h.75v-.75a3 3 0 0 1 3-3h.75V3a.75.75 0 0 1 .75-.75ZM6 6.75A.75.75 0 0 1 6.75 6h10.5a.75.75 0 0 1 .75.75v10.5a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75V6.75Z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-primary font-headline mb-4">
                AI-Powered Study Companion
              </h3>
              <p className="text-on-surface-variant text-lg max-w-md">
                Our AI understands both English and Amharic, helping you navigate complex subjects
                with localized context and intuitive explanations.
              </p>
            </div>
            <div className="mt-8 rounded-2xl bg-gradient-to-br from-primary/10 to-tertiary-container/20 h-48 md:h-64 flex items-center justify-center">
              <span className="ethiopic-text text-5xl text-primary/20 font-black">AI ጥበብ</span>
            </div>
          </div>

          {/* Flashcards */}
          <div className="bg-surface-container-lowest p-8 rounded-3xl hover:shadow-ambient transition-all duration-300">
            <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center mb-6">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-on-secondary" aria-hidden="true">
                <path d="M11.25 5.337c0-.355-.186-.676-.401-.959a1.647 1.647 0 0 1-.349-1.003c0-1.036 1.007-1.875 2.25-1.875S15 2.34 15 3.375c0 .369-.128.713-.349 1.003-.215.283-.401.604-.401.959 0 .332.278.598.61.578 1.91-.114 3.79-.342 5.632-.676a.75.75 0 0 1 .878.645 49.17 49.17 0 0 1 .376 5.452.657.657 0 0 1-.66.664c-.354 0-.675-.186-.958-.401a1.647 1.647 0 0 0-1.003-.349c-1.035 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401.31 0 .557.262.534.571a48.774 48.774 0 0 1-.595 4.845.75.75 0 0 1-.61.61c-1.82.317-3.673.533-5.555.642a.58.58 0 0 1-.611-.581c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.035-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959a.641.641 0 0 1-.658.643 49.118 49.118 0 0 1-4.708-.36.75.75 0 0 1-.645-.878c.293-1.614.504-3.257.629-4.924A.53.53 0 0 0 5.337 15c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.036 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.369 0 .713.128 1.003.349.283.215.604.401.959.401a.656.656 0 0 0 .659-.663 47.703 47.703 0 0 0-.31-4.82.75.75 0 0 1 .83-.832c1.343.155 2.703.254 4.077.294a.64.64 0 0 0 .657-.642Z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-primary font-headline mb-3">Active Recall</h3>
            <p className="text-on-surface-variant">
              Interactive flashcards that adapt to your memory pace using spaced repetition.
            </p>
          </div>

          {/* Focus mode */}
          <div className="bg-surface-container-highest p-8 rounded-3xl hover:shadow-ambient transition-all duration-300">
            <div className="w-12 h-12 bg-tertiary-container rounded-xl flex items-center justify-center mb-6">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-on-tertiary-container" aria-hidden="true">
                <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-primary font-headline mb-3">Focus Mode</h3>
            <p className="text-on-surface-variant">
              A minimalist reading interface designed to eliminate distractions and promote deep
              learning sessions.
            </p>
          </div>

          {/* Progress */}
          <div className="md:col-span-1 bg-primary text-on-primary p-8 rounded-3xl flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold font-headline mb-2">Track Progress</h3>
              <p className="text-primary-fixed-dim text-sm">
                Visual analytics of your learning journey across all subjects.
              </p>
            </div>
            <div className="flex items-end gap-2 h-20 mt-6">
              {[30, 60, 45, 90, 70].map((h, i) => (
                <div
                  key={i}
                  className="bg-secondary w-full rounded-t-sm"
                  style={{ height: `${h}%` }}
                  aria-hidden="true"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="font-headline text-center text-3xl font-bold text-primary mb-12">
          Voices of Wisdom
        </h2>
        <div className="flex flex-nowrap overflow-x-auto gap-6 pb-8 snap-x no-scrollbar">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className={`min-w-[300px] md:min-w-[400px] bg-surface-container-lowest p-8 rounded-2xl shadow-sm snap-center border-l-4 ${t.borderColor}`}
            >
              <p className={`text-on-surface-variant italic mb-6 ${t.ethiopic ? 'ethiopic-text' : ''}`}>
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-primary font-bold text-lg">
                  {t.name[0]}
                </div>
                <div>
                  <p className="font-bold text-primary">{t.name}</p>
                  <p className="text-xs text-outline">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="bg-surface-container-low pt-20 pb-24 md:pb-12 mt-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="text-3xl font-black text-primary italic font-headline mb-6">
              Tibeb <span className="ethiopic-text">ጥበብ</span>
            </div>
            <p className="text-on-surface-variant max-w-sm mb-8">
              Empowering the next generation of Ethiopian scholars with tools that respect tradition
              and embrace innovation.
            </p>
          </div>
          <div>
            <h5 className="font-bold text-primary mb-6">Learning</h5>
            <ul className="space-y-4">
              {['Subjects', 'AI Tutor', 'Flashcards', 'Resources'].map((l) => (
                <li key={l}>
                  <Link href="#" className="text-on-surface-variant hover:text-secondary transition-colors">
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-primary mb-6">Company</h5>
            <ul className="space-y-4">
              {['About Us', 'Community', 'Privacy', 'Terms'].map((l) => (
                <li key={l}>
                  <Link href="#" className="text-on-surface-variant hover:text-secondary transition-colors">
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-outline-variant/30 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-outline">© 2024 Tibeb Educational Platforms. Crafted for Ethiopia.</p>
          <span className="text-xs uppercase tracking-widest font-bold text-primary">Parchment v1.0</span>
        </div>
      </footer>
    </div>
  );
}

// ── Data ──────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    name: 'Selamawit T.',
    role: 'University Student, Addis Ababa',
    quote: 'Tibeb changed how I prepare for my exams. The Ethiopic support makes studying history so much more natural.',
    borderColor: 'border-secondary',
    ethiopic: false,
  },
  {
    name: 'Henok G.',
    role: 'Medical Student, Gondar',
    quote: 'The AI assistant is like having a private tutor available 24/7. It explains things in ways I actually understand.',
    borderColor: 'border-tertiary',
    ethiopic: false,
  },
  {
    name: 'Bethelhem K.',
    role: 'Grade 12 Student, Bahir Dar',
    quote: 'ጥበብ ለኔ ምርጥ የትምህርት ረዳት ነች። በተለይ የአማርኛ ጽሁፎች መኖራቸው ትልቅ ጥቅም አለው።',
    borderColor: 'border-primary',
    ethiopic: true,
  },
];

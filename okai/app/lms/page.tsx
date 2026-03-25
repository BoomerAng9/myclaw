import Link from 'next/link';
import { ArrowRight, BookOpenCheck, GraduationCap, Layers3, LibraryBig, Users2, WandSparkles } from 'lucide-react';
import { Navbar } from '@/components/marketing/Navbar';

const blendedLearningPoints = [
  {
    title: 'Blended delivery by design',
    copy: 'Our LMS combines structured digital coursework with trainer-led guidance, so learners get both scalable content and live expert context.',
    icon: <Layers3 className="size-5" aria-hidden="true" />,
  },
  {
    title: 'Trainer-backed knowledge transfer',
    copy: 'Industry trainers, subject matter experts, and internal leaders can use the platform to transfer real operating knowledge into repeatable learning experiences.',
    icon: <Users2 className="size-5" aria-hidden="true" />,
  },
  {
    title: 'Custom course creation accuracy',
    copy: 'OPEN|KLASS AI turns source materials, SME guidance, and specific business needs into custom learning journeys with high structural consistency and speed.',
    icon: <WandSparkles className="size-5" aria-hidden="true" />,
  },
];

const lmsCapabilities = [
  'Use existing catalog courses where proven content already fits the need.',
  'Create custom courses for internal experts, client education, onboarding, and knowledge-transfer initiatives.',
  'Blend asynchronous coursework with trainer facilitation, office hours, demos, and applied assignments.',
  'Support expert-led programs without forcing every trainer to become an instructional designer from scratch.',
];

export default function LmsPage() {
  return (
    <div className="min-h-screen bg-[#f6f2ea] text-[#13232d]">
      <Navbar />

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-16 top-20 h-72 w-72 rounded-full bg-[#ffcc80]/35 blur-3xl" />
        <div className="absolute right-0 top-32 h-96 w-96 rounded-full bg-[#7cc5b3]/30 blur-3xl" />
        <div className="absolute bottom-10 left-1/3 h-80 w-80 rounded-full bg-[#3e6f8a]/15 blur-3xl" />
      </div>

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-16 px-6 pb-20 pt-28 lg:px-8 lg:pt-36">
        <section className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#184055]/20 bg-white/75 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-[#184055]">
              <LibraryBig className="size-4 text-[#f05a28]" aria-hidden="true" />
              LMS + Trainers + Custom Courses
            </div>

            <h1 className="font-(--font-display) text-5xl leading-[0.95] tracking-tight text-[#102029] sm:text-6xl">
              A blended learning system built for experts, teams, and real knowledge transfer.
            </h1>

            <p className="max-w-3xl text-lg leading-relaxed text-[#274353] sm:text-xl">
              Our LMS is designed to deliver catalog courses, trainer-led instruction, and custom course creation in one
              learning environment. That makes it easier to support workforce readiness, partner enablement, and expert-led
              programs without fragmenting the learner experience.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/certificate-courses"
                className="group inline-flex h-13 items-center justify-center rounded-full bg-[#102c3b] px-8 text-sm font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-[#0e2531]"
              >
                Explore Course Catalog
                <ArrowRight className="ml-2 size-4 transition group-hover:translate-x-1" aria-hidden="true" />
              </Link>
              <Link
                href="/trainers"
                className="inline-flex h-13 items-center justify-center rounded-full border border-[#102c3b]/20 bg-white/80 px-8 text-sm font-semibold uppercase tracking-[0.12em] text-[#102c3b] transition hover:bg-white"
              >
                Meet The Trainer Model
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#184055]/15 bg-[#143443] p-7 text-white shadow-[0_20px_80px_rgba(17,42,54,0.18)]">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <BookOpenCheck className="mb-3 size-5 text-[#9ed9cd]" aria-hidden="true" />
                <h2 className="text-sm font-semibold">Existing or custom</h2>
                <p className="mt-2 text-sm leading-relaxed text-white/75">
                  Start with proven catalog content or generate a new course specifically for a client, department, or expert initiative.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <GraduationCap className="mb-3 size-5 text-[#ffcfb9]" aria-hidden="true" />
                <h2 className="text-sm font-semibold">Blended experience</h2>
                <p className="mt-2 text-sm leading-relaxed text-white/75">
                  Pair digital lessons with live facilitation, coaching, practice reviews, and trainer-led interpretation.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {blendedLearningPoints.map((item) => (
            <article
              key={item.title}
              className="rounded-[1.75rem] border border-[#1e4154]/15 bg-white/80 p-6 shadow-sm backdrop-blur"
            >
              <div className="mb-4 inline-flex rounded-xl bg-[#102c3b] p-2.5 text-[#ffcfb9]">{item.icon}</div>
              <h2 className="text-xl font-semibold text-[#102029]">{item.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-[#365567]">{item.copy}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-start">
          <div className="rounded-[2rem] border border-[#1e4154]/15 bg-white/85 p-8 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#3c677b]">Custom Course Creation</p>
            <h2 className="mt-4 font-(--font-display) text-3xl leading-tight text-[#102029] sm:text-4xl">
              Built to capture expert knowledge with more structure and less friction.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[#365567] sm:text-base">
              When an expert already knows the material, the challenge is rarely content scarcity. The challenge is turning
              that expertise into something teachable, repeatable, and scalable. OPEN|KLASS AI helps do that with course
              creation workflows that organize source material into usable learning sequences faster and more consistently.
            </p>
          </div>

          <div className="rounded-[2rem] border border-[#1e4154]/15 bg-[#143443] p-8 text-white shadow-[0_16px_50px_rgba(17,42,54,0.14)]">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#9ed9cd]">How We Use It</p>
            <div className="mt-4 grid gap-3 text-sm leading-relaxed text-white/80">
              {lmsCapabilities.map((item) => (
                <p key={item}>• {item}</p>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-[#1e4154]/15 bg-[#102c3b] px-7 py-10 text-white sm:px-10">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#9ed9cd]">Platform Roadmap</p>
              <h2 className="font-(--font-display) text-3xl leading-tight sm:text-4xl">
                The learning model is ready. The multi-tenant SaaS layer is the next major system step.
              </h2>
              <p className="max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">
                We still need the right multi-tenant SaaS setup for the OKAI system. That work sits alongside the LMS and
                course-creation value story, not instead of it. The platform already shows strong instructional and course
                assembly capability, and the next phase is packaging it cleanly for tenant-aware delivery.
              </p>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/5 p-5 text-sm leading-relaxed text-white/80">
              <p>The current strength is instructional accuracy, course generation speed, and blended delivery flexibility.</p>
              <p className="mt-3">The current gap is a finalized tenant-aware SaaS architecture for scale, isolation, provisioning, and lifecycle management.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
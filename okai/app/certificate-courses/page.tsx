import Link from 'next/link';
import { ArrowUpRight, Award, BadgeCheck, BriefcaseBusiness, Layers3, Network } from 'lucide-react';
import { Navbar } from '@/components/marketing/Navbar';
import { certificateCourses, contentPartners, learningCategories, type CatalogCount } from '@/lib/marketing/certificate-courses';

function formatCount(item: CatalogCount) {
  const parts = [];

  if (item.courses > 0) {
    parts.push(`${item.courses} Course${item.courses === 1 ? '' : 's'}`);
  }

  if (item.certificates) {
    parts.push(`${item.certificates} Certificate${item.certificates === 1 ? '' : 's'}`);
  }

  if (item.bundles) {
    parts.push(`${item.bundles} Bundle${item.bundles === 1 ? '' : 's'}`);
  }

  return parts.join(' • ');
}

export default function CertificateCoursesPage() {
  return (
    <div className="min-h-screen bg-[#f6f2ea] text-[#13232d]">
      <Navbar />

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-6 pb-20 pt-28 lg:px-8 lg:pt-36">
        <section className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#184055]/20 bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-[#184055]">
              <Award className="size-4 text-[#f05a28]" aria-hidden="true" />
              ACHIEVEMOR x MindEdge Certificates
            </div>

            <h1 className="font-(--font-display) text-5xl leading-[0.95] tracking-tight text-[#102029] sm:text-6xl">
              Certificate pathways that turn learning progress into job-ready proof.
            </h1>

            <p className="max-w-3xl text-lg leading-relaxed text-[#274353] sm:text-xl">
              Explore the ACHIEVEMOR catalog across certificate courses, partner programs, and workforce-ready domains.
              These offerings help learners build structured skills, earn visible credentials, and move closer to promotion,
              placement, or role expansion.
            </p>
          </div>

          <div className="rounded-[2rem] border border-[#184055]/15 bg-[#143443] p-7 text-white shadow-[0_20px_80px_rgba(17,42,54,0.18)]">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <BadgeCheck className="mb-3 size-5 text-[#9ed9cd]" aria-hidden="true" />
                <h2 className="text-sm font-semibold">Certificate courses</h2>
                <p className="mt-2 text-sm leading-relaxed text-white/75">
                  Short, structured pathways that package learning into a clear credential learners can show to employers,
                  managers, and clients.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <BriefcaseBusiness className="mb-3 size-5 text-[#ffcfb9]" aria-hidden="true" />
                <h2 className="text-sm font-semibold">Job readiness</h2>
                <p className="mt-2 text-sm leading-relaxed text-white/75">
                  Programs aligned to practical roles in HR, leadership, operations, project delivery, banking, design,
                  cybersecurity, and nonprofit management.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[1.75rem] border border-[#184055]/15 bg-white/75 p-6 backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#3c677b]">Coverage</p>
            <p className="mt-3 font-(--font-display) text-4xl text-[#102029]">31</p>
            <p className="mt-2 text-sm leading-relaxed text-[#365567]">Learning categories spanning professional development, leadership, operations, and technical readiness.</p>
          </div>
          <div className="rounded-[1.75rem] border border-[#184055]/15 bg-white/75 p-6 backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#3c677b]">Partners</p>
            <p className="mt-3 font-(--font-display) text-4xl text-[#102029]">11</p>
            <p className="mt-2 text-sm leading-relaxed text-[#365567]">Content partners and branded learning lines that strengthen credibility and market alignment.</p>
          </div>
          <div className="rounded-[1.75rem] border border-[#184055]/15 bg-white/75 p-6 backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#3c677b]">Outcome</p>
            <p className="mt-3 font-(--font-display) text-4xl text-[#102029]">Clear</p>
            <p className="mt-2 text-sm leading-relaxed text-[#365567]">Learners can move from course completion to capability signaling with certificates, bundles, and role-focused tracks.</p>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#184055]/15 bg-white/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#184055]">
                <Layers3 className="size-4 text-[#f05a28]" aria-hidden="true" />
                Learning Categories
              </div>
              <h2 className="font-(--font-display) text-3xl leading-tight text-[#102029] sm:text-4xl">
                Course families built for skill-building depth.
              </h2>
            </div>
            <Link
              href="https://catalog.mindedge.com/achievemor"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.08em] text-[#f05a28] transition hover:text-[#c74417]"
            >
              Browse Full Catalog
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {learningCategories.map((category) => (
              <article
                key={category.title}
                className="rounded-[1.5rem] border border-[#1e4154]/15 bg-white/85 p-5 shadow-sm backdrop-blur"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#3c677b]">Learning Category</p>
                <h3 className="mt-3 text-2xl font-semibold leading-tight text-[#102029]">{category.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#365567]">{formatCount(category)}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#184055]/15 bg-white/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#184055]">
              <Network className="size-4 text-[#f05a28]" aria-hidden="true" />
              Content Partners
            </div>
            <h2 className="font-(--font-display) text-3xl leading-tight text-[#102029] sm:text-4xl">
              Trusted partner libraries that expand credential credibility.
            </h2>
            <p className="max-w-3xl text-sm leading-relaxed text-[#365567] sm:text-base">
              Partner-backed content strengthens the catalog with specialized brands in HR, nonprofit leadership, design,
              frontline management, quality improvement, and business execution.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {contentPartners.map((partner) => (
              <article
                key={partner.title}
                className="rounded-[1.5rem] border border-[#1e4154]/15 bg-[#143443] p-5 text-white shadow-[0_16px_50px_rgba(17,42,54,0.12)]"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9ed9cd]">Content Partner</p>
                <h3 className="mt-3 text-2xl font-semibold leading-tight">{partner.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/75">{formatCount(partner)}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-[#1e4154]/15 bg-[#143443] px-7 py-10 text-white sm:px-10">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#9ed9cd]">Why It Matters</p>
              <h2 className="font-(--font-display) text-3xl leading-tight sm:text-4xl">
                Certificates support the story employers need to hear.
              </h2>
              <p className="max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">
                A completed certificate course does more than mark attendance. It gives learners a defined pathway,
                a practical milestone, and evidence that they can follow through on applied upskilling.
              </p>
            </div>

            <div className="grid gap-3 rounded-2xl border border-white/15 bg-white/5 p-5 text-sm text-white/80">
              <p>• Certificates help frame a learner's progress in language that supervisors and recruiters can quickly understand.</p>
              <p>• Job readiness grows when content is paired with practice, reflection, and a visible completion signal.</p>
              <p>• Partner-backed pathways give teams a cleaner way to align development plans with real business capability gaps.</p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {certificateCourses.map((course) => (
            <article
              key={course.href}
              className="flex h-full flex-col rounded-[1.75rem] border border-[#1e4154]/15 bg-white/85 p-6 shadow-sm backdrop-blur"
            >
              <div className="mb-5 flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#3c677b]">{course.provider}</p>
                  <p className="mt-2 inline-flex rounded-full bg-[#f2f7f8] px-3 py-1 text-xs font-medium text-[#184055]">
                    {course.credentialType}
                  </p>
                </div>
              </div>

              <h2 className="text-2xl font-semibold leading-tight text-[#102029]">{course.title}</h2>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-[#365567]">{course.summary}</p>

              <Link
                href={course.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.08em] text-[#f05a28] transition hover:text-[#c74417]"
              >
                View In MindEdge
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </Link>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
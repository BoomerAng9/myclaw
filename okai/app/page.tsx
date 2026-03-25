"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowRight,
  BadgeCheck,
  BookOpenText,
  Lock,
  Radar,
  Shield,
  Sparkles,
  Workflow,
} from "lucide-react";
import { Navbar } from "@/components/marketing/Navbar";

const securityPillars = [
  {
    title: "Zero Credential Leakage",
    copy: "Model keys remain server-side with strict provider routing and no client-side secret exposure.",
    icon: <Lock className="size-5" aria-hidden="true" />,
  },
  {
    title: "Defense-In-Depth Runtime",
    copy: "Security headers, bounded origins, and strict browser permissions reduce abuse and attack surface.",
    icon: <Shield className="size-5" aria-hidden="true" />,
  },
  {
    title: "Observable Class Generation",
    copy: "Asynchronous generation jobs are traceable with status polling for deterministic classroom delivery.",
    icon: <Radar className="size-5" aria-hidden="true" />,
  },
];

const valueCards = [
  {
    title: "Curriculum Engine",
    copy: "Turn a topic or PDF into a coherent teaching arc with scenes, prompts, and progressive difficulty.",
    icon: <BookOpenText className="size-5" aria-hidden="true" />,
  },
  {
    title: "Multi-Agent Delivery",
    copy: "Run teacher, coach, and challenger personas in one classroom so learners can reason from multiple lenses.",
    icon: <Workflow className="size-5" aria-hidden="true" />,
  },
  {
    title: "Assessment Built-In",
    copy: "Move from explanation to retention with generated checks, scenario prompts, and reflection loops.",
    icon: <BadgeCheck className="size-5" aria-hidden="true" />,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f6f2ea] text-[#13232d] selection:bg-[#f05a28]/30">
      <Navbar />

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-24 -top-20 h-72 w-72 rounded-full bg-[#ffcc80]/45 blur-3xl" />
        <div className="absolute right-0 top-24 h-96 w-96 rounded-full bg-[#7cc5b3]/40 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-96 w-96 -translate-x-1/2 rounded-full bg-[#3e6f8a]/20 blur-3xl" />
      </div>

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-24 px-6 pb-20 pt-28 lg:px-8 lg:pt-36">
        <section className="grid items-start gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-[#184055]/20 bg-white/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-[#184055]">
              <Sparkles className="size-3.5 text-[#f05a28]" aria-hidden="true" />
              Open|Klass Control Surface
            </div>

            <h1 className="font-(--font-display) text-5xl leading-[0.95] tracking-tight text-[#102029] sm:text-6xl lg:text-7xl">
              Build classrooms that
              <span className="block text-[#f05a28]">teach, test, and trust.</span>
            </h1>

            <p className="max-w-2xl text-lg leading-relaxed text-[#274353] sm:text-xl">
              OPEN|KLASS AI converts your source material into an interactive learning system with
              multi-agent instruction, structured progression, and enterprise-grade runtime controls.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/app"
                className="group inline-flex h-13 items-center justify-center rounded-full bg-[#102c3b] px-8 text-sm font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-[#0e2531]"
              >
                Enter Classroom
                <ArrowRight className="ml-2 size-4 transition group-hover:translate-x-1" aria-hidden="true" />
              </Link>
              <Link
                href="https://catalog.mindedge.com/achievemor"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-13 items-center justify-center rounded-full border border-[#102c3b]/25 bg-white/80 px-8 text-sm font-semibold uppercase tracking-[0.12em] text-[#102c3b] transition hover:bg-white"
              >
                MindEdge Catalog
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.15 }}
            className="relative rounded-[2rem] border border-[#184055]/20 bg-[#112a36] p-6 text-white shadow-[0_20px_80px_rgba(17,42,54,0.25)]"
          >
            <div className="absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_top_right,rgba(124,197,179,0.35),transparent_55%)]" />
            <div className="relative space-y-6">
              <div className="flex items-center justify-between">
                <span className="rounded-full border border-white/20 px-3 py-1 text-xs uppercase tracking-[0.12em] text-white/80">
                  Session Preview
                </span>
                <span className="rounded-full bg-[#7cc5b3]/20 px-3 py-1 text-xs font-medium text-[#b8f4e6]">
                  Security Hardened
                </span>
              </div>

              <div className="space-y-3">
                <div className="h-4 w-3/5 rounded-full bg-white/20" />
                <div className="h-3 w-full rounded-full bg-white/10" />
                <div className="h-3 w-4/5 rounded-full bg-white/10" />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {securityPillars.map((item, idx) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.25 + idx * 0.1 }}
                    className="rounded-2xl border border-white/15 bg-white/5 p-4"
                  >
                    <div className="mb-2 inline-flex rounded-lg bg-white/10 p-2 text-[#ffb89d]">{item.icon}</div>
                    <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-white/70">{item.copy}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        <section className="space-y-10">
          <div className="max-w-3xl space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#3c677b]">Platform Capabilities</p>
            <h2 className="font-(--font-display) text-3xl leading-tight text-[#102029] sm:text-4xl">
              One workflow from source material to deployable classroom.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {valueCards.map((card, idx) => (
              <motion.article
                key={card.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="rounded-3xl border border-[#1e4154]/15 bg-white/80 p-6 backdrop-blur"
              >
                <div className="mb-4 inline-flex rounded-xl bg-[#102c3b] p-2.5 text-[#ffcfb9]">{card.icon}</div>
                <h3 className="text-xl font-semibold text-[#102029]">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#365567]">{card.copy}</p>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-[#1e4154]/15 bg-[#143443] px-7 py-10 text-white sm:px-10">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#9ed9cd]">Security And Governance</p>
              <h2 className="font-(--font-display) text-3xl leading-tight sm:text-4xl">
                Private-by-default classroom generation.
              </h2>
              <p className="max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">
                OPEN|KLASS AI now ships with strict transport and browser security headers, hardened provider-key
                resolution, and safer model-routing defaults. This reduces spoofing risk, clickjacking exposure,
                and accidental key misuse while preserving fast generation flows.
              </p>
            </div>

            <div className="grid gap-3 rounded-2xl border border-white/15 bg-white/5 p-5 text-sm">
              <p className="font-semibold text-white">Included hardening baseline</p>
              <p className="text-white/75">• HSTS, frame-ancestors lockout, and MIME sniff protection.</p>
              <p className="text-white/75">• Strict referrer and browser permission policy.</p>
              <p className="text-white/75">• CSP baseline tuned for Next.js runtime compatibility.</p>
              <p className="text-white/75">• Safer OpenRouter/OpenAI provider credential fallback behavior.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#184055]/10 bg-white/45 py-8">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-6 text-sm text-[#365567] sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p className="font-semibold tracking-[0.09em] text-[#102029]">OPEN|KLASS AI</p>
          <div className="flex items-center gap-5">
            <Link href="/lms" className="transition hover:text-[#f05a28]">LMS</Link>
            <Link href="/about" className="transition hover:text-[#f05a28]">About</Link>
            <Link href="/career" className="transition hover:text-[#f05a28]">Careers</Link>
            <Link href="/certificate-courses" className="transition hover:text-[#f05a28]">Certificates</Link>
            <Link href="/app" className="transition hover:text-[#f05a28]">Launch</Link>
          </div>
          <p>© 2026 ACHIEVEMOR</p>
        </div>
      </footer>
    </div>
  );
}


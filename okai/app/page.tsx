"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { Navbar } from "@/components/marketing/Navbar";
import { useRef } from "react";
import { BookOpen, Sparkles, Users, Cpu, ArrowRight, ShieldCheck } from "lucide-react";

export default function LandingPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#050508] text-white font-sans overflow-x-hidden selection:bg-purple-500/30">
      <Navbar />

      {/* --- Ambient Background --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-purple-600/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[20%] right-[-5%] w-[500px] h-[500px] rounded-full bg-cyan-600/10 blur-[100px]" />
      </div>

      <main className="relative z-10 pt-32 lg:pt-48 pb-24">
        {/* --- Hero Section --- */}
        <section className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-8"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold tracking-widest uppercase text-cyan-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
              </span>
              Academic Orchestration 1.0
            </div>

            <h1 className="text-6xl lg:text-8xl font-black tracking-tighter leading-[0.9] lg:leading-[0.85]">
              Socratic <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-white to-cyan-400">
                Intelligence.
              </span>
            </h1>

            <p className="text-xl text-slate-400 leading-relaxed font-light max-w-xl">
              The Open Source AI Interactive Classroom. Upload PDFs, interact with specialized agents, and experience knowledge transition through deep, multimodal dialogue.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href="/app"
                className="group relative inline-flex h-14 items-center justify-center rounded-xl bg-white px-10 text-base font-bold text-black shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Enter Classroom
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="https://github.com/ACHIEVEMOR/open-maic"
                target="_blank"
                className="inline-flex h-14 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-8 text-base font-medium text-white hover:bg-white/10 transition-all backdrop-blur-md"
              >
                GitHub Repo
              </Link>
            </div>
          </motion.div>

          {/* --- Kinetic Card / Graphic --- */}
          <motion.div
            style={{ y: y1 }}
            className="hidden lg:flex items-center justify-center"
          >
            <div className="relative w-full max-w-[500px] aspect-square rounded-[3rem] border border-white/10 bg-white/[0.02] backdrop-blur-3xl overflow-hidden p-8 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-cyan-500/5" />
              <div className="relative h-full flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                    <Sparkles className="text-white w-6 h-6" />
                  </div>
                  <div className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-[10px] font-bold text-green-400 uppercase tracking-tighter">
                    Active Session
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="h-6 w-3/4 rounded-full bg-white/5 animate-pulse" />
                  <div className="h-4 w-full rounded-full bg-white/5" />
                  <div className="h-4 w-2/3 rounded-full bg-white/5" />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="aspect-video rounded-xl bg-white/5 border border-white/10" />
                  ))}
                </div>
              </div>
              
              {/* Decorative Rings */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] border border-white/5 rounded-full pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-white-[0.03] rounded-full pointer-events-none" />
            </div>
          </motion.div>
        </section>

        {/* --- Features Grid --- */}
        <section className="max-w-7xl mx-auto px-6 lg:px-8 mt-32 lg:mt-56">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Cpu className="w-5 h-5 text-purple-400" />}
              title="Multi-Agent Swarm"
              desc="Interact with the Concierge, Tutor, and Mentor nodes simultaneously for a holistic learning perspective."
            />
            <FeatureCard 
              icon={<BookOpen className="w-5 h-5 text-cyan-400" />}
              title="Interactive MathML"
              desc="Deep integration with mathematical rendering and formula exploration powered by LaTeX and MathML."
            />
            <FeatureCard 
              icon={<ShieldCheck className="w-5 h-5 text-green-400" />}
              title="Governed Outcomes"
              desc="Every response is reviewed and anchored to the source material to prevent hallucinations."
            />
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 py-12 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-slate-500 text-sm">
          <div className="font-bold text-white tracking-widest uppercase">Open|Klass AI</div>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-white transition-colors">Documentation</Link>
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-white transition-colors">Contact</Link>
          </div>
          <div>© 2026 ACHIEVEMOR LLC.</div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="p-8 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all"
    >
      <div className="mb-6">{icon}</div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">
        {desc}
      </p>
    </motion.div>
  );
}


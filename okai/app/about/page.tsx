"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { Navbar } from "@/components/marketing/Navbar";
import { Users, BookOpen, Share2 } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-sans overflow-x-hidden pt-24">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6">Built for <span className="text-violet-600 dark:text-violet-400">Peer-to-Peer</span> Learning</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Open|Klass AI is a revolutionary platform dedicated to knowledge sharing. We believe the fastest way to master a skill is by learning directly from someone who has already mastered it.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="order-2 md:order-1 relative aspect-square max-w-md mx-auto"
          >
            <div className="absolute inset-0 bg-violet-100 dark:bg-violet-900/20 rounded-[2rem] transform -rotate-3" />
            <img src="/okai-logos/okai-badge-formal.png" alt="Peer Learning" className="relative z-10 w-full h-full object-contain p-8 drop-shadow-xl" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="order-1 md:order-2 space-y-8"
          >
            {[
              { icon: Users, title: "Community Driven", desc: "Collaborate in real-time with peers and experts." },
              { icon: Share2, title: "Knowledge Sharing", desc: "Share your own expertise and learn from others seamlessly." },
              { icon: BookOpen, title: "Interactive Classrooms", desc: "Generative UI that adapts to your prompt and learning style." },
            ].map((feature, i) => (
              <div key={i} className="flex gap-4">
                <div className="shrink-0 size-12 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400">
                  <feature.icon className="size-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400">{feature.desc}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="mt-24 text-center">
          <Link href="/app" className="inline-flex h-12 items-center justify-center rounded-full bg-slate-900 dark:bg-white px-8 font-medium text-white dark:text-slate-900 shadow-lg hover:scale-105 transition-transform">
            Start Learning
          </Link>
        </div>
      </main>
    </div>
  );
}


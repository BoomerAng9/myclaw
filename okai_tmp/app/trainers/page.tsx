"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { Navbar } from "@/components/marketing/Navbar";
import { Mic, Star, Target } from "lucide-react";

export default function TrainersPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-sans overflow-x-hidden pt-24">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6">Learn From <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-rose-500">Industry Trainers</span></h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Skip the traditional path. You have the option to take courses directly from active industry trainers and voices of authority who have proven their expertise in the field.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="order-2 md:order-1 relative flex justify-center"
          >
            {/* Using the full logo here */}
            <img src="/okai-logos/okai-logo-full.png" alt="Open Class AI Logo Full" className="relative z-10 w-[80%] max-w-sm object-contain drop-shadow-lg" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="order-1 md:order-2 space-y-8"
          >
            {[
              { icon: Star, title: "Solidified Authority", desc: "Our trainers are vetted professionals who actively work in the trenches of the modern tech landscape." },
              { icon: Mic, title: "Direct Mentorship", desc: "Gain access to unfiltered industry knowledge without bureaucratic fluff." },
              { icon: Target, title: "Practical Application", desc: "Focus entirely on applying skills immediately to your day-to-day workflow." },
            ].map((feature, i) => (
              <div key={i} className="flex gap-4">
                <div className="shrink-0 size-12 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
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
      </main>
    </div>
  );
}

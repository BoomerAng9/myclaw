"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { Navbar } from "@/components/marketing/Navbar";
import { ShieldCheck, Award, GraduationCap } from "lucide-react";

export default function AccreditedPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-sans overflow-x-hidden pt-24">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 font-medium text-sm mb-6">
            <ShieldCheck className="size-4" /> Official Certification
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6">Accredited <span className="text-cyan-500">Training Courses</span></h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Open|Klass AI partners with industry giants like Mind Edge and EC Council to provide self-paced, fully certified courses recognized worldwide.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800">
              <h3 className="text-2xl font-bold mb-3 flex items-center gap-3">
                <Award className="text-cyan-500" /> Mind Edge Certification
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Gain access to a massive library of professional development courses. Earn verifiable badges and certificates across dozens of disciplines at your own pace.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800">
              <h3 className="text-2xl font-bold mb-3 flex items-center gap-3">
                <GraduationCap className="text-violet-500" /> EC Council Security
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Master cybersecurity, ethical hacking, and network defense through our EC Council partnership. Become an authoritative voice in secure tech.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="relative aspect-square max-w-md mx-auto"
          >
            <div className="absolute inset-0 bg-cyan-100 dark:bg-cyan-900/20 rounded-full transform rotate-3 blur-3xl opacity-50" />
            <img src="/okai-logos/okai-badge-ok.png" alt="OKAI Accreditation" className="relative z-10 w-full h-full object-contain p-4 drop-shadow-2xl" />
          </motion.div>
        </div>
      </main>
    </div>
  );
}


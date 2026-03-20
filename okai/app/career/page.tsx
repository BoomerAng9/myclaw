"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { Navbar } from "@/components/marketing/Navbar";
import { Briefcase, CheckCircle2, Building2 } from "lucide-react";

export default function CareerPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-sans overflow-x-hidden pt-24">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-medium text-sm mb-6">
            <Briefcase className="size-4" /> Hiring Network
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6">Career <span className="text-emerald-500">Connect</span></h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Education is only the first step. Open Class AI connects you directly with companies that have pledged to accept and value our training certifications.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="flex gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800">
               <div className="shrink-0 pt-1 text-emerald-500"><CheckCircle2 className="size-6" /></div>
               <div>
                  <h3 className="text-xl font-bold mb-2">Verified Skill Profiles</h3>
                  <p className="text-slate-600 dark:text-slate-400">Your certifications through Mind Edge, EC Council, and our Industry Trainers build an undeniable portfolio.</p>
               </div>
            </div>
            <div className="flex gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800">
               <div className="shrink-0 pt-1 text-emerald-500"><Building2 className="size-6" /></div>
               <div>
                  <h3 className="text-xl font-bold mb-2">Direct Employer Matches</h3>
                  <p className="text-slate-600 dark:text-slate-400">We partner with forward-thinking companies who prioritize practical skills and direct industry education over traditional degrees.</p>
               </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="relative aspect-square max-w-md mx-auto"
          >
             {/* Using the primary logo (the face logo) here to distribute the 4 logos */}
            <div className="absolute inset-x-0 bottom-0 top-1/2 bg-emerald-100 dark:bg-emerald-900/20 blur-3xl opacity-50" />
            <img src="/okai-logos/okai-logo-primary.png" alt="Open Class AI Connect" className="relative z-10 w-full h-full object-contain p-4 drop-shadow-2xl" />
          </motion.div>
        </div>

        <div className="mt-12 text-center pb-24">
          <h2 className="text-2xl font-bold mb-6">Ready to jumpstart your career?</h2>
          <Link href="/app" className="inline-flex h-14 items-center justify-center rounded-full bg-emerald-500 hover:bg-emerald-600 px-10 font-bold text-white shadow-xl hover:scale-105 transition-all">
            Join the Classroom
          </Link>
        </div>
      </main>
    </div>
  );
}

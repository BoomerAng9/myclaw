"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { Navbar } from "@/components/marketing/Navbar";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-sans overflow-x-hidden selection:bg-cyan-500/30">
      <Navbar />

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-48 lg:mt-56 grid lg:grid-cols-2 gap-12 items-center mb-24">
        {/* Left Content column */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex flex-col gap-8 max-w-2xl"
        >
          <div className="inline-flex max-w-max items-center gap-2 rounded-full border border-violet-200 dark:border-violet-900/40 bg-violet-50 dark:bg-violet-950/30 px-3 py-1 text-sm font-medium text-violet-700 dark:text-violet-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
            </span>
            Knowledge Sharing Accelerated
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-loose lg:leading-tight">
            Peer-to-Peer Learning with <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-cyan-500 drop-shadow-sm">Open|Klass AI</span>
          </h1>
          
          <p className="text-lg lg:text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-light">
            We offer accredited training courses, direct mentorship from industry leaders, and connect you with top companies ready to accept your Open|Klass AI certification.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link
              href="/app"
              className="inline-flex h-14 items-center justify-center rounded-full bg-slate-900 dark:bg-white px-8 text-base font-medium text-white dark:text-slate-900 shadow-xl shadow-slate-900/20 hover:scale-105 transition-all w-full sm:w-auto hover:bg-slate-800 dark:hover:bg-gray-100"
            >
              Enter Classroom Now
            </Link>
            <Link
              href="/about"
              className="inline-flex h-14 items-center justify-center rounded-full border-2 border-slate-200 dark:border-slate-800 bg-transparent px-8 text-base font-medium text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-900 transition-all w-full sm:w-auto"
            >
              Learn More
            </Link>
          </div>
        </motion.div>

        {/* Right Graphic column */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
          className="relative lg:ml-auto w-full max-w-[550px] aspect-square flex items-center justify-center"
        >
          {/* Decorative Backdrops */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-cyan-500/10 rounded-[3rem] blur-3xl" />
          <div className="absolute inset-8 bg-gradient-to-tl from-cyan-400/20 to-violet-500/20 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '4s' }} />
          
          {/* Main Hero Graphic / Concierge Logo */}
          <img 
            src="/okai-logos/okai-badge-formal.png" 
            alt="Open|Klass AI Concierge Badge" 
            className="w-[120%] lg:w-[140%] max-w-none relative z-10 drop-shadow-2xl hover:scale-105 transition-transform duration-500 transform translate-x-4 lg:translate-x-8"
          />
        </motion.div>
      </main>
    </div>
  );
}

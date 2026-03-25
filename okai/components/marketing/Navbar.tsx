"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/lms", label: "LMS" },
  { href: "/certificate-courses", label: "Certificate Courses" },
  { href: "/about", label: "Peer-to-Peer Learning" },
  { href: "/accredited", label: "Accredited Training" },
  { href: "/trainers", label: "Industry Trainers" },
  { href: "/career", label: "Career Connect" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 z-50 w-full border-b border-[#184055]/10 bg-[#f6f2ea]/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3 w-48">
            <Link href="/" className="flex shrink-0 items-center justify-center">
              <img src="/okai-logos/okai-logo-primary.png" alt="OKAI Logo" className="h-8 object-contain" />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-semibold text-[#28485a] transition-colors hover:text-[#f05a28]"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex w-48 justify-end">
            <Link
              href="/app"
              className="inline-flex items-center justify-center rounded-full bg-[#102c3b] px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0e2531] focus:outline-none focus:ring-2 focus:ring-[#f05a28]/40"
            >
              Enter Classroom
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-[#2d4f60] hover:bg-white/70 hover:text-[#102c3b] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#f05a28]/50"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" aria-hidden="true" /> : <Menu className="block h-6 w-6" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden border-b border-[#184055]/10 bg-[#f6f2ea]"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block rounded-md px-3 py-2 text-base font-semibold text-[#28485a] transition-colors hover:bg-white/80 hover:text-[#f05a28]"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 pb-2">
                <Link
                  href="/app"
                  className="inline-flex w-full items-center justify-center rounded-full bg-[#102c3b] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0e2531]"
                  onClick={() => setIsOpen(false)}
                >
                  Enter Classroom
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

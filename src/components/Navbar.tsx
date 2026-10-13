"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Lock,
  Unlock,
  Settings,
  QrCode,
  BookOpen,
} from "lucide-react";
import { useGift } from "@/context/GiftContext";
import GiftQrCardModal from "./GiftQrCardModal";

interface NavbarProps {
  onOpenCustomizer: () => void;
}

export default function Navbar({ onOpenCustomizer }: NavbarProps) {
  const { data, isAdmin, setIsAdmin, toggleAdminPasscode } = useGift();

  // Admin modal
  const [showPasscodePrompt, setShowPasscodePrompt] = useState(false);
  const [passInput, setPassInput] = useState("");
  const [passError, setPassError] = useState(false);

  // QR modal (hanya admin)
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  // Admin
  const handleToggleAdmin = () => {
    if (isAdmin) {
      setIsAdmin(false);
    } else {
      setShowPasscodePrompt(true);
    }
  };

  const handleVerifyPasscode = (e: React.FormEvent) => {
    e.preventDefault();
    if (toggleAdminPasscode(passInput)) {
      setShowPasscodePrompt(false);
      setPassInput("");
      setPassError(false);
    } else {
      setPassError(true);
    }
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* ── NAVBAR ─────────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-40 px-3 pt-3 pb-0 pointer-events-none">
        <nav className="pointer-events-auto max-w-5xl mx-auto glass-pink border border-rose-200/80 shadow-lg rounded-2xl px-4 py-2 flex items-center gap-3">

          {/* ── Brand ── */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2 cursor-pointer group flex-shrink-0 mr-1"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform flex-shrink-0">
              <Heart size={14} className="fill-white" />
            </div>
            <div className="hidden sm:block leading-tight">
              <span className="font-cursive text-lg font-bold text-slate-800 block leading-none">
                For {data.partnerName}
              </span>
              <span className="text-[9px] text-rose-600 font-mono tracking-wider">
                Scrapbook Birthday
              </span>
            </div>
          </button>

          {/* ── Nav Links (desktop) ── */}
          <div className="hidden md:flex items-center gap-0.5 text-xs font-medium text-slate-600 flex-shrink-0">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="px-2.5 py-1.5 rounded-xl hover:bg-rose-100/70 hover:text-rose-700 transition-colors cursor-pointer whitespace-nowrap"
            >
              📖 Sampul
            </button>
            <button
              onClick={() => scrollToSection("love-letter-section")}
              className="px-2.5 py-1.5 rounded-xl hover:bg-rose-100/70 hover:text-rose-700 transition-colors cursor-pointer whitespace-nowrap"
            >
              💌 Surat
            </button>
            <button
              onClick={() => scrollToSection("scrapbook-album")}
              className="px-2.5 py-1.5 rounded-xl hover:bg-rose-100/70 hover:text-rose-700 transition-colors cursor-pointer whitespace-nowrap"
            >
              📸 Album
            </button>
          </div>

          {/* ── Spacer ── */}
          <div className="flex-1" />

          {/* ── Action Buttons ── */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {/* QR Barcode — hanya admin/pembuat */}
            {isAdmin && (
              <button
                onClick={() => setIsQrModalOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[11px] font-semibold shadow-sm hover:from-rose-600 hover:to-pink-600 transition-all whitespace-nowrap"
                title="Barcode Kado — hanya pembuat"
              >
                <QrCode size={12} />
                <span className="hidden sm:inline">Barcode</span>
              </button>
            )}

            {/* Settings (admin only) */}
            {isAdmin && (
              <button
                onClick={onOpenCustomizer}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white text-slate-700 text-[11px] font-medium border border-rose-200 hover:bg-rose-50 transition-all whitespace-nowrap"
                title="Pengaturan"
              >
                <Settings size={12} />
                <span className="hidden sm:inline">Atur</span>
              </button>
            )}

            {/* Admin toggle */}
            <button
              onClick={handleToggleAdmin}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-semibold transition-all whitespace-nowrap ${isAdmin
                  ? "bg-rose-600 text-white hover:bg-rose-700 shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
                }`}
              title={isAdmin ? "Keluar mode pembuat" : "Masuk mode pembuat"}
            >
              {isAdmin ? <Unlock size={12} /> : <Lock size={12} />}
              <span className="hidden sm:inline">{isAdmin ? "Pembuat" : "Kunci"}</span>
            </button>
          </div>
        </nav>
      </header>

      {/* ── Spacer to push page content below fixed navbar ── */}
      <div className="h-16" />

      {/* ── Admin Passcode Modal ── */}
      <AnimatePresence>
        {showPasscodePrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.93, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.93, opacity: 0 }}
              className="scrapbook-kraft p-6 rounded-3xl max-w-sm w-full border-2 border-amber-300 shadow-2xl relative"
            >
              <div className="washi-tape washi-pink -top-3 left-1/2 -translate-x-1/2 w-28" />
              <h3 className="text-lg font-serif-title text-slate-900 font-semibold mb-1">
                Masuk Mode Pembuat
              </h3>
              <p className="text-xs text-slate-600 mb-4">
                Masukkan kata sandi untuk mengedit foto &amp; tulisan.
              </p>
              <form onSubmit={handleVerifyPasscode} className="space-y-3">
                <input
                  type="password"
                  value={passInput}
                  autoFocus
                  onChange={(e) => { setPassInput(e.target.value); setPassError(false); }}
                  placeholder="Password..."
                  className="w-full p-2.5 rounded-xl border border-amber-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
                {passError && (
                  <p className="text-xs text-red-600 font-semibold">Password salah. Silakan coba lagi.</p>
                )}
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowPasscodePrompt(false)}
                    className="px-4 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium hover:bg-slate-200 transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-1.5 rounded-full bg-rose-600 text-white text-xs font-semibold shadow hover:bg-rose-700 transition"
                  >
                    Masuk
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── QR Modal — hanya terbuka saat isAdmin ── */}
      {isAdmin && (
        <GiftQrCardModal isOpen={isQrModalOpen} onClose={() => setIsQrModalOpen(false)} />
      )}
    </>
  );
}

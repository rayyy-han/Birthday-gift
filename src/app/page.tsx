"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, Heart, Lock, Unlock, QrCode } from "lucide-react";
import { useGift } from "@/context/GiftContext";
import BackgroundParticles from "@/components/BackgroundParticles";
import CustomizerModal from "@/components/CustomizerModal";
import GiftQrCardModal from "@/components/GiftQrCardModal";
import { INITIAL_GIFT_DATA } from "@/data/giftData";

export default function IntroTrollPage() {
  const router = useRouter();
  const { data, isAdmin, setIsAdmin, toggleAdminPasscode } = useGift();
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [passInput, setPassInput] = useState("");
  const [showPassModal, setShowPassModal] = useState(false);
  const [passError, setPassError] = useState(false);

  // Position offset for the escape/troll button
  const [trollPos, setTrollPos] = useState({ x: 0, y: 0 });
  const [trollAttempts, setTrollAttempts] = useState(0);

  const title = data.trollTitle || INITIAL_GIFT_DATA.trollTitle;
  const option1 = data.trollOption1 || INITIAL_GIFT_DATA.trollOption1;
  const option2 = data.trollOption2 || INITIAL_GIFT_DATA.trollOption2;
  const subtitle = data.trollSubtitle || INITIAL_GIFT_DATA.trollSubtitle || "Sebelum membuka isi nya, Kuma harus pilih dulu:";

  // Function to move Option 1 away randomly
  const moveButtonAway = () => {
    const maxX = Math.min(window.innerWidth / 2 - 120, 240);
    const maxY = Math.min(window.innerHeight / 2 - 120, 180);

    const randomX = (Math.random() - 0.5) * maxX * 2;
    const randomY = (Math.random() - 0.5) * maxY * 2;

    setTrollPos({ x: randomX, y: randomY });
    setTrollAttempts((prev) => prev + 1);
  };

  const handleAdminToggleClick = () => {
    if (isAdmin) {
      setIsAdmin(false);
    } else {
      setShowPassModal(true);
    }
  };

  const handlePassSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (toggleAdminPasscode(passInput)) {
      setShowPassModal(false);
      setPassInput("");
      setPassError(false);
    } else {
      setPassError(true);
    }
  };

  const handleSelectCorrect = () => {
    router.push("/birthday");
  };

  return (
    <main className="min-h-screen relative flex flex-col items-center justify-center p-4 overflow-hidden font-sans selection:bg-pink-200 selection:text-rose-900">
      <BackgroundParticles />

      {/* Top Bar Buttons: Admin Toggle */}
      <div className="absolute top-4 right-4 z-40 flex items-center gap-2">
        {/* Barcode Kado — hanya admin/pembuat */}
        {isAdmin && (
          <button
            onClick={() => setIsQrModalOpen(true)}
            className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/90 text-slate-800 hover:bg-white border border-rose-200 shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            title="Buat / Unduh Barcode Kado"
          >
            <QrCode size={14} className="text-rose-500" />
            <span>Barcode Kado</span>
          </button>
        )}

        {isAdmin && (
          <button
            onClick={() => setIsCustomizerOpen(true)}
            className="px-3 py-1.5 rounded-full text-xs font-medium bg-rose-600 text-white shadow-sm hover:bg-rose-700 transition-colors flex items-center gap-1.5"
          >
            <Sparkles size={13} />
            Pengaturan Intro
          </button>
        )}

        <button
          onClick={handleAdminToggleClick}
          className={`p-2 rounded-full transition-all ${isAdmin
              ? "bg-rose-100 text-rose-600 border border-rose-200"
              : "bg-white/80 text-slate-500 hover:text-slate-700 border border-slate-200/80"
            }`}
          title={isAdmin ? "Keluar Mode Admin" : "Masuk Mode Admin"}
        >
          {isAdmin ? <Unlock size={16} /> : <Lock size={16} />}
        </button>
      </div>

      {/* Central Scrapbook Kraft Envelope Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md p-8 md:p-10 rounded-3xl scrapbook-kraft border-2 border-amber-300/80 shadow-2xl text-center flex flex-col items-center"
      >
        {/* Washi Tapes on Top */}
        <div className="washi-tape washi-pink -top-3.5 left-1/2 -translate-x-1/2 w-36 rounded-sm" />
        <div className="washi-tape washi-gold -top-3 left-6 w-16 rotate-[-5deg]" />

        {/* Vintage Stamp Badge */}
        <div className="w-14 h-14 mb-4 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-md border-2 border-white">
          <Heart size={26} className="fill-white animate-pulse" />
        </div>

        <span className="text-[11px] font-bold uppercase tracking-widest text-amber-900 bg-amber-100/80 px-3 py-1 rounded-full border border-amber-200 mb-3">
          Surat Undangan Rahasia
        </span>

        <h1 className="font-cursive text-3xl md:text-4xl font-bold text-slate-900 tracking-tight leading-snug mb-2">
          {title}
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 font-light mb-8 max-w-xs leading-relaxed">
          {subtitle}
        </p>

        {/* Option Buttons Container */}
        <div className="w-full relative min-h-[140px] flex flex-col items-center justify-center gap-4">
          {/* Option 2 (Correct Button) */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleSelectCorrect}
            className="w-full max-w-xs py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white font-medium shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer z-10 text-sm sm:text-base"
          >
            <span>{option2}</span>
            <Sparkles size={16} />
          </motion.button>

          {/* Option 1 (Escaping / Running Button) */}
          <motion.div
            animate={{
              x: trollPos.x,
              y: trollPos.y,
            }}
            transition={{ type: "spring", stiffness: 350, damping: 22 }}
            className="w-full max-w-xs"
          >
            <button
              onMouseEnter={moveButtonAway}
              onTouchStart={moveButtonAway}
              onClick={moveButtonAway}
              className="w-full py-3.5 px-6 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-medium border-2 border-amber-200/90 shadow-sm transition-colors duration-150 cursor-pointer text-sm"
            >
              {option1}
            </button>
          </motion.div>

          {trollAttempts > 0 && (
            <motion.p
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-rose-600 font-bold font-cursive text-lg mt-2"
            >
              Eits, gabisa dipencet kan? 😜 Pilih yang atas dong!
            </motion.p>
          )}
        </div>

        {/* Bottom decorative stamp */}
        <div className="mt-6 pt-4 border-t border-amber-200/70 w-full text-center">
          <span className="text-[11px] font-mono text-amber-800/70">
            For {data.partnerName} • Scrapbook Birthday Surprise
          </span>
        </div>
      </motion.div>

      {/* Admin Pass Modal */}
      {showPassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="scrapbook-kraft rounded-3xl p-6 w-full max-w-sm shadow-2xl border-2 border-amber-300"
          >
            <h3 className="font-serif-title text-lg font-semibold text-slate-800 mb-2">
              Password Pengatur (Mode Pembuat)
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              Masukkan password untuk mengedit teks &amp; foto.
            </p>

            <form onSubmit={handlePassSubmit} className="space-y-4">
              <input
                type="password"
                value={passInput}
                onChange={(e) => setPassInput(e.target.value)}
                placeholder="Masukkan password..."
                className="w-full px-4 py-2.5 rounded-xl border border-amber-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 font-sans"
                autoFocus
              />
              {passError && (
                <p className="text-xs text-red-600 font-semibold">Password salah! Silakan coba lagi.</p>
              )}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPassModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-medium bg-rose-500 text-white hover:bg-rose-600 shadow-sm"
                >
                  Masuk
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Customizer Modal */}
      <CustomizerModal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
      />

      {/* Barcode & QR Gift Card Modal */}
      <GiftQrCardModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
      />
    </main>
  );
}

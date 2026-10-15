"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Sparkles,
  Heart,
  Lock,
  Unlock,
  QrCode,
  Clock,
  Eye,
  EyeOff,
  Calendar,
} from "lucide-react";
import { useGift } from "@/context/GiftContext";
import BackgroundParticles from "@/components/BackgroundParticles";
import CustomizerModal from "@/components/CustomizerModal";
import GiftQrCardModal from "@/components/GiftQrCardModal";
import { INITIAL_GIFT_DATA } from "@/data/giftData";

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
}

function calculateTimeRemaining(targetIso: string): TimeRemaining {
  const target = new Date(targetIso).getTime();
  const now = new Date().getTime();
  const totalMs = target - now;

  if (totalMs <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0 };
  }

  const days = Math.floor(totalMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((totalMs / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((totalMs / (1000 * 60)) % 60);
  const seconds = Math.floor((totalMs / 1000) % 60);

  return { days, hours, minutes, seconds, totalMs };
}

function formatTargetDateIndo(targetIso: string): string {
  try {
    const d = new Date(targetIso);
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }) + " WIB";
  } catch {
    return "17 Oktober 2026, 00:00 WIB";
  }
}

export default function IntroCountdownTrollPage() {
  const router = useRouter();
  const { data, isAdmin, setIsAdmin, toggleAdminPasscode } = useGift();
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [passInput, setPassInput] = useState("");
  const [showPassModal, setShowPassModal] = useState(false);
  const [passError, setPassError] = useState(false);

  // Admin bypass mode agar pembuat bisa preview troll & isi kado
  const [adminBypass, setAdminBypass] = useState(false);

  // Target countdown ISO (default 17 Oktober 2026 00:00:00)
  const targetDateIso = data.countdownTarget || "2026-10-17T00:00:00";

  // Countdown state (di-update setiap detik)
  const [timeLeft, setTimeLeft] = useState<TimeRemaining>(() =>
    calculateTimeRemaining(targetDateIso)
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTimeLeft(calculateTimeRemaining(targetDateIso));

    const timer = setInterval(() => {
      const remaining = calculateTimeRemaining(targetDateIso);
      setTimeLeft(remaining);

      // Jika baru saja menyentuh 0 detik, tembakkan konfeti perayaan
      if (remaining.totalMs <= 0) {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDateIso]);

  // Status apakah waktu sudah tiba
  const isTimeReached = timeLeft.totalMs <= 0;

  // Tampilkan Countdown jika belum waktunya DAN admin tidak sedang bypass
  const showCountdown = !isTimeReached && !adminBypass;

  // Position offset for Option 1 troll button
  const [trollPos, setTrollPos] = useState({ x: 0, y: 0 });
  const [trollAttempts, setTrollAttempts] = useState(0);

  const title = data.trollTitle || INITIAL_GIFT_DATA.trollTitle;
  const option1 = data.trollOption1 || INITIAL_GIFT_DATA.trollOption1;
  const option2 = data.trollOption2 || INITIAL_GIFT_DATA.trollOption2;
  const subtitle =
    data.trollSubtitle ||
    INITIAL_GIFT_DATA.trollSubtitle ||
    "Sebelum membuka isi nya, Kuma harus pilih dulu:";

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
      setAdminBypass(false);
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

  const formattedTarget = useMemo(
    () => formatTargetDateIndo(targetDateIso),
    [targetDateIso]
  );

  return (
    <main className="min-h-screen relative flex flex-col items-center justify-center p-4 overflow-hidden font-sans selection:bg-pink-200 selection:text-rose-900">
      <BackgroundParticles />

      {/* ── Top Bar Controls ─────────────────────────────────────────────────── */}
      <div className="absolute top-4 right-4 z-40 flex flex-wrap items-center justify-end gap-2 max-w-full">
        {/* Kontrol Admin Bypass Preview */}
        {isAdmin && (
          <button
            onClick={() => setAdminBypass((prev) => !prev)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer ${
              adminBypass
                ? "bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200"
                : "bg-emerald-100 text-emerald-900 border border-emerald-300 hover:bg-emerald-200"
            }`}
            title="Ubah pratinjau antara mode hitung mundur terkunci vs mode kado terbuka"
          >
            {adminBypass ? (
              <>
                <EyeOff size={13} />
                <span>Lihat Mode Terkunci</span>
              </>
            ) : (
              <>
                <Eye size={13} />
                <span>Bypass Buka Kado</span>
              </>
            )}
          </button>
        )}

        {/* Barcode Kado — hanya admin/pembuat */}
        {isAdmin && (
          <button
            onClick={() => setIsQrModalOpen(true)}
            className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white/90 text-slate-800 hover:bg-white border border-rose-200 shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            title="Buat / Unduh Barcode Kado"
          >
            <QrCode size={13} className="text-rose-500" />
            <span className="hidden sm:inline">Barcode Kado</span>
          </button>
        )}

        {isAdmin && (
          <button
            onClick={() => setIsCustomizerOpen(true)}
            className="px-3 py-1.5 rounded-full text-xs font-medium bg-rose-600 text-white shadow-sm hover:bg-rose-700 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles size={13} />
            <span className="hidden sm:inline">Pengaturan</span>
          </button>
        )}

        {/* Tombol Login Admin */}
        <button
          onClick={handleAdminToggleClick}
          className={`p-2 rounded-full transition-all cursor-pointer ${
            isAdmin
              ? "bg-rose-100 text-rose-600 border border-rose-200"
              : "bg-white/80 text-slate-500 hover:text-slate-700 border border-slate-200/80 shadow-xs"
          }`}
          title={isAdmin ? "Keluar Mode Admin" : "Masuk Mode Admin (Pembuat Kado)"}
        >
          {isAdmin ? <Unlock size={15} /> : <Lock size={15} />}
        </button>
      </div>

      {/* ── Konten Utama: Countdown (Terkunci) vs Troll Question (Terbuka) ──── */}
      <AnimatePresence mode="wait">
        {showCountdown ? (
          /* =====================================================================
             TAMPILAN 1: COUNTDOWN HITUNG MUNDUR (TERKUNCI)
             Sebelum tanggal/jam target, penerima HANYA bisa melihat countdown
             dan tidak bisa klik apa-apa untuk membuka kado.
             ===================================================================== */
          <motion.div
            key="countdown-locked"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: -20 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative z-10 w-full max-w-md p-7 sm:p-9 rounded-3xl scrapbook-kraft border-2 border-amber-300/80 shadow-2xl text-center flex flex-col items-center"
          >
            {/* Washi Tapes on Top */}
            <div className="washi-tape washi-pink -top-3.5 left-1/2 -translate-x-1/2 w-36 rounded-sm" />
            <div className="washi-tape washi-gold -top-3 left-6 w-16 rotate-[-5deg]" />

            {/* Glowing Heart Lock Icon */}
            <motion.div
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
              className="w-16 h-16 mb-4 rounded-2xl bg-gradient-to-tr from-rose-600 to-pink-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/25 border-2 border-white relative"
            >
              <Lock size={26} className="text-white" />
              <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-amber-400 border border-white flex items-center justify-center shadow-xs">
                <Heart size={12} className="fill-white text-white" />
              </div>
            </motion.div>

            {/* Vintage Stamp Badge */}
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-amber-900 bg-amber-100/90 px-3.5 py-1 rounded-full border border-amber-200/90 mb-3 flex items-center gap-1.5 shadow-2xs">
              <Clock size={12} className="text-amber-800" />
              <span>Surat Rahasia Terkunci</span>
            </span>

            {/* Title */}
            <h1 className="font-serif-title text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight leading-snug mb-2">
              Menuju Hari Istimewa{" "}
              <span className="text-rose-600 font-script italic">
                {data.partnerName}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-slate-600 font-light mb-6 max-w-xs leading-relaxed">
              Sebuah kejutan manis sedang dipersiapkan dengan penuh kasih... Kado
              ini baru bisa dibuka saat waktunya tiba ya! 💕
            </p>

            {/* ── Countdown Grid: 4 Boxes ──────────────────────────────────── */}
            <div className="w-full grid grid-cols-4 gap-2 sm:gap-3 mb-6">
              {[
                { label: "Hari", value: timeLeft.days },
                { label: "Jam", value: timeLeft.hours },
                { label: "Menit", value: timeLeft.minutes },
                { label: "Detik", value: timeLeft.seconds },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center justify-center py-3 px-1 rounded-2xl bg-white/90 border border-amber-200 shadow-sm"
                >
                  <span className="font-serif-title text-2xl sm:text-3xl font-bold text-rose-600 tabular-nums">
                    {mounted ? String(item.value).padStart(2, "0") : "--"}
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-semibold text-slate-500 uppercase tracking-widest mt-0.5">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Status Info Box (Terkunci) */}
            <div className="w-full p-3 rounded-2xl bg-amber-50/90 border border-amber-200/70 text-amber-900 text-xs flex flex-col items-center gap-1">
              <div className="flex items-center gap-1.5 font-semibold text-[11px] sm:text-xs">
                <Lock size={12} className="text-amber-700" />
                <span>Terkunci Otomatis Sampai:</span>
              </div>
              <span className="font-medium text-slate-800 text-[11px] sm:text-xs">
                {formattedTarget}
              </span>
              <p className="text-[10px] text-slate-500 mt-0.5 font-light">
                Tunggu sampai hitungan mundur selesai ya, jangan curang! 🤍
              </p>
            </div>

            {/* Bottom Tag */}
            <div className="mt-5 pt-3 border-t border-amber-200/60 w-full text-center">
              <span className="text-[10px] sm:text-[11px] font-mono text-amber-800/70">
                Special Birthday Gift for {data.partnerName} ✦ 2026
              </span>
            </div>
          </motion.div>
        ) : (
          /* =====================================================================
             TAMPILAN 2: TROLL QUESTION (WAKTU TIBA / UNLOCKED)
             Setelah countdown selesai (atau saat admin preview), penerima
             memilih "Kuma Cantik" untuk membuka isi kado (/birthday).
             ===================================================================== */
          <motion.div
            key="troll-unlocked"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: -20 }}
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

            <h1 className="font-serif-title text-3xl md:text-4xl font-bold text-slate-900 tracking-tight leading-snug mb-2">
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
                  className="text-xs text-rose-600 font-bold font-serif-title text-base mt-2"
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
        )}
      </AnimatePresence>

      {/* ── Admin Pass Modal ─────────────────────────────────────────────────── */}
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
              Masukkan password untuk mengedit teks, foto, atau membuka pratinjau.
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
                <p className="text-xs text-red-600 font-semibold">
                  Password salah! (Gunakan 1234 atau admin)
                </p>
              )}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPassModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-white cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-medium bg-rose-500 text-white hover:bg-rose-600 shadow-sm cursor-pointer"
                >
                  Masuk
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* ── Customizer Modal ─────────────────────────────────────────────────── */}
      <CustomizerModal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
      />

      {/* ── Barcode & QR Gift Card Modal ─────────────────────────────────────── */}
      <GiftQrCardModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
      />
    </main>
  );
}

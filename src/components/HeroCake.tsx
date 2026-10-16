"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Sparkles, Heart, RefreshCw, Star, Gift, ChevronDown } from "lucide-react";
import { useGift } from "@/context/GiftContext";

/* ── Ganti di sini kalau tanggal ulang tahunnya berubah ── */
const BIRTHDAY_MONTH = 10; // 1-12  (10 = Oktober)
const BIRTHDAY_DAY = 17;

type Countdown =
  | { state: "counting"; days: number; hours: number; minutes: number; seconds: number }
  | { state: "today" }
  | { state: "passed" };

function getCountdown(now: Date): Countdown {
  const target = new Date(now.getFullYear(), BIRTHDAY_MONTH - 1, BIRTHDAY_DAY, 0, 0, 0);
  const endOfDay = new Date(now.getFullYear(), BIRTHDAY_MONTH - 1, BIRTHDAY_DAY, 23, 59, 59);

  if (now >= target && now <= endOfDay) return { state: "today" };
  if (now > endOfDay) return { state: "passed" };

  const diff = target.getTime() - now.getTime();
  return {
    state: "counting",
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function HeroCake() {
  const { data } = useGift();
  const sectionRef = useRef<HTMLElement>(null);
  const [candlesLit, setCandlesLit] = useState(true);
  const [wishUnlocked, setWishUnlocked] = useState(false);
  const [isBlowing, setIsBlowing] = useState(false);

  const [countdown, setCountdown] = useState<Countdown | null>(null);

  // Dihitung di client saja supaya tidak error hydration
  useEffect(() => {
    setCountdown(getCountdown(new Date()));
    const id = setInterval(() => setCountdown(getCountdown(new Date())), 1000);
    return () => clearInterval(id);
  }, []);

  const handleBlowCandles = () => {
    setIsBlowing(true);

    setTimeout(() => {
      setCandlesLit(false);
      setIsBlowing(false);
      setWishUnlocked(true);

      confetti({
        particleCount: 140,
        spread: 80,
        origin: { y: 0.65 },
        colors: ["#f9a8c4", "#ec4887", "#9fcfaa", "#74b585", "#ffffff", "#f472a0"],
      });
    }, 900);
  };

  // Scroll ke section setelah hero
  const handleOpenGift = () => {
    sectionRef.current?.nextElementSibling?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 pt-24 pb-16 overflow-hidden text-center"
    >
      {/* Decorative Scrapbook Elements */}
      <div className="absolute top-20 left-6 sm:left-16 rotate-[-8deg] opacity-90 hidden sm:block pointer-events-none">
        <div className="washi-tape washi-pink -top-3 left-4 w-20" />
        <div className="bg-white/90 p-3 rounded-lg shadow-md border border-pink-200 text-left w-36">
          <span className="text-[10px] text-pink-600 font-bold block uppercase tracking-widest">
            Memori #01
          </span>
          <p className="font-cursive text-sm text-[#4a1830] leading-snug">
            Hari Ulang Tahun Keiko ✨
          </p>
        </div>
      </div>

      <div className="absolute top-28 right-6 sm:right-16 rotate-[7deg] opacity-90 hidden sm:block pointer-events-none">
        <div className="washi-tape washi-sage -top-3 right-4 w-20" />
        <div className="postage-stamp rounded shadow-md border border-green-200 text-center w-32">
          <span className="text-[9px] uppercase tracking-wider text-green-700 font-semibold block">
            Special Delivery
          </span>
          <Heart size={16} className="mx-auto text-pink-500 fill-pink-400 my-1" />
          <span className="text-[10px] font-mono text-[#8a4a66] block">{data.birthdayDate}</span>
        </div>
      </div>

      {/* Main Scrapbook Cover Card */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="scrapbook-cover w-full max-w-3xl p-6 sm:p-12 relative z-10 mx-auto border-2 border-pink-200/60"
      >
        {/* Top Washi Tapes */}
        <div className="washi-tape washi-pink -top-3 left-1/2 -translate-x-1/2 w-48 rounded-sm" />
        <div className="washi-tape washi-gold -top-2 left-10 w-24 rotate-[-3deg]" />
        <div className="washi-tape washi-sage -top-2 right-10 w-24 rotate-[3deg]" />

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-50 border border-pink-200 shadow-sm mb-5">
          <Heart size={14} className="text-pink-500 fill-pink-400" />
          <span className="text-xs font-semibold tracking-wider text-pink-800 uppercase">
            Buku Kenangan &amp; Doa • {data.birthdayDate}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif-title font-medium tracking-tight text-[#4a1830] leading-tight">
          {data.heroGreeting}{" "}
          <span className="font-cursive text-3xl sm:text-4xl md:text-5xl lg:text-6xl bg-gradient-to-r from-pink-600 via-pink-500 to-rose-500 bg-clip-text text-transparent italic block sm:inline mt-1 sm:mt-0 font-bold">
            {data.partnerName}
          </span>
        </h1>

        <p className="mt-4 text-base sm:text-lg text-[#8a4a66] max-w-xl mx-auto leading-relaxed font-light">
          {data.heroSubtext}
        </p>

        {/* ── HITUNG MUNDUR ── */}
        {countdown && countdown.state !== "passed" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-6 flex justify-center"
          >
            {countdown.state === "today" ? (
              <div className="px-5 py-2.5 rounded-full bg-pink-100 border border-pink-300 text-pink-700 font-semibold text-sm shadow-sm">
                Hari ini hari istimewamu 🎉
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <span className="font-cursive text-xl text-green-700">
                  {countdown.days === 0
                    ? "Sebentar lagi hari istimewamu"
                    : `${countdown.days} hari lagi menuju hari istimewamu`}
                </span>
                <div className="flex items-center gap-2 sm:gap-3">
                  {[
                    { label: "Hari", value: countdown.days },
                    { label: "Jam", value: countdown.hours },
                    { label: "Menit", value: countdown.minutes },
                    { label: "Detik", value: countdown.seconds },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="w-14 sm:w-16 py-2 rounded-xl bg-white border border-pink-200 shadow-sm"
                    >
                      <div className="text-xl sm:text-2xl font-semibold text-pink-600 tabular-nums leading-none">
                        {String(item.value).padStart(2, "0")}
                      </div>
                      <div className="mt-1 text-[10px] text-green-700">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Pop-Up Cake */}
        <div className="relative my-8 z-10 flex flex-col items-center">
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
            <div className="absolute inset-4 rounded-full bg-pink-200/50 blur-2xl animate-pulse" />

            <div className="relative z-10 w-full h-full flex flex-col items-center justify-end pb-4">
              {/* Candles */}
              <div className="flex justify-center gap-6 mb-[-10px] z-20">
                {[1, 2, 3].map((index) => (
                  <div key={index} className="flex flex-col items-center relative">
                    <AnimatePresence>
                      {candlesLit ? (
                        <motion.div
                          key="flame"
                          initial={{ scale: 0 }}
                          animate={{
                            scale: [1, 1.15, 0.95, 1.05, 1],
                            rotate: [-2, 2, -1, 1, 0],
                          }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ duration: 1, repeat: Infinity, repeatType: "mirror" }}
                          className="w-4 h-6 rounded-t-full bg-gradient-to-t from-pink-500 via-pink-300 to-pink-100 shadow-[0_0_14px_#f472a0] cursor-pointer"
                          onClick={handleBlowCandles}
                          title="Klik untuk tiup lilin"
                        />
                      ) : (
                        <motion.div
                          key="smoke"
                          initial={{ opacity: 0, y: 0 }}
                          animate={{ opacity: [0.6, 0], y: -20, scale: [1, 1.5] }}
                          transition={{ duration: 1.2 }}
                          className="text-pink-300 text-xs"
                        >
                          💨
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <div className="w-2.5 h-9 bg-gradient-to-b from-green-100 via-green-200 to-pink-100 rounded-t-sm border border-white/80 shadow-sm" />
                  </div>
                ))}
              </div>

              {/* Cake Layers */}
              <div className="w-56 sm:w-64 h-36 rounded-3xl bg-gradient-to-b from-pink-50 via-pink-100 to-pink-200 p-3 shadow-xl border-2 border-white flex flex-col justify-between relative overflow-hidden">
                <div className="w-full flex justify-between px-2 pt-1">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="w-4 h-4 rounded-full bg-white shadow-sm border border-pink-100"
                    />
                  ))}
                </div>

                <div className="w-full h-8 bg-white/80 my-auto flex items-center justify-center border-y border-pink-200/80 rounded-md shadow-sm">
                  <span className="font-cursive text-lg text-pink-700 tracking-wider font-bold">
                    Happy Birthday {data.partnerName}
                  </span>
                </div>

                <div className="w-full flex justify-around pb-1 text-pink-400">
                  <Heart size={14} className="fill-pink-300" />
                  <Star size={14} className="text-green-500 fill-green-300" />
                  <Heart size={14} className="fill-pink-300" />
                </div>
              </div>

              <div className="w-64 sm:w-72 h-4 rounded-full bg-white shadow-md border border-pink-100 -mt-1.5" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-4 z-20">
            {candlesLit ? (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleBlowCandles}
                disabled={isBlowing}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 to-pink-600 text-white font-medium text-xs sm:text-sm shadow-md flex items-center gap-2 transition-all cursor-pointer"
              >
                <Sparkles size={16} className="text-pink-100" />
                <span>{isBlowing ? "Meniup Lilin..." : "Tiup Lilin & Buka Doa"}</span>
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setCandlesLit(true);
                  setWishUnlocked(false);
                }}
                className="px-5 py-2.5 rounded-full bg-white text-pink-700 font-medium text-xs border border-pink-200 shadow-sm flex items-center gap-1.5 hover:bg-pink-50 transition-all cursor-pointer"
              >
                <RefreshCw size={14} /> Nyalakan Lilin Lagi
              </motion.button>
            )}


          </div>
        </div>

        {/* ── TOMBOL AJAKAN UTAMA ── */}
        <div className="pt-6 border-t border-pink-100 flex flex-col items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleOpenGift}
            className="group px-8 py-3.5 rounded-full bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold text-sm sm:text-base shadow-lg shadow-green-600/25 flex items-center gap-2 cursor-pointer"
          >
            <Gift size={18} />
            Buka Kado
            <ChevronDown size={18} className="transition-transform group-hover:translate-y-0.5" />
          </motion.button>
          <span className="font-cursive text-lg text-[#8a4a66]">
            Ada surat dan album foto menunggumu di bawah
          </span>
        </div>
      </motion.div>

      {/* Wish Modal */}
      <AnimatePresence>
        {wishUnlocked && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pink-950/40 backdrop-blur-sm"
          >
            <div className="scrapbook-kraft max-w-lg w-full p-6 sm:p-8 rounded-3xl shadow-2xl border-2 border-pink-200 relative text-center">
              <div className="washi-tape washi-pink -top-3 left-1/2 -translate-x-1/2 w-32" />

              <div className="w-12 h-12 rounded-full bg-pink-500 text-white flex items-center justify-center mx-auto mb-3 shadow-md">
                <Heart size={22} className="fill-white" />
              </div>

              <h3 className="text-2xl font-serif-title text-[#4a1830] font-medium">
                Lilin Telah Ditiup! ✨
              </h3>

              <div className="lined-paper p-5 my-4 rounded-xl border border-pink-200/80 text-center shadow-sm">
                <p className="font-cursive text-base sm:text-lg text-[#4a1830] leading-relaxed">
                  &ldquo;Yeayy kumaa Sudah berumur 21 tahun&rdquo;
                </p>
              </div>

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => {
                    setWishUnlocked(false);
                    handleOpenGift();
                  }}
                  className="px-6 py-2.5 rounded-full bg-green-600 text-white font-medium text-xs shadow hover:bg-green-700 transition-colors cursor-pointer"
                >
                  Buka Album Scrapbook 🤍
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>


    </section>
  );
}
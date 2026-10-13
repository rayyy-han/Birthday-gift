"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Mail, Edit3, Check, X, Bookmark, Lock, Sparkles } from "lucide-react";
import { useGift } from "@/context/GiftContext";

export default function SecretLoveLetter() {
  const { data, isAdmin, updateData } = useGift();
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [localLetter, setLocalLetter] = useState(data.loveLetter);

  React.useEffect(() => {
    setLocalLetter(data.loveLetter);
  }, [data.loveLetter]);

  const handleSaveLetter = () => {
    updateData({ loveLetter: localLetter });
    setIsEditing(false);
  };

  return (
    <section id="love-letter-section" className="py-16 px-4 max-w-4xl mx-auto text-center relative z-10">
      <div className="mb-8">
        <h2 className="text-3xl sm:text-5xl font-serif-title font-medium text-slate-800 tracking-tight">
          Surat Hati Untuk {data.partnerName}
        </h2>
        <p className="text-sm sm:text-base text-slate-500 mt-2 max-w-md mx-auto font-light">
          Pecahkan cap lilin (wax seal) pada amplop di bawah ini untuk membaca surat khusus yang tersimpan rapi.
        </p>
      </div>

      <div className="relative flex justify-center items-center my-4 min-h-[380px]">
        <AnimatePresence mode="wait">
          {!isOpen ? (
            /* Sealed Scrapbook Envelope */
            <motion.div
              key="closed-envelope"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => setIsOpen(true)}
              className="relative w-84 sm:w-[420px] h-60 sm:h-64 rounded-3xl scrapbook-kraft border-2 border-amber-300/80 shadow-2xl cursor-pointer flex flex-col items-center justify-center p-6 group select-none"
            >
              {/* Taped to the page */}
              <div className="washi-tape washi-floral -top-3 left-10 w-24 rotate-[-4deg]" />
              <div className="washi-tape washi-sage -top-3 right-10 w-24 rotate-[4deg]" />

              {/* Envelope Flap Lines */}
              <div className="absolute inset-0 rounded-3xl pointer-events-none overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1/2 border-b-2 border-amber-300/60 bg-amber-100/30 clip-envelope-flap" />
              </div>

              {/* Recipient Ribbon Stamp */}
              <div className="absolute inset-x-8 top-12 py-1 bg-white/80 rounded-md border border-amber-200 flex items-center justify-center shadow-sm">
                <span className="text-[11px] font-bold text-amber-900 tracking-widest uppercase flex items-center gap-1.5">
                  <Heart size={11} className="text-rose-500 fill-rose-500" />
                  UNTUK: {data.partnerName} Tersayang
                </span>
              </div>

              {/* 3D Wax Seal with Embossed Heart */}
              <div className="relative z-20 my-auto">
                <div className="wax-seal w-16 h-16 sm:w-18 sm:h-18 group-hover:scale-110 transition-transform shadow-xl">
                  <div className="text-center flex flex-col items-center justify-center text-white">
                    <Heart size={22} className="fill-white drop-shadow" />
                    <span className="text-[9px] font-bold tracking-tighter uppercase mt-0.5">
                      SEAL
                    </span>
                  </div>
                </div>
              </div>

              {/* Instruction Prompt */}
              <span className="relative z-10 mt-1 text-xs font-semibold text-rose-800 bg-white/70 px-4 py-1 rounded-full border border-rose-200 shadow-sm group-hover:bg-rose-500 group-hover:text-white transition-all">
                ✨ Klik Cap Lilin Untuk Membuka Surat
              </span>
            </motion.div>
          ) : (
            /* Unfolded Vintage Lined Journal Letter */
            <motion.div
              key="opened-letter"
              initial={{ opacity: 0, y: 25, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 25, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-2xl lined-paper p-4 sm:p-10 rounded-3xl shadow-2xl border-2 border-amber-200/90 relative text-left"
            >
              {/* Paperclip in corner */}
              <div className="absolute -top-3 left-8 z-30 pointer-events-none">
                <div className="w-4 h-12 rounded-full border-4 border-slate-400/90 bg-transparent shadow-sm" />
              </div>

              {/* Washi tape header */}
              <div className="washi-tape washi-pink -top-3 right-20 w-28" />

              {/* Top Controls */}
              <div className="flex items-center justify-between gap-2 mb-6 pb-2 border-b border-rose-200/60">
                <div className="flex items-center gap-2 text-rose-800">
                  <Bookmark size={18} className="fill-rose-400" />
                  <span className="text-xs font-bold tracking-wider uppercase">
                    Catatan Kasih Sayang • {data.birthdayDate}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {isAdmin ? (
                    <button
                      onClick={() => {
                        setLocalLetter(data.loveLetter);
                        setIsEditing(!isEditing);
                      }}
                      className="px-3 py-1 rounded-full bg-rose-100 text-rose-700 hover:bg-rose-200 transition-colors text-xs font-medium flex items-center gap-1"
                      title={isEditing ? "Batal Edit" : "Edit Surat (Mode Pembuat)"}
                    >
                      {isEditing ? <X size={13} /> : <Edit3 size={13} />}
                      <span>{isEditing ? "Batal" : "Edit Tulisan"}</span>
                    </button>
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] font-medium text-slate-400 bg-white/70 px-2.5 py-1 rounded-full border border-slate-200">
                      <Lock size={11} /> Khusus Untukmu 🤍
                    </span>
                  )}

                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-3.5 py-1 rounded-full bg-slate-800 text-white text-xs font-medium hover:bg-slate-900 transition-colors shadow-sm cursor-pointer"
                  >
                    Tutup Amplop
                  </button>
                </div>
              </div>

              {/* Letter Content: Editing vs View */}
              {isEditing && isAdmin ? (
                <div className="space-y-4">
                  <textarea
                    value={localLetter}
                    onChange={(e) => setLocalLetter(e.target.value)}
                    rows={10}
                    className="w-full p-4 rounded-xl border border-rose-300 bg-white font-cursive text-2xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-400 shadow-inner"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={handleSaveLetter}
                      className="px-5 py-2 rounded-full bg-emerald-600 text-white font-medium text-xs flex items-center gap-1.5 shadow hover:bg-emerald-700 transition-colors cursor-pointer"
                    >
                      <Check size={14} /> Simpan Perubahan Surat
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="font-cursive text-base sm:text-lg text-slate-900 leading-loose whitespace-pre-line p-1 sm:p-2">
                    {data.loveLetter}
                  </div>

                  <div className="mt-8 pt-4 border-t border-amber-200 flex items-center justify-between text-xs font-medium text-slate-500">
                    <span className="font-cursive text-sm sm:text-base text-rose-600">
                      Tertanda dengan penuh cinta 🤍
                    </span>
                    <span className="bg-rose-50 px-3 py-1 rounded-full border border-rose-200 text-rose-700">
                      Spesial Untuk {data.partnerName}
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

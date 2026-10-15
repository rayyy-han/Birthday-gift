"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Heart, User, Calendar, RotateCcw, Clock } from "lucide-react";
import { useGift } from "@/context/GiftContext";
import { INITIAL_GIFT_DATA } from "@/data/giftData";

interface CustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CustomizerModal({ isOpen, onClose }: CustomizerModalProps) {
  const { data, updateData, resetData } = useGift();
  const [partnerName, setPartnerName] = useState(data.partnerName);
  const [birthdayDate, setBirthdayDate] = useState(data.birthdayDate);
  const [heroGreeting, setHeroGreeting] = useState(data.heroGreeting);
  const [trollTitle, setTrollTitle] = useState(data.trollTitle || INITIAL_GIFT_DATA.trollTitle);
  const [trollOption1, setTrollOption1] = useState(data.trollOption1 || INITIAL_GIFT_DATA.trollOption1);
  const [trollOption2, setTrollOption2] = useState(data.trollOption2 || INITIAL_GIFT_DATA.trollOption2);
  const [countdownTarget, setCountdownTarget] = useState(data.countdownTarget || INITIAL_GIFT_DATA.countdownTarget || "2026-10-17T00:00:00");

  // Selalu perbarui input form dengan data database terkini saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      setPartnerName(data.partnerName);
      setBirthdayDate(data.birthdayDate);
      setHeroGreeting(data.heroGreeting);
      setTrollTitle(data.trollTitle || INITIAL_GIFT_DATA.trollTitle);
      setTrollOption1(data.trollOption1 || INITIAL_GIFT_DATA.trollOption1);
      setTrollOption2(data.trollOption2 || INITIAL_GIFT_DATA.trollOption2);
      setCountdownTarget(data.countdownTarget || INITIAL_GIFT_DATA.countdownTarget || "2026-10-17T00:00:00");
    }
  }, [isOpen, data]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateData({
      partnerName: partnerName.trim() || INITIAL_GIFT_DATA.partnerName,
      birthdayDate: birthdayDate.trim() || INITIAL_GIFT_DATA.birthdayDate,
      heroGreeting: heroGreeting.trim() || INITIAL_GIFT_DATA.heroGreeting,
      trollTitle: trollTitle.trim() || INITIAL_GIFT_DATA.trollTitle,
      trollOption1: trollOption1.trim() || INITIAL_GIFT_DATA.trollOption1,
      trollOption2: trollOption2.trim() || INITIAL_GIFT_DATA.trollOption2,
      countdownTarget: countdownTarget || "2026-10-17T00:00:00",
    });
    onClose();
  };

  const handleReset = () => {
    if (confirm("Reset seluruh data ke pengaturan awal bawaan?")) {
      resetData();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          onClick={(e) => e.stopPropagation()}
          className="glass-pink p-6 sm:p-8 rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-white shadow-2xl relative text-left"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-pink-100 text-rose-700 hover:bg-pink-200 transition-colors"
          >
            <X size={16} />
          </button>

          <div className="flex items-center gap-2 mb-4 text-rose-800">
            <Heart size={18} className="fill-rose-500" />
            <h3 className="text-xl font-serif-title font-medium">Pengaturan Proyek (Mode Pembuat)</h3>
          </div>

          <p className="text-xs text-slate-500 mb-6 leading-relaxed">
            Atur nama pasangan, tanggal ulang tahun, sapaan utama, dan teks halaman troll sebelum mengunci dan memberikan website ini kepadanya.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <User size={13} className="text-rose-500" /> Nama Panggilan Pasangan:
              </label>
              <input
                type="text"
                value={partnerName}
                onChange={(e) => setPartnerName(e.target.value)}
                placeholder="Misal: Dinda"
                className="w-full p-2.5 rounded-xl border border-rose-200 bg-white/90 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Calendar size={13} className="text-rose-500" /> Tanggal Spesial (Teks):
              </label>
              <input
                type="text"
                value={birthdayDate}
                onChange={(e) => setBirthdayDate(e.target.value)}
                placeholder="Misal: 17 Oktober"
                className="w-full p-2.5 rounded-xl border border-rose-200 bg-white/90 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Clock size={13} className="text-rose-500" /> Target Waktu Countdown Buka Kado:
              </label>
              <input
                type="datetime-local"
                value={countdownTarget}
                onChange={(e) => setCountdownTarget(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-rose-200 bg-white/90 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-400"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Sebelum tanggal &amp; jam ini, halaman kado akan terkunci dan menampilkan hitung mundur.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Judul Sapaan Utama:
              </label>
              <input
                type="text"
                value={heroGreeting}
                onChange={(e) => setHeroGreeting(e.target.value)}
                placeholder="Misal: Selamat Ulang Tahun,"
                className="w-full p-2.5 rounded-xl border border-rose-200 bg-white/90 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-400"
              />
            </div>

            <div className="pt-2 border-t border-rose-100">
              <h4 className="text-xs font-bold text-rose-700 uppercase tracking-wider mb-2">Halaman Intro (Trolling)</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Judul Pertanyaan Intro:
                  </label>
                  <input
                    type="text"
                    value={trollTitle}
                    onChange={(e) => setTrollTitle(e.target.value)}
                    placeholder="Pilih Yang Benar Ya!"
                    className="w-full p-2.5 rounded-xl border border-rose-200 bg-white/90 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Teks Tombol Salah (yang lari/kabur):
                  </label>
                  <input
                    type="text"
                    value={trollOption1}
                    onChange={(e) => setTrollOption1(e.target.value)}
                    placeholder="Kuma Cantik"
                    className="w-full p-2.5 rounded-xl border border-rose-200 bg-white/90 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Teks Tombol Benar (masuk ke website):
                  </label>
                  <input
                    type="text"
                    value={trollOption2}
                    onChange={(e) => setTrollOption2(e.target.value)}
                    placeholder="Brian Protein"
                    className="w-full p-2.5 rounded-xl border border-rose-200 bg-white/90 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 flex items-center justify-between border-t border-rose-100">
              <button
                type="button"
                onClick={handleReset}
                className="text-xs text-rose-600 hover:underline flex items-center gap-1 font-medium"
              >
                <RotateCcw size={12} /> Reset Data
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-full bg-slate-100 text-slate-600 font-medium text-xs hover:bg-slate-200 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-slate-800 text-white font-medium text-xs shadow hover:bg-slate-900 transition-all flex items-center gap-1.5"
                >
                  <Check size={14} /> Simpan Pengaturan
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

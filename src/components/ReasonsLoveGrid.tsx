"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Heart,
  ImagePlus,
  RotateCcw,
  Sparkles,
  Smile,
  Coffee,
  Feather,
  Rocket,
  Home,
  Shuffle,
  Eye,
  EyeOff,
  Edit3,
  Check,
  X,
  Star,
  Quote,
} from "lucide-react";
import { useGift } from "@/context/GiftContext";
import { LoveReason } from "@/data/giftData";

// Preset theme configurations for cards without photos
const CARD_THEMES = [
  {
    icon: Smile,
    badge: "Kehangatan",
    gradient: "from-rose-400 via-pink-400 to-rose-300",
    bgPattern: "bg-rose-50",
    textAccent: "text-rose-600",
    borderGlow: "group-hover:border-rose-300",
  },
  {
    icon: Heart,
    badge: "Ketulusan",
    gradient: "from-pink-400 via-rose-300 to-amber-200",
    bgPattern: "bg-pink-50",
    textAccent: "text-pink-600",
    borderGlow: "group-hover:border-pink-300",
  },
  {
    icon: Coffee,
    badge: "Momen Indah",
    gradient: "from-amber-400 via-orange-300 to-rose-300",
    bgPattern: "bg-amber-50",
    textAccent: "text-amber-700",
    borderGlow: "group-hover:border-amber-300",
  },
  {
    icon: Feather,
    badge: "Kedamaian",
    gradient: "from-emerald-400 via-teal-300 to-cyan-300",
    bgPattern: "bg-emerald-50",
    textAccent: "text-emerald-700",
    borderGlow: "group-hover:border-emerald-300",
  },
  {
    icon: Rocket,
    badge: "Inspirasi",
    gradient: "from-violet-400 via-purple-300 to-pink-300",
    bgPattern: "bg-violet-50",
    textAccent: "text-violet-700",
    borderGlow: "group-hover:border-violet-300",
  },
  {
    icon: Home,
    badge: "Pelengkap",
    gradient: "from-sky-400 via-blue-300 to-indigo-300",
    bgPattern: "bg-sky-50",
    textAccent: "text-sky-700",
    borderGlow: "group-hover:border-sky-300",
  },
];

export default function ReasonsLoveGrid() {
  const { data, isAdmin, updateData } = useGift();
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});
  const [dragOverId, setDragOverId] = useState<number | null>(null);
  const [editingCard, setEditingCard] = useState<LoveReason | null>(null);
  const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({});

  const openedCount = Object.values(flipped).filter(Boolean).length;
  const totalCount = data.reasons.length;

  const toggleFlip = (id: number) => {
    const nowFlipped = !flipped[id];
    setFlipped((prev) => ({ ...prev, [id]: nowFlipped }));

    if (nowFlipped) {
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.75 },
        colors: ["#fda4af", "#f0abfc", "#a7f3d0", "#fef08a", "#ffffff"],
      });
    }
  };

  const handleFlipAll = (shouldOpen: boolean) => {
    const newFlippedState: Record<number, boolean> = {};
    data.reasons.forEach((item) => {
      newFlippedState[item.id] = shouldOpen;
    });
    setFlipped(newFlippedState);

    if (shouldOpen) {
      confetti({
        particleCount: 60,
        spread: 80,
        origin: { y: 0.7 },
        colors: ["#fda4af", "#f0abfc", "#38bdf8", "#fef08a"],
      });
    }
  };

  const handleShufflePick = () => {
    const unopenCards = data.reasons.filter((item) => !flipped[item.id]);
    const pool = unopenCards.length > 0 ? unopenCards : data.reasons;
    const randomCard = pool[Math.floor(Math.random() * pool.length)];

    if (randomCard) {
      setFlipped((prev) => ({ ...prev, [randomCard.id]: true }));
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#fb7185", "#38bdf8", "#a7f3d0", "#facc15"],
      });

      // Scroll smoothly to chosen card
      const el = document.getElementById(`reason-card-${randomCard.id}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  const handlePhotoFile = (id: number, file: File) => {
    if (!isAdmin) return;
    if (!file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      if (!base64) return;
      const updated = data.reasons.map((r) =>
        r.id === id ? { ...r, photo: base64 } : r
      );
      updateData({ reasons: updated });
    };
    reader.readAsDataURL(file);
  };

  const handleFileInput = (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handlePhotoFile(id, file);
  };

  const handleDrop = (id: number, e: React.DragEvent) => {
    if (!isAdmin) return;
    e.preventDefault();
    e.stopPropagation();
    setDragOverId(null);
    const file = e.dataTransfer.files?.[0];
    if (file) handlePhotoFile(id, file);
  };

  const handleRemovePhoto = (id: number) => {
    if (!isAdmin) return;
    const updated = data.reasons.map((r) =>
      r.id === id ? { ...r, photo: undefined } : r
    );
    updateData({ reasons: updated });
  };

  const handleSaveCardEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCard) return;
    const updated = data.reasons.map((r) =>
      r.id === editingCard.id ? editingCard : r
    );
    updateData({ reasons: updated });
    setEditingCard(null);
  };

  return (
    <section id="reasons-love-section" className="py-20 px-4 max-w-6xl mx-auto relative z-10">
      {/* Header Section */}
      <div className="text-center mb-12 relative">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100/90 text-rose-800 text-xs font-semibold uppercase tracking-wider mb-4 border border-rose-200 shadow-sm"
        >
          <Sparkles size={14} className="text-rose-500 animate-spin-slow" />
          <span>Tag &amp; Catatan Rahasia Scrapbook</span>
          <Sparkles size={14} className="text-rose-500 animate-spin-slow" />
        </motion.div>

        <h2 className="text-3xl sm:text-5xl font-serif-title font-medium text-slate-800 tracking-tight leading-tight">
          Hal-Hal Berharga Dalam Dirimu
        </h2>

        <p className="text-slate-500 mt-3 text-sm sm:text-base max-w-lg mx-auto font-light leading-relaxed">
          Sentuh atau klik setiap kartu memo untuk membalik dan membaca pesan kehangatan di baliknya.
        </p>

        {/* Interactive Control Toolbar */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {/* Progress badge */}
          <div className="px-4 py-2 rounded-2xl bg-white/90 backdrop-blur-md border border-amber-200 shadow-sm flex items-center gap-2 text-xs font-medium text-slate-700">
            <Star size={14} className="text-amber-400 fill-amber-400" />
            <span>
              Catatan Terbuka: <strong className="text-rose-600">{openedCount}</strong> / {totalCount}
            </span>
          </div>

          {/* Shuffle / Random pick button */}
          <button
            onClick={handleShufflePick}
            className="px-4 py-2 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-xs font-medium shadow-md shadow-rose-500/20 hover:shadow-rose-500/35 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Shuffle size={14} />
            <span>Pilih Kartu Acak 🎲</span>
          </button>

          {/* Toggle flip all button */}
          <button
            onClick={() => handleFlipAll(openedCount !== totalCount)}
            className="px-4 py-2 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 hover:text-rose-600 border border-slate-200 text-xs font-medium shadow-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            {openedCount === totalCount ? (
              <>
                <EyeOff size={14} className="text-slate-400" />
                <span>Tutup Semua</span>
              </>
            ) : (
              <>
                <Eye size={14} className="text-rose-400" />
                <span>Buka Semua ✨</span>
              </>
            )}
          </button>
        </div>

        {isAdmin && (
          <div className="mt-4 px-4 py-2 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-800 text-xs font-medium inline-block shadow-sm">
            💡 Mode Pembuat: Drag &amp; drop foto langsung ke kartu, atau klik ikon pensil untuk mengedit teks.
          </div>
        )}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.reasons.map((item, index) => {
          const isFlipped = !!flipped[item.id];
          const isOver = dragOverId === item.id;
          const hasPhoto = !!item.photo;
          const theme = CARD_THEMES[index % CARD_THEMES.length];
          const ThemeIcon = theme.icon;
          const tapeColor = index % 3 === 0 ? "washi-pink" : index % 3 === 1 ? "washi-sage" : "washi-gold";

          return (
            <div
              id={`reason-card-${item.id}`}
              key={item.id}
              className="h-84 perspective-1000 group relative pt-3"
            >
              {/* Scrapbook Tape On Top */}
              <div className={`washi-tape ${tapeColor} top-0 left-1/2 -translate-x-1/2 w-28`} />

              {/* Framer Motion 3D Container */}
              <motion.div
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                style={{ transformStyle: "preserve-3d" }}
                className={`w-full h-full rounded-3xl relative cursor-pointer shadow-lg hover:shadow-2xl transition-shadow ${
                  isAdmin && isOver ? "ring-2 ring-emerald-400 ring-offset-2" : ""
                }`}
                onClick={() => toggleFlip(item.id)}
                onDragOver={(e) => {
                  if (!isAdmin) return;
                  e.preventDefault();
                  e.stopPropagation();
                  setDragOverId(item.id);
                }}
                onDragLeave={() => setDragOverId(null)}
                onDrop={(e) => handleDrop(item.id, e)}
              >
                {/* ─── FRONT SIDE ─── */}
                <div
                  style={{
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                  }}
                  className="absolute inset-0 w-full h-full bg-[#fffdfa] rounded-3xl border-2 border-amber-200/90 shadow-sm flex flex-col overflow-hidden transition-all duration-300"
                >
                  {/* Visual Top Section (Photo or Theme Pattern) */}
                  <div className="relative h-40 overflow-hidden flex-shrink-0">
                    {hasPhoto ? (
                      <div className="w-full h-full relative group/photo overflow-hidden">
                        <img
                          src={item.photo}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover/photo:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-60" />

                        {isAdmin && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemovePhoto(item.id);
                            }}
                            className="absolute top-3 right-3 p-1.5 rounded-full bg-white/90 text-red-500 shadow opacity-0 group-hover/photo:opacity-100 transition-opacity z-10"
                            title="Hapus Foto"
                          >
                            <RotateCcw size={13} />
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br ${theme.gradient} flex flex-col items-center justify-center relative p-4 overflow-hidden`}>
                        {/* Decorative floating circles */}
                        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10 blur-sm pointer-events-none" />
                        <div className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full bg-black/5 blur-sm pointer-events-none" />

                        <div className="w-12 h-12 rounded-2xl bg-white/25 backdrop-blur-md border border-white/40 flex items-center justify-center text-white shadow-inner mb-2 group-hover:scale-110 transition-transform duration-300">
                          <ThemeIcon size={24} className="drop-shadow" />
                        </div>

                        <span className="text-[11px] font-semibold tracking-wider text-white/95 uppercase bg-black/10 backdrop-blur-sm px-2.5 py-0.5 rounded-full border border-white/20">
                          {theme.badge}
                        </span>

                        {isAdmin && (
                          <p className="text-[10px] text-white/80 font-medium mt-1">
                            Drop foto di sini untuk ubah gambar
                          </p>
                        )}
                      </div>
                    )}

                    {/* Admin Buttons Top Left / Right */}
                    {isAdmin && (
                      <div className="absolute top-2 left-2 flex gap-1 z-20">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingCard(item);
                          }}
                          className="p-1.5 rounded-full bg-white/90 hover:bg-white text-slate-700 shadow text-xs transition-transform active:scale-95"
                          title="Edit Teks Kartu"
                        >
                          <Edit3 size={13} />
                        </button>
                        <label
                          onClick={(e) => e.stopPropagation()}
                          className="p-1.5 rounded-full bg-white/90 hover:bg-white text-rose-600 shadow text-xs cursor-pointer transition-transform active:scale-95"
                          title="Upload / Ganti Foto"
                        >
                          <ImagePlus size={13} />
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            ref={(el) => {
                              fileInputRefs.current[item.id] = el;
                            }}
                            onChange={(e) => handleFileInput(item.id, e)}
                          />
                        </label>
                      </div>
                    )}
                  </div>

                  {/* Card Content Bottom */}
                  <div className="p-5 flex flex-col justify-between flex-1 bg-gradient-to-b from-white to-pink-50/20">
                    <div>
                      <h3 className="text-base font-serif-title font-semibold text-slate-800 leading-snug group-hover:text-rose-600 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-slate-500 text-xs mt-1.5 line-clamp-2 font-light leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-rose-100/70 flex items-center justify-between text-[11px] text-slate-400 font-medium group-hover:text-rose-500 transition-colors">
                      <span className="flex items-center gap-1">
                        <Heart size={12} className="fill-rose-300 text-rose-400" />
                        Klik untuk buka pesan
                      </span>
                      <Sparkles size={12} className="text-rose-300 group-hover:animate-pulse" />
                    </div>
                  </div>
                </div>

                {/* ─── BACK SIDE ─── */}
                <div
                  style={{
                    transform: "rotateY(180deg)",
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                  }}
                  className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#fff7f9] via-[#fef08a]/20 to-[#ecfdf5] rounded-3xl border-2 border-emerald-300/70 shadow-xl flex flex-col justify-between p-6 text-emerald-950 overflow-hidden"
                >
                  {/* Decorative background quote mark */}
                  <Quote
                    size={90}
                    className="absolute -bottom-4 -right-4 text-emerald-500/10 pointer-events-none"
                  />

                  {/* Top Bar */}
                  <div className="flex items-center justify-between relative z-10">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest bg-emerald-100/80 px-2.5 py-1 rounded-full border border-emerald-200">
                      💌 Pesan Spesial
                    </span>
                    <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                      <Heart size={14} className="fill-emerald-400" />
                    </div>
                  </div>

                  {/* Highlight Quote */}
                  <div className="text-center my-auto py-2 relative z-10 px-2">
                    <p className="font-cursive text-2xl sm:text-3xl text-emerald-900 leading-snug font-medium drop-shadow-sm">
                      &ldquo;{item.highlight}&rdquo;
                    </p>
                  </div>

                  {/* Footer hint */}
                  <div className="text-center text-[10px] font-semibold text-emerald-700/80 tracking-wider border-t border-emerald-200/60 pt-2 relative z-10 flex items-center justify-center gap-1">
                    <Sparkles size={11} className="text-emerald-500" />
                    <span>Klik lagi untuk membalikkan kartu</span>
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Admin Quick Edit Card Modal */}
      <AnimatePresence>
        {editingCard && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-rose-100"
            >
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-rose-100">
                <h3 className="font-serif-title text-lg font-semibold text-slate-800 flex items-center gap-2">
                  <Edit3 size={16} className="text-rose-500" />
                  Edit Kartu #{editingCard.id}
                </h3>
                <button
                  onClick={() => setEditingCard(null)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSaveCardEdit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Judul Kartu (Depan):
                  </label>
                  <input
                    type="text"
                    value={editingCard.title}
                    onChange={(e) =>
                      setEditingCard({ ...editingCard, title: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Deskripsi Singkat (Depan):
                  </label>
                  <textarea
                    rows={2}
                    value={editingCard.description}
                    onChange={(e) =>
                      setEditingCard({ ...editingCard, description: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Pesan Spesial / Kutipan (Belakang):
                  </label>
                  <textarea
                    rows={3}
                    value={editingCard.highlight}
                    onChange={(e) =>
                      setEditingCard({ ...editingCard, highlight: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingCard(null)}
                    className="px-4 py-2 rounded-xl text-xs font-medium text-slate-500 hover:bg-slate-100"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-500 text-white hover:bg-rose-600 shadow-sm flex items-center gap-1.5"
                  >
                    <Check size={14} />
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}


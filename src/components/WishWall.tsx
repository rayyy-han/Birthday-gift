"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Send, MessageSquareHeart, Trash2, Plus, Pin, Sparkles } from "lucide-react";
import { useGift } from "@/context/GiftContext";
import { SpecialWish } from "@/data/giftData";

const NOTE_COLORS = [
  {
    bg: "bg-[#fef9c3]", // lemon
    border: "border-amber-300",
    tape: "washi-gold",
    text: "text-amber-950",
    badge: "bg-amber-100 text-amber-800",
  },
  {
    bg: "bg-[#ffe4e6]", // peach rose
    border: "border-rose-300",
    tape: "washi-pink",
    text: "text-rose-950",
    badge: "bg-rose-100 text-rose-800",
  },
  {
    bg: "bg-[#dcfce7]", // mint sage
    border: "border-emerald-300",
    tape: "washi-sage",
    text: "text-emerald-950",
    badge: "bg-emerald-100 text-emerald-800",
  },
  {
    bg: "bg-[#f3e8ff]", // soft lavender
    border: "border-purple-300",
    tape: "washi-floral",
    text: "text-purple-950",
    badge: "bg-purple-100 text-purple-800",
  },
];

export default function WishWall() {
  const { data, isAdmin, updateData } = useGift();
  const [sender, setSender] = useState("");
  const [message, setMessage] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);

  const handleAddWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newWish: SpecialWish = {
      id: `wish-${Date.now()}`,
      sender: sender.trim() || "Pemberi Doa",
      message: message.trim(),
      tag: "Doa Hangat",
    };

    updateData({ wishes: [newWish, ...data.wishes] });
    setSender("");
    setMessage("");
    setShowAddForm(false);
  };

  const handleDeleteWish = (id: string) => {
    if (!isAdmin) return;
    if (confirm("Hapus catatan doa ini?")) {
      const updated = data.wishes.filter((w) => w.id !== id);
      updateData({ wishes: updated });
    }
  };

  return (
    <section id="wish-wall-section" className="py-20 px-4 max-w-5xl mx-auto relative z-10">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-100/90 text-rose-800 text-xs font-semibold uppercase tracking-wider mb-3 border border-rose-200">
          <MessageSquareHeart size={13} /> Papan Tempel Catatan &amp; Doa
        </div>
        <h2 className="text-3xl sm:text-5xl font-serif-title font-medium text-slate-800 tracking-tight">
          Harapan Indah Untuk Usia Baru
        </h2>
        <p className="text-slate-500 mt-2 text-sm sm:text-base max-w-md mx-auto font-light">
          Setiap catatan sticky note menyimpan doa tulus dan harapan baik untuk perjalanan barumu.
        </p>

        {/* Action button to add a note */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-xs font-medium shadow-md shadow-rose-500/20 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Plus size={15} />
            <span>{showAddForm ? "Tutup Form Catatan" : "+ Tempel Catatan Doa Baru"}</span>
          </button>
        </div>
      </div>

      {/* Add Wish Form Sticky Note */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="scrapbook-kraft p-6 sm:p-8 rounded-3xl border-2 border-amber-300/80 shadow-2xl max-w-xl mx-auto mb-12 relative"
          >
            <div className="washi-tape washi-pink -top-3 left-1/2 -translate-x-1/2 w-32" />

            <div className="flex items-center gap-2 mb-4 text-amber-900">
              <Pin size={16} className="text-rose-500" />
              <h4 className="font-serif-title font-semibold text-base">Tuliskan Doa Baru</h4>
            </div>

            <form onSubmit={handleAddWish} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Nama Penulis Doa:
                </label>
                <input
                  type="text"
                  value={sender}
                  onChange={(e) => setSender(e.target.value)}
                  placeholder="Misal: Sahabat Terbaik / Pasanganmu"
                  className="w-full p-2.5 rounded-xl border border-amber-300 bg-white/90 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 font-sans shadow-inner"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Isi Pesan / Doa Ulang Tahun:
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  placeholder="Tuliskan ucapan dan doa hangat di sini..."
                  className="w-full p-3 rounded-xl border border-amber-300 bg-white/90 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 font-cursive text-2xl shadow-inner text-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 rounded-full bg-slate-100 text-slate-600 font-medium text-xs hover:bg-slate-200 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white font-medium text-xs shadow-md hover:from-rose-600 hover:to-pink-600 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Send size={13} /> Tempelkan Doa ✨
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky Notes Corkboard Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
        {data.wishes.map((note, index) => {
          const color = NOTE_COLORS[index % NOTE_COLORS.length];
          const tiltDegree = index % 3 === 0 ? -2 : index % 3 === 1 ? 2.5 : -1.5;

          return (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.08 }}
              style={{ transform: `rotate(${tiltDegree}deg)` }}
              className={`p-6 rounded-2xl ${color.bg} border-2 ${color.border} sticky-note relative flex flex-col justify-between min-h-[190px] group`}
            >
              {/* Tape holding the sticky note */}
              <div
                className={`washi-tape ${color.tape} -top-3 left-1/2 -translate-x-1/2 w-24`}
              />

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-black/5 ${color.badge}`}
                  >
                    {note.tag}
                  </span>
                  <Heart size={14} className="text-rose-400 fill-rose-300" />
                </div>

                <p className={`font-cursive text-2xl ${color.text} leading-snug mt-2`}>
                  &ldquo;{note.message}&rdquo;
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-black/10 flex items-center justify-between text-xs font-semibold text-slate-600">
                <span className="font-cursive text-lg">— {note.sender}</span>
                {isAdmin && (
                  <button
                    onClick={() => handleDeleteWish(note.id)}
                    className="p-1 rounded-full bg-white/70 hover:bg-white text-slate-400 hover:text-red-500 transition-colors shadow-sm"
                    title="Hapus Catatan (Mode Pembuat)"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

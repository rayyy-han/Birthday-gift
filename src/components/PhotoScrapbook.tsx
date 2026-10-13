"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Plus,
  Maximize2,
  X,
  Trash2,
  Edit2,
  Check,
  Lock,
  Camera,
  Heart,
  Sparkles,
  Bookmark,
  Smile,
} from "lucide-react";
import { useGift } from "@/context/GiftContext";
import { GalleryPhoto } from "@/data/giftData";

export default function PhotoScrapbook() {
  const { data, isAdmin, updateData } = useGift();
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCaption, setEditCaption] = useState("");

  const tapeStyles = ["washi-pink", "washi-sage", "washi-gold", "washi-floral"];

  // Process image files when creator drops or selects files
  const processFiles = (files: FileList | File[]) => {
    if (!isAdmin) return;

    const validFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );
    if (validFiles.length === 0) return;

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        if (dataUrl) {
          const newPhoto: GalleryPhoto = {
            id: `photo-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            url: dataUrl,
            caption: file.name.replace(/\.[^/.]+$/, "") || "Kenangan Manis",
            date: new Date().toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
            }),
            rotation: (Math.random() - 0.5) * 6,
          };

          const updated = [newPhoto, ...data.photos];
          updateData({ photos: updated });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (!isAdmin) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (!isAdmin) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    if (!isAdmin) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isAdmin) return;
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const handleDeletePhoto = (id: string) => {
    if (!isAdmin) return;
    if (confirm("Hapus foto ini dari scrapbook?")) {
      const updated = data.photos.filter((p) => p.id !== id);
      updateData({ photos: updated });
    }
  };

  const handleSaveCaption = (id: string) => {
    if (!isAdmin) return;
    const updated = data.photos.map((p) =>
      p.id === id ? { ...p, caption: editCaption } : p
    );
    updateData({ photos: updated });
    setEditingId(null);
  };

  return (
    <section
      id="photo-scrapbook-section"
      className="py-16 px-4 max-w-6xl mx-auto relative z-10"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-100/90 text-rose-800 text-xs font-semibold uppercase tracking-wider mb-3 border border-rose-200">
          <Camera size={13} /> Lembar Scrapbook Foto
        </div>
        <h2 className="text-3xl sm:text-5xl font-serif-title font-medium text-slate-800 tracking-tight">
          Album Kenangan Kita
        </h2>
        <p className="text-slate-500 mt-2 text-sm sm:text-base max-w-md mx-auto font-light">
          Koleksi foto polaroid penuh senyuman yang ditempel dengan pita dan cerita manis.
        </p>
      </div>

      {/* Main Scrapbook Page Container */}
      <div
        className={`relative p-6 sm:p-10 rounded-3xl scrapbook-kraft border-2 transition-all duration-300 ${
          isAdmin && isDraggingOver
            ? "border-dashed border-rose-500 bg-rose-50/80"
            : "border-amber-200/90 shadow-2xl"
        }`}
      >
        {/* Notebook Binder Rings along the top */}
        <div className="absolute -top-3.5 inset-x-8 flex justify-around pointer-events-none z-20">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="w-3.5 h-7 rounded-full bg-gradient-to-b from-slate-400 via-slate-200 to-slate-400 border border-slate-400 shadow-sm"
            />
          ))}
        </div>

        {/* Decorative Scrapbook Corner Stickers */}
        <div className="absolute -top-2 left-6 washi-tape washi-gold w-20 rotate-[-5deg]" />
        <div className="absolute -top-2 right-6 washi-tape washi-floral w-20 rotate-[5deg]" />

        {/* Drag Indicator Overlay for Creator */}
        <AnimatePresence>
          {isAdmin && isDraggingOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-40 rounded-3xl bg-pink-500/15 backdrop-blur-sm border-2 border-dashed border-rose-500 flex flex-col items-center justify-center text-rose-800 pointer-events-none"
            >
              <div className="w-16 h-16 rounded-full bg-white text-rose-500 flex items-center justify-center shadow-lg mb-2">
                <Upload size={28} />
              </div>
              <p className="text-xl font-bold font-cursive">Lepaskan Foto Ke Scrapbook</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Creator Admin Control Bar */}
        {isAdmin ? (
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-amber-300/80 bg-white/80 p-4 rounded-2xl shadow-sm">
            <label className="cursor-pointer px-4 py-2 rounded-full bg-slate-800 text-white text-xs font-semibold shadow hover:bg-slate-900 transition-all flex items-center gap-1.5">
              <Plus size={15} />
              <span>Tambah Foto Baru</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileInput}
                className="hidden"
              />
            </label>

            <span className="text-xs text-rose-700 font-medium">
              💡 Mode Pembuat: Drag & drop foto, edit tulisan di polaroid, atau hapus foto.
            </span>
          </div>
        ) : (
          <div className="flex justify-end mb-6">
            <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-medium bg-white/70 px-3 py-1 rounded-full border border-amber-200">
              <Lock size={12} /> Halaman Kenangan Untuk {data.partnerName} 🤍
            </span>
          </div>
        )}

        {/* Scrapbook Polaroid Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pt-2">
          {data.photos.map((photo, index) => {
            const chosenTape = tapeStyles[index % tapeStyles.length];
            const rotationDeg = photo.rotation || (index % 2 === 0 ? -2 : 2.5);

            return (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                style={{ transform: `rotate(${rotationDeg}deg)` }}
                className="polaroid-frame group relative"
              >
                {/* Washi Tape Holding the Photo */}
                <div
                  className={`washi-tape ${chosenTape} -top-3 left-1/2 -translate-x-1/2 w-28`}
                />

                {/* Photo Image Frame */}
                <div
                  onClick={() => setSelectedPhoto(photo)}
                  className="relative aspect-[4/3] w-full overflow-hidden rounded bg-slate-100 border border-slate-200 cursor-pointer shadow-inner"
                >
                  <img
                    src={photo.url}
                    alt={photo.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Photo Corner Mounting Triangles */}
                  <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-amber-600/60 pointer-events-none" />
                  <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-amber-600/60 pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-amber-600/60 pointer-events-none" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-amber-600/60 pointer-events-none" />

                  {/* Hover Buttons */}
                  <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPhoto(photo);
                      }}
                      className="p-2 rounded-full bg-white/95 text-slate-800 hover:bg-white shadow"
                      title="Perbesar Foto"
                    >
                      <Maximize2 size={16} />
                    </button>

                    {isAdmin && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingId(photo.id);
                            setEditCaption(photo.caption);
                          }}
                          className="p-2 rounded-full bg-white/95 text-rose-600 hover:bg-white shadow"
                          title="Edit Catatan Foto"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePhoto(photo.id);
                          }}
                          className="p-2 rounded-full bg-white/95 text-red-600 hover:bg-white shadow"
                          title="Hapus Foto"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Handwritten Polaroid Caption & Date */}
                <div className="pt-3 px-1 text-center">
                  {isAdmin && editingId === photo.id ? (
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="text"
                        value={editCaption}
                        onChange={(e) => setEditCaption(e.target.value)}
                        className="w-full text-xs p-1.5 rounded border border-rose-300 font-cursive text-xl text-slate-800 focus:outline-none bg-rose-50/50"
                      />
                      <button
                        onClick={() => handleSaveCaption(photo.id)}
                        className="p-1 rounded bg-emerald-600 text-white"
                      >
                        <Check size={14} />
                      </button>
                    </div>
                  ) : (
                    <p className="font-cursive text-2xl text-slate-800 leading-snug">
                      {photo.caption}
                    </p>
                  )}
                  <span className="text-xs font-mono text-slate-400 mt-1 block tracking-wider">
                    {photo.date} {photo.location ? `• ${photo.location}` : ""}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Scrapbook Page Footer Stamp */}
        <div className="mt-10 pt-6 border-t border-amber-300/60 flex flex-wrap items-center justify-between text-xs text-amber-800/80">
          <span className="font-cursive text-xl text-amber-900">
            Setiap lembar menceritakan senyumanmu yang indah ✨
          </span>
          <span className="font-mono text-[11px] bg-white/80 px-3 py-1 rounded-full border border-amber-200">
            Album Ulang Tahun • {data.partnerName}
          </span>
        </div>
      </div>

      {/* Enlarged Photo Lightbox Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-3xl w-full bg-[#fffdf9] p-5 sm:p-7 rounded-3xl shadow-2xl border-4 border-amber-200 flex flex-col items-center"
            >
              {/* Tape top */}
              <div className="washi-tape washi-pink -top-3 left-1/2 -translate-x-1/2 w-36" />

              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors z-20"
              >
                <X size={18} />
              </button>

              <div className="max-h-[70vh] overflow-hidden rounded-xl border border-amber-200/60 shadow-inner">
                <img
                  src={selectedPhoto.url}
                  alt={selectedPhoto.caption}
                  className="w-full h-full object-contain max-h-[65vh]"
                />
              </div>

              <div className="mt-4 text-center">
                <h3 className="font-cursive text-3xl text-slate-900 font-semibold">
                  {selectedPhoto.caption}
                </h3>
                <p className="text-xs font-mono text-slate-400 mt-1">
                  {selectedPhoto.date} {selectedPhoto.location ? `• ${selectedPhoto.location}` : ""}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

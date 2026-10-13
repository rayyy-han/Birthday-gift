"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { QrCode, Sparkles, Download, Heart, Smartphone, Share2 } from "lucide-react";
import { useGift } from "@/context/GiftContext";
import GiftQrCardModal from "./GiftQrCardModal";

export default function GiftQrSection() {
  const { data } = useGift();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section id="qr-gift-section" className="py-16 px-4 max-w-4xl mx-auto relative z-10">
      {/* Decorative scrap tape on top */}
      <div className="relative scrapbook-cover p-6 sm:p-10 text-center border-2 border-rose-200/80">
        <div className="washi-tape washi-pink -top-4 left-1/2 -translate-x-1/2 w-44 rounded-sm" />
        <div className="washi-tape washi-gold -top-3 left-12 w-20 rotate-[-4deg]" />
        <div className="washi-tape washi-sage -top-3 right-12 w-20 rotate-[3deg]" />

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100/90 text-rose-800 text-xs font-semibold uppercase tracking-wider mb-4 border border-rose-200">
          <QrCode size={14} /> Barcode &amp; Kartu Akses Kado
        </div>

        <h2 className="text-3xl sm:text-5xl font-serif-title font-medium text-slate-800 tracking-tight">
          Bagikan Akses Scrapbook Ini
        </h2>

        <p className="text-slate-600 mt-3 text-sm sm:text-base max-w-xl mx-auto font-light leading-relaxed">
          Ingin pasanganmu membuka website ini melalui HP-nya? Cukup perlihatkan atau kirimkan barcode kartu kado di bawah ini untuk langsung di-scan.
        </p>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-8 text-left">
          <div className="p-4 rounded-2xl bg-white/80 border border-rose-100 shadow-sm">
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-2.5">
              <Smartphone size={17} />
            </div>
            <h4 className="font-semibold text-slate-800 text-sm">Scan Kamera Langsung</h4>
            <p className="text-xs text-slate-500 mt-1">
              Bisa langsung dideteksi dengan kamera iPhone atau Android tanpa install aplikasi apa pun.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/80 border border-rose-100 shadow-sm">
            <div className="w-8 h-8 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center mb-2.5">
              <Heart size={17} />
            </div>
            <h4 className="font-semibold text-slate-800 text-sm">Desain Kado Pita Merah</h4>
            <p className="text-xs text-slate-500 mt-1">
              Dilengkapi aksen pita kado merah mewah &amp; kartu ucapan romantis untuk pasangan.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/80 border border-rose-100 shadow-sm">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2.5">
              <Download size={17} />
            </div>
            <h4 className="font-semibold text-slate-800 text-sm">Download Format Gambar</h4>
            <p className="text-xs text-slate-500 mt-1">
              Simpan sebagai gambar PNG resolusi tinggi untuk dicetak atau dikirim via WhatsApp.
            </p>
          </div>
        </div>

        {/* Open Modal CTA Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-rose-600 via-pink-600 to-rose-500 text-white font-medium shadow-lg shadow-rose-600/25 hover:shadow-rose-600/40 transition-all flex items-center justify-center gap-2 cursor-pointer text-sm sm:text-base"
          >
            <QrCode size={18} />
            <span>Buka / Buat Kartu Barcode Hadiah</span>
            <Sparkles size={16} />
          </motion.button>
        </div>
      </div>

      <GiftQrCardModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
}

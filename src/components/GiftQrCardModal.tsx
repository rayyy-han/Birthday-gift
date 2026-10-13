"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import QRCode from "qrcode";
import {
  QrCode,
  Download,
  Copy,
  Check,
  X,
  Heart,
  Sparkles,
  ExternalLink,
  Printer,
  Gift,
  Smartphone,
  Eye,
} from "lucide-react";
import { useGift } from "@/context/GiftContext";

interface GiftQrCardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GiftQrCardModal({ isOpen, onClose }: GiftQrCardModalProps) {
  const { data } = useGift();
  const [currentUrl, setCurrentUrl] = useState("");
  const [targetPath, setTargetPath] = useState<"intro" | "birthday">("intro");
  const [customUrl, setCustomUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [cardTheme, setCardTheme] = useState<"ribbon-red" | "scrapbook-kraft">("ribbon-red");
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Set default URL from window location on client
  useEffect(() => {
    if (typeof window !== "undefined") {
      const base = window.location.origin;
      setCurrentUrl(base);
      setCustomUrl(base);
    }
  }, []);

  // Compute final URL based on target path
  const finalScanUrl = React.useMemo(() => {
    const base = (customUrl || currentUrl || "https://example.com").replace(/\/$/, "");
    if (targetPath === "birthday") {
      return `${base}/birthday`;
    }
    return `${base}/`;
  }, [customUrl, currentUrl, targetPath]);

  // Generate QR Code data URL whenever finalScanUrl or cardTheme changes
  useEffect(() => {
    let isCancelled = false;
    const generateQR = async () => {
      try {
        setIsGenerating(true);
        // Ribbon-red uses vibrant rose-red qr code, kraft uses vintage brown/espresso
        const darkColor = cardTheme === "ribbon-red" ? "#e11d48" : "#4a3525";
        const lightColor = cardTheme === "ribbon-red" ? "#ffffff" : "#fffdf8";

        const url = await QRCode.toDataURL(finalScanUrl, {
          width: 480,
          margin: 2,
          errorCorrectionLevel: "H",
          color: {
            dark: darkColor,
            light: lightColor,
          },
        });

        if (!isCancelled) {
          setQrDataUrl(url);
        }
      } catch (err) {
        console.error("Failed to generate QR code:", err);
      } finally {
        if (!isCancelled) setIsGenerating(false);
      }
    };

    if (finalScanUrl) {
      generateQR();
    }

    return () => {
      isCancelled = true;
    };
  }, [finalScanUrl, cardTheme]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(finalScanUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // High-res Canvas export to download as PNG image
  const handleDownloadCard = async () => {
    try {
      setIsDownloading(true);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const width = 1000;
      const height = 1350;
      canvas.width = width;
      canvas.height = height;

      if (cardTheme === "ribbon-red") {
        // Luxury Red Ribbon Dark Card (matching user reference image)
        // Background gradient
        const bgGrad = ctx.createLinearGradient(0, 0, width, height);
        bgGrad.addColorStop(0, "#0f172a");
        bgGrad.addColorStop(0.5, "#0b0f19");
        bgGrad.addColorStop(1, "#1e1017");
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        // Subtle soft green / teal border overlay (like whatsapp chat background in reference photo)
        ctx.lineWidth = 14;
        ctx.strokeStyle = "rgba(16, 185, 129, 0.25)";
        ctx.strokeRect(18, 18, width - 36, height - 36);

        // Card inner frame
        const cardX = 60;
        const cardY = 60;
        const cardW = width - 120;
        const cardH = height - 120;

        ctx.fillStyle = "#111827";
        ctx.beginPath();
        ctx.roundRect(cardX, cardY, cardW, cardH, 36);
        ctx.fill();

        ctx.lineWidth = 3;
        ctx.strokeStyle = "rgba(244, 63, 94, 0.4)";
        ctx.stroke();

        // Diagonal ribbon in bottom-right corner
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(cardX + cardW - 300, cardY + cardH);
        ctx.lineTo(cardX + cardW, cardY + cardH - 300);
        ctx.lineTo(cardX + cardW, cardY + cardH - 220);
        ctx.lineTo(cardX + cardW - 220, cardY + cardH);
        ctx.closePath();
        ctx.fillStyle = "#e11d48";
        ctx.fill();
        ctx.restore();

        // Top-left ribbon lines
        ctx.fillStyle = "#e11d48";
        ctx.fillRect(cardX, cardY + 160, cardW, 28);
        ctx.fillRect(cardX + 160, cardY, 28, cardH);

        // Header Title
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 44px 'Plus Jakarta Sans', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`Kado Spesial Untuk ${data.partnerName}`, width / 2, cardY + 95);

        // Subtitle
        ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
        ctx.font = "26px 'Plus Jakarta Sans', sans-serif";
        ctx.fillText("Scan QR Code di bawah untuk membuka ucapan & scrapbook", width / 2, cardY + 145);

        // QR Code Box
        const qrBoxSize = 560;
        const qrBoxX = (width - qrBoxSize) / 2;
        const qrBoxY = cardY + 240;

        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.roundRect(qrBoxX, qrBoxY, qrBoxSize, qrBoxSize, 28);
        ctx.fill();
        ctx.lineWidth = 6;
        ctx.strokeStyle = "#f43f5e";
        ctx.stroke();

        // Draw QR Image
        if (qrDataUrl) {
          const img = new Image();
          await new Promise((resolve) => {
            img.onload = resolve;
            img.src = qrDataUrl;
          });
          ctx.drawImage(img, qrBoxX + 25, qrBoxY + 25, qrBoxSize - 50, qrBoxSize - 50);

          // Center Heart Icon on QR Code
          const heartCenterX = width / 2;
          const heartCenterY = qrBoxY + qrBoxSize / 2;
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(heartCenterX, heartCenterY, 38, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#e11d48";
          ctx.beginPath();
          ctx.arc(heartCenterX, heartCenterY, 32, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = "#ffffff";
          ctx.font = "32px serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("❤️", heartCenterX, heartCenterY);
        }

        // Scanner Reticle corner brackets `[  ]`
        ctx.lineWidth = 8;
        ctx.strokeStyle = "#ffffff";
        const bracketMargin = 30;
        const bLen = 60;
        const bLeft = qrBoxX - bracketMargin;
        const bRight = qrBoxX + qrBoxSize + bracketMargin;
        const bTop = qrBoxY - bracketMargin;
        const bBottom = qrBoxY + qrBoxSize + bracketMargin;

        // Top-Left bracket
        ctx.beginPath();
        ctx.moveTo(bLeft, bTop + bLen);
        ctx.lineTo(bLeft, bTop);
        ctx.lineTo(bLeft + bLen, bTop);
        ctx.stroke();

        // Top-Right bracket
        ctx.beginPath();
        ctx.moveTo(bRight - bLen, bTop);
        ctx.lineTo(bRight, bTop);
        ctx.lineTo(bRight, bTop + bLen);
        ctx.stroke();

        // Bottom-Left bracket
        ctx.beginPath();
        ctx.moveTo(bLeft, bBottom - bLen);
        ctx.lineTo(bLeft, bBottom);
        ctx.lineTo(bLeft + bLen, bBottom);
        ctx.stroke();

        // Bottom-Right bracket
        ctx.beginPath();
        ctx.moveTo(bRight - bLen, bBottom);
        ctx.lineTo(bRight, bBottom);
        ctx.lineTo(bRight, bBottom - bLen);
        ctx.stroke();

        // Bottom Banner / Card Footer
        ctx.fillStyle = "rgba(16, 185, 129, 0.15)";
        ctx.beginPath();
        ctx.roundRect(qrBoxX, cardY + 840, qrBoxSize, 80, 20);
        ctx.fill();
        ctx.strokeStyle = "rgba(16, 185, 129, 0.4)";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = "#34d399";
        ctx.font = "bold 26px 'Plus Jakarta Sans', sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("✨ Hadiah Ulang Tahun Spesial ✨", width / 2, cardY + 880);

        // Romantic Handwritten Signature
        ctx.fillStyle = "#ffffff";
        ctx.font = "italic 36px 'Caveat', cursive, serif";
        ctx.fillText(`With all my love & heart ❤️`, width / 2, cardY + 980);

        // Date text
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
        ctx.font = "20px 'Plus Jakarta Sans', sans-serif";
        ctx.fillText(`Hari Bahagia • ${data.birthdayDate}`, width / 2, cardY + 1030);

      } else {
        // Scrapbook Kraft Card Theme
        ctx.fillStyle = "#f5ece1";
        ctx.fillRect(0, 0, width, height);

        // Inner white scrapbook sheet
        const sX = 50;
        const sY = 50;
        const sW = width - 100;
        const sH = height - 100;

        ctx.fillStyle = "#fffdf9";
        ctx.beginPath();
        ctx.roundRect(sX, sY, sW, sH, 24);
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#d4b896";
        ctx.stroke();

        // Washi tape top
        ctx.fillStyle = "rgba(255, 192, 203, 0.85)";
        ctx.fillRect((width - 240) / 2, sY - 12, 240, 40);

        // Title
        ctx.fillStyle = "#3e2723";
        ctx.font = "bold 50px 'Caveat', cursive, serif";
        ctx.textAlign = "center";
        ctx.fillText(`Our Scrapbook Gift for ${data.partnerName}`, width / 2, sY + 120);

        ctx.fillStyle = "#795548";
        ctx.font = "26px 'Plus Jakarta Sans', sans-serif";
        ctx.fillText("Arahkan kamera HP ke QR Code untuk membuka album kenangan 📸", width / 2, sY + 175);

        // QR Box
        const qrBoxSize = 540;
        const qrBoxX = (width - qrBoxSize) / 2;
        const qrBoxY = sY + 230;

        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.roundRect(qrBoxX, qrBoxY, qrBoxSize, qrBoxSize, 20);
        ctx.fill();
        ctx.lineWidth = 4;
        ctx.strokeStyle = "#e8d5be";
        ctx.stroke();

        if (qrDataUrl) {
          const img = new Image();
          await new Promise((resolve) => {
            img.onload = resolve;
            img.src = qrDataUrl;
          });
          ctx.drawImage(img, qrBoxX + 25, qrBoxY + 25, qrBoxSize - 50, qrBoxSize - 50);
        }

        // Vintage Stamp text
        ctx.fillStyle = "#8d6e63";
        ctx.font = "italic 38px 'Caveat', cursive, serif";
        ctx.fillText(`"Setiap momen bersamamu selalu berharga"`, width / 2, sY + 840);

        ctx.fillStyle = "#5d4037";
        ctx.font = "bold 28px 'Caveat', cursive, serif";
        ctx.fillText(`Spesial Ulang Tahun • ${data.birthdayDate}`, width / 2, sY + 900);
      }

      // Trigger download
      const pngUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = pngUrl;
      a.download = `Kartu-Barcode-Kado-${data.partnerName.replace(/\s+/g, "_")}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error("Error creating QR card image:", err);
      alert("Gagal mengunduh kartu. Silakan coba lagi.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-slate-950/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-rose-100 overflow-hidden flex flex-col my-auto max-h-[92vh]"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-rose-100 bg-gradient-to-r from-rose-50 via-pink-50 to-amber-50">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-sm">
                <QrCode size={20} />
              </div>
              <div>
                <h3 className="font-serif-title font-semibold text-slate-800 text-lg sm:text-xl">
                  Barcode &amp; Kartu Hadiah Pasangan
                </h3>
                <p className="text-xs text-slate-500">
                  Scan QR code dengan kamera HP / Tablet untuk membuka website ucapan &amp; scrapbook
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-rose-100/70 text-slate-500 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Modal Body: Left Controls & Right Card Preview */}
          <div className="p-5 sm:p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Settings & Link Options (5 cols) */}
            <div className="lg:col-span-5 space-y-5">
              {/* Theme Switcher */}
              <div>
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-2">
                  Pilih Desain Kartu:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setCardTheme("ribbon-red")}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      cardTheme === "ribbon-red"
                        ? "border-rose-500 bg-rose-50/80 shadow-sm ring-2 ring-rose-300"
                        : "border-slate-200 hover:border-slate-300 bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-3.5 h-3.5 rounded-full bg-rose-500" />
                      <span className="text-xs font-bold text-slate-800">Pita Merah Mewah</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-tight">
                      Mirip foto referensi tablet dengan pita kado &amp; QR hati.
                    </p>
                  </button>

                  <button
                    onClick={() => setCardTheme("scrapbook-kraft")}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      cardTheme === "scrapbook-kraft"
                        ? "border-amber-600 bg-amber-50/80 shadow-sm ring-2 ring-amber-300"
                        : "border-slate-200 hover:border-slate-300 bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-3.5 h-3.5 rounded-full bg-amber-600" />
                      <span className="text-xs font-bold text-slate-800">Vintage Scrapbook</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-tight">
                      Kertas kraft vintage dengan washi tape &amp; stempel hangat.
                    </p>
                  </button>
                </div>
              </div>

              {/* Target Page Selection */}
              <div>
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-2">
                  Saat Di-Scan, Buka Halaman:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setTargetPath("intro")}
                    className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                      targetPath === "intro"
                        ? "border-rose-500 bg-rose-50 text-rose-700 shadow-sm"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    🎭 Halaman Intro Lucu (Troll)
                  </button>
                  <button
                    onClick={() => setTargetPath("birthday")}
                    className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                      targetPath === "birthday"
                        ? "border-rose-500 bg-rose-50 text-rose-700 shadow-sm"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    📖 Langsung Scrapbook
                  </button>
                </div>
              </div>

              {/* URL Customization */}
              <div>
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1.5">
                  Link Website Yang Di-Scan:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    placeholder="Contoh: https://scrapbook-dinda.vercel.app"
                    className="w-full text-xs font-mono px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  💡 Tips: Jika kamu nanti upload ke Vercel/Netlify, ganti link di sini agar QR code mengarah ke link online-nya!
                </p>
              </div>

              {/* Scan Link Preview Bar */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                <span className="text-slate-500 block mb-1">Link Lengkap QR Code:</span>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-rose-600 truncate text-[11px] font-medium">
                    {finalScanUrl}
                  </span>
                  <button
                    onClick={handleCopyLink}
                    className="shrink-0 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-1 font-medium text-[11px]"
                  >
                    {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                    {copied ? "Tersalin!" : "Salin Link"}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={handleDownloadCard}
                  disabled={isDownloading || isGenerating}
                  className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white font-medium shadow-md hover:shadow-lg hover:from-rose-600 hover:to-rose-700 transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
                >
                  <Download size={16} />
                  <span>{isDownloading ? "Menyiapkan Gambar..." : "Unduh Gambar Kartu QR (PNG)"}</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handlePrint}
                    className="py-2.5 px-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Printer size={14} /> Cetak Kartu
                  </button>
                  <a
                    href={finalScanUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <ExternalLink size={14} /> Buka Link
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Card Preview (7 cols) */}
            <div className="lg:col-span-7 flex flex-col items-center">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 self-start">
                Pratinjau Kartu Siap Scan:
              </span>

              {cardTheme === "ribbon-red" ? (
                /* Luxury Red Ribbon Dark Card Preview (As in reference image!) */
                <div className="w-full max-w-sm rounded-3xl bg-slate-950 p-5 text-white shadow-2xl border border-rose-500/30 relative overflow-hidden flex flex-col items-center select-none">
                  {/* Diagonal Bottom-Right Ribbon */}
                  <div className="absolute -bottom-6 -right-6 w-28 h-10 bg-gradient-to-r from-rose-600 to-red-600 rotate-[-45deg] shadow-lg pointer-events-none" />

                  {/* Horizontal and Vertical Red Ribbon Bands */}
                  <div className="absolute top-14 inset-x-0 h-4 bg-rose-600 shadow-sm pointer-events-none" />
                  <div className="absolute inset-y-0 left-12 w-4 bg-rose-600 shadow-sm pointer-events-none" />

                  {/* Red Gift Bow Top-Left */}
                  <div className="absolute top-8 left-6 z-20 pointer-events-none">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-rose-600 shadow-md border-2 border-rose-400 flex items-center justify-center">
                        <Gift size={20} className="text-white animate-pulse" />
                      </div>
                      <div className="absolute -top-1 -left-2 w-5 h-5 rounded-full border-2 border-rose-400/80 bg-rose-600 rotate-45" />
                      <div className="absolute -top-1 -right-2 w-5 h-5 rounded-full border-2 border-rose-400/80 bg-rose-600 -rotate-45" />
                    </div>
                  </div>

                  {/* Card Header */}
                  <div className="text-center mt-3 mb-4 z-10">
                    <span className="inline-block text-[11px] font-medium tracking-widest uppercase text-rose-400 mb-0.5">
                      Special Birthday Moment
                    </span>
                    <h4 className="font-serif-title text-xl font-bold text-white tracking-wide">
                      Untuk {data.partnerName} 🤍
                    </h4>
                  </div>

                  {/* Scannable Target Reticle with QR Code Box */}
                  <div className="relative my-2 p-3 rounded-2xl bg-slate-900/90 border border-rose-500/40 shadow-inner flex flex-col items-center">
                    {/* Corner Camera Scan Brackets [  ] */}
                    <div className="absolute -top-2 -left-2 w-6 h-6 border-t-4 border-l-4 border-white rounded-tl" />
                    <div className="absolute -top-2 -right-2 w-6 h-6 border-t-4 border-r-4 border-white rounded-tr" />
                    <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-4 border-l-4 border-white rounded-bl" />
                    <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-4 border-r-4 border-white rounded-br" />

                    {/* QR Code Canvas / Image */}
                    <div className="relative bg-white p-2.5 rounded-xl shadow-lg">
                      {qrDataUrl ? (
                        <img
                          src={qrDataUrl}
                          alt="QR Code Birthday Gift"
                          className="w-56 h-56 sm:w-60 sm:h-60 object-contain rounded-lg"
                        />
                      ) : (
                        <div className="w-56 h-56 sm:w-60 sm:h-60 flex items-center justify-center text-slate-400">
                          Membuat QR Code...
                        </div>
                      )}

                      {/* Heart Badge in Center */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-11 h-11 rounded-full bg-white shadow-md flex items-center justify-center border-2 border-rose-500">
                          <Heart size={20} className="text-rose-600 fill-rose-600 animate-pulse" />
                        </div>
                      </div>
                    </div>

                    {/* Scan prompt */}
                    <span className="text-[11px] text-rose-300 font-medium mt-2 flex items-center gap-1">
                      <Smartphone size={13} /> Arahkan kamera HP ke QR Code
                    </span>
                  </div>

                  {/* Card Bottom Signature */}
                  <div className="w-full mt-3 pt-3 border-t border-slate-800 text-center z-10">
                    <p className="font-cursive text-2xl text-rose-200">
                      With all my love &amp; heart
                    </p>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      {data.birthdayDate} • Buka dengan browser HP
                    </span>
                  </div>
                </div>
              ) : (
                /* Vintage Scrapbook Kraft Card Preview */
                <div className="w-full max-w-sm rounded-3xl scrapbook-kraft p-6 text-slate-800 shadow-2xl border border-amber-300/60 relative flex flex-col items-center select-none">
                  {/* Washi tape on top */}
                  <div className="washi-tape washi-pink -top-3 left-1/2 -translate-x-1/2 w-36 rounded-sm" />

                  {/* Title */}
                  <div className="text-center mt-2 mb-3">
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-amber-800">
                      Album Kenangan &amp; Doa
                    </span>
                    <h4 className="font-cursive text-3xl text-slate-900 mt-1 font-bold">
                      For My Beloved {data.partnerName}
                    </h4>
                  </div>

                  {/* Polaroid Frame for QR Code */}
                  <div className="polaroid-frame my-2 text-center w-full max-w-[280px]">
                    <div className="washi-tape washi-sage -top-3 right-4 w-16" />
                    <div className="bg-white p-2 rounded border border-slate-200 flex items-center justify-center">
                      {qrDataUrl ? (
                        <img
                          src={qrDataUrl}
                          alt="QR Code Scrapbook"
                          className="w-52 h-52 object-contain rounded"
                        />
                      ) : (
                        <div className="w-52 h-52 flex items-center justify-center text-slate-400">
                          Membuat QR Code...
                        </div>
                      )}
                    </div>
                    <p className="font-cursive text-xl text-slate-800 mt-2 font-medium">
                      Scan untuk membuka scrapbook 📖
                    </p>
                  </div>

                  {/* Bottom Note */}
                  <div className="mt-2 text-center text-xs text-slate-500 font-light">
                    Kado kecil penuh doa &amp; cerita manis kita ✨
                  </div>
                </div>
              )}

              <p className="text-[11px] text-slate-400 text-center mt-3">
                Kamera HP manapun (iPhone / Android) dapat langsung mendeteksi barcode ini tanpa aplikasi tambahan.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

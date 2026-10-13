"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Plus,
  Camera,
  RotateCcw,
  X,
  Database,
  Copy,
  Check,
  Cloud,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import { useGift } from "@/context/GiftContext";
import { GalleryPhoto } from "@/data/giftData";

// ─── Constants ─────────────────────────────────────────────────────────────────
const TAPE_STYLES = ["washi-pink", "washi-gold", "washi-sage", "washi-floral"];
const ROTATIONS = [-2.5, 2, -1.5, 3, -2, 1.5, -3.5, 2.5];
const PHOTOS_PER_PAGE = 2;

// Layout configs per number of photos on a page
const LAYOUTS: Array<Array<{ x: number; y: number; w: number; h: number }>> = [
  // 1 photo — big center
  [{ x: 8, y: 8, w: 84, h: 74 }],
  // 2 photos — staggered top + bottom
  [
    { x: 6, y: 5, w: 86, h: 43 },
    { x: 8, y: 51, w: 86, h: 42 },
  ],
  // 3 photos — big left, two right
  [
    { x: 3, y: 4, w: 50, h: 84 },
    { x: 56, y: 4, w: 41, h: 40 },
    { x: 56, y: 48, w: 41, h: 40 },
  ],
];

// ─── Page Paper Background ─────────────────────────────────────────────────────
function PaperBg({ variant }: { variant: "lined" | "grid" | "dots" }) {
  if (variant === "lined") {
    return (
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(
            transparent, transparent 27px, rgba(200,170,140,0.35) 28px
          )`,
        }}
      />
    );
  }
  if (variant === "grid") {
    return (
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(195,165,130,0.18) 1px, transparent 1px),
            linear-gradient(90deg, rgba(195,165,130,0.18) 1px, transparent 1px)
          `,
          backgroundSize: "26px 26px",
        }}
      />
    );
  }
  // dots
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: `radial-gradient(rgba(180,140,100,0.28) 1px, transparent 1px)`,
        backgroundSize: "20px 20px",
      }}
    />
  );
}

// ─── Individual Photo Tile ─────────────────────────────────────────────────────
function PhotoTile({
  photo,
  layout,
  tapeStyle,
  rotation,
}: {
  photo: GalleryPhoto;
  layout: { x: number; y: number; w: number; h: number };
  tapeStyle: string;
  rotation: number;
}) {
  return (
    <div
      className="absolute"
      style={{
        left: `${layout.x}%`,
        top: `${layout.y}%`,
        width: `${layout.w}%`,
        height: `${layout.h}%`,
        transform: `rotate(${rotation}deg)`,
        zIndex: 5,
      }}
    >
      {/* Washi tape */}
      <div
        className={`washi-tape ${tapeStyle} w-16 z-10`}
        style={{
          position: "absolute",
          top: -8,
          left: "50%",
          transform: "translateX(-50%)",
        }}
      />
      {/* Polaroid */}
      <div
        style={{
          background: "#ffffff",
          width: "100%",
          height: "100%",
          padding: "8px 8px 18px 8px",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 6px 18px -4px rgba(60,30,10,0.18), 0 2px 6px rgba(0,0,0,0.05)",
          borderRadius: 2,
        }}
      >
        {/* Image */}
        <div
          style={{
            flex: 1,
            overflow: "hidden",
            background: "#f0ebe3",
            borderRadius: 1,
          }}
        >
          <img
            src={photo.url}
            alt={photo.caption}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            draggable={false}
          />
        </div>
        {/* Caption — Font elegan serif (tidak sambung) */}
        <div style={{ textAlign: "center", marginTop: 4, paddingBottom: 1 }}>
          <p
            style={{
              fontFamily: "var(--font-serif), Georgia, serif",
              fontSize: "clamp(10px, 2.2vw, 13px)",
              fontWeight: 500,
              color: "#374151",
              lineHeight: 1.25,
              overflow: "hidden",
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 1,
            }}
          >
            {photo.caption}
          </p>
          {photo.date && (
            <p
              style={{
                fontFamily: "monospace",
                fontSize: "8px",
                color: "#9ca3af",
                letterSpacing: "0.08em",
                marginTop: 1,
              }}
            >
              {photo.date}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Page Content (photos + decorations) ──────────────────────────────────────
function PageContent({
  photos,
  seed,
  bgVariant,
  isRight,
  pageNum,
}: {
  photos: GalleryPhoto[];
  seed: number;
  bgVariant: "lined" | "grid" | "dots";
  isRight?: boolean;
  pageNum: number;
}) {
  const layoutSet =
    photos.length === 0
      ? []
      : LAYOUTS[Math.min(photos.length - 1, LAYOUTS.length - 1)];

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ background: "#fffdf7" }}
    >
      <PaperBg variant={bgVariant} />

      {/* Margin line for left pages */}
      {!isRight && (
        <div
          className="absolute top-0 bottom-0 pointer-events-none"
          style={{ left: 32, width: 1, background: "rgba(230,100,120,0.22)" }}
        />
      )}

      {/* Page number */}
      <div
        className="absolute bottom-2 font-mono"
        style={{
          [isRight ? "right" : "left"]: 12,
          fontSize: 9,
          color: "rgba(160,120,70,0.55)",
        }}
      >
        {pageNum}
      </div>

      {/* Heart sticker */}
      {pageNum % 3 === seed % 3 && (
        <div
          className="absolute"
          style={{
            [isRight ? "left" : "right"]: 10,
            top: 8,
            opacity: 0.55,
          }}
        >
          <Heart
            size={14}
            style={{ fill: "rgb(251,113,133)", color: "rgb(251,113,133)" }}
          />
        </div>
      )}

      {/* Photos */}
      {photos.length === 0 ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
          <div style={{ opacity: 0.25, textAlign: "center" }}>
            <Camera size={32} style={{ margin: "0 auto 8px", color: "#b45309" }} />
            <p
              style={{
                fontFamily: "var(--font-serif), Georgia, serif",
                fontSize: 14,
                color: "#b45309",
              }}
            >
              Halaman Menunggu Foto
            </p>
          </div>
        </div>
      ) : (
        layoutSet.map((layout, i) => {
          if (!photos[i]) return null;
          const tape = TAPE_STYLES[(seed + i) % TAPE_STYLES.length];
          const rot =
            photos[i].rotation ?? ROTATIONS[(seed + i) % ROTATIONS.length];
          return (
            <PhotoTile
              key={photos[i].id}
              photo={photos[i]}
              layout={layout}
              tapeStyle={tape}
              rotation={rot}
            />
          );
        })
      )}
    </div>
  );
}

// ─── Book Cover Front ─────────────────────────────────────────────────────────
function BookCoverFront({ partnerName }: { partnerName: string }) {
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{
        background:
          "linear-gradient(155deg, #d4a96a 0%, #c49458 30%, #b8843c 65%, #a06828 100%)",
      }}
    >
      {/* Linen texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              0deg, rgba(0,0,0,0.04) 0px, rgba(0,0,0,0.04) 1px,
              transparent 1px, transparent 3px
            ),
            repeating-linear-gradient(
              90deg, rgba(0,0,0,0.03) 0px, rgba(0,0,0,0.03) 1px,
              transparent 1px, transparent 3px
            )
          `,
        }}
      />
      {/* Decorative borders */}
      <div
        className="absolute pointer-events-none"
        style={{
          inset: 10,
          border: "1.5px solid rgba(255,235,185,0.35)",
          borderRadius: 2,
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          inset: 16,
          border: "1px solid rgba(255,235,185,0.2)",
          borderRadius: 1,
        }}
      />
      {/* Main content */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center text-center"
        style={{ padding: "24px 20px" }}
      >
        {/* Embossed heart circle */}
        <div
          style={{
            width: 58,
            height: 58,
            borderRadius: "50%",
            border: "2px solid rgba(255,230,160,0.45)",
            background: "rgba(255,255,255,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 14,
            boxShadow:
              "0 2px 10px rgba(0,0,0,0.12), inset 0 1px 3px rgba(255,255,255,0.2)",
          }}
        >
          <Heart
            size={26}
            style={{
              fill: "rgba(255,235,185,0.85)",
              color: "rgba(255,235,185,0.85)",
            }}
          />
        </div>

        <p
          style={{
            fontFamily: "var(--font-serif), Georgia, serif",
            fontSize: "clamp(20px, 5.5vw, 26px)",
            fontWeight: 600,
            color: "rgba(255,245,210,0.95)",
            textAlign: "center",
            lineHeight: 1.25,
            textShadow: "0 1px 4px rgba(0,0,0,0.2)",
            marginBottom: 4,
          }}
        >
          Album Kenangan
        </p>
        <p
          style={{
            fontFamily: "var(--font-serif), Georgia, serif",
            fontSize: "clamp(14px, 3.8vw, 18px)",
            color: "rgba(255,230,165,0.9)",
            fontStyle: "italic",
            marginBottom: 18,
          }}
        >
          untuk {partnerName}
        </p>

        <div
          style={{
            padding: "5px 14px",
            border: "1px solid rgba(255,230,160,0.38)",
            borderRadius: 4,
          }}
        >
          <p
            style={{
              fontFamily: "monospace",
              fontSize: 9,
              letterSpacing: "0.2em",
              color: "rgba(255,230,165,0.75)",
              textTransform: "uppercase",
            }}
          >
            ✦ Kenangan Terindah ✦
          </p>
        </div>

        {/* Open hint */}
        <motion.div
          style={{
            position: "absolute",
            bottom: 18,
            display: "flex",
            alignItems: "center",
            gap: 5,
            color: "rgba(255,230,165,0.75)",
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}
          animate={{ y: [0, 4, 0] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
        >
          <BookOpen size={12} />
          Klik untuk membuka
        </motion.div>
      </div>
    </div>
  );
}

// ─── Back Cover Content ───────────────────────────────────────────────────────
function BackCoverContent({ partnerName }: { partnerName: string }) {
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden text-center"
      style={{
        background:
          "linear-gradient(155deg, #a06828 0%, #b8843c 50%, #c49458 100%)",
        padding: "24px 20px",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              -45deg, rgba(0,0,0,0.04) 0px, rgba(0,0,0,0.04) 1px,
              transparent 1px, transparent 5px
            )
          `,
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          inset: 10,
          border: "1.5px solid rgba(255,230,160,0.3)",
          borderRadius: 2,
        }}
      />
      <div style={{ position: "relative", zIndex: 1 }}>
        <Heart
          size={32}
          style={{
            margin: "0 auto 12px",
            fill: "rgba(255,230,160,0.7)",
            color: "rgba(255,230,160,0.7)",
          }}
        />
        <p
          style={{
            fontFamily: "var(--font-serif), Georgia, serif",
            fontSize: 18,
            fontWeight: 600,
            color: "rgba(255,245,210,0.95)",
            marginBottom: 6,
          }}
        >
          Kenangan Manis Kita
        </p>
        <p
          style={{
            fontFamily: "var(--font-serif), Georgia, serif",
            fontSize: 13,
            color: "rgba(255,230,165,0.85)",
            fontStyle: "italic",
            maxWidth: 220,
            margin: "0 auto",
            lineHeight: 1.5,
          }}
        >
          Setiap momen bersamamu adalah lembaran indah yang tak terlupakan 💕
        </p>
        <p
          style={{
            fontFamily: "monospace",
            fontSize: 9,
            letterSpacing: "0.2em",
            color: "rgba(255,230,165,0.6)",
            textTransform: "uppercase",
            marginTop: 18,
          }}
        >
          Selamanya Bersama {partnerName}
        </p>
      </div>
    </div>
  );
}

// ─── Single Page Flip Unit (Desktop Spread) ──────────────────────────────────
interface PageDef {
  front: React.ReactNode;
  back: React.ReactNode;
  zBase: number;
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function ScrapbookAlbum() {
  const { data, isAdmin, addPhoto, removePhoto, isSupabaseReady } = useGift();
  const photos = data.photos;
  const bookRef = useRef<HTMLDivElement>(null);

  // Deteksi Mobile (< 768px)
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Modal Supabase Guide
  const [showSupabaseGuide, setShowSupabaseGuide] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  // ── Pages Model ──────────────────────────────────────────────────────────────
  const contentFaceCount = Math.max(1, Math.ceil(photos.length / PHOTOS_PER_PAGE));
  const bgVariants: Array<"lined" | "grid" | "dots"> = [
    "lined",
    "grid",
    "dots",
    "lined",
    "grid",
  ];

  const getPagePhotos = (faceIndex: number): GalleryPhoto[] => {
    const start = faceIndex * PHOTOS_PER_PAGE;
    return photos.slice(start, start + PHOTOS_PER_PAGE);
  };

  // ── Mobile Model: Single Page per Step ───────────────────────────────────────
  // Step 0: Front Cover
  // Step 1..contentFaceCount: PageContent(p-1)
  // Step contentFaceCount + 1: Back Cover
  const totalMobilePages = contentFaceCount + 2;
  const [mobilePage, setMobilePage] = useState(0);
  const [mobileSlideDir, setMobileSlideDir] = useState<"left" | "right">("right");

  // ── Desktop Model: 2-Page Spreads ───────────────────────────────────────────
  const [flipCount, setFlipCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const maxFlipDesktop = contentFaceCount;

  const pageCountDesktop = Math.ceil(contentFaceCount / 2) + 1;
  const desktopPages: PageDef[] = Array.from(
    { length: pageCountDesktop },
    (_, i) => {
      if (i === 0) {
        return {
          front: <BookCoverFront partnerName={data.partnerName} />,
          back: (
            <PageContent
              photos={getPagePhotos(0)}
              seed={0}
              bgVariant="lined"
              pageNum={1}
            />
          ),
          zBase: pageCountDesktop,
        };
      } else if (i === pageCountDesktop - 1) {
        const lastFaceIndex = i * 2 - 1;
        return {
          front: (
            <PageContent
              photos={getPagePhotos(lastFaceIndex)}
              seed={lastFaceIndex}
              bgVariant={bgVariants[lastFaceIndex % bgVariants.length]}
              pageNum={lastFaceIndex * 2}
            />
          ),
          back: <BackCoverContent partnerName={data.partnerName} />,
          zBase: pageCountDesktop - i,
        };
      } else {
        const frontFace = i * 2 - 1;
        const backFace = i * 2;
        return {
          front: (
            <PageContent
              photos={getPagePhotos(frontFace)}
              seed={frontFace}
              bgVariant={bgVariants[frontFace % bgVariants.length]}
              pageNum={frontFace * 2 + 1}
            />
          ),
          back: (
            <PageContent
              photos={getPagePhotos(backFace)}
              seed={backFace}
              bgVariant={bgVariants[backFace % bgVariants.length]}
              isRight
              pageNum={backFace * 2}
            />
          ),
          zBase: pageCountDesktop - i,
        };
      }
    }
  );

  // ── Flip Navigation Handler ─────────────────────────────────────────────────
  const doFlip = useCallback(
    (dir: "next" | "prev") => {
      if (isMobile) {
        if (dir === "next" && mobilePage < totalMobilePages - 1) {
          setMobileSlideDir("right");
          setMobilePage((p) => p + 1);
        } else if (dir === "prev" && mobilePage > 0) {
          setMobileSlideDir("left");
          setMobilePage((p) => p - 1);
        }
      } else {
        if (isAnimating) return;
        if (dir === "next" && flipCount >= maxFlipDesktop) return;
        if (dir === "prev" && flipCount <= 0) return;
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 750);
        setFlipCount((prev) => (dir === "next" ? prev + 1 : prev - 1));
      }
    },
    [
      isMobile,
      mobilePage,
      totalMobilePages,
      isAnimating,
      flipCount,
      maxFlipDesktop,
    ]
  );

  // Swipe detection
  const touchStartX = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) doFlip(dx < 0 ? "next" : "prev");
  };

  // ── Compress image before saving (max 900px, JPEG 80%) ──────────────────────
  const compressImage = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      img.onload = () => {
        const MAX = 900;
        let { width, height } = img;
        if (width > MAX || height > MAX) {
          if (width >= height) {
            height = Math.round((height * MAX) / width);
            width = MAX;
          } else {
            width = Math.round((width * MAX) / height);
            height = MAX;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("no canvas"));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        URL.revokeObjectURL(objectUrl);
        resolve(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error("img load failed"));
      };
      img.src = objectUrl;
    });
  }, []);

  const processFiles = useCallback(
    (files: FileList | File[]) => {
      if (!isAdmin) return;
      Array.from(files)
        .filter((f) => f.type.startsWith("image/"))
        .forEach((file) => {
          compressImage(file)
            .then((compressedUrl) => {
              const newPhoto: GalleryPhoto = {
                id: `photo-${Date.now()}-${Math.random()
                  .toString(36)
                  .substr(2, 5)}`,
                url: compressedUrl,
                caption:
                  file.name.replace(/\.[^/.]+$/, "") || "Kenangan Manis",
                date: new Date().toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                }),
                rotation: (Math.random() - 0.5) * 5,
              };
              addPhoto(newPhoto);
            })
            .catch((err) => console.error("Gagal memproses gambar:", err));
        });
    },
    [isAdmin, addPhoto, compressImage]
  );

  const supabaseSql = `-- Jalankan query ini di SQL Editor Supabase Anda:
create table if not exists birthday_photos (
  id text primary key,
  url text not null,
  caption text,
  date text,
  location text,
  rotation float,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Buka izin akses (RLS) untuk membaca & menulis foto
alter table birthday_photos enable row level security;

create policy "Public read" on birthday_photos for select using (true);
create policy "Public insert" on birthday_photos for insert with check (true);
create policy "Public delete" on birthday_photos for delete using (true);`;

  const copySqlToClipboard = () => {
    navigator.clipboard.writeText(supabaseSql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  return (
    <section
      id="scrapbook-album"
      className="relative py-20 px-3 sm:px-6 z-10 overflow-x-clip"
    >
      {/* ── Section Header ─────────────────────────────── */}
      <motion.div
        className="text-center mb-8 sm:mb-10"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100/90 text-rose-800 text-xs font-semibold uppercase tracking-widest mb-3 border border-rose-200">
          <BookOpen size={13} />
          Scrapbook Foto Kuma
        </div>
        <h2 className="text-3xl sm:text-5xl font-serif-title font-medium text-slate-800 tracking-tight">
          Album <span className="font-script italic text-rose-500">Kuma</span>
        </h2>
        <p className="text-slate-500 mt-2 text-xs sm:text-sm max-w-xs sm:max-w-md mx-auto font-light">
          {isMobile
            ? "Geser layar atau tekan tombol panah untuk membalik halaman album 💕"
            : "Klik cover atau gunakan tombol panah untuk membuka lembaran album 💕"}
        </p>
      </motion.div>

      {/* ── Admin Controls ──────────────────────────────── */}
      {isAdmin && (
        <div className="flex flex-col items-center mb-6 gap-3">
          <div className="flex flex-wrap justify-center gap-2.5">
            <label className="cursor-pointer px-4 py-2 rounded-full bg-slate-800 text-white text-xs font-semibold shadow hover:bg-slate-700 transition-all flex items-center gap-2">
              <Plus size={14} />
              Tambah Foto
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  if (e.target.files) processFiles(e.target.files);
                }}
                className="hidden"
              />
            </label>

            <button
              onClick={() => {
                setFlipCount(0);
                setMobilePage(0);
              }}
              className="px-4 py-2 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold border border-amber-200 hover:bg-amber-200 transition-all flex items-center gap-2"
            >
              <RotateCcw size={13} /> Reset Buku
            </button>

            <button
              onClick={() => setShowSupabaseGuide(true)}
              className="px-3.5 py-2 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200 hover:bg-rose-100 transition-all flex items-center gap-1.5"
            >
              <Database size={13} />
              Setup Supabase
            </button>
          </div>

          {/* Status pill Supabase */}
          <div className="mt-1">
            {isSupabaseReady ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-medium shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Cloud Supabase Aktif — Foto tersimpan permanen & sinkron di HP
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-medium shadow-xs">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Mode Lokal — Foto tersimpan di browser ini. Klik &quot;Setup Supabase&quot; untuk sync ke HP!
              </span>
            )}
          </div>
        </div>
      )}

      {/* ── Admin Photo Manager — Daftar foto dengan tombol delete ── */}
      {isAdmin && photos.length > 0 && (
        <div className="max-w-2xl mx-auto mb-8 px-2">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3 text-center">
            📷 Kelola Foto ({photos.length} Foto) — Klik ✕ untuk hapus
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5 sm:gap-3">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="relative group rounded-xl overflow-hidden shadow-sm border-2 border-white aspect-square bg-slate-100"
              >
                {/* Thumbnail */}
                <img
                  src={photo.url}
                  alt={photo.caption}
                  className="w-full h-full object-cover"
                />

                {/* Caption bar */}
                <div className="absolute bottom-0 inset-x-0 px-1.5 py-1 bg-gradient-to-t from-black/70 to-transparent">
                  <p className="text-white text-[9px] font-medium truncate">
                    {photo.caption}
                  </p>
                </div>

                {/* Tombol Delete — Selalu muncul di mobile, hover di desktop */}
                <button
                  onClick={() => removePhoto(photo.id)}
                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 active:scale-95 text-white flex items-center justify-center shadow-md opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-all cursor-pointer z-10"
                  aria-label={`Hapus foto ${photo.caption}`}
                  title="Hapus foto ini"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── THE BOOK ────────────────────────────────────── */}
      <div className="flex flex-col items-center gap-6 select-none">
        {/* =========================================================================
            MOBILE VIEW (< 768px): Single-Page Elegant Photobook
            Setiap halaman tampil 100% penuh di tengah layar, tidak ada yang terpotong!
           ========================================================================= */}
        {isMobile ? (
          <div
            className="relative"
            style={{
              width: "min(350px, 92vw)",
              height: "min(500px, 132vw)",
            }}
            ref={bookRef}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Soft Shadow glow */}
            <div
              className="absolute pointer-events-none"
              style={{
                bottom: -14,
                left: "4%",
                right: "4%",
                height: 24,
                borderRadius: "50%",
                background:
                  "radial-gradient(ellipse, rgba(160,104,40,0.4) 0%, transparent 70%)",
                filter: "blur(8px)",
              }}
            />

            {/* Container Buku dengan spine */}
            <div
              className="relative w-full h-full rounded-sm overflow-hidden shadow-xl border border-amber-900/20"
              style={{
                boxShadow:
                  "0 18px 45px -10px rgba(80,40,10,0.35), 0 4px 14px rgba(0,0,0,0.12)",
              }}
            >
              {/* Dynamic Page Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={mobilePage}
                  initial={{
                    opacity: 0,
                    x: mobileSlideDir === "right" ? 30 : -30,
                    rotateY: mobileSlideDir === "right" ? 15 : -15,
                  }}
                  animate={{ opacity: 1, x: 0, rotateY: 0 }}
                  exit={{
                    opacity: 0,
                    x: mobileSlideDir === "right" ? -30 : 30,
                    rotateY: mobileSlideDir === "right" ? -15 : 15,
                  }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="absolute inset-0"
                  onClick={() => {
                    if (mobilePage === 0) doFlip("next");
                  }}
                >
                  {mobilePage === 0 ? (
                    <BookCoverFront partnerName={data.partnerName} />
                  ) : mobilePage === totalMobilePages - 1 ? (
                    <BackCoverContent partnerName={data.partnerName} />
                  ) : (
                    <PageContent
                      photos={getPagePhotos(mobilePage - 1)}
                      seed={mobilePage - 1}
                      bgVariant={
                        bgVariants[(mobilePage - 1) % bgVariants.length]
                      }
                      pageNum={mobilePage}
                    />
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Spine Visual di sisi kiri buku */}
              <div
                className="absolute top-0 bottom-0 left-0 pointer-events-none rounded-l-sm overflow-hidden"
                style={{
                  width: 14,
                  zIndex: 40,
                  background:
                    "linear-gradient(90deg, #6b3c12 0%, #8a5020 35%, #b07030 70%, #7a4618 100%)",
                  boxShadow:
                    "2px 0 6px rgba(0,0,0,0.25), inset -1px 0 3px rgba(255,255,255,0.1)",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%) rotate(90deg)",
                    whiteSpace: "nowrap",
                    fontFamily: "var(--font-serif), Georgia, serif",
                    fontSize: 7,
                    fontWeight: 600,
                    color: "rgba(255,230,160,0.75)",
                    letterSpacing: "0.18em",
                  }}
                >
                  ✦ KUMA ✦
                </div>
              </div>

              {/* Page curl effect di tepi kanan */}
              <div
                className="absolute top-0 bottom-0 right-0 pointer-events-none"
                style={{
                  width: 14,
                  zIndex: 35,
                  background:
                    "linear-gradient(to left, rgba(0,0,0,0.06), transparent)",
                }}
              />
            </div>
          </div>
        ) : (
          /* =========================================================================
              DESKTOP VIEW (>= 768px): 3D Spread Book Flip
              Tampil proporsional di tengah layar desktop/laptop
             ========================================================================= */
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, ease: "easeOut" }}
            className="relative"
            style={{
              width: "min(360px, 94vw)",
              height: "min(500px, 130vw)",
              perspective: "1500px",
            }}
            ref={bookRef}
          >
            {/* Book glow shadow */}
            <div
              className="absolute pointer-events-none"
              style={{
                bottom: -16,
                left: "5%",
                right: "5%",
                height: 28,
                borderRadius: "50%",
                background:
                  "radial-gradient(ellipse, rgba(160,104,40,0.45) 0%, transparent 70%)",
                filter: "blur(10px)",
              }}
            />

            {/* Page Stack */}
            <div
              className="relative w-full h-full"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Back Cover Base */}
              <div
                className="absolute inset-0 rounded-sm overflow-hidden"
                style={{
                  zIndex: 0,
                  boxShadow:
                    "0 18px 50px -10px rgba(80,40,10,0.32), 0 4px 14px rgba(0,0,0,0.12)",
                }}
              >
                <BackCoverContent partnerName={data.partnerName} />
              </div>

              {/* Flip Pages */}
              {desktopPages.map((page, i) => {
                const isFlipped = flipCount > i;
                const zIndex = isFlipped
                  ? i + 1
                  : pageCountDesktop - i + 1;

                return (
                  <div
                    key={i}
                    className="absolute inset-0"
                    style={{
                      zIndex,
                      transformStyle: "preserve-3d",
                      transformOrigin: "left center",
                      transform: isFlipped
                        ? "rotateY(-180deg)"
                        : "rotateY(0deg)",
                      transition:
                        "transform 0.72s cubic-bezier(0.645, 0.045, 0.355, 1.000)",
                      cursor:
                        i === 0 && flipCount === 0 ? "pointer" : "default",
                    }}
                    onClick={() => {
                      if (i === 0 && flipCount === 0) doFlip("next");
                    }}
                  >
                    {/* FRONT face */}
                    <div
                      className="absolute inset-0 rounded-sm overflow-hidden"
                      style={{
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                        boxShadow:
                          i === 0 && flipCount === 0
                            ? "0 22px 55px -10px rgba(80,40,10,0.38), 0 6px 18px rgba(0,0,0,0.15)"
                            : "inset -3px 0 12px rgba(0,0,0,0.06)",
                        borderRight: "1px solid rgba(195,160,110,0.25)",
                      }}
                    >
                      {page.front}
                      <div
                        className="absolute top-0 bottom-0 right-0 pointer-events-none"
                        style={{
                          width: 18,
                          background:
                            "linear-gradient(to left, rgba(0,0,0,0.08), transparent)",
                        }}
                      />
                    </div>

                    {/* BACK face */}
                    <div
                      className="absolute inset-0 rounded-sm overflow-hidden"
                      style={{
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                        boxShadow: "inset 3px 0 12px rgba(0,0,0,0.06)",
                        borderLeft: "1px solid rgba(195,160,110,0.25)",
                      }}
                    >
                      {page.back}
                      <div
                        className="absolute top-0 bottom-0 left-0 pointer-events-none"
                        style={{
                          width: 18,
                          background:
                            "linear-gradient(to right, rgba(0,0,0,0.08), transparent)",
                        }}
                      />
                    </div>
                  </div>
                );
              })}

              {/* Spine */}
              <div
                className="absolute top-0 bottom-0 left-0 pointer-events-none rounded-l-sm overflow-hidden"
                style={{
                  width: 14,
                  zIndex: 9999,
                  background:
                    "linear-gradient(90deg, #6b3c12 0%, #8a5020 35%, #b07030 70%, #7a4618 100%)",
                  boxShadow:
                    "2px 0 8px rgba(0,0,0,0.28), inset -1px 0 3px rgba(255,255,255,0.1)",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%) rotate(90deg)",
                    whiteSpace: "nowrap",
                    fontFamily: "var(--font-serif), Georgia, serif",
                    fontSize: 7,
                    fontWeight: 600,
                    color: "rgba(255,230,160,0.65)",
                    letterSpacing: "0.18em",
                  }}
                >
                  ✦ Kenangan Kita ✦
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Navigation ─────────────────────────────────── */}
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => doFlip("prev")}
            disabled={
              isMobile
                ? mobilePage === 0
                : flipCount === 0 || isAnimating
            }
            className={`w-11 h-11 rounded-full flex items-center justify-center border shadow-md transition-all ${
              (isMobile ? mobilePage > 0 : flipCount > 0 && !isAnimating)
                ? "bg-white border-amber-200 text-slate-700 hover:border-rose-300 hover:text-rose-500 cursor-pointer"
                : "bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed"
            }`}
            aria-label="Halaman sebelumnya"
          >
            <ChevronLeft size={20} />
          </motion.button>

          {/* Page dot indicators */}
          <div className="flex items-center gap-1.5">
            {Array.from({
              length: isMobile ? totalMobilePages : desktopPages.length + 1,
            }).map((_, i) => {
              const isActive = isMobile ? i === mobilePage : i === flipCount;
              return (
                <button
                  key={i}
                  onClick={() => {
                    if (isMobile) {
                      setMobileSlideDir(i > mobilePage ? "right" : "left");
                      setMobilePage(i);
                    } else {
                      if (isAnimating) return;
                      setIsAnimating(true);
                      setTimeout(() => setIsAnimating(false), 750);
                      setFlipCount(Math.min(i, maxFlipDesktop));
                    }
                  }}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: isActive ? 20 : 8,
                    height: 8,
                    background: isActive
                      ? "rgb(251,113,133)"
                      : "rgb(253,230,138)",
                    cursor: "pointer",
                    border: "none",
                    padding: 0,
                  }}
                  aria-label={`Ke halaman ${i}`}
                />
              );
            })}
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => doFlip("next")}
            disabled={
              isMobile
                ? mobilePage >= totalMobilePages - 1
                : flipCount >= maxFlipDesktop || isAnimating
            }
            className={`w-11 h-11 rounded-full flex items-center justify-center border shadow-md transition-all ${
              (
                isMobile
                  ? mobilePage < totalMobilePages - 1
                  : flipCount < maxFlipDesktop && !isAnimating
              )
                ? "bg-white border-amber-200 text-slate-700 hover:border-rose-300 hover:text-rose-500 cursor-pointer"
                : "bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed"
            }`}
            aria-label="Halaman berikutnya"
          >
            <ChevronRight size={20} />
          </motion.button>
        </div>

        {/* Status text */}
        <p className="text-center text-xs text-slate-400 font-light">
          {isMobile ? (
            mobilePage === 0 ? (
              "✦ Ketuk cover atau tekan panah → untuk membuka"
            ) : mobilePage === totalMobilePages - 1 ? (
              "Halaman terakhir · Tekan ← untuk kembali"
            ) : (
              `Halaman ${mobilePage} dari ${totalMobilePages - 2} · Geser layar atau tekan panah`
            )
          ) : flipCount === 0 ? (
            "✦ Klik cover atau tombol → untuk membuka buku"
          ) : flipCount >= maxFlipDesktop ? (
            "Halaman terakhir — tekan ← untuk kembali"
          ) : (
            `Halaman ${flipCount} dari ${maxFlipDesktop} · Tekan panah untuk membalik`
          )}
        </p>
      </div>

      {/* ── Modal Panduan Supabase ──────────────────────── */}
      {showSupabaseGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 shadow-2xl border border-rose-100"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-rose-600 font-semibold text-base sm:text-lg">
                <Cloud size={20} />
                Hubungkan ke Supabase (Database Permanen)
              </div>
              <button
                onClick={() => setShowSupabaseGuide(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <p>
                Agar foto yang Anda upload <strong>tidak ter-reset</strong> saat
                dibuka di HP atau perangkat lain, sambungkan ke database gratis{" "}
                <strong>Supabase</strong>.
              </p>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-amber-900 text-xs">
                <strong>Langkah 1:</strong> Buka dashboard proyek Supabase Anda di{" "}
                <a
                  href="https://supabase.com"
                  target="_blank"
                  rel="noreferrer"
                  className="underline font-semibold text-amber-950"
                >
                  supabase.com
                </a>
                . Masuk ke menu <strong>SQL Editor</strong>, lalu salin dan
                jalankan query berikut:
              </div>

              {/* SQL box */}
              <div className="relative bg-slate-900 text-slate-100 p-3 rounded-xl font-mono text-[11px] overflow-x-auto">
                <button
                  onClick={copySqlToClipboard}
                  className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded bg-slate-700 hover:bg-slate-600 text-white text-[10px] flex items-center gap-1 font-sans"
                >
                  {copiedSql ? <Check size={12} /> : <Copy size={12} />}
                  {copiedSql ? "Disalin!" : "Salin SQL"}
                </button>
                <pre className="pr-16">{supabaseSql}</pre>
              </div>

              <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-rose-900 text-xs">
                <strong>Langkah 2:</strong> Buka file{" "}
                <code className="bg-rose-150 px-1 py-0.5 rounded font-mono">
                  .env.local
                </code>{" "}
                di folder proyek Anda, lalu masukkan URL dan Anon Key Supabase
                Anda:
                <pre className="bg-white/80 p-2 mt-2 rounded border border-rose-200 font-mono text-[11px] text-slate-800">
                  NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co{"\n"}
                  NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
                </pre>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setShowSupabaseGuide(false)}
                  className="px-5 py-2 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition-all"
                >
                  Tutup
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
}

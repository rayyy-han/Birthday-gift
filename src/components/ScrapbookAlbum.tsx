"use client";

import React, { useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Plus,
  Camera,
  RotateCcw,
  X,
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
  [{ x: 8, y: 6, w: 84, h: 75 }],
  // 2 photos — staggered top + bottom
  [
    { x: 5, y: 4, w: 86, h: 44 },
    { x: 7, y: 51, w: 86, h: 41 },
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
            transparent, transparent 27px, rgba(200,170,140,0.4) 28px
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
        backgroundImage: `radial-gradient(rgba(180,140,100,0.3) 1px, transparent 1px)`,
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
          top: -9,
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
          padding: "8px 8px 20px 8px",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 6px 20px -4px rgba(60,30,10,0.22), 0 2px 6px rgba(0,0,0,0.06)",
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
        {/* Caption */}
        <div style={{ textAlign: "center", marginTop: 4, paddingBottom: 2 }}>
          <p
            style={{
              fontFamily: "var(--font-handwriting)",
              fontSize: "clamp(9px, 1.5vw, 14px)",
              color: "#374151",
              lineHeight: 1.2,
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
          style={{ left: 36, width: 1, background: "rgba(230,100,120,0.28)" }}
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

      {/* Heart sticker on alternating pages */}
      {pageNum % 4 === seed % 4 && (
        <div
          className="absolute"
          style={{
            [isRight ? "left" : "right"]: 8,
            top: 8,
            opacity: 0.55,
          }}
        >
          <Heart
            size={15}
            style={{ fill: "rgb(251,113,133)", color: "rgb(251,113,133)" }}
          />
        </div>
      )}

      {/* Photos */}
      {photos.length === 0 ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div style={{ opacity: 0.18, textAlign: "center" }}>
            <Camera size={32} style={{ margin: "0 auto 6px", color: "#b45309" }} />
            <p
              style={{
                fontFamily: "var(--font-handwriting)",
                fontSize: 16,
                color: "#b45309",
              }}
            >
              Halaman kosong
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

// ─── Book Cover ───────────────────────────────────────────────────────────────
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
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{ padding: "24px 20px" }}
      >
        {/* Embossed heart circle */}
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: "50%",
            border: "2px solid rgba(255,230,160,0.45)",
            background: "rgba(255,255,255,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 14,
            boxShadow: "0 2px 10px rgba(0,0,0,0.12), inset 0 1px 3px rgba(255,255,255,0.2)",
          }}
        >
          <Heart
            size={28}
            style={{ fill: "rgba(255,235,185,0.85)", color: "rgba(255,235,185,0.85)" }}
          />
        </div>

        <p
          style={{
            fontFamily: "var(--font-handwriting)",
            fontSize: "clamp(20px, 5vw, 28px)",
            fontWeight: 700,
            color: "rgba(255,245,210,0.95)",
            textAlign: "center",
            lineHeight: 1.2,
            textShadow: "0 1px 4px rgba(0,0,0,0.2)",
            marginBottom: 4,
          }}
        >
          Album Kenangan
        </p>
        <p
          style={{
            fontFamily: "var(--font-script)",
            fontSize: "clamp(14px, 3.5vw, 19px)",
            color: "rgba(255,230,165,0.88)",
            fontStyle: "italic",
            marginBottom: 16,
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
              color: "rgba(255,230,165,0.7)",
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
            color: "rgba(255,230,165,0.6)",
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
        >
          <BookOpen size={11} />
          Klik untuk membuka
        </motion.div>
      </div>
    </div>
  );
}

function BookCoverBack() {
  return (
    <div
      className="absolute inset-0"
      style={{
        background: "linear-gradient(155deg, #a06828 0%, #b8843c 60%, #c49458 100%)",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              0deg, rgba(0,0,0,0.04) 0px, rgba(0,0,0,0.04) 1px,
              transparent 1px, transparent 3px
            )
          `,
        }}
      />
    </div>
  );
}

// ─── Back Cover ───────────────────────────────────────────────────────────────
function BackCoverContent({ partnerName }: { partnerName: string }) {
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden"
      style={{
        background:
          "linear-gradient(155deg, #a06828 0%, #b8843c 50%, #c49458 100%)",
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
      <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: 20 }}>
        <Heart
          size={34}
          style={{
            margin: "0 auto 10px",
            fill: "rgba(255,230,160,0.6)",
            color: "rgba(255,230,160,0.6)",
          }}
        />
        <p
          style={{
            fontFamily: "var(--font-handwriting)",
            fontSize: 20,
            color: "rgba(255,245,210,0.92)",
            fontWeight: 700,
          }}
        >
          Dibuat dengan cinta
        </p>
        <p
          style={{
            fontFamily: "var(--font-script)",
            fontSize: 16,
            color: "rgba(255,225,155,0.82)",
            fontStyle: "italic",
            marginTop: 4,
          }}
        >
          untuk {partnerName} 🤍
        </p>
      </div>
    </div>
  );
}

// ─── Single Page (flip unit) ───────────────────────────────────────────────────
// A "page" here represents ONE physical page with a front and a back.
// When flipped (-180deg on Y), the back face becomes visible.
interface PageDef {
  front: React.ReactNode;
  back: React.ReactNode;
  zBase: number; // z-index when not flipped (higher = on top)
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function ScrapbookAlbum() {
  const { data, isAdmin, updateData } = useGift();
  const photos = data.photos;
  const bookRef = useRef<HTMLDivElement>(null);

  // Number of content pages (each shows PHOTOS_PER_PAGE photos per face)
  // We pair faces: page[i].front + page[i].back
  // Total faces needed = ceil(photos.length / PHOTOS_PER_PAGE) + 2 (cover inside + back inside)
  const contentFaceCount = Math.max(1, Math.ceil(photos.length / PHOTOS_PER_PAGE));

  // flipCount: 0 = book closed (cover on top)
  //            n = n pages have been flipped over
  const [flipCount, setFlipCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const maxFlip = contentFaceCount; // when flipCount === maxFlip, we see backcover

  // Swipe detection
  const touchStartX = useRef(0);

  const doFlip = useCallback(
    (dir: "next" | "prev") => {
      if (isAnimating) return;
      if (dir === "next" && flipCount >= maxFlip) return;
      if (dir === "prev" && flipCount <= 0) return;
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 750);
      setFlipCount((prev) => (dir === "next" ? prev + 1 : prev - 1));
    },
    [isAnimating, flipCount, maxFlip]
  );

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) doFlip(dx < 0 ? "next" : "prev");
  };

  // Build page definitions
  // Page 0 = Cover page: front=cover, back=first content face
  // Page 1..N-1 = Content pages: front=face(2i-1), back=face(2i)
  // Page N = Back cover: front=last content face, back=backcover
  // ...Actually for a right-bound book, simpler model:
  // pages[i]: i=0 is cover (highest z), flips to reveal face 0
  //           i=1 flips to reveal face 1 → face 2
  //           i=n is back cover (lowest z)

  const getPagePhotos = (faceIndex: number): GalleryPhoto[] => {
    const start = faceIndex * PHOTOS_PER_PAGE;
    return photos.slice(start, start + PHOTOS_PER_PAGE);
  };

  const bgVariants: Array<"lined" | "grid" | "dots"> = ["lined", "grid", "dots", "lined", "grid"];

  // Total physical pages (flip units) = contentFaceCount + 1 (cover page + back cover)
  // But we model it as: 1 cover + ceil(content/2) spreads + 1 back cover
  // Simpler: just track faces left-to-right as pages flip.

  // Pages array:
  //   pages[0] = cover | face 0
  //   pages[1] = face 1 | face 2
  //   ...
  //   pages[n] = face(2n-1) | backcover
  const pageCount = Math.ceil(contentFaceCount / 2) + 1;

  const pages: PageDef[] = Array.from({ length: pageCount }, (_, i) => {
    if (i === 0) {
      // Cover page
      return {
        front: <BookCoverFront partnerName={data.partnerName} />,
        back: (
          <PageContent
            photos={getPagePhotos(0)}
            seed={0}
            bgVariant="lined"
            isRight
            pageNum={1}
          />
        ),
        zBase: pageCount,
      };
    } else if (i === pageCount - 1) {
      // Back cover page
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
        zBase: pageCount - i,
      };
    } else {
      // Middle content pages
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
        zBase: pageCount - i,
      };
    }
  });

  const processFiles = useCallback(
    (files: FileList | File[]) => {
      if (!isAdmin) return;
      Array.from(files)
        .filter((f) => f.type.startsWith("image/"))
        .forEach((file) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const dataUrl = e.target?.result as string;
            if (dataUrl) {
              const newPhoto: GalleryPhoto = {
                id: `photo-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
                url: dataUrl,
                caption: file.name.replace(/\.[^/.]+$/, "") || "Kenangan Manis",
                date: new Date().toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                }),
                rotation: (Math.random() - 0.5) * 5,
              };
              updateData({ photos: [newPhoto, ...data.photos] });
            }
          };
          reader.readAsDataURL(file);
        });
    },
    [isAdmin, data.photos, updateData]
  );

  return (
    <section id="scrapbook-album" className="relative py-20 px-4 z-10">
      {/* ── Section Header ─────────────────────────────── */}
      <motion.div
        className="text-center mb-10"
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
          Album{" "}
          <span className="font-script italic text-rose-500">Kuma</span>
        </h2>
        <p className="text-slate-500 mt-2 text-sm max-w-xs mx-auto font-light">
          Klik cover atau gunakan tombol panah untuk membalik halaman 💕
        </p>
      </motion.div>

      {/* ── Admin Controls ──────────────────────────────── */}
      {isAdmin && (
        <div className="flex justify-center mb-6 gap-3">
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
            onClick={() => setFlipCount(0)}
            className="px-4 py-2 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold border border-amber-200 hover:bg-amber-200 transition-all flex items-center gap-2"
          >
            <RotateCcw size={13} /> Reset Buku
          </button>
        </div>
      )}

      {/* ── Admin Photo Manager — Daftar foto dengan tombol delete ── */}
      {isAdmin && photos.length > 0 && (
        <div className="max-w-2xl mx-auto mb-8 px-2">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3 text-center">
            📷 Kelola Foto — Klik ✕ untuk hapus
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {photos.map((photo) => (
              <div key={photo.id} className="relative group rounded-xl overflow-hidden shadow-md border-2 border-white aspect-square">
                {/* Thumbnail */}
                <img
                  src={photo.url}
                  alt={photo.caption}
                  className="w-full h-full object-cover"
                />
                {/* Overlay gelap saat hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                {/* Caption */}
                <div className="absolute bottom-0 inset-x-0 px-1.5 py-1 bg-gradient-to-t from-black/60 to-transparent">
                  <p className="text-white text-[9px] font-medium truncate">{photo.caption}</p>
                </div>
                {/* Tombol Delete */}
                <button
                  onClick={() => {
                    const updated = photos.filter((p) => p.id !== photo.id);
                    updateData({ photos: updated });
                  }}
                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100 cursor-pointer z-10"
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
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.75, ease: "easeOut" }}
          className="relative"
          style={{
            width: "min(380px, 90vw)",
            height: "min(520px, 126vw)",
            perspective: "1500px",
          }}
          ref={bookRef}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* ── Book glow / shadow ── */}
          <div
            className="absolute pointer-events-none"
            style={{
              bottom: -16,
              left: "5%",
              right: "5%",
              height: 28,
              borderRadius: "50%",
              background: "radial-gradient(ellipse, rgba(160,104,40,0.45) 0%, transparent 70%)",
              filter: "blur(10px)",
            }}
          />

          {/* ── Page Stack ── */}
          <div
            className="relative w-full h-full"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Bottom base — back cover always visible at back */}
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

            {/* ── Flip Pages (rendered back-to-front) ── */}
            {pages.map((page, i) => {
              const isFlipped = flipCount > i;
              const zIndex = isFlipped ? i + 1 : pageCount - i + 1;

              return (
                <div
                  key={i}
                  className="absolute inset-0"
                  style={{
                    zIndex,
                    transformStyle: "preserve-3d",
                    transformOrigin: "left center",
                    transform: isFlipped ? "rotateY(-180deg)" : "rotateY(0deg)",
                    transition: "transform 0.72s cubic-bezier(0.645, 0.045, 0.355, 1.000)",
                    cursor: i === 0 && flipCount === 0 ? "pointer" : "default",
                  }}
                  onClick={() => {
                    // Clicking the cover opens it
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

                    {/* Page curl shadow on right edge */}
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

                    {/* Page curl shadow on left edge */}
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

            {/* ── Spine (purely visual, always on top-left) ── */}
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
              {/* Spine text */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%) rotate(90deg)",
                  whiteSpace: "nowrap",
                  fontFamily: "var(--font-handwriting)",
                  fontSize: 7,
                  color: "rgba(255,230,160,0.65)",
                  letterSpacing: "0.18em",
                }}
              >
                ✦ Kenangan Kita ✦
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Navigation ─────────────────────────────────── */}
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => doFlip("prev")}
            disabled={flipCount === 0 || isAnimating}
            className={`w-11 h-11 rounded-full flex items-center justify-center border shadow-md transition-all ${flipCount > 0 && !isAnimating
                ? "bg-white border-amber-200 text-slate-700 hover:border-rose-300 hover:text-rose-500 cursor-pointer"
                : "bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed"
              }`}
            aria-label="Halaman sebelumnya"
          >
            <ChevronLeft size={20} />
          </motion.button>

          {/* Page dot indicators */}
          <div className="flex items-center gap-1.5">
            {Array.from({ length: pages.length + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  if (isAnimating) return;
                  setIsAnimating(true);
                  setTimeout(() => setIsAnimating(false), 750);
                  setFlipCount(Math.min(i, maxFlip));
                }}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === flipCount ? 20 : 10,
                  height: 10,
                  background: i === flipCount ? "rgb(251,113,133)" : "rgb(253,230,138)",
                  cursor: "pointer",
                  border: "none",
                  padding: 0,
                }}
                aria-label={`Ke halaman ${i}`}
              />
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => doFlip("next")}
            disabled={flipCount >= maxFlip || isAnimating}
            className={`w-11 h-11 rounded-full flex items-center justify-center border shadow-md transition-all ${flipCount < maxFlip && !isAnimating
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
          {flipCount === 0
            ? "✦ Klik cover atau tombol → untuk membuka buku"
            : flipCount >= maxFlip
              ? "Halaman terakhir — tekan ← untuk kembali"
              : `Halaman ${flipCount} dari ${maxFlip} · Geser atau tekan panah`}
        </p>
      </div>
    </section>
  );
}

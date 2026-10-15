"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { BirthdayGiftConfig, GalleryPhoto, INITIAL_GIFT_DATA } from "@/data/giftData";
import { supabase, isSupabaseReady } from "@/lib/supabase";

// Nama table di Supabase
const SUPABASE_TABLE = "birthday_photos";
// Fallback localStorage jika Supabase tidak tersedia
const PHOTOS_STORAGE_KEY = "birthday_gift_photos_v1";

interface GiftContextType {
  data: BirthdayGiftConfig;
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;
  updateData: (newData: Partial<BirthdayGiftConfig>) => void;
  addPhoto: (photo: GalleryPhoto) => Promise<boolean>;
  removePhoto: (id: string) => Promise<void>;
  resetData: () => void;
  toggleAdminPasscode: (pass: string) => boolean;
  photosLoading: boolean;
  isSupabaseReady: boolean;
}

const GiftContext = createContext<GiftContextType | undefined>(undefined);

export function GiftProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<BirthdayGiftConfig>(INITIAL_GIFT_DATA);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [photosLoading, setPhotosLoading] = useState(true);

  // ── Load foto dari Supabase atau localStorage saat mount ──────────────────
  useEffect(() => {
    let isMounted = true;

    const loadPhotos = async () => {
      try {
        if (isSupabaseReady && supabase) {
          // Ambil dari Supabase
          const { data: rows, error } = await supabase
            .from(SUPABASE_TABLE)
            .select("*")
            .order("created_at", { ascending: false });

          if (!error && rows) {
            const supabasePhotos: GalleryPhoto[] = rows.map((row) => ({
              id: row.id,
              url: row.url,
              caption: row.caption || "Kenangan Manis",
              date: row.date || "",
              location: row.location || "",
              rotation: row.rotation || 0,
            }));

            // Gabungkan foto Supabase dengan foto bawaan di giftData.ts
            const dbIds = new Set(supabasePhotos.map((p) => p.id));
            const merged = [
              ...supabasePhotos,
              ...INITIAL_GIFT_DATA.photos.filter((p) => !dbIds.has(p.id)),
            ];

            if (isMounted) {
              setData((prev) => ({ ...prev, photos: merged }));
            }
            try {
              localStorage.setItem(PHOTOS_STORAGE_KEY, JSON.stringify(merged));
            } catch {}
            return;
          } else if (error) {
            console.warn("Supabase query error, fallback ke localStorage:", error.message);
          }
        }
        // Fallback ke localStorage
        loadFromLocalStorage();
      } catch (e) {
        console.error("Failed to load photos:", e);
        loadFromLocalStorage();
      } finally {
        if (isMounted) setPhotosLoading(false);
      }
    };

    const loadFromLocalStorage = () => {
      try {
        const saved = localStorage.getItem(PHOTOS_STORAGE_KEY);
        if (saved) {
          const parsed: GalleryPhoto[] = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0 && isMounted) {
            const savedIds = new Set(parsed.map((p) => p.id));
            const merged = [
              ...parsed,
              ...INITIAL_GIFT_DATA.photos.filter((p) => !savedIds.has(p.id)),
            ];
            setData((prev) => ({ ...prev, photos: merged }));
          }
        }
      } catch (e) {
        console.error("Failed to load photos from localStorage:", e);
      }
    };

    loadPhotos();

    return () => {
      isMounted = false;
    };
  }, []);

  // ── Sinkronkan data teks dari INITIAL_GIFT_DATA tanpa mereset foto ────────
  useEffect(() => {
    setData((prev) => ({
      ...INITIAL_GIFT_DATA,
      photos: prev.photos,
      customMusicName: prev.customMusicName || INITIAL_GIFT_DATA.customMusicName,
      customMusicData: prev.customMusicData || INITIAL_GIFT_DATA.customMusicData,
    }));
  }, [
    INITIAL_GIFT_DATA.partnerName,
    INITIAL_GIFT_DATA.birthdayDate,
    INITIAL_GIFT_DATA.loveLetter,
    INITIAL_GIFT_DATA.reasons,
    INITIAL_GIFT_DATA.wishes,
  ]);

  const updateData = (newData: Partial<BirthdayGiftConfig>) => {
    setData((prev) => ({ ...prev, ...newData }));
  };

  // ── Tambah foto (atomic + simpan ke Supabase & localStorage) ───────────────
  const addPhoto = async (photo: GalleryPhoto): Promise<boolean> => {
    let supabaseSuccess = false;

    // Simpan ke Supabase jika aktif
    if (isSupabaseReady && supabase) {
      try {
        const { error } = await supabase.from(SUPABASE_TABLE).insert({
          id: photo.id,
          url: photo.url,
          caption: photo.caption,
          date: photo.date,
          location: photo.location || "",
          rotation: photo.rotation || 0,
        });
        if (error) {
          console.error("Supabase insert error:", error.message);
        } else {
          supabaseSuccess = true;
        }
      } catch (e) {
        console.error("Failed to save photo to Supabase:", e);
      }
    }

    // Update state dan simpan ke localStorage
    setData((prev) => {
      const nextPhotos = [photo, ...prev.photos];
      try {
        localStorage.setItem(PHOTOS_STORAGE_KEY, JSON.stringify(nextPhotos));
      } catch {}
      return { ...prev, photos: nextPhotos };
    });

    return supabaseSuccess;
  };

  // ── Hapus foto (atomic + hapus dari Supabase & localStorage) ───────────────
  const removePhoto = async (id: string) => {
    // Optimistic UI update + simpan ke localStorage
    setData((prev) => {
      const nextPhotos = prev.photos.filter((p) => p.id !== id);
      try {
        localStorage.setItem(PHOTOS_STORAGE_KEY, JSON.stringify(nextPhotos));
      } catch {}
      return { ...prev, photos: nextPhotos };
    });

    // Hapus dari Supabase jika aktif
    if (isSupabaseReady && supabase) {
      try {
        const { error } = await supabase.from(SUPABASE_TABLE).delete().eq("id", id);
        if (error) {
          console.warn("Supabase delete error:", error.message);
        }
      } catch (e) {
        console.error("Failed to delete photo from Supabase:", e);
      }
    }
  };

  const resetData = () => {
    try {
      localStorage.removeItem(PHOTOS_STORAGE_KEY);
    } catch {}
    setData(INITIAL_GIFT_DATA);
  };

  const toggleAdminPasscode = (pass: string): boolean => {
    if (pass === "1234" || pass === "admin") {
      setIsAdmin(!isAdmin);
      return true;
    }
    return false;
  };

  return (
    <GiftContext.Provider
      value={{
        data,
        isAdmin,
        setIsAdmin,
        updateData,
        addPhoto,
        removePhoto,
        resetData,
        toggleAdminPasscode,
        photosLoading,
        isSupabaseReady,
      }}
    >
      {children}
    </GiftContext.Provider>
  );
}

export function useGift() {
  const context = useContext(GiftContext);
  if (!context) throw new Error("useGift must be used within GiftProvider");
  return context;
}

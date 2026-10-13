"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { BirthdayGiftConfig, GalleryPhoto, INITIAL_GIFT_DATA } from "@/data/giftData";
import { supabase } from "@/lib/supabase";

// Nama table di Supabase
const SUPABASE_TABLE = "birthday_photos";
// Fallback localStorage jika Supabase tidak tersedia
const PHOTOS_STORAGE_KEY = "birthday_gift_photos_v1";

interface GiftContextType {
  data: BirthdayGiftConfig;
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;
  updateData: (newData: Partial<BirthdayGiftConfig>) => void;
  addPhoto: (photo: GalleryPhoto) => Promise<void>;
  removePhoto: (id: string) => Promise<void>;
  resetData: () => void;
  toggleAdminPasscode: (pass: string) => boolean;
  photosLoading: boolean;
}

const GiftContext = createContext<GiftContextType | undefined>(undefined);

// ── Cek apakah Supabase tersedia ──────────────────────────────────────────────
const isSupabaseConfigured =
  typeof process.env.NEXT_PUBLIC_SUPABASE_URL === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_URL.includes("supabase.co") &&
  typeof process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length > 10;

export function GiftProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<BirthdayGiftConfig>(INITIAL_GIFT_DATA);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [photosLoading, setPhotosLoading] = useState(true);

  // ── Load foto dari Supabase atau localStorage saat mount ──────────────────
  useEffect(() => {
    const loadPhotos = async () => {
      try {
        if (isSupabaseConfigured) {
          // Ambil dari Supabase
          const { data: rows, error } = await supabase
            .from(SUPABASE_TABLE)
            .select("*")
            .order("created_at", { ascending: false });

          if (!error && rows && rows.length > 0) {
            const photos: GalleryPhoto[] = rows.map((row) => ({
              id: row.id,
              url: row.url,
              caption: row.caption || "Kenangan Manis",
              date: row.date || "",
              location: row.location || "",
              rotation: row.rotation || 0,
            }));
            setData((prev) => ({ ...prev, photos }));
          } else if (error) {
            console.warn("Supabase error, fallback ke localStorage:", error.message);
            loadFromLocalStorage();
          }
        } else {
          // Fallback ke localStorage
          loadFromLocalStorage();
        }
      } catch (e) {
        console.error("Failed to load photos:", e);
        loadFromLocalStorage();
      } finally {
        setPhotosLoading(false);
      }
    };

    const loadFromLocalStorage = () => {
      try {
        const saved = localStorage.getItem(PHOTOS_STORAGE_KEY);
        if (saved) {
          const parsed: GalleryPhoto[] = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setData((prev) => ({ ...prev, photos: parsed }));
          }
        }
      } catch (e) {
        console.error("Failed to load photos from localStorage:", e);
      }
    };

    loadPhotos();
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

  // ── Tambah foto (atomic + simpan ke Supabase/localStorage) ───────────────
  const addPhoto = async (photo: GalleryPhoto) => {
    // Langsung update UI (optimistic)
    setData((prev) => ({ ...prev, photos: [photo, ...prev.photos] }));

    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.from(SUPABASE_TABLE).insert({
          id: photo.id,
          url: photo.url,
          caption: photo.caption,
          date: photo.date,
          location: photo.location || "",
          rotation: photo.rotation || 0,
        });
        if (error) {
          console.warn("Supabase insert error, fallback ke localStorage:", error.message);
          saveToLocalStorage();
        }
      } else {
        saveToLocalStorage();
      }
    } catch (e) {
      console.error("Failed to save photo:", e);
      saveToLocalStorage();
    }
  };

  // ── Hapus foto (atomic + hapus dari Supabase/localStorage) ───────────────
  const removePhoto = async (id: string) => {
    // Langsung update UI (optimistic)
    setData((prev) => ({ ...prev, photos: prev.photos.filter((p) => p.id !== id) }));

    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.from(SUPABASE_TABLE).delete().eq("id", id);
        if (error) {
          console.warn("Supabase delete error:", error.message);
          saveToLocalStorage();
        }
      } else {
        saveToLocalStorage();
      }
    } catch (e) {
      console.error("Failed to delete photo:", e);
      saveToLocalStorage();
    }
  };

  // ── Helper simpan ke localStorage ────────────────────────────────────────
  const saveToLocalStorage = () => {
    try {
      setData((prev) => {
        try {
          localStorage.setItem(PHOTOS_STORAGE_KEY, JSON.stringify(prev.photos));
        } catch {}
        return prev;
      });
    } catch (e) {
      console.warn("localStorage write failed:", e);
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
        data, isAdmin, setIsAdmin, updateData,
        addPhoto, removePhoto, resetData,
        toggleAdminPasscode, photosLoading,
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

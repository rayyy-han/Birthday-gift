"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { BirthdayGiftConfig, GalleryPhoto, INITIAL_GIFT_DATA } from "@/data/giftData";

const PHOTOS_STORAGE_KEY = "birthday_gift_photos_v1";

interface GiftContextType {
  data: BirthdayGiftConfig;
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;
  updateData: (newData: Partial<BirthdayGiftConfig>) => void;
  addPhoto: (photo: GalleryPhoto) => void;      // atomic add — tidak terkena stale closure
  removePhoto: (id: string) => void;            // atomic remove
  resetData: () => void;
  toggleAdminPasscode: (pass: string) => boolean;
}

const GiftContext = createContext<GiftContextType | undefined>(undefined);

export function GiftProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<BirthdayGiftConfig>(INITIAL_GIFT_DATA);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [photosLoaded, setPhotosLoaded] = useState(false);

  // 1. Load foto tersimpan dari localStorage saat mount
  useEffect(() => {
    try {
      const savedPhotos = localStorage.getItem(PHOTOS_STORAGE_KEY);
      if (savedPhotos) {
        const parsed: GalleryPhoto[] = JSON.parse(savedPhotos);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setData((prev) => ({ ...prev, photos: parsed }));
        }
      }
    } catch (e) {
      console.error("Failed to load saved photos:", e);
    }
    setPhotosLoaded(true);
  }, []);

  // 2. Simpan foto ke localStorage setiap kali data.photos berubah (setelah load awal)
  useEffect(() => {
    if (!photosLoaded) return;
    try {
      localStorage.setItem(PHOTOS_STORAGE_KEY, JSON.stringify(data.photos));
    } catch (e) {
      console.warn("localStorage penuh, foto tidak tersimpan:", e);
    }
  }, [data.photos, photosLoaded]);

  // 3. Sinkronkan teks dari INITIAL_GIFT_DATA tanpa mereset foto user
  useEffect(() => {
    setData((prev) => ({
      ...INITIAL_GIFT_DATA,
      photos: prev.photos,            // jaga foto yang sudah ditambah
      customMusicName: prev.customMusicName || INITIAL_GIFT_DATA.customMusicName,
      customMusicData: prev.customMusicData || INITIAL_GIFT_DATA.customMusicData,
    }));
  }, [
    INITIAL_GIFT_DATA.partnerName,
    INITIAL_GIFT_DATA.birthdayDate,
    INITIAL_GIFT_DATA.heroGreeting,
    INITIAL_GIFT_DATA.heroSubtext,
    INITIAL_GIFT_DATA.loveLetter,
    INITIAL_GIFT_DATA.reasons,
    INITIAL_GIFT_DATA.wishes,
  ]);

  // ── Fungsi update umum ──────────────────────────────────────────────
  const updateData = (newData: Partial<BirthdayGiftConfig>) => {
    setData((prev) => ({ ...prev, ...newData }));
  };

  // ── Atomic add — selalu prepend ke list TERKINI (tidak stale) ──────
  const addPhoto = (photo: GalleryPhoto) => {
    setData((prev) => ({
      ...prev,
      photos: [photo, ...prev.photos],
    }));
  };

  // ── Atomic remove ─────────────────────────────────────────────────
  const removePhoto = (id: string) => {
    setData((prev) => ({
      ...prev,
      photos: prev.photos.filter((p) => p.id !== id),
    }));
  };

  const resetData = () => {
    try {
      localStorage.removeItem(PHOTOS_STORAGE_KEY);
      localStorage.removeItem("birthday_gift_config_v3");
    } catch (e) {
      console.error("Failed to reset:", e);
    }
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
      value={{ data, isAdmin, setIsAdmin, updateData, addPhoto, removePhoto, resetData, toggleAdminPasscode }}
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

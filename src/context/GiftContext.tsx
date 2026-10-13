"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { BirthdayGiftConfig, GalleryPhoto, INITIAL_GIFT_DATA } from "@/data/giftData";

// Kunci localStorage untuk foto yang diupload user
const PHOTOS_STORAGE_KEY = "birthday_gift_photos_v1";

interface GiftContextType {
  data: BirthdayGiftConfig;
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;
  updateData: (newData: Partial<BirthdayGiftConfig>) => void;
  resetData: () => void;
  toggleAdminPasscode: (pass: string) => boolean;
}

const GiftContext = createContext<GiftContextType | undefined>(undefined);

export function GiftProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<BirthdayGiftConfig>(INITIAL_GIFT_DATA);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [photosLoaded, setPhotosLoaded] = useState(false);

  // 1. Load foto yang tersimpan dari localStorage saat pertama kali mount
  useEffect(() => {
    try {
      const savedPhotos = localStorage.getItem(PHOTOS_STORAGE_KEY);
      if (savedPhotos) {
        const parsedPhotos: GalleryPhoto[] = JSON.parse(savedPhotos);
        if (Array.isArray(parsedPhotos) && parsedPhotos.length > 0) {
          setData((prev) => ({ ...prev, photos: parsedPhotos }));
        }
      }
    } catch (e) {
      console.error("Failed to load saved photos:", e);
    }
    setPhotosLoaded(true);
  }, []);

  // 2. Simpan foto ke localStorage setiap kali data.photos berubah (setelah initial load)
  useEffect(() => {
    if (!photosLoaded) return;
    try {
      // Simpan semua foto (termasuk yang base64) ke localStorage
      localStorage.setItem(PHOTOS_STORAGE_KEY, JSON.stringify(data.photos));
    } catch (e) {
      // localStorage mungkin penuh (base64 foto besar)
      console.warn("Failed to save photos to localStorage:", e);
    }
  }, [data.photos, photosLoaded]);

  // 3. Sinkronkan perubahan di INITIAL_GIFT_DATA (teks, nama, dll) tapi JAGA foto yang sudah disimpan
  useEffect(() => {
    setData((prev) => ({
      ...INITIAL_GIFT_DATA,
      // Pertahankan foto yang sudah ditambah user (tidak di-reset oleh perubahan giftData.ts)
      photos: prev.photos,
      customMusicName: prev.customMusicName || INITIAL_GIFT_DATA.customMusicName,
      customMusicData: prev.customMusicData || INITIAL_GIFT_DATA.customMusicData,
    }));
  }, [
    INITIAL_GIFT_DATA.partnerName,
    INITIAL_GIFT_DATA.birthdayDate,
    INITIAL_GIFT_DATA.heroGreeting,
    INITIAL_GIFT_DATA.heroSubtext,
    INITIAL_GIFT_DATA.trollTitle,
    INITIAL_GIFT_DATA.trollOption1,
    INITIAL_GIFT_DATA.trollOption2,
    INITIAL_GIFT_DATA.trollSubtitle,
    INITIAL_GIFT_DATA.loveLetter,
    INITIAL_GIFT_DATA.reasons,
    INITIAL_GIFT_DATA.wishes,
  ]);

  const updateData = (newData: Partial<BirthdayGiftConfig>) => {
    setData((prev) => ({
      ...prev,
      ...newData,
    }));
  };

  const resetData = () => {
    try {
      localStorage.removeItem(PHOTOS_STORAGE_KEY);
      localStorage.removeItem("birthday_gift_config_v3");
    } catch (e) {
      console.error("Failed to reset gift config:", e);
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
      value={{ data, isAdmin, setIsAdmin, updateData, resetData, toggleAdminPasscode }}
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

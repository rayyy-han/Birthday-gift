"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { BirthdayGiftConfig, INITIAL_GIFT_DATA } from "@/data/giftData";

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

  // 1. Integrasi Langsung: Setiap kali INITIAL_GIFT_DATA di giftData.ts diubah,
  // langsung sinkronkan ke state sehingga tampilan HTML langsung berubah otomatis!
  useEffect(() => {
    setData((prev) => ({
      ...INITIAL_GIFT_DATA,
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
    INITIAL_GIFT_DATA.photos,
    INITIAL_GIFT_DATA.reasons,
    INITIAL_GIFT_DATA.wishes,
  ]);

  // 2. Bersihkan cache localStorage lama yang menimpa teks data,
  // namun tetap pertahankan custom audio jika ada yang diupload pengguna.
  useEffect(() => {
    try {
      const saved = localStorage.getItem("birthday_gift_config_v3");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.customMusicData) {
          setData((prev) => ({
            ...prev,
            customMusicName: parsed.customMusicName,
            customMusicData: parsed.customMusicData,
          }));
        }
        // Hapus cache teks agar perubahan di file giftData.ts selalu langsung tampil
        localStorage.removeItem("birthday_gift_config_v3");
      }
    } catch (e) {
      console.error("Failed to load gift config:", e);
    }
  }, []);

  const updateData = (newData: Partial<BirthdayGiftConfig>) => {
    setData((prev) => ({
      ...prev,
      ...newData,
    }));
  };

  const resetData = () => {
    try {
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

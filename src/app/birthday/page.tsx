"use client";

import React, { useState } from "react";
import BackgroundParticles from "@/components/BackgroundParticles";
import Navbar from "@/components/Navbar";
import HeroCake from "@/components/HeroCake";
import SecretLoveLetter from "@/components/SecretLoveLetter";
import ScrapbookAlbum from "@/components/ScrapbookAlbum";
import CustomizerModal from "@/components/CustomizerModal";

export default function BirthdayPage() {
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);

  return (
    <main className="min-h-screen relative overflow-hidden text-slate-800 font-sans selection:bg-pink-200 selection:text-rose-900 pb-12">
      <BackgroundParticles />
      <Navbar onOpenCustomizer={() => setIsCustomizerOpen(true)} />

      {/* 1. Hero — Candle Blowing */}
      <HeroCake />

      {/* 2. Wax Seal Secret Love Letter */}
      <SecretLoveLetter />

      {/* 3. Scrapbook Photo Album */}
      <ScrapbookAlbum />

      <CustomizerModal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
      />
    </main>
  );
}

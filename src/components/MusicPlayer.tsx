"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";

// Lagu permanen — Taylor Swift: Daylight
const SONG_SRC = "/music/daylight.mp3";
const VOLUME = 0.6;

// Semua event yang dianggap "interaksi pengguna" oleh browser
const UNLOCK_EVENTS = [
  "pointerdown",
  "touchstart",
  "touchend",
  "click",
  "keydown",
  "scroll",
  "mousemove",
] as const;

export default function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const userPausedRef = useRef(false);
  const unlockedRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [blocked, setBlocked] = useState(false);

  const tryPlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || userPausedRef.current) return false;
    try {
      audio.volume = VOLUME;
      await audio.play();
      setBlocked(false);
      setIsPlaying(true);
      return true;
    } catch {
      setBlocked(true);
      setIsPlaying(false);
      return false;
    }
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = VOLUME;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => { if (!userPausedRef.current) setIsPlaying(false); else setIsPlaying(false); };
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);

    // Handler untuk interaksi pertama pengguna
    const onFirstInteraction = async () => {
      if (unlockedRef.current) return;
      const ok = await tryPlay();
      if (ok) {
        unlockedRef.current = true;
        // Hapus semua listener setelah berhasil
        UNLOCK_EVENTS.forEach((ev) =>
          window.removeEventListener(ev, onFirstInteraction, { capture: true } as EventListenerOptions)
        );
      }
    };

    // Coba auto-play langsung
    tryPlay().then((ok) => {
      if (ok) {
        unlockedRef.current = true;
      } else {
        // Pasang listener untuk interaksi pertama
        UNLOCK_EVENTS.forEach((ev) =>
          window.addEventListener(ev, onFirstInteraction, { once: false, capture: true, passive: true })
        );
      }
    });

    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
      UNLOCK_EVENTS.forEach((ev) =>
        window.removeEventListener(ev, onFirstInteraction, { capture: true } as EventListenerOptions)
      );
      audio.pause();
    };
  }, [tryPlay]);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      userPausedRef.current = false;
      tryPlay();
    } else {
      userPausedRef.current = true;
      audio.pause();
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !audio.muted;
    setIsMuted(audio.muted);
  };

  return (
    <>
      {/* Audio element permanen */}
      <audio
        ref={audioRef}
        src={SONG_SRC}
        loop
        preload="auto"
        playsInline
        style={{ display: "none" }}
      />

      {/* Floating player pojok kanan bawah */}
      <div className="fixed bottom-5 right-5 z-[60] flex flex-col items-end gap-2 pointer-events-auto">
        <AnimatePresence>
          {blocked && !isPlaying && (
            <motion.button
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              onClick={() => {
                userPausedRef.current = false;
                tryPlay();
              }}
              className="px-3 py-1.5 rounded-full bg-white/95 border border-pink-200 shadow-md text-xs text-pink-700 font-medium cursor-pointer hover:bg-pink-50 transition-colors"
            >
              🎵 Ketuk untuk memutar musik
            </motion.button>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-white/90 backdrop-blur border border-pink-200 shadow-lg">
          {/* Play / Pause */}
          <button
            onClick={togglePlay}
            aria-label={isPlaying ? "Jeda musik" : "Putar musik"}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-pink-600 text-white flex items-center justify-center shadow cursor-pointer hover:scale-105 active:scale-95 transition-transform"
          >
            {isPlaying
              ? <Pause size={16} className="fill-white" />
              : <Play size={16} className="fill-white ml-0.5" />
            }
          </button>

          {/* Equalizer animasi */}
          <div className="flex items-end gap-[3px] h-4 px-1" aria-hidden>
            {[0, 1, 2, 3].map((i) => (
              <motion.span
                key={i}
                className="w-[3px] rounded-full bg-green-500"
                animate={
                  isPlaying && !isMuted
                    ? { height: ["30%", "100%", "50%", "85%", "30%"] }
                    : { height: "30%" }
                }
                transition={
                  isPlaying && !isMuted
                    ? { duration: 1 + i * 0.15, repeat: Infinity, ease: "easeInOut" }
                    : { duration: 0.2 }
                }
              />
            ))}
          </div>

          {/* Mute / Unmute */}
          <button
            onClick={toggleMute}
            aria-label={isMuted ? "Nyalakan suara" : "Bisukan suara"}
            className="w-10 h-10 rounded-full text-green-700 hover:bg-green-50 flex items-center justify-center cursor-pointer transition-colors"
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>
      </div>
    </>
  );
}
import type { Metadata } from "next";
import "./globals.css";
import { GiftProvider } from "@/context/GiftContext";
import BackgroundMusic from "@/components/MusicPlayer";

export const metadata: Metadata = {
  title: "Our Scrapbook & Special Birthday Gift 🤍",
  description: "Buku kenangan scrapbook, album foto polaroid manis, dan ucapan doa ulang tahun spesial.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <GiftProvider>
          {children}
          <BackgroundMusic />
        </GiftProvider>
      </body>
    </html>
  );
}



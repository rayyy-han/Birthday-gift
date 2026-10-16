export interface GalleryPhoto {
  id: string;
  url: string;
  caption: string;
  date: string;
  location?: string;
  rotation?: number;
}

export interface BirthdayGiftConfig {
  partnerName: string;
  birthdayDate: string;
  heroGreeting: string;
  heroSubtext: string;
  loveLetter: string;
  photos: GalleryPhoto[];
  customMusicName?: string;  // display name of the uploaded song
  customMusicData?: string;  // base64 audio data
  trollTitle: string;
  trollOption1: string;
  trollOption2: string;
  trollSubtitle?: string;
  countdownTarget?: string; // Target waktu countdown dalam format ISO YYYY-MM-DDTHH:mm:ss
}

export const INITIAL_GIFT_DATA: BirthdayGiftConfig = {
  partnerName: "Keiko",
  birthdayDate: "17 Oktober",
  countdownTarget: "2026-10-17T00:00:00",
  heroGreeting: "Selamat Ulang Tahun",
  heroSubtext:
    "Sebuah hal kecil yang dibuat khusus untuk merayakan hari istimewamu, dan menyampaikan doa terbaik.",
  trollTitle: "Pilih Yang Benar!",
  trollOption1: "Kuma Cantik",
  trollOption2: "Kuma Botak",
  trollSubtitle: "Sebelum membuka isi nya, Kuma harus pilih dulu:",
  loveLetter: `Selamat ulang tahun Sayangggku.

Selamat Ulang tahunnn Kumaa cantikk, Yeayyy sekarangg kamu sudahh 21 Tahunn aja yaa gakk kerasaaa yaaa kamu udah berkembang dan jadii keikoo yangg aku kenall sampe sekarang.

Di umur yang sudah bukan anak anak ini lagi, kamu udah hebat sampai sejauh ini untuk bertahann dari apapun, akuu banggaa dari semua proses yang kamu tunjukin sama aku selama ini.

Doa aku untuk Hari yang spesial kamu kali ini adalah kamu selalu diberi Kesehatan, Jasmani dan Rohani, tetap jadii keikoo yang aku kenall selama ini, di limpahkan rezekii nya karena kamu baik banget sama aku dari materi dan waktu yang kamu kasih buat aku, Dilancarin segala urusan kamu untuk kamu ngelangkah lebih jauhh lagi :), Aku gak pintar buat ngasih kata kata, tapi intinya aku mau merayakan hari spesial kamu ini.


Selamat ulang tahun, kesayanganku.`,
  photos: [
    {
      id: "photo-1",
      url: "/images/foto1.png",
      caption: " Kuma lagi nunggu Cimol Bojot 😜",
      date: "Raden Saleh",
      location: "Jalan Berdua",
      rotation: -1.5,
    },
    {
      id: "photo-2",
      url: "/images/foto2.png",
      caption: "Mam sushi & ramen 🍣",
      date: "Margo",
      location: "Resto Favorit",
      rotation: 2,
    },
    {
      id: "photo-3",
      url: "/images/foto3.png",
      caption: "Kembaran : Kuma & bonekanya 🐷",
      date: "Oh Some",
      location: "Jalan Berdua",
      rotation: -2,
    },
    {
      id: "photo-5",
      url: "/images/foto5.png",
      caption: "Kuma & pasukan kucing santai 🐱",
      date: "Perpustakaan UI",
      location: "Momen Santai",
      rotation: -1,
    },
    {
      id: "photo-6",
      url: "/images/foto6.png",
      caption: "Maskeran muka hijau seperti Hulk 🥑",
      date: "Rumah",
      location: "Selfie",
      rotation: 2.5,
    },
    {
      id: "photo-7",
      url: "/images/foto7.png",
      caption: "Makan Kimukatsu 🍱",
      date: "Margo City",
      location: "Mam Bareng",
      rotation: -1.5,
    },
    {
      id: "photo-8",
      url: "/images/foto8.png",
      caption: "Pepper Lunch yang mantap🍚✨",
      date: "Mam Bareng",
      location: "Margo City",
      rotation: 2,
    },
  ],
};

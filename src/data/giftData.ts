export interface GalleryPhoto {
  id: string;
  url: string;
  caption: string;
  date: string;
  location?: string;
  rotation?: number;
}

export interface LoveReason {
  id: number;
  title: string;
  description: string;
  highlight: string;
  photo?: string; // base64 or url – can be replaced manually by creator
}

export interface SpecialWish {
  id: string;
  sender: string;
  message: string;
  tag: string;
}

export interface BirthdayGiftConfig {
  partnerName: string;
  birthdayDate: string;
  heroGreeting: string;
  heroSubtext: string;
  loveLetter: string;
  photos: GalleryPhoto[];
  reasons: LoveReason[];
  wishes: SpecialWish[];
  customMusicName?: string;  // display name of the uploaded song
  customMusicData?: string;  // base64 audio data
  trollTitle: string;
  trollOption1: string;
  trollOption2: string;
  trollSubtitle?: string;
}

export const INITIAL_GIFT_DATA: BirthdayGiftConfig = {
  partnerName: "Keiko",
  birthdayDate: "17 Oktober",
  heroGreeting: "Selamat Ulang Tahun",
  heroSubtext:
    "Sebuah hal kecil yang dibuat khusus untuk merayakan hari istimewamu, dan menyampaikan doa terbaik.",
  trollTitle: "Pilih Yang Benar!",
  trollOption1: "Kuma Cantik",
  trollOption2: "Kuma Botak",
  trollSubtitle: "Sebelum membuka isi nya, Kuma harus pilih dulu:",
  loveLetter: `Selamat ulang tahun.

Di hari yang istimewa ini, aku hanya ingin menyampaikan betapa berartinya kehadiranmu dalam hidupku. Setiap momen bersamamu selalu menghadirkan ketenangan, senyuman hangat, dan rasa syukur yang luar biasa.

Terima kasih sudah menjadi sosok yang penyabar, penuh kasih, dan senantiasa melengkapi hari-hariku.

Semoga di usiamu yang baru ini, langkahmu senantiasa diliputi kebahagiaan, kesehatan, dan kemudahan dalam meraih setiap hal yang kamu cita-citakan. Aku akan selalu ada di sini untuk mendampingi dan mendukung perjalananmu.

Selamat ulang tahun, kesayanganku.`,
  photos: [
    {
      id: "photo-1",
      url: "/images/cake.png",
      caption: "Kue ulang tahun manis untuk merayakan hari bahagiamu",
      date: "17 Oktober",
      location: "Hari Spesial",
      rotation: -1.5,
    },
    {
      id: "photo-2",
      url: "/images/memory1.png",
      caption: "Momen indah kebersamaan di antara sudut taman favorit",
      date: "Kenangan Manis",
      location: "Taman Kenangan",
      rotation: 2,
    },
  ],
  reasons: [
    {
      id: 1,
      title: "Kehangatan Senyumanmu",
      description:
        "Caramu tersenyum selalu memberikan ketenangan dan mencerahkan hari yang paling melelahkan sekalipun.",
      highlight: "Ketulusan yang selalu menenangkan",
    },
    {
      id: 2,
      title: "Ketulusan Perhatianmu",
      description:
        "Perhatian kecil dan kesabaranmu dalam mendengarkan selalu membuatku merasa sangat dihargai.",
      highlight: "Pendengar terbaik dalam setiap cerita",
    },
    {
      id: 3,
      title: "Momen Sederhana Bersama",
      description:
        "Menghabiskan waktu bersama, berdiskusi santai, atau sekadar berbagi tawa adalah hal favoritku.",
      highlight: "Kebersamaan yang penuh kehangatan",
    },
    {
      id: 4,
      title: "Kedewasaan & Kesabaran",
      description:
        "Sikapmu yang senantiasa tenang dan bijaksana membawa kedamaian di setiap situasi.",
      highlight: "Pribadi yang menginspirasi",
    },
    {
      id: 5,
      title: "Semangat Mengejar Cita-Cita",
      description:
        "Gigih dan fokusmu dalam meraih impian selalu membuatku bangga dan ingin terus mendukungmu.",
      highlight: "Perjuangan yang selalu kubanggakan",
    },
    {
      id: 6,
      title: "Kehadiran yang Melengkapi",
      description:
        "Bersamamu, aku merasa menjadi pribadi yang lebih baik dan senantiasa bersyukur.",
      highlight: "Rumah bagi rasa nyaman",
    },
  ],
  wishes: [
    {
      id: "wish-1",
      sender: "Dengan Seluruh Kasih",
      message:
        "Semoga usiamu yang baru dilimpahi kebahagiaan sejati, kesehatan yang prima, dan kedamaian di setiap langkahmu.",
      tag: "Doa Utama",
    },
    {
      id: "wish-2",
      sender: "Pendamping Perjalananmu",
      message:
        "Semoga semua impian indah yang sedang kamu perjuangkan perlahan terwujud dengan hasil terbaik.",
      tag: "Harapan Indah",
    },
  ],
};

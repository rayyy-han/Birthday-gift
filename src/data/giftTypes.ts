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
  customMusicName?: string;
  customMusicData?: string;
  trollTitle?: string;
  trollOption1?: string;
  trollOption2?: string;
  trollSubtitle?: string;
  countdownTarget?: string;
}

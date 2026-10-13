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
  photo?: string;
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
  customMusicName?: string;
  customMusicData?: string;
}

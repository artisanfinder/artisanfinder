
export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
}

export interface Artisan extends User {
  craft: string;
  bio: string;
  rating: number;
  jobsCompleted: number;
  bannerUrl: string;
}

export interface Post {
  id: string;
  artisanId: string;
  imageUrl: string;
  caption: string;
  likes: number;
  comments: number;
}

export interface Chat {
  id: string;
  participants: string[]; // array of user uids
  lastMessage: string;
  timestamp: string;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  timestamp: string;
}

export type PageName = 'home' | 'messages' | 'settings' | 'chat' | 'artisanProfile';

export interface NavigationState {
  page: PageName;
  params?: any;
}

export interface SliderCardData {
    bgImage: string;
    thumbImage: string;
    title: string;
    description: string;
}

// Fix: Use Firebase v8 compat imports. The modular SDK v9+ requires '/compat' for the v8 API.
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";
import { User, Artisan, Post, Chat, Message, SliderCardData } from './types';

const firebaseConfig = {
  apiKey: "AIzaSyD64T2mgSR_K7KWvlMfsWAANIBUGJxYLQ0",
  authDomain: "rtisanfinder.firebaseapp.com",
  projectId: "rtisanfinder",
  storageBucket: "rtisanfinder.firebasestorage.app",
  messagingSenderId: "89697158609",
  appId: "1:89697158609:web:b7077528f694946b754cf0"
};

// Initialize Firebase
// Check if Firebase is already initialized to prevent errors on hot-reloads.
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const db = firebase.firestore();
export const storage = firebase.storage();
export const googleProvider = new firebase.auth.GoogleAuthProvider();


// --- MOCK DATA ---
// Use this data to simulate a backend for UI development.

export const mockUsers: User[] = [
    { uid: 'user1', email: 'user1@example.com', displayName: 'Alice', photoURL: 'https://picsum.photos/seed/user1/200/200' },
    { uid: 'artisan1', email: 'artisan1@example.com', displayName: 'John The Plumber', photoURL: 'https://picsum.photos/seed/artisan1/200/200' },
    { uid: 'artisan2', email: 'artisan2@example.com', displayName: 'Jane The Painter', photoURL: 'https://picsum.photos/seed/artisan2/200/200' },
    { uid: 'artisan3', email: 'artisan3@example.com', displayName: 'Bob The Builder', photoURL: 'https://picsum.photos/seed/artisan3/200/200' },
    { uid: 'artisan4', email: 'artisan4@example.com', displayName: 'Creative Designs Co.', photoURL: 'https://picsum.photos/seed/artisan4/200/200' },
    { uid: 'artisan5', email: 'artisan5@example.com', displayName: 'Lens Queen', photoURL: 'https://picsum.photos/seed/artisan5/200/200' },
];

export const mockArtisans: Artisan[] = [
    { uid: 'artisan1', email: 'artisan1@example.com', displayName: 'John The Plumber', photoURL: 'https://picsum.photos/seed/artisan1/200/200', craft: 'Plumbers', bio: '20 years of experience in residential and commercial plumbing. No job too big or small!', rating: 4.8, jobsCompleted: 132, bannerUrl: 'https://picsum.photos/seed/banner1/800/200' },
    { uid: 'artisan2', email: 'artisan2@example.com', displayName: 'Jane The Painter', photoURL: 'https://picsum.photos/seed/artisan2/200/200', craft: 'Painters', bio: 'Bringing color to your life, one wall at a time. Meticulous and clean work guaranteed.', rating: 4.9, jobsCompleted: 88, bannerUrl: 'https://picsum.photos/seed/banner2/800/200' },
    { uid: 'artisan3', email: 'artisan3@example.com', displayName: 'Bob The Builder', photoURL: 'https://picsum.photos/seed/artisan3/200/200', craft: 'Builders', bio: 'Expert in renovations, extensions, and new builds. Quality craftsmanship from the ground up.', rating: 4.7, jobsCompleted: 45, bannerUrl: 'https://picsum.photos/seed/banner3/800/200' },
    { uid: 'artisan4', email: 'artisan4@example.com', displayName: 'Creative Designs Co.', photoURL: 'https://picsum.photos/seed/artisan4/200/200', craft: 'Designers', bio: 'Modern and elegant design solutions for web and print.', rating: 5.0, jobsCompleted: 60, bannerUrl: 'https://picsum.photos/seed/banner4/800/200' },
    { uid: 'artisan5', email: 'artisan5@example.com', displayName: 'Lens Queen', photoURL: 'https://picsum.photos/seed/artisan5/200/200', craft: 'Photographers', bio: 'Capturing moments that last a lifetime. Specializing in portraits and events.', rating: 4.9, jobsCompleted: 150, bannerUrl: 'https://picsum.photos/seed/banner5/800/200' },
];

export const mockTrendingArtisans: Artisan[] = [...mockArtisans];

export const mockPosts: Post[] = [
    { id: 'post1', artisanId: 'artisan1', imageUrl: 'https://picsum.photos/seed/post1/600/400', caption: 'Just finished this beautiful bathroom renovation. Love the new fixtures!', likes: 120, comments: 15 },
    { id: 'post2', artisanId: 'artisan2', imageUrl: 'https://picsum.photos/seed/post2/600/400', caption: 'A splash of color can make all the difference. This living room is now so vibrant!', likes: 250, comments: 32 },
    { id: 'post3', artisanId: 'artisan1', imageUrl: 'https://picsum.photos/seed/post3/600/400', caption: 'Emergency pipe burst fixed! Happy to help my clients any time of day.', likes: 88, comments: 9 },
    { id: 'post4', artisanId: 'artisan3', imageUrl: 'https://picsum.photos/seed/post4/600/400', caption: 'The framework for the new extension is complete. On to the next phase!', likes: 150, comments: 20 },
];

export const mockChats: Chat[] = [
    { id: 'chat_user1_artisan1', participants: ['user1', 'artisan1'], lastMessage: 'Great, see you then!', timestamp: '10:45 AM' },
    { id: 'chat_user1_artisan2', participants: ['user1', 'artisan2'], lastMessage: 'Can you give me a quote?', timestamp: 'Yesterday' },
];

export const mockMessages: Message[] = [
    { id: 'msg1', chatId: 'chat_user1_artisan1', senderId: 'user1', text: 'Hi John, are you available tomorrow at 2 PM?', timestamp: '10:40 AM' },
    { id: 'msg2', chatId: 'chat_user1_artisan1', senderId: 'artisan1', text: 'Yes, that works for me.', timestamp: '10:42 AM' },
    { id: 'msg3', chatId: 'chat_user1_artisan1', senderId: 'user1', text: 'Great, see you then!', timestamp: '10:45 AM' },
    { id: 'msg4', chatId: 'chat_user1_artisan2', senderId: 'user1', text: 'Hi Jane, I love your work. Can you give me a quote for painting my bedroom?', timestamp: 'Yesterday' },
];

export const mockSliderData: SliderCardData[] = [
    {
        bgImage: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        thumbImage: "https://images.unsplash.com/photo-1558611848-73f7eb4001a1?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        title: "Plumbers",
        description: "Expert solutions for all your plumbing needs."
    },
    {
        bgImage: "https://images.unsplash.com/photo-1528605248644-effb84b242c7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        thumbImage: "https://images.unsplash.com/photo-1600180730761-1b984a3c1a3c?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        title: "Builders",
        description: "Quality craftsmanship from the ground up."
    },
    {
        bgImage: "https://images.unsplash.com/photo-1599696845611-6943bc61848f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        thumbImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        title: "Designers",
        description: "Creative tools that work like you do."
    },
    {
        bgImage: "https://images.unsplash.com/photo-1496302662116-35cc4f36df92?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        thumbImage: "https://images.unsplash.com/photo-1596495744483-c2a4f610159a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        title: "Painters",
        description: "Bringing color to your life, one wall at a time."
    },
    {
        bgImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        thumbImage: "https://images.unsplash.com/photo-1554080353-a576cf803bda?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        title: "Photographers",
        description: "From concept to cut, faster than ever before."
    }
];
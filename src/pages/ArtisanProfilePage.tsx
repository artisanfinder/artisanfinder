import React, { FC, useState, useEffect, Dispatch, SetStateAction } from 'react';
import { Artisan, Post, NavigationState } from '../types';
import { mockArtisans, mockPosts, mockUsers } from '../services';
import { useAuth } from '../contexts';
import { Icon } from '../components';

const ArtisanProfilePage: FC<{ params: any, setNavigation: Dispatch<SetStateAction<NavigationState>> }> = ({ params, setNavigation }) => {
    const { artisanId } = params;
    const { user } = useAuth();
    const [artisan, setArtisan] = useState<Artisan | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [currentPostIndex, setCurrentPostIndex] = useState(0);

    useEffect(() => {
        const foundArtisan = mockArtisans.find(a => a.uid === artisanId);
        if (foundArtisan) {
            setArtisan(foundArtisan);
            const artisanPosts = mockPosts.filter(p => p.artisanId === artisanId);
            setPosts(artisanPosts);
        }
    }, [artisanId]);

    if (!artisan) return <div className="flex items-center justify-center h-screen">Artisan not found.</div>;

    const isOwnProfile = user?.uid === artisanId;

    const nextPost = () => {
        setCurrentPostIndex(prev => (posts.length > 0 ? (prev + 1) % posts.length : 0));
    };

    const prevPost = () => {
        setCurrentPostIndex(prev => (posts.length > 0 ? (prev - 1 + posts.length) % posts.length : 0));
    };


    return (
        <div className="pb-24 md:pb-6">
            <div className="relative h-48 md:h-64 bg-gray-300 dark:bg-gray-700">
                <img src={artisan.bannerUrl} alt="banner" className="w-full h-full object-cover" />
                <div className="absolute -bottom-12 left-4 md:left-8">
                    <img src={artisan.photoURL} alt={artisan.displayName} className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg" />
                </div>
            </div>
            <div className="p-4 md:p-8 mt-14">
                <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-bold">{artisan.displayName}</h2>
                      <p className="text-secondary dark:text-accent font-semibold">{artisan.craft}</p>
                    </div>
                    {isOwnProfile ? (
                         <button className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold py-2 px-4 rounded-lg text-sm">Edit Profile</button>
                    ) : (
                         <button className="bg-primary text-white font-semibold py-2 px-4 rounded-lg text-sm" onClick={() => {
                            if (!user) {
                                setNavigation({ page: 'settings' });
                                return;
                            }
                            const recipient = mockUsers.find(u => u.uid === artisan.uid)!;
                            setNavigation({ page: 'chat', params: { chatId: `chat_${user?.uid}_${artisan.uid}`, recipient } })
                         }}>
                            Get in Touch
                        </button>
                    )}
                </div>
                <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-2xl">{artisan.bio}</p>
            </div>
             <div className="border-t dark:border-gray-700 mt-4 px-4 md:px-8 py-4">
                <h3 className="text-lg font-bold text-primary dark:text-secondary mb-4">Portfolio</h3>
                {posts.length > 0 ? (
                    <div className="relative w-full max-w-3xl mx-auto group">
                        <div className="relative overflow-hidden rounded-lg shadow-lg aspect-video bg-gray-200 dark:bg-gray-700">
                            <div
                                className="flex transition-transform duration-500 ease-in-out"
                                style={{ transform: `translateX(-${currentPostIndex * 100}%)` }}
                            >
                                {posts.map(post => (
                                    <div key={post.id} className="w-full flex-shrink-0">
                                        <img src={post.imageUrl} alt="Portfolio post" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {posts.length > 1 && (
                            <>
                                <button onClick={prevPost} className="absolute top-1/2 left-3 -translate-y-1/2 bg-black/30 text-white rounded-full p-2 hover:bg-black/50 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 z-10">
                                    <Icon name="chevronRight" className="w-6 h-6 transform rotate-180" />
                                </button>
                                <button onClick={nextPost} className="absolute top-1/2 right-3 -translate-y-1/2 bg-black/30 text-white rounded-full p-2 hover:bg-black/50 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 z-10">
                                    <Icon name="chevronRight" className="w-6 h-6" />
                                </button>
                            </>
                        )}

                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
                            {posts.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentPostIndex(index)}
                                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${currentPostIndex === index ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'}`}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400 mt-4">This artisan hasn't added any portfolio items yet.</p>
                )}
            </div>
        </div>
    );
};

export default ArtisanProfilePage;
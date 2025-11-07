import React, { FC, Dispatch, SetStateAction } from 'react';
import { Post, NavigationState } from '../types';
import { Icon } from './Icon';

export const PostCard: FC<{ post: Post, setNavigation: Dispatch<SetStateAction<NavigationState>> }> = ({ post, setNavigation }) => {
    // In a real app, artisan data would be fetched or joined
    const artisan = { displayName: 'John The Plumber', photoURL: 'https://picsum.photos/seed/artisan1/50/50', uid: 'artisan1' };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="p-3 flex items-center space-x-3">
                <img onClick={() => setNavigation({ page: 'artisanProfile', params: { artisanId: artisan.uid } })} src={artisan.photoURL} alt={artisan.displayName} className="w-10 h-10 rounded-full object-cover cursor-pointer"/>
                <div>
                    <p onClick={() => setNavigation({ page: 'artisanProfile', params: { artisanId: artisan.uid } })} className="font-bold cursor-pointer">{artisan.displayName}</p>
                </div>
            </div>
            <img src={post.imageUrl} alt="post" className="w-full h-auto" />
            <div className="p-3">
                <p className="text-gray-700 dark:text-gray-300">{post.caption}</p>
                <div className="flex justify-between items-center mt-3 text-gray-500 dark:text-gray-400">
                    <div className="flex space-x-4">
                        <button className="flex items-center space-x-1 hover:text-red-500"><Icon name="heart" className="w-6 h-6"/><span className="text-sm">{post.likes}</span></button>
                        <button className="flex items-center space-x-1 hover:text-secondary"><Icon name="comment" className="w-6 h-6"/><span className="text-sm">{post.comments}</span></button>
                    </div>
                     <button className="bg-secondary text-white font-semibold py-2 px-4 rounded-lg text-sm" onClick={() => setNavigation({ page: 'chat', params: { chatId: `chat_${"currentUser"}_${post.artisanId}`, recipient: artisan } })}>Get in touch</button>
                </div>
            </div>
        </div>
    );
};

export default PostCard;
import React, { FC, Dispatch, SetStateAction } from 'react';
import { Artisan, NavigationState } from '../types';
import { Icon } from './Icon';

export const ArtisanCard: FC<{ artisan: Artisan, setNavigation: Dispatch<SetStateAction<NavigationState>> }> = ({ artisan, setNavigation }) => {
    return (
        <div onClick={() => setNavigation({ page: 'artisanProfile', params: { artisanId: artisan.uid }})} className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 space-y-2 cursor-pointer transition-transform hover:scale-105">
            <div className="relative h-32 rounded-lg overflow-hidden">
                 <img src={artisan.bannerUrl} alt={artisan.displayName} className="w-full h-full object-cover"/>
                 <img src={artisan.photoURL} alt={artisan.displayName} className="absolute bottom-2 left-2 w-12 h-12 rounded-full object-cover border-2 border-white dark:border-gray-800"/>
            </div>
            <div>
                 <h3 className="font-bold text-lg truncate">{artisan.displayName}</h3>
                 <p className="text-secondary dark:text-accent text-sm font-semibold">{artisan.craft}</p>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 pt-2">
                <div className="flex items-center space-x-1">
                    <Icon name="star" className="w-4 h-4 text-accent"/>
                    <span>{artisan.rating.toFixed(1)}</span>
                </div>
                <span>{artisan.jobsCompleted} jobs done</span>
            </div>
        </div>
    );
};

export default ArtisanCard;
import React, { FC } from 'react';
import { ICONS } from '../constants';

export const Icon: FC<{ name: string; className?: string }> = ({ name, className }) => {
    const iconName = name === 'menu' ? (
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    ) : name === 'close' ? (
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    ) : ICONS[name];

    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className || "w-6 h-6"}>
            {iconName}
        </svg>
    );
};

export default Icon;
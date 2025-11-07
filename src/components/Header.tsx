import React, { FC, useState, Dispatch, SetStateAction } from 'react';
import { NavigationState, PageName } from '../types';
import { useAuth } from '../contexts';
import { Icon } from './Icon';

export const Header: FC<{ activePage: PageName; setNavigation: Dispatch<SetStateAction<NavigationState>>; messageCount: number; handleSearchNavClick: () => void; }> = ({ activePage, setNavigation, messageCount, handleSearchNavClick }) => {
    const { user } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navItems = [
        { name: 'home', icon: 'home', label: 'Home' },
        { name: 'search', icon: 'search', label: 'Search' },
        { name: 'messages', icon: 'messages', label: 'Messages' },
        { name: 'settings', icon: 'settings', label: 'Profile' },
    ];

    const NavLink: FC<{item: any, isMobile?: boolean}> = ({ item, isMobile = false }) => {
        const isActive = activePage === item.name;
        const isProfile = item.name === 'settings' && user;

        const clickHandler = () => {
            if (item.name === 'search') {
                handleSearchNavClick();
            } else {
                setNavigation({ page: item.name as PageName });
            }
            setIsMenuOpen(false);
        };

        const finalLabel = isProfile ? user?.displayName : item.label;

        const mobileClasses = "w-full flex items-center space-x-4 p-4 text-lg text-gray-200 hover:bg-gray-700";
        const desktopClasses = `flex flex-col sm:flex-row items-center sm:space-x-2 p-1 sm:p-2 rounded-lg transition-colors ${isActive ? 'text-primary dark:text-secondary font-bold' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`;

        return (
            <button key={item.name} onClick={clickHandler} className={isMobile ? mobileClasses : desktopClasses}>
                 {isProfile && user ? (
                    <img src={user.photoURL} alt="profile" className="w-8 h-8 rounded-full object-cover" />
                ) : (
                    <div className="relative">
                        <Icon name={item.icon} className="w-7 h-7" />
                        {item.name === 'messages' && messageCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">{messageCount}</span>
                        )}
                    </div>
                )}
                <span className={`text-xs sm:text-sm font-medium ${isMobile ? 'text-lg' : ''}`}>{finalLabel}</span>
            </button>
        )
    };

    return (
        <header className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b dark:border-gray-700 shadow-sm z-30">
            <div className="container mx-auto flex justify-between items-center p-2 md:px-4">
                <div
                    className="flex items-center space-x-3 cursor-pointer"
                    onClick={() => setNavigation({ page: 'home' })}
                >
                     <div className="logo-container">
                        <div className="cube">
                            <div className="cube-face cube-face-front"><Icon name="artisanEmblem" className="w-5 h-5" /></div>
                            <div className="cube-face cube-face-back"><Icon name="artisanEmblem" className="w-5 h-5" /></div>
                            <div className="cube-face cube-face-right"><Icon name="artisanEmblem" className="w-5 h-5" /></div>
                            <div className="cube-face cube-face-left"><Icon name="artisanEmblem" className="w-5 h-5" /></div>
                            <div className="cube-face cube-face-top"><Icon name="artisanEmblem" className="w-5 h-5" /></div>
                            <div className="cube-face cube-face-bottom"><Icon name="artisanEmblem" className="w-5 h-5" /></div>
                        </div>
                    </div>
                    <div>
                        <h1 className="text-lg md:text-xl font-bold text-primary dark:text-secondary whitespace-nowrap">Artisan Finder</h1>
                    </div>
                </div>

                <nav className="hidden md:flex items-center space-x-1 sm:space-x-2">
                    {navItems.map((item) => <NavLink key={item.name} item={item} />)}
                </nav>

                <div className="md:hidden">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
                        <Icon name={isMenuOpen ? 'close' : 'menu'} className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {isMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-gray-800 shadow-lg">
                    <nav className="flex flex-col items-start p-2">
                        {user && (
                            <div className="w-full flex items-center space-x-4 p-4 text-lg text-gray-200">
                                <img src={user.photoURL} alt="profile" className="w-10 h-10 rounded-full object-cover" />
                                <span>{user.displayName}</span>
                            </div>
                        )}
                        {navItems.filter(item => item.name !== 'settings').map((item) => <NavLink key={item.name} item={item} isMobile={true} />)}
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;

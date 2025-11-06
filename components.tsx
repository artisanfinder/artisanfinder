import React, { FC, SetStateAction, Dispatch, useState, useRef, useEffect, useCallback } from 'react';
import { Artisan, Post, NavigationState, PageName, SliderCardData } from './types';
import { useAuth } from './App';
import { ICONS } from './constants';
import { auth, googleProvider } from './services';

// Icon Component
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


// AuthForm Component
export const AuthForm: FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleGoogleSignIn = async () => {
        try {
            await auth.signInWithPopup(googleProvider);
            onSuccess();
        } catch (err) {
            setError((err as Error).message);
        }
    };
    
    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            if (isLogin) {
                await auth.signInWithEmailAndPassword(email, password);
            } else {
                await auth.createUserWithEmailAndPassword(email, password);
            }
            onSuccess();
        } catch (err) {
            setError((err as Error).message);
        }
    };

    return (
        <div className="p-6 space-y-4">
            <h2 className="text-2xl font-bold text-center text-primary dark:text-secondary">{isLogin ? 'Login' : 'Sign Up'}</h2>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <form onSubmit={handleEmailAuth} className="space-y-4">
                 <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
                 <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
                 <button type="submit" className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-opacity-90 transition-colors">
                    {isLogin ? 'Login' : 'Sign Up'}
                 </button>
            </form>
            <div className="relative text-center">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300 dark:border-gray-600"></div></div>
                <div className="relative inline-block px-2 bg-white dark:bg-gray-800 text-sm text-gray-500 dark:text-gray-400">OR</div>
            </div>
            <button onClick={handleGoogleSignIn} className="w-full flex items-center justify-center space-x-2 border dark:border-gray-600 py-3 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">{ICONS.google}</svg>
                <span>Sign in with Google</span>
            </button>
            <p className="text-center text-sm">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button onClick={() => setIsLogin(!isLogin)} className="font-semibold text-secondary dark:text-accent hover:underline">
                    {isLogin ? 'Sign Up' : 'Login'}
                </button>
            </p>
        </div>
    );
};

// Header Component
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
        
        const finalLabel = isProfile ? 'Profile' : item.label;
        
        const mobileClasses = "w-full flex items-center space-x-4 p-4 text-lg text-gray-200 hover:bg-gray-700";
        const desktopClasses = `flex flex-col sm:flex-row items-center sm:space-x-2 p-1 sm:p-2 rounded-lg transition-colors ${isActive ? 'text-primary dark:text-secondary font-bold' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`;

        return (
            <button key={item.name} onClick={clickHandler} className={isMobile ? mobileClasses : desktopClasses}>
                 {isProfile ? (
                    <img src={user.photoURL} alt="profile" className="w-8 h-8 rounded-full object-cover" />
                ) : (
                    <div className="relative">
                        <Icon name={item.icon} className="w-7 h-7" />
                        {item.name === 'messages' && messageCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">{messageCount}</span>
                        )}
                    </div>
                )}
                <span className={isMobile ? "" : "text-xs sm:text-sm font-medium"}>{finalLabel}</span>
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
                         {navItems.map((item) => <NavLink key={item.name} item={item} isMobile={true} />)}
                    </nav>
                </div>
            )}
        </header>
    );
};

// PostCard Component
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

// ArtisanCard Component
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

// CategoryPill Component
export const CategoryPill: FC<{ category: string }> = ({ category }) => {
    return (
        <button className="flex-shrink-0 bg-secondary/20 text-secondary dark:bg-accent/20 dark:text-accent font-semibold py-2 px-5 rounded-full hover:bg-secondary/30 dark:hover:bg-accent/30 transition-colors">
            {category}
        </button>
    );
};

// Modal Component
export const Modal: FC<{ children: React.ReactNode; onClose: () => void; }> = ({ children, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
};

// ToggleSwitch Component
export const ToggleSwitch: FC<{ checked: boolean; onChange: () => void; }> = ({ checked, onChange }) => {
    return (
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
        <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-secondary"></div>
      </label>
    );
};

// ProductivitySlider Component
export const ProductivitySlider: FC<{ sliderData: SliderCardData[], onCategoryClick: (category: string) => void }> = ({ sliderData, onCategoryClick }) => {
    const trackRef = useRef<HTMLDivElement>(null);
    const [current, setCurrent] = useState(0);
    const intervalRef = useRef<number | null>(null);

    const isMobile = useCallback(() => window.matchMedia("(max-width:767px)").matches, []);

    const center = useCallback((i: number) => {
        const track = trackRef.current;
        if (!track || !track.parentElement) return;
        const card = track.children[i] as HTMLElement;
        if (!card) return;

        const isMobileView = isMobile();
        const axis = isMobileView ? "top" : "left";
        const size = isMobileView ? "clientHeight" : "clientWidth";
        const start = isMobileView ? card.offsetTop : card.offsetLeft;

        const scrollPosition = isMobileView 
            ? start 
            : start - (track.parentElement[size] / 2 - card[size] / 2);

        track.parentElement.scrollTo({
            [axis]: scrollPosition,
            behavior: "smooth"
        });
    }, [isMobile]);

    const activate = useCallback((i: number, scroll: boolean) => {
        setCurrent(i);
        if (scroll) center(i);
    }, [center]);

    const go = useCallback((step: number) => {
        const newIndex = (current + step + sliderData.length) % sliderData.length;
        activate(newIndex, true);
    }, [current, activate, sliderData.length]);
    
    const startAutoScroll = useCallback(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = window.setInterval(() => {
            go(1);
        }, 5000);
    }, [go]);

    const stopAutoScroll = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
    };

    useEffect(() => {
        startAutoScroll();
        return () => stopAutoScroll();
    }, [startAutoScroll]);

    useEffect(() => {
        center(current);
        const handleResize = () => center(current);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [current, center]);

    return (
        <section 
            className="slider-section"
            onMouseEnter={stopAutoScroll}
            onMouseLeave={startAutoScroll}
        >
            <div className="slider-container">
                <div className="slider-track" ref={trackRef}>
                    {sliderData.map((card, i) => (
                        <article 
                            key={i} 
                            className="project-card" 
                            data-active={i === current ? true : undefined}
                            onClick={() => activate(i, true)}
                        >
                            <img className="project-card__bg" src={card.bgImage} alt="" />
                            <div className="project-card__content">
                                <img className="project-card__thumb" src={card.thumbImage} alt="" />
                                <div>
                                    <h3 className="project-card__title">{card.title}</h3>
                                    <p className="project-card__desc">{card.description}</p>
                                    <button className="project-card__btn" onClick={(e) => { e.stopPropagation(); onCategoryClick(card.title); }}>View all {card.title}</button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>

            <div className="slider-dots">
                {sliderData.map((_, i) => (
                    <span 
                        key={i} 
                        className={`slider-dot ${i === current ? 'active' : ''}`}
                        onClick={() => activate(i, true)}
                    />
                ))}
            </div>
        </section>
    );
};
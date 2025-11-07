import React, { useState, useEffect, useRef, FC, Dispatch, SetStateAction } from 'react';
import { Artisan, NavigationState } from '../types';
import { ArtisanCard, ProductivitySlider } from '../components';
import { mockTrendingArtisans, mockArtisans, mockSliderData } from '../services';
import { Icon } from '../components';

const HomePage: FC<{ setNavigation: Dispatch<SetStateAction<NavigationState>>, animateSearch: boolean, onAnimationComplete: () => void }> = ({ setNavigation, animateSearch, onAnimationComplete }) => {
  const [trendingArtisans, setTrendingArtisans] = useState<Artisan[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Artisan[]>([]);
  const [gridArtisans, setGridArtisans] = useState<Artisan[]>([]);
  const [gridTitle, setGridTitle] = useState('Trending Artisans');

  const animationWrapperRef = useRef<HTMLDivElement>(null);
  const searchWrapperRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTrendingArtisans(mockTrendingArtisans);
    setGridArtisans(mockTrendingArtisans);
  }, []);

  useEffect(() => {
    if (!animateSearch || !animationWrapperRef.current) return;
    const el = animationWrapperRef.current;
    el.classList.add('search-falling');
    const handleAnimationEnd = () => {
        el.classList.remove('search-falling');
        onAnimationComplete();
    };
    el.addEventListener('animationend', handleAnimationEnd, { once: true });
    return () => el.removeEventListener('animationend', handleAnimationEnd);
  }, [animateSearch, onAnimationComplete]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (searchWrapperRef.current && !searchWrapperRef.current.contains(event.target as Node)) {
            setSearchResults([]);
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === '') {
        setSearchResults([]);
    } else {
        const results = mockArtisans.filter(artisan =>
            artisan.displayName.toLowerCase().includes(query.toLowerCase()) ||
            artisan.craft.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(results);
    }
  };

  const handleCategoryClick = (category: string) => {
    setSearchQuery('');
    setSearchResults([]);
    const results = mockArtisans.filter(artisan =>
        artisan.craft.toLowerCase() === category.toLowerCase()
    );
    setGridArtisans(results);
    setGridTitle(`Showing all ${category}`);
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleResultClick = (artisanId: string) => {
    setNavigation({ page: 'artisanProfile', params: { artisanId } });
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <div className="p-4 md:p-6 pb-24 md:pb-6 space-y-8">
       <div ref={animationWrapperRef}>
         <div ref={searchWrapperRef} className="relative max-w-lg mx-auto">
           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
             <Icon name="search" className="h-5 w-5 text-gray-400" />
           </div>
           <input
             placeholder="Search by name or craft..."
             className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
             type="text"
             value={searchQuery}
             onChange={handleSearchChange}
             onFocus={handleSearchChange}
           />
           {searchQuery.trim() && (
             <div className="absolute mt-1 w-full rounded-md bg-white dark:bg-gray-800 shadow-lg z-10">
                 {searchResults.length > 0 ? (
                     searchResults.map(artisan => (
                         <div
                             key={artisan.uid}
                             className="search-result-item"
                             onClick={() => handleResultClick(artisan.uid)}
                         >
                            <img src={artisan.photoURL} alt={artisan.displayName} />
                            <div className="search-result-item__info">
                                <p className="name">{artisan.displayName}</p>
                                <p className="craft">{artisan.craft}</p>
                            </div>
                         </div>
                     ))
                 ) : (
                     <p className="p-4 text-center text-gray-500 dark:text-gray-400">No artisans found.</p>
                 )}
             </div>
           )}
         </div>
       </div>

      <ProductivitySlider sliderData={mockSliderData} onCategoryClick={handleCategoryClick} />

      <div ref={resultsRef} className="pt-4">
        <h2 className="text-2xl font-bold text-primary dark:text-secondary mb-4">{gridTitle}</h2>
        {gridArtisans.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {gridArtisans.map(artisan => <ArtisanCard key={artisan.uid} artisan={artisan} setNavigation={setNavigation} />)}
            </div>
        ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 mt-8">No artisans found for this category.</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;

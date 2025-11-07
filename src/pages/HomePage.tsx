import React, { useState, useEffect, useRef, FC, Dispatch, SetStateAction } from 'react';
import { Artisan, NavigationState } from '../types';
import { ArtisanCard, ProductivitySlider } from '../components';
import { mockTrendingArtisans, mockArtisans, mockSliderData } from '../services';

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

  const ekgPath = "M-5 50 H 30 L 35 40 L 45 60 L 50 50 H 80 L 85 45 L 90 55 L 95 50 H 150";

  return (
    <div className="p-4 md:p-6 pb-24 md:pb-6 space-y-6">
       <div ref={animationWrapperRef}>
         <div ref={searchWrapperRef} className="ai-input-wrapper">
           <div className="ai-input-container">
             <input
               placeholder="Search by name or craft..."
               className="ai-input"
               type="text"
               value={searchQuery}
               onChange={handleSearchChange}
               onFocus={handleSearchChange}
             />
           </div>

           {searchQuery.trim() && (
             <div className="search-results-dropdown">
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

      <div className="flex items-center justify-center my-4 px-4">
        <div className="ekg-line-container">
          <svg className="ekg-line" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d={ekgPath} />
          </svg>
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-primary dark:text-secondary mx-4 text-center whitespace-nowrap">
          Discover skilled professionals
        </h2>
        <div className="ekg-line-container ekg-line-container--right">
          <svg className="ekg-line" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d={ekgPath} />
          </svg>
        </div>
      </div>

      <ProductivitySlider sliderData={mockSliderData} onCategoryClick={handleCategoryClick} />

      <div ref={resultsRef} className="pt-4">
        <h2 className="text-xl font-bold text-primary dark:text-secondary mb-3">{gridTitle}</h2>
        {gridArtisans.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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

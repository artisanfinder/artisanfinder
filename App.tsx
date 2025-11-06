import React, { useState, useEffect, createContext, useContext, useCallback, useRef, FC, SetStateAction, Dispatch } from 'react';
import { User, Artisan, Post, Chat, Message, NavigationState } from './types';
import { ICONS } from './constants';
import { AuthForm, Header, PostCard, ArtisanCard, CategoryPill, Modal, Icon, ToggleSwitch, ProductivitySlider } from './components';
import { auth, db, storage, googleProvider, mockTrendingArtisans, mockPosts, mockChats, mockMessages, mockArtisans, mockUsers, mockSliderData } from './services';

// --- THEME CONTEXT ---
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}
const ThemeContext = createContext<ThemeContextType | null>(null);
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error("useTheme must be used within a ThemeProvider");
    return context;
};

const ThemeProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
    });

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove(theme === 'light' ? 'dark' : 'light');
        root.classList.add(theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};


// --- AUTH CONTEXT ---
interface AuthContextType {
  user: User | null;
  artisanProfile: Artisan | null;
  loading: boolean;
}
const AuthContext = createContext<AuthContextType>({ user: null, artisanProfile: null, loading: true });
export const useAuth = () => useContext(AuthContext);

const AuthProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [artisanProfile, setArtisanProfile] = useState<Artisan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
        if (firebaseUser) {
            const userDoc = await db.collection("users").doc(firebaseUser.uid).get();
            if (userDoc.exists) {
                const userData = userDoc.data() as User;
                setUser(userData);
                const artisanDoc = await db.collection("artisans").doc(firebaseUser.uid).get();
                if (artisanDoc.exists) {
                    setArtisanProfile(artisanDoc.data() as Artisan);
                } else {
                    setArtisanProfile(null);
                }
            } else {
                const newUser: User = { uid: firebaseUser.uid, email: firebaseUser.email!, displayName: firebaseUser.displayName!, photoURL: firebaseUser.photoURL! };
                await db.collection("users").doc(firebaseUser.uid).set(newUser);
                setUser(newUser);
                setArtisanProfile(null);
            }
        } else {
            setUser(null);
            setArtisanProfile(null);
        }
        setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, artisanProfile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};


// --- PAGES ---

// HomePage
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

  const categories = ["Plumbers", "Builders", "Lawn Mowers", "Washers", "Hair Dressers", "Photographers", "Drivers"];
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

      <div>
        <h2 className="text-xl font-bold text-primary dark:text-secondary mb-3">Categories</h2>
        <div className="flex flex-wrap gap-3">
          {categories.map(cat => <CategoryPill key={cat} category={cat} />)}
        </div>
      </div>
    </div>
  );
};

// DiscoverPage
const DiscoverPage: FC<{ setNavigation: Dispatch<SetStateAction<NavigationState>> }> = ({ setNavigation }) => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    setPosts(mockPosts);
  }, []);

  return (
    <div className="p-4 md:p-6 pb-24 md:pb-6">
       <h2 className="text-2xl font-bold text-primary dark:text-secondary text-center mb-6">Discover</h2>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {posts.map(post => <PostCard key={post.id} post={post} setNavigation={setNavigation} />)}
       </div>
    </div>
  );
};

// MessagesPage
const MessagesPage: FC<{ setNavigation: Dispatch<SetStateAction<NavigationState>> }> = ({ setNavigation }) => {
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);

  useEffect(() => {
    if (!user) return;
    const userChats = mockChats.filter(chat => chat.participants.includes(user.uid));
    setChats(userChats);
  }, [user]);
  
  const getOtherParticipant = (chat: Chat) => {
      const otherId = chat.participants.find(p => p !== user?.uid)!;
      return mockUsers.find(u => u.uid === otherId)!;
  };

  if (!user) return <div className="flex items-center justify-center h-full p-8 text-center">Please log in to see your messages.</div>;

  return (
    <div className="pb-24 md:pb-0 h-full flex flex-col">
      <div className="bg-primary text-white p-4 text-center text-xl font-bold shadow-md sticky top-0 md:relative">Messages</div>
      <div className="divide-y dark:divide-gray-700 flex-1 overflow-y-auto">
        {chats.map(chat => {
            const otherUser = getOtherParticipant(chat);
            return (
                <div key={chat.id} className="p-4 flex items-center space-x-4 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer" onClick={() => setNavigation({ page: 'chat', params: { chatId: chat.id, recipient: otherUser } })}>
                    <img src={otherUser.photoURL} alt={otherUser.displayName} className="w-12 h-12 rounded-full object-cover" />
                    <div className="flex-1">
                        <p className="font-bold">{otherUser.displayName}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{chat.lastMessage}</p>
                    </div>
                     <span className="text-xs text-gray-400 dark:text-gray-500">{chat.timestamp}</span>
                </div>
            )
        })}
      </div>
    </div>
  );
};

// ChatPage
const ChatPage: FC<{ params: any, setNavigation: Dispatch<SetStateAction<NavigationState>> }> = ({ params, setNavigation }) => {
    const { chatId, recipient } = params;
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const chatMessages = mockMessages.filter(m => m.chatId === chatId);
        setMessages(chatMessages);
    }, [chatId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = () => {
        if (!newMessage.trim() || !user) return;
        const message: Message = {
            id: `msg${Date.now()}`,
            chatId,
            senderId: user.uid,
            text: newMessage,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, message]);
        setNewMessage("");
    };

    return (
        <div className="flex flex-col h-screen max-h-screen">
            <header className="bg-white dark:bg-gray-800 p-3 flex items-center space-x-3 shadow-md fixed top-0 w-full z-10 md:relative">
                <button onClick={() => setNavigation({ page: 'messages' })} className="md:hidden"><Icon name="back" className="w-6 h-6 text-primary dark:text-secondary" /></button>
                <img src={recipient.photoURL} alt={recipient.displayName} className="w-10 h-10 rounded-full object-cover" />
                <h2 className="font-bold text-lg">{recipient.displayName}</h2>
            </header>
            <main className="flex-1 overflow-y-auto pt-20 pb-20 bg-gray-100 dark:bg-gray-900 p-4 space-y-4 md:pt-4">
                {messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.senderId === user?.uid ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${msg.senderId === user?.uid ? 'bg-secondary text-white rounded-br-none' : 'bg-white dark:bg-gray-700 rounded-bl-none'}`}>
                            <p>{msg.text}</p>
                            <span className="text-xs float-right mt-1 opacity-70">{msg.timestamp}</span>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </main>
            <footer className="bg-white dark:bg-gray-800 p-2 fixed bottom-0 w-full flex items-center space-x-2 shadow-inner md:relative">
                <input 
                    type="text" 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type a message..." 
                    className="flex-1 p-3 bg-gray-100 dark:bg-gray-700 dark:text-white rounded-full focus:outline-none"
                />
                <button onClick={handleSendMessage} className="bg-primary text-white p-3 rounded-full">
                    <Icon name="send" className="w-6 h-6"/>
                </button>
            </footer>
        </div>
    );
};

// ArtisanProfilePage
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


// SettingsPage
const SettingsPage: FC<{ setNavigation: Dispatch<SetStateAction<NavigationState>> }> = ({ setNavigation }) => {
  const { user, artisanProfile, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showArtisanModal, setShowArtisanModal] = useState(false);
  const [artisanFormData, setArtisanFormData] = useState({ craft: '', bio: '' });

  const handleSignOut = async () => {
      await auth.signOut();
      setNavigation({ page: 'home' });
  };
  
  const handleBecomeArtisan = async () => {
    if (!user || !artisanFormData.craft || !artisanFormData.bio) return;
    const newArtisanProfile: Artisan = {
        ...user,
        ...artisanFormData,
        bannerUrl: 'https://picsum.photos/800/200',
        jobsCompleted: 0,
        rating: 0,
    };
    mockArtisans.push(newArtisanProfile);
    setShowArtisanModal(false);
    alert("Congratulations! You are now an artisan.");
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-6 pb-24 md:pb-6 space-y-6 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-primary dark:text-secondary">Settings</h2>
      {user ? (
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <img src={user.photoURL} alt="profile" className="w-16 h-16 rounded-full object-cover" />
            <div>
              <p className="font-bold text-lg">{user.displayName}</p>
              <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
            </div>
          </div>
           <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow flex justify-between items-center">
              <span className="font-semibold">Dark Mode</span>
              <ToggleSwitch checked={theme === 'dark'} onChange={toggleTheme} />
           </div>
          {!artisanProfile && (
            <button onClick={() => setShowArtisanModal(true)} className="w-full text-left p-4 bg-white dark:bg-gray-800 rounded-lg shadow flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700">
              <span>Become an Artisan</span>
              <Icon name="chevronRight" className="w-5 h-5"/>
            </button>
          )}
           <button onClick={handleSignOut} className="w-full text-left p-4 bg-white dark:bg-gray-800 rounded-lg shadow flex justify-between items-center text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10">
            <span>Logout</span>
            <Icon name="logout" className="w-5 h-5"/>
          </button>
        </div>
      ) : (
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">Join Artisan Finder</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Log in or create an account to connect with skilled professionals.</p>
            <button onClick={() => setShowAuthModal(true)} className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-opacity-90 transition-colors">
                Login / Sign Up
            </button>
        </div>
      )}
      
      {showAuthModal && (
          <Modal onClose={() => setShowAuthModal(false)}>
              <AuthForm onSuccess={() => setShowAuthModal(false)} />
          </Modal>
      )}

      {showArtisanModal && (
          <Modal onClose={() => setShowArtisanModal(false)}>
              <div className="p-4 space-y-4">
                <h3 className="text-xl font-bold text-center text-primary dark:text-secondary">Create Your Artisan Profile</h3>
                 <input type="text" placeholder="Your Craft (e.g., Plumber, Photographer)" className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={artisanFormData.craft} onChange={e => setArtisanFormData({...artisanFormData, craft: e.target.value})} />
                 <textarea placeholder="Tell us about yourself and your skills..." rows={4} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={artisanFormData.bio} onChange={e => setArtisanFormData({...artisanFormData, bio: e.target.value})}></textarea>
                 <button onClick={handleBecomeArtisan} className="w-full bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90">Create Profile</button>
              </div>
          </Modal>
      )}
    </div>
  );
};

// --- APP ---
const App: React.FC = () => {
    const [navigation, setNavigation] = useState<NavigationState>({ page: 'home' });
    const [animateSearch, setAnimateSearch] = useState(false);
    const messageCount = 5; 

    const handleSearchNavClick = () => {
      setNavigation({ page: 'home' });
      setAnimateSearch(true);
    };

    const renderPage = () => {
        switch (navigation.page) {
            case 'home': return <HomePage setNavigation={setNavigation} animateSearch={animateSearch} onAnimationComplete={() => setAnimateSearch(false)} />;
            case 'messages': return <MessagesPage setNavigation={setNavigation} />;
            case 'chat': return <ChatPage params={navigation.params} setNavigation={setNavigation} />;
            case 'settings': return <SettingsPage setNavigation={setNavigation} />;
            case 'artisanProfile': return <ArtisanProfilePage params={navigation.params} setNavigation={setNavigation} />;
            default: return <HomePage setNavigation={setNavigation} animateSearch={animateSearch} onAnimationComplete={() => setAnimateSearch(false)} />;
        }
    };

    const isChatPage = navigation.page === 'chat';
    const mainContentClasses = isChatPage ? 'w-full' : 'w-full pt-20';

    return (
      <ThemeProvider>
        <AuthProvider>
          <div className="font-sans antialiased text-gray-800 dark:text-gray-200 bg-light dark:bg-gray-900 min-h-screen">
              <div className="relative">
                   {!isChatPage && (
                      <Header
                          activePage={navigation.page}
                          setNavigation={setNavigation}
                          messageCount={messageCount}
                          handleSearchNavClick={handleSearchNavClick}
                      />
                   )}
                   <main key={navigation.page} className={`${mainContentClasses} page-container`}>
                       {renderPage()}
                   </main>
              </div>
          </div>
        </AuthProvider>
      </ThemeProvider>
    );
};

export default App;
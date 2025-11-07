import React, { useState, FC } from 'react';
import { NavigationState } from './types';
import { AuthProvider, ThemeProvider, useAuth } from './contexts';
import { Header } from './components';
import HomePage from './pages/HomePage';
import MessagesPage from './pages/MessagesPage';
import ChatPage from './pages/ChatPage';
import SettingsPage from './pages/SettingsPage';
import ArtisanProfilePage from './pages/ArtisanProfilePage';
import LoginPage from './pages/LoginPage';

const MainApp: FC = () => {
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
    );
}

const App: FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AuthChecker />
      </AuthProvider>
    </ThemeProvider>
  );
};

const AuthChecker: FC = () => {
  const { user } = useAuth();
  return user ? <MainApp /> : <LoginPage />;
}

export default App;

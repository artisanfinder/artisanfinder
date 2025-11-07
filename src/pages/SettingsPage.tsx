import React, { FC, useState, Dispatch, SetStateAction } from 'react';
import { Artisan, NavigationState } from '../types';
import { auth, mockArtisans } from '../services';
import { useAuth, useTheme } from '../contexts';
import { AuthForm, Modal, ToggleSwitch, Icon } from '../components';

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

export default SettingsPage;
import React, { FC, useState } from 'react';
import { auth, googleProvider } from '../services';
import { ICONS } from '../constants';

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

export default AuthForm;
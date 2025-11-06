import { createContext, FC, useContext, useState, useEffect } from 'react';
import { User, Artisan } from '../types';
import { auth, db } from '../services';

interface AuthContextType {
  user: User | null;
  artisanProfile: Artisan | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, artisanProfile: null, loading: true });

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
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

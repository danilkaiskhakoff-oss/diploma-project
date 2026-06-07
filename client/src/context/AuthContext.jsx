import { createContext, useContext, useState, useEffect } from 'react';
import { auth, isFirebaseConfigured } from '../firebase/config';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  signInAnonymously,
  linkWithCredential,
  EmailAuthProvider
} from 'firebase/auth';

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setUser({
        type: 'anonymous',
        id: 'no_firebase_' + Date.now(),
        displayName: 'Гость'
      });
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          type: firebaseUser.isAnonymous ? 'anonymous' : 'registered',
          id: firebaseUser.uid,
          displayName: firebaseUser.displayName || (firebaseUser.isAnonymous ? 'Гость' : 'Пользователь'),
          email: firebaseUser.email || null,
          firebaseUser
        });
      } else {
        // No user — sign in anonymously
        try {
          const result = await signInAnonymously(auth);
          setUser({
            type: 'anonymous',
            id: result.user.uid,
            displayName: 'Гость',
            email: null,
            firebaseUser: result.user
          });
        } catch (error) {
          console.error('Anonymous sign in failed:', error);
          setUser({
            type: 'anonymous',
            id: 'fallback_' + Date.now(),
            displayName: 'Гость'
          });
        }
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const loginAsGuest = async () => {
    if (isFirebaseConfigured && auth) {
      await signOut(auth);
      const result = await signInAnonymously(auth);
      setUser({
        type: 'anonymous',
        id: result.user.uid,
        displayName: 'Гость',
        email: null,
        firebaseUser: result.user
      });
    }
  };

  const login = async (email, password) => {
    if (!isFirebaseConfigured || !auth) {
      throw new Error('Firebase не настроен');
    }
    const result = await signInWithEmailAndPassword(auth, email, password);
    setUser({
      type: 'registered',
      id: result.user.uid,
      displayName: result.user.displayName || 'Пользователь',
      email: result.user.email,
      firebaseUser: result.user
    });
    return result;
  };

  const register = async (displayName, email, password) => {
    if (!isFirebaseConfigured || !auth) {
      throw new Error('Firebase не настроен');
    }

    // If currently anonymous, link the account to preserve progress
    if (user?.type === 'anonymous' && user?.firebaseUser) {
      const credential = EmailAuthProvider.credential(email, password);
      const result = await linkWithCredential(user.firebaseUser, credential);
      await updateProfile(result.user, { displayName });
      setUser({
        type: 'registered',
        id: result.user.uid,
        displayName,
        email,
        firebaseUser: result.user
      });
      return result;
    }

    // Otherwise create new account
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName });
    setUser({
      type: 'registered',
      id: result.user.uid,
      displayName,
      email,
      firebaseUser: result.user
    });
    return result;
  };

  const logout = async () => {
    if (isFirebaseConfigured && auth) {
      await signOut(auth);
      // After signOut, onAuthStateChanged will trigger anonymous sign in
    } else {
      setUser({
        type: 'anonymous',
        id: 'no_firebase_' + Date.now(),
        displayName: 'Гость'
      });
    }
  };

  const updateDisplayName = async (newName) => {
    if (user?.firebaseUser) {
      await updateProfile(user.firebaseUser, { displayName: newName });
      setUser(prev => ({ ...prev, displayName: newName }));
    } else {
      setUser(prev => ({ ...prev, displayName: newName }));
    }
  };

  const value = {
    user,
    loading,
    isAnonymous: user?.type === 'anonymous',
    isRegistered: user?.type === 'registered',
    loginAsGuest,
    login,
    register,
    logout,
    updateDisplayName
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

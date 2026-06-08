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
  EmailAuthProvider,
  sendEmailVerification,
  sendPasswordResetEmail
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
          emailVerified: firebaseUser.emailVerified || false,
          firebaseUser
        });
        setLoading(false);
      } else {
        // No user — sign in anonymously (don't set loading=true to avoid unmounting the app)
        try {
          const result = await signInAnonymously(auth);
          setUser({
            type: 'anonymous',
            id: result.user.uid,
            displayName: 'Гость',
            email: null,
            emailVerified: false,
            firebaseUser: result.user
          });
        } catch (error) {
          console.error('Anonymous sign in failed:', error);
          setUser({
            type: 'anonymous',
            id: 'fallback_' + Date.now(),
            displayName: 'Гость',
            email: null,
            emailVerified: false,
            firebaseUser: null
          });
        }
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const loginAsGuest = async () => {
    if (isFirebaseConfigured && auth) {
      // onAuthStateChanged handles the anonymous sign-in automatically after signOut
      await signOut(auth);
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
    if (!user) return;
    if (user.firebaseUser) {
      await updateProfile(user.firebaseUser, { displayName: newName });
    }
    setUser(prev => (prev ? { ...prev, displayName: newName } : prev));
  };

  const resendVerification = async () => {
    if (!user?.firebaseUser) throw new Error('Пользователь не авторизован');
    if (user.emailVerified) throw new Error('Email уже подтверждён');
    await sendEmailVerification(user.firebaseUser);
  };

  const resetPassword = async (email) => {
    if (!isFirebaseConfigured || !auth) throw new Error('Firebase не настроен');
    await sendPasswordResetEmail(auth, email);
  };

  const value = {
    user,
    loading,
    isAnonymous: user?.type === 'anonymous',
    isRegistered: user?.type === 'registered',
    emailVerified: user?.emailVerified || false,
    loginAsGuest,
    login,
    register,
    logout,
    updateDisplayName,
    resendVerification,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

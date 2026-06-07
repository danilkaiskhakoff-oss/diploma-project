import { createContext, useContext, useState, useEffect } from 'react';
import { auth, isFirebaseConfigured } from '../firebase/config';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const guestId = localStorage.getItem('cyberedu_guest_id');
    const guestName = localStorage.getItem('cyberedu_guest_name');

    if (guestId) {
      setUser({
        type: 'guest',
        id: guestId,
        displayName: guestName || 'Гость'
      });
      setLoading(false);
      return;
    }

    if (!isFirebaseConfigured || !auth) {
      const newGuestId = 'guest_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('cyberedu_guest_id', newGuestId);
      setUser({ type: 'guest', id: newGuestId, displayName: 'Гость' });
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        localStorage.removeItem('cyberedu_guest_id');
        localStorage.removeItem('cyberedu_guest_name');
        setUser({
          type: 'registered',
          id: firebaseUser.uid,
          displayName: firebaseUser.displayName || 'Пользователь',
          email: firebaseUser.email,
          firebaseUser
        });
      } else {
        const newGuestId = 'guest_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('cyberedu_guest_id', newGuestId);
        setUser({ type: 'guest', id: newGuestId, displayName: 'Гость' });
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const loginAsGuest = () => {
    const guestId = 'guest_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('cyberedu_guest_id', guestId);
    setUser({ type: 'guest', id: guestId, displayName: 'Гость' });
  };

  const login = async (email, password) => {
    if (!isFirebaseConfigured || !auth) {
      throw new Error('Firebase не настроен');
    }
    const result = await signInWithEmailAndPassword(auth, email, password);
    localStorage.removeItem('cyberedu_guest_id');
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
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName });
    localStorage.removeItem('cyberedu_guest_id');
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
    if (user?.type === 'registered' && isFirebaseConfigured && auth) {
      await signOut(auth);
    }
    localStorage.removeItem('cyberedu_guest_id');
    localStorage.removeItem('cyberedu_guest_name');
    const newGuestId = 'guest_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('cyberedu_guest_id', newGuestId);
    setUser({ type: 'guest', id: newGuestId, displayName: 'Гость' });
  };

  const updateDisplayName = async (newName) => {
    if (user?.type === 'registered' && user?.firebaseUser) {
      await updateProfile(user.firebaseUser, { displayName: newName });
      setUser(prev => ({ ...prev, displayName: newName }));
    } else if (user?.type === 'guest') {
      localStorage.setItem('cyberedu_guest_name', newName);
      setUser(prev => ({ ...prev, displayName: newName }));
    }
  };

  const value = {
    user,
    loading,
    isGuest: user?.type === 'guest',
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

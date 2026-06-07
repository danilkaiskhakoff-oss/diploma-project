import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, isFirebaseConfigured } from './firebase/config';
import { AuthProvider, useAuth } from './context/AuthContext';
import LevelSelect from './components/LevelSelect';
import Map3D from './components/Map3D';
import AdminPanel from './components/admin/AdminPanel';
import ProfilePage from './components/ProfilePage';
import AuthModal from './components/AuthModal';

function AppContent() {
  const { user, isRegistered } = useAuth();
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [isAdminRoute, setIsAdminRoute] = useState(false);
  const [isProfileRoute, setIsProfileRoute] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login');

  useEffect(() => {
    const path = window.location.pathname;
    setIsAdminRoute(path === '/admin');
    setIsProfileRoute(path === '/profile');

    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        setIsAdmin(!!firebaseUser);
        setChecking(false);
      });
      return unsubscribe;
    } else {
      setChecking(false);
    }
  }, []);

  const handleReset = () => {
    setSelectedLevel(null);
    window.history.pushState({}, '', '/');
  };

  const handleNavigate = (path) => {
    window.history.pushState({}, '', path);
    setIsAdminRoute(path === '/admin');
    setIsProfileRoute(path === '/profile');
  };

  const handleOpenAuth = (tab = 'login') => {
    setAuthModalTab(tab);
    setShowAuthModal(true);
  };

  // Admin panel
  if (isAdminRoute) {
    if (checking) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-950">
          <div className="text-gray-400">Загрузка...</div>
        </div>
      );
    }
    return (
      <>
        <AdminPanel isLoggedIn={isAdmin} />
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} initialTab={authModalTab} />
      </>
    );
  }

  // Profile page — only for registered users
  if (isProfileRoute) {
    if (!isRegistered) {
      window.history.pushState({}, '', '/');
      return <LevelSelect onSelectLevel={setSelectedLevel} onOpenAuth={handleOpenAuth} user={user} />;
    }
    return (
      <>
        <ProfilePage />
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} initialTab={authModalTab} />
      </>
    );
  }

  // Main app
  if (!selectedLevel) {
    return (
      <>
        <LevelSelect onSelectLevel={setSelectedLevel} onOpenAuth={handleOpenAuth} user={user} />
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} initialTab={authModalTab} />
      </>
    );
  }

  return (
    <>
      <Map3D
        level={selectedLevel}
        onReset={handleReset}
        user={user}
        onOpenAuth={handleOpenAuth}
      />
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} initialTab={authModalTab} />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

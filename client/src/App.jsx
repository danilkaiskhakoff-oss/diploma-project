import { useState, useEffect, lazy, Suspense } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, isFirebaseConfigured } from './firebase/config';
import { AuthProvider, useAuth } from './context/AuthContext';
import LevelSelect from './components/LevelSelect';
import AuthModal from './components/AuthModal';

const Map3D = lazy(() => import('./components/Map3D'));
const AdminPanel = lazy(() => import('./components/admin/AdminPanel'));
const ProfilePage = lazy(() => import('./components/ProfilePage'));

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
    const checkRoute = () => {
      const path = window.location.pathname;
      setIsAdminRoute(path === '/admin');
      setIsProfileRoute(path === '/profile');
    };

    checkRoute();
    window.addEventListener('popstate', checkRoute);

    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        let admin = false;
        if (firebaseUser && !firebaseUser.isAnonymous) {
          // Check against configured admin email
          const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
          if (firebaseUser.email === adminEmail) {
            admin = true;
          } else {
            // Also try checking custom claims
            try {
              const token = await firebaseUser.getIdTokenResult();
              admin = token.claims.admin === true;
            } catch (e) {
              // fallback to email check only
            }
          }
        }
        setIsAdmin(admin);
        setChecking(false);
      });
      return () => { unsubscribe(); window.removeEventListener('popstate', checkRoute); };
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

  const fallback = <div className="min-h-screen flex items-center justify-center bg-gray-950"><div className="text-gray-400">Загрузка...</div></div>;

  // Admin panel
  if (isAdminRoute) {
    if (checking) return fallback;
    return (
      <Suspense fallback={fallback}>
        <AdminPanel isLoggedIn={isAdmin} />
        <AuthModal key={authModalTab} isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} initialTab={authModalTab} />
      </Suspense>
    );
  }

  // Profile page — only for registered users
  if (isProfileRoute) {
    if (!isRegistered) {
      window.history.pushState({}, '', '/');
      return <LevelSelect onSelectLevel={setSelectedLevel} onOpenAuth={handleOpenAuth} onNavigate={handleNavigate} user={user} />;
    }
    return (
      <Suspense fallback={fallback}>
        <ProfilePage onNavigate={handleNavigate} />
        <AuthModal key={authModalTab} isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} initialTab={authModalTab} />
      </Suspense>
    );
  }

  // Main app
  if (!selectedLevel) {
    return (
      <>
        <LevelSelect onSelectLevel={setSelectedLevel} onOpenAuth={handleOpenAuth} onNavigate={handleNavigate} user={user} />
        <AuthModal key={authModalTab} isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} initialTab={authModalTab} />
      </>
    );
  }

  return (
    <Suspense fallback={fallback}>
      <Map3D
        level={selectedLevel}
        onReset={handleReset}
        user={user}
        onOpenAuth={handleOpenAuth}
      />
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} initialTab={authModalTab} />
    </Suspense>
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

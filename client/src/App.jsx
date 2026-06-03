import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, isFirebaseConfigured } from './firebase/config';
import LevelSelect from './components/LevelSelect';
import Map3D from './components/Map3D';
import AdminPanel from './components/admin/AdminPanel';

function App() {
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [isAdminRoute, setIsAdminRoute] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Check if on admin route
    setIsAdminRoute(window.location.pathname === '/admin');

    // Listen for auth state changes only if Firebase is configured
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setIsAdmin(!!user);
        setChecking(false);
      });
      return unsubscribe;
    } else {
      setChecking(false);
    }
  }, []);

  const handleReset = () => {
    setSelectedLevel(null);
  };

  // Show admin panel if on /admin route
  if (isAdminRoute) {
    if (checking) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-950">
          <div className="text-gray-400">Загрузка...</div>
        </div>
      );
    }
    return <AdminPanel isLoggedIn={isAdmin} />;
  }

  // Main app
  if (!selectedLevel) {
    return <LevelSelect onSelectLevel={setSelectedLevel} />;
  }

  return <Map3D level={selectedLevel} onReset={handleReset} />;
}

export default App;

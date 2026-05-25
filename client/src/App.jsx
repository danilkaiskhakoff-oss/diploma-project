import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import SubjectPage from './pages/SubjectPage';
import CoursePage from './pages/CoursePage';
import SubjectStats from './pages/SubjectStats';

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={user ? <Navigate to="/dashboard" /> : <Auth onLogin={handleLogin} />} />
        <Route path="/dashboard" element={user ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/auth" />} />
        <Route path="/subject/:id" element={user ? <SubjectPage user={user} /> : <Navigate to="/auth" />} />
        <Route path="/subject/:id/stats" element={user?.role === 'teacher' ? <SubjectStats user={user} /> : <Navigate to="/auth" />} />
        <Route path="/course/:id" element={user ? <CoursePage user={user} /> : <Navigate to="/auth" />} />
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/auth"} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

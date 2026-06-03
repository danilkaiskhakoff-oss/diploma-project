import { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/config';
import AdminLogin from './AdminLogin';
import AdminSidebar from './AdminSidebar';
import AdminDashboard from './AdminDashboard';
import QuizList from './quizzes/QuizList';
import QuizEditor from './quizzes/QuizEditor';
import ThemeEditor from './ui-config/ThemeEditor';

function AdminPanel({ isLoggedIn }) {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.reload();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleSelectQuiz = (quizId) => {
    setSelectedQuiz(quizId);
    setActiveSection('quiz-editor');
  };

  const handleBackToQuizzes = () => {
    setSelectedQuiz(null);
    setActiveSection('quizzes');
  };

  if (!isLoggedIn) {
    return <AdminLogin onLogin={() => window.location.reload()} />;
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'quizzes':
        return <QuizList onSelectQuiz={handleSelectQuiz} />;
      case 'quiz-editor':
        return <QuizEditor quizId={selectedQuiz} onBack={handleBackToQuizzes} />;
      case 'ui-config':
        return <ThemeEditor />;
      case 'levels':
        return (
          <div className="p-8">
            <h2 className="text-3xl font-bold text-white mb-4">Уровни</h2>
            <p className="text-gray-400">Редактирование уровней скоро будет доступно</p>
          </div>
        );
      case 'briefings':
        return (
          <div className="p-8">
            <h2 className="text-3xl font-bold text-white mb-4">Брифинги</h2>
            <p className="text-gray-400">Редактирование брифингов скоро будет доступно</p>
          </div>
        );
      case 'simulations':
        return (
          <div className="p-8">
            <h2 className="text-3xl font-bold text-white mb-4">Симуляции</h2>
            <p className="text-gray-400">Редактирование симуляций скоро будет доступно</p>
          </div>
        );
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-950">
      <AdminSidebar
        activeSection={activeSection === 'quiz-editor' ? 'quizzes' : activeSection}
        onNavigate={(section) => {
          setActiveSection(section);
          setSelectedQuiz(null);
        }}
        onLogout={handleLogout}
      />
      <div className="flex-1 overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
}

export default AdminPanel;

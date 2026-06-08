import { useState, lazy, Suspense } from 'react';
import { signOut } from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../../firebase/config';
import AdminLogin from './AdminLogin';
import AdminSidebar from './AdminSidebar';

const AdminDashboard = lazy(() => import('./AdminDashboard'));
const QuizList = lazy(() => import('./quizzes/QuizList'));
const QuizEditor = lazy(() => import('./quizzes/QuizEditor'));
const ThemeEditor = lazy(() => import('./ui-config/ThemeEditor'));
const LevelList = lazy(() => import('./levels/LevelList'));
const LevelEditor = lazy(() => import('./levels/LevelEditor'));
const BriefingList = lazy(() => import('./briefings/BriefingList'));
const BriefingEditor = lazy(() => import('./briefings/BriefingEditor'));
const SimulationList = lazy(() => import('./simulations/SimulationList'));
const UserList = lazy(() => import('./users/UserList'));

function SectionFallback() {
  return (
    <div className="flex items-center justify-center h-64 text-gray-400 text-lg">
      Загрузка...
    </div>
  );
}

function AdminPanel({ isLoggedIn }) {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedBriefing, setSelectedBriefing] = useState(null);

  const handleLogout = async () => {
    try {
      if (auth) {
        await signOut(auth);
      }
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

  const handleSelectLevel = (levelId) => {
    setSelectedLevel(levelId);
    setActiveSection('level-editor');
  };

  const handleBackToLevels = () => {
    setSelectedLevel(null);
    setActiveSection('levels');
  };

  const handleSelectBriefing = (briefingId) => {
    setSelectedBriefing(briefingId);
    setActiveSection('briefing-editor');
  };

  const handleBackToBriefings = () => {
    setSelectedBriefing(null);
    setActiveSection('briefings');
  };

  const handleNavigateToLevelFromSim = (levelId) => {
    setSelectedLevel(levelId);
    setActiveSection('level-editor');
  };

  if (!isLoggedIn) {
    return <AdminLogin onLogin={() => window.location.reload()} />;
  }

  if (!isFirebaseConfigured) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-950">
        <div className="text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-4">Firebase не настроен</h2>
          <p className="text-gray-400 mb-6">
            Для работы админ-панели необходимо настроить Firebase.<br/>
            См. инструкцию в ADMIN_SETUP.md
          </p>
          <a
            href="/"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Вернуться на сайт
          </a>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    const section = (() => {
      switch (activeSection) {
        case 'dashboard': return <AdminDashboard onNavigate={(section) => setActiveSection(section)} />;
        case 'quizzes': return <QuizList onSelectQuiz={handleSelectQuiz} />;
        case 'quiz-editor': return <QuizEditor quizId={selectedQuiz} onBack={handleBackToQuizzes} />;
        case 'ui-config': return <ThemeEditor />;
        case 'levels': return <LevelList onSelectLevel={handleSelectLevel} />;
        case 'level-editor': return <LevelEditor levelId={selectedLevel} onBack={handleBackToLevels} />;
        case 'briefings': return <BriefingList onSelectBriefing={handleSelectBriefing} />;
        case 'briefing-editor': return <BriefingEditor briefingId={selectedBriefing} onBack={handleBackToBriefings} />;
        case 'simulations': return <SimulationList onNavigateToLevel={handleNavigateToLevelFromSim} />;
        case 'users': return <UserList />;
        default: return <AdminDashboard />;
      }
    })();
    return <Suspense fallback={<SectionFallback />}>{section}</Suspense>;
  };

  return (
    <div className="flex h-screen bg-gray-950">
      <AdminSidebar
        activeSection={
          activeSection === 'quiz-editor'
            ? 'quizzes'
            : activeSection === 'level-editor'
            ? 'levels'
            : activeSection === 'briefing-editor'
            ? 'briefings'
            : activeSection
        }
        onNavigate={(section) => {
          setActiveSection(section);
          setSelectedQuiz(null);
          setSelectedLevel(null);
          setSelectedBriefing(null);
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

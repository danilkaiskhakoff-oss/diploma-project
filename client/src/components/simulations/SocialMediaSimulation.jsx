import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BrowserWindow from './BrowserWindow';
import VKInterface from './VKInterface';
import SocialMediaQuiz from './SocialMediaQuiz';

function SocialMediaSimulation({ simulation, onComplete }) {
  const [bootPhase, setBootPhase] = useState('black');
  const [browserOpen, setBrowserOpen] = useState(false);
  const [currentStage, setCurrentStage] = useState('profile-audit');
  const [isShuttingDown, setIsShuttingDown] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // User choices
  const [privacySettings, setPrivacySettings] = useState({});
  const [friendDecisions, setFriendDecisions] = useState({});
  const [messageResponses, setMessageResponses] = useState({});
  const [photoFindings, setPhotoFindings] = useState({});

  useEffect(() => {
    const timer1 = setTimeout(() => setBootPhase('logo'), 500);
    const timer2 = setTimeout(() => setBootPhase('welcome'), 2000);
    const timer3 = setTimeout(() => setBootPhase('desktop'), 3500);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const handleShutdown = () => {
    setIsShuttingDown(true);
    setTimeout(() => onComplete(), 2500);
  };

  const handleStageComplete = (stage, data) => {
    switch (stage) {
      case 'profile-audit':
        setPrivacySettings(data);
        break;
      case 'friend-requests':
        setFriendDecisions(data);
        break;
      case 'messages':
        setMessageResponses(data);
        break;
      case 'photo-analysis':
        setPhotoFindings(data);
        break;
      case 'hack-scenario':
        setShowQuiz(true);
        return;
      default:
        break;
    }

    // Move to next stage
    const stages = ['profile-audit', 'friend-requests', 'messages', 'photo-analysis', 'hack-scenario'];
    const currentIndex = stages.indexOf(stage);
    if (currentIndex < stages.length - 1) {
      setCurrentStage(stages[currentIndex + 1]);
    }
  };

  const handleQuizComplete = (score) => {
    setQuizScore(score);
    handleShutdown();
  };

  // Calculate total score
  const calculateScore = () => {
    let total = 0;
    let max = 0;

    // Privacy settings (25 points)
    const privacyCount = Object.values(privacySettings).filter(v => v).length;
    total += (privacyCount / 5) * 25;
    max += 25;

    // Friend decisions (25 points)
    const friendCount = Object.values(friendDecisions).filter(v => v).length;
    total += (friendCount / 4) * 25;
    max += 25;

    // Message responses (25 points)
    const messageCount = Object.values(messageResponses).filter(v => v).length;
    total += (messageCount / 3) * 25;
    max += 25;

    // Photo findings (25 points)
    const photoCount = Object.values(photoFindings).filter(v => v).length;
    total += (photoCount / 4) * 25;
    max += 25;

    // Quiz (20 points)
    total += (quizScore / 4) * 20;
    max += 20;

    return { total: Math.round(total), max };
  };

  // Boot animation
  if (isShuttingDown) {
    const { total, max } = calculateScore();
    const percentage = Math.round((total / max) * 100);

    return (
      <div className="relative w-full h-full overflow-hidden bg-gradient-to-b from-[#1a3a5c] to-[#0a1628]">
        <motion.div className="flex flex-col items-center justify-center h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {/* Results */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mb-8"
          >
            <div className="text-6xl mb-4">{percentage >= 70 ? '🎉' : '📚'}</div>
            <h2 className="text-3xl font-bold text-white mb-2">
              {percentage >= 90 ? 'Отличная защита!' : percentage >= 70 ? 'Хорошая защита!' : 'Есть над чем работать'}
            </h2>
            <p className="text-xl text-gray-300">
              Результат: {total}/{max} ({percentage}%)
            </p>
          </motion.div>

          {/* Score Breakdown */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1 }}
            className="bg-white/10 rounded-lg p-6 mb-8 max-w-md"
          >
            <h3 className="text-lg font-medium text-white mb-4">Детали:</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex justify-between">
                <span>Приватность профиля</span>
                <span>{Math.round((Object.values(privacySettings).filter(v => v).length / 5) * 25)}/25</span>
              </div>
              <div className="flex justify-between">
                <span>Анализ заявок</span>
                <span>{Math.round((Object.values(friendDecisions).filter(v => v).length / 4) * 25)}/25</span>
              </div>
              <div className="flex justify-between">
                <span>Сообщения</span>
                <span>{Math.round((Object.values(messageResponses).filter(v => v).length / 3) * 25)}/25</span>
              </div>
              <div className="flex justify-between">
                <span>Анализ фото</span>
                <span>{Math.round((Object.values(photoFindings).filter(v => v).length / 4) * 25)}/25</span>
              </div>
              <div className="flex justify-between">
                <span>Квиз</span>
                <span>{Math.round((quizScore / 4) * 20)}/20</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="text-white text-xl font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            Завершение работы...
          </motion.div>
          <div className="flex gap-2 justify-center mt-4">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-3 rounded-full bg-white"
                animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      <AnimatePresence mode="wait">
        {bootPhase === 'black' && (
          <motion.div
            key="black"
            className="absolute inset-0 bg-black"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        )}

        {bootPhase === 'logo' && (
          <motion.div
            key="logo"
            className="absolute inset-0 bg-black flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="text-6xl mb-4">🖥️</div>
              <motion.div
                className="text-white text-2xl font-light"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Windows 7
              </motion.div>
            </motion.div>
          </motion.div>
        )}

        {bootPhase === 'welcome' && (
          <motion.div
            key="welcome"
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <div className="text-white text-3xl font-light mb-4">Добро пожаловать</div>
              <motion.div
                className="flex gap-2 justify-center"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-3 h-3 rounded-full bg-white" />
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        )}

        {bootPhase === 'desktop' && (
          <motion.div
            key="desktop"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Desktop Background */}
            <div
              className="w-full h-full relative"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              }}
            >
              {/* Desktop Icons */}
              <div className="absolute top-8 left-8 space-y-6">
                {/* Chrome Browser Icon */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setBrowserOpen(true)}
                  className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-white/10 transition"
                >
                  <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center shadow-lg">
                    <div className="w-10 h-10 rounded-full" style={{
                      background: 'conic-gradient(from 0deg, #ea4335 0deg 90deg, #fbbc05 90deg 180deg, #34a853 180deg 270deg, #4285f4 270deg 360deg)'
                    }} />
                  </div>
                  <span className="text-white text-sm font-medium drop-shadow-lg">Google Chrome</span>
                </motion.button>

                {/* VK Icon */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setBrowserOpen(true)}
                  className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-white/10 transition"
                >
                  <div className="w-16 h-16 rounded-xl flex items-center justify-center shadow-lg" style={{ background: '#4a76a8' }}>
                    <span className="text-white text-2xl font-bold">VK</span>
                  </div>
                  <span className="text-white text-sm font-medium drop-shadow-lg">ВКонтакте</span>
                </motion.button>
              </div>

              {/* Taskbar */}
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-black/80 backdrop-blur-sm flex items-center px-4">
                <button className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition">
                  Пуск
                </button>
                <div className="flex-1" />
                <div className="text-white text-sm">
                  {new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>

            {/* Browser Window */}
            <AnimatePresence>
              {browserOpen && (
                <motion.div
                  key="browser"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-4 z-10"
                >
                  <BrowserWindow url="https://vk.com" onClose={() => setBrowserOpen(false)}>
                    {showQuiz ? (
                      <SocialMediaQuiz onComplete={handleQuizComplete} />
                    ) : (
                      <VKInterface
                        currentStage={currentStage}
                        onStageComplete={handleStageComplete}
                        privacySettings={privacySettings}
                        friendDecisions={friendDecisions}
                        messageResponses={messageResponses}
                        photoFindings={photoFindings}
                      />
                    )}
                  </BrowserWindow>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SocialMediaSimulation;
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AttackTimeline from './AttackTimeline';
import ReconStage from './ReconStage';
import PhishingStage from './PhishingStage';
import InstallationStage from './InstallationStage';
import ExfiltrationStage from './ExfiltrationStage';
import ResponseStage from './ResponseStage';
import CyberBasicsQuiz from './CyberBasicsQuiz';

function CyberBasicsSimulation({ simulation, onComplete }) {
  const [bootPhase, setBootPhase] = useState('black');
  const [panelOpen, setPanelOpen] = useState(false);
  const [currentStage, setCurrentStage] = useState('recon');
  const [isShuttingDown, setIsShuttingDown] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // Stage scores
  const [stageScores, setStageScores] = useState({
    recon: { score: 0, max: 0 },
    phishing: { score: 0, max: 0 },
    installation: { score: 0, max: 0 },
    exfiltration: { score: 0, max: 0 },
    response: { score: 0, max: 0 }
  });

  // Completed stages
  const [completedStages, setCompletedStages] = useState({});

  // Threat level
  const [threatLevel, setThreatLevel] = useState(0);

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

  // Update threat level based on completed stages
  useEffect(() => {
    const completedCount = Object.keys(completedStages).length;
    setThreatLevel(Math.min(100, completedCount * 20));
  }, [completedStages]);

  const handleShutdown = () => {
    setIsShuttingDown(true);
    setTimeout(() => onComplete(), 2500);
  };

  const handleStageComplete = (stage, result) => {
    setStageScores(prev => ({
      ...prev,
      [stage]: result
    }));
    setCompletedStages(prev => ({
      ...prev,
      [stage]: true
    }));

    // Move to next stage
    const stages = ['recon', 'phishing', 'installation', 'exfiltration', 'response'];
    const currentIndex = stages.indexOf(stage);
    if (currentIndex < stages.length - 1) {
      setCurrentStage(stages[currentIndex + 1]);
    } else {
      setShowQuiz(true);
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

    Object.values(stageScores).forEach(stage => {
      total += stage.score;
      max += stage.max;
    });

    // Quiz (20 points)
    total += (quizScore / 4) * 20;
    max += 20;

    return { total: Math.round(total), max };
  };

  // Play alarm sound
  const playAlarmSound = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 440;
      osc.type = 'square';
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.5);
      setTimeout(() => ctx.close(), 600);
    } catch (e) {}
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
            <div className="text-6xl mb-4">{percentage >= 70 ? '🛡️' : '⚠️'}</div>
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
                <span>Разведка</span>
                <span>{stageScores.recon.score}/{stageScores.recon.max}</span>
              </div>
              <div className="flex justify-between">
                <span>Фишинг</span>
                <span>{stageScores.phishing.score}/{stageScores.phishing.max}</span>
              </div>
              <div className="flex justify-between">
                <span>Установка</span>
                <span>{stageScores.installation.score}/{stageScores.installation.max}</span>
              </div>
              <div className="flex justify-between">
                <span>Кража данных</span>
                <span>{stageScores.exfiltration.score}/{stageScores.exfiltration.max}</span>
              </div>
              <div className="flex justify-between">
                <span>Реагирование</span>
                <span>{stageScores.response.score}/{stageScores.response.max}</span>
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
                {/* Security Panel Icon */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setPanelOpen(true);
                    playAlarmSound();
                  }}
                  className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-white/10 transition"
                >
                  <div className="w-16 h-16 rounded-xl bg-red-600 flex items-center justify-center shadow-lg">
                    <span className="text-white text-3xl">🛡️</span>
                  </div>
                  <span className="text-white text-sm font-medium drop-shadow-lg">Панель безопасности</span>
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

            {/* Security Panel */}
            <AnimatePresence>
              {panelOpen && (
                <motion.div
                  key="panel"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-4 z-10 flex flex-col"
                >
                  {/* Panel Header */}
                  <div className="bg-gray-900 rounded-t-lg p-4 border border-red-500/30 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🛡️</span>
                      <div>
                        <h1 className="text-xl font-bold text-white">Панель управления безопасностью</h1>
                        <p className="text-sm text-gray-400">Компания "TechCorp" под атакой!</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setPanelOpen(false)}
                      className="px-3 py-1 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Attack Timeline */}
                  <AttackTimeline
                    currentStep={currentStage}
                    completedSteps={completedStages}
                    threatLevel={threatLevel}
                  />

                  {/* Stage Content */}
                  <div className="flex-1 overflow-y-auto bg-gray-900 rounded-b-lg p-4">
                    <AnimatePresence mode="wait">
                      {currentStage === 'recon' && (
                        <motion.div
                          key="recon"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                        >
                          <ReconStage
                            onComplete={(result) => handleStageComplete('recon', result)}
                          />
                        </motion.div>
                      )}

                      {currentStage === 'phishing' && (
                        <motion.div
                          key="phishing"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                        >
                          <PhishingStage
                            onComplete={(result) => handleStageComplete('phishing', result)}
                          />
                        </motion.div>
                      )}

                      {currentStage === 'installation' && (
                        <motion.div
                          key="installation"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                        >
                          <InstallationStage
                            onComplete={(result) => handleStageComplete('installation', result)}
                          />
                        </motion.div>
                      )}

                      {currentStage === 'exfiltration' && (
                        <motion.div
                          key="exfiltration"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                        >
                          <ExfiltrationStage
                            onComplete={(result) => handleStageComplete('exfiltration', result)}
                          />
                        </motion.div>
                      )}

                      {currentStage === 'response' && (
                        <motion.div
                          key="response"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                        >
                          <ResponseStage
                            onComplete={(result) => handleStageComplete('response', result)}
                          />
                        </motion.div>
                      )}

                      {showQuiz && (
                        <motion.div
                          key="quiz"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                        >
                          <CyberBasicsQuiz onComplete={handleQuizComplete} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CyberBasicsSimulation;
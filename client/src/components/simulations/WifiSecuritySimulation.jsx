import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RouterSetup from './RouterSetup';
import EvilTwinAttack from './EvilTwinAttack';
import TrafficSniffing from './TrafficSniffing';

function WifiSecuritySimulation({ simulation, onComplete }) {
  const [bootPhase, setBootPhase] = useState('black');
  const [routerOpen, setRouterOpen] = useState(false);
  const [currentStage, setCurrentStage] = useState('setup');
  const [isShuttingDown, setIsShuttingDown] = useState(false);

  // Stage scores
  const [stageScores, setStageScores] = useState({
    setup: { score: 0, max: 0 },
    evilTwin: { score: 0, max: 0 },
    sniffing: { score: 0, max: 0 }
  });

  // User choices
  const [routerConfig, setRouterConfig] = useState({});

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
    let stageScore = 0, stageMax = 0;
    Object.values(stageScores).forEach(s => { stageScore += s.score; stageMax += s.max; });
    setTimeout(() => onComplete({ stageScore, stageMax }), 2500);
  };

  const handleStageComplete = (stage, result) => {
    setStageScores(prev => ({
      ...prev,
      [stage]: result
    }));

    if (stage === 'setup') {
      setRouterConfig(result.config);
    }
    if (stage === 'evilTwin') {
      // result.choice stored implicitly via routerConfig/scores
    }

    const stages = ['setup', 'evilTwin', 'sniffing'];
    const currentIndex = stages.indexOf(stage);
    if (currentIndex < stages.length - 1) {
      setCurrentStage(stages[currentIndex + 1]);
    } else {
      handleShutdown();
    }
  };

  // Calculate total score
  const calculateScore = () => {
    let total = 0;
    let max = 0;
    Object.values(stageScores).forEach(stage => {
      total += stage.score;
      max += stage.max;
    });
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
            <div className="text-6xl mb-4">{percentage >= 70 ? '📶' : '️'}</div>
            <h2 className="text-3xl font-bold text-white mb-2">
              {percentage >= 90 ? 'Сеть защищена!' : percentage >= 70 ? 'Частичная защита' : 'Сеть уязвима!'}
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
                <span>Настройка роутера</span>
                <span>{stageScores.setup.score}/{stageScores.setup.max}</span>
              </div>
              <div className="flex justify-between">
                <span>Evil Twin атака</span>
                <span>{stageScores.evilTwin.score}/{stageScores.evilTwin.max}</span>
              </div>
              <div className="flex justify-between">
                <span>Перехват трафика</span>
                <span>{stageScores.sniffing.score}/{stageScores.sniffing.max}</span>
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
              <div className="text-6xl mb-4">📶</div>
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
                {/* Router Icon */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setRouterOpen(true)}
                  className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-white/10 transition"
                >
                  <div className="w-16 h-16 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg">
                    <span className="text-white text-3xl">📡</span>
                  </div>
                  <span className="text-white text-sm font-medium drop-shadow-lg">Настройка Wi-Fi</span>
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

            {/* Router Admin Panel */}
            <AnimatePresence>
              {routerOpen && (
                <motion.div
                  key="router"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-4 z-10 bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col"
                >
                  {/* Admin Panel Header */}
                  <div className="bg-blue-800 text-white px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl"></span>
                      <div>
                        <h1 className="text-xl font-bold">Router Admin Panel</h1>
                        <p className="text-blue-200 text-sm">TP-Link Archer AX50 • 192.168.1.1</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setRouterOpen(false)}
                      className="px-3 py-1 bg-blue-700 hover:bg-blue-600 rounded text-sm transition"
                    >
                      ✕ Закрыть
                    </button>
                  </div>

                  {/* Content */}
                  <div className="flex-1 overflow-hidden bg-gray-50">
                    <AnimatePresence mode="wait">
                      {currentStage === 'setup' && (
                        <motion.div
                          key="setup"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="h-full"
                        >
                          <RouterSetup
                            onComplete={(result) => handleStageComplete('setup', result)}
                          />
                        </motion.div>
                      )}

                      {currentStage === 'evilTwin' && (
                        <motion.div
                          key="evilTwin"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="h-full"
                        >
                          <EvilTwinAttack
                            routerConfig={routerConfig}
                            onComplete={(result) => handleStageComplete('evilTwin', result)}
                          />
                        </motion.div>
                      )}

                      {currentStage === 'sniffing' && (
                        <motion.div
                          key="sniffing"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="h-full"
                        >
                          <TrafficSniffing
                            onComplete={(result) => handleStageComplete('sniffing', result)}
                          />
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

export default WifiSecuritySimulation;

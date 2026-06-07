import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AttackTimeline from './AttackTimeline';
import ReconStage from './ReconStage';
import PhishingStage from './PhishingStage';
import InstallationStage from './InstallationStage';
import ExfiltrationStage from './ExfiltrationStage';
import ResponseStage from './ResponseStage';

function CyberBasicsSimulation({ simulation, onComplete }) {
  const audioContextRef = useRef(null);
  const [bootPhase, setBootPhase] = useState('black');
  const [panelOpen, setPanelOpen] = useState(false);
  const [currentStage, setCurrentStage] = useState('recon');
  const [isShuttingDown, setIsShuttingDown] = useState(false);
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [showProgramMessage, setShowProgramMessage] = useState(null);

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
    let stageScore = 0, stageMax = 0;
    Object.values(stageScores).forEach(s => { stageScore += s.score; stageMax += s.max; });
    setTimeout(() => onComplete({ stageScore, stageMax }), 2500);
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

  // Play alarm sound
  const playAlarmSound = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
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
            onClick={() => startMenuOpen && setStartMenuOpen(false)}
          >
            {/* Desktop Background - Windows 7 Aurora Style */}
            <div
              className="w-full h-full relative"
              style={{
                background: `
                  radial-gradient(ellipse at 20% 50%, rgba(72,149,239,0.4) 0%, transparent 50%),
                  radial-gradient(ellipse at 80% 20%, rgba(108,92,231,0.3) 0%, transparent 50%),
                  radial-gradient(ellipse at 40% 80%, rgba(6,182,212,0.2) 0%, transparent 50%),
                  linear-gradient(180deg, #1e3a5f 0%, #0f172a 100%)
                `
              }}
            >
              {/* Desktop Icons */}
              <div className="absolute top-4 left-4 space-y-4">
                <DesktopIcon
                  icon="🖥️"
                  label="Компьютер"
                  onClick={() => setShowProgramMessage('computer')}
                />
                <DesktopIcon
                  icon="🗑️"
                  label="Корзина"
                  onClick={() => setShowProgramMessage('recycle')}
                />
                <DesktopIcon
                  icon="🛡️"
                  label="Панель безопасности"
                  onClick={() => {
                    setPanelOpen(true);
                    playAlarmSound();
                  }}
                />
                <DesktopIcon
                  icon="🌐"
                  label="Браузер"
                  onClick={() => setShowProgramMessage('browser')}
                />
              </div>

              {/* Taskbar - Windows 7 Aero Style */}
              <div
                className="absolute bottom-0 left-0 right-0 h-12 flex items-center px-2"
                style={{
                  background: 'linear-gradient(to bottom, rgba(60,90,130,0.85) 0%, rgba(30,50,80,0.95) 40%, rgba(20,35,60,0.98) 100%)',
                  backdropFilter: 'blur(10px)',
                  borderTop: '1px solid rgba(150,180,220,0.3)',
                  boxShadow: '0 -2px 10px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)'
                }}
              >
                {/* Start Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setStartMenuOpen(!startMenuOpen);
                  }}
                  className="w-12 h-12 -mt-3 rounded-full flex items-center justify-center"
                  style={{
                    background: 'radial-gradient(circle at 30% 30%, rgba(100,150,220,0.9) 0%, rgba(40,80,140,0.95) 50%, rgba(20,50,100,1) 100%)',
                    border: '2px solid rgba(150,180,220,0.4)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.3)'
                  }}
                >
                  <span className="text-white text-xl">🪟</span>
                </motion.button>

                {/* Taskbar Items */}
                <div className="flex-1 flex items-center gap-1 ml-2">
                  {panelOpen && (
                    <div className="px-3 py-1.5 bg-white/10 rounded text-white text-xs border border-white/20">
                      🛡️ Панель безопасности
                    </div>
                  )}
                </div>

                {/* System Tray */}
                <div className="flex items-center gap-3 px-3 h-8 bg-black/20 rounded border border-white/10">
                  <span className="text-white/80 text-xs">🔊</span>
                  <span className="text-white/80 text-xs">🌐</span>
                  <div className="text-white text-xs font-light">
                    {new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            </div>

            {/* Start Menu */}
            <AnimatePresence>
              {startMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute bottom-14 left-2 w-80 bg-white/95 rounded-lg shadow-2xl overflow-hidden z-40"
                  style={{
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(150,180,220,0.5)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Search Bar */}
                  <div className="p-3 bg-gradient-to-b from-blue-50 to-white border-b border-gray-200">
                    <input
                      type="text"
                      placeholder="Поиск программ и файлов"
                      className="w-full px-3 py-2 rounded border border-gray-300 text-sm focus:outline-none focus:border-blue-500"
                      readOnly
                    />
                  </div>

                  {/* Programs List */}
                  <div className="p-2 space-y-1">
                    <StartMenuItem
                      icon="🛡️"
                      label="Панель безопасности"
                      onClick={() => {
                        setPanelOpen(true);
                        playAlarmSound();
                        setStartMenuOpen(false);
                      }}
                    />
                    <StartMenuItem
                      icon="🌐"
                      label="Браузер"
                      onClick={() => {
                        setShowProgramMessage('browser');
                        setStartMenuOpen(false);
                      }}
                    />
                    <StartMenuItem
                      icon="📁"
                      label="Проводник"
                      onClick={() => {
                        setShowProgramMessage('explorer');
                        setStartMenuOpen(false);
                      }}
                    />
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-200" />

                  {/* Shutdown */}
                  <div className="p-2">
                    <StartMenuItem
                      icon="⏻"
                      label="Завершение работы"
                      onClick={() => {
                        handleShutdown();
                        setStartMenuOpen(false);
                      }}
                      isDanger
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

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
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Program Unavailable Message */}
            <AnimatePresence>
              {showProgramMessage && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute inset-0 bg-black/50 flex items-center justify-center z-50"
                  onClick={() => setShowProgramMessage(null)}
                >
                  <motion.div
                    className="bg-white rounded-lg p-6 max-w-sm shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-4">
                        {showProgramMessage === 'computer' && '🖥️'}
                        {showProgramMessage === 'recycle' && '🗑️'}
                        {showProgramMessage === 'browser' && '🌐'}
                        {showProgramMessage === 'explorer' && '📁'}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Программа недоступна
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        В этой симуляции доступен только модуль безопасности. 
                        Откройте "Панель безопасности" для начала обучения.
                      </p>
                      <button
                        onClick={() => setShowProgramMessage(null)}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                      >
                        Понятно
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DesktopIcon({ icon, label, onClick }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="flex flex-col items-center gap-1 p-3 rounded hover:bg-white/10 transition w-24"
    >
      <div className="w-12 h-12 flex items-center justify-center text-3xl drop-shadow-lg">
        {icon}
      </div>
      <span className="text-white text-xs text-center drop-shadow-lg leading-tight">
        {label}
      </span>
    </motion.button>
  );
}

function StartMenuItem({ icon, label, onClick, isDanger }) {
  return (
    <motion.button
      whileHover={{ x: 2 }}
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm transition ${
        isDanger 
          ? 'text-red-600 hover:bg-red-50' 
          : 'text-gray-700 hover:bg-blue-50'
      }`}
    >
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </motion.button>
  );
}

export default CyberBasicsSimulation;
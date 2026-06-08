import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WifiSelection from './WifiSelection';
import MITMVisualization from './MITMVisualization';
import ProtectionPanel from './ProtectionPanel';
import LogAnalysis from './LogAnalysis';

function NetworkAttacksSimulation({ simulation, onComplete }) {
  const [bootPhase, setBootPhase] = useState('black');
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [currentStage, setCurrentStage] = useState('wifi');
  const [isShuttingDown, setIsShuttingDown] = useState(false);

  // Stage scores
  const [stageScores, setStageScores] = useState({
    wifi: { score: 0, max: 0 },
    mitm: { score: 0, max: 0 },
    protection: { score: 0, max: 0 },
    logs: { score: 0, max: 0 }
  });

  // User choices
  const [wifiChoice, setWifiChoice] = useState(null);
  const [protectionChoices, setProtectionChoices] = useState({});

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

    if (stage === 'wifi') {
      setWifiChoice(result.choice);
    }

    const stages = ['wifi', 'mitm', 'protection', 'logs'];
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
      <div className="relative w-full h-full overflow-hidden bg-black">
        <motion.div className="flex flex-col items-center justify-center h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {/* Results */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mb-8"
          >
            <div className="text-6xl mb-4 font-mono">{percentage >= 70 ? '[OK]' : '[FAIL]'}</div>
            <h2 className="text-3xl font-bold text-green-400 mb-2 font-mono">
              {percentage >= 90 ? 'ЗАЩИТА АКТИВИРОВАНА' : percentage >= 70 ? 'ЗАЩИТА ЧАСТИЧНАЯ' : 'СИСТЕМА УЯЗВИМА'}
            </h2>
            <p className="text-xl text-gray-400 font-mono">
              SCORE: {total}/{max} ({percentage}%)
            </p>
          </motion.div>

          {/* Score Breakdown */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1 }}
            className="bg-gray-900 rounded-lg p-6 mb-8 max-w-md border border-green-500/30"
          >
            <h3 className="text-lg font-medium text-green-400 mb-4 font-mono">$ DETAILS:</h3>
            <div className="space-y-2 text-sm text-gray-400 font-mono">
              <div className="flex justify-between">
                <span>WIFI_SELECTION</span>
                <span className="text-green-400">{stageScores.wifi.score}/{stageScores.wifi.max}</span>
              </div>
              <div className="flex justify-between">
                <span>MITM_ANALYSIS</span>
                <span className="text-green-400">{stageScores.mitm.score}/{stageScores.mitm.max}</span>
              </div>
              <div className="flex justify-between">
                <span>PROTECTION</span>
                <span className="text-green-400">{stageScores.protection.score}/{stageScores.protection.max}</span>
              </div>
              <div className="flex justify-between">
                <span>LOG_ANALYSIS</span>
                <span className="text-green-400">{stageScores.logs.score}/{stageScores.logs.max}</span>
              </div>

            </div>
          </motion.div>

          <motion.div
            className="text-green-400 text-xl font-light font-mono"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            $ SYSTEM SHUTDOWN...
          </motion.div>
          <div className="flex gap-2 justify-center mt-4">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-3 rounded-full bg-green-400"
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
              className="text-center font-mono"
            >
              <div className="text-6xl mb-4">🖥️</div>
              <motion.div
                className="text-green-400 text-2xl font-light"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                NETWORK SECURITY MONITOR v2.0
              </motion.div>
            </motion.div>
          </motion.div>
        )}

        {bootPhase === 'welcome' && (
          <motion.div
            key="welcome"
            className="absolute inset-0 flex items-center justify-center bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-center font-mono"
            >
              <div className="text-green-400 text-3xl font-light mb-4">INITIALIZING...</div>
              <motion.div
                className="flex gap-2 justify-center"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-3 h-3 rounded-full bg-green-400" />
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        )}

        {bootPhase === 'desktop' && (
          <motion.div
            key="desktop"
            className="absolute inset-0 bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Terminal Background */}
            <div className="w-full h-full relative bg-black">
              {/* Grid Background */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: 'linear-gradient(rgba(0, 255, 0, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 0, 0.1) 1px, transparent 1px)',
                  backgroundSize: '50px 50px'
                }}
              />

              {/* Terminal Header */}
              <div className="absolute top-0 left-0 right-0 bg-gray-900 border-b border-green-500/30 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-green-400 font-mono text-sm ml-4">network-security-monitor</span>
                </div>
                <div className="text-green-400 font-mono text-sm">
                  STATUS: <span className="text-red-400 animate-pulse">ATTACK DETECTED</span>
                </div>
              </div>

              {/* Terminal Content */}
              <div className="absolute inset-0 pt-16 pb-4 px-4">
                <AnimatePresence mode="wait">
                  {currentStage === 'wifi' && (
                    <motion.div
                      key="wifi"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="h-full"
                    >
                      <WifiSelection
                        onComplete={(result) => handleStageComplete('wifi', result)}
                      />
                    </motion.div>
                  )}

                  {currentStage === 'mitm' && (
                    <motion.div
                      key="mitm"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="h-full"
                    >
                      <MITMVisualization
                        wifiChoice={wifiChoice}
                        onComplete={(result) => handleStageComplete('mitm', result)}
                      />
                    </motion.div>
                  )}

                  {currentStage === 'protection' && (
                    <motion.div
                      key="protection"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="h-full"
                    >
                      <ProtectionPanel
                        onComplete={(result) => handleStageComplete('protection', result)}
                      />
                    </motion.div>
                  )}

                  {currentStage === 'logs' && (
                    <motion.div
                      key="logs"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="h-full"
                    >
                      <LogAnalysis
                        onComplete={(result) => handleStageComplete('logs', result)}
                      />
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default NetworkAttacksSimulation;
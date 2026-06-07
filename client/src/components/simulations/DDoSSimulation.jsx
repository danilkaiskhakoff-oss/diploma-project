import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AttackDetection from './AttackDetection';
import AttackAnalysis from './AttackAnalysis';
import DefenseConfig from './DefenseConfig';
import AdvancedBriefing from './AdvancedBriefing';

function DDoSSimulation({ simulation, onComplete }) {
  const [phase, setPhase] = useState('briefing');
  const [currentStage, setCurrentStage] = useState('detection');
  const [stageScores, setStageScores] = useState({
    detection: { score: 0, max: 0 },
    analysis: { score: 0, max: 0 },
    defense: { score: 0, max: 0 }
  });
  const [showResults, setShowResults] = useState(false);
  const [isShuttingDown, setIsShuttingDown] = useState(false);
  const [attackType, setAttackType] = useState(null);

  const handleStageComplete = (stage, result) => {
    setStageScores(prev => ({
      ...prev,
      [stage]: result
    }));

    if (stage === 'analysis' && result.type) {
      setAttackType(result.type);
    }

    const stages = ['detection', 'analysis', 'defense'];
    const currentIndex = stages.indexOf(stage);
    if (currentIndex < stages.length - 1) {
      setCurrentStage(stages[currentIndex + 1]);
    } else {
      setShowResults(true);
    }
  };

  const handleShutdown = () => {
    setIsShuttingDown(true);
    let stageScore = 0, stageMax = 0;
    Object.values(stageScores).forEach(s => { stageScore += s.score; stageMax += s.max; });
    setTimeout(() => onComplete({ stageScore, stageMax }), 2500);
  };

  const calculateTotalScore = () => {
    let total = 0;
    let max = 0;
    Object.values(stageScores).forEach(stage => {
      total += stage.score;
      max += stage.max;
    });
    return { total: Math.round(total), max };
  };

  if (phase === 'briefing') {
    return <AdvancedBriefing simulationType="ddos" onComplete={() => setPhase('simulation')} />;
  }

  if (isShuttingDown) {
    const { total, max } = calculateTotalScore();
    const percentage = Math.round((total / max) * 100);

    return (
      <div className="relative w-full h-full overflow-hidden bg-gradient-to-b from-[#1a3a5c] to-[#0a1628]">
        <motion.div className="flex flex-col items-center justify-center h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mb-8"
          >
            <div className="text-6xl mb-4">{percentage >= 70 ? '🛡️' : '⚠️'}</div>
            <h2 className="text-3xl font-bold text-white mb-2">
              {percentage >= 90 ? 'Атака предотвращена!' : percentage >= 70 ? 'Атака смягчена!' : 'Есть над чем работать'}
            </h2>
            <p className="text-xl text-gray-300">
              Результат: {total}/{max} ({percentage}%)
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1 }}
            className="bg-white/10 rounded-lg p-6 mb-8 max-w-md"
          >
            <h3 className="text-lg font-medium text-white mb-4">Детали:</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex justify-between">
                <span>Обнаружение атаки</span>
                <span>{stageScores.detection.score}/{stageScores.detection.max}</span>
              </div>
              <div className="flex justify-between">
                <span>Анализ типа атаки</span>
                <span>{stageScores.analysis.score}/{stageScores.analysis.max}</span>
              </div>
              <div className="flex justify-between">
                <span>Настройка защиты</span>
                <span>{stageScores.defense.score}/{stageScores.defense.max}</span>
              </div>

            </div>
          </motion.div>

          <motion.div
            className="text-white text-xl font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            Завершение сессии...
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

  if (showResults) {
    const { total, max } = calculateTotalScore();
    const percentage = Math.round((total / max) * 100);

    return (
      <div className="relative w-full h-full overflow-hidden bg-gray-900">
        <div className="flex flex-col items-center justify-center h-full p-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center mb-8"
          >
            <div className="text-6xl mb-4">{percentage >= 70 ? '🛡️' : '⚠️'}</div>
            <h2 className="text-3xl font-bold text-white mb-2">
              {percentage >= 90 ? 'Атака предотвращена!' : percentage >= 70 ? 'Атака смягчена!' : 'Есть над чем работать'}
            </h2>
            <p className="text-xl text-gray-300">
              Результат: {total}/{max} ({percentage}%)
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-gray-800 rounded-lg p-6 mb-8 max-w-md w-full"
          >
            <h3 className="text-lg font-medium text-white mb-4">Детали:</h3>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex justify-between">
                <span>Обнаружение атаки</span>
                <span>{stageScores.detection.score}/{stageScores.detection.max}</span>
              </div>
              <div className="flex justify-between">
                <span>Анализ типа атаки</span>
                <span>{stageScores.analysis.score}/{stageScores.analysis.max}</span>
              </div>
              <div className="flex justify-between">
                <span>Настройка защиты</span>
                <span>{stageScores.defense.score}/{stageScores.defense.max}</span>
              </div>

            </div>
          </motion.div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            onClick={handleShutdown}
            className="px-8 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition"
          >
            Завершить сессию
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden bg-gray-900">
      <AnimatePresence mode="wait">
        {currentStage === 'detection' && (
          <motion.div
            key="detection"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="h-full"
          >
            <AttackDetection
              onComplete={(result) => handleStageComplete('detection', result)}
            />
          </motion.div>
        )}

        {currentStage === 'analysis' && (
          <motion.div
            key="analysis"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="h-full"
          >
            <AttackAnalysis
              onComplete={(result) => handleStageComplete('analysis', result)}
            />
          </motion.div>
        )}

        {currentStage === 'defense' && (
          <motion.div
            key="defense"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="h-full"
          >
            <DefenseConfig
              attackType={attackType}
              onComplete={(result) => handleStageComplete('defense', result)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default DDoSSimulation;

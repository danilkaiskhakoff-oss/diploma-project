import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GoogleDorks from './GoogleDorks';
import ShodanRecon from './ShodanRecon';
import SocialRecon from './SocialRecon';
import OSINTQuiz from './OSINTQuiz';

function OSINTSimulation({ simulation, onComplete }) {
  const [currentStage, setCurrentStage] = useState('dorks');
  const [stageScores, setStageScores] = useState({
    dorks: { score: 0, max: 0 },
    shodan: { score: 0, max: 0 },
    social: { score: 0, max: 0 }
  });
  const [quizScore, setQuizScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [isShuttingDown, setIsShuttingDown] = useState(false);
  const [targetProfile, setTargetProfile] = useState({});

  const handleStageComplete = (stage, result) => {
    setStageScores(prev => ({
      ...prev,
      [stage]: result
    }));

    if (stage === 'social' && result.profile) {
      setTargetProfile(result.profile);
    }

    const stages = ['dorks', 'shodan', 'social'];
    const currentIndex = stages.indexOf(stage);
    if (currentIndex < stages.length - 1) {
      setCurrentStage(stages[currentIndex + 1]);
    } else {
      setCurrentStage('quiz');
    }
  };

  const handleQuizComplete = (score) => {
    setQuizScore(score);
    setShowResults(true);
  };

  const handleShutdown = () => {
    setIsShuttingDown(true);
    setTimeout(() => onComplete(), 2500);
  };

  const calculateTotalScore = () => {
    let total = 0;
    let max = 0;

    Object.values(stageScores).forEach(stage => {
      total += stage.score;
      max += stage.max;
    });

    total += (quizScore / 4) * 20;
    max += 20;

    return { total: Math.round(total), max };
  };

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
            <div className="text-6xl mb-4">{percentage >= 70 ? '🔍' : '⚠️'}</div>
            <h2 className="text-3xl font-bold text-white mb-2">
              {percentage >= 90 ? 'Отличная разведка!' : percentage >= 70 ? 'Хорошая разведка!' : 'Есть над чем работать'}
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
                <span>Google Dorks</span>
                <span>{stageScores.dorks.score}/{stageScores.dorks.max}</span>
              </div>
              <div className="flex justify-between">
                <span>Shodan разведка</span>
                <span>{stageScores.shodan.score}/{stageScores.shodan.max}</span>
              </div>
              <div className="flex justify-between">
                <span>Социальная разведка</span>
                <span>{stageScores.social.score}/{stageScores.social.max}</span>
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
            <div className="text-6xl mb-4">{percentage >= 70 ? '🔍' : '⚠️'}</div>
            <h2 className="text-3xl font-bold text-white mb-2">
              {percentage >= 90 ? 'Отличная разведка!' : percentage >= 70 ? 'Хорошая разведка!' : 'Есть над чем работать'}
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
                <span>Google Dorks</span>
                <span>{stageScores.dorks.score}/{stageScores.dorks.max}</span>
              </div>
              <div className="flex justify-between">
                <span>Shodan разведка</span>
                <span>{stageScores.shodan.score}/{stageScores.shodan.max}</span>
              </div>
              <div className="flex justify-between">
                <span>Социальная разведка</span>
                <span>{stageScores.social.score}/{stageScores.social.max}</span>
              </div>
              <div className="flex justify-between">
                <span>Квиз</span>
                <span>{Math.round((quizScore / 4) * 20)}/20</span>
              </div>
            </div>
          </motion.div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            onClick={handleShutdown}
            className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
          >
            Завершить сессию
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden bg-gray-950">
      <AnimatePresence mode="wait">
        {currentStage === 'dorks' && (
          <motion.div
            key="dorks"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="h-full"
          >
            <GoogleDorks
              onComplete={(result) => handleStageComplete('dorks', result)}
            />
          </motion.div>
        )}

        {currentStage === 'shodan' && (
          <motion.div
            key="shodan"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="h-full"
          >
            <ShodanRecon
              onComplete={(result) => handleStageComplete('shodan', result)}
            />
          </motion.div>
        )}

        {currentStage === 'social' && (
          <motion.div
            key="social"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="h-full"
          >
            <SocialRecon
              onComplete={(result) => handleStageComplete('social', result)}
            />
          </motion.div>
        )}

        {currentStage === 'quiz' && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="h-full"
          >
            <OSINTQuiz onComplete={handleQuizComplete} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default OSINTSimulation;

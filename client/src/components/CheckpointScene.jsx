import { useState } from 'react';
import { motion } from 'framer-motion';
import Desktop from './simulations/Desktop';
import PasswordSimulation from './simulations/PasswordSimulation';
import DataProtectionSimulation from './simulations/DataProtectionSimulation';
import SocialMediaSimulation from './simulations/SocialMediaSimulation';
import CyberBasicsSimulation from './simulations/CyberBasicsSimulation';
import NetworkAttacksSimulation from './simulations/NetworkAttacksSimulation';
import SocialEngineeringSimulation from './simulations/SocialEngineeringSimulation';
import MalwareSimulation from './simulations/MalwareSimulation';
import WifiSecuritySimulation from './simulations/WifiSecuritySimulation';
import InsiderThreatsSimulation from './simulations/InsiderThreatsSimulation';
import DDoSSimulation from './simulations/DDoSSimulation';
import PentestSimulation from './simulations/PentestSimulation';
import IRSimulation from './simulations/IRSimulation';
import OSINTSimulation from './simulations/OSINTSimulation';

function CheckpointScene({ checkpoint, levelColor, onClose, user }) {
  const [currentStep, setCurrentStep] = useState('theory');
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [stageResult, setStageResult] = useState(null);

  const quiz = checkpoint.quiz || [];
  const currentQuiz = quiz[currentQuizIndex];

  const simulationComponents = {
    'phishing': Desktop,
    'passwords': PasswordSimulation,
    'data-protection': DataProtectionSimulation,
    'social-media': SocialMediaSimulation,
    'cyber-basics': CyberBasicsSimulation,
    'network-attacks': NetworkAttacksSimulation,
    'social-engineering': SocialEngineeringSimulation,
    'malware': MalwareSimulation,
    'wifi-security': WifiSecuritySimulation,
    'insider-threats': InsiderThreatsSimulation,
    'ddos': DDoSSimulation,
    'pentest': PentestSimulation,
    'incident-response': IRSimulation,
    'osint': OSINTSimulation,
  };

  const handleSimulationComplete = (data) => {
    setStageResult(data || { stageScore: 1, stageMax: 1 });
    if (quiz.length > 0) {
      setCurrentStep('quiz');
    } else {
      setCurrentStep('results');
    }
  };

  const handleAnswerSelect = (index) => {
    if (showExplanation) return;
    setSelectedAnswer(index);
    setShowExplanation(true);
    if (index === currentQuiz.correctIndex) {
      setScore(score + 1);
    }
  };

  const handleNextQuiz = () => {
    if (currentQuizIndex < quiz.length - 1) {
      setCurrentQuizIndex(currentQuizIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setCurrentStep('results');
    }
  };

  const handleFinish = () => {
    onClose({
      stageScore: stageResult?.stageScore || 0,
      stageMax: stageResult?.stageMax || 0,
      quizScore: score,
      quizTotal: quiz.length
    });
  };

  // Render simulation
  if (currentStep === 'simulation' && checkpoint.simulation) {
    const SimComponent = simulationComponents[checkpoint.simulation.type];
    if (SimComponent) {
      return (
        <div className="absolute inset-0 z-20 bg-gray-950">
          <SimComponent
            simulation={checkpoint.simulation}
            onComplete={handleSimulationComplete}
          />
        </div>
      );
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-20"
    >
      <motion.div
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 50 }}
        className="bg-[#1a1a2e] rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-gray-800"
      >
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">{checkpoint.title}</h2>
          <button onClick={onClose} className="px-4 py-2 text-gray-400 hover:text-white transition">✕</button>
        </div>

        <div className="p-6">
          {/* Theory Step */}
          {currentStep === 'theory' && (
            <div>
              <h3 className="text-xl font-bold mb-4" style={{ color: levelColor }}>
                {checkpoint.theory?.title || checkpoint.title}
              </h3>
              <div className="text-gray-300 whitespace-pre-line leading-relaxed mb-6">
                {checkpoint.theory?.content || 'Изучите материал перед началом симуляции.'}
              </div>

              {checkpoint.theory?.references && checkpoint.theory.references.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-bold text-gray-400 mb-2">Дополнительные материалы:</h4>
                  <ul className="space-y-2">
                    {checkpoint.theory.references.map((ref, i) => (
                      <li key={i}>
                        <a href={ref.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 text-sm underline">
                          {ref.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                onClick={() => setCurrentStep('simulation')}
                className="w-full py-3 rounded-lg font-medium text-white transition"
                style={{ backgroundColor: levelColor }}
              >
                Начать симуляцию →
              </button>
            </div>
          )}

          {/* Quiz Step */}
          {currentStep === 'quiz' && currentQuiz && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-gray-400">Задача {currentQuizIndex + 1} из {quiz.length}</span>
                <span className="text-sm font-bold" style={{ color: levelColor }}>Счёт: {score}</span>
              </div>

              <h3 className="text-lg font-bold text-white mb-6">{currentQuiz.question}</h3>

              <div className="space-y-3 mb-6">
                {currentQuiz.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    className={`w-full p-4 rounded-lg text-left transition border ${
                      selectedAnswer === index
                        ? index === currentQuiz.correctIndex
                          ? 'bg-green-900/30 border-green-500 text-green-300'
                          : 'bg-red-900/30 border-red-500 text-red-300'
                        : 'bg-[#0a0a0f] border-gray-700 text-gray-300 hover:border-gray-500'
                    }`}
                    disabled={showExplanation}
                  >
                    <span className="font-mono mr-3">{String.fromCharCode(65 + index)}.</span>
                    {option}
                  </button>
                ))}
              </div>

              {showExplanation && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-lg mb-6 ${
                    selectedAnswer === currentQuiz.correctIndex
                      ? 'bg-green-900/20 border border-green-800'
                      : 'bg-red-900/20 border border-red-800'
                  }`}
                >
                  <p className="text-sm text-gray-300">{currentQuiz.explanation}</p>
                </motion.div>
              )}

              {showExplanation && (
                <button
                  onClick={handleNextQuiz}
                  className="w-full py-3 rounded-lg font-medium text-white transition"
                  style={{ backgroundColor: levelColor }}
                >
                  {currentQuizIndex < quiz.length - 1 ? 'Следующая задача →' : 'Показать результат'}
                </button>
              )}
            </div>
          )}

          {/* Results Step */}
          {currentStep === 'results' && (
            <div className="text-center">
              <div className="text-6xl mb-4">
                {score === quiz.length && stageResult?.stageScore === stageResult?.stageMax ? '🏆' :
                 score >= quiz.length / 2 ? '👍' : '📚'}
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Результат</h3>

              <div className="space-y-2 mb-6">
                {stageResult && (
                  <p className="text-lg text-gray-300">
                    Симуляция: <span style={{ color: levelColor }}>{stageResult.stageScore}/{stageResult.stageMax}</span>
                  </p>
                )}
                {quiz.length > 0 && (
                  <p className="text-lg text-gray-300">
                    Квиз: <span style={{ color: levelColor }}>{score}/{quiz.length}</span>
                  </p>
                )}
                <p className="text-3xl font-bold mt-4" style={{ color: levelColor }}>
                  {(stageResult?.stageScore || 0) + score} / {(stageResult?.stageMax || 0) + quiz.length}
                </p>
              </div>

              <p className="text-gray-400 mb-6">
                {score === quiz.length && stageResult?.stageScore === stageResult?.stageMax
                  ? 'Отлично! Идеальный результат!'
                  : score >= quiz.length / 2
                  ? 'Хороший результат! Но есть куда расти.'
                  : 'Рекомендуем перечитать теорию и попробовать снова.'}
              </p>

              {user?.type === 'registered' && (
                <p className="text-[#00ff88] text-sm mb-4">✓ Прогресс сохранён в аккаунт</p>
              )}
              {user?.type === 'anonymous' && (
                <p className="text-yellow-400/70 text-sm mb-4">️ Прогресс сохранён локально</p>
              )}

              <button
                onClick={handleFinish}
                className="px-8 py-3 rounded-lg font-medium text-white transition"
                style={{ backgroundColor: levelColor }}
              >
                Вернуться к карте
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default CheckpointScene;

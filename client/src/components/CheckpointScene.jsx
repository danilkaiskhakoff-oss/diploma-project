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

function CheckpointScene({ checkpoint, levelColor, onClose }) {
  const [currentStep, setCurrentStep] = useState('theory');
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);

  const quiz = checkpoint.quiz || [];
  const currentQuiz = quiz[currentQuizIndex];

  // If this is a simulation checkpoint, render the appropriate simulation
  if (checkpoint.type === 'simulation' && checkpoint.simulation) {
    if (checkpoint.simulation.type === 'phishing') {
      return (
        <div className="absolute inset-0 z-20">
          <Desktop
            simulation={checkpoint.simulation}
            onComplete={() => {
              onClose();
            }}
          />
        </div>
      );
    }
    if (checkpoint.simulation.type === 'passwords') {
      return (
        <div className="absolute inset-0 z-20">
          <PasswordSimulation
            simulation={checkpoint.simulation}
            onComplete={() => {
              onClose();
            }}
          />
        </div>
      );
    }
    if (checkpoint.simulation.type === 'data-protection') {
      return (
        <div className="absolute inset-0 z-20">
          <DataProtectionSimulation
            simulation={checkpoint.simulation}
            onComplete={() => {
              onClose();
            }}
          />
        </div>
      );
    }
    if (checkpoint.simulation.type === 'social-media') {
      return (
        <div className="absolute inset-0 z-20">
          <SocialMediaSimulation
            simulation={checkpoint.simulation}
            onComplete={() => {
              onClose();
            }}
          />
        </div>
      );
    }
    if (checkpoint.simulation.type === 'cyber-basics') {
      return (
        <div className="absolute inset-0 z-20">
          <CyberBasicsSimulation
            simulation={checkpoint.simulation}
            onComplete={() => {
              onClose();
            }}
          />
        </div>
      );
    }
    if (checkpoint.simulation.type === 'network-attacks') {
      return (
        <div className="absolute inset-0 z-20">
          <NetworkAttacksSimulation
            simulation={checkpoint.simulation}
            onComplete={() => {
              onClose();
            }}
          />
        </div>
      );
    }
    if (checkpoint.simulation.type === 'social-engineering') {
      return (
        <div className="absolute inset-0 z-20">
          <SocialEngineeringSimulation
            simulation={checkpoint.simulation}
            onComplete={() => {
              onClose();
            }}
          />
        </div>
      );
    }
    if (checkpoint.simulation.type === 'malware') {
      return (
        <div className="absolute inset-0 z-20">
          <MalwareSimulation
            simulation={checkpoint.simulation}
            onComplete={() => {
              onClose();
            }}
          />
        </div>
      );
    }
    if (checkpoint.simulation.type === 'wifi-security') {
      return (
        <div className="absolute inset-0 z-20">
          <WifiSecuritySimulation
            simulation={checkpoint.simulation}
            onComplete={() => {
              onClose();
            }}
          />
        </div>
      );
    }
    if (checkpoint.simulation.type === 'insider-threats') {
      return (
        <div className="absolute inset-0 z-20">
          <InsiderThreatsSimulation
            simulation={checkpoint.simulation}
            onComplete={() => {
              onClose();
            }}
          />
        </div>
      );
    }
    if (checkpoint.simulation.type === 'ddos') {
      return (
        <div className="absolute inset-0 z-20">
          <DDoSSimulation
            simulation={checkpoint.simulation}
            onComplete={() => {
              onClose();
            }}
          />
        </div>
      );
    }
  }

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
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white transition"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          {currentStep === 'theory' && (
            <div>
              <h3 className="text-xl font-bold mb-4" style={{ color: levelColor }}>
                {checkpoint.theory.title}
              </h3>
              <div className="text-gray-300 whitespace-pre-line leading-relaxed mb-6">
                {checkpoint.theory.content}
              </div>

              {checkpoint.theory.references && checkpoint.theory.references.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-bold text-gray-400 mb-2"> Дополнительные материалы:</h4>
                  <ul className="space-y-2">
                    {checkpoint.theory.references.map((ref, i) => (
                      <li key={i}>
                        <a
                          href={ref.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 text-sm underline"
                        >
                          {ref.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                onClick={() => {
                  if (quiz.length > 0) {
                    setCurrentStep('quiz');
                  } else {
                    onClose();
                  }
                }}
                className="w-full py-3 rounded-lg font-medium text-white transition"
                style={{ backgroundColor: levelColor }}
              >
                {quiz.length > 0 ? 'Перейти к задаче →' : 'Завершить'}
              </button>
            </div>
          )}

          {currentStep === 'quiz' && currentQuiz && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-gray-400">
                  Задача {currentQuizIndex + 1} из {quiz.length}
                </span>
                <span className="text-sm font-bold" style={{ color: levelColor }}>
                  Счёт: {score}
                </span>
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

          {currentStep === 'results' && (
            <div className="text-center">
              <div className="text-6xl mb-4">
                {score === quiz.length ? '🏆' : score >= quiz.length / 2 ? '👍' : '📚'}
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Результат</h3>
              <p className="text-4xl font-bold mb-4" style={{ color: levelColor }}>
                {score}/{quiz.length}
              </p>
              <p className="text-gray-400 mb-6">
                {score === quiz.length
                  ? 'Отлично! Вы прошли все задачи!'
                  : score >= quiz.length / 2
                  ? 'Хороший результат! Но есть куда расти.'
                  : 'Рекомендуем перечитать теорию и попробовать снова.'}
              </p>
              <button
                onClick={onClose}
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

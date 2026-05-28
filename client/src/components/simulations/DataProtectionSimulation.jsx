import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TwoFactorAuth from './TwoFactorAuth';
import BackupStrategy from './BackupStrategy';
import FileEncryption from './FileEncryption';
import DataLeakScenario from './DataLeakScenario';
import Taskbar from '../simulations/Taskbar';

function DataProtectionSimulation({ simulation, onComplete }) {
  const [currentStep, setCurrentStep] = useState('intro');
  const [bootPhase, setBootPhase] = useState('black');
  const [isShuttingDown, setIsShuttingDown] = useState(false);
  const [showTaskbar, setShowTaskbar] = useState(false);

  // User choices
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [twoFactorMethod, setTwoFactorMethod] = useState('');
  const [backupStrategy, setBackupStrategy] = useState('');
  const [filesEncrypted, setFilesEncrypted] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setBootPhase('logo'), 500);
    const timer2 = setTimeout(() => setBootPhase('welcome'), 2000);
    const timer3 = setTimeout(() => {
      setBootPhase('desktop');
      setShowTaskbar(true);
    }, 3500);
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

  const handleTwoFactorComplete = (method) => {
    setTwoFactorEnabled(true);
    setTwoFactorMethod(method);
    setCurrentStep('backup');
  };

  const handleBackupComplete = (strategy) => {
    setBackupStrategy(strategy);
    setCurrentStep('encryption');
  };

  const handleEncryptionComplete = (encrypted) => {
    setFilesEncrypted(encrypted);
    setCurrentStep('leak');
  };

  const handleLeakComplete = () => {
    setCurrentStep('quiz');
  };

  const handleQuizComplete = () => {
    setCurrentStep('results');
  };

  const handleRestart = () => {
    setTwoFactorEnabled(false);
    setTwoFactorMethod('');
    setBackupStrategy('');
    setFilesEncrypted(false);
    setCurrentStep('intro');
  };

  // Boot animation
  if (isShuttingDown) {
    return (
      <div className="relative w-full h-full overflow-hidden bg-gradient-to-b from-[#1a3a5c] to-[#0a1628]">
        <motion.div className="flex flex-col items-center justify-center h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <motion.div className="text-white text-xl font-light mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
            Завершение работы...
          </motion.div>
          <div className="flex gap-2 justify-center">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div key={i} className="w-3 h-3 rounded-full bg-white" animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }} transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }} />
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  if (bootPhase === 'black') return <div className="w-full h-full bg-black" />;

  if (bootPhase === 'logo') {
    return (
      <div className="w-full h-full bg-black flex items-center justify-center">
        <motion.div className="flex flex-col items-center" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1 }}>
          <div className="flex gap-1 mb-8">
            {[0, 1, 2, 3].map((i) => (
              <motion.div key={i} className="w-16 h-16 rounded-sm" style={{ background: ['#f25022', '#7fba00', '#00a4ef', '#ffb900'][i] }} initial={{ rotate: -180, scale: 0 }} animate={{ rotate: 0, scale: 1 }} transition={{ duration: 0.8, delay: i * 0.15 }} />
            ))}
          </div>
          <motion.div className="text-white text-2xl font-light tracking-wider" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }}>Windows 7</motion.div>
        </motion.div>
      </div>
    );
  }

  if (bootPhase === 'welcome') {
    return (
      <div className="w-full h-full bg-gradient-to-b from-[#1a3a5c] to-[#0a1628] flex items-center justify-center">
        <div className="text-center">
          <motion.div className="text-white text-xl font-light mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Добро пожаловать</motion.div>
          <div className="flex gap-2 justify-center">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div key={i} className="w-3 h-3 rounded-full bg-white" animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }} transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #2d5a87 30%, #1a4a7a 60%, #0d2b45 100%)' }}>
        <div className="absolute inset-0 opacity-30" style={{ background: 'radial-gradient(ellipse at 30% 20%, rgba(100, 200, 255, 0.4) 0%, transparent 50%), radial-gradient(ellipse at 70% 60%, rgba(50, 150, 200, 0.3) 0%, transparent 40%)' }} />
      </div>

      <div className="absolute top-4 left-4 flex flex-col gap-4 z-10">
        <DesktopIcon label="Защита" emoji="" onClick={() => setCurrentStep('intro')} />
        <DesktopIcon label="Корзина" emoji="️" />
        <DesktopIcon label="Мой компьютер" emoji="💻" />
      </div>

      <div className="absolute inset-0 flex items-center justify-center z-20">
        <AnimatePresence mode="wait">
          {currentStep === 'intro' && <IntroStep onStart={() => setCurrentStep('2fa')} />}
          {currentStep === '2fa' && <TwoFactorAuth onComplete={handleTwoFactorComplete} />}
          {currentStep === 'backup' && <BackupStrategy onComplete={handleBackupComplete} />}
          {currentStep === 'encryption' && <FileEncryption onComplete={handleEncryptionComplete} />}
          {currentStep === 'leak' && (
            <DataLeakScenario
              twoFactorEnabled={twoFactorEnabled}
              twoFactorMethod={twoFactorMethod}
              backupStrategy={backupStrategy}
              filesEncrypted={filesEncrypted}
              onComplete={handleLeakComplete}
            />
          )}
          {currentStep === 'quiz' && <QuizStep quiz={simulation.quiz || []} onComplete={handleQuizComplete} />}
          {currentStep === 'results' && (
            <ResultsStep
              twoFactorEnabled={twoFactorEnabled}
              twoFactorMethod={twoFactorMethod}
              backupStrategy={backupStrategy}
              filesEncrypted={filesEncrypted}
              onRestart={handleRestart}
              onFinish={() => { setIsShuttingDown(true); setTimeout(() => onComplete(), 2500); }}
            />
          )}
        </AnimatePresence>
      </div>

      {showTaskbar && <Taskbar mailOpen={false} onMailClick={() => {}} onShutdown={handleShutdown} />}
    </div>
  );
}

function DesktopIcon({ label, emoji, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div className="flex flex-col items-center gap-1 cursor-pointer w-20" whileHover={{ scale: 1.05 }} onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div className="w-12 h-12 flex items-center justify-center text-3xl rounded" style={{ background: hovered ? 'rgba(255,255,255,0.2)' : 'transparent', border: hovered ? '1px solid rgba(255,255,255,0.3)' : '1px solid transparent' }}>
        {emoji}
      </div>
      <span className="text-white text-xs text-center drop-shadow-lg px-1 rounded" style={{ background: hovered ? 'rgba(0,100,200,0.6)' : 'transparent', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
        {label}
      </span>
    </motion.div>
  );
}

function IntroStep({ onStart }) {
  return (
    <motion.div className="bg-[#1a1a2e] rounded-xl w-full max-w-2xl p-8 border border-gray-700" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
      <h2 className="text-2xl font-bold text-white mb-4">Защита данных</h2>
      <p className="text-gray-300 mb-6 leading-relaxed">
        В этой симуляции вы научитесь защищать свои данные от угроз.
      </p>
      <div className="space-y-3 mb-6">
        <div className="flex items-start gap-3 p-3 bg-[#0a0a0f] rounded-lg">
          <span className="text-xl">1️⃣</span>
          <div>
            <div className="text-white font-medium">Двухфакторная аутентификация</div>
            <div className="text-gray-400 text-sm">Настройте 2FA для защиты аккаунта</div>
          </div>
        </div>
        <div className="flex items-start gap-3 p-3 bg-[#0a0a0f] rounded-lg">
          <span className="text-xl">2️⃣</span>
          <div>
            <div className="text-white font-medium">Резервные копии</div>
            <div className="text-gray-400 text-sm">Выберите стратегию бэкапа данных</div>
          </div>
        </div>
        <div className="flex items-start gap-3 p-3 bg-[#0a0a0f] rounded-lg">
          <span className="text-xl">3️⃣</span>
          <div>
            <div className="text-white font-medium">Шифрование файлов</div>
            <div className="text-gray-400 text-sm">Зашифруйте чувствительные данные</div>
          </div>
        </div>
        <div className="flex items-start gap-3 p-3 bg-[#0a0a0f] rounded-lg">
          <span className="text-xl">4️⃣</span>
          <div>
            <div className="text-white font-medium">Сценарий утечки</div>
            <div className="text-gray-400 text-sm">Проверьте, насколько вы защищены</div>
          </div>
        </div>
      </div>
      <motion.button className="w-full py-3 rounded-lg font-medium text-white" style={{ background: 'linear-gradient(to bottom, #3b82f6 0%, #2563eb 100%)' }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onStart}>
        Начать симуляцию →
      </motion.button>
    </motion.div>
  );
}

function QuizStep({ quiz, onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuiz = quiz[currentIndex];

  const handleAnswer = (index) => {
    if (showExplanation) return;
    setSelectedAnswer(index);
    setShowExplanation(true);
    if (index === currentQuiz.correctIndex) setScore(score + 1);
  };

  const handleNext = () => {
    if (currentIndex < quiz.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      onComplete();
    }
  };

  return (
    <motion.div className="bg-[#1a1a2e] rounded-xl w-full max-w-2xl p-8 border border-gray-700" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">Проверка знаний</h2>
        <span className="text-sm text-gray-400">{currentIndex + 1} / {quiz.length}</span>
      </div>
      {currentQuiz && (
        <>
          <h3 className="text-lg text-white mb-6">{currentQuiz.question}</h3>
          <div className="space-y-3 mb-6">
            {currentQuiz.options.map((option, index) => (
              <motion.button key={index} className={`w-full p-4 rounded-lg text-left transition border ${selectedAnswer === index ? index === currentQuiz.correctIndex ? 'bg-green-900/30 border-green-500 text-green-300' : 'bg-red-900/30 border-red-500 text-red-300' : 'bg-[#0a0a0f] border-gray-700 text-gray-300 hover:border-gray-500'}`} whileHover={!showExplanation ? { scale: 1.01 } : {}} onClick={() => handleAnswer(index)} disabled={showExplanation}>
                <span className="font-mono mr-3">{String.fromCharCode(65 + index)}.</span>
                {option}
              </motion.button>
            ))}
          </div>
          {showExplanation && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`p-4 rounded-lg mb-6 ${selectedAnswer === currentQuiz.correctIndex ? 'bg-green-900/20 border border-green-800' : 'bg-red-900/20 border border-red-800'}`}>
              <p className="text-sm text-gray-300">{currentQuiz.explanation}</p>
            </motion.div>
          )}
          {showExplanation && (
            <motion.button className="w-full py-3 rounded-lg font-medium text-white" style={{ background: 'linear-gradient(to bottom, #3b82f6 0%, #2563eb 100%)' }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleNext}>
              {currentIndex < quiz.length - 1 ? 'Следующий вопрос →' : 'Показать результат'}
            </motion.button>
          )}
        </>
      )}
    </motion.div>
  );
}

function ResultsStep({ twoFactorEnabled, twoFactorMethod, backupStrategy, filesEncrypted, onRestart, onFinish }) {
  const getScore = () => {
    let score = 0;
    if (twoFactorEnabled) score += 33;
    if (backupStrategy === '321') score += 33;
    if (filesEncrypted) score += 34;
    return score;
  };

  const score = getScore();
  const getGrade = () => {
    if (score >= 90) return { emoji: '', text: 'Отличная защита!', color: '#22c55e' };
    if (score >= 60) return { emoji: '', text: 'Хорошая защита', color: '#eab308' };
    return { emoji: '⚠️', text: 'Нужно улучшить защиту', color: '#ef4444' };
  };

  const grade = getGrade();

  return (
    <motion.div className="bg-[#1a1a2e] rounded-xl w-full max-w-2xl p-8 border border-gray-700 text-center" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
      <div className="text-6xl mb-4">{grade.emoji}</div>
      <h2 className="text-2xl font-bold text-white mb-2">{grade.text}</h2>
      <div className="mb-6">
        <div className="text-sm text-gray-400 mb-2">Уровень защиты данных</div>
        <div className="w-full h-4 bg-gray-700 rounded-full overflow-hidden">
          <motion.div className="h-full rounded-full" style={{ backgroundColor: grade.color }} initial={{ width: 0 }} animate={{ width: `${score}%` }} transition={{ duration: 1, delay: 0.5 }} />
        </div>
        <div className="text-right text-sm mt-1" style={{ color: grade.color }}>{score}%</div>
      </div>
      <div className="space-y-2 mb-6 text-left">
        <div className="flex items-center gap-2 text-sm">
          <span>{twoFactorEnabled ? '✅' : '❌'}</span>
          <span className="text-gray-300">2FA: {twoFactorEnabled ? twoFactorMethod : 'Не включена'}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span>{backupStrategy === '321' ? '✅' : backupStrategy ? '' : ''}</span>
          <span className="text-gray-300">Бэкапы: {backupStrategy === '321' ? 'Правило 3-2-1' : backupStrategy || 'Не настроены'}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span>{filesEncrypted ? '✅' : '❌'}</span>
          <span className="text-gray-300">Шифрование: {filesEncrypted ? 'Включено' : 'Не включено'}</span>
        </div>
      </div>
      <div className="flex gap-3">
        <motion.button className="flex-1 py-3 rounded-lg font-medium text-white" style={{ background: 'linear-gradient(to bottom, #6b7280 0%, #4b5563 100%)' }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onRestart}>
          Попробовать снова
        </motion.button>
        <motion.button className="flex-1 py-3 rounded-lg font-medium text-white" style={{ background: 'linear-gradient(to bottom, #3b82f6 0%, #2563eb 100%)' }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onFinish}>
          Завершить
        </motion.button>
      </div>
    </motion.div>
  );
}

export default DataProtectionSimulation;

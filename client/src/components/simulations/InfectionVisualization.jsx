import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const systemFiles = [
  { id: 'documents', name: 'Документы', icon: '📁', isInfected: false },
  { id: 'photos', name: 'Фотографии', icon: '📷', isInfected: false },
  { id: 'system', name: 'Системные файлы', icon: '⚙️', isInfected: false },
  { id: 'browser', name: 'Браузер', icon: '', isInfected: false },
  { id: 'email', name: 'Почта', icon: '📧', isInfected: false },
  { id: 'passwords', name: 'Пароли', icon: '🔑', isInfected: false }
];

const symptoms = [
  { id: 'slow', name: 'Компьютер работает медленно', icon: '🐌', isSymptom: true },
  { id: 'popups', name: 'Всплывающие окна рекламы', icon: '', isSymptom: true },
  { id: 'crash', name: 'Программы вылетают', icon: '', isSymptom: true },
  { id: 'normal', name: 'Всё работает как обычно', icon: '✓', isSymptom: false },
  { id: 'fast', name: 'Компьютер работает быстрее', icon: '⚡', isSymptom: false }
];

function InfectionVisualization({ downloadChoice, onComplete }) {
  const [infectionProgress, setInfectionProgress] = useState(0);
  const [infectedFiles, setInfectedFiles] = useState([]);
  const [foundSymptoms, setFoundSymptoms] = useState([]);
  const [showExplanation, setShowExplanation] = useState(null);
  const [phase, setPhase] = useState('spreading'); // spreading, symptoms, analysis

  const isInfected = downloadChoice === 'cracked-game' || downloadChoice === 'free-antivirus';

  useEffect(() => {
    if (isInfected && phase === 'spreading') {
      const timer = setInterval(() => {
        setInfectionProgress(prev => {
          if (prev >= 100) {
            clearInterval(timer);
            setTimeout(() => setPhase('symptoms'), 500);
            return 100;
          }
          return prev + 2;
        });
      }, 100);
      return () => clearInterval(timer);
    }
  }, [isInfected, phase]);

  useEffect(() => {
    if (phase === 'symptoms' && isInfected) {
      const timer = setTimeout(() => {
        setInfectedFiles(['documents', 'photos', 'browser']);
        setPhase('analysis');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [phase, isInfected]);

  const handleFindSymptom = (id) => {
    if (foundSymptoms.includes(id)) return;
    setFoundSymptoms(prev => [...prev, id]);
    setShowExplanation(id);
    setTimeout(() => setShowExplanation(null), 3000);
  };

  const handleNext = () => {
    if (!isInfected) {
      onComplete({ score: 30, max: 30 });
      return;
    }
    const correctSymptoms = symptoms
      .filter(s => s.isSymptom && foundSymptoms.includes(s.id))
      .length;
    const score = correctSymptoms * 10;
    onComplete({ score: Math.min(score, 30), max: 30 });
  };

  return (
    <div className="h-full bg-gray-900 rounded-lg overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 px-4 py-3 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-medium">
              {isInfected ? '⚠️ ОБНАРУЖЕНА УГРОЗА!' : '✓ Система в безопасности'}
            </h3>
            <p className="text-gray-400 text-xs">
              {isInfected ? 'Вирус распространяется по системе...' : 'Файл безопасен, заражения нет'}
            </p>
          </div>
          {isInfected && (
            <div className="text-red-400 text-sm font-mono">
              {infectionProgress}%
            </div>
          )}
        </div>
      </div>

      {/* Infection Progress */}
      {isInfected && phase === 'spreading' && (
        <div className="px-4 py-3 bg-red-900/20 border-b border-red-500/30">
          <div className="w-full bg-gray-700 rounded-full h-2">
            <motion.div
              className="h-2 rounded-full bg-red-500"
              initial={{ width: 0 }}
              animate={{ width: `${infectionProgress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
          <p className="text-red-400 text-xs mt-2 text-center animate-pulse">
            Вирус заражает файлы...
          </p>
        </div>
      )}

      {/* System Files */}
      <div className="flex-1 overflow-y-auto p-4">
        <h4 className="text-gray-400 text-sm mb-3">Системные файлы:</h4>
        <div className="grid grid-cols-3 gap-3 mb-6">
          {systemFiles.map((file, index) => (
            <motion.div
              key={file.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`p-3 rounded-lg text-center ${
                infectedFiles.includes(file.id)
                  ? 'bg-red-900/30 border border-red-500'
                  : 'bg-gray-800 border border-gray-700'
              }`}
            >
              <div className="text-2xl mb-1">{file.icon}</div>
              <div className="text-xs text-gray-300">{file.name}</div>
              {infectedFiles.includes(file.id) && (
                <div className="text-xs text-red-400 mt-1">ЗАРАЖЁН</div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Symptoms Analysis */}
        {phase === 'analysis' && isInfected && (
          <div>
            <h4 className="text-gray-400 text-sm mb-3">Найдите симптомы заражения:</h4>
            <div className="space-y-2">
              {symptoms.map((symptom, index) => (
                <motion.button
                  key={symptom.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleFindSymptom(symptom.id)}
                  className={`w-full p-3 rounded-lg border text-left transition-all ${
                    foundSymptoms.includes(symptom.id)
                      ? symptom.isSymptom
                        ? 'bg-red-900/30 border-red-500'
                        : 'bg-yellow-900/30 border-yellow-500'
                      : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{symptom.icon}</span>
                    <span className="text-sm text-gray-300">{symptom.name}</span>
                    {foundSymptoms.includes(symptom.id) && (
                      <span className={`ml-auto px-2 py-0.5 rounded text-xs ${
                        symptom.isSymptom
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {symptom.isSymptom ? '✓ Симптом' : '⚠ Не симптом'}
                      </span>
                    )}
                  </div>
                  {showExplanation === symptom.id && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xs text-gray-400 mt-2"
                    >
                      {symptom.isSymptom
                        ? 'Это типичный симптом заражения вирусом!'
                        : 'Это не является симптомом заражения.'}
                    </motion.p>
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Safe Message */}
        {!isInfected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-green-900/30 border border-green-500 rounded-lg p-4 text-center"
          >
            <div className="text-4xl mb-2">✓</div>
            <h4 className="text-green-400 font-medium mb-1">Система в безопасности!</h4>
            <p className="text-gray-400 text-sm">Файл безопасен, заражения не произошло.</p>
          </motion.div>
        )}
      </div>

      {/* Next Button */}
      {(!isInfected || phase === 'analysis') && (
        <div className="border-t border-gray-700 bg-gray-800 px-4 py-3">
          <button
            onClick={handleNext}
            className={`w-full py-3 font-medium rounded-lg transition ${
              isInfected
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            {isInfected ? 'Перейти к лечению →' : 'Продолжить →'}
          </button>
        </div>
      )}
    </div>
  );
}

export default InfectionVisualization;

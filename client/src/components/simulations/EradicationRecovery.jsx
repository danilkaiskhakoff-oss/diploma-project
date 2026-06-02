import { useState } from 'react';
import { motion } from 'framer-motion';

const steps = [
  {
    id: 'scan-malware',
    name: 'Сканирование на malware',
    description: 'Запустить полное сканирование заражённых систем',
    icon: '🔍',
    details: 'EDR сканирование всех файлов и процессов на FS-01 и WS-042.',
    order: 1
  },
  {
    id: 'remove-malware',
    name: 'Удаление malware',
    description: 'Удалить cryptor.exe и связанные файлы',
    icon: '🗑️',
    details: 'Изолировать и удалить все вредоносные файлы. Очистить registry keys.',
    order: 2
  },
  {
    id: 'patch-vulns',
    name: 'Патч уязвимостей',
    description: 'Закрыть уязвимость, через которую проникли',
    icon: '🩹',
    details: 'Обновить ОС, приложения, закрыть открытые порты.',
    order: 3
  },
  {
    id: 'restore-backup',
    name: 'Восстановление из бэкапа',
    description: 'Восстановить зашифрованные файлы из бэкапа',
    icon: '💾',
    details: 'Восстановить данные FS-01 из бэкапа за 14:00 (до атаки).',
    order: 4
  },
  {
    id: 'verify-clean',
    name: 'Верификация чистоты',
    description: 'Подтвердить, что системы чисты',
    icon: '✅',
    details: 'Повторное сканирование, проверка логов, мониторинг 24 часа.',
    order: 5
  },
  {
    id: 'return-production',
    name: 'Возврат в production',
    description: 'Вернуть системы в рабочее состояние',
    icon: '🚀',
    details: 'Подключить системы к сети, уведомить пользователей, мониторинг.',
    order: 6
  }
];

function EradicationRecovery({ incidentType, onComplete }) {
  const [completedSteps, setCompletedSteps] = useState([]);
  const [skippedSteps, setSkippedSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleExecute = () => {
    if (currentStepIndex >= steps.length) return;

    const step = steps[currentStepIndex];
    setIsProcessing(true);

    setTimeout(() => {
      setCompletedSteps(prev => [...prev, step.id]);
      setCurrentStepIndex(prev => prev + 1);
      setIsProcessing(false);

      if (currentStepIndex === steps.length - 1) {
        setShowResults(true);
        setTimeout(() => {
          onComplete({ score: 25, max: 25 });
        }, 2000);
      }
    }, 1500);
  };

  const handleSkip = (stepId) => {
    if (completedSteps.includes(stepId) || skippedSteps.includes(stepId)) return;
    setSkippedSteps(prev => [...prev, stepId]);
    if (stepId === steps[currentStepIndex].id) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const currentStep = steps[currentStepIndex];
  const progress = ((completedSteps.length) / steps.length) * 100;

  return (
    <div className="h-full flex flex-col bg-gray-950">
      {/* Header */}
      <div className="bg-gray-900 px-6 py-4 border-b border-green-900">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-green-400 font-mono">Этап 3: Устранение и восстановление</h2>
            <p className="text-gray-400 text-sm font-mono">Выполните шаги по устранению инцидента</p>
          </div>
          <div className="px-3 py-1 bg-green-500/20 rounded-full border border-green-500">
            <span className="text-green-400 text-sm font-mono">ERADICATION PHASE</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Incident Summary */}
        <div className="bg-green-900/20 border border-green-800 rounded-xl p-4 mb-6">
          <h3 className="font-bold text-green-400 font-mono mb-2">Инцидент: {incidentType === 'ransomware' ? 'Ransomware Attack' : 'Data Breach'}</h3>
          <p className="text-sm text-green-300 font-mono">
            Выполните все шаги в правильном порядке для полного устранения инцидента.
          </p>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-400 mb-2 font-mono">
            <span>Шаг {completedSteps.length + 1}/{steps.length}</span>
            <span>{completedSteps.length === steps.length ? 'ЗАВЕРШЕНО' : 'В процессе...'}</span>
          </div>
          <div className="w-full bg-gray-900 rounded-full h-3 border border-green-900">
            <motion.div
              className="h-3 rounded-full bg-green-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-3 mb-6">
          {steps.map((step, index) => {
            const isCompleted = completedSteps.includes(step.id);
            const isCurrent = index === currentStepIndex;
            const isSkipped = !isCompleted && index < currentStepIndex;

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`rounded-xl border-2 p-4 transition-all ${
                  isCompleted ? 'bg-green-900/20 border-green-500' :
                  isCurrent ? 'bg-gray-900 border-green-500' :
                  isSkipped ? 'bg-gray-900/50 border-gray-700 opacity-50' :
                  'bg-gray-900 border-gray-700'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Status Icon */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isCompleted ? 'bg-green-500' :
                    isCurrent ? 'bg-green-500 animate-pulse' :
                    'bg-gray-700'
                  }`}>
                    {isCompleted ? (
                      <span className="text-white text-sm">✓</span>
                    ) : (
                      <span className="text-gray-400 text-sm font-mono">{index + 1}</span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={`font-bold font-mono ${
                        isCompleted ? 'text-green-400' : isCurrent ? 'text-white' : 'text-gray-500'
                      }`}>
                        {step.name}
                      </h3>
                      {!isCompleted && isCurrent && (
                        <button
                          onClick={() => handleSkip(step.id)}
                          className="text-xs text-gray-500 hover:text-gray-300 font-mono"
                        >
                          Пропустить
                        </button>
                      )}
                    </div>
                    <p className={`text-sm ${
                      isCompleted ? 'text-green-300' : isCurrent ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {step.description}
                    </p>
                    {isCurrent && (
                      <p className="text-xs text-gray-500 mt-2 font-mono">{step.details}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Results */}
        {showResults && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-900/30 border border-green-800 rounded-xl p-6 text-center"
          >
            <div className="text-6xl mb-3">✅</div>
            <h3 className="text-2xl font-bold text-green-400 font-mono mb-2">Инцидент устранён!</h3>
            <p className="text-gray-300 font-mono">
              Все шаги выполнены. Системы возвращены в production.
            </p>
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="bg-gray-950 rounded-lg p-3">
                <div className="text-xs text-gray-500 font-mono">Шагов выполнено</div>
                <div className="text-lg font-bold text-green-400 font-mono">{completedSteps.length}/{steps.length}</div>
              </div>
              <div className="bg-gray-950 rounded-lg p-3">
                <div className="text-xs text-gray-500 font-mono">Пропущено</div>
                <div className="text-lg font-bold text-yellow-400 font-mono">{skippedSteps.length}</div>
              </div>
              <div className="bg-gray-950 rounded-lg p-3">
                <div className="text-xs text-gray-500 font-mono">Статус</div>
                <div className="text-lg font-bold text-green-400 font-mono">RESOLVED</div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      {!showResults && currentStep && (
        <div className="bg-gray-900 border-t border-green-900 px-6 py-4">
          <button
            onClick={handleExecute}
            disabled={isProcessing}
            className={`w-full py-3 font-medium rounded-lg transition font-mono ${
              isProcessing
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {isProcessing ? 'Выполняется...' : `Выполнить: ${currentStep.name} →`}
          </button>
        </div>
      )}
    </div>
  );
}

export default EradicationRecovery;

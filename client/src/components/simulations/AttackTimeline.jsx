import { motion } from 'framer-motion';

const attackSteps = [
  { id: 'recon', label: 'Разведка', icon: '🔍', color: '#ff9800' },
  { id: 'phishing', label: 'Фишинг', icon: '🎣', color: '#f44336' },
  { id: 'installation', label: 'Установка', icon: '', color: '#9c27b0' },
  { id: 'exfiltration', label: 'Кража данных', icon: '📤', color: '#e91e63' },
  { id: 'response', label: 'Реагирование', icon: '🛡️', color: '#4caf50' }
];

function AttackTimeline({ currentStep, completedSteps, threatLevel }) {
  return (
    <div className="bg-black/90 rounded-lg p-4 mb-4 border border-red-500/30">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <motion.div
            className="w-3 h-3 rounded-full bg-red-500"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <span className="text-red-400 font-medium text-sm">АТАКА В ПРОГРЕССЕ</span>
        </div>
        <div className="text-sm text-gray-400">
          Угроза: <span className="text-red-400 font-bold">{threatLevel}%</span>
        </div>
      </div>

      {/* Timeline */}
      <div className="flex items-center justify-between relative">
        {/* Connection Line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-700 -translate-y-1/2" />
        <motion.div
          className="absolute top-1/2 left-0 h-0.5 bg-red-500 -translate-y-1/2"
          initial={{ width: 0 }}
          animate={{ width: `${(Object.keys(completedSteps).length / attackSteps.length) * 100}%` }}
          transition={{ duration: 0.5 }}
        />

        {/* Steps */}
        {attackSteps.map((step, index) => {
          const isCompleted = completedSteps[step.id];
          const isCurrent = currentStep === step.id;
          const isPast = Object.keys(completedSteps).length > index;

          return (
            <motion.div
              key={step.id}
              className="relative z-10 flex flex-col items-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 transition-all ${
                  isCompleted
                    ? 'bg-green-500 border-green-400'
                    : isCurrent
                    ? 'bg-red-500 border-red-400'
                    : 'bg-gray-800 border-gray-600'
                }`}
              >
                {isCompleted ? '✓' : step.icon}
              </div>
              <span className={`text-xs mt-2 ${
                isCompleted ? 'text-green-400' : isCurrent ? 'text-red-400' : 'text-gray-500'
              }`}>
                {step.label}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Real Attack Example */}
      <motion.div
        className="mt-4 p-3 bg-gray-900 rounded border border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-xs text-gray-400 mb-1">Реальный пример:</p>
        <p className="text-sm text-gray-300">
          В 2023 году компания MoveIT потеряла данные 60+ миллионов пользователей из-за уязвимости в ПО.
          Атака началась с разведки и закончилась массовой утечкой данных.
        </p>
      </motion.div>
    </div>
  );
}

export default AttackTimeline;
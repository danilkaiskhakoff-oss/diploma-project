import { useState } from 'react';
import { motion } from 'framer-motion';

const treatments = [
  {
    id: 'antivirus',
    label: 'Запустить антивирус',
    description: 'Полное сканирование системы антивирусом',
    icon: '',
    isCorrect: true,
    explanation: 'Антивирус обнаружит и удалит вредоносное ПО.',
    effect: 'Malware detected and removed.'
  },
  {
    id: 'updates',
    label: 'Обновить систему',
    description: 'Установить последние обновления безопасности',
    icon: '🔄',
    isCorrect: true,
    explanation: 'Обновления закрывают уязвимости, использованные вирусом.',
    effect: 'Security patches applied.'
  },
  {
    id: 'backup',
    label: 'Восстановить из бэкапа',
    description: 'Восстановить файлы из резервной копии',
    icon: '💾',
    isCorrect: true,
    explanation: 'Резервные копии позволяют восстановить данные после атаки.',
    effect: 'Files restored from backup.'
  },
  {
    id: 'passwords',
    label: 'Сменить пароли',
    description: 'Изменить все пароли учётных записей',
    icon: '🔑',
    isCorrect: true,
    explanation: 'Вирус мог украсть пароли. Нужно сменить их все.',
    effect: 'All passwords changed.'
  },
  {
    id: 'ignore',
    label: 'Игнорировать',
    description: 'Ничего не делать, авось само пройдёт',
    icon: '',
    isCorrect: false,
    explanation: 'Игнорирование приведёт к дальнейшему заражению!',
    effect: 'WARNING: System still infected!'
  },
  {
    id: 'disable-av',
    label: 'Отключить антивирус',
    description: 'Выключить защиту для "скорости"',
    icon: '⚠️',
    isCorrect: false,
    explanation: 'Отключение защиты откроет систему для новых атак!',
    effect: 'CRITICAL: Protection disabled!'
  }
];

function AntivirusPanel({ onComplete }) {
  const [enabled, setEnabled] = useState({});
  const [showExplanation, setShowExplanation] = useState(null);
  const [treatmentResult, setTreatmentResult] = useState(null);

  const enabledCount = Object.values(enabled).filter(v => v).length;

  const handleToggle = (id) => {
    setEnabled(prev => ({ ...prev, [id]: !prev[id] }));
    setShowExplanation(id);
    setTimeout(() => setShowExplanation(null), 3000);
  };

  const handleRunTreatment = () => {
    const correctEnabled = treatments.filter(t => t.isCorrect && enabled[t.id]).length;
    const incorrectEnabled = treatments.filter(t => !t.isCorrect && enabled[t.id]).length;
    const score = correctEnabled - incorrectEnabled;

    setTreatmentResult({
      success: correctEnabled >= 3,
      correctEnabled,
      incorrectEnabled
    });

    setTimeout(() => {
      onComplete({ score: Math.max(0, score), max: treatments.filter(t => t.isCorrect).length });
    }, 3000);
  };

  return (
    <div className="h-full bg-gray-900 rounded-lg overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 px-4 py-3 border-b border-gray-700">
        <h3 className="text-white font-medium">Панель лечения</h3>
        <p className="text-gray-400 text-xs">Выберите меры для удаления вируса</p>
      </div>

      {/* Treatment Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-3">
          {treatments.map((treatment, index) => (
            <motion.button
              key={treatment.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleToggle(treatment.id)}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                enabled[treatment.id]
                  ? treatment.isCorrect
                    ? 'bg-green-900/30 border-green-500'
                    : 'bg-red-900/30 border-red-500'
                  : 'bg-gray-800 border-gray-700 hover:border-gray-600'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{treatment.icon}</span>
                <span className="text-green-400 font-bold text-sm">{treatment.label}</span>
              </div>
              <p className="text-xs text-gray-400">{treatment.description}</p>
              {showExplanation === treatment.id && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`text-xs mt-2 ${
                    treatment.isCorrect ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {treatment.explanation}
                </motion.p>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Treatment Result */}
      {treatmentResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mx-4 mb-4 p-4 rounded-lg border ${
            treatmentResult.success
              ? 'bg-green-900/30 border-green-500'
              : 'bg-red-900/30 border-red-500'
          }`}
        >
          <div className="text-lg font-bold mb-2 text-white">
            {treatmentResult.success ? '✓ СИСТЕМА ВЫЛЕЧЕНА' : '⚠ ЗАРАЖЕНИЕ ОСТАЛОСЬ'}
          </div>
          <div className="text-sm text-gray-400">
            <div>Правильных мер: {treatmentResult.correctEnabled}</div>
            <div>Неправильных мер: {treatmentResult.incorrectEnabled}</div>
          </div>
        </motion.div>
      )}

      {/* Progress */}
      <div className="px-4 py-2 bg-gray-800/50">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>МЕРЫ ВЫБРАНЫ</span>
          <span>{enabledCount}/{treatments.length}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-1">
          <motion.div
            className="h-1 rounded-full bg-green-500"
            initial={{ width: 0 }}
            animate={{ width: `${(enabledCount / treatments.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Run Treatment Button */}
      {!treatmentResult && enabledCount > 0 && (
        <div className="border-t border-gray-700 bg-gray-800 px-4 py-3">
          <button
            onClick={handleRunTreatment}
            className="w-full py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition"
          >
            ЗАПУСТИТЬ ЛЕЧЕНИЕ
          </button>
        </div>
      )}
    </div>
  );
}

export default AntivirusPanel;

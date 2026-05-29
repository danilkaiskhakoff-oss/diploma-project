import { useState } from 'react';
import { motion } from 'framer-motion';

const database = [
  {
    id: 'passwords',
    label: 'Пароли пользователей',
    type: 'Критичные данные',
    icon: '',
    needsEncryption: true,
    explanation: 'Пароли должны быть хешированы и солёны'
  },
  {
    id: 'personal',
    label: 'Персональные данные',
    type: 'Критичные данные',
    icon: '👤',
    needsEncryption: true,
    explanation: 'Паспортные данные, адреса, телефоны — требуют шифрования'
  },
  {
    id: 'financial',
    label: 'Финансовые данные',
    type: 'Критичные данные',
    icon: '💳',
    needsEncryption: true,
    explanation: 'Номера карт, счета — должны быть зашифрованы'
  },
  {
    id: 'emails',
    label: 'Email переписка',
    type: 'Конфиденциальные данные',
    icon: '📧',
    needsEncryption: true,
    explanation: 'Переписка содержит коммерческую тайну'
  },
  {
    id: 'public',
    label: 'Публичные документы',
    type: 'Открытые данные',
    icon: '📄',
    needsEncryption: false,
    explanation: 'Публичные документы не требуют шифрования'
  },
  {
    id: 'marketing',
    label: 'Маркетинговые материалы',
    type: 'Открытые данные',
    icon: '📢',
    needsEncryption: false,
    explanation: 'Маркетинговые материалы доступны всем'
  }
];

function ExfiltrationStage({ onComplete }) {
  const [encrypted, setEncrypted] = useState({});
  const [showExplanation, setShowExplanation] = useState(null);

  const encryptedCount = Object.values(encrypted).filter(v => v).length;

  const handleToggle = (id) => {
    setEncrypted(prev => ({ ...prev, [id]: !prev[id] }));
    setShowExplanation(id);
    setTimeout(() => setShowExplanation(null), 3000);
  };

  const handleNext = () => {
    const correctEncrypted = database
      .filter(d => d.needsEncryption && encrypted[d.id])
      .length;
    const incorrectEncrypted = database
      .filter(d => !d.needsEncryption && encrypted[d.id])
      .length;
    const score = correctEncrypted - incorrectEncrypted;
    onComplete({ score: Math.max(0, score), max: database.filter(d => d.needsEncryption).length });
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-gray-900 rounded-lg p-4 mb-4 border border-pink-500/30">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">📤</span>
          <div>
            <h2 className="text-xl font-bold text-pink-400">Этап 4: Кража данных</h2>
            <p className="text-sm text-gray-400">Хакер получил доступ к базе данных</p>
          </div>
        </div>
        <p className="text-sm text-gray-300">
          Выберите, какие данные нужно зашифровать для защиты
        </p>
      </div>

      {/* Data Exfiltration Animation */}
      <div className="bg-gray-800 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="text-4xl">🗄️</div>
          <motion.div
            className="h-0.5 flex-1 bg-gradient-to-r from-pink-500 to-red-500"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1 }}
          />
          <motion.div
            className="text-4xl"
            animate={{ x: [0, 10, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            🏴‍☠️
          </motion.div>
        </div>
        <p className="text-center text-sm text-gray-400">
          Данные передаются хакеру...
        </p>
      </div>

      {/* Database */}
      <div className="bg-gray-800 rounded-lg p-4 mb-4">
        <h3 className="text-lg font-medium text-white mb-3">База данных компании</h3>
        <div className="space-y-3">
          {database.map((data, index) => (
            <motion.div
              key={data.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-3 rounded-lg border transition-all ${
                encrypted[data.id]
                  ? data.needsEncryption
                    ? 'bg-green-900/30 border-green-500'
                    : 'bg-yellow-900/30 border-yellow-500'
                  : data.needsEncryption
                  ? 'bg-red-900/30 border-red-500'
                  : 'bg-gray-700 border-gray-600'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <span className="text-2xl">{data.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-white">{data.label}</h4>
                      <span className={`px-2 py-0.5 text-xs rounded ${
                        data.type === 'Критичные данные'
                          ? 'bg-red-500/20 text-red-400'
                          : data.type === 'Конфиденциальные данные'
                          ? 'bg-orange-500/20 text-orange-400'
                          : 'bg-gray-600 text-gray-400'
                      }`}>
                        {data.type}
                      </span>
                    </div>
                    {showExplanation === data.id && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs text-gray-300 mt-2"
                      >
                        {data.explanation}
                      </motion.p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleToggle(data.id)}
                  className={`px-3 py-1.5 text-sm rounded-lg transition ${
                    encrypted[data.id]
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                  }`}
                >
                  {encrypted[data.id] ? 'Зашифровано' : 'Шифровать'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Progress */}
      <div className="bg-gray-800 rounded-lg p-3 mb-4">
        <div className="flex justify-between text-sm text-gray-400 mb-1">
          <span>Зашифровано данных</span>
          <span>{encryptedCount}/{database.length}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <motion.div
            className="h-2 rounded-full bg-pink-500"
            initial={{ width: 0 }}
            animate={{ width: `${(encryptedCount / database.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Next Button */}
      <button
        onClick={handleNext}
        className="w-full py-3 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 transition"
      >
        Продолжить →
      </button>
    </div>
  );
}

export default ExfiltrationStage;
import { useState } from 'react';
import { motion } from 'framer-motion';

const networks = [
  {
    id: 'cafe-real',
    name: 'Cafe_Free_WiFi',
    signal: 85,
    security: 'Open',
    icon: '',
    isReal: true,
    description: 'Официальная сеть кафе. Попросите пароль у бариста.',
    warning: null
  },
  {
    id: 'evil-twin',
    name: 'Cafe_Free_WiFi',
    signal: 95,
    security: 'Open',
    icon: '',
    isReal: false,
    description: 'ВНИМАНИЕ! Это фальшивая точка доступа (Evil Twin). Хакер создал сеть с таким же именем, но более мощным сигналом.',
    warning: 'Evil Twin атака: хакер перехватывает весь ваш трафик!'
  },
  {
    id: 'secure',
    name: 'Cafe_Secure_5G',
    signal: 70,
    security: 'WPA2',
    icon: '',
    isReal: true,
    description: 'Защищённая сеть кафе. Надёжнее, чем открытая.',
    warning: null
  }
];

function EvilTwinAttack({ routerConfig, onComplete }) {
  const [selected, setSelected] = useState(null);
  const [showWarning, setShowWarning] = useState(false);

  const handleSelect = (network) => {
    setSelected(network);
    setShowWarning(true);
  };

  const handleNext = () => {
    const score = selected.isReal && selected.security !== 'Open' ? 30 : selected.isReal ? 20 : 0;
    onComplete({ score, max: 30, choice: selected.id });
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <h2 className="text-xl font-bold text-gray-800">Выбор Wi-Fi сети</h2>
        <p className="text-gray-600 text-sm">Вы в кафе. Выберите сеть для подключения:</p>
      </div>

      {/* Network List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {networks.map((network, index) => (
          <motion.button
            key={network.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => handleSelect(network)}
            className={`w-full p-5 rounded-lg border-2 text-left transition-all ${
              selected?.id === network.id
                ? network.isReal && network.security !== 'Open'
                  ? 'bg-green-50 border-green-500'
                  : network.isReal
                  ? 'bg-blue-50 border-blue-500'
                  : 'bg-red-50 border-red-500'
                : 'bg-white border-gray-200 hover:border-blue-500'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{network.icon}</span>
                <div>
                  <h3 className="font-bold text-gray-800">{network.name}</h3>
                  <p className="text-sm text-gray-500">
                    Сигнал: {network.signal}% • {network.security}
                  </p>
                </div>
              </div>
              {selected?.id === network.id && (
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  network.isReal && network.security !== 'Open'
                    ? 'bg-green-500 text-white'
                    : network.isReal
                    ? 'bg-blue-500 text-white'
                    : 'bg-red-500 text-white'
                }`}>
                  {network.isReal && network.security !== 'Open' ? 'ЛУЧШИЙ ВЫБОР' : network.isReal ? 'БЕЗОПАСНО' : 'ОПАСНО'}
                </span>
              )}
            </div>

            {selected?.id === network.id && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`p-3 rounded-lg text-sm ${
                  network.isReal && network.security !== 'Open'
                    ? 'bg-green-100 text-green-800'
                    : network.isReal
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                <p className="font-medium mb-1">
                  {network.isReal && network.security !== 'Open' ? '✓ Отличный выбор!' : network.isReal ? '✓ Безопасно' : '⚠ Опасно!'}
                </p>
                <p>{network.description}</p>
                {network.warning && (
                  <p className="mt-2 font-bold text-red-700">{network.warning}</p>
                )}
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>

      {/* Next Button */}
      {showWarning && (
        <div className="bg-white border-t px-6 py-4">
          <button
            onClick={handleNext}
            className={`w-full py-3 font-medium rounded-lg transition ${
              selected.isReal
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-red-600 text-white hover:bg-red-700'
            }`}
          >
            {selected.isReal ? 'Подключиться →' : 'Подключиться (рискованно) →'}
          </button>
        </div>
      )}
    </div>
  );
}

export default EvilTwinAttack;

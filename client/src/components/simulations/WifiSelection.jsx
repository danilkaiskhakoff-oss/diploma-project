import { useState } from 'react';
import { motion } from 'framer-motion';

const wifiNetworks = [
  {
    id: 'free-cafe',
    name: 'Free_Cafe_WiFi',
    signal: 95,
    security: 'Open',
    icon: '',
    isSafe: false,
    danger: 'Открытая сеть без пароля. Хакеры могут перехватывать весь трафик.',
    realCase: 'В 2023 году в кафе в Москве хакер установил точку доступа "Free_Cafe_WiFi" и перехватил данные 50+ пользователей за 2 часа.'
  },
  {
    id: 'cafe-secure',
    name: 'Cafe_Secure',
    signal: 80,
    security: 'WPA2',
    icon: '',
    isSafe: true,
    danger: null,
    realCase: null
  },
  {
    id: 'free-5g',
    name: 'Free_WiFi_5G',
    signal: 70,
    security: 'Open',
    icon: '',
    isSafe: false,
    danger: 'Подозрительная сеть. Возможно, это Evil Twin атака - фальшивая точка доступа.',
    realCase: 'В 2022 году в аэропорту Шереметьево злоумышленники создали сеть "Free_Airport_WiFi" и украли логины от соцсетей пассажиров.'
  },
  {
    id: 'mobile-hotspot',
    name: 'iPhone (Personal Hotspot)',
    signal: 60,
    security: 'WPA3',
    icon: '📱',
    isSafe: true,
    danger: null,
    realCase: null
  }
];

function WifiSelection({ onComplete }) {
  const [selected, setSelected] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleSelect = (network) => {
    setSelected(network);
    setShowExplanation(true);
  };

  const handleNext = () => {
    const score = selected.isSafe ? 20 : 0;
    onComplete({ score, max: 20, choice: selected.id });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-green-400 font-mono text-sm mb-2"
        >
          $ SCANNING FOR WIFI NETWORKS...
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-green-400 font-mono text-lg"
        >
          $ FOUND {wifiNetworks.length} NETWORKS
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-gray-400 font-mono text-sm mt-2"
        >
          $ SELECT A NETWORK TO CONNECT:
        </motion.div>
      </div>

      {/* Network List */}
      <div className="flex-1 space-y-3 overflow-y-auto">
        {wifiNetworks.map((network, index) => (
          <motion.button
            key={network.id}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 + 1 }}
            onClick={() => handleSelect(network)}
            disabled={showExplanation}
            className={`w-full p-4 rounded-lg border-2 font-mono text-left transition-all ${
              selected?.id === network.id
                ? network.isSafe
                  ? 'bg-green-900/30 border-green-500'
                  : 'bg-red-900/30 border-red-500'
                : 'bg-gray-900 border-gray-700 hover:border-green-500/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{network.icon}</span>
                <div>
                  <div className="text-green-400 font-bold">{network.name}</div>
                  <div className="text-gray-400 text-sm">
                    Signal: {network.signal}% | Security: {network.security}
                  </div>
                </div>
              </div>
              {selected?.id === network.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`px-3 py-1 rounded text-sm ${
                    network.isSafe ? 'bg-green-500 text-black' : 'bg-red-500 text-white'
                  }`}
                >
                  {network.isSafe ? 'SAFE' : 'DANGEROUS'}
                </motion.div>
              )}
            </div>
          </motion.button>
        ))}
      </div>

      {/* Explanation */}
      {showExplanation && selected && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-4 p-4 rounded-lg border ${
            selected.isSafe
              ? 'bg-green-900/20 border-green-500/50'
              : 'bg-red-900/20 border-red-500/50'
          }`}
        >
          <div className="text-green-400 font-mono text-sm mb-2">
            $ ANALYSIS:
          </div>
          {selected.danger && (
            <div className="text-red-400 font-mono text-sm mb-3">
              ⚠ {selected.danger}
            </div>
          )}
          {selected.isSafe && (
            <div className="text-green-400 font-mono text-sm mb-3">
              ✓ Это безопасная сеть с шифрованием.
            </div>
          )}
          {selected.realCase && (
            <div className="text-gray-400 font-mono text-xs border-t border-gray-700 pt-3 mt-3">
              📰 REAL CASE: {selected.realCase}
            </div>
          )}
        </motion.div>
      )}

      {/* Next Button */}
      {showExplanation && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={handleNext}
          className="mt-4 w-full py-3 bg-green-500 text-black font-mono font-bold rounded-lg hover:bg-green-400 transition"
        >
          $ CONTINUE TO NEXT STAGE
        </motion.button>
      )}
    </div>
  );
}

export default WifiSelection;
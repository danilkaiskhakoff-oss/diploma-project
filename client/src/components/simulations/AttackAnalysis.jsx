import { useState } from 'react';
import { motion } from 'framer-motion';

const attackTypes = [
  {
    id: 'udp-flood',
    name: 'UDP Flood',
    description: 'Перегрузка канала UDP-пакетами',
    icon: '📡',
    packets: [
      { protocol: 'UDP', src: '185.234.72.x', dst: '10.0.0.1', port: 53, size: '1400 bytes', flags: '-' },
      { protocol: 'UDP', src: '91.234.56.x', dst: '10.0.0.1', port: 80, size: '1400 bytes', flags: '-' },
      { protocol: 'UDP', src: '45.67.89.x', dst: '10.0.0.1', port: 443, size: '1400 bytes', flags: '-' },
      { protocol: 'UDP', src: '103.45.67.x', dst: '10.0.0.1', port: 123, size: '1400 bytes', flags: '-' },
      { protocol: 'UDP', src: '78.90.12.x', dst: '10.0.0.1', port: 5060, size: '1400 bytes', flags: '-' }
    ],
    pattern: 'Большие UDP пакеты на случайные порты. Нет TCP handshake.',
    correct: true
  },
  {
    id: 'syn-flood',
    name: 'SYN Flood',
    description: 'Перегрузка таблицы соединений',
    icon: '🔄',
    packets: [
      { protocol: 'TCP', src: '185.234.72.x', dst: '10.0.0.1', port: 80, size: '60 bytes', flags: 'SYN' },
      { protocol: 'TCP', src: '91.234.56.x', dst: '10.0.0.1', port: 80, size: '60 bytes', flags: 'SYN' },
      { protocol: 'TCP', src: '45.67.89.x', dst: '10.0.0.1', port: 443, size: '60 bytes', flags: 'SYN' },
      { protocol: 'TCP', src: '103.45.67.x', dst: '10.0.0.1', port: 80, size: '60 bytes', flags: 'SYN' },
      { protocol: 'TCP', src: '78.90.12.x', dst: '10.0.0.1', port: 443, size: '60 bytes', flags: 'SYN' }
    ],
    pattern: 'Только SYN флаги, нет SYN-ACK, нет ACK. Half-open соединения.',
    correct: false
  },
  {
    id: 'http-flood',
    name: 'HTTP Flood',
    description: 'Перегрузка на уровне приложений',
    icon: '🌐',
    packets: [
      { protocol: 'HTTP', src: '185.234.72.x', dst: '10.0.0.1', port: 80, size: '500 bytes', flags: 'GET /api/search' },
      { protocol: 'HTTP', src: '91.234.56.x', dst: '10.0.0.1', port: 80, size: '500 bytes', flags: 'GET /api/search' },
      { protocol: 'HTTP', src: '45.67.89.x', dst: '10.0.0.1', port: 80, size: '500 bytes', flags: 'GET /api/search' },
      { protocol: 'HTTP', src: '103.45.67.x', dst: '10.0.0.1', port: 80, size: '500 bytes', flags: 'GET /api/search' },
      { protocol: 'HTTP', src: '78.90.12.x', dst: '10.0.0.1', port: 80, size: '500 bytes', flags: 'GET /api/search' }
    ],
    pattern: 'HTTP GET запросы на одну страницу. Выглядят как легитимный трафик.',
    correct: false
  }
];

function AttackAnalysis({ onComplete }) {
  const [selectedType, setSelectedType] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [viewedPackets, setViewedPackets] = useState([]);

  const handleSelect = (typeId) => {
    setSelectedType(typeId);
    setShowExplanation(true);
  };

  const handleNext = () => {
    const isCorrect = selectedType === 'udp-flood';
    const score = isCorrect ? 25 : 5;
    onComplete({ score, max: 25, type: selectedType });
  };

  const handleViewPackets = (typeId) => {
    if (!viewedPackets.includes(typeId)) {
      setViewedPackets(prev => [...prev, typeId]);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-950">
      {/* Header */}
      <div className="bg-gray-900 px-6 py-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Анализ типа атаки</h2>
            <p className="text-gray-400 text-sm">Изучите пакеты и определите тип DDoS</p>
          </div>
          <div className="px-3 py-1 bg-red-500/20 rounded-full">
            <span className="text-red-400 text-sm font-medium">DDoS Active</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Instructions */}
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 mb-6">
          <p className="text-gray-300 text-sm">
            Сервер подвергается DDoS-атаке. Проанализируйте захваченные пакеты и определите тип атаки.
            Нажмите на тип атаки, чтобы увидеть примеры пакетов.
          </p>
        </div>

        {/* Attack Type Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {attackTypes.map((type, index) => (
            <motion.button
              key={type.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => {
                handleSelect(type.id);
                handleViewPackets(type.id);
              }}
              className={`p-5 rounded-xl border-2 text-left transition-all ${
                showExplanation
                  ? type.correct
                    ? 'bg-green-900/30 border-green-500'
                    : selectedType === type.id
                    ? 'bg-red-900/30 border-red-500'
                    : 'bg-gray-900 border-gray-700'
                  : viewedPackets.includes(type.id)
                  ? 'bg-blue-900/20 border-blue-500'
                  : 'bg-gray-900 border-gray-700 hover:border-gray-600'
              }`}
            >
              <div className="text-3xl mb-3">{type.icon}</div>
              <h3 className="font-bold text-white mb-1">{type.name}</h3>
              <p className="text-sm text-gray-400">{type.description}</p>
              {viewedPackets.includes(type.id) && (
                <div className="mt-3 text-xs text-blue-400">Пакеты просмотрены</div>
              )}
            </motion.button>
          ))}
        </div>

        {/* Packet Details */}
        {selectedType && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900 rounded-xl p-6 border border-gray-800 mb-6"
          >
            <h3 className="text-lg font-bold text-white mb-4">
              Захваченные пакеты — {attackTypes.find(t => t.id === selectedType).name}
            </h3>

            {/* Packet Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-2 px-3 text-gray-400 font-medium">Protocol</th>
                    <th className="text-left py-2 px-3 text-gray-400 font-medium">Source</th>
                    <th className="text-left py-2 px-3 text-gray-400 font-medium">Destination</th>
                    <th className="text-left py-2 px-3 text-gray-400 font-medium">Port</th>
                    <th className="text-left py-2 px-3 text-gray-400 font-medium">Size</th>
                    <th className="text-left py-2 px-3 text-gray-400 font-medium">Flags</th>
                  </tr>
                </thead>
                <tbody>
                  {attackTypes.find(t => t.id === selectedType).packets.map((pkt, i) => (
                    <tr key={i} className="border-b border-gray-800 font-mono text-xs">
                      <td className="py-2 px-3 text-green-400">{pkt.protocol}</td>
                      <td className="py-2 px-3 text-gray-300">{pkt.src}</td>
                      <td className="py-2 px-3 text-gray-300">{pkt.dst}</td>
                      <td className="py-2 px-3 text-yellow-400">{pkt.port}</td>
                      <td className="py-2 px-3 text-gray-300">{pkt.size}</td>
                      <td className="py-2 px-3 text-red-400">{pkt.flags}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pattern Analysis */}
            <div className="mt-4 p-4 bg-gray-950 rounded-lg border border-gray-800">
              <p className="text-sm text-gray-300">
                <span className="text-blue-400 font-medium">Паттерн: </span>
                {attackTypes.find(t => t.id === selectedType).pattern}
              </p>
            </div>

            {/* Explanation */}
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`mt-4 p-4 rounded-lg border ${
                  selectedType === 'udp-flood'
                    ? 'bg-green-900/30 border-green-800 text-green-300'
                    : 'bg-red-900/30 border-red-800 text-red-300'
                }`}
              >
                <p className="font-medium mb-2">
                  {selectedType === 'udp-flood' ? '✓ Правильно! Это UDP Flood!' : '✗ Неверно!'}
                </p>
                <p className="text-sm">
                  {selectedType === 'udp-flood' 
                    ? 'Большие UDP пакеты на случайные порты — классический признак UDP Flood. Атакующие пытаются перегрузить канал.'
                    : 'Это не правильный ответ. Обратите внимание на протокол, флаги и размер пакетов.'}
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>

      {/* Footer */}
      {showExplanation && (
        <div className="bg-gray-900 border-t border-gray-800 px-6 py-4">
          <button
            onClick={handleNext}
            className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
          >
            Перейти к настройке защиты →
          </button>
        </div>
      )}
    </div>
  );
}

export default AttackAnalysis;

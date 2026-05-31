import { useState } from 'react';
import { motion } from 'framer-motion';

const trafficData = [
  {
    id: 1,
    type: 'HTTP',
    url: 'http://bank.com/login',
    data: 'user=admin&pass=123456',
    isEncrypted: false,
    isDangerous: true,
    explanation: 'HTTP не шифрует данные! Логин и пароль видны в открытом виде.'
  },
  {
    id: 2,
    type: 'HTTPS',
    url: 'https://google.com/search',
    data: '[ENCRYPTED]',
    isEncrypted: true,
    isDangerous: false,
    explanation: 'HTTPS шифрует данные. Хакер видит только зашифрованный трафик.'
  },
  {
    id: 3,
    type: 'HTTP',
    url: 'http://social.com/messages',
    data: 'message=Привет!&to=friend',
    isEncrypted: false,
    isDangerous: true,
    explanation: 'Личные сообщения передаются в открытом виде!'
  },
  {
    id: 4,
    type: 'HTTPS',
    url: 'https://mail.com/inbox',
    data: '[ENCRYPTED]',
    isEncrypted: true,
    isDangerous: false,
    explanation: 'Почта защищена HTTPS. Данные в безопасности.'
  },
  {
    id: 5,
    type: 'DNS',
    url: 'Query: bank.com',
    data: '192.168.1.100',
    isEncrypted: false,
    isDangerous: true,
    explanation: 'DNS-запросы не шифруются. Хакер знает, какие сайты вы посещаете.'
  }
];

function TrafficSniffing({ onComplete }) {
  const [revealed, setRevealed] = useState([]);
  const [showExplanation, setShowExplanation] = useState(null);

  const revealedCount = revealed.length;
  const dangerousCount = trafficData.filter(t => t.isDangerous).length;

  const handleReveal = (id) => {
    if (revealed.includes(id)) return;
    setRevealed(prev => [...prev, id]);
    setShowExplanation(id);
    setTimeout(() => setShowExplanation(null), 3000);
  };

  const handleNext = () => {
    const correctRevealed = trafficData
      .filter(t => t.isDangerous && revealed.includes(t.id))
      .length;
    const score = correctRevealed * 10;
    onComplete({ score: Math.min(score, 30), max: 30 });
  };

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 px-6 py-4 border-b border-gray-700">
        <h2 className="text-xl font-bold text-white">Перехват трафика</h2>
        <p className="text-gray-400 text-sm">Хакер перехватывает ваш трафик в публичном Wi-Fi. Найдите опасные данные:</p>
      </div>

      {/* Traffic List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-3">
        {trafficData.map((item, index) => (
          <motion.button
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => handleReveal(item.id)}
            className={`w-full p-4 rounded-lg border-2 text-left font-mono text-sm transition-all ${
              revealed.includes(item.id)
                ? item.isDangerous
                  ? 'bg-red-900/30 border-red-500'
                  : 'bg-green-900/30 border-green-500'
                : 'bg-gray-800 border-gray-700 hover:border-gray-600'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`px-2 py-1 rounded text-xs ${
                item.type === 'HTTPS' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
              }`}>
                {item.type}
              </span>
              {revealed.includes(item.id) && (
                <span className={`px-2 py-1 rounded text-xs ${
                  item.isDangerous ? 'bg-red-500 text-white' : 'bg-green-500 text-black'
                }`}>
                  {item.isDangerous ? 'ОПАСНО' : 'БЕЗОПАСНО'}
                </span>
              )}
            </div>
            <div className="text-gray-300 mb-1">{item.url}</div>
            <div className={`text-xs ${
              revealed.includes(item.id)
                ? item.isDangerous ? 'text-red-400' : 'text-green-400'
                : 'text-gray-500'
            }`}>
              {revealed.includes(item.id) ? item.data : 'Нажмите, чтобы раскрыть...'}
            </div>

            {/* Explanation */}
            {showExplanation === item.id && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-3 pt-3 border-t border-gray-700 text-xs text-gray-400"
              >
                {item.explanation}
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>

      {/* Progress & Next Button */}
      <div className="bg-gray-800 border-t border-gray-700 px-6 py-4">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>Найдено опасных данных</span>
          <span>{revealedCount}/{dangerousCount}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
          <motion.div
            className="h-2 rounded-full bg-red-500"
            initial={{ width: 0 }}
            animate={{ width: `${(revealedCount / dangerousCount) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <button
          onClick={handleNext}
          disabled={revealedCount === 0}
          className={`w-full py-3 font-medium rounded-lg transition ${
            revealedCount > 0
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-gray-700 text-gray-500 cursor-not-allowed'
          }`}
        >
          Продолжить →
        </button>
      </div>
    </div>
  );
}

export default TrafficSniffing;

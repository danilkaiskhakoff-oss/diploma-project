import { useState } from 'react';
import { motion } from 'framer-motion';

const logEntries = [
  {
    id: 1,
    timestamp: '14:23:01',
    type: 'INFO',
    message: 'Connection established to cafe-router.local',
    isSuspicious: false,
    explanation: 'Нормальное подключение к роутеру кафе.'
  },
  {
    id: 2,
    timestamp: '14:23:05',
    type: 'WARNING',
    message: 'ARP response from 192.168.1.100 (MAC: aa:bb:cc:dd:ee:ff) - DUPLICATE IP DETECTED',
    isSuspicious: true,
    explanation: 'ARP Spoofing! Хакер подменил MAC-адрес роутера для перехвата трафика.'
  },
  {
    id: 3,
    timestamp: '14:23:08',
    type: 'INFO',
    message: 'DNS query: google.com → 142.250.74.46',
    isSuspicious: false,
    explanation: 'Обычный DNS-запрос к Google.'
  },
  {
    id: 4,
    timestamp: '14:23:12',
    type: 'ERROR',
    message: 'SSL certificate mismatch for bank.example.com - Expected: CN=bank.example.com, Got: CN=*.evil.com',
    isSuspicious: true,
    explanation: 'DNS Spoofing! Хакер перенаправил трафик банка на фальшивый сайт.'
  },
  {
    id: 5,
    timestamp: '14:23:15',
    type: 'INFO',
    message: 'HTTP GET /login?user=admin&pass=123456 → 192.168.1.100',
    isSuspicious: true,
    explanation: 'HTTP трафик перехвачен! Логин и пароль видны в открытом виде.'
  },
  {
    id: 6,
    timestamp: '14:23:18',
    type: 'INFO',
    message: 'HTTPS GET /dashboard → 104.21.45.67 [ENCRYPTED]',
    isSuspicious: false,
    explanation: 'HTTPS трафик зашифрован. Хакер не может прочитать данные.'
  },
  {
    id: 7,
    timestamp: '14:23:22',
    type: 'WARNING',
    message: 'Unusual outbound connection to 185.220.101.45:4444 (known C2 server)',
    isSuspicious: true,
    explanation: 'Подозрительное соединение с известным C2-сервером хакера!'
  },
  {
    id: 8,
    timestamp: '14:23:25',
    type: 'INFO',
    message: 'Cookie: session_id=abc123def456 sent to 192.168.1.100',
    isSuspicious: true,
    explanation: 'Куки сессии перехвачены! Хакер может использовать их для входа.'
  }
];

function LogAnalysis({ onComplete }) {
  const [flagged, setFlagged] = useState({});
  const [showExplanation, setShowExplanation] = useState(null);

  const flaggedCount = Object.values(flagged).filter(v => v).length;
  const suspiciousCount = logEntries.filter(e => e.isSuspicious).length;

  const handleFlag = (id) => {
    setFlagged(prev => ({ ...prev, [id]: !prev[id] }));
    setShowExplanation(id);
    setTimeout(() => setShowExplanation(null), 4000);
  };

  const handleNext = () => {
    const correctFlags = logEntries
      .filter(e => e.isSuspicious && flagged[e.id])
      .length;
    const incorrectFlags = logEntries
      .filter(e => !e.isSuspicious && flagged[e.id])
      .length;
    const score = correctFlags - incorrectFlags;
    onComplete({ score: Math.max(0, score), max: suspiciousCount });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-green-400 font-mono text-lg mb-2"
        >
          $ ANALYZING NETWORK LOGS...
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-gray-400 font-mono text-sm"
        >
          $ FLAG SUSPICIOUS ENTRIES:
        </motion.div>
      </div>

      {/* Log Terminal */}
      <div className="flex-1 overflow-y-auto bg-black rounded-lg border border-green-500/30 p-4 font-mono text-sm">
        <div className="text-green-400 mb-4">
          $ cat /var/log/network.log
        </div>
        <div className="space-y-2">
          {logEntries.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-3 rounded border cursor-pointer transition-all ${
                flagged[entry.id]
                  ? entry.isSuspicious
                    ? 'bg-red-900/30 border-red-500'
                    : 'bg-yellow-900/30 border-yellow-500'
                  : 'bg-gray-900 border-gray-700 hover:border-green-500/50'
              }`}
              onClick={() => handleFlag(entry.id)}
            >
              <div className="flex items-start gap-3">
                <span className="text-gray-500 text-xs">{entry.timestamp}</span>
                <span className={`text-xs px-2 py-0.5 rounded ${
                  entry.type === 'ERROR'
                    ? 'bg-red-500 text-white'
                    : entry.type === 'WARNING'
                    ? 'bg-yellow-500 text-black'
                    : 'bg-green-500 text-black'
                }`}>
                  {entry.type}
                </span>
                <span className={`flex-1 ${
                  flagged[entry.id]
                    ? entry.isSuspicious ? 'text-red-400' : 'text-yellow-400'
                    : 'text-gray-300'
                }`}>
                  {entry.message}
                </span>
                {flagged[entry.id] && (
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    entry.isSuspicious ? 'bg-red-500 text-white' : 'bg-yellow-500 text-black'
                  }`}>
                    {entry.isSuspicious ? 'SUSPICIOUS' : 'FALSE POSITIVE'}
                  </span>
                )}
              </div>
              {showExplanation === entry.id && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-2 text-xs text-gray-400 border-t border-gray-700 pt-2"
                >
                  {entry.explanation}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Progress */}
      <div className="mt-4 bg-gray-900 rounded-lg p-3 border border-gray-700">
        <div className="flex justify-between text-sm text-gray-400 font-mono mb-1">
          <span>SUSPICIOUS ENTRIES FOUND</span>
          <span>{flaggedCount}/{suspiciousCount}</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2">
          <motion.div
            className="h-2 rounded-full bg-green-500"
            initial={{ width: 0 }}
            animate={{ width: `${(flaggedCount / suspiciousCount) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Next Button */}
      {flaggedCount > 0 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={handleNext}
          className="mt-4 w-full py-3 bg-green-500 text-black font-mono font-bold rounded-lg hover:bg-green-400 transition"
        >
          $ CONTINUE TO QUIZ
        </motion.button>
      )}
    </div>
  );
}

export default LogAnalysis;
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const interceptedData = [
  {
    id: 1,
    type: 'HTTP Request',
    data: 'GET /login?user=admin&pass=123456',
    isSensitive: true,
    explanation: 'HTTP не шифрует данные! Логин и пароль видны в открытом виде.'
  },
  {
    id: 2,
    type: 'Cookie',
    data: 'session_id=abc123def456; user_token=xyz789',
    isSensitive: true,
    explanation: 'Куки сессии перехвачены. Хакер может использовать их для входа в ваш аккаунт.'
  },
  {
    id: 3,
    type: 'HTTPS Request',
    data: 'GET /dashboard [ENCRYPTED]',
    isSensitive: false,
    explanation: 'HTTPS шифрует данные. Хакер видит только зашифрованный трафик.'
  },
  {
    id: 4,
    type: 'DNS Query',
    data: 'Query: bank.example.com → 192.168.1.100',
    isSensitive: true,
    explanation: 'DNS-запросы не шифруются. Хакер знает, какие сайты вы посещаете.'
  },
  {
    id: 5,
    type: 'Email',
    data: 'From: user@example.com\nTo: boss@company.com\nSubject: Confidential Report\nBody: [ENCRYPTED]',
    isSensitive: false,
    explanation: 'Если используется HTTPS для почты, содержимое зашифровано.'
  }
];

const networkNodes = [
  { id: 'user', label: 'YOUR DEVICE', x: 10, y: 50, icon: '' },
  { id: 'router', label: 'CAFE ROUTER', x: 35, y: 50, icon: '' },
  { id: 'hacker', label: 'HACKER', x: 35, y: 20, icon: '' },
  { id: 'internet', label: 'INTERNET', x: 60, y: 50, icon: '' },
  { id: 'server', label: 'TARGET SERVER', x: 85, y: 50, icon: '' }
];

function MITMVisualization({ wifiChoice, onComplete }) {
  const [revealedData, setRevealedData] = useState([]);
  const [currentDataIndex, setCurrentDataIndex] = useState(0);
  const [showExplanation, setShowExplanation] = useState(null);
  const [attackProgress, setAttackProgress] = useState(0);

  const isUnsafeWifi = wifiChoice === 'free-cafe' || wifiChoice === 'free-5g';

  useEffect(() => {
    if (isUnsafeWifi) {
      const timer = setInterval(() => {
        setAttackProgress(prev => {
          if (prev >= 100) {
            clearInterval(timer);
            return 100;
          }
          return prev + 2;
        });
      }, 100);
      return () => clearInterval(timer);
    }
  }, [isUnsafeWifi]);

  const handleRevealData = (index) => {
    if (revealedData.includes(index)) return;
    setRevealedData(prev => [...prev, index]);
    setShowExplanation(index);
    setTimeout(() => setShowExplanation(null), 4000);
  };

  const handleNext = () => {
    const score = revealedData.filter(i => interceptedData[i].isSensitive).length * 6;
    onComplete({ score: Math.min(score, 30), max: 30 });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-red-400 font-mono text-sm mb-2 animate-pulse"
        >
          ⚠ MITM ATTACK IN PROGRESS
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-green-400 font-mono text-lg"
        >
          $ INTERCEPTING TRAFFIC...
        </motion.div>
      </div>

      {/* Network Visualization */}
      <div className="bg-gray-900 rounded-lg p-4 mb-4 border border-red-500/30 relative overflow-hidden">
        {/* Grid Background */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'linear-gradient(rgba(255, 0, 0, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 0, 0, 0.3) 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        />

        {/* Attack Progress Bar */}
        {isUnsafeWifi && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gray-800">
            <motion.div
              className="h-full bg-red-500"
              initial={{ width: 0 }}
              animate={{ width: `${attackProgress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        )}

        {/* Network Nodes */}
        <div className="relative h-48">
          {networkNodes.map((node) => (
            <motion.div
              key={node.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: node.x / 100 }}
              className="absolute flex flex-col items-center"
              style={{ left: `${node.x}%`, top: `${node.y}%`, transform: 'translate(-50%, -50%)' }}
            >
              <div className={`text-3xl mb-2 ${node.id === 'hacker' ? 'animate-pulse' : ''}`}>
                {node.icon}
              </div>
              <div className={`text-xs font-mono px-2 py-1 rounded ${
                node.id === 'hacker'
                  ? 'bg-red-900/50 text-red-400 border border-red-500'
                  : node.id === 'user'
                  ? 'bg-green-900/50 text-green-400 border border-green-500'
                  : 'bg-gray-800 text-gray-400 border border-gray-600'
              }`}>
                {node.label}
              </div>
            </motion.div>
          ))}

          {/* Connection Lines */}
          <svg className="absolute inset-0 w-full h-full">
            {/* User to Router */}
            <motion.line
              x1="10%" y1="50%" x2="35%" y2="50%"
              stroke={isUnsafeWifi ? "#ff0000" : "#00ff00"}
              strokeWidth="2"
              strokeDasharray="5,5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1 }}
            />
            {/* Router to Internet */}
            <motion.line
              x1="35%" y1="50%" x2="60%" y2="50%"
              stroke={isUnsafeWifi ? "#ff0000" : "#00ff00"}
              strokeWidth="2"
              strokeDasharray="5,5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            />
            {/* Internet to Server */}
            <motion.line
              x1="60%" y1="50%" x2="85%" y2="50%"
              stroke="#00ff00"
              strokeWidth="2"
              strokeDasharray="5,5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: 1 }}
            />
            {/* Hacker Intercept Line */}
            {isUnsafeWifi && (
              <motion.line
                x1="35%" y1="50%" x2="35%" y2="20%"
                stroke="#ff0000"
                strokeWidth="2"
                strokeDasharray="5,5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
              />
            )}
          </svg>

          {/* Data Packets Animation */}
          {isUnsafeWifi && (
            <>
              <motion.div
                className="absolute w-3 h-3 bg-red-500 rounded-full"
                animate={{
                  left: ['10%', '35%', '35%', '60%', '85%'],
                  top: ['50%', '50%', '20%', '50%', '50%']
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <motion.div
                className="absolute w-3 h-3 bg-red-500 rounded-full"
                animate={{
                  left: ['10%', '35%', '35%', '60%', '85%'],
                  top: ['50%', '50%', '20%', '50%', '50%']
                }}
                transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
              />
            </>
          )}
        </div>

        {/* Warning */}
        {isUnsafeWifi && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="mt-4 p-3 bg-red-900/30 rounded border border-red-500/50"
          >
            <p className="text-red-400 font-mono text-sm">
               WARNING: Traffic is being intercepted by hacker!
            </p>
          </motion.div>
        )}
      </div>

      {/* Intercepted Data */}
      <div className="flex-1 overflow-y-auto">
        <div className="text-green-400 font-mono text-sm mb-3">
          $ INTERCEPTED DATA PACKETS:
        </div>
        <div className="space-y-2">
          {interceptedData.map((data, index) => (
            <motion.button
              key={data.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + 2 }}
              onClick={() => handleRevealData(index)}
              className={`w-full p-3 rounded-lg border font-mono text-left transition-all ${
                revealedData.includes(index)
                  ? data.isSensitive
                    ? 'bg-red-900/30 border-red-500'
                    : 'bg-green-900/30 border-green-500'
                  : 'bg-gray-900 border-gray-700 hover:border-green-500/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-green-400 text-sm">{data.type}</div>
                  <div className={`text-xs mt-1 ${
                    revealedData.includes(index)
                      ? data.isSensitive ? 'text-red-400' : 'text-green-400'
                      : 'text-gray-500'
                  }`}>
                    {revealedData.includes(index) ? data.data : 'Click to reveal...'}
                  </div>
                </div>
                {revealedData.includes(index) && (
                  <div className={`px-2 py-1 rounded text-xs ${
                    data.isSensitive ? 'bg-red-500 text-white' : 'bg-green-500 text-black'
                  }`}>
                    {data.isSensitive ? 'SENSITIVE' : 'SAFE'}
                  </div>
                )}
              </div>
              {showExplanation === index && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-2 text-xs text-gray-400 border-t border-gray-700 pt-2"
                >
                  {data.explanation}
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Progress */}
      <div className="mt-4 bg-gray-900 rounded-lg p-3 border border-gray-700">
        <div className="flex justify-between text-sm text-gray-400 font-mono mb-1">
          <span>DATA ANALYZED</span>
          <span>{revealedData.length}/{interceptedData.length}</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2">
          <motion.div
            className="h-2 rounded-full bg-green-500"
            initial={{ width: 0 }}
            animate={{ width: `${(revealedData.length / interceptedData.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Next Button */}
      {revealedData.length > 0 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={handleNext}
          className="mt-4 w-full py-3 bg-green-500 text-black font-mono font-bold rounded-lg hover:bg-green-400 transition"
        >
          $ CONTINUE TO PROTECTION STAGE
        </motion.button>
      )}
    </div>
  );
}

export default MITMVisualization;
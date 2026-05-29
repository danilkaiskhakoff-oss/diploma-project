import { useState } from 'react';
import { motion } from 'framer-motion';

const protections = [
  {
    id: 'vpn',
    label: 'VPN',
    description: 'Шифрует весь трафик между устройством и интернетом',
    icon: '',
    isCorrect: true,
    explanation: 'VPN создаёт зашифрованный туннель, делая перехват трафика невозможным.',
    effect: 'All traffic encrypted. Hacker sees only gibberish.'
  },
  {
    id: 'https',
    label: 'HTTPS Everywhere',
    description: 'Принудительное использование HTTPS для всех сайтов',
    icon: '',
    isCorrect: true,
    explanation: 'HTTPS шифрует данные между браузером и сервером.',
    effect: 'HTTP requests upgraded to HTTPS. Data protected.'
  },
  {
    id: 'firewall',
    label: 'Firewall',
    description: 'Блокирует подозрительный сетевой трафик',
    icon: '',
    isCorrect: true,
    explanation: 'Файрвол фильтрует входящий и исходящий трафик.',
    effect: 'Suspicious connections blocked. Network secured.'
  },
  {
    id: 'dns-over-https',
    label: 'DNS over HTTPS',
    description: 'Шифрует DNS-запросы',
    icon: '',
    isCorrect: true,
    explanation: 'DoH шифрует DNS-запросы, предотвращая перехват.',
    effect: 'DNS queries encrypted. Privacy restored.'
  },
  {
    id: 'ignore',
    label: 'Ignore Warnings',
    description: 'Игнорировать предупреждения безопасности',
    icon: '',
    isCorrect: false,
    explanation: 'Игнорирование предупреждений открывает дверь для атак!',
    effect: 'WARNING: System vulnerable!'
  },
  {
    id: 'disable-security',
    label: 'Disable Security',
    description: 'Отключить защиту для "скорости"',
    icon: '',
    isCorrect: false,
    explanation: 'Отключение защиты делает систему беззащитной!',
    effect: 'CRITICAL: All security disabled!'
  }
];

function ProtectionPanel({ onComplete }) {
  const [enabled, setEnabled] = useState({});
  const [showExplanation, setShowExplanation] = useState(null);
  const [simulationResult, setSimulationResult] = useState(null);

  const enabledCount = Object.values(enabled).filter(v => v).length;

  const handleToggle = (id) => {
    setEnabled(prev => ({ ...prev, [id]: !prev[id] }));
    setShowExplanation(id);
    setTimeout(() => setShowExplanation(null), 3000);
  };

  const handleRunSimulation = () => {
    const correctEnabled = protections.filter(p => p.isCorrect && enabled[p.id]).length;
    const incorrectEnabled = protections.filter(p => !p.isCorrect && enabled[p.id]).length;
    const score = correctEnabled - incorrectEnabled;

    setSimulationResult({
      protected: correctEnabled >= 3,
      correctEnabled,
      incorrectEnabled
    });

    setTimeout(() => {
      onComplete({ score: Math.max(0, score), max: protections.filter(p => p.isCorrect).length });
    }, 3000);
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
          $ ACTIVATING PROTECTION MEASURES...
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-gray-400 font-mono text-sm"
        >
          $ SELECT SECURITY MEASURES TO ENABLE:
        </motion.div>
      </div>

      {/* Protection Grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-2 gap-3">
          {protections.map((protection, index) => (
            <motion.button
              key={protection.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleToggle(protection.id)}
              className={`p-4 rounded-lg border-2 font-mono text-left transition-all ${
                enabled[protection.id]
                  ? protection.isCorrect
                    ? 'bg-green-900/30 border-green-500'
                    : 'bg-red-900/30 border-red-500'
                  : 'bg-gray-900 border-gray-700 hover:border-green-500/50'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{protection.icon}</span>
                <span className="text-green-400 font-bold">{protection.label}</span>
              </div>
              <p className="text-xs text-gray-400">{protection.description}</p>
              {showExplanation === protection.id && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`text-xs mt-2 ${
                    protection.isCorrect ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {protection.explanation}
                </motion.p>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Simulation Result */}
      {simulationResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-4 p-4 rounded-lg border font-mono ${
            simulationResult.protected
              ? 'bg-green-900/30 border-green-500'
              : 'bg-red-900/30 border-red-500'
          }`}
        >
          <div className="text-lg font-bold mb-2">
            {simulationResult.protected ? '✓ PROTECTION ACTIVE' : '⚠ SYSTEM VULNERABLE'}
          </div>
          <div className="text-sm text-gray-400">
            <div>Correct protections: {simulationResult.correctEnabled}</div>
            <div>Incorrect choices: {simulationResult.incorrectEnabled}</div>
          </div>
          <div className="mt-2 text-xs text-green-400">
            {protections
              .filter(p => p.isCorrect && enabled[p.id])
              .map(p => `$ ${p.effect}`)
              .join('\n')}
          </div>
        </motion.div>
      )}

      {/* Progress */}
      <div className="mt-4 bg-gray-900 rounded-lg p-3 border border-gray-700">
        <div className="flex justify-between text-sm text-gray-400 font-mono mb-1">
          <span>MEASURES ENABLED</span>
          <span>{enabledCount}/{protections.length}</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2">
          <motion.div
            className="h-2 rounded-full bg-green-500"
            initial={{ width: 0 }}
            animate={{ width: `${(enabledCount / protections.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Run Simulation Button */}
      {!simulationResult && enabledCount > 0 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={handleRunSimulation}
          className="mt-4 w-full py-3 bg-green-500 text-black font-mono font-bold rounded-lg hover:bg-green-400 transition"
        >
          $ RUN SIMULATION
        </motion.button>
      )}
    </div>
  );
}

export default ProtectionPanel;
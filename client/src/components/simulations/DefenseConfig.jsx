import { useState } from 'react';
import { motion } from 'framer-motion';

const defenseOptions = [
  {
    id: 'cdn',
    name: 'CDN (Cloudflare)',
    description: 'Распределение трафика через CDN',
    cost: 3000,
    effectiveness: { 'udp-flood': 60, 'syn-flood': 70, 'http-flood': 90 },
    icon: ''
  },
  {
    id: 'rate-limiting',
    name: 'Rate Limiting',
    description: 'Ограничение запросов на IP',
    cost: 1000,
    effectiveness: { 'udp-flood': 30, 'syn-flood': 50, 'http-flood': 80 },
    icon: ''
  },
  {
    id: 'syn-cookies',
    name: 'SYN Cookies',
    description: 'Защита от SYN Flood',
    cost: 500,
    effectiveness: { 'udp-flood': 0, 'syn-flood': 95, 'http-flood': 0 },
    icon: ''
  },
  {
    id: 'blackhole',
    name: 'Blackhole Routing',
    description: 'Дроп всего подозрительного трафика',
    cost: 0,
    effectiveness: { 'udp-flood': 100, 'syn-flood': 100, 'http-flood': 100 },
    icon: '',
    warning: 'Блокирует ВЕСЬ трафик, включая легитимный!'
  },
  {
    id: 'geo-blocking',
    name: 'Geo-blocking',
    description: 'Блокировка стран-источников',
    cost: 1500,
    effectiveness: { 'udp-flood': 50, 'syn-flood': 50, 'http-flood': 40 },
    icon: ''
  },
  {
    id: 'anycast',
    name: 'Anycast сеть',
    description: 'Распределение через несколько ЦОД',
    cost: 5000,
    effectiveness: { 'udp-flood': 80, 'syn-flood': 75, 'http-flood': 85 },
    icon: ''
  }
];

const BUDGET = 10000;

function DefenseConfig({ attackType, onComplete }) {
  const [selectedDefenses, setSelectedDefenses] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [totalCost, setTotalCost] = useState(0);
  const [totalEffectiveness, setTotalEffectiveness] = useState(0);

  const currentAttack = attackType || 'udp-flood';

  const handleToggle = (defense) => {
    if (selectedDefenses.find(d => d.id === defense.id)) {
      const newSelected = selectedDefenses.filter(d => d.id !== defense.id);
      setSelectedDefenses(newSelected);
      const cost = newSelected.reduce((sum, d) => sum + d.cost, 0);
      setTotalCost(cost);
      const eff = calculateEffectiveness(newSelected);
      setTotalEffectiveness(eff);
    } else {
      const cost = totalCost + defense.cost;
      if (cost > BUDGET) return;
      
      const newSelected = [...selectedDefenses, defense];
      setSelectedDefenses(newSelected);
      setTotalCost(cost);
      const eff = calculateEffectiveness(newSelected);
      setTotalEffectiveness(eff);
    }
  };

  const calculateEffectiveness = (defenses) => {
    if (defenses.length === 0) return 0;
    
    let total = 0;
    defenses.forEach(d => {
      total += d.effectiveness[currentAttack] || 0;
    });
    
    return Math.min(Math.round(total / defenses.length + (defenses.length * 5)), 100);
  };

  const handleActivate = () => {
    const effectiveness = calculateEffectiveness(selectedDefenses);
    const costRatio = totalCost / BUDGET;
    const score = Math.round(effectiveness * (1 - costRatio * 0.3));
    
    setShowResults(true);
    setTimeout(() => {
      onComplete({ score: Math.min(score, 25), max: 25 });
    }, 2000);
  };

  const isSelected = (id) => selectedDefenses.find(d => d.id === id);

  return (
    <div className="h-full flex flex-col bg-gray-950">
      {/* Header */}
      <div className="bg-gray-900 px-6 py-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Настройка защиты</h2>
            <p className="text-gray-400 text-sm">Выберите меры защиты в рамках бюджета</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400">Бюджет</div>
            <div className={`text-lg font-mono font-bold ${totalCost > BUDGET * 0.8 ? 'text-red-400' : 'text-green-400'}`}>
              ${(BUDGET - totalCost).toLocaleString()} / ${BUDGET.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Attack Info */}
        <div className="bg-red-900/20 border border-red-800 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
              <span className="text-red-400 text-xl"></span>
            </div>
            <div>
              <h3 className="font-bold text-red-400">Активная атака: {
                currentAttack === 'udp-flood' ? 'UDP Flood' :
                currentAttack === 'syn-flood' ? 'SYN Flood' : 'HTTP Flood'
              }</h3>
              <p className="text-sm text-red-300">Выберите оптимальные меры защиты</p>
            </div>
          </div>
        </div>

        {/* Defense Options */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {defenseOptions.map((defense, index) => (
            <motion.button
              key={defense.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleToggle(defense)}
              disabled={totalCost + defense.cost > BUDGET && !isSelected(defense.id)}
              className={`p-5 rounded-xl border-2 text-left transition-all ${
                isSelected(defense.id)
                  ? 'bg-blue-900/30 border-blue-500'
                  : totalCost + defense.cost > BUDGET
                  ? 'bg-gray-900 border-gray-700 opacity-50 cursor-not-allowed'
                  : 'bg-gray-900 border-gray-700 hover:border-gray-600'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="text-2xl">{defense.icon}</div>
                <div className={`px-2 py-1 rounded text-xs font-medium ${
                  isSelected(defense.id) ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300'
                }`}>
                  ${defense.cost.toLocaleString()}
                </div>
              </div>
              <h3 className="font-bold text-white mb-1">{defense.name}</h3>
              <p className="text-sm text-gray-400 mb-3">{defense.description}</p>
              
              {defense.warning && (
                <div className="text-xs text-yellow-400 bg-yellow-500/10 p-2 rounded">
                  ⚠ {defense.warning}
                </div>
              )}

              {isSelected(defense.id) && (
                <div className="mt-3 text-xs text-blue-400">
                  Эффективность: {defense.effectiveness[currentAttack]}%
                </div>
              )}
            </motion.button>
          ))}
        </div>

        {/* Selected Defenses Summary */}
        {selectedDefenses.length > 0 && (
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <h3 className="text-sm font-medium text-gray-400 mb-3">Активные меры защиты:</h3>
            <div className="space-y-2">
              {selectedDefenses.map(defense => (
                <div key={defense.id} className="flex items-center justify-between text-sm">
                  <span className="text-white">{defense.name}</span>
                  <span className="text-green-400">{defense.effectiveness[currentAttack]}%</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-gray-800 flex justify-between">
              <span className="text-gray-400">Общая эффективность</span>
              <span className="text-lg font-bold text-green-400">{totalEffectiveness}%</span>
            </div>
          </div>
        )}

        {/* Results */}
        {showResults && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`mt-6 p-6 rounded-xl border text-center ${
              totalEffectiveness > 70
                ? 'bg-green-900/30 border-green-800'
                : totalEffectiveness > 40
                ? 'bg-yellow-900/30 border-yellow-800'
                : 'bg-red-900/30 border-red-800'
            }`}
          >
            <div className="text-4xl mb-3">
              {totalEffectiveness > 70 ? '🛡️' : totalEffectiveness > 40 ? '⚠️' : '💥'}
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              {totalEffectiveness > 70 ? 'Атака смягчена!' : totalEffectiveness > 40 ? 'Частичная защита' : 'Защита неэффективна'}
            </h3>
            <p className="text-gray-300">
              Эффективность: {totalEffectiveness}% • Стоимость: ${totalCost.toLocaleString()}
            </p>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      {!showResults && selectedDefenses.length > 0 && (
        <div className="bg-gray-900 border-t border-gray-800 px-6 py-4">
          <button
            onClick={handleActivate}
            className="w-full py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition"
          >
            Активировать защиту →
          </button>
        </div>
      )}
    </div>
  );
}

export default DefenseConfig;

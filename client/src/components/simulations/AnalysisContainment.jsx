import { useState } from 'react';
import { motion } from 'framer-motion';

const containmentOptions = [
  {
    id: 'isolate-systems',
    name: 'Изолировать заражённые системы',
    description: 'Отключить FS-01 и WS-042 от сети',
    effectiveness: 90,
    businessImpact: 40,
    cost: 'Средний',
    icon: '',
    details: 'Полная изоляция предотвратит распространение, но остановит работу отдела.'
  },
  {
    id: 'block-ips',
    name: 'Заблокировать IP атакующего',
    description: 'Добавить 185.234.72.15 в blacklist firewall',
    effectiveness: 60,
    businessImpact: 5,
    cost: 'Низкий',
    icon: '',
    details: 'Быстро и безопасно, но атакующий может использовать другие IP.'
  },
  {
    id: 'reset-passwords',
    name: 'Сбросить пароли',
    description: 'Принудительный сброс для всех учётных записей',
    effectiveness: 75,
    businessImpact: 60,
    cost: 'Высокий',
    icon: '',
    details: 'Остановит lateral movement, но все сотрудники потеряют доступ на 30 мин.'
  },
  {
    id: 'disable-external',
    name: 'Отключить внешние подключения',
    description: 'Временно заблокировать весь outbound трафик',
    effectiveness: 95,
    businessImpact: 90,
    cost: 'Критический',
    icon: '',
    details: 'Радикальная мера. Полностью остановит exfiltration, но парализует бизнес.'
  },
  {
    id: 'enable-edr',
    name: 'Усилить EDR мониторинг',
    description: 'Включить максимальный уровень детекции',
    effectiveness: 50,
    businessImpact: 10,
    cost: 'Низкий',
    icon: '',
    details: 'Даст больше данных для анализа, но не остановит атаку.'
  },
  {
    id: 'activate-backup',
    name: 'Активировать аварийный бэкап',
    description: 'Переключиться на резервные системы',
    effectiveness: 70,
    businessImpact: 30,
    cost: 'Средний',
    icon: '',
    details: 'Обеспечит continuity, но требует 2 часа на переключение.'
  }
];

function AnalysisContainment({ incidentType, onComplete }) {
  const [selectedMeasures, setSelectedMeasures] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const handleToggle = (option) => {
    if (selectedMeasures.find(m => m.id === option.id)) {
      setSelectedMeasures(prev => prev.filter(m => m.id !== option.id));
    } else {
      setSelectedMeasures(prev => [...prev, option]);
    }
  };

  const handleNext = () => {
    const totalEffectiveness = selectedMeasures.reduce((sum, m) => sum + m.effectiveness, 0) / Math.max(selectedMeasures.length, 1);
    const totalImpact = selectedMeasures.reduce((sum, m) => sum + m.businessImpact, 0);
    const impactRatio = totalImpact / (selectedMeasures.length * 100);
    
    const score = Math.round(totalEffectiveness * (1 - impactRatio * 0.4));
    
    setShowResults(true);
    setTimeout(() => {
      onComplete({ score: Math.min(score, 25), max: 25 });
    }, 2000);
  };

  const isSelected = (id) => selectedMeasures.find(m => m.id === id);
  const totalImpact = selectedMeasures.reduce((sum, m) => sum + m.businessImpact, 0);
  const avgEffectiveness = selectedMeasures.length > 0 
    ? Math.round(selectedMeasures.reduce((sum, m) => sum + m.effectiveness, 0) / selectedMeasures.length)
    : 0;

  return (
    <div className="h-full flex flex-col bg-gray-950">
      {/* Header */}
      <div className="bg-gray-900 px-6 py-4 border-b border-orange-900">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-orange-400 font-mono">Этап 2: Анализ и содерживание</h2>
            <p className="text-gray-400 text-sm font-mono">Выберите стратегию содерживания инцидента</p>
          </div>
          <div className="px-3 py-1 bg-orange-500/20 rounded-full border border-orange-500">
            <span className="text-orange-400 text-sm font-mono">CONTAINMENT PHASE</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Incident Summary */}
        <div className="bg-red-900/20 border border-red-800 rounded-xl p-4 mb-6">
          <h3 className="font-bold text-red-400 font-mono mb-2">Инцидент: {incidentType === 'ransomware' ? 'Ransomware Attack' : 'Data Breach'}</h3>
          <p className="text-sm text-red-300 font-mono">
            {incidentType === 'ransomware' 
              ? 'Ransomware на файловом сервере FS-01. Данные exfiltrated на 185.234.72.15.'
              : 'Обнаружена утечка данных через аномальный outbound трафик.'}
          </p>
        </div>

        {/* Instructions */}
        <div className="bg-gray-900/50 rounded-xl p-4 border border-orange-900 mb-6">
          <p className="text-orange-300 text-sm font-mono">
            Балансируйте между эффективностью защиты и impact на бизнес. Выберите оптимальные меры содерживания.
          </p>
        </div>

        {/* Containment Options */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {containmentOptions.map((option, index) => (
            <motion.button
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleToggle(option)}
              className={`p-5 rounded-xl border-2 text-left transition-all ${
                isSelected(option.id)
                  ? 'bg-orange-900/30 border-orange-500'
                  : 'bg-gray-900 border-gray-700 hover:border-orange-500'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="text-2xl">{option.icon}</div>
                <span className={`px-2 py-1 rounded text-xs font-mono ${
                  option.businessImpact > 60 ? 'bg-red-500/20 text-red-400' :
                  option.businessImpact > 30 ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-green-500/20 text-green-400'
                }`}>
                  Impact: {option.businessImpact}%
                </span>
              </div>
              <h3 className="font-bold text-white font-mono mb-1">{option.name}</h3>
              <p className="text-sm text-gray-400 mb-3">{option.description}</p>
              
              {isSelected(option.id) && (
                <div className="mt-3 pt-3 border-t border-gray-800">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-green-400">Эффективность: {option.effectiveness}%</span>
                    <span className="text-gray-400">Cost: {option.cost}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{option.details}</p>
                </div>
              )}
            </motion.button>
          ))}
        </div>

        {/* Selected Summary */}
        {selectedMeasures.length > 0 && (
          <div className="bg-gray-900 rounded-xl p-4 border border-orange-900">
            <h3 className="text-sm font-medium text-orange-400 font-mono mb-3">
              Выбранные меры: {selectedMeasures.length}
            </h3>
            <div className="space-y-2">
              {selectedMeasures.map(m => (
                <div key={m.id} className="flex items-center justify-between text-sm font-mono">
                  <span className="text-white">{m.name}</span>
                  <span className="text-green-400">{m.effectiveness}% eff / {m.businessImpact}% impact</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-gray-800 grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-gray-500 font-mono">Средняя эффективность</span>
                <div className="text-lg font-bold text-green-400 font-mono">{avgEffectiveness}%</div>
              </div>
              <div>
                <span className="text-xs text-gray-500 font-mono">Общий impact</span>
                <div className={`text-lg font-bold font-mono ${totalImpact > 100 ? 'text-red-400' : 'text-yellow-400'}`}>{totalImpact}%</div>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {showResults && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`mt-6 p-6 rounded-xl border text-center ${
              avgEffectiveness > 70 && totalImpact < 100
                ? 'bg-green-900/30 border-green-800'
                : avgEffectiveness > 40
                ? 'bg-yellow-900/30 border-yellow-800'
                : 'bg-red-900/30 border-red-800'
            }`}
          >
            <div className="text-4xl mb-3">
              {avgEffectiveness > 70 && totalImpact < 100 ? '🛡️' : avgEffectiveness > 40 ? '⚠️' : '💥'}
            </div>
            <h3 className="text-xl font-bold text-white font-mono mb-2">
              {avgEffectiveness > 70 && totalImpact < 100 ? 'Инцидент содержан!' : avgEffectiveness > 40 ? 'Частичное содерживание' : 'Неэффективное содерживание'}
            </h3>
            <p className="text-gray-300 font-mono">
              Эффективность: {avgEffectiveness}% • Impact: {totalImpact}%
            </p>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      {!showResults && selectedMeasures.length > 0 && (
        <div className="bg-gray-900 border-t border-orange-900 px-6 py-4">
          <button
            onClick={handleNext}
            className="w-full py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition font-mono"
          >
            Применить меры содерживания →
          </button>
        </div>
      )}
    </div>
  );
}

export default AnalysisContainment;

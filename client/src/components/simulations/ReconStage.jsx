import { useState } from 'react';
import { motion } from 'framer-motion';

const companyData = [
  {
    id: 'email',
    label: 'Email сотрудников',
    value: 'admin@company.ru, director@company.ru',
    danger: 'Хакеры могут использовать email для фишинговых атак',
    icon: '📧',
    isDangerous: true
  },
  {
    id: 'tech',
    label: 'Технологии',
    value: 'WordPress 5.8, PHP 7.4, MySQL',
    danger: 'Устаревшие версии имеют известные уязвимости',
    icon: '💻',
    isDangerous: true
  },
  {
    id: 'structure',
    label: 'Структура компании',
    value: 'CEO: Иванов, CTO: Петров, 50 сотрудников',
    danger: 'Зная структуру, хакер может имитировать руководство',
    icon: '🏢',
    isDangerous: true
  },
  {
    id: 'social',
    label: 'Соцсети сотрудников',
    value: 'LinkedIn, VK, Facebook профили открыты',
    danger: 'Соцсети содержат личную информацию для социальной инженерии',
    icon: '👥',
    isDangerous: true
  },
  {
    id: 'public',
    label: 'Публичная информация',
    value: 'Адрес офиса, телефон, часы работы',
    danger: 'Публичная информация полезна, но не критична',
    icon: '📢',
    isDangerous: false
  }
];

function ReconStage({ onComplete }) {
  const [hidden, setHidden] = useState({});
  const [showExplanation, setShowExplanation] = useState(null);

  const hiddenCount = Object.values(hidden).filter(v => v).length;
  const dangerousCount = companyData.filter(d => d.isDangerous).length;

  const handleToggle = (id) => {
    setHidden(prev => ({ ...prev, [id]: !prev[id] }));
    setShowExplanation(id);
    setTimeout(() => setShowExplanation(null), 3000);
  };

  const handleNext = () => {
    const score = Object.entries(hidden)
      .filter(([id, value]) => {
        const data = companyData.find(d => d.id === id);
        return data.isDangerous === value;
      })
      .length;
    onComplete({ score, max: companyData.length });
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-gray-900 rounded-lg p-4 mb-4 border border-orange-500/30">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">🔍</span>
          <div>
            <h2 className="text-xl font-bold text-orange-400">Этап 1: Разведка</h2>
            <p className="text-sm text-gray-400">Хакер собирает информацию о компании</p>
          </div>
        </div>
        <p className="text-sm text-gray-300">
          Скройте опасные данные, которые хакер может использовать для атаки
        </p>
      </div>

      {/* Company Profile */}
      <div className="bg-gray-800 rounded-lg p-4 mb-4">
        <h3 className="text-lg font-medium text-white mb-3 flex items-center gap-2">
          <span>🏢</span> Профиль компании "TechCorp"
        </h3>
        <div className="space-y-3">
          {companyData.map((data, index) => (
            <motion.div
              key={data.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-3 rounded-lg border transition-all ${
                hidden[data.id]
                  ? 'bg-green-900/30 border-green-500/50'
                  : data.isDangerous
                  ? 'bg-red-900/30 border-red-500/50'
                  : 'bg-gray-700 border-gray-600'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <span className="text-2xl">{data.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-white">{data.label}</h4>
                      {data.isDangerous && !hidden[data.id] && (
                        <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded">
                          ОПАСНО
                        </span>
                      )}
                      {hidden[data.id] && (
                        <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded">
                          СКРЫТО
                        </span>
                      )}
                    </div>
                    <p className={`text-sm mt-1 ${hidden[data.id] ? 'text-gray-500 line-through' : 'text-gray-300'}`}>
                      {hidden[data.id] ? '••••••••' : data.value}
                    </p>
                    {showExplanation === data.id && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs text-orange-300 mt-2"
                      >
                        {data.danger}
                      </motion.p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleToggle(data.id)}
                  className={`px-3 py-1.5 text-sm rounded-lg transition ${
                    hidden[data.id]
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                  }`}
                >
                  {hidden[data.id] ? 'Показать' : 'Скрыть'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Progress */}
      <div className="bg-gray-800 rounded-lg p-3 mb-4">
        <div className="flex justify-between text-sm text-gray-400 mb-1">
          <span>Скрыто опасных данных</span>
          <span>{hiddenCount}/{dangerousCount}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <motion.div
            className="h-2 rounded-full bg-orange-500"
            initial={{ width: 0 }}
            animate={{ width: `${(hiddenCount / dangerousCount) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Next Button */}
      <button
        onClick={handleNext}
        className="w-full py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition"
      >
        Продолжить →
      </button>
    </div>
  );
}

export default ReconStage;
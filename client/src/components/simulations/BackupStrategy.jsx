import { useState } from 'react';
import { motion } from 'framer-motion';

function BackupStrategy({ onComplete }) {
  const [step, setStep] = useState('intro');
  const [selectedStrategy, setSelectedStrategy] = useState('');
  const [hasBackup, setHasBackup] = useState(false);
  const [disasterScenario, setDisasterScenario] = useState(null);

  const strategies = [
    {
      id: 'none',
      name: 'Без бэкапа',
      icon: '',
      description: 'Надеюсь, что ничего не случится',
      risk: 'Очень высокий'
    },
    {
      id: 'cloud',
      name: 'Только облако',
      icon: '☁️',
      description: 'Google Drive, OneDrive, Dropbox',
      risk: 'Средний'
    },
    {
      id: 'local',
      name: 'Только внешний диск',
      icon: '💾',
      description: 'USB-накопитель или внешний HDD',
      risk: 'Средний'
    },
    {
      id: '321',
      name: 'Правило 3-2-1',
      icon: '🛡️',
      description: '3 копии, 2 носителя, 1 вне дома',
      risk: 'Минимальный',
      recommended: true
    }
  ];

  const handleStrategySelect = (id) => {
    setSelectedStrategy(id);
    if (id === 'none') {
      setHasBackup(false);
      setStep('disaster');
    } else {
      setHasBackup(true);
      if (id === '321') {
        setStep('321-explain');
      } else {
        setStep('disaster');
      }
    }
  };

  const handleDisaster = () => {
    if (selectedStrategy === 'none') {
      setDisasterScenario('lost');
    } else if (selectedStrategy === 'cloud') {
      setDisasterScenario('cloud-saved');
    } else if (selectedStrategy === 'local') {
      setDisasterScenario('local-risk');
    } else {
      setDisasterScenario('321-saved');
    }
    setStep('result');
  };

  return (
    <motion.div className="bg-[#1a1a2e] rounded-xl w-full max-w-2xl p-8 border border-gray-700" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
      <h2 className="text-2xl font-bold text-white mb-2">Резервные копии</h2>
      <p className="text-gray-400 text-sm mb-6">Защитите свои данные от потери</p>

      {/* Step: Intro */}
      {step === 'intro' && (
        <div>
          <div className="mb-6 p-4 bg-[#0a0a0f] rounded-lg border border-gray-700">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">📁</span>
              <div>
                <div className="text-white font-medium">Ваши файлы:</div>
                <div className="text-gray-400 text-sm">Документы, фото, проекты</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {['Диплом.docx', 'Фото_отпуск.jpg', 'Проект.zip', 'Пароли.txt', 'Финансы.xlsx'].map((file, i) => (
                <motion.div key={i} className="px-3 py-1.5 bg-blue-900/20 border border-blue-800 rounded text-xs text-blue-300" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}>
                  📄 {file}
                </motion.div>
              ))}
            </div>
          </div>

          <div className="text-sm text-gray-400 mb-4">Выберите стратегию резервного копирования:</div>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {strategies.map((strategy) => (
              <motion.div
                key={strategy.id}
                className={`p-4 rounded-lg border cursor-pointer ${strategy.recommended ? 'bg-blue-900/20 border-blue-700' : 'bg-[#0a0a0f] border-gray-700'}`}
                whileHover={{ scale: 1.02, borderColor: '#3b82f6' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleStrategySelect(strategy.id)}
              >
                <div className="text-2xl mb-2">{strategy.icon}</div>
                <div className="text-white font-medium text-sm">{strategy.name}</div>
                <div className="text-gray-400 text-xs mt-1">{strategy.description}</div>
                <div className={`text-xs mt-2 ${strategy.risk === 'Минимальный' ? 'text-green-400' : strategy.risk === 'Средний' ? 'text-yellow-400' : 'text-red-400'}`}>
                  Риск: {strategy.risk}
                </div>
                {strategy.recommended && <div className="text-xs text-blue-400 mt-1"> Рекомендуется</div>}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Step: 3-2-1 Explanation */}
      {step === '321-explain' && (
        <div>
          <div className="text-sm text-gray-400 mb-4">Правило 3-2-1:</div>

          {/* Visual 3-2-1 */}
          <div className="mb-6">
            <div className="flex items-center justify-center gap-4 mb-4">
              {/* 3 copies */}
              <div className="text-center">
                <div className="flex gap-1 justify-center mb-2">
                  {[0, 1, 2].map((i) => (
                    <motion.div key={i} className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center text-white text-xs" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.2 }}>
                      
                    </motion.div>
                  ))}
                </div>
                <div className="text-white font-bold text-lg">3</div>
                <div className="text-gray-400 text-xs">копии данных</div>
              </div>

              <div className="text-gray-600 text-2xl">×</div>

              {/* 2 media */}
              <div className="text-center">
                <div className="flex gap-1 justify-center mb-2">
                  <motion.div className="w-10 h-10 bg-green-600 rounded flex items-center justify-center text-white text-xs" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.6 }}>
                    💻
                  </motion.div>
                  <motion.div className="w-10 h-10 bg-green-600 rounded flex items-center justify-center text-white text-xs" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.8 }}>
                    💾
                  </motion.div>
                </div>
                <div className="text-white font-bold text-lg">2</div>
                <div className="text-gray-400 text-xs">типа носителей</div>
              </div>

              <div className="text-gray-600 text-2xl">×</div>

              {/* 1 offsite */}
              <div className="text-center">
                <div className="flex gap-1 justify-center mb-2">
                  <motion.div className="w-10 h-10 bg-purple-600 rounded flex items-center justify-center text-white text-xs" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1 }}>
                    ☁️
                  </motion.div>
                </div>
                <div className="text-white font-bold text-lg">1</div>
                <div className="text-gray-400 text-xs">вне дома</div>
              </div>
            </div>
          </div>

          <div className="mb-6 p-4 bg-green-900/20 border border-green-800 rounded-lg">
            <div className="text-green-300 text-sm">
              ✅ Правило 3-2-1 — золотой стандарт резервного копирования. Даже если один носитель сломается, а другой сгорит — у вас останется копия в облаке.
            </div>
          </div>

          <motion.button className="w-full py-3 rounded-lg font-medium text-white" style={{ background: 'linear-gradient(to bottom, #3b82f6 0%, #2563eb 100%)' }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setStep('disaster')}>
            Проверить защиту →
          </motion.button>
        </div>
      )}

      {/* Step: Disaster Scenario */}
      {step === 'disaster' && (
        <div>
          <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-lg">
            <div className="flex items-center gap-3">
              <span className="text-2xl"></span>
              <div>
                <div className="text-red-400 font-bold">ВНИМАНИЕ!</div>
                <div className="text-red-300 text-sm">Жёсткий диск вашего компьютера сломался!</div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-gray-300 mb-4">Что произойдёт с вашими данными?</p>
            <motion.button className="w-full py-3 rounded-lg font-medium text-white" style={{ background: 'linear-gradient(to bottom, #ef4444 0%, #dc2626 100%)' }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleDisaster}>
              Узнать результат
            </motion.button>
          </div>
        </div>
      )}

      {/* Step: Result */}
      {step === 'result' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {disasterScenario === 'lost' && (
            <div>
              <div className="mb-6 p-4 bg-red-900/30 border border-red-800 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl"></span>
                  <div>
                    <div className="text-red-400 font-bold">ДАННЫЕ ПОТЕРЯНЫ!</div>
                    <div className="text-red-300 text-sm">У вас не было резервной копии</div>
                  </div>
                </div>
              </div>
              <div className="space-y-2 mb-6">
                {['Диплом.docx — потерян', 'Фото_отпуск.jpg — потеряны', 'Проект.zip — потерян', 'Пароли.txt — потерян', 'Финансы.xlsx — потерян'].map((item, i) => (
                  <motion.div key={i} className="flex items-center gap-2 p-2 bg-red-900/10 rounded text-sm text-red-300" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                    ❌ {item}
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {disasterScenario === 'cloud-saved' && (
            <div>
              <div className="mb-6 p-4 bg-yellow-900/20 border border-yellow-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⚠️</span>
                  <div>
                    <div className="text-yellow-400 font-bold">Данные частично восстановлены</div>
                    <div className="text-yellow-300 text-sm">Облачная копия сохранилась</div>
                  </div>
                </div>
              </div>
              <div className="text-gray-300 text-sm mb-6">
                Ваши файлы восстановлены из облака, но если бы облако тоже было недоступно — вы бы потеряли данные.
              </div>
            </div>
          )}

          {disasterScenario === 'local-risk' && (
            <div>
              <div className="mb-6 p-4 bg-yellow-900/20 border border-yellow-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⚠️</span>
                  <div>
                    <div className="text-yellow-400 font-bold">Данные под угрозой</div>
                    <div className="text-yellow-300 text-sm">Внешний диск мог тоже сломаться</div>
                  </div>
                </div>
              </div>
              <div className="text-gray-300 text-sm mb-6">
                Если внешний диск был подключён к компьютеру во время поломки, он тоже мог выйти из строя.
              </div>
            </div>
          )}

          {disasterScenario === '321-saved' && (
            <div>
              <div className="mb-6 p-4 bg-green-900/20 border border-green-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">✅</span>
                  <div>
                    <div className="text-green-400 font-bold">ДАННЫЕ В БЕЗОПАСНОСТИ!</div>
                    <div className="text-green-300 text-sm">Правило 3-2-1 сработало</div>
                  </div>
                </div>
              </div>
              <div className="space-y-2 mb-6">
                {['Копия на компьютере — потеряна', 'Копия на внешнем диске — сохранена', 'Копия в облаке — сохранена'].map((item, i) => (
                  <motion.div key={i} className={`flex items-center gap-2 p-2 rounded text-sm ${i === 0 ? 'bg-red-900/10 text-red-300' : 'bg-green-900/10 text-green-300'}`} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                    {i === 0 ? '❌' : '✅'} {item}
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          <motion.button className="w-full py-3 rounded-lg font-medium text-white" style={{ background: 'linear-gradient(to bottom, #3b82f6 0%, #2563eb 100%)' }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => onComplete(selectedStrategy)}>
            Продолжить →
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
}

export default BackupStrategy;

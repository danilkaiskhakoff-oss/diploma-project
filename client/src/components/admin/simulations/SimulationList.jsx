import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase/config';

const simulationCatalog = [
  { id: 'cyber-basics', title: 'Основы кибербезопасности', icon: '️', desc: 'Интерактивное введение в CIA Triad и базовые понятия.' },
  { id: 'phishing', title: 'Фишинг', icon: '', desc: 'Анализ email-писем на признаки мошенничества.' },
  { id: 'passwords', title: 'Пароли', icon: '🔑', desc: 'Проверка надёжности паролей и сценарии взлома.' },
  { id: 'data-protection', title: 'Защита данных', icon: '🔒', desc: 'Настройка 2FA и шифрования.' },
  { id: 'social-media', title: 'Безопасность в соцсетях', icon: '📱', desc: 'Анализ цифрового следа и настроек приватности.' },
  { id: 'network-attacks', title: 'Сетевые атаки', icon: '🌐', desc: 'Симуляция MITM и DNS-спуфинга.' },
  { id: 'social-engineering', title: 'Социальная инженерия', icon: '🎭', desc: 'Диалоги с мошенниками и выявление манипуляций.' },
  { id: 'malware', title: 'Вирусы и малварь', icon: '', desc: 'Классификация вредоносного ПО и лечение системы.' },
  { id: 'wifi-security', title: 'Безопасность Wi-Fi', icon: '📡', desc: 'Настройка роутера и защита от Evil Twin.' },
  { id: 'insider-threats', title: 'Инсайдерские угрозы', icon: '🕵️', desc: 'Выявление подозрительного поведения сотрудников.' },
  { id: 'ddos', title: 'DDoS-атаки', icon: '🌊', desc: 'NOC Dashboard: отражение массированной атаки.' },
  { id: 'pentest', title: 'Пентест', icon: '🔓', desc: 'Сканирование сети и эксплуатация уязвимостей.' },
  { id: 'incident-response', title: 'Incident Response', icon: '', desc: 'Триаж алертов и реагирование на инцидент.' },
  { id: 'osint', title: 'OSINT', icon: '🔍', desc: 'Разведка через Google Dorks и Shodan.' },
];

function SimulationList({ onNavigateToLevel }) {
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLevels();
  }, []);

  const loadLevels = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'levels'));
      const levelsData = [];
      querySnapshot.forEach((doc) => {
        levelsData.push({ id: doc.id, ...doc.data() });
      });
      setLevels(levelsData);
    } catch (error) {
      console.error('Error loading levels:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLevelForSimulation = (simId) => {
    for (const level of levels) {
      const checkpoint = level.checkpoints?.find((cp) => cp.simulation?.type === simId);
      if (checkpoint) return level;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-400">Загрузка каталога...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-white mb-2">Симуляции</h2>
      <p className="text-gray-400 mb-8">Каталог интерактивных сценариев. Данные редактируются через раздел "Уровни".</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {simulationCatalog.map((sim) => {
          const level = getLevelForSimulation(sim.id);
          return (
            <motion.div
              key={sim.id}
              whileHover={{ scale: 1.02 }}
              className="bg-gray-900 rounded-xl p-6 border border-gray-800 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition text-6xl select-none">
                {sim.icon}
              </div>
              
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{sim.icon}</span>
                <h3 className="text-lg font-bold text-white">{sim.title}</h3>
              </div>
              
              <p className="text-gray-400 text-sm mb-6 h-10">{sim.desc}</p>

              {level ? (
                <button
                  onClick={() => onNavigateToLevel(level.id)}
                  className="w-full py-2 bg-gray-800 hover:bg-blue-600 text-gray-300 hover:text-white rounded-lg transition flex items-center justify-center gap-2 text-sm"
                >
                  <span>📂</span>
                  Редактировать в "{level.name}"
                </button>
              ) : (
                <div className="w-full py-2 bg-gray-800/50 text-gray-500 rounded-lg text-sm text-center cursor-not-allowed">
                  Не привязано к уровню
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default SimulationList;

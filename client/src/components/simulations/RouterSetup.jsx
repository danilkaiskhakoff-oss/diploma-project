import { useState } from 'react';
import { motion } from 'framer-motion';

const settings = [
  {
    id: 'encryption',
    label: 'Протокол шифрования',
    options: [
      { value: 'wep', label: 'WEP (Устаревший)', safe: false, warning: 'WEP легко взламывается за несколько минут!' },
      { value: 'wpa', label: 'WPA (Старый)', safe: false, warning: 'WPA имеет известные уязвимости.' },
      { value: 'wpa2', label: 'WPA2 (Рекомендуемый)', safe: true, warning: null },
      { value: 'wpa3', label: 'WPA3 (Самый надёжный)', safe: true, warning: null }
    ],
    icon: ''
  },
  {
    id: 'adminPassword',
    label: 'Пароль администратора',
    options: [
      { value: 'admin', label: 'admin (По умолчанию)', safe: false, warning: 'Пароль по умолчанию знают все хакеры!' },
      { value: '1234', label: '1234 (Простой)', safe: false, warning: 'Слишком простой пароль.' },
      { value: 'strong', label: 'S3cur3P@ss! (Надёжный)', safe: true, warning: null }
    ],
    icon: ''
  },
  {
    id: 'wps',
    label: 'WPS (Wi-Fi Protected Setup)',
    options: [
      { value: 'on', label: 'Включён', safe: false, warning: 'WPS имеет уязвимость PIN-кода!' },
      { value: 'off', label: 'Выключен', safe: true, warning: null }
    ],
    icon: ''
  },
  {
    id: 'ssid',
    label: 'Название сети (SSID)',
    options: [
      { value: 'default', label: 'TP-Link_Home (По умолчанию)', safe: false, warning: 'Стандартное имя выдаёт модель роутера.' },
      { value: 'custom', label: 'My_Secure_Network (Своё)', safe: true, warning: null }
    ],
    icon: '📶'
  }
];

function RouterSetup({ onComplete }) {
  const [config, setConfig] = useState({});
  const [showWarning, setShowWarning] = useState({});

  const handleSelect = (settingId, option) => {
    setConfig(prev => ({ ...prev, [settingId]: option.value }));
    if (option.warning) {
      setShowWarning(prev => ({ ...prev, [settingId]: option.warning }));
      setTimeout(() => {
        setShowWarning(prev => ({ ...prev, [settingId]: null }));
      }, 3000);
    } else {
      setShowWarning(prev => ({ ...prev, [settingId]: null }));
    }
  };

  const handleNext = () => {
    // Calculate score
    let score = 0;
    let max = 0;

    settings.forEach(setting => {
      const selected = config[setting.id];
      const correctOption = setting.options.find(o => o.safe);
      max += 1;
      if (selected === correctOption.value) {
        score += 1;
      }
    });

    onComplete({ score: score * 10, max: settings.length * 10, config });
  };

  const configuredCount = Object.keys(config).length;

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <h2 className="text-xl font-bold text-gray-800">Настройка безопасности Wi-Fi</h2>
        <p className="text-gray-600 text-sm">Настройте параметры роутера для максимальной защиты</p>
      </div>

      {/* Settings List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {settings.map((setting, index) => (
          <motion.div
            key={setting.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg p-5 shadow-sm border border-gray-200"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">{setting.icon}</span>
              <h3 className="font-bold text-gray-800">{setting.label}</h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {setting.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSelect(setting.id, option)}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${
                    config[setting.id] === option.value
                      ? option.safe
                        ? 'bg-green-50 border-green-500'
                        : 'bg-red-50 border-red-500'
                      : 'bg-gray-50 border-gray-200 hover:border-blue-500'
                  }`}
                >
                  <div className="text-sm font-medium text-gray-800">{option.label}</div>
                  {config[setting.id] === option.value && (
                    <div className={`text-xs mt-1 ${option.safe ? 'text-green-600' : 'text-red-600'}`}>
                      {option.safe ? '✓ Безопасно' : '⚠ Опасно'}
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Warning */}
            {showWarning[setting.id] && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg"
              >
                <p className="text-sm text-red-700">⚠ {showWarning[setting.id]}</p>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Progress & Next Button */}
      <div className="bg-white border-t px-6 py-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Настроено параметров</span>
          <span>{configuredCount}/{settings.length}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <motion.div
            className="h-2 rounded-full bg-blue-500"
            initial={{ width: 0 }}
            animate={{ width: `${(configuredCount / settings.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <button
          onClick={handleNext}
          disabled={configuredCount < settings.length}
          className={`w-full py-3 font-medium rounded-lg transition ${
            configuredCount === settings.length
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Сохранить настройки →
        </button>
      </div>
    </div>
  );
}

export default RouterSetup;

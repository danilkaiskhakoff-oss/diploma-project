import { useState } from 'react';
import { motion } from 'framer-motion';

const privacySettings = [
  {
    id: 'phone',
    label: 'Кто видит мой номер телефона',
    current: 'Все',
    safe: 'Только я',
    danger: 'Ваш номер могут использовать для восстановления пароля',
    icon: '📞'
  },
  {
    id: 'friends',
    label: 'Кто видит моих друзей',
    current: 'Все',
    safe: 'Только друзья',
    danger: 'Мошенники могут узнать ваших друзей для социальной инженерии',
    icon: '👥'
  },
  {
    id: 'geolocation',
    label: 'Кто видит геолокацию на фото',
    current: 'Все',
    safe: 'Никто',
    danger: 'Геолокация может раскрыть ваш домашний адрес',
    icon: '📍'
  },
  {
    id: 'birthdate',
    label: 'Кто видит дату рождения',
    current: 'Все',
    safe: 'Только друзья',
    danger: 'Дата рождения используется для восстановления паролей',
    icon: '🎂'
  },
  {
    id: 'messages',
    label: 'Кто может писать мне сообщения',
    current: 'Все',
    safe: 'Только друзья',
    danger: 'Любой может отправить фишинговые сообщения',
    icon: '💬'
  }
];

function ProfileAudit({ privacySettings: initialSettings, onComplete }) {
  const [settings, setSettings] = useState(
    privacySettings.map(s => ({ ...s, fixed: false, selected: null }))
  );
  const [showExplanation, setShowExplanation] = useState(null);

  const fixedCount = settings.filter(s => s.fixed).length;
  const progress = (fixedCount / settings.length) * 100;

  const handleFix = (id) => {
    setSettings(prev => prev.map(s => {
      if (s.id === id && !s.fixed) {
        return { ...s, fixed: true, selected: s.safe };
      }
      return s;
    }));
    setShowExplanation(id);
    setTimeout(() => setShowExplanation(null), 3000);
  };

  const handleNext = () => {
    const result = {};
    settings.forEach(s => {
      result[s.id] = s.fixed;
    });
    onComplete(result);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg p-6 shadow-sm mb-4">
        <h2 className="text-xl font-bold mb-2" style={{ color: '#4a76a8' }}>
          Аудит приватности профиля
        </h2>
        <p className="text-gray-600 text-sm mb-4">
          Проверьте настройки приватности и исправьте опасные параметры
        </p>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Уровень защиты</span>
            <span>{fixedCount}/{settings.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="h-2 rounded-full transition-all"
              style={{ background: progress > 60 ? '#4caf50' : progress > 30 ? '#ff9800' : '#f44336' }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Settings List */}
      <div className="space-y-3">
        {settings.map((setting, index) => (
          <motion.div
            key={setting.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-white rounded-lg p-4 shadow-sm border-l-4 ${
              setting.fixed ? 'border-green-500' : 'border-red-500'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <span className="text-2xl">{setting.icon}</span>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800">{setting.label}</h3>
                  <div className="mt-2 flex items-center gap-2 text-sm">
                    <span className="text-gray-500">Сейчас:</span>
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      setting.fixed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {setting.fixed ? setting.selected : setting.current}
                    </span>
                    {setting.fixed && (
                      <span className="text-green-500 ml-2">✓</span>
                    )}
                  </div>
                  {!setting.fixed && (
                    <p className="text-xs text-red-500 mt-1">{setting.danger}</p>
                  )}
                  {showExplanation === setting.id && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xs text-green-600 mt-2"
                    >
                      ✓ Отлично! Теперь {setting.label.toLowerCase()} в безопасности
                    </motion.p>
                  )}
                </div>
              </div>
              {!setting.fixed && (
                <button
                  onClick={() => handleFix(setting.id)}
                  className="px-3 py-1.5 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition whitespace-nowrap"
                >
                  Исправить
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Next Button */}
      {fixedCount === settings.length && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          <button
            onClick={handleNext}
            className="w-full py-3 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition"
          >
            Продолжить →
          </button>
        </motion.div>
      )}
    </div>
  );
}

export default ProfileAudit;
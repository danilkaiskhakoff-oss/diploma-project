import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const hackTimeline = [
  {
    day: 'День 1',
    title: 'Сбор информации',
    description: 'Хакер нашёл ваш номер телефона в открытом профиле',
    icon: '🔍',
    requires: 'phone'
  },
  {
    day: 'День 2',
    title: 'SMS-сброс пароля',
    description: 'Использовал номер для запроса сброса пароля',
    icon: '📱',
    requires: 'phone'
  },
  {
    day: 'День 3',
    title: 'Доступ к аккаунту',
    description: 'Получил код из SMS и сменил пароль',
    icon: '🔓',
    requires: 'phone'
  },
  {
    day: 'День 4',
    title: 'Социальная инженерия',
    description: 'Написал вашим друзьям, используя информацию из профиля',
    icon: '💬',
    requires: 'friends'
  },
  {
    day: 'День 5',
    title: 'Распространение',
    description: 'Отправил фишинговые ссылки от вашего имени',
    icon: '🎣',
    requires: 'messages'
  }
];

function HackScenario({ privacySettings, onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [vulnerabilities, setVulnerabilities] = useState([]);

  useEffect(() => {
    if (privacySettings) {
      const vulns = [];
      if (!privacySettings.phone) vulns.push('phone');
      if (!privacySettings.friends) vulns.push('friends');
      if (!privacySettings.geolocation) vulns.push('geolocation');
      if (!privacySettings.birthdate) vulns.push('birthdate');
      if (!privacySettings.messages) vulns.push('messages');
      setVulnerabilities(vulns);
    }
  }, [privacySettings]);

  const isProtected = vulnerabilities.length === 0;
  const step = hackTimeline[currentStep];

  const handleNext = () => {
    if (currentStep < hackTimeline.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowResult(true);
    }
  };

  const handleFinish = () => {
    onComplete();
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className={`rounded-lg p-6 shadow-sm mb-4 ${
        isProtected ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
      }`}>
        <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
          {isProtected ? (
            <>
              <span className="text-green-600">🛡️</span>
              <span className="text-green-800">Аккаунт защищён!</span>
            </>
          ) : (
            <>
              <span className="text-red-600">⚠️</span>
              <span className="text-red-800">Ваш аккаунт уязвим!</span>
            </>
          )}
        </h2>
        <p className={`text-sm ${isProtected ? 'text-green-700' : 'text-red-700'}`}>
          {isProtected
            ? 'Отличная работа! Вы настроили приватность и защитили аккаунт.'
            : `Найдено ${vulnerabilities.length} уязвимостей. Посмотрите, как хакер может их использовать.`
          }
        </p>
      </div>

      {/* Hack Timeline */}
      {!showResult && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-center"
            >
              <div className="text-6xl mb-4">{step.icon}</div>
              <div className="text-sm text-gray-500 mb-2">{step.day}</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>

              {/* Vulnerability Indicator */}
              {vulnerabilities.includes(step.requires) && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200"
                >
                  <p className="text-sm text-red-700">
                    ⚠️ Уязвимость: <span className="font-medium">
                      {step.requires === 'phone' && 'Номер телефона был публичным'}
                      {step.requires === 'friends' && 'Список друзей был публичным'}
                      {step.requires === 'messages' && 'Сообщения были открыты для всех'}
                      {step.requires === 'geolocation' && 'Геолокация была публичной'}
                      {step.requires === 'birthdate' && 'Дата рождения была публичной'}
                    </span>
                  </p>
                </motion.div>
              )}

              {isProtected && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200"
                >
                  <p className="text-sm text-green-700">
                    ✓ Защищено! Хакер не может использовать этот метод
                  </p>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Progress Dots */}
          <div className="px-6 pb-4 flex justify-center gap-2">
            {hackTimeline.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition ${
                  index <= currentStep ? 'bg-red-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          {/* Next Button */}
          <div className="p-4 border-t bg-gray-50">
            <button
              onClick={handleNext}
              className="w-full py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition"
            >
              {currentStep < hackTimeline.length - 1 ? 'Далее →' : 'Показать результат →'}
            </button>
          </div>
        </div>
      )}

      {/* Result */}
      {showResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">{isProtected ? '🎉' : '😰'}</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {isProtected ? 'Аккаунт в безопасности!' : 'Аккаунт под угрозой!'}
            </h3>
            <p className="text-gray-600">
              {isProtected
                ? 'Вы настроили все параметры приватности. Хакер не сможет получить доступ.'
                : `Хакер использовал ${vulnerabilities.length} уязвимостей для взлома вашего аккаунта.`
              }
            </p>
          </div>

          {/* Vulnerabilities List */}
          {!isProtected && (
            <div className="mb-6 p-4 bg-red-50 rounded-lg">
              <h4 className="font-medium text-red-800 mb-3">Найденные уязвимости:</h4>
              <ul className="space-y-2">
                {vulnerabilities.map(vuln => (
                  <li key={vuln} className="text-sm text-red-700 flex items-center gap-2">
                    <span>✗</span>
                    <span>
                      {vuln === 'phone' && 'Номер телефона был публичным'}
                      {vuln === 'friends' && 'Список друзей был публичным'}
                      {vuln === 'geolocation' && 'Геолокация была публичной'}
                      {vuln === 'birthdate' && 'Дата рождения была публичной'}
                      {vuln === 'messages' && 'Сообщения были открыты для всех'}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={handleFinish}
            className={`w-full py-3 font-medium rounded-lg transition ${
              isProtected
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-red-500 text-white hover:bg-red-600'
            }`}
          >
            Продолжить →
          </button>
        </motion.div>
      )}
    </div>
  );
}

export default HackScenario;
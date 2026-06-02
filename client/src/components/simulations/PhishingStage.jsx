import { useState } from 'react';
import { motion } from 'framer-motion';

const phishingEmail = {
  from: 'security@company-support.ru',
  fromName: 'IT Отдел',
  subject: '⚠️ Срочно: Смените пароль от учётной записи!',
  date: 'Сегодня, 09:15',
  body: `Уважаемый сотрудник!

Мы обнаружили подозрительную активность в вашей учётной записи. Для обеспечения безопасности необходимо срочно сменить пароль.

Перейдите по ссылке ниже в течение 2 часов, иначе ваша учётная запись будет заблокирована:

http://company-support.ru/password-reset

С уважением,
IT Отдел компании`,
  suspiciousElements: [
    { id: 'sender', text: 'security@company-support.ru', reason: 'Поддельный домен. Настоящий IT отдел использует @company.ru' },
    { id: 'urgency', text: 'в течение 2 часов', reason: 'Срочность — манипуляция для паники' },
    { id: 'link', text: 'http://company-support.ru', reason: 'Ссылка ведёт на поддельный сайт, не на внутренний портал' },
    { id: 'threat', text: 'учётная запись будет заблокирована', reason: 'Угроза блокировки — давление на жертву' }
  ]
};

function PhishingStage({ onComplete }) {
  const [found, setFound] = useState({});
  const [showExplanation, setShowExplanation] = useState(null);

  const foundCount = Object.keys(found).length;

  const handleFind = (id) => {
    if (found[id]) return;
    setFound(prev => ({ ...prev, [id]: true }));
    setShowExplanation(id);
    setTimeout(() => setShowExplanation(null), 4000);
  };

  const handleNext = () => {
    const score = foundCount;
    onComplete({ score, max: phishingEmail.suspiciousElements.length });
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-gray-900 rounded-lg p-4 mb-4 border border-red-500/30">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">🎣</span>
          <div>
            <h2 className="text-xl font-bold text-red-400">Этап 2: Фишинговая атака</h2>
            <p className="text-sm text-gray-400">Хакер отправил фишинговое письмо сотруднику</p>
          </div>
        </div>
        <p className="text-sm text-gray-300">
          Найдите подозрительные элементы в письме. Кликайте на опасные части текста.
        </p>
      </div>

      {/* Email */}
      <div className="bg-white rounded-lg overflow-hidden shadow-lg">
        {/* Email Header */}
        <div className="bg-gray-100 p-4 border-b">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-sm text-gray-600">От: <span className="font-medium text-gray-800">{phishingEmail.fromName}</span></p>
              <p className="text-xs text-gray-700">{phishingEmail.from}</p>
            </div>
            <p className="text-xs text-gray-700">{phishingEmail.date}</p>
          </div>
          <h3 className="font-medium text-gray-800">{phishingEmail.subject}</h3>
        </div>

        {/* Email Body */}
        <div className="p-4">
          <div className="text-sm text-gray-700 whitespace-pre-line">
            {phishingEmail.body.split('\n').map((line, index) => {
              const isSuspicious = phishingEmail.suspiciousElements.some(el => line.includes(el.text));
              const element = phishingEmail.suspiciousElements.find(el => line.includes(el.text));

              return (
                <div key={index} className="mb-1">
                  {element && !found[element.id] ? (
                    <button
                      onClick={() => handleFind(element.id)}
                      className="inline-block px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition cursor-pointer"
                    >
                      {line}
                    </button>
                  ) : element && found[element.id] ? (
                    <span className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded">
                      {line}
                    </span>
                  ) : (
                    <span>{line}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Explanation */}
        {showExplanation && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-red-50 border-t border-red-200"
          >
            <p className="text-sm text-red-800">
              <span className="font-medium">⚠️ Найдено:</span> {phishingEmail.suspiciousElements.find(el => el.id === showExplanation)?.reason}
            </p>
          </motion.div>
        )}
      </div>

      {/* Progress */}
      <div className="mt-4 bg-gray-800 rounded-lg p-3">
        <div className="flex justify-between text-sm text-gray-400 mb-1">
          <span>Найдено подозрительных элементов</span>
          <span>{foundCount}/{phishingEmail.suspiciousElements.length}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <motion.div
            className="h-2 rounded-full bg-red-500"
            initial={{ width: 0 }}
            animate={{ width: `${(foundCount / phishingEmail.suspiciousElements.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Next Button */}
      {foundCount === phishingEmail.suspiciousElements.length && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={handleNext}
          className="w-full mt-4 py-3 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition"
        >
          Продолжить →
        </motion.button>
      )}
    </div>
  );
}

export default PhishingStage;
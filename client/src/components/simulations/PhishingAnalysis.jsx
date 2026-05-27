import { motion } from 'framer-motion';

function PhishingAnalysis({ email, userChoice, onNext, isLast }) {
  const isCorrect = (userChoice === 'phishing' && email.isPhishing) || (userChoice === 'safe' && !email.isPhishing);

  return (
    <motion.div
      className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-xl w-full max-w-lg max-h-[80vh] overflow-y-auto"
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 30 }}
      >
        {/* Header */}
        <div
          className="p-4 rounded-t-xl flex items-center gap-3"
          style={{
            background: isCorrect
              ? 'linear-gradient(to right, #dcfce7 0%, #bbf7d0 100%)'
              : 'linear-gradient(to right, #fee2e2 0%, #fecaca 100%)'
          }}
        >
          <span className="text-3xl">{isCorrect ? '🎉' : '😕'}</span>
          <div>
            <h3 className="font-bold text-lg" style={{ color: isCorrect ? '#166534' : '#991b1b' }}>
              {isCorrect ? 'Правильно!' : 'Неправильно!'}
            </h3>
            <p className="text-sm" style={{ color: isCorrect ? '#15803d' : '#b91c1c' }}>
              {isCorrect
                ? 'Вы правильно определили тип письма'
                : 'Это письмо было ' + (email.isPhishing ? 'фишинговым' : 'безопасным')}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Email Info */}
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="text-xs text-gray-500 mb-1">Письмо:</div>
            <div className="font-medium text-gray-800">{email.subject}</div>
            <div className="text-xs text-gray-500 mt-1">От: {email.from}</div>
          </div>

          {/* Correct Answer */}
          <div className="mb-4">
            <div className="text-sm font-medium text-gray-700 mb-2">Правильный ответ:</div>
            <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${email.isPhishing ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {email.isPhishing ? '🚨 Фишинг' : '✅ Безопасное письмо'}
            </div>
          </div>

          {/* Suspicious Elements */}
          {email.isPhishing && email.suspiciousElements.length > 0 && (
            <div className="mb-4">
              <div className="text-sm font-medium text-gray-700 mb-2">Подозрительные элементы:</div>
              <div className="space-y-2">
                {email.suspiciousElements.map((element) => (
                  <div key={element.id} className="flex items-start gap-2 p-2 bg-yellow-50 rounded-lg border border-yellow-200">
                    <span className="text-yellow-600 mt-0.5">️</span>
                    <div>
                      <div className="text-xs font-medium text-yellow-800">
                        {element.type === 'sender' ? 'Отправитель' :
                         element.type === 'link' ? 'Ссылка' : 'Текст'}
                      </div>
                      <div className="text-xs text-yellow-700">{element.reason}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Why it's safe */}
          {!email.isPhishing && (
            <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="text-sm font-medium text-green-700 mb-1">Почему это письмо безопасное:</div>
              <ul className="text-xs text-green-600 space-y-1">
                <li>• Корректный домен отправителя</li>
                <li>• Нет срочности или манипуляций</li>
                <li>• Ссылка ведёт на официальный сайт</li>
                <li>• Не запрашивает конфиденциальные данные</li>
              </ul>
            </div>
          )}

          {/* Tips */}
          <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-sm font-medium text-blue-700 mb-1">💡 Совет:</div>
            <div className="text-xs text-blue-600">
              {email.isPhishing
                ? 'Всегда проверяйте адрес отправителя и наводите курсор на ссылки перед кликом. Настоящие компании никогда не просят ввести пароль или данные карты по email.'
                : 'Это письмо выглядит безопасным, но всегда стоит проверять отправителя и ссылки, даже в кажущихся безопасных письмах.'}
            </div>
          </div>
        </div>

        {/* Next Button */}
        <div className="p-4 border-t border-gray-200">
          <motion.button
            className="w-full py-3 rounded-lg font-medium text-white text-sm"
            style={{
              background: 'linear-gradient(to bottom, #3b82f6 0%, #2563eb 100%)',
              boxShadow: '0 2px 4px rgba(37,99,235,0.3)'
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onNext}
          >
            {isLast ? 'Завершить симуляцию' : 'Следующее письмо →'}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default PhishingAnalysis;

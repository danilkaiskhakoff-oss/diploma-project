import { useState } from 'react';
import { motion } from 'framer-motion';

const messages = [
  {
    id: 1,
    sender: 'Дмитрий Козлов',
    avatar: '👨',
    time: '14:32',
    text: 'Привет! Срочно нужны деньги, попал в беду. Переведи 5000₽ на карту, вот номер: 2200 1234 5678 9012. Верну завтра!',
    options: [
      { text: 'Перевести деньги', correct: false },
      { text: 'Позвонить Дмитрию и проверить', correct: true },
      { text: 'Проигнорировать', correct: false },
      { text: 'Отправить код из SMS для подтверждения', correct: false }
    ],
    explanation: 'Возможно, аккаунт Дмитрия взломан! Всегда звоните и проверяйте, прежде чем переводить деньги. Настоящий друг поймёт.'
  },
  {
    id: 2,
    sender: 'Техподдержка VK',
    avatar: '🛡️',
    time: '15:10',
    text: 'Здравствуйте! Для верификации вашего аккаунта отправьте код из SMS, который мы только что отправили. Это необходимо для безопасности.',
    options: [
      { text: 'Отправить код', correct: false },
      { text: 'Спросить, зачем нужен код', correct: false },
      { text: 'Проигнорировать и пожаловаться', correct: true },
      { text: 'Отправить другой код', correct: false }
    ],
    explanation: 'Настоящая техподдержка VK НИКОГДА не просит коды из SMS! Это мошенник пытается получить доступ к вашему аккаунту.'
  },
  {
    id: 3,
    sender: 'Елена Смирнова',
    avatar: '👩‍🦰',
    time: '16:45',
    text: 'Смотри какое фото с нашей вечеринки! 😂 https://vk.cc/xyz123 Там есть твои фотки, заходи скорее!',
    options: [
      { text: 'Кликнуть на ссылку', correct: false },
      { text: 'Спросить, что за вечеринка', correct: false },
      { text: 'Не кликать, проверить ссылку', correct: true },
      { text: 'Переслать друзьям', correct: false }
    ],
    explanation: 'Подозрительная короткая ссылка! Это может быть фишинг. Никогда не кликайте на подозрительные ссылки, даже от знакомых - их аккаунт может быть взломан.'
  }
];

function SocialEngineeringDM({ responses, onComplete }) {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [results, setResults] = useState({});

  const message = messages[currentMessage];
  const answeredCount = Object.keys(results).length;

  const handleSelect = (optionIndex) => {
    if (showExplanation) return;
    setSelectedOption(optionIndex);
    setShowExplanation(true);
    setResults(prev => ({
      ...prev,
      [message.id]: message.options[optionIndex].correct
    }));
  };

  const handleNext = () => {
    if (currentMessage < messages.length - 1) {
      setCurrentMessage(currentMessage + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      onComplete(results);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold" style={{ color: '#4a76a8' }}>
              Сообщения
            </h2>
            <p className="text-gray-600 text-sm">
              Распознайте социальную инженерию в сообщениях
            </p>
          </div>
          <div className="text-sm text-gray-500">
            {currentMessage + 1}/{messages.length}
          </div>
        </div>
      </div>

      {/* Message View */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Chat Header */}
        <div className="flex items-center gap-3 p-4 border-b">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xl">
            {message.avatar}
          </div>
          <div>
            <h3 className="font-medium text-gray-800">{message.sender}</h3>
            <p className="text-xs text-gray-500">был(а) в сети только что</p>
          </div>
        </div>

        {/* Message Content */}
        <div className="p-4 bg-gray-50 min-h-32">
          <div className="flex items-start gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-lg flex-shrink-0">
              {message.avatar}
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm max-w-md">
              <p className="text-sm text-gray-800">{message.text}</p>
              <p className="text-xs text-gray-400 mt-1 text-right">{message.time}</p>
            </div>
          </div>
        </div>

        {/* Response Options */}
        <div className="p-4 border-t">
          <p className="text-sm font-medium text-gray-700 mb-3">Ваш ответ:</p>
          <div className="space-y-2">
            {message.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleSelect(index)}
                disabled={showExplanation}
                className={`w-full text-left p-3 rounded-lg text-sm transition ${
                  showExplanation
                    ? option.correct
                      ? 'bg-green-100 border-2 border-green-500 text-green-800'
                      : selectedOption === index
                      ? 'bg-red-100 border-2 border-red-500 text-red-800'
                      : 'bg-gray-100 text-gray-500'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                }`}
              >
                {option.text}
              </button>
            ))}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200"
            >
              <p className="text-sm text-blue-800">
                <span className="font-medium">Разбор:</span> {message.explanation}
              </p>
            </motion.div>
          )}
        </div>

        {/* Next Button */}
        {showExplanation && (
          <div className="p-4 border-t bg-gray-50">
            <button
              onClick={handleNext}
              className="w-full py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition"
            >
              {currentMessage < messages.length - 1 ? 'Следующее сообщение →' : 'Продолжить →'}
            </button>
          </div>
        )}
      </div>

      {/* Progress */}
      <div className="mt-4 bg-white rounded-lg p-3 shadow-sm">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Прогресс</span>
          <span>{answeredCount}/{messages.length}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="h-2 rounded-full bg-blue-500"
            initial={{ width: 0 }}
            animate={{ width: `${(answeredCount / messages.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
    </div>
  );
}

export default SocialEngineeringDM;
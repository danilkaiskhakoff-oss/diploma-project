import { useState } from 'react';
import { motion } from 'framer-motion';

const quizQuestions = [
  {
    question: 'Что НЕ стоит публиковать в социальных сетях?',
    options: ['Фото с отпуска', 'Личные данные (адрес, телефон)', 'Рецепты блюд', 'Музыку'],
    correctIndex: 1,
    explanation: 'Личные данные могут быть использованы мошенниками для кражи личности или социальной инженерии.'
  },
  {
    question: 'Почему опасно публиковать фото с геолокацией?',
    options: ['Это некрасиво', 'Мошенники могут узнать ваш адрес', 'Фото будет плохого качества', 'Ничего страшного'],
    correctIndex: 1,
    explanation: 'Геолокация в фото может раскрыть ваш домашний адрес или место, где вы находитесь.'
  },
  {
    question: 'Как лучше всего защититься от фейковых заявок в друзья?',
    options: ['Принимать все заявки', 'Проверять профиль перед принятием', 'Закрыть аккаунт навсегда', 'Игнорировать всех'],
    correctIndex: 1,
    explanation: 'Всегда проверяйте профиль: общие друзья, фото, активность — это поможет распознать фейк.'
  },
  {
    question: 'Что делать, если друг просит код из SMS?',
    options: ['Отправить код', 'Позвонить и проверить', 'Проигнорировать', 'Отправить другой код'],
    correctIndex: 1,
    explanation: 'Настоящий друг не попросит код из SMS. Вероятно, его аккаунт взломан. Позвоните и проверьте!'
  }
];

function SocialMediaQuiz({ onComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);

  const question = quizQuestions[currentQuestion];
  const progress = ((currentQuestion + (showExplanation ? 1 : 0)) / quizQuestions.length) * 100;

  const handleSelect = (index) => {
    if (showExplanation) return;
    setSelectedAnswer(index);
    setShowExplanation(true);
    if (index === question.correctIndex) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      onComplete(score);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg p-6 shadow-sm mb-4">
        <h2 className="text-xl font-bold mb-2" style={{ color: '#4a76a8' }}>
          Проверка знаний
        </h2>
        <p className="text-gray-600 text-sm mb-2">
          Ответьте на вопросы, чтобы закрепить материал
        </p>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Вопрос {currentQuestion + 1}/{quizQuestions.length}</span>
          <span>Правильно: {score}</span>
        </div>
      </div>

      {/* Question */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">{question.question}</h3>

          {/* Options */}
          <div className="space-y-2">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleSelect(index)}
                disabled={showExplanation}
                className={`w-full text-left p-4 rounded-lg transition ${
                  showExplanation
                    ? index === question.correctIndex
                      ? 'bg-green-100 border-2 border-green-500 text-green-800'
                      : selectedAnswer === index
                      ? 'bg-red-100 border-2 border-red-500 text-red-800'
                      : 'bg-gray-100 text-gray-500'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                }`}
              >
                <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                {option}
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
                <span className="font-medium">Пояснение:</span> {question.explanation}
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
              {currentQuestion < quizQuestions.length - 1 ? 'Следующий вопрос →' : 'Показать результат →'}
            </button>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mt-4 bg-white rounded-lg p-3 shadow-sm">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="h-2 rounded-full bg-blue-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
    </div>
  );
}

export default SocialMediaQuiz;
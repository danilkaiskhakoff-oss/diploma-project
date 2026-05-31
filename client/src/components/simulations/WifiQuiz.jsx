import { useState } from 'react';
import { motion } from 'framer-motion';

const quizQuestions = [
  {
    question: 'Что такое Evil Twin атака?',
    options: ['Вирус', 'Фальшивая точка доступа Wi-Fi', 'Взлом пароля', 'DDoS'],
    correctIndex: 1,
    explanation: 'Evil Twin — это фальшивая Wi-Fi точка, которая маскируется под легитимную для перехвата данных.'
  },
  {
    question: 'Что НЕ стоит делать в публичном Wi-Fi?',
    options: ['Читать новости', 'Заходить в банковское приложение', 'Слушать музыку', 'Писать документы'],
    correctIndex: 1,
    explanation: 'Банковские операции через публичный Wi-Fi крайне рискованны — трафик может быть перехвачен.'
  },
  {
    question: 'Какой протокол шифрования самый надёжный для Wi-Fi?',
    options: ['WEP', 'WPA', 'WPA2', 'WPA3'],
    correctIndex: 3,
    explanation: 'WPA3 — самый современный и защищённый протокол шифрования для Wi-Fi сетей.'
  },
  {
    question: 'Зачем отключать WPS на роутере?',
    options: ['Для скорости', 'WPS имеет уязвимости', 'Для красоты', 'Не нужно'],
    correctIndex: 1,
    explanation: 'WPS (Wi-Fi Protected Setup) имеет известные уязвимости, позволяющие подобрать PIN-код.'
  }
];

function WifiQuiz({ onComplete }) {
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
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <h2 className="text-xl font-bold text-gray-800">Проверка знаний</h2>
        <div className="flex justify-between text-sm text-gray-600 mt-1">
          <span>Вопрос {currentQuestion + 1}/{quizQuestions.length}</span>
          <span>Правильно: {score}</span>
        </div>
      </div>

      {/* Progress */}
      <div className="px-6 py-2 bg-gray-100">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="h-2 rounded-full bg-blue-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-800 mb-6">{question.question}</h3>

          {/* Options */}
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleSelect(index)}
                disabled={showExplanation}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  showExplanation
                    ? index === question.correctIndex
                      ? 'bg-green-50 border-green-500 text-green-800'
                      : selectedAnswer === index
                      ? 'bg-red-50 border-red-500 text-red-800'
                      : 'bg-gray-50 border-gray-200 text-gray-400'
                    : 'bg-white border-gray-200 hover:border-blue-500 text-gray-800'
                }`}
              >
                <span className="font-bold mr-2">{String.fromCharCode(65 + index)}.</span>
                {option}
              </button>
            ))}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-6 p-4 rounded-xl border ${
                question.options[selectedAnswer].correct
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
              }`}
            >
              <p className={`text-sm font-medium mb-1 ${
                question.options[selectedAnswer].correct ? 'text-green-800' : 'text-red-800'
              }`}>
                {question.options[selectedAnswer].correct ? '✓ Правильно!' : '✗ Неверно!'}
              </p>
              <p className="text-sm text-gray-700">{question.explanation}</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Next Button */}
      {showExplanation && (
        <div className="bg-white border-t px-6 py-4">
          <button
            onClick={handleNext}
            className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
          >
            {currentQuestion < quizQuestions.length - 1 ? 'Следующий вопрос →' : 'Показать результат →'}
          </button>
        </div>
      )}
    </div>
  );
}

export default WifiQuiz;

import { useState } from 'react';
import { motion } from 'framer-motion';

const quizQuestions = [
  {
    question: 'Что означает "конфиденциальность" в кибербезопасности?',
    options: ['Данные доступны всем', 'Данные доступны только авторизованным лицам', 'Данные удалены', 'Данные зашифрованы'],
    correctIndex: 1,
    explanation: 'Конфиденциальность гарантирует, что информация доступна только тем, кто имеет на это право.'
  },
  {
    question: 'Сколько кибератак происходит ежедневно в мире?',
    options: ['100', '1000', 'Более 2000', '10000'],
    correctIndex: 2,
    explanation: 'По статистике, ежедневно происходит более 2000 кибератак по всему миру.'
  },
  {
    question: 'Что такое CIA Triad?',
    options: ['Группа хакеров', 'Конфиденциальность, Целостность, Доступность', 'Тип вируса', 'Метод шифрования'],
    correctIndex: 1,
    explanation: 'CIA Triad — три основных принципа кибербезопасности: Confidentiality, Integrity, Availability.'
  },
  {
    question: 'Какой первый этап хакерской атаки?',
    options: ['Установка вредоноса', 'Кража данных', 'Разведка', 'Шифрование'],
    correctIndex: 2,
    explanation: 'Разведка (Reconnaissance) — первый этап, когда хакер собирает информацию о цели.'
  }
];

function CyberBasicsQuiz({ onComplete }) {
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
      <div className="bg-gray-900 rounded-lg p-6 mb-4 border border-blue-500/30">
        <h2 className="text-xl font-bold mb-2 text-blue-400">
          Проверка знаний
        </h2>
        <p className="text-gray-400 text-sm mb-2">
          Ответьте на вопросы, чтобы закрепить материал
        </p>
        <div className="flex justify-between text-sm text-gray-400">
          <span>Вопрос {currentQuestion + 1}/{quizQuestions.length}</span>
          <span>Правильно: {score}</span>
        </div>
      </div>

      {/* Question */}
      <div className="bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="p-6">
          <h3 className="text-lg font-medium text-white mb-4">{question.question}</h3>

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
                      ? 'bg-green-900/30 border-2 border-green-500 text-green-400'
                      : selectedAnswer === index
                      ? 'bg-red-900/30 border-2 border-red-500 text-red-400'
                      : 'bg-gray-700 text-gray-500'
                    : 'bg-gray-700 hover:bg-gray-600 text-white'
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
              className="mt-4 p-4 bg-blue-900/30 rounded-lg border border-blue-500/30"
            >
              <p className="text-sm text-blue-300">
                <span className="font-medium">Пояснение:</span> {question.explanation}
              </p>
            </motion.div>
          )}
        </div>

        {/* Next Button */}
        {showExplanation && (
          <div className="p-4 border-t border-gray-700 bg-gray-900">
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
      <div className="mt-4 bg-gray-800 rounded-lg p-3">
        <div className="w-full bg-gray-700 rounded-full h-2">
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

export default CyberBasicsQuiz;
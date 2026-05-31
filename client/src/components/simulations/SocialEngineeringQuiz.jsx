import { useState } from 'react';
import { motion } from 'framer-motion';

const quizQuestions = [
  {
    question: 'Вам звонит "сотрудник банка" и просит код из SMS. Что делать?',
    options: ['Дать код', 'Положить трубку и позвонить в банк', 'Спросить имя сотрудника', 'Перезвонить позже'],
    correctIndex: 1,
    explanation: 'Никогда не сообщайте коды из SMS. Настоящие сотрудники банка никогда не просят их.'
  },
  {
    question: 'Что такое претекстинг?',
    options: ['Взлом сервера', 'Создание выдуманного сценария для получения данных', 'Фишинговое письмо', 'Вирус'],
    correctIndex: 1,
    explanation: 'Претекстинг — это создание ложного сценария, чтобы вызвать доверие и получить информацию.'
  },
  {
    question: 'Как распознать социальную инженерию?',
    options: ['По срочности и давлению', 'По грамматическим ошибкам', 'По длинному тексту', 'По картинкам'],
    correctIndex: 0,
    explanation: 'Социальная инженерия часто использует срочность и давление, чтобы жертва не успела подумать.'
  },
  {
    question: 'Что делать при подозрительном звонке?',
    options: ['Дать информацию', 'Положить трубку и проверить', 'Игнорировать', 'Перезвонить'],
    correctIndex: 1,
    explanation: 'При подозрительном звонке лучше положить трубку и самостоятельно проверить через официальные каналы.'
  }
];

function SocialEngineeringQuiz({ onComplete }) {
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
    <div className="h-full flex flex-col bg-gray-900">
      {/* Header */}
      <div className="px-4 py-3 bg-gray-800">
        <h3 className="text-white font-medium mb-1">Проверка знаний</h3>
        <div className="flex justify-between text-xs text-gray-400">
          <span>Вопрос {currentQuestion + 1}/{quizQuestions.length}</span>
          <span>Правильно: {score}</span>
        </div>
      </div>

      {/* Progress */}
      <div className="px-4 py-2 bg-gray-800/50">
        <div className="w-full bg-gray-700 rounded-full h-1">
          <motion.div
            className="h-1 rounded-full bg-green-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="bg-gray-800 rounded-xl p-4 mb-4">
          <h4 className="text-white text-sm mb-4">{question.question}</h4>

          {/* Options */}
          <div className="space-y-2">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleSelect(index)}
                disabled={showExplanation}
                className={`w-full text-left p-3 rounded-xl text-sm transition ${
                  showExplanation
                    ? index === question.correctIndex
                      ? 'bg-green-900/50 border-2 border-green-500 text-green-300'
                      : selectedAnswer === index
                      ? 'bg-red-900/50 border-2 border-red-500 text-red-300'
                      : 'bg-gray-800 text-gray-500'
                    : 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700'
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
              className="mt-4 p-3 bg-green-900/30 rounded-xl border border-green-500/50"
            >
              <p className="text-xs text-green-300">
                <span className="font-medium">Пояснение:</span> {question.explanation}
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Next Button */}
      {showExplanation && (
        <div className="px-4 py-3 bg-gray-800">
          <button
            onClick={handleNext}
            className="w-full py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition"
          >
            {currentQuestion < quizQuestions.length - 1 ? 'Следующий вопрос →' : 'Показать результат →'}
          </button>
        </div>
      )}
    </div>
  );
}

export default SocialEngineeringQuiz;

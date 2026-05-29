import { useState } from 'react';
import { motion } from 'framer-motion';

const quizQuestions = [
  {
    question: 'Что такое MITM-атака?',
    options: ['Вирус на компьютере', 'Перехват трафика между двумя сторонами', 'Взлом пароля', 'Удаление файлов'],
    correctIndex: 1,
    explanation: 'MITM (Man-in-the-Middle) — атака, при которой злоумышленник перехватывает и может изменять передаваемые данные.'
  },
  {
    question: 'Как защититься от атак на открытых Wi-Fi?',
    options: ['Не использовать интернет', 'Использовать VPN', 'Отключить Wi-Fi', 'Ничего'],
    correctIndex: 1,
    explanation: 'VPN шифрует весь трафик, делая его нечитаемым для атакующих в публичных сетях.'
  },
  {
    question: 'Что такое Evil Twin атака?',
    options: ['Вирус', 'Фальшивая точка доступа Wi-Fi', 'Взлом пароля', 'DDoS'],
    correctIndex: 1,
    explanation: 'Evil Twin — это фальшивая Wi-Fi точка, которая маскируется под легитимную для перехвата данных.'
  },
  {
    question: 'Какой протокол защищает данные при передаче?',
    options: ['HTTP', 'HTTPS', 'FTP', 'SMTP'],
    correctIndex: 1,
    explanation: 'HTTPS шифрует данные между браузером и сервером, защищая от перехвата.'
  }
];

function NetworkAttacksQuiz({ onComplete }) {
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
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-green-400 font-mono text-lg mb-2"
        >
          $ KNOWLEDGE VERIFICATION
        </motion.div>
        <div className="flex justify-between text-sm text-gray-400 font-mono">
          <span>QUESTION {currentQuestion + 1}/{quizQuestions.length}</span>
          <span>CORRECT: {score}</span>
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 overflow-y-auto">
        <div className="bg-gray-900 rounded-lg p-6 border border-green-500/30">
          <h3 className="text-lg font-medium text-green-400 mb-4 font-mono">{question.question}</h3>

          {/* Options */}
          <div className="space-y-2">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleSelect(index)}
                disabled={showExplanation}
                className={`w-full text-left p-4 rounded-lg font-mono transition ${
                  showExplanation
                    ? index === question.correctIndex
                      ? 'bg-green-900/30 border-2 border-green-500 text-green-400'
                      : selectedAnswer === index
                      ? 'bg-red-900/30 border-2 border-red-500 text-red-400'
                      : 'bg-gray-900 text-gray-500 border border-gray-700'
                    : 'bg-gray-900 hover:bg-gray-800 text-green-400 border border-gray-700 hover:border-green-500/50'
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
              className="mt-4 p-4 bg-gray-900 rounded-lg border border-green-500/30"
            >
              <p className="text-sm text-green-400 font-mono">
                <span className="font-bold">$ EXPLANATION:</span> {question.explanation}
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4 bg-gray-900 rounded-lg p-3 border border-gray-700">
        <div className="w-full bg-gray-800 rounded-full h-2">
          <motion.div
            className="h-2 rounded-full bg-green-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Next Button */}
      {showExplanation && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={handleNext}
          className="mt-4 w-full py-3 bg-green-500 text-black font-mono font-bold rounded-lg hover:bg-green-400 transition"
        >
          {currentQuestion < quizQuestions.length - 1 ? '$ NEXT QUESTION' : '$ SHOW RESULTS'}
        </motion.button>
      )}
    </div>
  );
}

export default NetworkAttacksQuiz;
import { useState } from 'react';
import { motion } from 'framer-motion';

const dialogSteps = [
  {
    id: 1,
    caller: 'Здравствуйте! Это служба безопасности Сбербанка. Мы обнаружили подозрительную операцию по вашей карте. Для подтверждения личности назовите код из SMS, который мы только что отправили.',
    options: [
      { text: 'Назвать код из SMS', correct: false, explanation: 'Никогда не сообщайте коды из SMS! Это мошенники.' },
      { text: 'Положить трубку и позвонить в банк', correct: true, explanation: 'Правильно! Настоящий банк никогда не просит коды из SMS.' },
      { text: 'Спросить номер сотрудника', correct: false, explanation: 'Мошенники могут назвать любой номер. Лучше позвонить в банк самостоятельно.' }
    ]
  },
  {
    id: 2,
    caller: 'Понимаю ваше беспокойство, но время ограничено! Если вы не подтвердите операцию в течение 5 минут, ваша карта будет заблокирована. Это стандартная процедура безопасности.',
    options: [
      { text: 'Поторопиться и назвать код', correct: false, explanation: 'Срочность — это манипуляция! Мошенники создают давление, чтобы вы не успели подумать.' },
      { text: 'Сказать, что перезвоните сами', correct: true, explanation: 'Отлично! Вы контролируете ситуацию и не поддаетесь давлению.' },
      { text: 'Попросить подождать', correct: false, explanation: 'Не стоит вести диалог с мошенниками. Лучше сразу прекратить разговор.' }
    ]
  },
  {
    id: 3,
    caller: 'Хорошо, я понимаю. Но тогда назовите хотя бы последние 4 цифры вашей карты и дату рождения для верификации. Это займёт всего минуту.',
    options: [
      { text: 'Назвать данные карты', correct: false, explanation: 'Никогда не сообщайте данные карты по телефону! Это может привести к краже денег.' },
      { text: 'Отказаться и положить трубку', correct: true, explanation: 'Правильно! Вы защитили свои данные. Мошенники не получили информацию.' },
      { text: 'Спросить, зачем это нужно', correct: false, explanation: 'Не вступайте в диалог. Мошенники могут использовать любую информацию.' }
    ]
  }
];

function PhoneDialog({ callChoice, onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [results, setResults] = useState([]);

  const step = dialogSteps[currentStep];
  const answeredCount = results.length;

  const handleSelect = (optionIndex) => {
    if (showExplanation) return;
    setSelectedOption(optionIndex);
    setShowExplanation(true);
    setResults(prev => [...prev, {
      step: currentStep + 1,
      correct: step.options[optionIndex].correct,
      explanation: step.options[optionIndex].explanation
    }]);
  };

  const handleNext = () => {
    if (currentStep < dialogSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      const correctCount = results.filter(r => r.correct).length;
      const score = correctCount * 10;
      onComplete({ score, max: 30, choices: results });
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Header */}
      <div className="px-4 py-3 bg-gray-800 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-xl">
          📞
        </div>
        <div>
          <h3 className="text-white font-medium">Сбербанк</h3>
          <p className="text-gray-400 text-xs">Входящий звонок</p>
        </div>
      </div>

      {/* Progress */}
      <div className="px-4 py-2 bg-gray-800/50">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Диалог {currentStep + 1}/{dialogSteps.length}</span>
          <span>Правильно: {results.filter(r => r.correct).length}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-1">
          <motion.div
            className="h-1 rounded-full bg-green-500"
            initial={{ width: 0 }}
            animate={{ width: `${(answeredCount / dialogSteps.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Caller Message */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gray-800 rounded-2xl rounded-tl-none p-4 mb-4"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-sm flex-shrink-0">
              📞
            </div>
            <p className="text-white text-sm">{step.caller}</p>
          </div>
        </motion.div>

        {/* Options */}
        <div className="space-y-2">
          {step.options.map((option, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleSelect(index)}
              disabled={showExplanation}
              className={`w-full text-left p-3 rounded-xl text-sm transition ${
                showExplanation
                  ? option.correct
                    ? 'bg-green-900/50 border-2 border-green-500 text-green-300'
                    : selectedOption === index
                    ? 'bg-red-900/50 border-2 border-red-500 text-red-300'
                    : 'bg-gray-800 text-gray-500'
                  : 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700'
              }`}
            >
              {option.text}
            </motion.button>
          ))}
        </div>

        {/* Explanation */}
        {showExplanation && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-4 p-3 rounded-xl text-xs ${
              step.options[selectedOption].correct
                ? 'bg-green-900/30 border border-green-500/50 text-green-300'
                : 'bg-red-900/30 border border-red-500/50 text-red-300'
            }`}
          >
            <p className="font-medium mb-1">
              {step.options[selectedOption].correct ? '✓ Правильно!' : '✗ Неверно!'}
            </p>
            <p>{step.options[selectedOption].explanation}</p>
          </motion.div>
        )}
      </div>

      {/* Next Button */}
      {showExplanation && (
        <div className="px-4 py-3 bg-gray-800">
          <button
            onClick={handleNext}
            className="w-full py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition"
          >
            {currentStep < dialogSteps.length - 1 ? 'Следующая реплика →' : 'Продолжить →'}
          </button>
        </div>
      )}
    </div>
  );
}

export default PhoneDialog;

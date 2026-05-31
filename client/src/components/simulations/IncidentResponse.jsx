import { useState } from 'react';
import { motion } from 'framer-motion';

const incidents = [
  {
    id: 1,
    title: 'Злонамеренный инсайдер',
    scenario: 'Сотрудник Алексей Смирнов подал заявление об увольнении и скачивает базу клиентов. Что делать?',
    options: [
      {
        id: 'block',
        label: 'Немедленно заблокировать доступ',
        correct: true,
        score: 10,
        explanation: 'Правильно! Немедленная блокировка доступа предотвратит дальнейшую утечку данных.'
      },
      {
        id: 'watch',
        label: 'Продолжить наблюдение',
        correct: false,
        score: 2,
        explanation: 'Опасно! Пока вы наблюдаете, сотрудник продолжает скачивать данные.'
      },
      {
        id: 'talk',
        label: 'Поговорить с сотрудником',
        correct: false,
        score: 0,
        explanation: 'Не рекомендуется! Это может предупредить сотрудника и дать ему время уничтожить улики.'
      },
      {
        id: 'ignore',
        label: 'Ничего не делать',
        correct: false,
        score: 0,
        explanation: 'Критическая ошибка! Данные будут утечены.'
      }
    ]
  },
  {
    id: 2,
    title: 'Скомпрометированный аккаунт',
    scenario: 'Аккаунт бухгалтера Дмитрия Козлова взломан через фишинг. С сервера уходят данные. Что делать?',
    options: [
      {
        id: 'reset',
        label: 'Сбросить пароль и изолировать аккаунт',
        correct: true,
        score: 10,
        explanation: 'Правильно! Сброс пароля и изоляция аккаунта остановят атакующего.'
      },
      {
        id: 'scan',
        label: 'Запустить антивирус на компьютере',
        correct: false,
        score: 5,
        explanation: 'Частично правильно, но недостаточно. Нужно сначала заблокировать доступ.'
      },
      {
        id: 'email',
        label: 'Отправить email сотруднику',
        correct: false,
        score: 0,
        explanation: 'Бесполезно! Аккаунт скомпрометирован, атакующий получит ваше сообщение.'
      },
      {
        id: 'wait',
        label: 'Подождать до утра',
        correct: false,
        score: 0,
        explanation: 'Критическая ошибка! Данные утекают прямо сейчас!'
      }
    ]
  },
  {
    id: 3,
    title: 'Неосторожный инсайдер',
    scenario: 'HR менеджер Елена Петрова по ошибке отправила резюме 50 сотрудников внешнему контакту. Что делать?',
    options: [
      {
        id: 'recall',
        label: 'Помочь отозвать письмо и уведомить контакт',
        correct: true,
        score: 10,
        explanation: 'Правильно! Попытка отозвать письмо и уведомление внешнего контакта минимизируют ущерб.'
      },
      {
        id: 'fire',
        label: 'Уволить сотрудника',
        correct: false,
        score: 0,
        explanation: 'Слишком сурово! Это была ошибка, а не злонамеренное действие. Нужно обучение.'
      },
      {
        id: 'ignore',
        label: 'Ничего не делать',
        correct: false,
        score: 0,
        explanation: 'Неправильно! Конфиденциальные данные уже у внешнего контакта.'
      },
      {
        id: 'train',
        label: 'Отправить на повторный тренинг по безопасности',
        correct: false,
        score: 5,
        explanation: 'Хорошо для профилактики, но сначала нужно минимизировать текущий ущерб.'
      }
    ]
  }
];

function IncidentResponse({ onComplete }) {
  const [currentIncident, setCurrentIncident] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);

  const incident = incidents[currentIncident];
  const progress = ((currentIncident + (showExplanation ? 1 : 0)) / incidents.length) * 100;

  const handleSelect = (option) => {
    if (showExplanation) return;
    setSelectedOption(option);
    setShowExplanation(true);
    if (option.correct) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentIncident < incidents.length - 1) {
      setCurrentIncident(currentIncident + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      onComplete({ score: score * 10, max: incidents.length * 10 });
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 px-6 py-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Реагирование на инциденты</h2>
            <p className="text-gray-400 text-sm">Выберите правильную реакцию на инцидент</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400">Инцидент {currentIncident + 1}/{incidents.length}</div>
            <div className="text-sm font-medium text-green-400">Правильно: {score}</div>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="px-6 py-2 bg-gray-800 border-b border-gray-700">
        <div className="w-full bg-gray-700 rounded-full h-2">
          <motion.div
            className="h-2 rounded-full bg-green-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Incident Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
              <span className="text-red-400 text-xl">⚠️</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{incident.title}</h3>
              <p className="text-sm text-gray-400">Сценарий инцидента</p>
            </div>
          </div>

          <p className="text-gray-300 mb-6 p-4 bg-gray-900 rounded-lg border border-gray-700">
            {incident.scenario}
          </p>

          {/* Options */}
          <div className="space-y-3">
            {incident.options.map((option, index) => (
              <motion.button
                key={option.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleSelect(option)}
                disabled={showExplanation}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  showExplanation
                    ? option.correct
                      ? 'bg-green-900/30 border-green-500'
                      : selectedOption?.id === option.id
                      ? 'bg-red-900/30 border-red-500'
                      : 'bg-gray-900 border-gray-700 text-gray-500'
                    : 'bg-gray-900 border-gray-700 hover:border-blue-500 text-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                    showExplanation
                      ? option.correct
                        ? 'bg-green-500 border-green-500 text-white'
                        : selectedOption?.id === option.id
                        ? 'bg-red-500 border-red-500 text-white'
                        : 'border-gray-600 text-gray-500'
                      : 'border-gray-600 text-gray-400'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="font-medium">{option.label}</span>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-6 p-4 rounded-lg border ${
                selectedOption.correct
                  ? 'bg-green-900/30 border-green-800 text-green-300'
                  : 'bg-red-900/30 border-red-800 text-red-300'
              }`}
            >
              <p className="font-medium mb-2">
                {selectedOption.correct ? '✓ Правильное решение!' : '✗ Неоптимальное решение!'}
              </p>
              <p className="text-sm">{selectedOption.explanation}</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Next Button */}
      {showExplanation && (
        <div className="bg-gray-800 border-t border-gray-700 px-6 py-4">
          <button
            onClick={handleNext}
            className="w-full py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition"
          >
            {currentIncident < incidents.length - 1 ? 'Следующий инцидент →' : 'Перейти к квизу →'}
          </button>
        </div>
      )}
    </div>
  );
}

export default IncidentResponse;

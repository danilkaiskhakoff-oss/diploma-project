import { useState } from 'react';
import { motion } from 'framer-motion';

const cases = [
  {
    id: 1,
    title: 'Случай #1: Массовое скачивание данных',
    employee: 'Алексей Смирнов',
    position: 'Разработчик',
    evidence: [
      { type: 'log', content: '14:20 - Скачивание базы клиентов (2.3 GB)', risk: 'high' },
      { type: 'log', content: '15:45 - Попытка доступа к HR данным', risk: 'high' },
      { type: 'email', content: 'Отправка файлов на personal@email.com', risk: 'critical' },
      { type: 'hr', content: 'Подал заявление об увольнении 3 дня назад', risk: 'high' }
    ],
    threatTypes: [
      { id: 'malicious', label: 'Злонамеренный', description: 'Сотрудник намеренно вредит организации' },
      { id: 'careless', label: 'Неосторожный', description: 'Сотрудник по ошибке раскрыл данные' },
      { id: 'compromised', label: 'Скомпрометированный', description: 'Аккаунт сотрудника взломан' }
    ],
    correctType: 'malicious',
    explanation: 'Сотрудник подал заявление об увольнении и начал скачивать конфиденциальные данные. Это классический пример злонамеренного инсайдера.'
  },
  {
    id: 2,
    title: 'Случай #2: Аномальная сетевая активность',
    employee: 'Дмитрий Козлов',
    position: 'Бухгалтер',
    evidence: [
      { type: 'log', content: '09:00 - Открытие email с темой "Счёт на оплату"', risk: 'high' },
      { type: 'log', content: '09:05 - Запуск вложенного файла invoice.exe', risk: 'critical' },
      { type: 'network', content: 'Аномальный исходящий трафик (500 MB)', risk: 'critical' },
      { type: 'system', content: 'Попытка доступа к файловому серверу', risk: 'high' }
    ],
    threatTypes: [
      { id: 'malicious', label: 'Злонамеренный', description: 'Сотрудник намеренно вредит организации' },
      { id: 'careless', label: 'Неосторожный', description: 'Сотрудник по ошибке раскрыл данные' },
      { id: 'compromised', label: 'Скомпрометированный', description: 'Аккаунт сотрудника взломан' }
    ],
    correctType: 'compromised',
    explanation: 'Сотрудник открыл фишинговое письмо и запустил вредоносный файл. Его аккаунт был скомпрометирован и используется атакующим.'
  },
  {
    id: 3,
    title: 'Случай #3: Ошибка в отправке данных',
    employee: 'Елена Петрова',
    position: 'HR менеджер',
    evidence: [
      { type: 'email', content: 'Отправка резюме 50 сотрудников внешнему контакту', risk: 'high' },
      { type: 'log', content: '11:30 - Ошибка в адресе (external@ vs internal@)', risk: 'high' },
      { type: 'log', content: '12:00 - Попытка отозвать письмо', risk: 'low' },
      { type: 'hr', content: 'Ранее проходила тренинг по безопасности', risk: 'low' }
    ],
    threatTypes: [
      { id: 'malicious', label: 'Злонамеренный', description: 'Сотрудник намеренно вредит организации' },
      { id: 'careless', label: 'Неосторожный', description: 'Сотрудник по ошибке раскрыл данные' },
      { id: 'compromised', label: 'Скомпрометированный', description: 'Аккаунт сотрудника взломан' }
    ],
    correctType: 'careless',
    explanation: 'Сотрудник по ошибке отправил конфиденциальные данные внешнему контакту из-за ошибки в адресе. Это неосторожный инсайдер.'
  }
];

function ThreatInvestigation({ onComplete }) {
  const [currentCase, setCurrentCase] = useState(0);
  const [selectedType, setSelectedType] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);

  const caseData = cases[currentCase];
  const progress = ((currentCase + (showExplanation ? 1 : 0)) / cases.length) * 100;

  const handleSelect = (typeId) => {
    if (showExplanation) return;
    setSelectedType(typeId);
    setShowExplanation(true);
    if (typeId === caseData.correctType) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentCase < cases.length - 1) {
      setCurrentCase(currentCase + 1);
      setSelectedType(null);
      setShowExplanation(false);
    } else {
      onComplete({ score: score * 10, max: cases.length * 10 });
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 px-6 py-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Расследование инцидентов</h2>
            <p className="text-gray-400 text-sm">Определите тип инсайдерской угрозы</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400">Случай {currentCase + 1}/{cases.length}</div>
            <div className="text-sm font-medium text-blue-400">Правильно: {score}</div>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="px-6 py-2 bg-gray-800 border-b border-gray-700">
        <div className="w-full bg-gray-700 rounded-full h-2">
          <motion.div
            className="h-2 rounded-full bg-blue-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Case Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-bold text-white mb-2">{caseData.title}</h3>
          <p className="text-gray-400 text-sm mb-6">
            Сотрудник: {caseData.employee} • {caseData.position}
          </p>

          {/* Evidence */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-300 mb-3">Улики:</h4>
            <div className="space-y-2">
              {caseData.evidence.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 p-3 bg-gray-900 rounded border border-gray-700"
                >
                  <span className={`w-2 h-2 rounded-full ${
                    item.risk === 'critical' ? 'bg-red-500' :
                    item.risk === 'high' ? 'bg-orange-500' :
                    'bg-yellow-500'
                  }`} />
                  <span className="text-xs text-gray-500 font-mono uppercase w-16">{item.type}</span>
                  <span className="text-sm text-gray-300">{item.content}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Threat Type Selection */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-300 mb-3">Тип угрозы:</h4>
            <div className="grid grid-cols-3 gap-3">
              {caseData.threatTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => handleSelect(type.id)}
                  disabled={showExplanation}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    showExplanation
                      ? type.id === caseData.correctType
                        ? 'bg-green-900/30 border-green-500'
                        : selectedType === type.id
                        ? 'bg-red-900/30 border-red-500'
                        : 'bg-gray-900 border-gray-700 text-gray-500'
                      : 'bg-gray-900 border-gray-700 hover:border-blue-500 text-gray-300'
                  }`}
                >
                  <div className="font-medium text-sm mb-1">{type.label}</div>
                  <div className="text-xs text-gray-400">{type.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Explanation */}
          {showExplanation && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg border ${
                selectedType === caseData.correctType
                  ? 'bg-green-900/30 border-green-800 text-green-300'
                  : 'bg-red-900/30 border-red-800 text-red-300'
              }`}
            >
              <p className="font-medium mb-2">
                {selectedType === caseData.correctType ? '✓ Правильно!' : '✗ Неверно!'}
              </p>
              <p className="text-sm">{caseData.explanation}</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Next Button */}
      {showExplanation && (
        <div className="bg-gray-800 border-t border-gray-700 px-6 py-4">
          <button
            onClick={handleNext}
            className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
          >
            {currentCase < cases.length - 1 ? 'Следующий случай →' : 'Завершить расследование →'}
          </button>
        </div>
      )}
    </div>
  );
}

export default ThreatInvestigation;

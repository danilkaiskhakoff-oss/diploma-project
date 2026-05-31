import { useState } from 'react';
import { motion } from 'framer-motion';

const employees = [
  {
    id: 1,
    name: 'Алексей Смирнов',
    position: 'Разработчик',
    department: 'IT',
    avatar: '',
    activities: [
      { time: '09:15', action: 'Вход в систему', risk: 'low' },
      { time: '10:30', action: 'Доступ к документации проекта', risk: 'low' },
      { time: '14:20', action: 'Скачивание базы клиентов (2.3 GB)', risk: 'high' },
      { time: '15:45', action: 'Попытка доступа к HR данным', risk: 'high' },
      { time: '16:30', action: 'Отправка файлов на личный email', risk: 'critical' }
    ],
    isThreat: true,
    threatType: 'malicious',
    explanation: 'Сотрудник скачивает конфиденциальные данные и отправляет их на личный email. Это признак злонамеренного инсайдера.'
  },
  {
    id: 2,
    name: 'Мария Иванова',
    position: 'Маркетолог',
    department: 'Маркетинг',
    avatar: '',
    activities: [
      { time: '09:00', action: 'Вход в систему', risk: 'low' },
      { time: '09:30', action: 'Работа с CRM системой', risk: 'low' },
      { time: '11:15', action: 'Создание отчёта', risk: 'low' },
      { time: '13:00', action: 'Обед', risk: 'low' },
      { time: '14:00', action: 'Встреча с командой', risk: 'low' }
    ],
    isThreat: false,
    threatType: null,
    explanation: 'Нормальная активность сотрудника. Нет подозрительных действий.'
  },
  {
    id: 3,
    name: 'Дмитрий Козлов',
    position: 'Бухгалтер',
    department: 'Финансы',
    avatar: '',
    activities: [
      { time: '08:45', action: 'Вход в систему', risk: 'low' },
      { time: '09:00', action: 'Открытие фишингового email', risk: 'high' },
      { time: '09:05', action: 'Запуск вложенного файла', risk: 'critical' },
      { time: '09:10', action: 'Аномальная сетевая активность', risk: 'critical' },
      { time: '09:15', action: 'Попытка доступа к серверу', risk: 'high' }
    ],
    isThreat: true,
    threatType: 'compromised',
    explanation: 'Сотрудник открыл фишинговое письмо и запустил вредоносный файл. Его аккаунт скомпрометирован.'
  },
  {
    id: 4,
    name: 'Елена Петрова',
    position: 'HR менеджер',
    department: 'HR',
    avatar: '',
    activities: [
      { time: '09:30', action: 'Вход в систему', risk: 'low' },
      { time: '10:00', action: 'Обновление данных сотрудников', risk: 'low' },
      { time: '11:30', action: 'Отправка резюме по ошибке внешнему контакту', risk: 'high' },
      { time: '12:00', action: 'Попытка отозвать письмо', risk: 'low' }
    ],
    isThreat: true,
    threatType: 'careless',
    explanation: 'Сотрудник по ошибке отправил конфиденциальные данные внешнему контакту. Это неосторожный инсайдер.'
  }
];

function ActivityMonitor({ onComplete }) {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [identifiedThreats, setIdentifiedThreats] = useState([]);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleEmployeeClick = (employee) => {
    setSelectedEmployee(employee);
    setShowExplanation(true);
  };

  const handleIdentifyThreat = (employeeId) => {
    if (identifiedThreats.includes(employeeId)) return;
    setIdentifiedThreats(prev => [...prev, employeeId]);
  };

  const handleNext = () => {
    const correctIdentified = employees
      .filter(e => e.isThreat && identifiedThreats.includes(e.id))
      .length;
    const falsePositives = identifiedThreats.filter(id => {
      const emp = employees.find(e => e.id === id);
      return !emp.isThreat;
    }).length;

    const score = Math.max(0, (correctIdentified * 10) - (falsePositives * 5));
    onComplete({ score: Math.min(score, 30), max: 30 });
  };

  const threatCount = employees.filter(e => e.isThreat).length;

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 px-6 py-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Мониторинг активности сотрудников</h2>
            <p className="text-gray-400 text-sm">Найдите подозрительную активность в логах</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-red-500/20 rounded-full">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-red-400 text-sm font-medium">LIVE</span>
          </div>
        </div>
      </div>

      {/* Employee List */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-2 gap-4">
          {employees.map((employee, index) => (
            <motion.button
              key={employee.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleEmployeeClick(employee)}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                selectedEmployee?.id === employee.id
                  ? 'bg-blue-900/30 border-blue-500'
                  : identifiedThreats.includes(employee.id)
                  ? 'bg-red-900/30 border-red-500'
                  : 'bg-gray-800 border-gray-700 hover:border-gray-600'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                  <span className="text-lg">{employee.avatar}</span>
                </div>
                <div>
                  <h3 className="font-medium text-white text-sm">{employee.name}</h3>
                  <p className="text-xs text-gray-400">{employee.position} • {employee.department}</p>
                </div>
              </div>

              {/* Activity Summary */}
              <div className="space-y-1">
                {employee.activities.slice(-2).map((activity, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <span className="text-gray-500">{activity.time}</span>
                    <span className={`w-2 h-2 rounded-full ${
                      activity.risk === 'critical' ? 'bg-red-500' :
                      activity.risk === 'high' ? 'bg-orange-500' :
                      'bg-green-500'
                    }`} />
                    <span className="text-gray-300 truncate">{activity.action}</span>
                  </div>
                ))}
              </div>

              {/* Threat Badge */}
              {identifiedThreats.includes(employee.id) && (
                <div className="mt-3 px-2 py-1 bg-red-500/20 rounded text-xs text-red-400 font-medium">
                  ⚠ Подозрительная активность
                </div>
              )}
            </motion.button>
          ))}
        </div>

        {/* Selected Employee Details */}
        {selectedEmployee && showExplanation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-5 bg-gray-800 rounded-lg border border-gray-700"
          >
            <h3 className="font-bold text-white mb-3">Детали: {selectedEmployee.name}</h3>
            
            {/* Activity Log */}
            <div className="space-y-2 mb-4">
              {selectedEmployee.activities.map((activity, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <span className="text-gray-500 font-mono w-12">{activity.time}</span>
                  <span className={`w-3 h-3 rounded-full ${
                    activity.risk === 'critical' ? 'bg-red-500' :
                    activity.risk === 'high' ? 'bg-orange-500' :
                    'bg-green-500'
                  }`} />
                  <span className="text-gray-300">{activity.action}</span>
                </div>
              ))}
            </div>

            {/* Explanation */}
            <div className={`p-3 rounded-lg text-sm ${
              selectedEmployee.isThreat
                ? selectedEmployee.threatType === 'malicious'
                  ? 'bg-red-900/30 text-red-300 border border-red-800'
                  : selectedEmployee.threatType === 'compromised'
                  ? 'bg-orange-900/30 text-orange-300 border border-orange-800'
                  : 'bg-yellow-900/30 text-yellow-300 border border-yellow-800'
                : 'bg-green-900/30 text-green-300 border border-green-800'
            }`}>
              <p className="font-medium mb-1">
                {selectedEmployee.isThreat ? '⚠ Обнаружена угроза' : '✓ Активность в норме'}
              </p>
              <p>{selectedEmployee.explanation}</p>
            </div>

            {/* Identify Button */}
            {selectedEmployee.isThreat && !identifiedThreats.includes(selectedEmployee.id) && (
              <button
                onClick={() => handleIdentifyThreat(selectedEmployee.id)}
                className="mt-4 w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
              >
                Отметить как угрозу
              </button>
            )}
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-800 border-t border-gray-700 px-6 py-4">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>Найдено угроз</span>
          <span>{identifiedThreats.length}/{threatCount}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
          <motion.div
            className="h-2 rounded-full bg-red-500"
            initial={{ width: 0 }}
            animate={{ width: `${(identifiedThreats.length / threatCount) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <button
          onClick={handleNext}
          disabled={identifiedThreats.length === 0}
          className={`w-full py-3 font-medium rounded-lg transition ${
            identifiedThreats.length > 0
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-700 text-gray-500 cursor-not-allowed'
          }`}
        >
          Продолжить расследование →
        </button>
      </div>
    </div>
  );
}

export default ActivityMonitor;

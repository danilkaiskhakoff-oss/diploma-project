import { useState } from 'react';
import { motion } from 'framer-motion';

const employees = [
  {
    id: 1,
    name: 'Алексей Смирнов',
    role: 'CTO',
    department: 'Engineering',
    avatar: '',
    email: 'a.smirnov@company.com',
    phone: '+7 (999) 123-45-67',
    tech: ['AWS', 'Docker', 'Kubernetes', 'Python'],
    info: 'Решает все технические вопросы. Имеет доступ к production.',
    value: 'high'
  },
  {
    id: 2,
    name: 'Мария Иванова',
    role: 'HR Manager',
    department: 'HR',
    avatar: '',
    email: 'm.ivanova@company.com',
    phone: '+7 (999) 234-56-78',
    tech: ['Microsoft 365', 'SAP'],
    info: 'Управляет данными сотрудников. Может быть целью для фишинга.',
    value: 'medium'
  },
  {
    id: 3,
    name: 'Дмитрий Козлов',
    role: 'SysAdmin',
    department: 'IT',
    avatar: '',
    email: 'd.kozlov@company.com',
    phone: '+7 (999) 345-67-89',
    tech: ['Linux', 'Windows Server', 'Active Directory', 'VMware'],
    info: 'Администрирует серверы. Имеет root доступ ко всем системам.',
    value: 'critical'
  },
  {
    id: 4,
    name: 'Елена Петрова',
    role: 'Finance Director',
    department: 'Finance',
    avatar: '',
    email: 'e.petrova@company.com',
    phone: '+7 (999) 456-78-90',
    tech: ['1C', 'Excel', 'SAP'],
    info: 'Управляет финансами. Цель для CEO fraud / BEC атак.',
    value: 'high'
  },
  {
    id: 5,
    name: 'Иван Сидоров',
    role: 'Developer',
    department: 'Engineering',
    avatar: '',
    email: 'i.sidorov@company.com',
    phone: null,
    tech: ['React', 'Node.js', 'PostgreSQL', 'GitHub'],
    info: 'Имеет доступ к репозиториям с исходным кодом.',
    value: 'medium'
  },
  {
    id: 6,
    name: 'Ольга Новикова',
    role: 'Marketing Intern',
    department: 'Marketing',
    avatar: '',
    email: 'o.novikova@company.com',
    phone: null,
    tech: ['Canva', 'Google Analytics'],
    info: 'Стажёр. Минимальный доступ. Низкая ценность.',
    value: 'low'
  }
];

const techStack = [
  { category: 'Cloud', tech: 'AWS', confidence: 'high' },
  { category: 'Web', tech: 'React + Node.js', confidence: 'high' },
  { category: 'Database', tech: 'PostgreSQL, MongoDB', confidence: 'medium' },
  { category: 'DevOps', tech: 'Docker, Kubernetes', confidence: 'high' },
  { category: 'Email', tech: 'Microsoft 365', confidence: 'high' },
  { category: 'ERP', tech: 'SAP', confidence: 'medium' }
];

function SocialRecon({ onComplete }) {
  const [collectedData, setCollectedData] = useState({
    emails: [],
    highValueTargets: [],
    techStack: []
  });
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const handleCollectEmail = (employeeId) => {
    if (collectedData.emails.includes(employeeId)) return;
    setCollectedData(prev => ({
      ...prev,
      emails: [...prev.emails, employeeId]
    }));
  };

  const handleMarkTarget = (employeeId) => {
    if (collectedData.highValueTargets.includes(employeeId)) {
      setCollectedData(prev => ({
        ...prev,
        highValueTargets: prev.highValueTargets.filter(id => id !== employeeId)
      }));
    } else {
      setCollectedData(prev => ({
        ...prev,
        highValueTargets: [...prev.highValueTargets, employeeId]
      }));
    }
  };

  const handleNext = () => {
    const highValueEmployees = employees.filter(e => e.value === 'critical' || e.value === 'high');
    const correctTargets = collectedData.highValueTargets.filter(id =>
      highValueEmployees.some(e => e.id === id)
    ).length;
    const falseTargets = collectedData.highValueTargets.filter(id =>
      !highValueEmployees.some(e => e.id === id)
    ).length;

    const emailScore = Math.min(collectedData.emails.length * 3, 15);
    const targetScore = Math.max(0, (correctTargets * 5) - (falseTargets * 3));
    const score = Math.min(emailScore + targetScore, 25);

    setShowResults(true);
    setTimeout(() => {
      onComplete({ score, max: 25, profile: collectedData });
    }, 1500);
  };

  const valueColors = {
    critical: { bg: 'bg-red-500/20', border: 'border-red-500', text: 'text-red-400', badge: 'bg-red-500' },
    high: { bg: 'bg-orange-500/20', border: 'border-orange-500', text: 'text-orange-400', badge: 'bg-orange-500' },
    medium: { bg: 'bg-yellow-500/20', border: 'border-yellow-500', text: 'text-yellow-400', badge: 'bg-yellow-500' },
    low: { bg: 'bg-green-500/20', border: 'border-green-500', text: 'text-green-400', badge: 'bg-green-500' }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Социальная разведка</h2>
            <p className="text-gray-600 text-sm">Соберите информацию о сотрудниках компании</p>
          </div>
          <div className="px-3 py-1 bg-purple-500/20 rounded-full border border-purple-500">
            <span className="text-purple-600 text-sm font-medium">SOCIAL RECON</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Instructions */}
        <div className="bg-purple-50 rounded-xl p-4 border border-purple-200 mb-6">
          <p className="text-purple-700 text-sm">
            Проанализируйте профили сотрудников. Соберите email-адреса и определите ключевые цели для социальной инженерии.
          </p>
        </div>

        {/* Tech Stack Summary */}
        <div className="bg-white rounded-xl p-4 border border-gray-200 mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Стек технологий компании:</h3>
          <div className="flex flex-wrap gap-2">
            {techStack.map((item, index) => (
              <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                {item.tech}
              </span>
            ))}
          </div>
        </div>

        {/* Employee Profiles */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {employees.map((employee, index) => {
            const colors = valueColors[employee.value];
            const isSelected = selectedEmployee === employee.id;
            const hasEmail = collectedData.emails.includes(employee.id);
            const isTarget = collectedData.highValueTargets.includes(employee.id);

            return (
              <motion.div
                key={employee.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`rounded-xl border-2 overflow-hidden transition-all ${
                  isTarget ? `${colors.bg} ${colors.border}` : 'bg-white border-gray-200'
                }`}
              >
                {/* Employee Header */}
                <div className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-xl">
                      {employee.avatar}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800">{employee.name}</h3>
                      <p className="text-sm text-gray-500">{employee.role} • {employee.department}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${colors.badge} text-white`}>
                      {employee.value.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-3">{employee.info}</p>

                  {/* Tech Tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {employee.tech.map((tech, i) => (
                      <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCollectEmail(employee.id)}
                      disabled={hasEmail}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
                        hasEmail
                          ? 'bg-green-100 text-green-700'
                          : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      }`}
                    >
                      {hasEmail ? '✓ Email собран' : 'Собрать email'}
                    </button>
                    <button
                      onClick={() => handleMarkTarget(employee.id)}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
                        isTarget
                          ? 'bg-red-100 text-red-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {isTarget ? '⚠ Цель' : 'Отметить цель'}
                    </button>
                  </div>

                  {/* Expand Details */}
                  <button
                    onClick={() => setSelectedEmployee(isSelected ? null : employee.id)}
                    className="w-full mt-2 py-1 text-xs text-gray-400 hover:text-gray-600"
                  >
                    {isSelected ? 'Скрыть ▲' : 'Подробнее ▼'}
                  </button>

                  {isSelected && employee.phone && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="mt-2 pt-2 border-t border-gray-200"
                    >
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Телефон:</span> {employee.phone}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Email:</span> {employee.email}
                      </p>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Collected Data Summary */}
        {collectedData.emails.length > 0 && (
          <div className="bg-white rounded-xl p-4 border border-gray-200 mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Собрано данных:
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Email-адреса</p>
                <p className="text-lg font-bold text-blue-600">{collectedData.emails.length}/{employees.length}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Ключевые цели</p>
                <p className="text-lg font-bold text-red-600">{collectedData.highValueTargets.length}</p>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {showResults && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-purple-50 border border-purple-200 rounded-xl p-6 text-center"
          >
            <div className="text-4xl mb-3">📋</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Профиль цели составлен!</h3>
            <p className="text-gray-600">
              Email: {collectedData.emails.length} | Цели: {collectedData.highValueTargets.length}
            </p>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      {!showResults && collectedData.emails.length > 0 && (
        <div className="bg-white border-t px-6 py-4">
          <button
            onClick={handleNext}
            className="w-full py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition"
          >
            Перейти к квизу →
          </button>
        </div>
      )}
    </div>
  );
}

export default SocialRecon;

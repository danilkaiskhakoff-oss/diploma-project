import { useState } from 'react';
import { motion } from 'framer-motion';

const tasks = [
  {
    id: 'open-directories',
    title: 'Найти открытые директории',
    description: 'Найти веб-серверы с открытым списком файлов',
    options: [
      { id: 'correct', query: 'intitle:"index of" "parent directory"', correct: true, explanation: 'Найдены открытые директории с файлами!' },
      { id: 'wrong1', query: 'site:example.com login', correct: false, explanation: 'Это обычный поиск по сайту.' },
      { id: 'wrong2', query: 'filetype:pdf report', correct: false, explanation: 'Это поиск PDF файлов, не директорий.' },
      { id: 'wrong3', query: 'inurl:admin dashboard', correct: false, explanation: 'Это поиск админ-панелей.' }
    ]
  },
  {
    id: 'password-files',
    title: 'Найти файлы с паролями',
    description: 'Найти случайно опубликованные файлы с учётными данными',
    options: [
      { id: 'wrong1', query: 'intitle:"index of" mp3', correct: false, explanation: 'Это поиск музыки.' },
      { id: 'correct', query: 'filetype:txt "password" OR "passwd"', correct: true, explanation: 'Найдены текстовые файлы с паролями!' },
      { id: 'wrong2', query: 'site:github.com "api key"', correct: false, explanation: 'Это поиск на GitHub, не файлы с паролями.' },
      { id: 'wrong3', query: 'inurl:login.php', correct: false, explanation: 'Это поиск страниц логина.' }
    ]
  },
  {
    id: 'config-files',
    title: 'Найти конфигурационные файлы',
    description: 'Найти .env файлы с секретами и API ключами',
    options: [
      { id: 'wrong1', query: 'filetype:jpg logo', correct: false, explanation: 'Это поиск изображений.' },
      { id: 'wrong2', query: 'intitle:"404 error"', correct: false, explanation: 'Это поиск страниц ошибок.' },
      { id: 'correct', query: 'filetype:env "DB_PASSWORD" OR "API_KEY"', correct: true, explanation: 'Найдены .env файлы с секретами!' },
      { id: 'wrong3', query: 'site:linkedin.com employees', correct: false, explanation: 'Это поиск сотрудников на LinkedIn.' }
    ]
  },
  {
    id: 'employee-emails',
    title: 'Найти email сотрудников',
    description: 'Собрать email-адреса сотрудников компании',
    options: [
      { id: 'wrong1', query: 'filetype:xls budget', correct: false, explanation: 'Это поиск Excel файлов.' },
      { id: 'wrong2', query: 'intitle:"server status"', correct: false, explanation: 'Это поиск страниц статуса сервера.' },
      { id: 'wrong3', query: 'inurl:contact us', correct: false, explanation: 'Это поиск контактных страниц.' },
      { id: 'correct', query: 'site:company.com "@company.com" email', correct: true, explanation: 'Найдены email-адреса сотрудников!' }
    ]
  }
];

function GoogleDorks({ onComplete }) {
  const [currentTask, setCurrentTask] = useState(0);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [completedTasks, setCompletedTasks] = useState([]);

  const task = tasks[currentTask];
  const progress = ((currentTask + (showResult ? 1 : 0)) / tasks.length) * 100;

  const handleSelect = (option) => {
    if (showResult) return;
    setSelectedQuery(option);
    setShowResult(true);
    if (option.correct) {
      setScore(score + 1);
      setCompletedTasks(prev => [...prev, task.id]);
    }
  };

  const handleNext = () => {
    if (currentTask < tasks.length - 1) {
      setCurrentTask(currentTask + 1);
      setSelectedQuery(null);
      setShowResult(false);
    } else {
      const finalScore = Math.round((score / tasks.length) * 30);
      onComplete({ score: finalScore, max: 30 });
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Google Dorks — Разведка</h2>
            <p className="text-gray-600 text-sm">Используйте специальные поисковые запросы для сбора информации</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Задача {currentTask + 1}/{tasks.length}</div>
            <div className="text-sm font-medium text-blue-600">Найдено: {score}</div>
          </div>
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

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Search Engine Interface */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Search Bar */}
          <div className="bg-gray-50 px-6 py-4 border-b">
            <div className="flex items-center gap-3">
              <div className="text-2xl font-bold">
                <span className="text-blue-500">G</span>
                <span className="text-red-500">o</span>
                <span className="text-yellow-500">o</span>
                <span className="text-blue-500">g</span>
                <span className="text-green-500">l</span>
                <span className="text-red-500">e</span>
              </div>
              <div className="flex-1 bg-white border border-gray-300 rounded-full px-4 py-2 text-sm text-gray-400">
                {task.title}...
              </div>
            </div>
          </div>

          {/* Task Description */}
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-2">{task.title}</h3>
            <p className="text-gray-600 mb-6">{task.description}</p>

            {/* Query Options */}
            <div className="space-y-3">
              {task.options.map((option, index) => (
                <motion.button
                  key={option.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleSelect(option)}
                  disabled={showResult}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all font-mono text-sm ${
                    showResult
                      ? option.correct
                        ? 'bg-green-50 border-green-500'
                        : selectedQuery?.id === option.id
                        ? 'bg-red-50 border-red-500'
                        : 'bg-gray-50 border-gray-200 text-gray-400'
                      : 'bg-white border-gray-200 hover:border-blue-500 hover:bg-blue-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                      showResult
                        ? option.correct
                          ? 'bg-green-500 border-green-500 text-white'
                          : selectedQuery?.id === option.id
                          ? 'bg-red-500 border-red-500 text-white'
                          : 'border-gray-300 text-gray-400'
                        : 'border-gray-300 text-gray-500'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </span>
                    <code className={option.correct && showResult ? 'text-green-700' : selectedQuery?.id === option.id && !option.correct ? 'text-red-700' : 'text-gray-700'}>
                      {option.query}
                    </code>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Result Explanation */}
            {showResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-6 p-4 rounded-lg border ${
                  selectedQuery.correct
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <p className={`text-sm font-medium mb-1 ${
                  selectedQuery.correct ? 'text-green-800' : 'text-red-800'
                }`}>
                  {selectedQuery.correct ? '✓ Найдено!' : '✗ Не то...'}
                </p>
                <p className="text-sm text-gray-700">{selectedQuery.explanation}</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      {showResult && (
        <div className="bg-white border-t px-6 py-4">
          <button
            onClick={handleNext}
            className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
          >
            {currentTask < tasks.length - 1 ? 'Следующая задача →' : 'Завершить разведку →'}
          </button>
        </div>
      )}
    </div>
  );
}

export default GoogleDorks;

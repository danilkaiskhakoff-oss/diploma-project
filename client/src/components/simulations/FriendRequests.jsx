import { useState } from 'react';
import { motion } from 'framer-motion';

const friendRequests = [
  {
    id: 1,
    name: 'Анна Петрова',
    avatar: '👩',
    mutualFriends: 15,
    photos: 42,
    accountAge: '3 года',
    lastActive: 'Сегодня',
    isReal: true,
    correctAction: 'accept',
    explanation: 'Реальный друг: много общих друзей, активный профиль, старые фото'
  },
  {
    id: 2,
    name: 'Crypto_Invest_Pro',
    avatar: '🤑',
    mutualFriends: 0,
    photos: 3,
    accountAge: '2 дня',
    lastActive: 'Вчера',
    isReal: false,
    correctAction: 'decline',
    explanation: 'Фейк: 0 общих друзей, новый аккаунт, подозрительное имя, стоковые фото'
  },
  {
    id: 3,
    name: 'Техподдержка VK',
    avatar: '🛡️',
    mutualFriends: 0,
    photos: 1,
    accountAge: '1 день',
    lastActive: 'Только что',
    isReal: false,
    correctAction: 'report',
    explanation: 'Мошенник: настоящая поддержка VK не добавляет в друзья и не просит данные'
  },
  {
    id: 4,
    name: 'Мария Иванова',
    avatar: '👱‍♀️',
    mutualFriends: 2,
    photos: 8,
    accountAge: '1 месяц',
    lastActive: '2 дня назад',
    isReal: false,
    correctAction: 'decline',
    explanation: 'Подозрительно: мало общих друзей, новые фото (возможно из интернета), аккаунт создан недавно'
  }
];

function FriendRequests({ decisions, onComplete }) {
  const [requests, setRequests] = useState(friendRequests.map(r => ({ ...r, decided: false, action: null })));
  const [showExplanation, setShowExplanation] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const decidedCount = requests.filter(r => r.decided).length;

  const handleAction = (requestId, action) => {
    const request = requests.find(r => r.id === requestId);
    if (request.decided) return;

    setRequests(prev => prev.map(r => {
      if (r.id === requestId) {
        return { ...r, decided: true, action };
      }
      return r;
    }));

    setShowExplanation(requestId);
    setTimeout(() => setShowExplanation(null), 4000);
  };

  const handleNext = () => {
    const result = {};
    requests.forEach(r => {
      result[r.id] = r.action === r.correctAction;
    });
    onComplete(result);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg p-6 shadow-sm mb-4">
        <h2 className="text-xl font-bold mb-2" style={{ color: '#4a76a8' }}>
          Заявки в друзья
        </h2>
        <p className="text-gray-600 text-sm mb-2">
          Проанализируйте профили и решите, кого добавить в друзья
        </p>
        <div className="text-sm text-gray-500">
          Решено: {decidedCount}/{requests.length}
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-3">
        {requests.map((request, index) => (
          <motion.div
            key={request.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-white rounded-lg p-4 shadow-sm ${
              request.decided ? 'border-l-4 border-green-500' : ''
            }`}
          >
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-3xl flex-shrink-0">
                {request.avatar}
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-800">{request.name}</h3>
                  {request.decided && (
                    <span className="text-green-500 text-xl">✓</span>
                  )}
                </div>

                <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-gray-600">
                  <div>Общие друзья: <span className="font-medium">{request.mutualFriends}</span></div>
                  <div>Фото: <span className="font-medium">{request.photos}</span></div>
                  <div>Аккаунт: <span className="font-medium">{request.accountAge}</span></div>
                  <div>Активность: <span className="font-medium">{request.lastActive}</span></div>
                </div>

                {/* Action Buttons */}
                {!request.decided && (
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => handleAction(request.id, 'accept')}
                      className="px-4 py-1.5 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition"
                    >
                      Принять
                    </button>
                    <button
                      onClick={() => handleAction(request.id, 'decline')}
                      className="px-4 py-1.5 bg-gray-500 text-white text-sm rounded-lg hover:bg-gray-600 transition"
                    >
                      Отклонить
                    </button>
                    <button
                      onClick={() => handleAction(request.id, 'report')}
                      className="px-4 py-1.5 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition"
                    >
                      Пожаловаться
                    </button>
                  </div>
                )}

                {/* Explanation */}
                {showExplanation === request.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className={`mt-3 p-3 rounded-lg text-sm ${
                      request.action === request.correctAction
                        ? 'bg-green-50 text-green-700'
                        : 'bg-red-50 text-red-700'
                    }`}
                  >
                    <p className="font-medium mb-1">
                      {request.action === request.correctAction ? '✓ Правильно!' : '✗ Неверно!'}
                    </p>
                    <p>{request.explanation}</p>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Next Button */}
      {decidedCount === requests.length && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          <button
            onClick={handleNext}
            className="w-full py-3 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition"
          >
            Продолжить →
          </button>
        </motion.div>
      )}
    </div>
  );
}

export default FriendRequests;
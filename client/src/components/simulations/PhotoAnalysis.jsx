import { useState } from 'react';
import { motion } from 'framer-motion';

const photos = [
  {
    id: 1,
    title: 'Фото с отпуска',
    description: 'Пляж, море, чемоданы...',
    emoji: '🏖️',
    leak: 'Бирка на чемодане с адресом',
    leakDetail: 'На бирке виден домашний адрес: ул. Ленина, д. 15, кв. 42',
    danger: 'Мошенники могут узнать ваш домашний адрес',
    hint: 'Посмотрите на чемоданы в углу фото'
  },
  {
    id: 2,
    title: 'Селфи на фоне дома',
    description: 'Новый дом, красивый вид...',
    emoji: '🏠',
    leak: 'Табличка с адресом на фоне',
    leakDetail: 'Видна табличка: "ул. Пушкина, д. 10"',
    danger: 'Точный адрес проживания раскрыт',
    hint: 'Обратите внимание на фон за человеком'
  },
  {
    id: 3,
    title: 'Фото пропуска на работу',
    description: 'Новый офис, получил пропуск!',
    emoji: '🪪',
    leak: 'Пропуск с ФИО и должностью',
    leakDetail: 'Виден пропуск: Иванов Иван Иванович, системный администратор, ООО "Техно"',
    danger: 'Рабочие данные для социальной инженерии',
    hint: 'Посмотрите на документ в руках'
  },
  {
    id: 4,
    title: 'Фото с новой картой',
    description: 'Получил новую банковскую карту!',
    emoji: '💳',
    leak: 'Данные банковской карты',
    leakDetail: 'Видны последние 4 цифры карты и срок действия: **** 4532, 12/25',
    danger: 'Частичные данные карты могут помочь мошенникам',
    hint: 'Посмотрите на карту в руках'
  }
];

function PhotoAnalysis({ findings, onComplete }) {
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [found, setFound] = useState({});
  const [showHint, setShowHint] = useState(false);
  const [showLeak, setShowLeak] = useState(false);

  const photo = photos[currentPhoto];
  const foundCount = Object.keys(found).length;

  const handleFindLeak = () => {
    if (found[photo.id]) return;
    setFound(prev => ({ ...prev, [photo.id]: true }));
    setShowLeak(true);
  };

  const handleNext = () => {
    if (currentPhoto < photos.length - 1) {
      setCurrentPhoto(currentPhoto + 1);
      setShowLeak(false);
      setShowHint(false);
    } else {
      onComplete(found);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg p-6 shadow-sm mb-4">
        <h2 className="text-xl font-bold mb-2" style={{ color: '#4a76a8' }}>
          Анализ фотографий
        </h2>
        <p className="text-gray-600 text-sm mb-2">
          Найдите утечки данных в фотографиях. Кликните на область, где видна личная информация.
        </p>
        <div className="text-sm text-gray-500">
          Найдено: {foundCount}/{photos.length}
        </div>
      </div>

      {/* Photo Album */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Photo Display */}
        <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 h-64 flex items-center justify-center">
          {/* Photo Content */}
          <div className="text-center">
            <div className="text-8xl mb-4">{photo.emoji}</div>
            <h3 className="text-lg font-medium text-gray-800">{photo.title}</h3>
            <p className="text-sm text-gray-600">{photo.description}</p>
          </div>

          {/* Click Zone to Find Leak */}
          {!found[photo.id] && (
            <button
              onClick={handleFindLeak}
              className="absolute inset-0 cursor-pointer group"
              title="Кликните, чтобы найти утечку"
            >
              <div className="absolute inset-0 bg-transparent group-hover:bg-red-500/10 transition" />
              <motion.div
                className="absolute top-4 right-4 px-3 py-1.5 bg-red-500 text-white text-sm rounded-lg"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                🔍 Найти утечку
              </motion.div>
            </button>
          )}

          {/* Found Indicator */}
          {found[photo.id] && (
            <div className="absolute top-4 right-4 px-3 py-1.5 bg-green-500 text-white text-sm rounded-lg">
              ✓ Найдено
            </div>
          )}
        </div>

        {/* Leak Details */}
        {showLeak && found[photo.id] && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 border-t"
          >
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-medium text-red-800 mb-2">⚠️ Утечка обнаружена!</h4>
              <p className="text-sm text-red-700 mb-2">
                <span className="font-medium">Что видно:</span> {photo.leakDetail}
              </p>
              <p className="text-sm text-red-600">
                <span className="font-medium">Опасность:</span> {photo.danger}
              </p>
            </div>
          </motion.div>
        )}

        {/* Hint */}
        <div className="p-4 border-t bg-gray-50 flex items-center justify-between">
          <button
            onClick={() => setShowHint(!showHint)}
            className="text-sm text-gray-600 hover:text-gray-800 transition"
          >
            💡 Нужна подсказка?
          </button>
          {showHint && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-blue-600"
            >
              {photo.hint}
            </motion.p>
          )}
        </div>

        {/* Next Button */}
        {found[photo.id] && (
          <div className="p-4 border-t bg-gray-50">
            <button
              onClick={handleNext}
              className="w-full py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition"
            >
              {currentPhoto < photos.length - 1 ? 'Следующее фото →' : 'Продолжить →'}
            </button>
          </div>
        )}
      </div>

      {/* Photo Thumbnails */}
      <div className="mt-4 flex gap-2">
        {photos.map((p, index) => (
          <button
            key={p.id}
            onClick={() => {
              if (found[p.id] || index <= currentPhoto) {
                setCurrentPhoto(index);
                setShowLeak(found[p.id] || false);
              }
            }}
            className={`flex-1 p-3 rounded-lg text-center transition ${
              index === currentPhoto
                ? 'bg-blue-500 text-white'
                : found[p.id]
                ? 'bg-green-100 text-green-800'
                : 'bg-white text-gray-600'
            }`}
          >
            <div className="text-2xl mb-1">{p.emoji}</div>
            <div className="text-xs truncate">{p.title}</div>
            {found[p.id] && <div className="text-xs mt-1">✓</div>}
          </button>
        ))}
      </div>

      {/* Progress */}
      <div className="mt-4 bg-white rounded-lg p-3 shadow-sm">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Прогресс</span>
          <span>{foundCount}/{photos.length}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="h-2 rounded-full bg-blue-500"
            initial={{ width: 0 }}
            animate={{ width: `${(foundCount / photos.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
    </div>
  );
}

export default PhotoAnalysis;
import { motion } from 'framer-motion';

function HintToggle({ onSubmit }) {
  return (
    <motion.div
      className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-xl w-full max-w-md"
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 30 }}
      >
        {/* Header */}
        <div
          className="p-4 rounded-t-xl"
          style={{
            background: 'linear-gradient(to right, #dbeafe 0%, #bfdbfe 100%)'
          }}
        >
          <h3 className="font-bold text-lg text-blue-800">Фишинг-симулятор</h3>
          <p className="text-sm text-blue-600 mt-1">
            Проверьте свои навыки распознавания фишинговых писем
          </p>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="mb-4">
            <div className="text-sm font-medium text-gray-700 mb-2">
              В вашем почтовом ящике 6 писем. Определите, какие из них являются фишинговыми.
            </div>

            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 mb-4">
              <div className="text-sm font-medium text-blue-700 mb-1"> Задание:</div>
              <ul className="text-xs text-blue-600 space-y-1">
                <li>• Откройте каждое письмо и изучите его содержимое</li>
                <li>• Обратите внимание на адрес отправителя, ссылки и текст</li>
                <li>• Решите: это фишинг или безопасное письмо?</li>
              </ul>
            </div>

            <div className="text-sm font-medium text-gray-700 mb-2">
              Включить подсказки?
            </div>
            <div className="text-xs text-gray-500 mb-4">
              Подсказки будут выделять подозрительные элементы в письмах и объяснять, почему они опасны.
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <motion.button
              className="flex-1 py-3 rounded-lg font-medium text-sm"
              style={{
                background: 'linear-gradient(to bottom, #60a5fa 0%, #3b82f6 100%)',
                color: '#fff',
                boxShadow: '0 2px 4px rgba(59,130,246,0.3)'
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSubmit(true)}
            >
              ✅ Да, включить подсказки
            </motion.button>
            <motion.button
              className="flex-1 py-3 rounded-lg font-medium text-sm"
              style={{
                background: 'linear-gradient(to bottom, #9ca3af 0%, #6b7280 100%)',
                color: '#fff',
                boxShadow: '0 2px 4px rgba(107,114,128,0.3)'
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSubmit(false)}
            >
              ❌ Нет, хочу сам найти
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default HintToggle;

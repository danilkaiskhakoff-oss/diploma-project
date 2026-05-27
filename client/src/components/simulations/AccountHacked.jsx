import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function AccountHacked({ scenario, onRetry, onContinue }) {
  const [showConsequences, setShowConsequences] = useState(false);

  return (
    <motion.div
      className="bg-[#1a1a2e] rounded-xl w-full max-w-2xl p-8 border border-gray-700"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
    >
      {/* Alert Header */}
      <div className="p-4 bg-red-900/30 border border-red-800 rounded-lg mb-6">
        <div className="flex items-center gap-3">
          <span className="text-3xl"></span>
          <div>
            <div className="text-red-400 font-bold text-lg">ВНИМАНИЕ: ВЗЛОМ АККАУНТА!</div>
            <div className="text-red-300 text-sm">Ваш аккаунт был скомпрометирован</div>
          </div>
        </div>
      </div>

      {/* Scenario Message */}
      <div className="mb-6">
        <p className="text-gray-300 leading-relaxed">{scenario.message}</p>
      </div>

      {/* Email Notification Simulation */}
      <div className="bg-white rounded-lg p-4 mb-6 border border-gray-300">
        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-200">
          <span className="text-lg">📧</span>
          <div>
            <div className="text-sm font-medium text-gray-800">security@your-email.com</div>
            <div className="text-xs text-gray-500">Уведомление о безопасности</div>
          </div>
        </div>
        <div className="text-sm text-gray-700">
          <p className="font-medium mb-2">Обнаружена подозрительная активность</p>
          <p className="mb-2">Здравствуйте!</p>
          <p className="mb-2">
            Мы обнаружили вход в ваш аккаунт с неизвестного устройства:
          </p>
          <div className="bg-gray-100 p-3 rounded mb-2">
            <div className="text-xs text-gray-600">📍 Москва, Россия</div>
            <div className="text-xs text-gray-600"> Windows PC, Chrome</div>
            <div className="text-xs text-gray-600">🕐 {new Date().toLocaleString('ru-RU')}</div>
          </div>
          <p className="text-red-600 font-medium">
            Если это были не вы, немедленно смените пароль!
          </p>
        </div>
      </div>

      {/* Consequences */}
      <motion.button
        className="w-full mb-6 p-4 bg-[#0a0a0f] rounded-lg border border-gray-700 text-left"
        onClick={() => setShowConsequences(!showConsequences)}
        whileHover={{ borderColor: '#3b82f6' }}
      >
        <div className="flex items-center justify-between">
          <span className="text-white font-medium">Последствия взлома</span>
          <span className="text-gray-400">{showConsequences ? '▲' : '▼'}</span>
        </div>
      </motion.button>

      <AnimatePresence>
        {showConsequences && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-6"
          >
            <div className="space-y-3">
              {scenario.consequences.map((consequence, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-3 p-3 bg-red-900/10 rounded-lg border border-red-900/20"
                >
                  <span className="text-red-400 mt-0.5">❌</span>
                  <span className="text-gray-300 text-sm">{consequence}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <motion.button
          className="flex-1 py-3 rounded-lg font-medium text-white"
          style={{ background: 'linear-gradient(to bottom, #ef4444 0%, #dc2626 100%)' }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onRetry}
        >
          Попробовать другой пароль
        </motion.button>
        <motion.button
          className="flex-1 py-3 rounded-lg font-medium text-white"
          style={{ background: 'linear-gradient(to bottom, #3b82f6 0%, #2563eb 100%)' }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onContinue}
        >
          Узнать о менеджерах паролей
        </motion.button>
      </div>
    </motion.div>
  );
}

export default AccountHacked;

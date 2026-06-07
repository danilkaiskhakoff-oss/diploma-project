import { motion, AnimatePresence } from 'framer-motion';

function WarningModal({ isOpen, onClose, onContinue, onRegister }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gray-900 rounded-2xl border border-yellow-800/50 w-full max-w-md shadow-2xl overflow-hidden"
          >
            <div className="p-6 pb-0 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-900/30 border border-yellow-700/50 flex items-center justify-center">
                <span className="text-3xl">⚠️</span>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Вы не зарегистрированы</h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                Ваши результаты сохраняются в текущем браузере. <span className="text-yellow-400 font-medium">Зарегистрируйтесь</span>, чтобы прогресс был доступен на всех устройствах.
              </p>
            </div>

            <div className="mx-6 mt-4 p-3 bg-yellow-900/20 border border-yellow-800/30 rounded-lg">
              <p className="text-yellow-300/80 text-xs">
                💡 При регистрации ваш текущий прогресс будет привязан к аккаунту автоматически.
              </p>
            </div>

            <div className="p-6 space-y-3">
              <button
                onClick={onRegister}
                className="w-full py-3 bg-[#00ff88] text-gray-900 font-bold rounded-lg hover:bg-[#00cc6a] transition"
              >
                Зарегистрироваться
              </button>
              <button
                onClick={onContinue}
                className="w-full py-3 bg-gray-800 text-gray-300 font-medium rounded-lg hover:bg-gray-700 hover:text-white transition border border-gray-700"
              >
                Продолжить без регистрации
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default WarningModal;

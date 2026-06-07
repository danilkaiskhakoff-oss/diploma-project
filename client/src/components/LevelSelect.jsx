import { motion } from 'framer-motion';
import { levels } from '../data/levels';
import CyberThreatMap from './CyberThreatMap';

function LevelSelect({ onSelectLevel, onOpenAuth, user }) {
  const isAnonymous = user?.type === 'anonymous';

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold text-white">
            <span className="text-[#00ff88]">Cyber</span>Security
          </span>
        </div>
        <div className="flex items-center gap-3">
          {isAnonymous ? (
            <>
              <span className="text-xs text-gray-500 hidden sm:inline">Гостевой режим</span>
              <button
                onClick={() => onOpenAuth('register')}
                className="px-4 py-2 text-sm bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/30 rounded-lg hover:bg-[#00ff88]/20 transition font-medium"
              >
                Регистрация
              </button>
              <button
                onClick={() => onOpenAuth('login')}
                className="px-4 py-2 text-sm bg-gray-800 text-gray-300 border border-gray-700 rounded-lg hover:bg-gray-700 hover:text-white transition"
              >
                Войти
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => window.history.pushState({}, '', '/profile')}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-800 text-gray-300 border border-gray-700 rounded-lg hover:bg-gray-700 hover:text-white transition"
              >
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#00ff88] to-blue-500 flex items-center justify-center text-[10px] font-bold text-gray-900">
                  {user?.displayName?.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline">{user?.displayName}</span>
              </button>
              <button
                onClick={() => window.history.pushState({}, '', '/profile')}
                className="px-4 py-2 text-sm bg-gray-800 text-gray-300 border border-gray-700 rounded-lg hover:bg-gray-700 hover:text-white transition"
              >
                Профиль
              </button>
            </>
          )}
        </div>
      </div>

      {/* 3D карта киберугроз на фоне */}
      <CyberThreatMap />

      {/* Контент поверх карты */}
      <div className="relative z-10 w-full max-w-5xl mt-16">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-2xl">
            <span className="text-[#00ff88]">Cyber</span>Security
          </h1>
          <p className="text-gray-200 text-lg drop-shadow-lg">Интерактивный обучающий ресурс</p>
          {isAnonymous && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-yellow-400/70 text-sm mt-3"
            >
              ⚠️ Вы не зарегистрированы — зарегистрируйтесь для сохранения прогресса на всех устройствах
            </motion.p>
          )}
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 w-full">
          {Object.values(levels).map((level, index) => (
            <motion.div
              key={level.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ scale: 1.05, y: -10 }}
              onClick={() => onSelectLevel(level)}
              className="bg-black/70 backdrop-blur-lg rounded-2xl p-8 border border-gray-600/50 cursor-pointer hover:border-[#00ff88] transition-colors group shadow-2xl"
            >
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold mb-6 mx-auto shadow-lg"
                style={{ backgroundColor: `${level.color}30`, color: level.color }}
              >
                {level.id === 'beginner' ? '🌱' : level.id === 'intermediate' ? '🔥' : '💀'}
              </div>
              <h2 className="text-4xl font-bold text-white text-center mb-2 drop-shadow-md">
                {level.id === 'beginner' ? 'Beginner' : level.id === 'intermediate' ? 'Intermediate' : 'Advanced'}
              </h2>
              <p className="text-gray-300 text-center text-base mb-4">{level.description}</p>
              <div className="text-center">
                <span className="text-xs text-gray-400">{level.checkpoints.length} тем</span>
              </div>
              <div
                className="mt-6 w-full py-3 rounded-lg text-center font-medium transition-all shadow-lg"
                style={{
                  border: `1px solid ${level.color}60`,
                  color: level.color,
                  backgroundColor: `${level.color}10`,
                }}
              >
                Начать →
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LevelSelect;

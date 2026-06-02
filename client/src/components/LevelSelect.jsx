import { motion } from 'framer-motion';
import { levels } from '../data/levels';
import CyberThreatMap from './CyberThreatMap';

function LevelSelect({ onSelectLevel }) {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* 3D карта киберугроз на фоне */}
      <CyberThreatMap />

      {/* Контент поверх карты */}
      <div className="relative z-10 w-full max-w-5xl">
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
              <h2 className="text-2xl font-bold text-white text-center mb-2 drop-shadow-md">{level.name}</h2>
              <p className="text-gray-300 text-center text-sm mb-4">{level.description}</p>
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

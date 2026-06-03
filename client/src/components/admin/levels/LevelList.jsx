import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase/config';

function LevelList({ onSelectLevel }) {
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLevels();
  }, []);

  const loadLevels = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'levels'));
      const levelsData = [];
      querySnapshot.forEach((doc) => {
        levelsData.push({ id: doc.id, ...doc.data() });
      });
      setLevels(levelsData);
    } catch (error) {
      console.error('Error loading levels:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-400">Загрузка уровней...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-white mb-8">Уровни</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {levels.map((level) => (
          <motion.div
            key={level.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectLevel(level.id)}
            className="bg-gray-900 rounded-xl p-6 border border-gray-800 cursor-pointer hover:border-blue-600/50 transition"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">{level.name}</h3>
              <span className="bg-blue-600/20 text-blue-400 text-xs px-3 py-1 rounded-full">
                {level.checkpoints?.length || 0} чекпоинтов
              </span>
            </div>
            <p className="text-gray-400 text-sm mb-4">{level.description || 'Нет описания'}</p>
            <div className="flex items-center gap-2 text-gray-500 text-xs">
              <span>ID: {level.id}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default LevelList;

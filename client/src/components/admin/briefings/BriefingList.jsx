import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase/config';

function BriefingList({ onSelectBriefing }) {
  const [briefings, setBriefings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBriefings();
  }, []);

  const loadBriefings = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'briefings'));
      const briefingsData = [];
      querySnapshot.forEach((doc) => {
        briefingsData.push({ id: doc.id, ...doc.data() });
      });
      setBriefings(briefingsData);
    } catch (error) {
      console.error('Error loading briefings:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-400">Загрузка брифингов...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-white mb-8">Брифинги</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {briefings.map((briefing) => (
          <motion.div
            key={briefing.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectBriefing(briefing.id)}
            className="bg-gray-900 rounded-xl p-6 border border-gray-800 cursor-pointer hover:border-blue-600/50 transition"
            style={{ borderLeft: `4px solid ${briefing.color || '#3b82f6'}` }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{briefing.icon || '📄'}</span>
                <h3 className="text-lg font-bold text-white">{briefing.title}</h3>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-4">{briefing.subtitle || 'Нет описания'}</p>
            <div className="flex items-center gap-2 text-gray-500 text-xs">
              <span>ID: {briefing.id}</span>
              <span>•</span>
              <span>{briefing.concepts?.length || 0} концептов</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default BriefingList;

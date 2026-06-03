import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase/config';

function QuizList({ onSelectQuiz }) {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'quizzes'));
      const quizzesData = [];
      querySnapshot.forEach((doc) => {
        quizzesData.push({ id: doc.id, ...doc.data() });
      });
      setQuizzes(quizzesData);
    } catch (error) {
      console.error('Error loading quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-400">Загрузка квизов...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-white mb-8">Квизы</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz) => (
          <motion.div
            key={quiz.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectQuiz(quiz.id)}
            className="bg-gray-900 rounded-xl p-6 border border-gray-800 cursor-pointer hover:border-blue-600/50 transition"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">{quiz.title}</h3>
              <span className="bg-blue-600/20 text-blue-400 text-xs px-3 py-1 rounded-full">
                {quiz.questions?.length || 0} вопросов
              </span>
            </div>
            <p className="text-gray-400 text-sm mb-4">{quiz.description || 'Нет описания'}</p>
            <div className="flex items-center gap-2 text-gray-500 text-xs">
              <span>ID: {quiz.id}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default QuizList;

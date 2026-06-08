import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase/config';

function QuizEditor({ quizId, onBack }) {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadQuiz();
  }, [quizId]);

  const loadQuiz = async () => {
    try {
      const docSnap = await getDoc(doc(db, 'quizzes', quizId));
      if (docSnap.exists()) {
        setQuiz(docSnap.data());
      }
    } catch (error) {
      console.error('Error loading quiz:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    // Validate
    for (let i = 0; i < (quiz.questions || []).length; i++) {
      const q = quiz.questions[i];
      if (!q.question.trim()) { alert(`Вопрос ${i+1}: текст не может быть пустым`); return; }
      if (q.correctIndex < 0 || q.correctIndex >= q.options.length) { alert(`Вопрос ${i+1}: неверный correctIndex`); return; }
      if (q.options.some(o => !o.trim())) { alert(`Вопрос ${i+1}: варианты ответов не могут быть пустыми`); return; }
    }
    setSaving(true);
    setSaved(false);
    try {
      await updateDoc(doc(db, 'quizzes', quizId), quiz);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Error saving quiz:', error);
    } finally {
      setSaving(false);
    }
  };

  const updateQuestion = (index, field, value) => {
    const newQuestions = [...quiz.questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setQuiz({ ...quiz, questions: newQuestions });
  };

  const updateOption = (questionIndex, optionIndex, value) => {
    const newQuestions = [...quiz.questions];
    const newOptions = [...newQuestions[questionIndex].options];
    newOptions[optionIndex] = value;
    newQuestions[questionIndex] = { ...newQuestions[questionIndex], options: newOptions };
    setQuiz({ ...quiz, questions: newQuestions });
  };

  const addQuestion = () => {
    const newQuestion = {
      question: '',
      options: ['', '', '', ''],
      correctIndex: 0,
      explanation: ''
    };
    setQuiz({ ...quiz, questions: [...quiz.questions, newQuestion] });
  };

  const removeQuestion = (index) => {
    const newQuestions = quiz.questions.filter((_, i) => i !== index);
    setQuiz({ ...quiz, questions: newQuestions });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-400">Загрузка квиза...</div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-400">Квиз не найден</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition"
          >
            ← Назад
          </button>
          <div>
            <h2 className="text-3xl font-bold text-white">{quiz.title}</h2>
            <p className="text-gray-400 text-sm">{quiz.questions?.length || 0} вопросов</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {saved && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-green-400 text-sm"
            >
              ✓ Сохранено!
            </motion.span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition disabled:opacity-50"
          >
            {saving ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-6">
        {quiz.questions.map((q, qIndex) => (
          <motion.div
            key={qIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900 rounded-xl p-6 border border-gray-800"
          >
            {/* Question Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">
                Вопрос {qIndex + 1}
              </h3>
              <button
                onClick={() => removeQuestion(qIndex)}
                className="px-3 py-1 bg-red-900/30 text-red-400 rounded-lg hover:bg-red-900/50 transition text-sm"
              >
                Удалить
              </button>
            </div>

            {/* Question Text */}
            <div className="mb-4">
              <label className="block text-gray-400 text-sm mb-2">Текст вопроса</label>
              <input
                type="text"
                value={q.question}
                onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
                placeholder="Введите вопрос..."
              />
            </div>

            {/* Options */}
            <div className="mb-4">
              <label className="block text-gray-400 text-sm mb-2">Варианты ответов</label>
              <div className="space-y-2">
                {q.options.map((opt, optIndex) => (
                  <div key={optIndex} className="flex items-center gap-3">
                    <span className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold ${
                      q.correctIndex === optIndex
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-800 text-gray-400'
                    }`}>
                      {String.fromCharCode(65 + optIndex)}
                    </span>
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => updateOption(qIndex, optIndex, e.target.value)}
                      className="flex-1 p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
                      placeholder={`Вариант ${String.fromCharCode(65 + optIndex)}`}
                    />
                    <button
                      onClick={() => updateQuestion(qIndex, 'correctIndex', optIndex)}
                      className={`px-3 py-2 rounded-lg text-sm transition ${
                        q.correctIndex === optIndex
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                      }`}
                    >
                      {q.correctIndex === optIndex ? '✓ Правильный' : 'Сделать правильным'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Explanation */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">Объяснение</label>
              <textarea
                value={q.explanation}
                onChange={(e) => updateQuestion(qIndex, 'explanation', e.target.value)}
                className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none h-24 resize-none"
                placeholder="Объяснение правильного ответа..."
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Question Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={addQuestion}
        className="w-full mt-6 py-4 bg-gray-800 text-gray-300 rounded-xl border border-gray-700 hover:border-blue-600/50 hover:text-white transition"
      >
        + Добавить вопрос
      </motion.button>
    </div>
  );
}

export default QuizEditor;

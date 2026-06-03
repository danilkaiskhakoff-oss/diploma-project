import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase/config';

function LevelEditor({ levelId, onBack }) {
  const [level, setLevel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeCheckpoint, setActiveCheckpoint] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    loadLevel();
  }, [levelId]);

  const loadLevel = async () => {
    try {
      const docRef = doc(db, 'levels', levelId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = { id: docSnap.id, ...docSnap.data() };
        setLevel(data);
        setFormData(data);
      }
    } catch (error) {
      console.error('Error loading level:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const docRef = doc(db, 'levels', levelId);
      await updateDoc(docRef, formData);
      setLevel(formData);
      setEditMode(false);
    } catch (error) {
      console.error('Error saving level:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCheckpointChange = (index, field, value) => {
    const updatedCheckpoints = [...(formData.checkpoints || [])];
    if (!updatedCheckpoints[index]) updatedCheckpoints[index] = {};
    updatedCheckpoints[index][field] = value;
    setFormData({ ...formData, checkpoints: updatedCheckpoints });
  };

  const handleQuizQuestionChange = (checkpointIndex, questionIndex, field, value) => {
    const updatedCheckpoints = [...(formData.checkpoints || [])];
    const quiz = [...(updatedCheckpoints[checkpointIndex]?.quiz || [])];
    if (!quiz[questionIndex]) quiz[questionIndex] = {};
    quiz[questionIndex][field] = value;
    updatedCheckpoints[checkpointIndex].quiz = quiz;
    setFormData({ ...formData, checkpoints: updatedCheckpoints });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-400">Загрузка уровня...</div>
      </div>
    );
  }

  if (!level) {
    return (
      <div className="p-8">
        <h2 className="text-3xl font-bold text-white mb-4">Уровень не найден</h2>
        <button onClick={onBack} className="text-blue-400 hover:text-blue-300">
          ← Назад к уровням
        </button>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <button onClick={onBack} className="text-gray-400 hover:text-white mb-2 block">
            ← Назад к уровням
          </button>
          <h2 className="text-3xl font-bold text-white">{level.name}</h2>
          <p className="text-gray-400 mt-1">{level.description}</p>
        </div>
        <div className="flex gap-3">
          {editMode ? (
            <>
              <button
                onClick={() => setEditMode(false)}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
              >
                Отмена
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {saving ? 'Сохранение...' : 'Сохранить'}
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Редактировать
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {(level.checkpoints || []).map((checkpoint, index) => (
          <motion.div
            key={checkpoint.id || index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden"
          >
            <button
              onClick={() => setActiveCheckpoint(activeCheckpoint === index ? null : index)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-800/50 transition"
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl">{checkpoint.type === 'simulation' ? '🎮' : '📖'}</span>
                <div className="text-left">
                  <h3 className="text-lg font-bold text-white">{checkpoint.title}</h3>
                  <p className="text-gray-500 text-sm">{checkpoint.type}</p>
                </div>
              </div>
              <span className="text-gray-400">
                {activeCheckpoint === index ? '▲' : '▼'}
              </span>
            </button>

            {activeCheckpoint === index && (
              <div className="px-6 py-4 border-t border-gray-800 space-y-6">
                {editMode ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Название</label>
                    <input
                      type="text"
                      value={formData.checkpoints?.[index]?.title || ''}
                      onChange={(e) => handleCheckpointChange(index, 'title', e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                    />
                  </div>
                ) : (
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Название</h4>
                    <p className="text-white">{checkpoint.title}</p>
                  </div>
                )}

                {checkpoint.theory && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Теория</h4>
                    {editMode ? (
                      <textarea
                        value={formData.checkpoints?.[index]?.theory?.content || ''}
                        onChange={(e) =>
                          handleCheckpointChange(index, 'theory', {
                            ...checkpoint.theory,
                            content: e.target.value,
                          })
                        }
                        rows={6}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                      />
                    ) : (
                      <p className="text-gray-300 whitespace-pre-wrap text-sm">{checkpoint.theory.content}</p>
                    )}
                  </div>
                )}

                {checkpoint.quiz && checkpoint.quiz.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-3">
                      Квиз ({checkpoint.quiz.length} вопросов)
                    </h4>
                    <div className="space-y-4">
                      {checkpoint.quiz.map((q, qIndex) => (
                        <div key={qIndex} className="bg-gray-800 rounded-lg p-4">
                          {editMode ? (
                            <div className="space-y-3">
                              <input
                                type="text"
                                value={
                                  formData.checkpoints?.[index]?.quiz?.[qIndex]?.question || ''
                                }
                                onChange={(e) =>
                                  handleQuizQuestionChange(index, qIndex, 'question', e.target.value)
                                }
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
                                placeholder="Вопрос"
                              />
                              {q.options?.map((opt, optIndex) => (
                                <input
                                  key={optIndex}
                                  type="text"
                                  value={
                                    formData.checkpoints?.[index]?.quiz?.[qIndex]?.options?.[optIndex] || ''
                                  }
                                  onChange={(e) => {
                                    const newOptions = [...(formData.checkpoints?.[index]?.quiz?.[qIndex]?.options || [])];
                                    newOptions[optIndex] = e.target.value;
                                    handleQuizQuestionChange(index, qIndex, 'options', newOptions);
                                  }}
                                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
                                  placeholder={`Вариант ${optIndex + 1}`}
                                />
                              ))}
                              <div className="flex items-center gap-2">
                                <span className="text-gray-400 text-sm">Правильный:</span>
                                <select
                                  value={
                                    formData.checkpoints?.[index]?.quiz?.[qIndex]?.correctIndex ?? 0
                                  }
                                  onChange={(e) =>
                                    handleQuizQuestionChange(
                                      index,
                                      qIndex,
                                      'correctIndex',
                                      parseInt(e.target.value)
                                    )
                                  }
                                  className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
                                >
                                  {q.options?.map((_, i) => (
                                    <option key={i} value={i}>
                                      Вариант {i + 1}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <p className="text-white font-medium mb-2">{q.question}</p>
                              <div className="space-y-1 ml-4">
                                {q.options?.map((opt, optIndex) => (
                                  <p
                                    key={optIndex}
                                    className={`text-sm ${
                                      optIndex === q.correctIndex
                                        ? 'text-green-400'
                                        : 'text-gray-400'
                                    }`}
                                  >
                                    {optIndex === q.correctIndex ? '✓ ' : '○ '}
                                    {opt}
                                  </p>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default LevelEditor;

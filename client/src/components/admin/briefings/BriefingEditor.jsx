import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase/config';

function BriefingEditor({ briefingId, onBack }) {
  const [briefing, setBriefing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState(null);

  useEffect(() => {
    loadBriefing();
  }, [briefingId]);

  const loadBriefing = async () => {
    try {
      const docSnap = await getDoc(doc(db, 'briefings', briefingId));
      if (docSnap.exists()) {
        setBriefing(docSnap.data());
      }
    } catch (error) {
      console.error('Error loading briefing:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!briefing.title?.trim()) { alert('Название не может быть пустым'); return; }
    if (!briefing.scenario?.role?.trim()) { alert('Роль не может быть пустой'); return; }
    if (!briefing.scenario?.company?.trim()) { alert('Компания не может быть пустой'); return; }
    if (!briefing.scenario?.situation?.trim()) { alert('Ситуация не может быть пустой'); return; }
    if (!briefing.scenario?.goal?.trim()) { alert('Цель не может быть пустой'); return; }

    setSaving(true);
    setSaved(false);
    try {
      const docRef = doc(db, 'briefings', briefingId);
      await updateDoc(docRef, briefing);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Error saving briefing:', error);
      alert('Ошибка сохранения: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleScenarioChange = (field, value) => {
    setBriefing(prev => ({
      ...prev,
      scenario: { ...prev.scenario, [field]: value },
    }));
  };

  const handleConceptChange = (index, field, value) => {
    setBriefing(prev => {
      const updatedConcepts = [...(prev.concepts || [])];
      updatedConcepts[index] = { ...(updatedConcepts[index] || {}), [field]: value };
      return { ...prev, concepts: updatedConcepts };
    });
  };

  const handleStageChange = (index, field, value) => {
    setBriefing(prev => {
      const updatedStages = [...(prev.stages || [])];
      updatedStages[index] = { ...(updatedStages[index] || {}), [field]: value };
      return { ...prev, stages: updatedStages };
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-400">Загрузка брифинга...</div>
      </div>
    );
  }

  if (!briefing) {
    return (
      <div className="p-8">
        <h2 className="text-3xl font-bold text-white mb-4">Брифинг не найден</h2>
        <button onClick={onBack} className="text-blue-400 hover:text-blue-300">
          ← Назад к брифингам
        </button>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition"
          >
            ← Назад
          </button>
          <div>
            <h2 className="text-3xl font-bold text-white">{briefing.title}</h2>
            <p className="text-gray-400 text-sm">{briefing.subtitle}</p>
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

      <div className="space-y-4">
        {/* Сценарий */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden"
        >
          <button
            onClick={() => setActiveSection(activeSection === 'scenario' ? null : 'scenario')}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-800/50 transition"
          >
            <h3 className="text-lg font-bold text-white">Сценарий</h3>
            <span className="text-gray-400">{activeSection === 'scenario' ? '▲' : '▼'}</span>
          </button>

          {activeSection === 'scenario' && (
            <div className="px-6 py-4 border-t border-gray-800 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Роль</label>
                <input
                  type="text"
                  value={briefing.scenario?.role || ''}
                  onChange={(e) => handleScenarioChange('role', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Компания</label>
                <input
                  type="text"
                  value={briefing.scenario?.company || ''}
                  onChange={(e) => handleScenarioChange('company', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Ситуация</label>
                <textarea
                  value={briefing.scenario?.situation || ''}
                  onChange={(e) => handleScenarioChange('situation', e.target.value)}
                  rows={3}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Цель</label>
                <textarea
                  value={briefing.scenario?.goal || ''}
                  onChange={(e) => handleScenarioChange('goal', e.target.value)}
                  rows={2}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                />
              </div>
            </div>
          )}
        </motion.div>

        {/* Концепты */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden"
        >
          <button
            onClick={() => setActiveSection(activeSection === 'concepts' ? null : 'concepts')}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-800/50 transition"
          >
            <h3 className="text-lg font-bold text-white">
              Концепты ({briefing.concepts?.length || 0})
            </h3>
            <span className="text-gray-400">{activeSection === 'concepts' ? '▲' : '▼'}</span>
          </button>

          {activeSection === 'concepts' && (
            <div className="px-6 py-4 border-t border-gray-800 space-y-4">
              {(briefing.concepts || []).map((concept, index) => (
                <div key={index} className="bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xl">{concept.icon || '📌'}</span>
                    <input
                      type="text"
                      value={briefing.concepts?.[index]?.term || ''}
                      onChange={(e) => handleConceptChange(index, 'term', e.target.value)}
                      className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
                      placeholder="Термин"
                    />
                  </div>
                  <div className="space-y-2 ml-8">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Определение</label>
                      <textarea
                        value={briefing.concepts?.[index]?.definition || ''}
                        onChange={(e) => handleConceptChange(index, 'definition', e.target.value)}
                        rows={2}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Пример</label>
                      <textarea
                        value={briefing.concepts?.[index]?.example || ''}
                        onChange={(e) => handleConceptChange(index, 'example', e.target.value)}
                        rows={2}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Этапы */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden"
        >
          <button
            onClick={() => setActiveSection(activeSection === 'stages' ? null : 'stages')}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-800/50 transition"
          >
            <h3 className="text-lg font-bold text-white">
              Этапы ({briefing.stages?.length || 0})
            </h3>
            <span className="text-gray-400">{activeSection === 'stages' ? '▲' : '▼'}</span>
          </button>

          {activeSection === 'stages' && (
            <div className="px-6 py-4 border-t border-gray-800 space-y-3">
              {(briefing.stages || []).map((stage, index) => (
                <div key={index} className="bg-gray-800 rounded-lg p-3 flex items-center gap-4">
                  <span className="text-xl">{stage.icon || ''}</span>
                  <div className="flex gap-2 flex-1">
                    <input
                      type="text"
                      value={briefing.stages?.[index]?.name || ''}
                      onChange={(e) => handleStageChange(index, 'name', e.target.value)}
                      className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-1 text-white text-sm"
                      placeholder="Название"
                    />
                    <input
                      type="text"
                      value={briefing.stages?.[index]?.desc || ''}
                      onChange={(e) => handleStageChange(index, 'desc', e.target.value)}
                      className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-1 text-white text-sm"
                      placeholder="Описание"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default BriefingEditor;

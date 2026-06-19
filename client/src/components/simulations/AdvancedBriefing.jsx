import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getBriefing } from '../../services/DataService';

function AdvancedBriefing({ simulationType, onComplete }) {
  const [briefing, setBriefing] = useState(null);
  const [loading, setLoading] = useState(true);
  const audioContextRef = useRef(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [expandedConcept, setExpandedConcept] = useState(null);
  const [hasViewed, setHasViewed] = useState(false);

  const totalSections = 4;

  useEffect(() => {
    loadBriefing();
  }, [simulationType]);

  useEffect(() => {
    try {
      const viewed = localStorage.getItem(`briefing_${simulationType}`);
      if (viewed) {
        setHasViewed(true);
      }
    } catch (e) {
      // localStorage not available
    }
  }, [simulationType]);

  const loadBriefing = async () => {
    try {
      const data = await getBriefing(simulationType);
      setBriefing(data);
    } catch (e) {
      console.error('Failed to load briefing:', e);
    } finally {
      setLoading(false);
    }
  };

  const playSound = useCallback((type = 'click') => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'click') {
        osc.frequency.value = 800;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.1);
      } else if (type === 'success') {
        osc.frequency.value = 600;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.3);
      } else if (type === 'expand') {
        osc.frequency.value = 1200;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.15);
      }
    } catch (e) {
      // Ignore audio errors
    }
  }, []);

  if (loading) {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-spin">⏳</div>
          <p className="text-gray-400">Загрузка брифинга...</p>
        </div>
      </div>
    );
  }

  if (!briefing) {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-xl text-white mb-2">Ошибка загрузки</h2>
          <p className="text-gray-400">Не удалось загрузить брифинг</p>
          <button
            onClick={onComplete}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Пропустить
          </button>
        </div>
      </div>
    );
  }

  const handleNext = () => {
    playSound('click');
    if (currentSection < totalSections - 1) {
      setCurrentSection(currentSection + 1);
    } else {
      try {
        localStorage.setItem(`briefing_${simulationType}`, 'true');
      } catch (e) {
        // localStorage not available
      }
      playSound('success');
      onComplete();
    }
  };

  const handleSkip = () => {
    playSound('click');
    try {
      localStorage.setItem(`briefing_${simulationType}`, 'true');
    } catch (e) {
      // localStorage not available
    }
    onComplete();
  };

  const handleConceptClick = (index) => {
    playSound('expand');
    setExpandedConcept(expandedConcept === index ? null : index);
  };

  const sections = [
    <motion.div
      key="intro"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center h-full text-center"
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="text-8xl mb-6"
      >
        {briefing.icon}
      </motion.div>
      <motion.h1
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-4xl font-bold text-white mb-3"
        style={{ textShadow: `0 0 30px ${briefing.color}40` }}
      >
        {briefing.title}
      </motion.h1>
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-xl text-gray-300 mb-8"
      >
        {briefing.subtitle}
      </motion.p>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="flex items-center gap-2 text-sm text-gray-400"
      >
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <span>Интерактивный брифинг</span>
      </motion.div>
    </motion.div>,

    <motion.div
      key="scenario"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col h-full p-8"
    >
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
        <span className="text-3xl"></span>
        Сценарий
      </h2>
      
      <div className="flex-1 space-y-6">
        <motion.div
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 rounded-xl p-5 border border-white/10"
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">👤</span>
            <div>
              <div className="text-sm text-gray-400">Ваша роль</div>
              <div className="text-lg font-semibold text-white">{briefing.scenario.role}</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white/5 rounded-xl p-5 border border-white/10"
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">🏢</span>
            <div>
              <div className="text-sm text-gray-400">Компания</div>
              <div className="text-lg font-semibold text-white">{briefing.scenario.company}</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-red-500/10 rounded-xl p-5 border border-red-500/30"
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">️</span>
            <div>
              <div className="text-sm text-red-300">Ситуация</div>
              <div className="text-base text-white mt-1">{briefing.scenario.situation}</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="bg-green-500/10 rounded-xl p-5 border border-green-500/30"
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">🎯</span>
            <div>
              <div className="text-sm text-green-300">Ваша задача</div>
              <div className="text-base text-white mt-1">{briefing.scenario.goal}</div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>,

    <motion.div
      key="concepts"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col h-full p-8"
    >
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
        <span className="text-3xl">📚</span>
        Ключевые концепции
      </h2>
      <p className="text-gray-400 mb-4 text-sm">Нажмите на карточку, чтобы узнать больше</p>
      
      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        {briefing.concepts.map((concept, index) => (
          <motion.div
            key={index}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`rounded-xl border transition-all cursor-pointer ${
              expandedConcept === index
                ? 'bg-white/10 border-white/30'
                : 'bg-white/5 border-white/10 hover:bg-white/10'
            }`}
            onClick={() => handleConceptClick(index)}
          >
            <div className="p-4 flex items-center gap-4">
              <span className="text-2xl">{concept.icon}</span>
              <div className="flex-1">
                <div className="font-semibold text-white">{concept.term}</div>
                {expandedConcept !== index && (
                  <div className="text-sm text-gray-400 mt-1 line-clamp-1">{concept.definition}</div>
                )}
              </div>
              <motion.span
                animate={{ rotate: expandedConcept === index ? 180 : 0 }}
                className="text-gray-400"
              >
                ▼
              </motion.span>
            </div>
            
            <AnimatePresence>
              {expandedConcept === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 pt-0">
                    <div className="text-sm text-gray-300 mb-3">{concept.definition}</div>
                    <div className="bg-white/5 rounded-lg p-3 border-l-2" style={{ borderColor: briefing.color }}>
                      <div className="text-xs text-gray-400 mb-1">💡 Пример:</div>
                      <div className="text-sm text-white">{concept.example}</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </motion.div>,

    <motion.div
      key="structure"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col h-full p-8"
    >
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
        <span className="text-3xl">🗺️</span>
        Структура симуляции
      </h2>
      
      <div className="flex-1 flex flex-col justify-center space-y-4">
        {briefing.stages.map((stage, index) => (
          <motion.div
            key={index}
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.15 }}
            className="flex items-center gap-4"
          >
            <div className="flex flex-col items-center">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                style={{
                  background: `linear-gradient(135deg, ${briefing.color}40 0%, ${briefing.color}20 100%)`,
                  border: `1px solid ${briefing.color}60`
                }}
              >
                {stage.icon}
              </div>
              {index < briefing.stages.length - 1 && (
                <div className="w-0.5 h-8 bg-white/10 mt-2" />
              )}
            </div>
            <div className="flex-1">
              <div className="text-white font-semibold">{stage.name}</div>
              <div className="text-sm text-gray-400">{stage.desc}</div>
            </div>
            <div className="text-sm text-gray-500 font-mono">
              {String(index + 1).padStart(2, '0')}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10 text-center"
      >
        <div className="text-sm text-gray-400">
          Готовы начать? Нажмите <span className="text-white font-semibold">"Начать симуляцию"</span> внизу
        </div>
      </motion.div>
    </motion.div>
  ];

  return (
    <div className="absolute inset-0 z-50 flex flex-col" style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)'
    }}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{briefing.icon}</span>
          <span className="text-white font-semibold">{briefing.title}</span>
        </div>
        <div className="flex items-center gap-4">
          {/* Progress dots */}
          <div className="flex gap-2">
            {Array.from({ length: totalSections }).map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all ${
                  i <= currentSection ? 'bg-white' : 'bg-white/20'
                }`}
              />
            ))}
          </div>
          {/* Skip button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSkip}
            className="px-4 py-2 text-sm text-gray-400 hover:text-white transition rounded-lg hover:bg-white/10"
          >
            {hasViewed ? 'Пропустить' : 'Пропустить брифинг'}
          </motion.button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {sections[currentSection]}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between">
        <div className="text-sm text-gray-400">
          {currentSection + 1} / {totalSections}
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleNext}
          className="px-8 py-3 rounded-xl font-semibold text-white transition-all"
          style={{
            background: `linear-gradient(135deg, ${briefing.color} 0%, ${briefing.color}dd 100%)`,
            boxShadow: `0 4px 20px ${briefing.color}40`
          }}
        >
          {currentSection < totalSections - 1 ? 'Далее →' : 'Начать симуляцию →'}
        </motion.button>
      </div>
    </div>
  );
}

export default AdvancedBriefing;

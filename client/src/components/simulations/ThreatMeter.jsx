import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

function ThreatMeter() {
  const [threatLevel, setThreatLevel] = useState(100);
  const [showInfo, setShowInfo] = useState(false);

  // Simulate threat level changes based on user actions
  // This would be updated by the MailApp component in a real implementation
  useEffect(() => {
    const handleThreatUpdate = (event) => {
      setThreatLevel(prev => {
        const newLevel = event.detail.correct ? Math.min(100, prev + 5) : Math.max(0, prev - 15);
        return newLevel;
      });
    };

    window.addEventListener('threatUpdate', handleThreatUpdate);
    return () => window.removeEventListener('threatUpdate', handleThreatUpdate);
  }, []);

  const getThreatColor = () => {
    if (threatLevel >= 80) return '#22c55e';
    if (threatLevel >= 50) return '#eab308';
    return '#ef4444';
  };

  const getThreatLabel = () => {
    if (threatLevel >= 80) return 'Безопасно';
    if (threatLevel >= 50) return 'Внимание';
    return 'Опасно';
  };

  return (
    <div className="absolute top-4 right-4 z-30">
      <motion.div
        className="relative"
        onMouseEnter={() => setShowInfo(true)}
        onMouseLeave={() => setShowInfo(false)}
      >
        {/* Threat Meter Display */}
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg backdrop-blur-sm"
          style={{
            background: 'rgba(20,30,50,0.8)',
            border: '1px solid rgba(100,160,220,0.3)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
          }}
        >
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getThreatColor() }} />
            <span className="text-white text-xs font-medium">{getThreatLabel()}</span>
          </div>
          <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: getThreatColor() }}
              initial={{ width: '100%' }}
              animate={{ width: `${threatLevel}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <span className="text-white/70 text-xs">{threatLevel}%</span>
        </div>

        {/* Info Tooltip */}
        {showInfo && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-full right-0 mt-2 w-48 p-3 rounded-lg backdrop-blur-sm text-xs"
            style={{
              background: 'rgba(20,30,50,0.95)',
              border: '1px solid rgba(100,160,220,0.3)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.4)'
            }}
          >
            <div className="text-white/90 font-medium mb-1">Уровень защищённости</div>
            <div className="text-white/60 mb-2">
              Показывает, насколько хорошо вы распознаёте фишинговые письма.
            </div>
            <div className="space-y-1 text-white/50">
              <div>• Правильный ответ: +5%</div>
              <div>• Неправильный ответ: -15%</div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default ThreatMeter;

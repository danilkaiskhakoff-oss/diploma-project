import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const alerts = [
  {
    id: 1,
    timestamp: '14:23:15',
    source: 'EDR — File Server',
    severity: 'critical',
    title: 'Ransomware Behavior Detected',
    description: 'Обнаружено массовое шифрование файлов на FS-01. Процесс: cryptor.exe',
    isTruePositive: true,
    correctPriority: 'critical'
  },
  {
    id: 2,
    timestamp: '14:24:02',
    source: 'Firewall — External',
    severity: 'high',
    title: 'Anomalous Outbound Traffic',
    description: 'Аномальный исходящий трафик 2.3 GB на внешний IP 185.234.72.15',
    isTruePositive: true,
    correctPriority: 'high'
  },
  {
    id: 3,
    timestamp: '14:25:30',
    source: 'Active Directory',
    severity: 'medium',
    title: 'Multiple Failed Login Attempts',
    description: '15 failed login attempts для пользователя jdoe за 5 минут',
    isTruePositive: true,
    correctPriority: 'medium'
  },
  {
    id: 4,
    timestamp: '14:26:45',
    source: 'EDR — Workstation',
    severity: 'high',
    title: 'Suspicious PowerShell Execution',
    description: 'PowerShell с флагом -enc выполнил загрузку с внешнего URL',
    isTruePositive: true,
    correctPriority: 'high'
  },
  {
    id: 5,
    timestamp: '14:27:10',
    source: 'Antivirus',
    severity: 'low',
    title: 'Antivirus Update Failed',
    description: 'Не удалось обновить сигнатуры AV на WS-042. Причина: network timeout',
    isTruePositive: false,
    correctPriority: 'low'
  },
  {
    id: 6,
    timestamp: '14:28:00',
    source: 'Backup System',
    severity: 'low',
    title: 'Scheduled Backup Completed',
    description: 'Ежедневный бэкап завершён успешно. Duration: 45 min, Size: 120 GB',
    isTruePositive: false,
    correctPriority: 'low'
  }
];

const severityColors = {
  critical: { bg: 'bg-red-500/20', border: 'border-red-500', text: 'text-red-400', badge: 'bg-red-500' },
  high: { bg: 'bg-orange-500/20', border: 'border-orange-500', text: 'text-orange-400', badge: 'bg-orange-500' },
  medium: { bg: 'bg-yellow-500/20', border: 'border-yellow-500', text: 'text-yellow-400', badge: 'bg-yellow-500' },
  low: { bg: 'bg-green-500/20', border: 'border-green-500', text: 'text-green-400', badge: 'bg-green-500' }
};

function DetectionTriage({ onComplete }) {
  const [visibleAlerts, setVisibleAlerts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [classifications, setClassifications] = useState({});
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [triageComplete, setTriageComplete] = useState(false);
  const [alertCount, setAlertCount] = useState(0);

  useEffect(() => {
    if (currentIndex >= alerts.length) {
      setTriageComplete(true);
      return;
    }

    const timer = setTimeout(() => {
      setVisibleAlerts(prev => [...prev, alerts[currentIndex]]);
      setCurrentIndex(prev => prev + 1);
      setAlertCount(prev => prev + 1);
    }, 1500);

    return () => clearTimeout(timer);
  }, [currentIndex]);

  const handleClassify = (alertId, isTP, priority) => {
    setClassifications(prev => ({
      ...prev,
      [alertId]: { isTruePositive: isTP, priority }
    }));
    setSelectedAlert(null);
  };

  const handleNext = () => {
    let correctCount = 0;
    let totalScore = 0;

    alerts.forEach(alert => {
      const classification = classifications[alert.id];
      if (!classification) return;

      if (classification.isTruePositive === alert.isTruePositive) {
        correctCount++;
        totalScore += 3;

        if (alert.isTruePositive && classification.priority === alert.correctPriority) {
          totalScore += 2;
        }
      }
    });

    const score = Math.min(totalScore, 30);
    onComplete({ score, max: 30, alerts: classifications });
  };

  const classifiedCount = Object.keys(classifications).length;
  const truePositiveCount = Object.values(classifications).filter(c => c.isTruePositive).length;
  const falsePositiveCount = Object.values(classifications).filter(c => !c.isTruePositive).length;

  return (
    <div className="h-full flex flex-col bg-gray-950">
      {/* Header */}
      <div className="bg-gray-900 px-6 py-4 border-b border-red-900">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-red-400 font-mono">SOC Dashboard — Обнаружение и триаж</h2>
            <p className="text-gray-400 text-sm font-mono">Классифицируйте входящие алерты</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-red-500/20 rounded-full border border-red-500">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span className="text-red-400 text-sm font-mono">LIVE</span>
            </div>
            <div className="text-gray-400 text-sm font-mono">
              Алертов: {alertCount}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Instructions */}
        <div className="bg-gray-900/50 rounded-xl p-4 border border-red-900 mb-6">
          <p className="text-red-300 text-sm font-mono">
            Алерты поступают в реальном времени. Для каждого определите: True Positive или False Positive, и установите приоритет.
          </p>
        </div>

        {/* Alert Feed */}
        <div className="space-y-3 mb-6">
          <AnimatePresence>
            {visibleAlerts.map((alert, index) => {
              const classification = classifications[alert.id];
              const colors = severityColors[alert.severity];
              const isSelected = selectedAlert === alert.id;

              return (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -50, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  className={`rounded-xl border-2 overflow-hidden transition-all ${
                    isSelected ? `${colors.bg} ${colors.border}` :
                    classification ? 'bg-gray-900/50 border-gray-700' :
                    `${colors.bg} ${colors.border} cursor-pointer hover:opacity-80`
                  }`}
                  onClick={() => !classification && setSelectedAlert(alert.id)}
                >
                  {/* Alert Header */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${colors.badge} ${alert.severity === 'critical' ? 'animate-pulse' : ''}`} />
                        <div>
                          <h3 className="font-bold text-white font-mono">{alert.title}</h3>
                          <p className="text-xs text-gray-400 font-mono">
                            {alert.timestamp} • {alert.source}
                          </p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-mono ${colors.badge} text-white`}>
                        {alert.severity.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300">{alert.description}</p>
                  </div>

                  {/* Classification Panel */}
                  {isSelected && !classification && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="border-t border-gray-800 bg-gray-900 p-4"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        {/* True Positive / False Positive */}
                        <div>
                          <p className="text-sm text-gray-400 mb-2 font-mono">Тип:</p>
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => { e.stopPropagation(); handleClassify(alert.id, true, alert.correctPriority); }}
                              className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-mono text-sm"
                            >
                              True Positive
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleClassify(alert.id, false, 'low'); }}
                              className="flex-1 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition font-mono text-sm"
                            >
                              False Positive
                            </button>
                          </div>
                        </div>

                        {/* Priority */}
                        <div>
                          <p className="text-sm text-gray-400 mb-2 font-mono">Приоритет:</p>
                          <div className="flex gap-2">
                            {['critical', 'high', 'medium', 'low'].map(priority => (
                              <button
                                key={priority}
                                onClick={(e) => { e.stopPropagation(); handleClassify(alert.id, true, priority); }}
                                className={`flex-1 py-2 rounded-lg font-mono text-xs ${
                                  severityColors[priority].badge
                                } text-white hover:opacity-80 transition`}
                              >
                                {priority.toUpperCase()}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Classified Status */}
                  {classification && (
                    <div className="px-4 pb-3">
                      <div className="flex items-center gap-2 text-sm">
                        <span className={`px-2 py-1 rounded text-xs font-mono ${
                          classification.isTruePositive ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'
                        }`}>
                          {classification.isTruePositive ? 'TP' : 'FP'}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-mono ${
                          severityColors[classification.priority].badge
                        } text-white`}>
                          {classification.priority.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Loading indicator */}
        {currentIndex < alerts.length && (
          <div className="text-center py-4">
            <div className="inline-flex items-center gap-2 text-gray-400 font-mono">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span>Ожидание новых алертов...</span>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      {triageComplete && (
        <div className="bg-gray-900 border-t border-red-900 px-6 py-4">
          <div className="flex justify-between text-sm text-gray-400 mb-3 font-mono">
            <span>Классифицировано: {classifiedCount}/{alerts.length}</span>
            <span>TP: {truePositiveCount} | FP: {falsePositiveCount}</span>
          </div>
          <button
            onClick={handleNext}
            disabled={classifiedCount < alerts.length}
            className={`w-full py-3 font-medium rounded-lg transition font-mono ${
              classifiedCount === alerts.length
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-gray-800 text-gray-500 cursor-not-allowed'
            }`}
          >
            Перейти к анализу и содерживанию →
          </button>
        </div>
      )}
    </div>
  );
}

export default DetectionTriage;

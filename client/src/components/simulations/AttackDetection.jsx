import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

const MAX_POINTS = 60;
const BASELINE = 1000;
const ATTACK_THRESHOLD = 5000;
const PEAK_TRAFFIC = 50000;

function AttackDetection({ onComplete }) {
  const [trafficData, setTrafficData] = useState(() => 
    Array(MAX_POINTS).fill(0).map(() => BASELINE + (Math.random() - 0.5) * 200)
  );
  const [isAttackStarted, setIsAttackStarted] = useState(false);
  const [attackDetected, setAttackDetected] = useState(false);
  const [detectionTime, setDetectionTime] = useState(0);
  const [serverStatus, setServerStatus] = useState('online');
  const [showAlert, setShowAlert] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [cpuUsage, setCpuUsage] = useState(25);
  const [bandwidth, setBandwidth] = useState(10);
  const [connections, setConnections] = useState(500);

  const attackStartTime = useRef(null);
  const animFrameRef = useRef(null);
  const timeRef = useRef(0);
  const attackTriggered = useRef(false);
  const attackDelay = useRef(5000 + Math.random() * 10000);

  const generateTraffic = useCallback((time, attackActive) => {
    if (!attackActive) {
      return BASELINE + Math.sin(time * 0.002) * 100 + (Math.random() - 0.5) * 150;
    }

    const attackTime = time - attackStartTime.current;
    const rampUp = Math.min(attackTime / 3000, 1);
    const wave = Math.sin(attackTime * 0.003) * 10000;
    const base = PEAK_TRAFFIC * rampUp;
    return base + wave + (Math.random() - 0.5) * 5000;
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(prev => prev + 100);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const animate = () => {
      timeRef.current += 100;

      if (!attackTriggered.current && timeRef.current > attackDelay.current) {
        attackTriggered.current = true;
        attackStartTime.current = timeRef.current;
        setIsAttackStarted(true);
      }

      const attackActive = attackTriggered.current;
      const newValue = generateTraffic(timeRef.current, attackActive);

      setTrafficData(prev => {
        const newData = [...prev.slice(1), Math.max(0, newValue)];
        return newData;
      });

      if (attackActive) {
        const progress = Math.min((timeRef.current - attackStartTime.current) / 5000, 1);
        setCpuUsage(25 + progress * 70 + Math.random() * 5);
        setBandwidth(10 + progress * 90 + Math.random() * 5);
        setConnections(500 + progress * 15000 + Math.random() * 1000);

        if (progress > 0.3 && serverStatus === 'online') {
          setServerStatus('warning');
        }
        if (progress > 0.6 && serverStatus !== 'under-attack') {
          setServerStatus('under-attack');
          setShowAlert(true);
        }
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [generateTraffic, serverStatus]);

  const handleDetect = () => {
    if (!attackTriggered.current) return;
    
    const timeSinceAttack = timeRef.current - attackStartTime.current;
    setDetectionTime(timeSinceAttack);
    setAttackDetected(true);

    let score = 0;
    if (timeSinceAttack < 2000) score = 30;
    else if (timeSinceAttack < 5000) score = 25;
    else if (timeSinceAttack < 8000) score = 15;
    else score = 5;

    setTimeout(() => {
      onComplete({ score, max: 30 });
    }, 1500);
  };

  const currentTraffic = trafficData[trafficData.length - 1];
  const isAnomalous = currentTraffic > ATTACK_THRESHOLD;

  const getPath = (data, color) => {
    const width = 100;
    const height = 100;
    const maxVal = Math.max(...data, PEAK_TRAFFIC * 0.8);
    
    return data.map((val, i) => {
      const x = (i / (MAX_POINTS - 1)) * width;
      const y = height - (val / maxVal) * height;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  return (
    <div className="h-full flex flex-col bg-gray-950">
      {/* Header */}
      <div className="bg-gray-900 px-6 py-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">NOC Dashboard — Мониторинг трафика</h2>
            <p className="text-gray-400 text-sm">Наблюдайте за трафиком и обнаружите аномалию</p>
          </div>
          <div className="flex items-center gap-4">
            <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${
              serverStatus === 'online' ? 'bg-green-500/20 text-green-400' :
              serverStatus === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-red-500/20 text-red-400 animate-pulse'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                serverStatus === 'online' ? 'bg-green-500' :
                serverStatus === 'warning' ? 'bg-yellow-500' :
                'bg-red-500 animate-ping'
              }`} />
              {serverStatus === 'online' ? 'ONLINE' : serverStatus === 'warning' ? 'WARNING' : 'UNDER ATTACK'}
            </div>
            <div className="text-gray-400 text-sm font-mono">
              {Math.floor(elapsed / 1000)}s
            </div>
          </div>
        </div>
      </div>

      {/* Alert Banner */}
      {showAlert && !attackDetected && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/20 border-b border-red-500/50 px-6 py-3"
        >
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
            <span className="text-red-400 font-medium">ВНИМАНИЕ: Обнаружен аномальный трафик! Проверьте графики!</span>
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Traffic Graph */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-white">Трафик (req/s)</h3>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-green-500" />
                <span className="text-gray-400">Норма (~{BASELINE} req/s)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-red-500" />
                <span className="text-gray-400">Текущий</span>
              </div>
            </div>
          </div>

          <div className="relative h-64 bg-gray-950 rounded-lg overflow-hidden">
            {/* Grid lines */}
            <div className="absolute inset-0">
              {[0, 25, 50, 75, 100].map(y => (
                <div key={y} className="absolute w-full border-t border-gray-800" style={{ top: `${y}%` }} />
              ))}
            </div>

            {/* Threshold line */}
            <div 
              className="absolute w-full border-t-2 border-dashed border-yellow-500/50"
              style={{ bottom: `${(ATTACK_THRESHOLD / PEAK_TRAFFIC) * 100}%` }}
            >
              <span className="absolute right-2 -top-5 text-xs text-yellow-500">Threshold</span>
            </div>

            {/* Baseline */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path
                d={getPath(Array(MAX_POINTS).fill(BASELINE), 'green')}
                fill="none"
                stroke="#22c55e"
                strokeWidth="0.5"
                strokeDasharray="2 2"
              />
            </svg>

            {/* Actual traffic */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="trafficGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={isAnomalous ? '#ef4444' : '#22c55e'} stopOpacity="0.3" />
                  <stop offset="100%" stopColor={isAnomalous ? '#ef4444' : '#22c55e'} stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d={getPath(trafficData, isAnomalous ? 'red' : 'green')}
                fill="url(#trafficGradient)"
              />
              <path
                d={getPath(trafficData, isAnomalous ? 'red' : 'green')}
                fill="none"
                stroke={isAnomalous ? '#ef4444' : '#22c55e'}
                strokeWidth="0.8"
              />
            </svg>

            {/* Current value indicator */}
            <div 
              className="absolute right-0 w-2 h-2 rounded-full animate-pulse"
              style={{ 
                bottom: `${(currentTraffic / PEAK_TRAFFIC) * 100}%`,
                backgroundColor: isAnomalous ? '#ef4444' : '#22c55e'
              }}
            />
          </div>

          {/* Current stats */}
          <div className="mt-4 grid grid-cols-4 gap-4">
            <div className="bg-gray-950 rounded-lg p-3">
              <div className="text-xs text-gray-500 mb-1">Запросов/с</div>
              <div className={`text-xl font-mono font-bold ${isAnomalous ? 'text-red-400' : 'text-green-400'}`}>
                {Math.round(currentTraffic).toLocaleString()}
              </div>
            </div>
            <div className="bg-gray-950 rounded-lg p-3">
              <div className="text-xs text-gray-500 mb-1">CPU</div>
              <div className={`text-xl font-mono font-bold ${cpuUsage > 70 ? 'text-red-400' : 'text-green-400'}`}>
                {Math.round(cpuUsage)}%
              </div>
            </div>
            <div className="bg-gray-950 rounded-lg p-3">
              <div className="text-xs text-gray-500 mb-1">Bandwidth</div>
              <div className={`text-xl font-mono font-bold ${bandwidth > 70 ? 'text-red-400' : 'text-green-400'}`}>
                {Math.round(bandwidth)}%
              </div>
            </div>
            <div className="bg-gray-950 rounded-lg p-3">
              <div className="text-xs text-gray-500 mb-1">Соединения</div>
              <div className={`text-xl font-mono font-bold ${connections > 5000 ? 'text-red-400' : 'text-green-400'}`}>
                {Math.round(connections).toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Detection Button */}
        {isAttackStarted && !attackDetected && (
          <motion.button
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleDetect}
            className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold text-lg rounded-xl transition animate-pulse"
          >
            ОБНАРУЖЕНА АНОМАЛИЯ!
          </motion.button>
        )}

        {attackDetected && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-500/20 border border-green-500/50 rounded-xl p-4 text-center"
          >
            <p className="text-green-400 font-medium">
              Атака обнаружена за {(detectionTime / 1000).toFixed(1)}s
            </p>
            <p className="text-green-300 text-sm mt-1">
              {detectionTime < 2000 ? 'Отличная реакция!' : detectionTime < 5000 ? 'Хорошо!' : 'Можно быстрее...'}
            </p>
          </motion.div>
        )}

        {!isAttackStarted && !attackDetected && (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">📊</div>
            <p>Наблюдайте за трафиком...</p>
            <p className="text-sm mt-1">Ожидание данных</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AttackDetection;

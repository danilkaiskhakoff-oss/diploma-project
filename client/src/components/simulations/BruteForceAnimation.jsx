import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

function BruteForceAnimation({ password, strength, onComplete }) {
  const [phase, setPhase] = useState('intro');
  const [attempts, setAttempts] = useState([]);
  const [currentAttempt, setCurrentAttempt] = useState('');
  const [isCracked, setIsCracked] = useState(false);
  const [crackTime, setCrackTime] = useState('');

  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';

  const generateRandomString = (length) => {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  useEffect(() => {
    const timer = setTimeout(() => setPhase('attacking'), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (phase !== 'attacking') return;

    const isWeak = strength < 40;
    const isMedium = strength >= 40 && strength < 70;

    if (isWeak) {
      // Fast crack for weak passwords
      let attemptCount = 0;
      const maxAttempts = 20;
      const interval = setInterval(() => {
        attemptCount++;
        const randomAttempt = generateRandomString(password.length);
        setCurrentAttempt(randomAttempt);
        setAttempts(prev => [...prev.slice(-4), randomAttempt]);

        if (attemptCount >= maxAttempts - 1) {
          setCurrentAttempt(password);
          setAttempts(prev => [...prev.slice(-4), password]);
          setIsCracked(true);
          setCrackTime('0.003 секунды');
          clearInterval(interval);
          setTimeout(() => setPhase('result'), 1500);
        }
      }, 150);

      return () => clearInterval(interval);
    } else if (isMedium) {
      // Medium speed for medium passwords
      let attemptCount = 0;
      const maxAttempts = 30;
      const interval = setInterval(() => {
        attemptCount++;
        const randomAttempt = generateRandomString(Math.min(password.length, 8));
        setCurrentAttempt(randomAttempt);
        setAttempts(prev => [...prev.slice(-4), randomAttempt]);

        if (attemptCount >= maxAttempts) {
          setIsCracked(false);
          setCrackTime('3 дня');
          clearInterval(interval);
          setTimeout(() => setPhase('result'), 1500);
        }
      }, 200);

      return () => clearInterval(interval);
    } else {
      // Slow for strong passwords - show impossibility
      let attemptCount = 0;
      const maxAttempts = 15;
      const interval = setInterval(() => {
        attemptCount++;
        const randomAttempt = generateRandomString(8);
        setCurrentAttempt(randomAttempt);
        setAttempts(prev => [...prev.slice(-4), randomAttempt]);

        if (attemptCount >= maxAttempts) {
          setIsCracked(false);
          setCrackTime('847 миллиардов лет');
          clearInterval(interval);
          setTimeout(() => setPhase('result'), 1500);
        }
      }, 300);

      return () => clearInterval(interval);
    }
  }, [phase, password, strength]);

  const isWeak = strength < 40;

  return (
    <motion.div
      className="bg-[#1a1a2e] rounded-xl w-full max-w-3xl p-8 border border-gray-700"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
    >
      <h2 className="text-2xl font-bold text-white mb-2">Атака перебором</h2>
      <p className="text-gray-400 text-sm mb-6">
        Посмотрите, как хакер пытается подобрать ваш пароль
      </p>

      {/* Terminal Window */}
      <div className="bg-[#0a0a0f] rounded-lg border border-gray-700 overflow-hidden mb-6">
        {/* Terminal Header */}
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 border-b border-gray-700">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-xs text-gray-400 ml-2">brute_force_attack.exe</span>
        </div>

        {/* Terminal Content */}
        <div className="p-4 font-mono text-sm min-h-[200px]">
          {phase === 'intro' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-green-400"
            >
              <div>$ initializing brute force attack...</div>
              <div>$ target password length: {password.length} characters</div>
              <div>$ starting attack...</div>
            </motion.div>
          )}

          {phase === 'attacking' && (
            <div>
              <div className="text-green-400 mb-4">$ attacking...</div>
              <div className="space-y-1">
                {attempts.map((attempt, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2"
                  >
                    <span className="text-gray-500">[{String(i + 1).padStart(3, '0')}]</span>
                    <span className={attempt === password ? 'text-red-400 font-bold' : 'text-gray-400'}>
                      {attempt}
                    </span>
                    <span className={attempt === password ? 'text-red-400' : 'text-gray-600'}>
                      {attempt === password ? '✅ MATCH!' : ''}
                    </span>
                  </motion.div>
                ))}
                {currentAttempt && currentAttempt !== password && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2 text-yellow-400"
                  >
                    <span className="text-gray-500">[...]</span>
                    <span>{currentAttempt}</span>
                    <span className="animate-pulse">_</span>
                  </motion.div>
                )}
              </div>
            </div>
          )}

          {phase === 'result' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={isWeak && isCracked ? 'text-red-400' : 'text-green-400'}
            >
              {isWeak && isCracked ? (
                <>
                  <div className="text-red-400 font-bold text-lg mb-2">⚠️ ПАРОЛЬ ВЗЛОМАН!</div>
                  <div className="text-gray-400">Время взлома: {crackTime}</div>
                  <div className="text-gray-400 mt-2">Ваш пароль был подобран мгновенно.</div>
                </>
              ) : (
                <>
                  <div className="text-green-400 font-bold text-lg mb-2">✅ АТАКА НЕУСПЕШНА</div>
                  <div className="text-gray-400">Расчётное время взлома: {crackTime}</div>
                  <div className="text-gray-400 mt-2">
                    {strength >= 70
                      ? 'Слишком много комбинаций для перебора.'
                      : 'Пароль может быть взломан, но это займёт время.'}
                  </div>
                </>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Continue Button */}
      {phase === 'result' && (
        <motion.button
          className="w-full py-3 rounded-lg font-medium text-white"
          style={{ background: 'linear-gradient(to bottom, #3b82f6 0%, #2563eb 100%)' }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onComplete}
        >
          Продолжить →
        </motion.button>
      )}
    </motion.div>
  );
}

export default BruteForceAnimation;

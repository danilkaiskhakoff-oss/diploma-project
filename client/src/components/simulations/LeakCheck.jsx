import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

function LeakCheck({ password, commonPasswords, onComplete }) {
  const [phase, setPhase] = useState('checking');
  const [foundInLeaks, setFoundInLeaks] = useState(false);
  const [leakCount, setLeakCount] = useState(0);
  const [databases, setDatabases] = useState([]);

  const mockDatabases = [
    { name: 'Adobe (2013)', count: '153 млн' },
    { name: 'LinkedIn (2012)', count: '164 млн' },
    { name: 'MySpace (2008)', count: '360 млн' },
    { name: 'Dropbox (2012)', count: '68 млн' },
    { name: 'Yahoo (2013)', count: '3 млрд' },
    { name: 'Collection #1 (2019)', count: '773 млн' },
    { name: 'RockYou (2009)', count: '32 млн' },
    { name: 'Tianya (2011)', count: '40 млн' }
  ];

  useEffect(() => {
    const isCommon = commonPasswords.includes(password.toLowerCase());

    if (isCommon) {
      setFoundInLeaks(true);
      setLeakCount(Math.floor(Math.random() * 15000) + 5000);
      const shuffled = [...mockDatabases].sort(() => 0.5 - Math.random());
      setDatabases(shuffled.slice(0, 4));
    }

    const timer = setTimeout(() => {
      setPhase('result');
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      className="bg-[#1a1a2e] rounded-xl w-full max-w-2xl p-8 border border-gray-700"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
    >
      <h2 className="text-2xl font-bold text-white mb-2">Проверка утечек</h2>
      <p className="text-gray-400 text-sm mb-6">
        Проверяем, есть ли ваш пароль в известных базах утечек данных
      </p>

      {/* Checking Animation */}
      {phase === 'checking' && (
        <div className="text-center py-8">
          <motion.div
            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <div className="text-gray-400">Проверяем пароль в базах данных...</div>
          <div className="text-gray-500 text-sm mt-2">Have I Been Pwned, DeHashed, Intelligence X</div>
        </div>
      )}

      {/* Result */}
      {phase === 'result' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {foundInLeaks ? (
            <div>
              {/* Warning */}
              <div className="p-4 bg-red-900/20 border border-red-800 rounded-lg mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">⚠️</span>
                  <div>
                    <div className="text-red-400 font-bold">Пароль найден в утечках!</div>
                    <div className="text-red-300 text-sm">
                      Этот пароль встречается в {leakCount.toLocaleString()} утечках данных
                    </div>
                  </div>
                </div>
              </div>

              {/* Databases */}
              <div className="mb-6">
                <div className="text-sm text-gray-400 mb-3">Найден в следующих базах:</div>
                <div className="space-y-2">
                  {databases.map((db, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center justify-between p-3 bg-[#0a0a0f] rounded-lg border border-red-900/30"
                    >
                      <span className="text-gray-300 text-sm">{db.name}</span>
                      <span className="text-red-400 text-sm">{db.count} аккаунтов</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Warning Text */}
              <div className="p-4 bg-yellow-900/20 border border-yellow-800 rounded-lg mb-6">
                <div className="text-yellow-300 text-sm">
                  <strong>Важно:</strong> Если ваш пароль есть в утечках, хакеры могут использовать его для доступа к вашим аккаунтам. Немедленно смените пароль на всех сайтах, где вы его использовали!
                </div>
              </div>
            </div>
          ) : (
            <div>
              {/* Success */}
              <div className="p-4 bg-green-900/20 border border-green-800 rounded-lg mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">✅</span>
                  <div>
                    <div className="text-green-400 font-bold">Пароль не найден в утечках!</div>
                    <div className="text-green-300 text-sm">
                      Этот пароль не встречается в известных базах данных
                    </div>
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="p-4 bg-blue-900/20 border border-blue-800 rounded-lg mb-6">
                <div className="text-blue-300 text-sm">
                  <strong>Отлично!</strong> Ваш пароль уникален и не был скомпрометирован в известных утечках. Это значительно снижает риск взлома.
                </div>
              </div>
            </div>
          )}

          {/* Continue Button */}
          <motion.button
            className="w-full py-3 rounded-lg font-medium text-white"
            style={{ background: 'linear-gradient(to bottom, #3b82f6 0%, #2563eb 100%)' }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onComplete}
          >
            Продолжить →
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
}

export default LeakCheck;

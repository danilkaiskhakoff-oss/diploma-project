import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

function PasswordGenerator({ commonPasswords, onComplete }) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState(0);
  const [feedback, setFeedback] = useState([]);
  const [crackTime, setCrackTime] = useState('');

  const calculateStrength = (pwd) => {
    let score = 0;
    const feedbacks = [];

    if (pwd.length === 0) return { score: 0, feedbacks: ['Введите пароль'] };

    // Length
    if (pwd.length >= 12) score += 25;
    else if (pwd.length >= 8) score += 15;
    else if (pwd.length >= 6) score += 5;
    else feedbacks.push('Слишком короткий (минимум 12 символов)');

    // Uppercase
    if (/[A-Z]/.test(pwd)) score += 15;
    else feedbacks.push('Добавьте заглавные буквы (A-Z)');

    // Lowercase
    if (/[a-z]/.test(pwd)) score += 15;
    else feedbacks.push('Добавьте строчные буквы (a-z)');

    // Numbers
    if (/[0-9]/.test(pwd)) score += 15;
    else feedbacks.push('Добавьте цифры (0-9)');

    // Special chars
    if (/[^A-Za-z0-9]/.test(pwd)) score += 20;
    else feedbacks.push('Добавьте спецсимволы (!@#$%^&*)');

    // Common password check
    if (commonPasswords.includes(pwd.toLowerCase())) {
      score = Math.min(score, 10);
      feedbacks.unshift('⚠️ Этот пароль есть в списке распространённых!');
    }

    // Patterns
    if (/(.)\1{2,}/.test(pwd)) {
      score -= 10;
      feedbacks.push('Не используйте повторяющиеся символы');
    }
    if (/^(012|123|234|345|456|567|678|789|abc|bcd)/.test(pwd.toLowerCase())) {
      score -= 10;
      feedbacks.push('Не используйте последовательности');
    }

    score = Math.max(0, Math.min(100, score));

    return { score, feedbacks };
  };

  const calculateCrackTime = (pwd) => {
    if (pwd.length === 0) return '—';

    const charsetSize = calculateCharsetSize(pwd);
    const combinations = Math.pow(charsetSize, pwd.length);
    const attemptsPerSecond = 1000000000; // 1 billion attempts/sec
    const seconds = combinations / attemptsPerSecond;

    if (seconds < 1) return 'Мгновенно';
    if (seconds < 60) return `${Math.round(seconds)} секунд`;
    if (seconds < 3600) return `${Math.round(seconds / 60)} минут`;
    if (seconds < 86400) return `${Math.round(seconds / 3600)} часов`;
    if (seconds < 31536000) return `${Math.round(seconds / 86400)} дней`;
    if (seconds < 31536000 * 1000) return `${Math.round(seconds / 31536000)} лет`;
    if (seconds < 31536000 * 1000000) return `${Math.round(seconds / 31536000 / 1000)} тысяч лет`;
    if (seconds < 31536000 * 1000000000) return `${Math.round(seconds / 31536000 / 1000000)} миллионов лет`;
    if (seconds < 31536000 * 1000000000000) return `${Math.round(seconds / 31536000 / 1000000000)} миллиардов лет`;
    return '∞ (невозможно взломать)';
  };

  const calculateCharsetSize = (pwd) => {
    let size = 0;
    if (/[a-z]/.test(pwd)) size += 26;
    if (/[A-Z]/.test(pwd)) size += 26;
    if (/[0-9]/.test(pwd)) size += 10;
    if (/[^A-Za-z0-9]/.test(pwd)) size += 32;
    return size || 26;
  };

  useEffect(() => {
    const { score, feedbacks } = calculateStrength(password);
    setStrength(score);
    setFeedback(feedbacks);
    setCrackTime(calculateCrackTime(password));
  }, [password]);

  const getStrengthColor = () => {
    if (strength >= 80) return '#22c55e';
    if (strength >= 60) return '#eab308';
    if (strength >= 40) return '#f97316';
    return '#ef4444';
  };

  const getStrengthLabel = () => {
    if (strength >= 80) return 'Очень сильный';
    if (strength >= 60) return 'Сильный';
    if (strength >= 40) return 'Средний';
    if (strength >= 20) return 'Слабый';
    return 'Очень слабый';
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=';
    let result = '';
    for (let i = 0; i < 16; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(result);
  };

  const handleSubmit = () => {
    if (password.length >= 6) {
      onComplete(password, strength);
    }
  };

  return (
    <motion.div
      className="bg-[#1a1a2e] rounded-xl w-full max-w-2xl p-8 border border-gray-700"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
    >
      <h2 className="text-2xl font-bold text-white mb-2">Создание пароля</h2>
      <p className="text-gray-400 text-sm mb-6">Создайте надёжный пароль для регистрации на сайте</p>

      {/* Password Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">Пароль</label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-[#0a0a0f] border border-gray-600 rounded-lg text-white font-mono text-lg focus:outline-none focus:border-blue-500"
            placeholder="Введите пароль..."
          />
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? '' : '👁️'}
          </button>
        </div>
      </div>

      {/* Generate Button */}
      <motion.button
        className="w-full py-2 rounded-lg text-sm font-medium mb-6"
        style={{
          background: 'linear-gradient(to bottom, rgba(80,130,180,0.3) 0%, rgba(40,80,130,0.3) 100%)',
          border: '1px solid rgba(100,160,220,0.3)',
          color: '#93c5fd'
        }}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={generatePassword}
      >
         Сгенерировать надёжный пароль
      </motion.button>

      {/* Strength Meter */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">Надёжность пароля</span>
          <span className="text-sm font-medium" style={{ color: getStrengthColor() }}>
            {getStrengthLabel()}
          </span>
        </div>
        <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: getStrengthColor() }}
            initial={{ width: 0 }}
            animate={{ width: `${strength}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Crack Time */}
      <div className="mb-6 p-4 bg-[#0a0a0f] rounded-lg border border-gray-700">
        <div className="text-sm text-gray-400 mb-1">Время взлома перебором:</div>
        <div className="text-xl font-bold font-mono" style={{ color: getStrengthColor() }}>
          {crackTime}
        </div>
      </div>

      {/* Feedback */}
      {feedback.length > 0 && (
        <div className="mb-6">
          <div className="text-sm text-gray-400 mb-2">Рекомендации:</div>
          <div className="space-y-2">
            {feedback.map((item, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <span className={item.startsWith('⚠️') ? 'text-yellow-400' : 'text-blue-400'}>•</span>
                <span className={item.startsWith('⚠️') ? 'text-yellow-300' : 'text-gray-300'}>
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Submit Button */}
      <motion.button
        className="w-full py-3 rounded-lg font-medium text-white"
        style={{
          background: password.length >= 6
            ? 'linear-gradient(to bottom, #3b82f6 0%, #2563eb 100%)'
            : 'linear-gradient(to bottom, #4b5563 0%, #374151 100%)',
          opacity: password.length >= 6 ? 1 : 0.5
        }}
        whileHover={password.length >= 6 ? { scale: 1.02 } : {}}
        whileTap={password.length >= 6 ? { scale: 0.98 } : {}}
        onClick={handleSubmit}
        disabled={password.length < 6}
      >
        Продолжить →
      </motion.button>
    </motion.div>
  );
}

export default PasswordGenerator;

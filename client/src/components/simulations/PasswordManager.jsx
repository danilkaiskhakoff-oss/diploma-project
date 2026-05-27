import { useState } from 'react';
import { motion } from 'framer-motion';

function PasswordManager({ onComplete }) {
  const [step, setStep] = useState('intro');
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [savedPasswords, setSavedPasswords] = useState([
    { site: 'gmail.com', username: 'user@gmail.com', password: '••••••••' },
    { site: 'github.com', username: 'developer', password: '••••••••' }
  ]);
  const [showPassword, setShowPassword] = useState(false);

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let result = '';
    for (let i = 0; i < 16; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedPassword(result);
  };

  const savePassword = () => {
    if (generatedPassword) {
      setSavedPasswords([
        ...savedPasswords,
        { site: 'new-site.com', username: 'user', password: '••••••••' }
      ]);
      setStep('autofill');
    }
  };

  return (
    <motion.div
      className="bg-[#1a1a2e] rounded-xl w-full max-w-3xl p-8 border border-gray-700"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
    >
      {/* Step: Intro */}
      {step === 'intro' && (
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Менеджер паролей</h2>
          <p className="text-gray-400 text-sm mb-6">
            Как запомнить десятки сложных паролей? Используйте менеджер паролей!
          </p>

          {/* Problem Visualization */}
          <div className="mb-6 p-4 bg-[#0a0a0f] rounded-lg border border-gray-700">
            <div className="text-sm text-gray-400 mb-3">Проблема:</div>
            <div className="flex flex-wrap gap-2">
              {['Facebook', 'Google', 'GitHub', 'Amazon', 'Netflix', 'Bank', 'Email', 'Work'].map((site, i) => (
                <motion.div
                  key={i}
                  className="px-3 py-1.5 bg-red-900/20 border border-red-800 rounded text-xs text-red-300"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  {site}: 123456
                </motion.div>
              ))}
            </div>
            <div className="text-red-400 text-xs mt-3">
              ⚠️ Один пароль для всех сайтов = все аккаунты под угрозой!
            </div>
          </div>

          {/* Solution */}
          <div className="mb-6 p-4 bg-green-900/20 border border-green-800 rounded-lg">
            <div className="text-sm text-green-300 mb-2">Решение: Менеджер паролей</div>
            <div className="text-gray-300 text-sm">
              Менеджер паролей хранит все ваши пароли в зашифрованном хранилище.
              Вам нужно запомнить только один мастер-пароль!
            </div>
          </div>

          {/* Manager Comparison */}
          <div className="mb-6">
            <div className="text-sm text-gray-400 mb-3">Популярные менеджеры паролей:</div>
            <div className="grid grid-cols-3 gap-3">
              <ManagerCard
                name="Bitwarden"
                price="Бесплатно"
                features="Open-source, кроссплатформенный"
                recommended
              />
              <ManagerCard
                name="KeePass"
                price="Бесплатно"
                features="Локальное хранение, без облака"
              />
              <ManagerCard
                name="1Password"
                price="$3/мес"
                features="Удобный, семейный план"
              />
            </div>
          </div>

          <motion.button
            className="w-full py-3 rounded-lg font-medium text-white"
            style={{ background: 'linear-gradient(to bottom, #3b82f6 0%, #2563eb 100%)' }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setStep('generator')}
          >
            Попробовать Bitwarden →
          </motion.button>
        </div>
      )}

      {/* Step: Password Generator */}
      {step === 'generator' && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">B</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Bitwarden — Генератор паролей</h2>
              <p className="text-gray-400 text-xs">Создайте надёжный пароль для нового сайта</p>
            </div>
          </div>

          {/* Generator Settings */}
          <div className="mb-6 p-4 bg-[#0a0a0f] rounded-lg border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-400">Длина пароля</span>
              <span className="text-white font-mono">16 символов</span>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-400">Заглавные буквы (A-Z)</span>
              <span className="text-green-400">Включено</span>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-400">Строчные буквы (a-z)</span>
              <span className="text-green-400">Включено</span>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-400">Цифры (0-9)</span>
              <span className="text-green-400">Включено</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Спецсимволы (!@#$)</span>
              <span className="text-green-400">Включено</span>
            </div>
          </div>

          {/* Generated Password */}
          <div className="mb-6">
            <motion.button
              className="w-full py-4 bg-[#0a0a0f] border-2 border-dashed border-gray-600 rounded-lg text-center"
              whileHover={{ borderColor: '#3b82f6' }}
              onClick={generatePassword}
            >
              {generatedPassword ? (
                <div className="font-mono text-lg text-white break-all">
                  {showPassword ? generatedPassword : '••••••••••••••••'}
                </div>
              ) : (
                <div className="text-gray-400">
                   Нажмите, чтобы сгенерировать пароль
                </div>
              )}
            </motion.button>
            {generatedPassword && (
              <button
                className="text-blue-400 text-sm mt-2 hover:text-blue-300"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Скрыть' : 'Показать'} пароль
              </button>
            )}
          </div>

          {generatedPassword && (
            <motion.button
              className="w-full py-3 rounded-lg font-medium text-white"
              style={{ background: 'linear-gradient(to bottom, #22c55e 0%, #16a34a 100%)' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={savePassword}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Сохранить пароль в хранилище
            </motion.button>
          )}
        </div>
      )}

      {/* Step: Autofill Demo */}
      {step === 'autofill' && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">B</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Bitwarden — Автозаполнение</h2>
              <p className="text-gray-400 text-xs">Менеджер паролей автоматически заполняет формы входа</p>
            </div>
          </div>

          {/* Saved Passwords */}
          <div className="mb-6">
            <div className="text-sm text-gray-400 mb-3">Сохранённые пароли:</div>
            <div className="space-y-2">
              {savedPasswords.map((item, i) => (
                <motion.div
                  key={i}
                  className="flex items-center justify-between p-3 bg-[#0a0a0f] rounded-lg border border-gray-700"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center text-sm">
                      {item.site.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-white text-sm">{item.site}</div>
                      <div className="text-gray-500 text-xs">{item.username}</div>
                    </div>
                  </div>
                  <span className="text-green-400 text-xs">Сохранён</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Login Form Simulation */}
          <div className="mb-6 p-4 bg-white rounded-lg border border-gray-300">
            <div className="text-sm font-medium text-gray-800 mb-4">Вход на new-site.com</div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-600">Email</label>
                <div className="px-3 py-2 bg-gray-100 rounded border border-gray-300 text-sm text-gray-800">
                  user@new-site.com
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-600">Пароль</label>
                <div className="px-3 py-2 bg-gray-100 rounded border border-gray-300 text-sm text-gray-800 font-mono">
                  ••••••••••••••••
                </div>
              </div>
            </div>
            <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
              Bitwarden автоматически заполнил форму входа!
            </div>
          </div>

          <motion.button
            className="w-full py-3 rounded-lg font-medium text-white"
            style={{ background: 'linear-gradient(to bottom, #3b82f6 0%, #2563eb 100%)' }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onComplete}
          >
            Перейти к проверке знаний →
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}

function ManagerCard({ name, price, features, recommended }) {
  return (
    <motion.div
      className={`p-4 rounded-lg border ${
        recommended
          ? 'bg-blue-900/20 border-blue-700'
          : 'bg-[#0a0a0f] border-gray-700'
      }`}
      whileHover={{ scale: 1.02 }}
    >
      <div className="text-white font-medium text-sm mb-1">{name}</div>
      <div className={`text-xs mb-2 ${recommended ? 'text-blue-400' : 'text-gray-400'}`}>
        {price}
      </div>
      <div className="text-gray-500 text-xs">{features}</div>
      {recommended && (
        <div className="mt-2 text-xs text-blue-400"> Рекомендуется</div>
      )}
    </motion.div>
  );
}

export default PasswordManager;

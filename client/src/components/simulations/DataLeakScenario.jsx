import { useState } from 'react';
import { motion } from 'framer-motion';

function DataLeakScenario({ twoFactorEnabled, backupStrategy, filesEncrypted, onComplete }) {
  const [step, setStep] = useState('news');
  const [showResults, setShowResults] = useState(false);

  const getProtectionScore = () => {
    let score = 0;
    if (twoFactorEnabled) score += 33;
    if (backupStrategy === '321') score += 33;
    if (filesEncrypted) score += 34;
    return score;
  };

  const score = getProtectionScore();

  const handleContinue = () => {
    setShowResults(true);
    setTimeout(() => {
      onComplete();
    }, 3000);
  };

  return (
    <motion.div className="bg-[#1a1a2e] rounded-xl w-full max-w-2xl p-8 border border-gray-700" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
      <h2 className="text-2xl font-bold text-white mb-2">Сценарий: Утечка данных</h2>
      <p className="text-gray-400 text-sm mb-6">Проверим, насколько вы защищены в реальной ситуации</p>

      {/* Step: News */}
      {step === 'news' && (
        <div>
          <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">📰</span>
              <div>
                <div className="text-red-400 font-bold">СРОЧНЫЕ НОВОСТИ</div>
                <div className="text-red-300 text-sm">Крупная утечка данных</div>
              </div>
            </div>
          </div>

          {/* News Article Simulation */}
          <div className="mb-6 bg-white rounded-lg p-4 border border-gray-300">
            <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-200">
              <span className="text-lg"></span>
              <div>
                <div className="text-sm font-bold text-gray-800">CyberNews Daily</div>
                <div className="text-xs text-gray-500">Технологии и безопасность</div>
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Утечка данных Yahoo: 3 миллиарда аккаунтов скомпрометированы
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Компания Yahoo сообщила о крупнейшей утечке данных в истории. Злоумышленники получили доступ к именам, email-адресам, телефонам и хэшированным паролям пользователей.
            </p>
            <div className="bg-gray-100 p-3 rounded mb-3">
              <div className="text-xs text-gray-600">📅 Дата утечки: 2013 год</div>
              <div className="text-xs text-gray-600"> Затронуто: 3,000,000,000 аккаунтов</div>
              <div className="text-xs text-gray-600">🔓 Данные: email, пароли, телефоны</div>
            </div>
            <p className="text-sm text-red-600 font-medium">
              Эксперты рекомендуют немедленно сменить пароли и включить двухфакторную аутентификацию!
            </p>
          </div>

          {/* User's Situation */}
          <div className="mb-6 p-4 bg-[#0a0a0f] rounded-lg border border-gray-700">
            <div className="text-sm text-gray-400 mb-3">Ваша ситуация:</div>
            <div className="text-white text-sm mb-2">
              Вы использовали email <span className="font-mono text-blue-400">user@yahoo.com</span> для регистрации на Yahoo.
            </div>
            <div className="text-white text-sm">
              Ваш пароль был найден в утечке!
            </div>
          </div>

          <motion.button className="w-full py-3 rounded-lg font-medium text-white" style={{ background: 'linear-gradient(to bottom, #ef4444 0%, #dc2626 100%)' }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setStep('analysis')}>
            Проверить защиту аккаунта →
          </motion.button>
        </div>
      )}

      {/* Step: Analysis */}
      {step === 'analysis' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="mb-6">
            <div className="text-sm text-gray-400 mb-4">Анализ вашей защиты:</div>

            {/* 2FA Status */}
            <div className={`mb-4 p-4 rounded-lg border ${twoFactorEnabled ? 'bg-green-900/20 border-green-800' : 'bg-red-900/20 border-red-800'}`}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{twoFactorEnabled ? '✅' : '❌'}</span>
                <div>
                  <div className={`font-medium ${twoFactorEnabled ? 'text-green-400' : 'text-red-400'}`}>
                    Двухфакторная аутентификация
                  </div>
                  <div className="text-gray-300 text-sm">
                    {twoFactorEnabled
                      ? `Включена (${twoFactorMethod === 'authenticator' ? 'Приложение' : twoFactorMethod === 'sms' ? 'SMS' : 'Ключ'})`
                      : 'Не включена — аккаунт уязвим!'}
                  </div>
                </div>
              </div>
            </div>

            {/* Backup Status */}
            <div className={`mb-4 p-4 rounded-lg border ${backupStrategy === '321' ? 'bg-green-900/20 border-green-800' : backupStrategy ? 'bg-yellow-900/20 border-yellow-800' : 'bg-red-900/20 border-red-800'}`}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{backupStrategy === '321' ? '✅' : backupStrategy ? '' : '❌'}</span>
                <div>
                  <div className={`font-medium ${backupStrategy === '321' ? 'text-green-400' : backupStrategy ? 'text-yellow-400' : 'text-red-400'}`}>
                    Резервные копии
                  </div>
                  <div className="text-gray-300 text-sm">
                    {backupStrategy === '321' ? 'Правило 3-2-1 — отличная защита' : backupStrategy ? 'Частичная защита' : 'Нет бэкапов — данные под угрозой'}
                  </div>
                </div>
              </div>
            </div>

            {/* Encryption Status */}
            <div className={`mb-4 p-4 rounded-lg border ${filesEncrypted ? 'bg-green-900/20 border-green-800' : 'bg-red-900/20 border-red-800'}`}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{filesEncrypted ? '✅' : '❌'}</span>
                <div>
                  <div className={`font-medium ${filesEncrypted ? 'text-green-400' : 'text-red-400'}`}>
                    Шифрование файлов
                  </div>
                  <div className="text-gray-300 text-sm">
                    {filesEncrypted ? 'Файлы зашифрованы AES-256' : 'Файлы не зашифрованы — уязвимы при краже'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Consequences */}
          <div className="mb-6 p-4 bg-[#0a0a0f] rounded-lg border border-gray-700">
            <div className="text-sm text-gray-400 mb-3">Что произойдёт:</div>
            <div className="space-y-2">
              {twoFactorEnabled ? (
                <div className="flex items-start gap-2 text-sm text-green-300">
                  <span>✅</span>
                  <span>Даже с украденным паролем, хакер не сможет войти без второго фактора</span>
                </div>
              ) : (
                <div className="flex items-start gap-2 text-sm text-red-300">
                  <span>❌</span>
                  <span>Хакер может войти в аккаунт, используя украденный пароль</span>
                </div>
              )}

              {backupStrategy === '321' ? (
                <div className="flex items-start gap-2 text-sm text-green-300">
                  <span>✅</span>
                  <span>Даже если аккаунт взломан, у вас есть резервные копии данных</span>
                </div>
              ) : (
                <div className="flex items-start gap-2 text-sm text-yellow-300">
                  <span>️</span>
                  <span>Резервные копии могут быть недостаточно надёжными</span>
                </div>
              )}

              {filesEncrypted ? (
                <div className="flex items-start gap-2 text-sm text-green-300">
                  <span>✅</span>
                  <span>Ваши файлы зашифрованы — хакер не сможет их прочитать</span>
                </div>
              ) : (
                <div className="flex items-start gap-2 text-sm text-red-300">
                  <span>❌</span>
                  <span>Незашифрованные файлы могут быть украдены и прочитаны</span>
                </div>
              )}
            </div>
          </div>

          <motion.button className="w-full py-3 rounded-lg font-medium text-white" style={{ background: 'linear-gradient(to bottom, #3b82f6 0%, #2563eb 100%)' }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleContinue}>
            Показать итоговый результат →
          </motion.button>
        </motion.div>
      )}

      {/* Step: Results */}
      {showResults && (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="text-6xl mb-4">{score >= 90 ? '' : score >= 60 ? '' : '⚠️'}</div>
          <h3 className="text-2xl font-bold text-white mb-2">
            {score >= 90 ? 'Отличная защита!' : score >= 60 ? 'Хорошая защита' : 'Нужно улучшить защиту'}
          </h3>
          <p className="text-gray-400 mb-6">
            {score >= 90
              ? 'Вы хорошо защищены от угроз. Продолжайте в том же духе!'
              : score >= 60
              ? 'У вас есть базовая защита, но есть над чем работать.'
              : 'Ваши данные под угрозой. Рекомендуем улучшить защиту.'}
          </p>

          <div className="mb-6">
            <div className="w-full h-4 bg-gray-700 rounded-full overflow-hidden">
              <motion.div className="h-full rounded-full" style={{ backgroundColor: score >= 90 ? '#22c55e' : score >= 60 ? '#eab308' : '#ef4444' }} initial={{ width: 0 }} animate={{ width: `${score}%` }} transition={{ duration: 1 }} />
            </div>
            <div className="text-right text-sm mt-1" style={{ color: score >= 90 ? '#22c55e' : score >= 60 ? '#eab308' : '#ef4444' }}>
              {score}% защиты
            </div>
          </div>

          <div className="text-gray-500 text-sm">Переход к проверке знаний...</div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default DataLeakScenario;

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as OTPAuth from 'otpauth';
import { QRCodeCanvas } from 'qrcode.react';

function TwoFactorAuth({ onComplete }) {
  const [step, setStep] = useState('method');
  const [selectedMethod, setSelectedMethod] = useState('');
  const [totpSecret, setTotpSecret] = useState('');
  const [totpUri, setTotpUri] = useState('');
  const [currentCode, setCurrentCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const [inputCode, setInputCode] = useState('');
  const [smsCode, setSmsCode] = useState('');
  const [smsSent, setSmsSent] = useState(false);
  const [smsVerified, setSmsVerified] = useState(false);
  const [error, setError] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Generate TOTP secret
  useEffect(() => {
    if (step === 'authenticator') {
      const totp = new OTPAuth.TOTP({
        issuer: 'CyberSecurity',
        label: 'user@cybersecurity.edu',
        algorithm: 'SHA1',
        digits: 6,
        period: 30,
        secret: OTPAuth.Secret.fromRandom(128)
      });
      setTotpSecret(totp.secret.base32);
      setTotpUri(totp.toString());
    }
  }, [step]);

  // Update TOTP code every second
  useEffect(() => {
    if (step !== 'authenticator' || !totpSecret) return;

    const totp = new OTPAuth.TOTP({
      issuer: 'CyberSecurity',
      label: 'user@cybersecurity.edu',
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: OTPAuth.Secret.fromBase32(totpSecret)
    });

    const updateCode = () => {
      const now = Date.now();
      const epoch = Math.floor(now / 1000);
      const time = epoch % 30;
      const remaining = 30 - time;
      setTimeLeft(remaining);
      setCurrentCode(totp.generate({ now }));
    };

    updateCode();
    const interval = setInterval(updateCode, 1000);
    return () => clearInterval(interval);
  }, [step, totpSecret]);

  const handleMethodSelect = (method) => {
    setSelectedMethod(method);
    if (method === 'authenticator') {
      setStep('authenticator');
    } else if (method === 'sms') {
      setPhoneNumber('');
      setStep('sms');
    } else {
      setStep('key');
    }
  };

  const handleSmsSend = () => {
    setSmsSent(true);
    setSmsCode(String(Math.floor(100000 + Math.random() * 900000)));
  };

  const handleSmsVerify = () => {
    if (inputCode === smsCode) {
      setSmsVerified(true);
      setError('');
      setTimeout(() => onComplete('sms'), 1000);
    } else {
      setError('Неверный код. Попробуйте снова.');
    }
  };

  const handleTotpVerify = () => {
    const totp = new OTPAuth.TOTP({
      issuer: 'CyberSecurity',
      label: 'user@cybersecurity.edu',
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: OTPAuth.Secret.fromBase32(totpSecret)
    });

    const isValid = totp.validate({ token: inputCode, window: 1 }) !== null;
    if (isValid) {
      setError('');
      setTimeout(() => onComplete('authenticator'), 1000);
    } else {
      setError('Неверный код. Проверьте код в приложении.');
    }
  };

  const handleKeyVerify = () => {
    setTimeout(() => onComplete('key'), 1000);
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    const digits = value.replace(/\D/g, '');
    
    // Limit to 11 digits (+7 + 10)
    if (digits.length > 11) return;
    
    // If user is deleting, allow it
    if (digits.length < phoneNumber.replace(/\D/g, '').length) {
      // Format the remaining digits
      let formatted = '+7';
      if (digits.length > 1) formatted += ' (' + digits.slice(1, 4);
      if (digits.length >= 4) formatted += ') ' + digits.slice(4, 7);
      if (digits.length >= 7) formatted += '-' + digits.slice(7, 9);
      if (digits.length >= 9) formatted += '-' + digits.slice(9, 11);
      setPhoneNumber(formatted);
      return;
    }
    
    // Format with mask
    let formatted = '+7';
    if (digits.length > 1) formatted += ' (' + digits.slice(1, 4);
    if (digits.length >= 4) formatted += ') ' + digits.slice(4, 7);
    if (digits.length >= 7) formatted += '-' + digits.slice(7, 9);
    if (digits.length >= 9) formatted += '-' + digits.slice(9, 11);
    
    setPhoneNumber(formatted);
  };

  const getDigitsCount = () => {
    return phoneNumber.replace(/\D/g, '').length;
  };

  return (
    <motion.div className="bg-[#1a1a2e] rounded-xl w-full max-w-2xl p-8 border border-gray-700" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
      <h2 className="text-2xl font-bold text-white mb-2">Двухфакторная аутентификация</h2>
      <p className="text-gray-400 text-sm mb-6">Защитите свой аккаунт дополнительным уровнем безопасности</p>

      {/* Step: Method Selection */}
      {step === 'method' && (
        <div>
          <div className="text-sm text-gray-400 mb-4">Выберите метод 2FA:</div>
          <div className="space-y-3 mb-6">
            <MethodCard
              icon=""
              name="Приложение-аутентификатор"
              description="Google Authenticator, Microsoft Authenticator"
              security="Высокая"
              securityColor="text-green-400"
              recommended
              onClick={() => handleMethodSelect('authenticator')}
            />
            <MethodCard
              icon="💬"
              name="SMS-код"
              description="Код приходит на ваш телефон"
              security="Средняя"
              securityColor="text-yellow-400"
              onClick={() => handleMethodSelect('sms')}
            />
            <MethodCard
              icon=""
              name="Аппаратный ключ"
              description="YubiKey, Titan Security Key"
              security="Максимальная"
              securityColor="text-green-400"
              onClick={() => handleMethodSelect('key')}
            />
          </div>
        </div>
      )}

      {/* Step: Authenticator App */}
      {step === 'authenticator' && (
        <div>
          <div className="text-sm text-gray-400 mb-4">Настройка Google Authenticator:</div>

          {/* QR Code */}
          <div className="flex flex-col items-center mb-6">
            <div className="bg-white p-4 rounded-lg mb-4">
              <QRCodeCanvas value={totpUri} size={180} level="L" />
            </div>
            <p className="text-gray-400 text-sm text-center mb-2">
              Отсканируйте QR-код приложением Google Authenticator
            </p>
            <div className="text-gray-500 text-xs mb-4">
              Или введите ключ вручную: <span className="font-mono text-gray-300">{totpSecret}</span>
            </div>
          </div>

          {/* Current Code Display (for verification) */}
          <div className="mb-6 p-4 bg-[#0a0a0f] rounded-lg border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Текущий код:</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-mono font-bold text-green-400">{currentCode}</span>
                <div className="w-8 h-8 relative">
                  <svg className="w-8 h-8 -rotate-90" viewBox="0 0 32 32">
                    <circle cx="16" cy="16" r="14" stroke="#374151" strokeWidth="3" fill="none" />
                    <circle cx="16" cy="16" r="14" stroke="#3b82f6" strokeWidth="3" fill="none" strokeDasharray={`${(timeLeft / 30) * 88} 88`} strokeLinecap="round" />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-xs text-gray-400">{timeLeft}</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500">Код обновляется каждые 30 секунд</p>
          </div>

          {/* Code Input */}
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-2">Введите 6-значный код из приложения:</label>
            <input
              type="text"
              maxLength={6}
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.replace(/\D/g, ''))}
              className="w-full px-4 py-3 bg-[#0a0a0f] border border-gray-600 rounded-lg text-white font-mono text-xl text-center tracking-widest focus:outline-none focus:border-blue-500"
              placeholder="000000"
            />
          </div>

          {error && <div className="text-red-400 text-sm mb-4">{error}</div>}

          <motion.button
            className="w-full py-3 rounded-lg font-medium text-white"
            style={{ background: inputCode.length === 6 ? 'linear-gradient(to bottom, #22c55e 0%, #16a34a 100%)' : 'linear-gradient(to bottom, #4b5563 0%, #374151 100%)', opacity: inputCode.length === 6 ? 1 : 0.5 }}
            whileHover={inputCode.length === 6 ? { scale: 1.02 } : {}}
            whileTap={inputCode.length === 6 ? { scale: 0.98 } : {}}
            onClick={handleTotpVerify}
            disabled={inputCode.length !== 6}
          >
            Подтвердить
          </motion.button>
        </div>
      )}

      {/* Step: SMS */}
      {step === 'sms' && (
        <div>
          <div className="text-sm text-gray-400 mb-4">Настройка SMS-аутентификации:</div>

          {/* Phone Input */}
          {!smsSent ? (
            <div>
              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-2">Номер телефона:</label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  placeholder="+7 (999) 123-45-67"
                  className="w-full px-4 py-3 bg-[#0a0a0f] border border-gray-600 rounded-lg text-white font-mono focus:outline-none focus:border-blue-500"
                />
              </div>
              <motion.button
                className="w-full py-3 rounded-lg font-medium text-white"
                style={{ background: getDigitsCount() === 11 ? 'linear-gradient(to bottom, #3b82f6 0%, #2563eb 100%)' : 'linear-gradient(to bottom, #4b5563 0%, #374151 100%)', opacity: getDigitsCount() === 11 ? 1 : 0.5 }}
                whileHover={getDigitsCount() === 11 ? { scale: 1.02 } : {}}
                whileTap={getDigitsCount() === 11 ? { scale: 0.98 } : {}}
                onClick={handleSmsSend}
                disabled={getDigitsCount() !== 11}
              >
                Отправить код
              </motion.button>
            </div>
          ) : (
            <div>
              {/* SMS Notification Simulation */}
              <div className="mb-6 p-4 bg-green-900/20 border border-green-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">💬</span>
                  <div>
                    <div className="text-green-400 font-medium">SMS отправлено!</div>
                    <div className="text-green-300 text-sm">
                      Код: <span className="font-mono font-bold">{smsCode}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-2">Введите код из SMS:</label>
                <input
                  type="text"
                  maxLength={6}
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-4 py-3 bg-[#0a0a0f] border border-gray-600 rounded-lg text-white font-mono text-xl text-center tracking-widest focus:outline-none focus:border-blue-500"
                  placeholder="000000"
                />
              </div>

              {error && <div className="text-red-400 text-sm mb-4">{error}</div>}

              <motion.button
                className="w-full py-3 rounded-lg font-medium text-white"
                style={{ background: inputCode.length === 6 ? 'linear-gradient(to bottom, #22c55e 0%, #16a34a 100%)' : 'linear-gradient(to bottom, #4b5563 0%, #374151 100%)', opacity: inputCode.length === 6 ? 1 : 0.5 }}
                whileHover={inputCode.length === 6 ? { scale: 1.02 } : {}}
                whileTap={inputCode.length === 6 ? { scale: 0.98 } : {}}
                onClick={handleSmsVerify}
                disabled={inputCode.length !== 6}
              >
                Подтвердить
              </motion.button>

              {/* Security Warning */}
              <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-800 rounded-lg">
                <div className="text-yellow-300 text-xs">
                  ⚠️ SMS менее безопасен: возможен перехват через SIM-swapping атаку
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step: Hardware Key */}
      {step === 'key' && (
        <div>
          <div className="text-sm text-gray-400 mb-4">Настройка аппаратного ключа:</div>

          <div className="flex flex-col items-center mb-6">
            <div className="w-32 h-32 bg-gray-800 rounded-2xl flex items-center justify-center mb-4 border border-gray-700">
              <span className="text-6xl"></span>
            </div>
            <p className="text-gray-300 text-center mb-2">Вставьте YubiKey в USB-порт</p>
            <p className="text-gray-500 text-sm text-center">Или нажмите кнопку на ключе</p>
          </div>

          <motion.button
            className="w-full py-3 rounded-lg font-medium text-white"
            style={{ background: 'linear-gradient(to bottom, #3b82f6 0%, #2563eb 100%)' }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleKeyVerify}
          >
            Симулировать нажатие на ключ
          </motion.button>

          <div className="mt-4 p-3 bg-green-900/20 border border-green-800 rounded-lg">
            <div className="text-green-300 text-xs">
              ✅ Аппаратный ключ — самый безопасный метод 2FA. Невозможно перехватить удалённо.
            </div>
          </div>
        </div>
      )}

      {/* Success State */}
      {(smsVerified || step === 'key') && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
          <div className="text-4xl mb-4">✅</div>
          <div className="text-green-400 font-bold text-lg">2FA успешно настроена!</div>
          <div className="text-gray-400 text-sm mt-2">Ваш аккаунт теперь защищён</div>
        </motion.div>
      )}
    </motion.div>
  );
}

function MethodCard({ icon, name, description, security, securityColor, recommended, onClick }) {
  return (
    <motion.div
      className={`p-4 rounded-lg border cursor-pointer ${recommended ? 'bg-blue-900/20 border-blue-700' : 'bg-[#0a0a0f] border-gray-700'}`}
      whileHover={{ scale: 1.01, borderColor: '#3b82f6' }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl">{icon}</span>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="text-white font-medium">{name}</span>
            {recommended && <span className="text-xs text-blue-400 bg-blue-900/30 px-2 py-0.5 rounded">Рекомендуется</span>}
          </div>
          <div className="text-gray-400 text-xs mt-1">{description}</div>
          <div className={`text-xs mt-2 ${securityColor}`}>Безопасность: {security}</div>
        </div>
      </div>
    </motion.div>
  );
}

export default TwoFactorAuth;

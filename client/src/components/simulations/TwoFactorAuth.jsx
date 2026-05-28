import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as OTPAuth from 'otpauth';
import { QRCodeCanvas } from 'qrcode.react';

const countries = [
  { code: 'RU', name: 'Россия', flag: '🇷🇺', phoneCode: '+7', mask: '+7 (999) 123-45-67', length: 18, digits: 10 },
  { code: 'KZ', name: 'Казахстан', flag: '🇰🇿', phoneCode: '+7', mask: '+7 (999) 123-45-67', length: 18, digits: 10 },
  { code: 'BY', name: 'Беларусь', flag: '🇾', phoneCode: '+375', mask: '+375 (99) 123-45-67', length: 19, digits: 9 },
  { code: 'UA', name: 'Украина', flag: '🇺🇦', phoneCode: '+380', mask: '+380 (99) 123-45-67', length: 19, digits: 9 },
  { code: 'UZ', name: 'Узбекистан', flag: '🇺🇿', phoneCode: '+998', mask: '+998 (99) 123-45-67', length: 19, digits: 9 },
  { code: 'KG', name: 'Кыргызстан', flag: '🇬', phoneCode: '+996', mask: '+996 (999) 123-456', length: 18, digits: 9 },
  { code: 'TJ', name: 'Таджикистан', flag: '🇹🇯', phoneCode: '+992', mask: '+992 (99) 123-45-67', length: 19, digits: 9 },
  { code: 'TM', name: 'Туркменистан', flag: '🇹🇲', phoneCode: '+993', mask: '+993 (99) 123-456', length: 18, digits: 8 },
  { code: 'AM', name: 'Армения', flag: '🇲', phoneCode: '+374', mask: '+374 (99) 123-456', length: 18, digits: 8 },
  { code: 'AZ', name: 'Азербайджан', flag: '🇦🇿', phoneCode: '+994', mask: '+994 (99) 123-45-67', length: 19, digits: 9 },
  { code: 'MD', name: 'Молдова', flag: '🇩', phoneCode: '+373', mask: '+373 (999) 12-34-56', length: 19, digits: 8 },
  { code: 'GE', name: 'Грузия', flag: '🇬🇪', phoneCode: '+995', mask: '+995 (999) 12-34-56', length: 19, digits: 9 }
];

function formatPhone(value, country) {
  const digits = value.replace(/\D/g, '');
  const phoneCodeDigits = country.phoneCode.replace(/\D/g, '');
  
  // Remove country code digits from input
  let rawDigits = digits;
  if (rawDigits.startsWith(phoneCodeDigits)) {
    rawDigits = rawDigits.slice(phoneCodeDigits.length);
  }
  
  // Apply mask based on country
  const mask = country.mask;
  let result = country.phoneCode + ' ';
  let digitIndex = 0;
  
  for (let i = country.phoneCode.length; i < mask.length && digitIndex < rawDigits.length; i++) {
    if (mask[i] === '9') {
      result += rawDigits[digitIndex];
      digitIndex++;
    } else {
      result += mask[i];
      if (digitIndex < rawDigits.length) {
        // Continue adding digits
      }
    }
  }
  
  return result;
}

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
  const [rawDigits, setRawDigits] = useState(''); // Store only user-entered digits
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowCountryDropdown(false);
      }
    };
    if (showCountryDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showCountryDropdown]);

  const handlePhoneChange = (e) => {
    const inputValue = e.target.value;
    const prevFormatted = phoneNumber;
    
    // Determine if user added or removed a digit
    const prevDigits = rawDigits;
    const currentDigits = inputValue.replace(/\D/g, '');
    const phoneCodeDigits = selectedCountry.phoneCode.replace(/\D/g, '');
    
    // Extract user digits from current input (remove country code)
    let newUserDigits = currentDigits;
    if (newUserDigits.startsWith(phoneCodeDigits)) {
      newUserDigits = newUserDigits.slice(phoneCodeDigits.length);
    }
    
    // If the new digits match what we expect (user added one digit)
    if (newUserDigits.length === prevDigits.length + 1 && newUserDigits.startsWith(prevDigits)) {
      // User added a digit at the end
      const newDigit = newUserDigits[prevDigits.length];
      if (newDigit && /\d/.test(newDigit) && newUserDigits.length <= selectedCountry.digits) {
        setRawDigits(newUserDigits);
      }
    } else if (newUserDigits.length < prevDigits.length && prevDigits.startsWith(newUserDigits)) {
      // User deleted from the end
      setRawDigits(newUserDigits);
    } else if (newUserDigits.length === 0) {
      // User cleared everything
      setRawDigits('');
    } else {
      // Fallback: just use what we extracted
      if (newUserDigits.length <= selectedCountry.digits) {
        setRawDigits(newUserDigits);
      }
    }
  };

  // Format phone number whenever rawDigits or country changes
  useEffect(() => {
    const mask = selectedCountry.mask;
    let result = '';
    let digitIndex = 0;
    
    // Find where user input starts in mask (first '9')
    const codeEndIndex = mask.indexOf('9');
    
    // Add country code part
    result = mask.slice(0, codeEndIndex);
    
    // Apply ONLY user-entered digits to mask
    for (let i = codeEndIndex; i < mask.length && digitIndex < rawDigits.length; i++) {
      if (mask[i] === '9') {
        result += rawDigits[digitIndex];
        digitIndex++;
      } else {
        result += mask[i];
      }
    }
    
    setPhoneNumber(result);
  }, [rawDigits, selectedCountry]);

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
      setRawDigits('');
      setStep('sms');
    } else {
      setStep('key');
    }
  };

  const handleSmsSend = () => {
    setSmsSent(true);
    // Generate random 6-digit code for SMS simulation
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
              icon="📱"
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
              icon="🔑"
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
                
                {/* Country Selector */}
                <div className="relative mb-2" ref={dropdownRef}>
                  <button
                    className="w-full flex items-center gap-3 px-4 py-3 bg-[#0a0a0f] border border-gray-600 rounded-lg text-white hover:border-blue-500 transition"
                    onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                  >
                    <span className="text-xl">{selectedCountry.flag}</span>
                    <span className="flex-1 text-left">{selectedCountry.name}</span>
                    <span className="text-gray-400">{selectedCountry.phoneCode}</span>
                    <span className="text-gray-500">{showCountryDropdown ? '▲' : '▼'}</span>
                  </button>
                  
                  <AnimatePresence>
                    {showCountryDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 right-0 mt-1 bg-[#1a1a2e] border border-gray-600 rounded-lg shadow-xl max-h-48 overflow-y-auto z-50"
                      >
                        {countries.map((country) => (
                          <button
                            key={country.code}
                            className="w-full flex items-center gap-3 px-4 py-2 hover:bg-blue-900/30 transition text-left"
                            onClick={() => {
                              setSelectedCountry(country);
                              setRawDigits('');
                              setShowCountryDropdown(false);
                            }}
                          >
                            <span className="text-xl">{country.flag}</span>
                            <span className="flex-1 text-white text-sm">{country.name}</span>
                            <span className="text-gray-400 text-sm">{country.phoneCode}</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Phone Input with Mask */}
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  placeholder={selectedCountry.mask}
                  className="w-full px-4 py-3 bg-[#0a0a0f] border border-gray-600 rounded-lg text-white font-mono focus:outline-none focus:border-blue-500"
                />
              </div>
              
              <motion.button
                className="w-full py-3 rounded-lg font-medium text-white"
                style={{ background: rawDigits.length === selectedCountry.digits ? 'linear-gradient(to bottom, #3b82f6 0%, #2563eb 100%)' : 'linear-gradient(to bottom, #4b5563 0%, #374151 100%)', opacity: rawDigits.length === selectedCountry.digits ? 1 : 0.5 }}
                whileHover={rawDigits.length === selectedCountry.digits ? { scale: 1.02 } : {}}
                whileTap={rawDigits.length === selectedCountry.digits ? { scale: 0.98 } : {}}
                onClick={handleSmsSend}
                disabled={rawDigits.length !== selectedCountry.digits}
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
              <span className="text-6xl">🔑</span>
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

import { useState } from 'react';
import { motion } from 'framer-motion';

function FileEncryption({ onComplete }) {
  const [step, setStep] = useState('select');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [encrypting, setEncrypting] = useState(false);
  const [encrypted, setEncrypted] = useState(false);
  const [disasterScenario, setDisasterScenario] = useState(null);

  const files = [
    { id: 1, name: 'Пароли.txt', icon: '🔑', sensitive: true },
    { id: 2, name: 'Финансы.xlsx', icon: '💰', sensitive: true },
    { id: 3, name: 'Диплом.docx', icon: '📄', sensitive: true },
    { id: 4, name: 'Фото_кот.jpg', icon: '🐱', sensitive: false },
    { id: 5, name: 'Музыка.mp3', icon: '🎵', sensitive: false },
    { id: 6, name: 'Проект.zip', icon: '', sensitive: true }
  ];

  const toggleFile = (id) => {
    setSelectedFiles(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const handleEncrypt = () => {
    if (selectedFiles.length === 0) return;
    setEncrypting(true);
    setTimeout(() => {
      setEncrypting(false);
      setEncrypted(true);
      setStep('result');
    }, 2000);
  };

  const handleSkip = () => {
    setStep('disaster');
  };

  const handleDisaster = () => {
    if (encrypted) {
      setDisasterScenario('safe');
    } else {
      setDisasterScenario('stolen');
    }
    setStep('disaster-result');
  };

  return (
    <motion.div className="bg-[#1a1a2e] rounded-xl w-full max-w-2xl p-8 border border-gray-700" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
      <h2 className="text-2xl font-bold text-white mb-2">Шифрование файлов</h2>
      <p className="text-gray-400 text-sm mb-6">Защитите чувствительные данные шифрованием AES-256</p>

      {/* Step: Select Files */}
      {step === 'select' && (
        <div>
          <div className="text-sm text-gray-400 mb-4">Выберите файлы для шифрования:</div>
          <div className="space-y-2 mb-6">
            {files.map((file) => (
              <motion.div
                key={file.id}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer ${selectedFiles.includes(file.id) ? 'bg-blue-900/20 border-blue-700' : 'bg-[#0a0a0f] border-gray-700'}`}
                whileHover={{ borderColor: '#3b82f6' }}
                onClick={() => toggleFile(file.id)}
              >
                <div className={`w-5 h-5 rounded border flex items-center justify-center ${selectedFiles.includes(file.id) ? 'bg-blue-600 border-blue-600' : 'border-gray-600'}`}>
                  {selectedFiles.includes(file.id) && <span className="text-white text-xs">✓</span>}
                </div>
                <span className="text-xl">{file.icon}</span>
                <div className="flex-1">
                  <div className="text-white text-sm">{file.name}</div>
                  {file.sensitive && <div className="text-red-400 text-xs">Чувствительный файл</div>}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex gap-3">
            <motion.button className="flex-1 py-3 rounded-lg font-medium text-white" style={{ background: 'linear-gradient(to bottom, #6b7280 0%, #4b5563 100%)' }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSkip}>
              Пропустить
            </motion.button>
            <motion.button className="flex-1 py-3 rounded-lg font-medium text-white" style={{ background: selectedFiles.length > 0 ? 'linear-gradient(to bottom, #22c55e 0%, #16a34a 100%)' : 'linear-gradient(to bottom, #4b5563 0%, #374151 100%)', opacity: selectedFiles.length > 0 ? 1 : 0.5 }} whileHover={selectedFiles.length > 0 ? { scale: 1.02 } : {}} whileTap={selectedFiles.length > 0 ? { scale: 0.98 } : {}} onClick={handleEncrypt} disabled={selectedFiles.length === 0}>
              Зашифровать
            </motion.button>
          </div>
        </div>
      )}

      {/* Step: Encrypting Animation */}
      {step === 'select' && encrypting && (
        <div className="text-center py-8">
          <motion.div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
          <div className="text-gray-400 mb-2">Шифрование AES-256...</div>
          <div className="text-gray-500 text-sm">
            {selectedFiles.map(id => files.find(f => f.id === id)?.name).join(', ')}
          </div>
        </div>
      )}

      {/* Step: Encryption Result */}
      {step === 'result' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="mb-6">
            <div className="text-sm text-gray-400 mb-3">Зашифрованные файлы:</div>
            <div className="space-y-2">
              {selectedFiles.map((id) => {
                const file = files.find(f => f.id === id);
                return (
                  <motion.div key={id} className="flex items-center gap-3 p-3 bg-green-900/10 border border-green-800 rounded-lg" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: selectedFiles.indexOf(id) * 0.1 }}>
                    <span className="text-xl"></span>
                    <div className="flex-1">
                      <div className="text-white text-sm font-mono">{file.name}.aes</div>
                      <div className="text-green-400 text-xs">AES-256 зашифровано</div>
                    </div>
                    <span className="text-gray-500 text-xs">🔒</span>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* AES Explanation */}
          <div className="mb-6 p-4 bg-[#0a0a0f] rounded-lg border border-gray-700">
            <div className="text-sm text-gray-400 mb-2">Как работает AES-256:</div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1 p-2 bg-blue-900/20 rounded text-center">
                <div className="text-xs text-gray-400">Исходный файл</div>
                <div className="text-white font-mono text-xs">Пароль: 12345</div>
              </div>
              <div className="text-gray-500">→</div>
              <div className="flex-1 p-2 bg-green-900/20 rounded text-center">
                <div className="text-xs text-gray-400">Зашифрованный</div>
                <div className="text-green-400 font-mono text-xs">X7k#mP9$vL2!</div>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              Без ключа шифрования невозможно расшифровать данные. Даже самые мощные компьютеры не смогут подобрать ключ AES-256 за миллиарды лет.
            </div>
          </div>

          <motion.button className="w-full py-3 rounded-lg font-medium text-white" style={{ background: 'linear-gradient(to bottom, #3b82f6 0%, #2563eb 100%)' }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setStep('disaster')}>
            Проверить защиту →
          </motion.button>
        </motion.div>
      )}

      {/* Step: Disaster */}
      {step === 'disaster' && (
        <div>
          <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-lg">
            <div className="flex items-center gap-3">
              <span className="text-2xl"></span>
              <div>
                <div className="text-red-400 font-bold">ВНИМАНИЕ!</div>
                <div className="text-red-300 text-sm">Ваш ноутбук украли!</div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-gray-300 mb-4">Что произойдёт с вашими данными?</p>
            <motion.button className="w-full py-3 rounded-lg font-medium text-white" style={{ background: 'linear-gradient(to bottom, #ef4444 0%, #dc2626 100%)' }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleDisaster}>
              Узнать результат
            </motion.button>
          </div>
        </div>
      )}

      {/* Step: Disaster Result */}
      {step === 'disaster-result' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {disasterScenario === 'stolen' && (
            <div>
              <div className="mb-6 p-4 bg-red-900/30 border border-red-800 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl"></span>
                  <div>
                    <div className="text-red-400 font-bold">ДАННЫЕ УКРАДЕНЫ!</div>
                    <div className="text-red-300 text-sm">Файлы не были зашифрованы</div>
                  </div>
                </div>
              </div>
              <div className="space-y-2 mb-6">
                <div className="p-3 bg-red-900/10 rounded text-sm text-red-300">
                  ❌ Пароли.txt — вор получил все ваши пароли
                </div>
                <div className="p-3 bg-red-900/10 rounded text-sm text-red-300">
                  ❌ Финансы.xlsx — данные о банковских счетах украдены
                </div>
                <div className="p-3 bg-red-900/10 rounded text-sm text-red-300">
                  ❌ Диплом.docx — ваша работа украдена
                </div>
              </div>
            </div>
          )}

          {disasterScenario === 'safe' && (
            <div>
              <div className="mb-6 p-4 bg-green-900/20 border border-green-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">✅</span>
                  <div>
                    <div className="text-green-400 font-bold">ДАННЫЕ В БЕЗОПАСНОСТИ!</div>
                    <div className="text-green-300 text-sm">Файлы зашифрованы AES-256</div>
                  </div>
                </div>
              </div>
              <div className="space-y-2 mb-6">
                <div className="p-3 bg-green-900/10 rounded text-sm text-green-300">
                  ✅ Пароли.txt.aes — вор не может расшифровать
                </div>
                <div className="p-3 bg-green-900/10 rounded text-sm text-green-300">
                  ✅ Финансы.xlsx.aes — данные защищены
                </div>
                <div className="p-3 bg-green-900/10 rounded text-sm text-green-300">
                  ✅ Диплом.docx.aes — работа в безопасности
                </div>
              </div>
              <div className="p-3 bg-blue-900/20 border border-blue-800 rounded text-sm text-blue-300">
                💡 Без ключа шифрования вор не сможет открыть файлы, даже имея физический доступ к диску.
              </div>
            </div>
          )}

          <motion.button className="w-full py-3 rounded-lg font-medium text-white" style={{ background: 'linear-gradient(to bottom, #3b82f6 0%, #2563eb 100%)' }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => onComplete(encrypted)}>
            Продолжить →
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
}

export default FileEncryption;

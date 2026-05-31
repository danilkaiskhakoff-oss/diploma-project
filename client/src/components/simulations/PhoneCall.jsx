import { useState } from 'react';
import { motion } from 'framer-motion';

const caller = {
  name: 'Сбербанк',
  number: '+7 (800) 555-35-35',
  avatar: '',
  isScam: true,
  warning: 'Внимание! Этот номер может быть мошенническим. Настоящий Сбербанк не звонит с просьбой сообщить коды из SMS.'
};

function PhoneCall({ onComplete }) {
  const [choice, setChoice] = useState(null);
  const [showWarning, setShowWarning] = useState(false);

  const handleChoice = (action) => {
    setChoice(action);
    if (action === 'answer') {
      setShowWarning(true);
    }
  };

  const handleNext = () => {
    const score = choice === 'decline' ? 20 : choice === 'answer' ? 10 : 5;
    onComplete({ score, max: 20, choice });
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-green-900 to-green-700">
      {/* Caller Info */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.5 }}
          className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center text-5xl mb-4"
        >
          {caller.avatar}
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-white text-2xl font-bold mb-2"
        >
          {caller.name}
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-white/80 text-lg mb-8"
        >
          {caller.number}
        </motion.p>

        {/* Warning */}
        {showWarning && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 mb-6"
          >
            <p className="text-red-300 text-xs text-center">
              {caller.warning}
            </p>
          </motion.div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="px-6 pb-12">
        <div className="flex justify-center gap-8 mb-6">
          {/* Decline Button */}
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleChoice('decline')}
            className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl transition ${
              choice === 'decline' ? 'bg-red-600' : 'bg-red-500'
            }`}
          >
            📞
          </motion.button>

          {/* Answer Button */}
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 1.3 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleChoice('answer')}
            className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl transition ${
              choice === 'answer' ? 'bg-green-600' : 'bg-green-500'
            }`}
          >
            📞
          </motion.button>
        </div>

        {/* Labels */}
        <div className="flex justify-center gap-16 mb-8">
          <span className="text-white/80 text-sm">Отклонить</span>
          <span className="text-white/80 text-sm">Ответить</span>
        </div>

        {/* Next Button */}
        {choice && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={handleNext}
            className="w-full py-3 bg-white/20 text-white font-medium rounded-lg hover:bg-white/30 transition"
          >
            {choice === 'decline' ? 'Отлично! Вы не попались →' : 'Продолжить диалог →'}
          </motion.button>
        )}
      </div>
    </div>
  );
}

export default PhoneCall;

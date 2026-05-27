import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Taskbar from './Taskbar';
import MailApp from './MailApp';
import ThreatMeter from './ThreatMeter';
import HintToggle from './HintToggle';

function Desktop({ simulation, onComplete }) {
  const [showHintToggle, setShowHintToggle] = useState(true);
  const [hintsEnabled, setHintsEnabled] = useState(true);
  const [mailOpen, setMailOpen] = useState(false);
  const [bootPhase, setBootPhase] = useState('black');

  useEffect(() => {
    const timer1 = setTimeout(() => setBootPhase('logo'), 500);
    const timer2 = setTimeout(() => setBootPhase('welcome'), 2000);
    const timer3 = setTimeout(() => setBootPhase('desktop'), 3500);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const handleHintSubmit = (enabled) => {
    setHintsEnabled(enabled);
    setShowHintToggle(false);
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      <AnimatePresence mode="wait">
        {bootPhase === 'black' && (
          <motion.div
            key="black"
            className="absolute inset-0 bg-black"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        )}

        {bootPhase === 'logo' && (
          <motion.div
            key="logo"
            className="absolute inset-0 bg-black flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="flex flex-col items-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <div className="flex gap-1 mb-8">
                {[0, 1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    className="w-16 h-16 rounded-sm"
                    style={{
                      background: ['#f25022', '#7fba00', '#00a4ef', '#ffb900'][i]
                    }}
                    initial={{ rotate: -180, scale: 0 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ duration: 0.8, delay: i * 0.15, ease: "easeOut" }}
                  />
                ))}
              </div>
              <motion.div
                className="text-white text-2xl font-light tracking-wider"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Windows 7
              </motion.div>
            </motion.div>
          </motion.div>
        )}

        {bootPhase === 'welcome' && (
          <motion.div
            key="welcome"
            className="absolute inset-0 bg-gradient-to-b from-[#1a3a5c] to-[#0a1628] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center">
              <motion.div
                className="text-white text-xl font-light mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                Добро пожаловать
              </motion.div>
              <div className="flex gap-2 justify-center">
                {[0, 1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    className="w-3 h-3 rounded-full bg-white"
                    animate={{
                      opacity: [0.3, 1, 0.3],
                      scale: [0.8, 1.2, 0.8]
                    }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      delay: i * 0.15
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {bootPhase === 'desktop' && (
          <motion.div
            key="desktop"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {/* Windows 7 Wallpaper */}
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(135deg, #1e3a5f 0%, #2d5a87 30%, #1a4a7a 60%, #0d2b45 100%)',
              }}
            >
              {/* Aurora effect */}
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  background: 'radial-gradient(ellipse at 30% 20%, rgba(100, 200, 255, 0.4) 0%, transparent 50%), radial-gradient(ellipse at 70% 60%, rgba(50, 150, 200, 0.3) 0%, transparent 40%)'
                }}
              />
            </div>

            {/* Desktop Icons */}
            <div className="absolute top-4 left-4 flex flex-col gap-4 z-10">
              <DesktopIcon
                label="Почта"
                emoji="📧"
                onClick={() => setMailOpen(true)}
              />
              <DesktopIcon label="Корзина" emoji="🗑️" />
              <DesktopIcon label="Мой компьютер" emoji="" />
            </div>

            {/* Threat Meter */}
            <ThreatMeter />

            {/* Mail App Window */}
            <AnimatePresence>
              {mailOpen && (
                <MailApp
                  simulation={simulation}
                  hintsEnabled={hintsEnabled}
                  onClose={() => setMailOpen(false)}
                  onComplete={onComplete}
                />
              )}
            </AnimatePresence>

            {/* Taskbar */}
            <Taskbar mailOpen={mailOpen} onMailClick={() => setMailOpen(!mailOpen)} />

            {/* Hint Toggle Modal */}
            <AnimatePresence>
              {showHintToggle && (
                <HintToggle onSubmit={handleHintSubmit} />
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DesktopIcon({ label, emoji, onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className="flex flex-col items-center gap-1 cursor-pointer w-20"
      whileHover={{ scale: 1.05 }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="w-12 h-12 flex items-center justify-center text-3xl rounded"
        style={{
          background: hovered ? 'rgba(255,255,255,0.2)' : 'transparent',
          border: hovered ? '1px solid rgba(255,255,255,0.3)' : '1px solid transparent'
        }}
      >
        {emoji}
      </div>
      <span
        className="text-white text-xs text-center drop-shadow-lg px-1 rounded"
        style={{
          background: hovered ? 'rgba(0,100,200,0.6)' : 'transparent',
          textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
        }}
      >
        {label}
      </span>
    </motion.div>
  );
}

export default Desktop;

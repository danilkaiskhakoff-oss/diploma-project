import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function Taskbar({ mailOpen, onMailClick, onShutdown }) {
  const [time, setTime] = useState(new Date());
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const startMenuRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Close start menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (startMenuRef.current && !startMenuRef.current.contains(event.target)) {
        setStartMenuOpen(false);
      }
    };
    if (startMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [startMenuOpen]);

  const formatTime = (date) => {
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 h-10 z-50">
      {/* Taskbar background - Windows 7 style */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(60,100,140,0.95) 0%, rgba(30,60,100,0.98) 40%, rgba(20,40,70,0.99) 100%)',
          borderTop: '1px solid rgba(150,200,255,0.3)',
          boxShadow: '0 -2px 10px rgba(0,0,0,0.3)'
        }}
      />

      <div className="relative h-full flex items-center px-1">
        {/* Start Button */}
        <motion.button
          className="h-8 px-3 flex items-center gap-2 rounded-sm mr-1 relative"
          style={{
            background: startMenuOpen
              ? 'linear-gradient(to bottom, rgba(100,160,220,0.95) 0%, rgba(60,100,150,0.95) 50%, rgba(30,60,100,0.95) 100%)'
              : 'linear-gradient(to bottom, rgba(80,140,200,0.9) 0%, rgba(40,80,130,0.9) 50%, rgba(20,50,90,0.95) 100%)',
            border: '1px solid rgba(100,160,220,0.5)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2), 0 1px 3px rgba(0,0,0,0.3)'
          }}
          whileHover={{
            background: 'linear-gradient(to bottom, rgba(100,160,220,0.95) 0%, rgba(60,100,150,0.95) 50%, rgba(30,60,100,0.95) 100%)'
          }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setStartMenuOpen(!startMenuOpen)}
        >
          <div className="flex gap-0.5">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-sm"
                style={{
                  background: ['#f25022', '#7fba00', '#00a4ef', '#ffb900'][i]
                }}
              />
            ))}
          </div>
          <span className="text-white text-xs font-medium drop-shadow">Пуск</span>
        </motion.button>

        {/* Start Menu */}
        <AnimatePresence>
          {startMenuOpen && (
            <StartMenu
              ref={startMenuRef}
              onShutdown={() => {
                setStartMenuOpen(false);
                onShutdown();
              }}
            />
          )}
        </AnimatePresence>

        {/* Separator */}
        <div className="w-px h-6 bg-white/20 mx-1" />

        {/* Mail App Button */}
        <motion.button
          className="h-8 px-3 flex items-center gap-2 rounded-sm"
          style={{
            background: mailOpen
              ? 'linear-gradient(to bottom, rgba(100,160,220,0.6) 0%, rgba(50,100,150,0.6) 100%)'
              : 'linear-gradient(to bottom, rgba(60,100,140,0.4) 0%, rgba(30,60,100,0.4) 100%)',
            border: mailOpen
              ? '1px solid rgba(100,160,220,0.6)'
              : '1px solid rgba(100,160,220,0.2)',
            borderBottom: mailOpen ? 'none' : '1px solid rgba(100,160,220,0.2)'
          }}
          whileHover={{
            background: 'linear-gradient(to bottom, rgba(100,160,220,0.5) 0%, rgba(50,100,150,0.5) 100%)'
          }}
          onClick={onMailClick}
        >
          <span className="text-lg">📧</span>
          <span className="text-white text-xs">Почта</span>
          {mailOpen && (
            <div className="w-1.5 h-1.5 rounded-full bg-blue-300 ml-1" />
          )}
        </motion.button>

        {/* System Tray */}
        <div className="ml-auto flex items-center gap-3 px-3 h-full">
          {/* Volume icon */}
          <span className="text-white/70 text-sm"></span>

          {/* Network icon */}
          <span className="text-white/70 text-sm">📶</span>

          {/* Clock */}
          <div className="text-white/90 text-xs text-right leading-tight">
            <div>{formatTime(time)}</div>
            <div className="text-white/60 text-[10px]">{formatDate(time)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

const StartMenu = ({ onShutdown }) => {
  return (
    <motion.div
      className="absolute bottom-10 left-0 w-80 rounded-t-lg overflow-hidden shadow-2xl"
      style={{
        background: 'linear-gradient(to bottom, rgba(240,245,250,0.98) 0%, rgba(220,230,240,0.98) 100%)',
        border: '1px solid rgba(100,160,220,0.5)',
        borderBottom: 'none',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.4)'
      }}
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ duration: 0.15 }}
    >
      {/* User Panel */}
      <div
        className="flex items-center gap-3 p-3"
        style={{
          background: 'linear-gradient(to bottom, rgba(80,130,180,0.9) 0%, rgba(50,90,140,0.9) 100%)',
          borderBottom: '1px solid rgba(0,0,0,0.2)'
        }}
      >
        <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center text-2xl">
          👤
        </div>
        <div>
          <div className="text-white font-medium text-sm">Пользователь</div>
          <div className="text-white/60 text-xs">Студент</div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="p-2">
        <MenuItem icon="📧" label="Почта" />
        <MenuItem icon="🌐" label="Браузер" />
        <MenuItem icon="📁" label="Документы" />
        <MenuItem icon="️" label="Изображения" />
        <MenuItem icon="🎵" label="Музыка" />
      </div>

      {/* Separator */}
      <div className="mx-2 border-t border-gray-300" />

      {/* Search Bar */}
      <div className="p-2">
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded"
          style={{
            background: 'white',
            border: '1px solid rgba(0,0,0,0.2)',
            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)'
          }}
        >
          <span className="text-gray-400 text-xs"></span>
          <input
            type="text"
            placeholder="Поиск программ и файлов"
            className="flex-1 bg-transparent text-xs text-gray-700 outline-none"
          />
        </div>
      </div>

      {/* Separator */}
      <div className="mx-2 border-t border-gray-300" />

      {/* Bottom Buttons */}
      <div
        className="flex items-center justify-between p-2"
        style={{
          background: 'linear-gradient(to bottom, rgba(230,235,242,0.95) 0%, rgba(210,220,232,0.95) 100%)',
          borderTop: '1px solid rgba(0,0,0,0.1)'
        }}
      >
        <motion.button
          className="flex items-center gap-2 px-3 py-1.5 rounded text-xs text-gray-700"
          whileHover={{ background: 'rgba(0,100,200,0.1)' }}
        >
          <span>⚙️</span>
          <span>Панель управления</span>
        </motion.button>

        <motion.button
          className="flex items-center gap-2 px-3 py-1.5 rounded text-xs text-gray-700"
          whileHover={{ background: 'rgba(200,50,50,0.1)' }}
          onClick={onShutdown}
        >
          <span>⏻</span>
          <span>Завершение работы</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

function MenuItem({ icon, label }) {
  return (
    <motion.div
      className="flex items-center gap-3 px-3 py-2 rounded cursor-pointer"
      whileHover={{ background: 'rgba(0,100,200,0.15)' }}
    >
      <span className="text-lg">{icon}</span>
      <span className="text-sm text-gray-700">{label}</span>
    </motion.div>
  );
}

export default Taskbar;

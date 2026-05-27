import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

function Taskbar({ mailOpen, onMailClick }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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
          className="h-8 px-3 flex items-center gap-2 rounded-sm mr-1"
          style={{
            background: 'linear-gradient(to bottom, rgba(80,140,200,0.9) 0%, rgba(40,80,130,0.9) 50%, rgba(20,50,90,0.95) 100%)',
            border: '1px solid rgba(100,160,220,0.5)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2), 0 1px 3px rgba(0,0,0,0.3)'
          }}
          whileHover={{
            background: 'linear-gradient(to bottom, rgba(100,160,220,0.95) 0%, rgba(60,100,150,0.95) 50%, rgba(30,60,100,0.95) 100%)'
          }}
          whileTap={{ scale: 0.98 }}
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

export default Taskbar;

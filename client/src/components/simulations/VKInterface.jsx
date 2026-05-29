import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProfileAudit from './ProfileAudit';
import FriendRequests from './FriendRequests';
import SocialEngineeringDM from './SocialEngineeringDM';
import PhotoAnalysis from './PhotoAnalysis';
import HackScenario from './HackScenario';

function VKInterface({ currentStage, onStageComplete, privacySettings, friendDecisions, messageResponses, photoFindings }) {
  const [activeMenu, setActiveMenu] = useState('profile');
  const [notifications, setNotifications] = useState({ friends: 4, messages: 3 });
  const [playSound, setPlaySound] = useState(false);

  const playNotificationAudio = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 800;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
      setTimeout(() => ctx.close(), 500);
    } catch (e) {}
  };

  useEffect(() => {
    if (playSound) {
      playNotificationAudio();
      setPlaySound(false);
    }
  }, [playSound]);

  useEffect(() => {
    setPlaySound(true);
  }, [currentStage]);

  const menuItems = [
    { id: 'profile', label: 'Моя страница', icon: '👤' },
    { id: 'news', label: 'Новости', icon: '📰' },
    { id: 'messages', label: 'Сообщения', icon: '💬', badge: notifications.messages },
    { id: 'friends', label: 'Друзья', icon: '👥', badge: notifications.friends },
    { id: 'photos', label: 'Фотографии', icon: '📸' },
    { id: 'settings', label: 'Настройки', icon: '⚙️' },
  ];

  return (
    <div className="w-full h-full flex flex-col" style={{ background: '#edeef0' }}>
      {/* VK Header */}
      <header className="flex items-center justify-between px-4 py-2" style={{ background: '#4a76a8' }}>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 bg-white rounded-lg">
            <span className="text-xl font-bold" style={{ color: '#4a76a8' }}>VK</span>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Поиск"
              className="px-3 py-1 rounded-full text-sm w-64"
              style={{ background: '#224b7a', border: 'none', color: '#fff', outline: 'none' }}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-3">
            <button className="relative text-white hover:opacity-80">
              <span className="text-lg">🔔</span>
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                2
              </span>
            </button>
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-sm">👤</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <nav className="w-48 py-4 px-2" style={{ background: '#fff', borderRight: '1px solid #dce1e6' }}>
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveMenu(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
                    activeMenu === item.id
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 bg-red-500 rounded-full text-xs text-white">
                      {item.badge}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4">
          <AnimatePresence mode="wait">
            {currentStage === 'profile-audit' && (
              <motion.div
                key="profile-audit"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <ProfileAudit
                  privacySettings={privacySettings}
                  onComplete={(settings) => onStageComplete('profile-audit', settings)}
                />
              </motion.div>
            )}

            {currentStage === 'friend-requests' && (
              <motion.div
                key="friend-requests"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <FriendRequests
                  decisions={friendDecisions}
                  onComplete={(decisions) => onStageComplete('friend-requests', decisions)}
                />
              </motion.div>
            )}

            {currentStage === 'messages' && (
              <motion.div
                key="messages"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <SocialEngineeringDM
                  responses={messageResponses}
                  onComplete={(responses) => onStageComplete('messages', responses)}
                />
              </motion.div>
            )}

            {currentStage === 'photo-analysis' && (
              <motion.div
                key="photo-analysis"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <PhotoAnalysis
                  findings={photoFindings}
                  onComplete={(findings) => onStageComplete('photo-analysis', findings)}
                />
              </motion.div>
            )}

            {currentStage === 'hack-scenario' && (
              <motion.div
                key="hack-scenario"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <HackScenario
                  privacySettings={privacySettings}
                  onComplete={() => onStageComplete('hack-scenario')}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default VKInterface;
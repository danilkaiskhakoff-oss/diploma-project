import { useState } from 'react';
import { motion } from 'framer-motion';
import EmailList from './EmailList';
import EmailView from './EmailView';
import PhishingAnalysis from './PhishingAnalysis';

function MailApp({ simulation, hintsEnabled, onClose, onComplete }) {
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [userChoice, setUserChoice] = useState(null);
  const [analyzedEmails, setAnalyzedEmails] = useState([]);

  const emails = simulation.emails;

  const handleEmailSelect = (email) => {
    setSelectedEmail(email);
    setShowAnalysis(false);
    setUserChoice(null);
  };

  const handleChoice = (choice) => {
    setUserChoice(choice);
    setShowAnalysis(true);
    if (!analyzedEmails.includes(selectedEmail.id)) {
      setAnalyzedEmails([...analyzedEmails, selectedEmail.id]);
    }
  };

  const handleNext = () => {
    const currentIndex = emails.findIndex(e => e.id === selectedEmail.id);
    if (currentIndex < emails.length - 1) {
      setSelectedEmail(emails[currentIndex + 1]);
      setShowAnalysis(false);
      setUserChoice(null);
    } else {
      onComplete(analyzedEmails);
    }
  };

  const unreadCount = emails.filter(e => !analyzedEmails.includes(e.id)).length;

  return (
    <motion.div
      className="absolute inset-4 md:inset-8 lg:inset-12 z-40 flex flex-col"
      initial={{ scale: 0.9, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.9, opacity: 0, y: 20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Window Frame - Windows 7 Style */}
      <div
        className="flex flex-col flex-1 rounded-t-lg overflow-hidden"
        style={{
          background: 'linear-gradient(to bottom, rgba(40,70,110,0.95) 0%, rgba(25,50,85,0.98) 100%)',
          border: '1px solid rgba(100,160,220,0.4)',
          borderBottom: 'none',
          boxShadow: '0 0 30px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)'
        }}
      >
        {/* Title Bar */}
        <div
          className="flex items-center justify-between px-3 h-8"
          style={{
            background: 'linear-gradient(to bottom, rgba(80,130,180,0.9) 0%, rgba(50,90,140,0.9) 50%, rgba(30,60,100,0.95) 100%)',
            borderBottom: '1px solid rgba(0,0,0,0.3)'
          }}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg"></span>
            <span className="text-white text-sm font-medium drop-shadow">
              Почта — Входящие ({unreadCount} непрочитанных)
            </span>
          </div>
          <div className="flex gap-1">
            <WindowButton symbol="─" />
            <WindowButton symbol="□" />
            <WindowButton symbol="✕" onClick={onClose} isClose />
          </div>
        </div>

        {/* Menu Bar */}
        <div
          className="flex items-center gap-1 px-2 h-7 text-xs"
          style={{
            background: 'linear-gradient(to bottom, rgba(240,245,250,0.95) 0%, rgba(220,230,240,0.95) 100%)',
            borderBottom: '1px solid rgba(0,0,0,0.1)'
          }}
        >
          {['Файл', 'Правка', 'Вид', 'Сервис', 'Справка'].map((item) => (
            <button
              key={item}
              className="px-2 py-0.5 rounded hover:bg-blue-100 text-gray-700"
            >
              {item}
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div
          className="flex items-center gap-2 px-3 h-10"
          style={{
            background: 'linear-gradient(to bottom, rgba(245,248,252,0.95) 0%, rgba(230,235,242,0.95) 100%)',
            borderBottom: '1px solid rgba(0,0,0,0.15)'
          }}
        >
          <ToolbarButton icon="📥" label="Получить" />
          <ToolbarButton icon="✉️" label="Создать" />
          <ToolbarButton icon="↩️" label="Ответить" disabled={!selectedEmail} />
          <ToolbarButton icon="↪️" label="Переслать" disabled={!selectedEmail} />
          <div className="w-px h-6 bg-gray-300 mx-1" />
          <ToolbarButton icon="🗑️" label="Удалить" disabled={!selectedEmail} />
          <ToolbarButton icon="⚠️" label="Спам" disabled={!selectedEmail} />
        </div>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Folder Pane */}
          <div
            className="w-40 flex-shrink-0 overflow-y-auto"
            style={{
              background: 'linear-gradient(to bottom, rgba(245,248,252,0.98) 0%, rgba(235,240,248,0.98) 100%)',
              borderRight: '1px solid rgba(0,0,0,0.15)'
            }}
          >
            <FolderItem name="Входящие" count={unreadCount} active />
            <FolderItem name="Отправленные" />
            <FolderItem name="Черновики" />
            <FolderItem name="Спам" />
            <FolderItem name="Удалённые" />
          </div>

          {/* Email List */}
          <div className="w-72 flex-shrink-0 overflow-y-auto border-r border-gray-300/50">
            <EmailList
              emails={emails}
              selectedEmail={selectedEmail}
              analyzedEmails={analyzedEmails}
              onSelect={handleEmailSelect}
            />
          </div>

          {/* Email View */}
          <div className="flex-1 overflow-y-auto bg-white/95">
            {selectedEmail ? (
              <EmailView
                email={selectedEmail}
                hintsEnabled={hintsEnabled}
                onChoice={handleChoice}
                analyzedEmails={analyzedEmails}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                Выберите письмо для просмотра
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Analysis Modal */}
      {showAnalysis && selectedEmail && (
        <PhishingAnalysis
          email={selectedEmail}
          userChoice={userChoice}
          onNext={handleNext}
          isLast={analyzedEmails.length === emails.length}
        />
      )}
    </motion.div>
  );
}

function WindowButton({ symbol, onClick, isClose }) {
  return (
    <motion.button
      className="w-8 h-5 flex items-center justify-center text-white/80 text-xs rounded-sm"
      style={{
        background: isClose
          ? 'linear-gradient(to bottom, rgba(220,80,60,0.8) 0%, rgba(180,50,40,0.9) 100%)'
          : 'linear-gradient(to bottom, rgba(80,120,160,0.6) 0%, rgba(50,80,120,0.7) 100%)',
        border: '1px solid rgba(255,255,255,0.2)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2)'
      }}
      whileHover={{
        background: isClose
          ? 'linear-gradient(to bottom, rgba(240,100,80,0.9) 0%, rgba(200,60,50,0.95) 100%)'
          : 'linear-gradient(to bottom, rgba(100,140,180,0.7) 0%, rgba(70,100,140,0.8) 100%)'
      }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      {symbol}
    </motion.button>
  );
}

function ToolbarButton({ icon, label, disabled }) {
  return (
    <motion.button
      className="flex flex-col items-center gap-0.5 px-2 py-1 rounded text-xs text-gray-600"
      style={{ opacity: disabled ? 0.4 : 1 }}
      whileHover={!disabled ? { background: 'rgba(0,100,200,0.1)' } : {}}
      disabled={disabled}
    >
      <span className="text-base">{icon}</span>
      <span className="text-[10px]">{label}</span>
    </motion.button>
  );
}

function FolderItem({ name, count, active }) {
  return (
    <div
      className="flex items-center justify-between px-3 py-1.5 text-xs cursor-pointer"
      style={{
        background: active ? 'rgba(0,100,200,0.15)' : 'transparent',
        borderLeft: active ? '2px solid #3b82f6' : '2px solid transparent'
      }}
    >
      <span className="text-gray-700">{name}</span>
      {count > 0 && (
        <span className="bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
          {count}
        </span>
      )}
    </div>
  );
}

export default MailApp;

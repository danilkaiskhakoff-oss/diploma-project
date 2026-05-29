import { motion } from 'framer-motion';

function BrowserWindow({ children, url = 'https://vk.com', onClose }) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full h-full flex flex-col rounded-lg overflow-hidden shadow-2xl border border-gray-600"
      style={{ background: '#f0f0f0' }}
    >
      {/* Chrome Title Bar */}
      <div className="flex items-center justify-between px-2 py-1" style={{ background: '#dee1e6' }}>
        <div className="flex items-center gap-2">
          {/* Chrome Logo */}
          <div className="w-4 h-4 rounded-full" style={{
            background: 'conic-gradient(from 0deg, #ea4335 0deg 90deg, #fbbc05 90deg 180deg, #34a853 180deg 270deg, #4285f4 270deg 360deg)'
          }} />
          <span className="text-xs text-gray-700">Google Chrome</span>
        </div>
        <div className="flex gap-1">
          <button className="w-6 h-5 flex items-center justify-center text-gray-600 hover:bg-gray-300 rounded text-xs">—</button>
          <button className="w-6 h-5 flex items-center justify-center text-gray-600 hover:bg-gray-300 rounded text-xs">□</button>
          <button
            onClick={onClose}
            className="w-6 h-5 flex items-center justify-center text-white hover:bg-red-500 rounded text-xs"
            style={{ background: '#e81123' }}
          >
            ×
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-end px-2 py-0" style={{ background: '#dee1e6' }}>
        <div className="px-3 py-1 rounded-t-lg text-xs text-gray-700 flex items-center gap-2"
          style={{ background: '#f0f0f0', minWidth: '150px' }}>
          <div className="w-3 h-3">
            <svg viewBox="0 0 24 24" fill="#4a76a8">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
            </svg>
          </div>
          <span className="truncate">ВКонтакте</span>
          <button className="ml-auto text-gray-400 hover:text-gray-600">×</button>
        </div>
        <div className="px-3 py-1 rounded-t-lg text-xs text-gray-500 hover:bg-gray-200 cursor-pointer">
          +
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="flex items-center gap-2 px-3 py-2 border-b" style={{ background: '#f0f0f0', borderColor: '#ccc' }}>
        {/* Navigation Buttons */}
        <div className="flex gap-1">
          <button className="w-6 h-6 flex items-center justify-center text-gray-500 hover:bg-gray-200 rounded text-sm">←</button>
          <button className="w-6 h-6 flex items-center justify-center text-gray-500 hover:bg-gray-200 rounded text-sm">→</button>
          <button className="w-6 h-6 flex items-center justify-center text-gray-500 hover:bg-gray-200 rounded text-sm">↻</button>
        </div>

        {/* Address Bar */}
        <div className="flex-1 flex items-center px-3 py-1 rounded-full text-sm"
          style={{ background: '#fff', border: '1px solid #ccc' }}>
          <svg className="w-3 h-3 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="text-gray-700">{url}</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden bg-white">
        {children}
      </div>
    </motion.div>
  );
}

export default BrowserWindow;
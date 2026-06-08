import { motion } from 'framer-motion';

const menuItems = [
  { id: 'dashboard', icon: '', label: 'Dashboard' },
  { id: 'quizzes', icon: '📝', label: 'Квизы' },
  { id: 'levels', icon: '🎯', label: 'Уровни' },
  { id: 'briefings', icon: '📚', label: 'Брифинги' },
  { id: 'simulations', icon: '🖥️', label: 'Симуляции' },
  { id: 'users', icon: '👥', label: 'Пользователи' },
  { id: 'ui-config', icon: '', label: 'Тема' }
];

function AdminSidebar({ activeSection, onNavigate, onLogout }) {
  return (
    <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col h-screen">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🛡️</span>
          <div>
            <h1 className="text-white font-bold">Admin Panel</h1>
            <p className="text-gray-500 text-xs">CyberSecurity Platform</p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          <motion.button
            key={item.id}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition ${
              activeSection === item.id
                ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-sm font-medium">{item.label}</span>
          </motion.button>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-800">
        <motion.button
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98 }}
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-red-400 hover:bg-red-900/20 transition"
        >
          <span className="text-lg">🚪</span>
          <span className="text-sm font-medium">Выйти</span>
        </motion.button>
      </div>
    </div>
  );
}

export default AdminSidebar;

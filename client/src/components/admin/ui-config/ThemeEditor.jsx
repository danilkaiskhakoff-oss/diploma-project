import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../firebase/config';

const defaultConfig = {
  colors: {
    primary: '#00ff88',
    secondary: '#ffaa00',
    accent: '#ff4444',
    background: '#0a0a0a',
    text: '#ffffff'
  },
  fonts: {
    heading: 'sans-serif',
    body: 'sans-serif'
  },
  theme: 'dark',
  animations: {
    enabled: true,
    duration: 0.3
  }
};

function ThemeEditor() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const docSnap = await getDoc(doc(db, 'ui-config', 'global'));
      if (docSnap.exists()) {
        setConfig(docSnap.data());
      } else {
        setConfig(defaultConfig);
        await setDoc(doc(db, 'ui-config', 'global'), defaultConfig);
      }
    } catch (error) {
      console.error('Error loading config:', error);
      setConfig(defaultConfig);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    // Validate hex colors
    const hexRegex = /^#[0-9a-fA-F]{6}$/;
    for (const [key, value] of Object.entries(config.colors || {})) {
      if (!hexRegex.test(value)) { alert(`Цвет "${key}" имеет неверный формат. Используйте #RRGGBB`); return; }
    }
    setSaving(true);
    setSaved(false);
    try {
      await setDoc(doc(db, 'ui-config', 'global'), config);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Error saving config:', error);
    } finally {
      setSaving(false);
    }
  };

  const updateColor = (key, value) => {
    setConfig({
      ...config,
      colors: { ...config.colors, [key]: value }
    });
  };

  const updateFont = (key, value) => {
    setConfig({
      ...config,
      fonts: { ...config.fonts, [key]: value }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-400">Загрузка настроек...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white">Настройки темы</h2>
          <p className="text-gray-400 mt-1">Настройте внешний вид платформы</p>
        </div>
        <div className="flex items-center gap-4">
          {saved && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-green-400 text-sm"
            >
              ✓ Сохранено!
            </motion.span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition disabled:opacity-50"
          >
            {saving ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Colors */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h3 className="text-xl font-bold text-white mb-6"> Цвета</h3>
          <div className="space-y-4">
            {Object.entries(config.colors).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <label className="text-gray-400 capitalize">{key}</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={value}
                    onChange={(e) => updateColor(key, e.target.value)}
                    className="w-12 h-10 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => updateColor(key, e.target.value)}
                    className="w-32 p-2 bg-gray-800 text-white rounded-lg border border-gray-700 text-sm font-mono"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fonts */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h3 className="text-xl font-bold text-white mb-6">🔤 Шрифты</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 mb-2">Шрифт заголовков</label>
              <select
                value={config.fonts.heading}
                onChange={(e) => updateFont('heading', e.target.value)}
                className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700"
              >
                <option value="sans-serif">Sans-serif (Arial, Helvetica)</option>
                <option value="serif">Serif (Times, Georgia)</option>
                <option value="monospace">Monospace (Courier, Consolas)</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-400 mb-2">Шрифт текста</label>
              <select
                value={config.fonts.body}
                onChange={(e) => updateFont('body', e.target.value)}
                className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700"
              >
                <option value="sans-serif">Sans-serif (Arial, Helvetica)</option>
                <option value="serif">Serif (Times, Georgia)</option>
                <option value="monospace">Monospace (Courier, Consolas)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Theme */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h3 className="text-xl font-bold text-white mb-6"> Тема</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 mb-2">Тема оформления</label>
              <div className="flex gap-4">
                <button
                  onClick={() => setConfig({ ...config, theme: 'dark' })}
                  className={`flex-1 py-3 rounded-lg border transition ${
                    config.theme === 'dark'
                      ? 'bg-gray-800 border-blue-600 text-white'
                      : 'bg-gray-900 border-gray-700 text-gray-400'
                  }`}
                >
                  🌙 Тёмная
                </button>
                <button
                  onClick={() => setConfig({ ...config, theme: 'light' })}
                  className={`flex-1 py-3 rounded-lg border transition ${
                    config.theme === 'light'
                      ? 'bg-gray-800 border-blue-600 text-white'
                      : 'bg-gray-900 border-gray-700 text-gray-400'
                  }`}
                >
                  ☀️ Светлая
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Animations */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h3 className="text-xl font-bold text-white mb-6">✨ Анимации</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-gray-400">Включить анимации</label>
              <button
                onClick={() => setConfig({
                  ...config,
                  animations: { ...config.animations, enabled: !config.animations.enabled }
                })}
                className={`w-14 h-8 rounded-full transition ${
                  config.animations.enabled ? 'bg-green-600' : 'bg-gray-700'
                }`}
              >
                <div className={`w-6 h-6 bg-white rounded-full transition transform ${
                  config.animations.enabled ? 'translate-x-7' : 'translate-x-1'
                }`} />
              </button>
            </div>
            <div>
              <label className="block text-gray-400 mb-2">
                Длительность: {config.animations.duration}s
              </label>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={config.animations.duration}
                onChange={(e) => setConfig({
                  ...config,
                  animations: { ...config.animations, duration: parseFloat(e.target.value) }
                })}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="mt-8 bg-gray-900 rounded-xl p-6 border border-gray-800">
        <h3 className="text-xl font-bold text-white mb-4">️ Предпросмотр</h3>
        <div
          className="p-6 rounded-lg"
          style={{
            backgroundColor: config.colors.background,
            color: config.colors.text,
            fontFamily: config.fonts.body
          }}
        >
          <h4
            className="text-2xl font-bold mb-2"
            style={{
              color: config.colors.primary,
              fontFamily: config.fonts.heading
            }}
          >
            Заголовок платформы
          </h4>
          <p className="mb-4">
            Это пример текста с настроенными цветами и шрифтами.
          </p>
          <div className="flex gap-4">
            <button
              className="px-4 py-2 rounded-lg text-white"
              style={{ backgroundColor: config.colors.primary }}
            >
              Primary Button
            </button>
            <button
              className="px-4 py-2 rounded-lg text-white"
              style={{ backgroundColor: config.colors.accent }}
            >
              Accent Button
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ThemeEditor;

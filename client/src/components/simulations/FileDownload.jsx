import { useState } from 'react';
import { motion } from 'framer-motion';

const files = [
  {
    id: 'cracked-game',
    name: 'GTA_V_Cracked.exe',
    size: '2.4 GB',
    source: 'torrent-site.ru',
    icon: '',
    isSafe: false,
    warning: 'Внимание! Файлы с торрент-сайтов часто содержат вирусы. Взломанные программы — основной источник малвари.',
    realCase: 'В 2023 году более 500 000 пользователей заразились ransomware, скачав взломанные игры с торрентов.'
  },
  {
    id: 'official-update',
    name: 'Windows_Update_KB5034.msu',
    size: '45 MB',
    source: 'microsoft.com',
    icon: '',
    isSafe: true,
    warning: null,
    realCase: null
  },
  {
    id: 'free-antivirus',
    name: 'Super_Antivirus_Pro.exe',
    size: '12 MB',
    source: 'free-antivirus-download.com',
    icon: '',
    isSafe: false,
    warning: 'Подозрительный сайт! Бесплатные антивирусы с неизвестных сайтов часто сами являются малварью.',
    realCase: 'В 2022 году被发现 "FakeAV" малварь, маскирующаяся под антивирус, заразила 2 миллиона компьютеров.'
  },
  {
    id: 'document',
    name: 'Отчёт_2024.docx',
    size: '2 MB',
    source: 'company-sharepoint.com',
    icon: '📄',
    isSafe: true,
    warning: null,
    realCase: null
  }
];

function FileDownload({ onComplete }) {
  const [selected, setSelected] = useState(null);
  const [showWarning, setShowWarning] = useState(false);

  const handleSelect = (file) => {
    setSelected(file);
    setShowWarning(true);
  };

  const handleNext = () => {
    const score = selected.isSafe ? 20 : 0;
    onComplete({ score, max: 20, choice: selected.id });
  };

  return (
    <div className="h-full bg-white rounded-lg overflow-hidden flex flex-col">
      {/* Browser Header */}
      <div className="bg-gray-100 border-b px-4 py-3 flex items-center gap-3">
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <div className="flex-1 bg-white rounded px-3 py-1 text-sm text-gray-600 border">
          https://download-files.com/free-software
        </div>
      </div>

      {/* Page Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Бесплатные загрузки</h2>
        <p className="text-gray-600 mb-6">Выберите файл для скачивания:</p>

        {/* File List */}
        <div className="space-y-3">
          {files.map((file, index) => (
            <motion.button
              key={file.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleSelect(file)}
              className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                selected?.id === file.id
                  ? file.isSafe
                    ? 'bg-green-50 border-green-500'
                    : 'bg-red-50 border-red-500'
                  : 'bg-white border-gray-200 hover:border-blue-500'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl">{file.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-800">{file.name}</h3>
                    {selected?.id === file.id && (
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        file.isSafe ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                      }`}>
                        {file.isSafe ? 'БЕЗОПАСНО' : 'ОПАСНО'}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{file.size} • {file.source}</p>
                </div>
                <span className="text-blue-600 text-sm">Скачать</span>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Warning */}
        {showWarning && selected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-6 p-4 rounded-lg border ${
              selected.isSafe
                ? 'bg-green-50 border-green-200'
                : 'bg-red-50 border-red-200'
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{selected.isSafe ? '✓' : '⚠️'}</span>
              <div>
                <h4 className={`font-medium mb-1 ${selected.isSafe ? 'text-green-800' : 'text-red-800'}`}>
                  {selected.isSafe ? 'Безопасный файл' : 'Подозрительный файл!'}
                </h4>
                {selected.warning && (
                  <p className="text-sm text-red-700 mb-2">{selected.warning}</p>
                )}
                {selected.realCase && (
                  <p className="text-xs text-gray-600 border-t border-gray-300 pt-2 mt-2">
                     Реальный случай: {selected.realCase}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Next Button */}
      {showWarning && (
        <div className="border-t bg-gray-50 px-6 py-4">
          <button
            onClick={handleNext}
            className={`w-full py-3 font-medium rounded-lg transition ${
              selected.isSafe
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-red-500 text-white hover:bg-red-600'
            }`}
          >
            {selected.isSafe ? 'Отлично! Файл безопасен →' : 'Продолжить (файл заражён) →'}
          </button>
        </div>
      )}
    </div>
  );
}

export default FileDownload;

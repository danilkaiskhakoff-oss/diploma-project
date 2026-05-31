import { useState } from 'react';
import { motion } from 'framer-motion';

const devices = [
  {
    id: 1,
    ip: '203.0.113.45',
    type: 'Webcam',
    port: 80,
    service: 'HTTP',
    os: 'Linux',
    country: 'US',
    vulnerability: 'default-password',
    severity: 'high',
    details: 'IP камера с учётными данными admin/admin по умолчанию',
    banner: 'HTTP/1.1 200 OK\nServer: IP-Camera/2.1\nWWW-Authenticate: Basic realm="IP Camera"'
  },
  {
    id: 2,
    ip: '203.0.113.100',
    type: 'Router',
    port: 23,
    service: 'Telnet',
    os: 'VxWorks',
    country: 'US',
    vulnerability: 'open-telnet',
    severity: 'critical',
    details: 'Роутер с открытым Telnet портом. Полный доступ к конфигурации.',
    banner: 'Trying 203.0.113.100...\nConnected to 203.0.113.100.\nEscape character is \'^]\'.\nRouter> '
  },
  {
    id: 3,
    ip: '203.0.113.200',
    type: 'Server',
    port: 3389,
    service: 'RDP',
    os: 'Windows Server 2019',
    country: 'US',
    vulnerability: 'bluekeep',
    severity: 'critical',
    details: 'Windows Server с уязвимостью BlueKeep (CVE-2019-0708)',
    banner: 'RDP Service\nProtocol: RDP 10.6\nEncryption: SSL/TLS\nServer: Windows Server 2019'
  },
  {
    id: 4,
    ip: '203.0.113.150',
    type: 'Database',
    port: 27017,
    service: 'MongoDB',
    os: 'Linux',
    country: 'US',
    vulnerability: 'no-auth',
    severity: 'critical',
    details: 'MongoDB без аутентификации. Полный доступ к БД.',
    banner: 'MongoDB shell version: 4.4.6\nconnecting to: mongodb://203.0.113.150:27017/\n> db'
  },
  {
    id: 5,
    ip: '203.0.113.75',
    type: 'IoT Device',
    port: 443,
    service: 'HTTPS',
    os: 'Embedded',
    country: 'US',
    vulnerability: 'outdated-firmware',
    severity: 'medium',
    details: 'Умный термостат с устаревшей прошивкой',
    banner: 'HTTP/1.1 200 OK\nServer: SmartThermostat/1.2\nContent-Type: application/json'
  },
  {
    id: 6,
    ip: '203.0.113.50',
    type: 'FTP Server',
    port: 21,
    service: 'FTP',
    os: 'Linux',
    country: 'US',
    vulnerability: 'anonymous-login',
    severity: 'high',
    details: 'FTP сервер с анонимным доступом',
    banner: '220 Welcome to FTP Server\nName: anonymous\nPassword: guest@'
  }
];

const filters = [
  { id: 'all', label: 'Все устройства', count: 6 },
  { id: 'critical', label: 'Критические', count: 3 },
  { id: 'high', label: 'Высокие', count: 2 },
  { id: 'medium', label: 'Средние', count: 1 }
];

function ShodanRecon({ onComplete }) {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [flaggedDevices, setFlaggedDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const filteredDevices = selectedFilter === 'all' 
    ? devices 
    : selectedFilter === 'critical'
    ? devices.filter(d => d.severity === 'critical')
    : selectedFilter === 'high'
    ? devices.filter(d => d.severity === 'high')
    : devices.filter(d => d.severity === 'medium');

  const handleFlag = (deviceId) => {
    if (flaggedDevices.includes(deviceId)) {
      setFlaggedDevices(prev => prev.filter(id => id !== deviceId));
    } else {
      setFlaggedDevices(prev => [...prev, deviceId]);
    }
  };

  const handleNext = () => {
    const criticalDevices = devices.filter(d => d.severity === 'critical' || d.severity === 'high');
    const correctFlags = flaggedDevices.filter(id => 
      criticalDevices.some(d => d.id === id)
    ).length;
    const falseFlags = flaggedDevices.filter(id => 
      !criticalDevices.some(d => d.id === id)
    ).length;

    const score = Math.max(0, (correctFlags * 8) - (falseFlags * 5));
    
    setShowResults(true);
    setTimeout(() => {
      onComplete({ score: Math.min(score, 25), max: 25 });
    }, 1500);
  };

  const severityColors = {
    critical: { bg: 'bg-red-500/20', border: 'border-red-500', text: 'text-red-400', badge: 'bg-red-500' },
    high: { bg: 'bg-orange-500/20', border: 'border-orange-500', text: 'text-orange-400', badge: 'bg-orange-500' },
    medium: { bg: 'bg-yellow-500/20', border: 'border-yellow-500', text: 'text-yellow-400', badge: 'bg-yellow-500' }
  };

  return (
    <div className="h-full flex flex-col bg-gray-950">
      {/* Header */}
      <div className="bg-gray-900 px-6 py-4 border-b border-blue-900">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-blue-400 font-mono">Shodan — Разведка устройств</h2>
            <p className="text-gray-400 text-sm font-mono">Найдите уязвимые устройства компании в интернете</p>
          </div>
          <div className="px-3 py-1 bg-blue-500/20 rounded-full border border-blue-500">
            <span className="text-blue-400 text-sm font-mono">SHODAN RECON</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Instructions */}
        <div className="bg-gray-900/50 rounded-xl p-4 border border-blue-900 mb-6">
          <p className="text-blue-300 text-sm font-mono">
            Найдено {devices.length} устройств компании в интернете. Отметьте уязвимые устройства (Critical + High severity).
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {filters.map(filter => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              className={`px-4 py-2 rounded-lg text-sm font-mono whitespace-nowrap transition ${
                selectedFilter === filter.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
              }`}
            >
              {filter.label} ({filter.count})
            </button>
          ))}
        </div>

        {/* Device Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {filteredDevices.map((device, index) => {
            const colors = severityColors[device.severity];
            const isFlagged = flaggedDevices.includes(device.id);
            const isSelected = selectedDevice === device.id;

            return (
              <motion.div
                key={device.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`rounded-xl border-2 overflow-hidden transition-all ${
                  isFlagged ? `${colors.bg} ${colors.border}` : 'bg-gray-900 border-gray-700'
                }`}
              >
                {/* Device Header */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-white font-mono">{device.ip}</h3>
                      <p className="text-xs text-gray-400 font-mono">{device.type} • {device.service}:{device.port}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-mono ${colors.badge} text-white`}>
                      {device.severity.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex gap-2 mb-3">
                    <span className="px-2 py-1 bg-gray-800 text-gray-300 text-xs font-mono rounded">{device.os}</span>
                    <span className="px-2 py-1 bg-gray-800 text-gray-300 text-xs font-mono rounded">{device.country}</span>
                  </div>

                  {/* Flag Button */}
                  <button
                    onClick={() => handleFlag(device.id)}
                    className={`w-full py-2 rounded-lg font-mono text-sm transition ${
                      isFlagged
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    {isFlagged ? '⚠ Отмечено как уязвимое' : 'Отметить уязвимость'}
                  </button>

                  {/* Expand Details */}
                  <button
                    onClick={() => setSelectedDevice(isSelected ? null : device.id)}
                    className="w-full mt-2 py-1 text-xs text-gray-500 hover:text-gray-300 font-mono"
                  >
                    {isSelected ? 'Скрыть детали ▲' : 'Показать детали ▼'}
                  </button>

                  {/* Device Details */}
                  {isSelected && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="mt-3 pt-3 border-t border-gray-800"
                    >
                      <p className="text-sm text-gray-300 mb-2">{device.details}</p>
                      <div className="bg-gray-950 p-3 rounded-lg font-mono text-xs text-green-400 whitespace-pre-wrap">
                        {device.banner}
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Results */}
        {showResults && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-blue-900/30 border border-blue-800 rounded-xl p-6 text-center"
          >
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="text-xl font-bold text-white font-mono mb-2">Разведка завершена!</h3>
            <p className="text-gray-300 font-mono">
              Отмечено устройств: {flaggedDevices.length} | Критических: {devices.filter(d => d.severity === 'critical').length}
            </p>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      {!showResults && flaggedDevices.length > 0 && (
        <div className="bg-gray-900 border-t border-blue-900 px-6 py-4">
          <div className="flex justify-between text-sm text-gray-400 mb-3 font-mono">
            <span>Отмечено: {flaggedDevices.length}</span>
            <span>Критических: {devices.filter(d => d.severity === 'critical').length}</span>
          </div>
          <button
            onClick={handleNext}
            className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition font-mono"
          >
            Перейти к социальной разведке →
          </button>
        </div>
      )}
    </div>
  );
}

export default ShodanRecon;

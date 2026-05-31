import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const targets = [
  { ip: '192.168.1.1', name: 'Роутер', ports: [22, 80], critical: false },
  { ip: '192.168.1.10', name: 'Веб-сервер', ports: [22, 80, 443, 3306], critical: true },
  { ip: '192.168.1.20', name: 'Файловый сервер', ports: [22, 445, 3389], critical: false },
  { ip: '192.168.1.30', name: 'Почтовый сервер', ports: [25, 110, 143, 993], critical: false }
];

const portServices = {
  22: 'SSH', 25: 'SMTP', 80: 'HTTP', 110: 'POP3',
  143: 'IMAP', 443: 'HTTPS', 445: 'SMB', 993: 'IMAPS',
  3306: 'MySQL', 3389: 'RDP'
};

function Reconnaissance({ onComplete }) {
  const [scanProgress, setScanProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [foundHosts, setFoundHosts] = useState([]);
  const [terminalLines, setTerminalLines] = useState([]);
  const [selectedHost, setSelectedHost] = useState(null);

  const terminalRef = useRef(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalLines]);

  const addLine = (text, type = 'info') => {
    setTerminalLines(prev => [...prev, { text, type, id: Date.now() }]);
  };

  const startScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    setTerminalLines([]);
    setFoundHosts([]);

    addLine('nmap -sV -sC -O 192.168.1.0/24', 'command');
    addLine('', 'info');
    addLine('Starting Nmap 7.94 ( https://nmap.org )', 'info');
    addLine('Scanning 256 hosts...', 'info');
    addLine('', 'info');

    let progress = 0;
    let hostIndex = 0;

    const interval = setInterval(() => {
      progress += 2;
      setScanProgress(progress);

      if (progress === 20 && hostIndex === 0) {
        addLine(`Nmap scan report for ${targets[0].ip}`, 'success');
        addLine(`Host is up (0.003s latency)`, 'info');
        addLine(`PORT   STATE  SERVICE`, 'info');
        targets[0].ports.forEach(port => {
          addLine(`${port}/tcp open   ${portServices[port]}`, 'port');
        });
        addLine('', 'info');
        setFoundHosts(prev => [...prev, targets[0]]);
        hostIndex++;
      }

      if (progress === 45 && hostIndex === 1) {
        addLine(`Nmap scan report for ${targets[1].ip}`, 'success');
        addLine(`Host is up (0.001s latency)`, 'info');
        addLine(`PORT   STATE  SERVICE         VERSION`, 'info');
        targets[1].ports.forEach(port => {
          addLine(`${port}/tcp open   ${portServices[port]}`, 'port');
        });
        addLine(`Device type: general purpose`, 'info');
        addLine(`OS: Linux 5.4`, 'info');
        addLine('', 'info');
        setFoundHosts(prev => [...prev, targets[1]]);
        hostIndex++;
      }

      if (progress === 70 && hostIndex === 2) {
        addLine(`Nmap scan report for ${targets[2].ip}`, 'success');
        addLine(`Host is up (0.005s latency)`, 'info');
        addLine(`PORT   STATE  SERVICE`, 'info');
        targets[2].ports.forEach(port => {
          addLine(`${port}/tcp open   ${portServices[port]}`, 'port');
        });
        addLine('', 'info');
        setFoundHosts(prev => [...prev, targets[2]]);
        hostIndex++;
      }

      if (progress === 90 && hostIndex === 3) {
        addLine(`Nmap scan report for ${targets[3].ip}`, 'success');
        addLine(`Host is up (0.002s latency)`, 'info');
        addLine(`PORT   STATE  SERVICE`, 'info');
        targets[3].ports.forEach(port => {
          addLine(`${port}/tcp open   ${portServices[port]}`, 'port');
        });
        addLine('', 'info');
        setFoundHosts(prev => [...prev, targets[3]]);
        hostIndex++;
      }

      if (progress >= 100) {
        clearInterval(interval);
        addLine('Nmap done: 256 IP addresses (4 hosts up) scanned in 45.23 seconds', 'success');
        setScanComplete(true);
        setIsScanning(false);
      }
    }, 100);
  };

  const handleNext = () => {
    const criticalHost = foundHosts.find(h => h.critical);
    const totalPorts = foundHosts.reduce((sum, h) => sum + h.ports.length, 0);
    const score = Math.min(25, Math.round((totalPorts / 10) * 25));

    onComplete({ score, max: 25, ports: foundHosts });
  };

  return (
    <div className="h-full flex flex-col bg-black">
      {/* Header */}
      <div className="bg-gray-900 px-6 py-4 border-b border-green-900">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-green-400 font-mono">Этап 1: Разведка</h2>
            <p className="text-gray-400 text-sm font-mono">Сканирование сети с помощью Nmap</p>
          </div>
          <div className="px-3 py-1 bg-green-500/20 rounded-full border border-green-500">
            <span className="text-green-400 text-sm font-mono">AUTHORIZED PENTEST</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Instructions */}
        <div className="bg-gray-900/50 rounded-xl p-4 border border-green-900 mb-6">
          <p className="text-green-300 text-sm font-mono">
            Задача: Просканируйте сеть 192.168.1.0/24 и найдите все активные хосты и открытые порты.
          </p>
        </div>

        {/* Terminal */}
        <div className="bg-gray-950 rounded-xl border border-green-900 overflow-hidden mb-6">
          {/* Terminal Header */}
          <div className="bg-gray-900 px-4 py-2 flex items-center gap-2 border-b border-green-900">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-gray-400 text-sm font-mono ml-2">root@kali:~</span>
          </div>

          {/* Terminal Content */}
          <div
            ref={terminalRef}
            className="p-4 h-64 overflow-y-auto font-mono text-sm"
          >
            {terminalLines.map((line) => (
              <div
                key={line.id}
                className={`mb-1 ${
                  line.type === 'command' ? 'text-white' :
                  line.type === 'success' ? 'text-green-400' :
                  line.type === 'port' ? 'text-yellow-400' :
                  'text-gray-400'
                }`}
              >
                {line.type === 'command' && <span className="text-green-400">$ </span>}
                {line.text}
              </div>
            ))}

            {isScanning && (
              <div className="text-green-400 animate-pulse">▊</div>
            )}
          </div>
        </div>

        {/* Scan Progress */}
        {isScanning && (
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-400 mb-2 font-mono">
              <span>Сканирование...</span>
              <span>{scanProgress}%</span>
            </div>
            <div className="w-full bg-gray-900 rounded-full h-3 border border-green-900">
              <motion.div
                className="h-3 rounded-full bg-green-500"
                initial={{ width: 0 }}
                animate={{ width: `${scanProgress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </div>
        )}

        {/* Scan Button */}
        {!isScanning && !scanComplete && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={startScan}
            className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold font-mono rounded-xl transition"
          >
            Запустить сканирование Nmap
          </motion.button>
        )}

        {/* Results */}
        {scanComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900 rounded-xl p-6 border border-green-900"
          >
            <h3 className="text-lg font-bold text-green-400 font-mono mb-4">
              Результаты сканирования: {foundHosts.length} хостов найдено
            </h3>

            <div className="space-y-4">
              {foundHosts.map((host, index) => (
                <motion.div
                  key={host.ip}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedHost(selectedHost === host.ip ? null : host.ip)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedHost === host.ip
                      ? 'bg-green-900/30 border-green-500'
                      : host.critical
                      ? 'bg-red-900/20 border-red-800 hover:border-red-500'
                      : 'bg-gray-950 border-gray-800 hover:border-green-500'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-green-400 font-mono">{host.ip}</span>
                      <span className="text-gray-400 text-sm font-mono">({host.name})</span>
                    </div>
                    {host.critical && (
                      <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs font-mono rounded">
                        ЦЕЛЬ
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {host.ports.map(port => (
                      <span key={port} className="px-2 py-1 bg-gray-800 text-yellow-400 text-xs font-mono rounded">
                        {port}/{portServices[port]}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-green-900/20 border border-green-800 rounded-lg">
              <p className="text-green-300 text-sm font-mono">
                Найдено {foundHosts.reduce((sum, h) => sum + h.ports.length, 0)} открытых портов.
                {foundHosts.find(h => h.critical) && ' Веб-сервер (192.168.1.10) — основная цель.'}
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      {scanComplete && (
        <div className="bg-gray-900 border-t border-green-900 px-6 py-4">
          <button
            onClick={handleNext}
            className="w-full py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition font-mono"
          >
            Перейти к анализу уязвимостей →
          </button>
        </div>
      )}
    </div>
  );
}

export default Reconnaissance;

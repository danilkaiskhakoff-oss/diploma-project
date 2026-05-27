import { useState } from 'react';
import { motion } from 'framer-motion';

const companyLogos = {
  amazon: { color: '#ff9900', text: 'amazon', subtext: '.com' },
  apple: { color: '#555555', text: '', subtext: '' },
  google: { color: '#4285f4', text: 'Google', subtext: '' },
  microsoft: { color: '#00a4ef', text: 'Microsoft', subtext: '' },
  paypal: { color: '#003087', text: 'PayPal', subtext: '' },
  company: { color: '#6b7280', text: 'Company', subtext: '' }
};

function EmailView({ email, hintsEnabled, onChoice, analyzedEmails }) {
  const [hoveredElement, setHoveredElement] = useState(null);
  const isAnalyzed = analyzedEmails.includes(email.id);

  const logo = companyLogos[email.body.logo] || companyLogos.company;

  const getSuspiciousHint = (elementId) => {
    if (!hintsEnabled) return null;
    const element = email.suspiciousElements.find(e => e.id === elementId);
    return element ? element.reason : null;
  };

  const highlightSender = hintsEnabled && email.isPhishing && email.suspiciousElements.some(e => e.type === 'sender');
  const highlightUrgency = hintsEnabled && email.isPhishing && email.suspiciousElements.some(e => e.type === 'text' && e.reason.includes('Срочность'));
  const highlightLink = hintsEnabled && email.isPhishing && email.suspiciousElements.some(e => e.type === 'link');
  const highlightSensitive = hintsEnabled && email.isPhishing && email.suspiciousElements.some(e => e.type === 'text' && e.reason.includes('CVV'));

  return (
    <div className="p-4 max-w-2xl mx-auto">
      {/* Email Header */}
      <div className="mb-4 pb-4 border-b border-gray-200">
        <div className="flex items-start justify-between mb-2">
          <h2 className="text-lg font-semibold text-gray-800">{email.subject}</h2>
          {isAnalyzed && (
            <span className={`text-xs px-2 py-1 rounded ${email.isPhishing ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
              {email.isPhishing ? 'Фишинг' : 'Безопасно'}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-gray-500">От:</span>
            <span
              className={`font-medium ${highlightSender ? 'bg-yellow-200 px-1 rounded cursor-help' : ''}`}
              onMouseEnter={() => highlightSender && setHoveredElement('sender')}
              onMouseLeave={() => setHoveredElement(null)}
            >
              {email.fromName} &lt;{email.from}&gt;
            </span>
          </div>
          <span className="text-gray-400 text-xs">{email.date}</span>
        </div>

        {/* Hint tooltip for sender */}
        {hoveredElement === 'sender' && getSuspiciousHint('sender') && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800"
          >
            💡 {getSuspiciousHint('sender')}
          </motion.div>
        )}
      </div>

      {/* Email Body */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-4">
        {/* Company Header */}
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
          <div
            className="w-10 h-10 rounded flex items-center justify-center text-white font-bold"
            style={{ backgroundColor: logo.color }}
          >
            {email.body.logo === 'apple' ? '' : logo.text.charAt(0)}
          </div>
          <div>
            <div className="font-semibold text-gray-800">{email.fromName}</div>
            <div className="text-xs text-gray-400">{email.from}</div>
          </div>
        </div>

        {/* Greeting */}
        <p className="text-gray-700 mb-4">{email.body.greeting}</p>

        {/* Content with highlights */}
        <div className="text-gray-600 mb-6 leading-relaxed">
          {highlightUrgency && email.body.content.includes('24 часа') ? (
            <>
              {email.body.content.split('24 часа').map((part, i, arr) => (
                <span key={i}>
                  {part}
                  {i < arr.length - 1 && (
                    <span
                      className="bg-yellow-200 px-1 rounded cursor-help"
                      onMouseEnter={() => setHoveredElement('urgency')}
                      onMouseLeave={() => setHoveredElement(null)}
                    >
                      24 часа
                    </span>
                  )}
                </span>
              ))}
            </>
          ) : highlightUrgency && email.body.content.includes('2 часа') ? (
            <>
              {email.body.content.split('2 часа').map((part, i, arr) => (
                <span key={i}>
                  {part}
                  {i < arr.length - 1 && (
                    <span
                      className="bg-yellow-200 px-1 rounded cursor-help"
                      onMouseEnter={() => setHoveredElement('urgency')}
                      onMouseLeave={() => setHoveredElement(null)}
                    >
                      2 часа
                    </span>
                  )}
                </span>
              ))}
            </>
          ) : highlightUrgency && email.body.content.includes('12 часов') ? (
            <>
              {email.body.content.split('12 часов').map((part, i, arr) => (
                <span key={i}>
                  {part}
                  {i < arr.length - 1 && (
                    <span
                      className="bg-yellow-200 px-1 rounded cursor-help"
                      onMouseEnter={() => setHoveredElement('urgency')}
                      onMouseLeave={() => setHoveredElement(null)}
                    >
                      12 часов
                    </span>
                  )}
                </span>
              ))}
            </>
          ) : (
            email.body.content
          )}

          {highlightSensitive && email.body.content.includes('CVV') && (
            <span
              className="bg-red-200 px-1 rounded cursor-help ml-1"
              onMouseEnter={() => setHoveredElement('sensitive')}
              onMouseLeave={() => setHoveredElement(null)}
            >
              CVV-код
            </span>
          )}
        </div>

        {/* Hint tooltips */}
        {hoveredElement === 'urgency' && getSuspiciousHint('urgency') && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800"
          >
            💡 {getSuspiciousHint('urgency')}
          </motion.div>
        )}

        {hoveredElement === 'sensitive' && getSuspiciousHint('sensitive') && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-800"
          >
            💡 {getSuspiciousHint('sensitive')}
          </motion.div>
        )}

        {/* Action Button */}
        <div className="mb-4">
          <motion.button
            className="px-6 py-2 rounded text-white font-medium text-sm"
            style={{ backgroundColor: logo.color }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onMouseEnter={() => highlightLink && setHoveredElement('link')}
            onMouseLeave={() => setHoveredElement(null)}
          >
            {email.body.button.text}
          </motion.button>

          {/* Hint tooltip for link */}
          {hoveredElement === 'link' && getSuspiciousHint('link') && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-800"
            >
              💡 {getSuspiciousHint('link')}
              <div className="mt-1 font-mono text-[10px] text-gray-600">
                Реальный URL: {email.body.button.url}
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <div className="text-xs text-gray-400 border-t border-gray-100 pt-4">
          {email.body.footer.split('\n').map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      {!isAnalyzed && (
        <div className="flex gap-3">
          <motion.button
            className="flex-1 py-3 rounded-lg font-medium text-sm flex items-center justify-center gap-2"
            style={{
              background: 'linear-gradient(to bottom, #4ade80 0%, #22c55e 100%)',
              color: '#fff',
              boxShadow: '0 2px 4px rgba(34,197,94,0.3)'
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onChoice('safe')}
          >
            ✅ Это безопасное письмо
          </motion.button>
          <motion.button
            className="flex-1 py-3 rounded-lg font-medium text-sm flex items-center justify-center gap-2"
            style={{
              background: 'linear-gradient(to bottom, #f87171 0%, #ef4444 100%)',
              color: '#fff',
              boxShadow: '0 2px 4px rgba(239,68,68,0.3)'
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onChoice('phishing')}
          >
            🚨 Это фишинг!
          </motion.button>
        </div>
      )}
    </div>
  );
}

export default EmailView;

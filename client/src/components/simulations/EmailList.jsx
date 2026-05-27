import { motion } from 'framer-motion';

function EmailList({ emails, selectedEmail, analyzedEmails, onSelect }) {
  return (
    <div className="divide-y divide-gray-200/50">
      {emails.map((email) => {
        const isSelected = selectedEmail?.id === email.id;
        const isAnalyzed = analyzedEmails.includes(email.id);

        return (
          <motion.div
            key={email.id}
            className="px-3 py-2 cursor-pointer"
            style={{
              background: isSelected
                ? 'linear-gradient(to right, rgba(0,100,200,0.2) 0%, rgba(0,100,200,0.1) 100%)'
                : isAnalyzed
                  ? 'rgba(240,245,250,0.5)'
                  : 'rgba(255,255,255,0.8)',
              borderLeft: isSelected ? '3px solid #3b82f6' : '3px solid transparent'
            }}
            whileHover={{
              background: 'linear-gradient(to right, rgba(0,100,200,0.15) 0%, rgba(0,100,200,0.05) 100%)'
            }}
            onClick={() => onSelect(email)}
          >
            <div className="flex items-start gap-2">
              {!isAnalyzed && (
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className="text-xs font-medium truncate"
                    style={{ color: isAnalyzed ? '#6b7280' : '#1f2937' }}
                  >
                    {email.fromName}
                  </span>
                  <span className="text-[10px] text-gray-400 flex-shrink-0">
                    {email.date.split(',')[0]}
                  </span>
                </div>
                <div
                  className="text-xs truncate mt-0.5"
                  style={{ color: isAnalyzed ? '#9ca3af' : '#374151' }}
                >
                  {email.subject}
                </div>
                <div className="text-[10px] text-gray-400 truncate mt-0.5">
                  {email.body.content.substring(0, 60)}...
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export default EmailList;

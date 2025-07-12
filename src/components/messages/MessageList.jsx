import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';
import { FiMail, FiCheckCircle } from 'react-icons/fi';

function MessageList({ messages, onSelect, activeView }) {
  // Sorteer berichten op datum (nieuwste eerst)
  const sortedMessages = [...messages].sort((a, b) => b.date - a.date);

  const formatMessageDate = (date) => {
    const now = new Date();
    const isToday = 
      date.getDate() === now.getDate() && 
      date.getMonth() === now.getMonth() && 
      date.getFullYear() === now.getFullYear();

    if (isToday) {
      return format(date, "HH:mm", { locale: nl });
    } else {
      return format(date, "d MMM", { locale: nl });
    }
  };

  return (
    <div className="h-full">
      <div className="px-4 py-3 border-b border-gray-200">
        <h2 className="text-lg font-semibold">
          {activeView === 'inbox' ? 'Inbox' : activeView === 'sent' ? 'Verzonden' : 'Prullenbak'}
        </h2>
      </div>

      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <SafeIcon icon={FiMail} className="text-4xl mb-4" />
          <p>Geen berichten gevonden</p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {sortedMessages.map((message) => (
            <motion.li
              key={message.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              whileHover={{ backgroundColor: "#f9fafb" }}
              onClick={() => onSelect(message)}
              className={`px-4 py-3 cursor-pointer ${!message.read && message.folder === 'inbox' ? 'bg-blue-50' : ''}`}
            >
              <div className="flex items-center">
                <div className="mr-3 text-gray-400">
                  <SafeIcon 
                    icon={message.read ? FiCheckCircle : FiMail} 
                    className={!message.read && message.folder === 'inbox' ? 'text-blue-600' : ''}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={`text-sm font-semibold truncate ${!message.read && message.folder === 'inbox' ? 'text-black' : 'text-gray-900'}`}>
                      {activeView === 'sent' ? message.recipient : message.sender}
                    </p>
                    <p className="text-xs text-gray-500 whitespace-nowrap ml-2">
                      {formatMessageDate(message.date)}
                    </p>
                  </div>
                  <p className={`text-sm truncate ${!message.read && message.folder === 'inbox' ? 'font-medium' : 'text-gray-700'}`}>
                    {message.subject}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {message.content.split('\n')[0]}
                  </p>
                </div>
              </div>
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MessageList;
import React from 'react'
import { motion } from 'framer-motion'
import SafeIcon from '../../common/SafeIcon'
import { format } from 'date-fns'
import { nl } from 'date-fns/locale'
import { FiArrowLeft, FiTrash2, FiUser, FiMail, FiClock, FiMessageSquare } from 'react-icons/fi'

function MessageDetail({ message, onBack, onDelete }) {
  const formatFullDate = (date) => {
    return format(date, "d MMMM yyyy 'om' HH:mm", { locale: nl })
  }

  const handleDelete = () => {
    if (confirm('Weet je zeker dat je dit bericht wilt verwijderen?')) {
      onDelete(message.id)
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-3 border-b border-gray-200 flex items-center">
        <button
          onClick={onBack}
          className="mr-4 p-1 rounded-full hover:bg-gray-100"
        >
          <SafeIcon icon={FiArrowLeft} />
        </button>
        <h2 className="text-lg font-semibold flex-1 truncate">{message.subject}</h2>
        <button
          onClick={handleDelete}
          className="ml-4 p-1 rounded-full hover:bg-gray-100 text-red-500"
          aria-label="Verwijderen"
        >
          <SafeIcon icon={FiTrash2} />
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-4 flex-1 overflow-auto"
      >
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="flex items-center mb-3">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-3">
              <SafeIcon icon={FiUser} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-lg">
                {message.folder === 'sent' ? message.recipient : message.sender}
              </p>
              <p className="text-sm text-gray-500">
                {message.folder === 'sent' ? (
                  <>Aan: {message.recipientEmail}</>
                ) : (
                  <>Van: {message.senderEmail}</>
                )}
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap text-sm text-gray-500 gap-4">
            <div className="flex items-center">
              <SafeIcon icon={FiClock} className="mr-1" />
              <span>{formatFullDate(message.date)}</span>
            </div>
            <div className="flex items-center">
              <SafeIcon icon={FiMessageSquare} className="mr-1" />
              <span>
                {message.folder === 'sent' ? 'Verzonden bericht' : 'Ontvangen bericht'}
              </span>
            </div>
            {!message.read && message.folder === 'inbox' && (
              <div className="flex items-center text-blue-600">
                <SafeIcon icon={FiMail} className="mr-1" />
                <span>Nieuw</span>
              </div>
            )}
          </div>
        </div>

        <div className="prose max-w-none">
          <div className="bg-white rounded-lg border p-4">
            {message.content.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-3 last:mb-0 text-gray-800 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default MessageDetail
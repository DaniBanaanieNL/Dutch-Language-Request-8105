import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import SafeIcon from '../common/SafeIcon'
import { FiMail, FiSend, FiInbox, FiTrash2, FiUser, FiPaperclip, FiX } from 'react-icons/fi'
import MessageList from '../components/messages/MessageList'
import MessageDetail from '../components/messages/MessageDetail'
import ComposeMessage from '../components/messages/ComposeMessage'
import { messageService } from '../lib/supabase'

function MessagesPage() {
  const [activeView, setActiveView] = useState('inbox')
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [showCompose, setShowCompose] = useState(false)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)
  const [error, setError] = useState('')

  // Laad berichten bij wijziging van actieve weergave
  useEffect(() => {
    loadMessages()
  }, [activeView])

  // Laad ongelezen berichten aantal
  useEffect(() => {
    loadUnreadCount()
  }, [messages])

  const loadMessages = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await messageService.getMessages(activeView)
      setMessages(data)
    } catch (error) {
      console.error('Fout bij laden berichten:', error)
      setError('Kon berichten niet laden. Probeer het opnieuw.')
    } finally {
      setLoading(false)
    }
  }

  const loadUnreadCount = async () => {
    try {
      const count = await messageService.getUnreadCount()
      setUnreadCount(count)
    } catch (error) {
      console.error('Fout bij laden ongelezen aantal:', error)
    }
  }

  const handleMessageSelect = async (message) => {
    // Markeer bericht als gelezen wanneer erop geklikt wordt
    if (!message.read && activeView === 'inbox') {
      try {
        await messageService.markAsRead(message.id)
        // Update lokale state
        setMessages(messages.map(m => 
          m.id === message.id ? { ...m, read: true } : m
        ))
      } catch (error) {
        console.error('Fout bij markeren als gelezen:', error)
      }
    }
    
    setSelectedMessage(message)
    setShowCompose(false)
  }

  const handleComposeClick = () => {
    setSelectedMessage(null)
    setShowCompose(true)
  }

  const handleSendMessage = async (newMessage) => {
    try {
      await messageService.sendMessage({
        recipientEmail: newMessage.recipient,
        subject: newMessage.subject,
        content: newMessage.content
      })
      
      setShowCompose(false)
      setActiveView('sent')
      await loadMessages() // Herlaad berichten
      
      // Toon succesbericht
      alert('Bericht succesvol verzonden!')
    } catch (error) {
      console.error('Fout bij versturen bericht:', error)
      alert('Fout bij versturen bericht: ' + error.message)
    }
  }

  const handleDeleteMessage = async (messageId) => {
    try {
      await messageService.moveToTrash(messageId)
      setSelectedMessage(null)
      await loadMessages() // Herlaad berichten
    } catch (error) {
      console.error('Fout bij verwijderen bericht:', error)
      alert('Fout bij verwijderen bericht: ' + error.message)
    }
  }

  const handleViewChange = (view) => {
    setActiveView(view)
    setSelectedMessage(null)
    setShowCompose(false)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-8"
      >
        Berichtensysteem
      </motion.h1>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 text-red-700">
          <p>{error}</p>
          <button 
            onClick={loadMessages}
            className="mt-2 text-sm underline hover:no-underline"
          >
            Probeer opnieuw
          </button>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        {/* Zijbalk */}
        <div className="w-full md:w-64 bg-white rounded-lg shadow-md p-4">
          <button
            onClick={handleComposeClick}
            className="w-full bg-blue-600 text-white rounded-lg py-2 px-4 mb-6 flex items-center justify-center hover:bg-blue-700 transition-colors"
          >
            <SafeIcon icon={FiMail} className="mr-2" />
            Nieuw bericht
          </button>

          <nav>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleViewChange('inbox')}
                  className={`w-full text-left py-2 px-3 rounded-lg flex items-center ${
                    activeView === 'inbox' 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <SafeIcon icon={FiInbox} className="mr-3" />
                  Inbox
                  {unreadCount > 0 && (
                    <span className="ml-auto bg-blue-600 text-white text-xs rounded-full h-5 min-w-5 flex items-center justify-center px-1">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleViewChange('sent')}
                  className={`w-full text-left py-2 px-3 rounded-lg flex items-center ${
                    activeView === 'sent' 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <SafeIcon icon={FiSend} className="mr-3" />
                  Verzonden
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleViewChange('trash')}
                  className={`w-full text-left py-2 px-3 rounded-lg flex items-center ${
                    activeView === 'trash' 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <SafeIcon icon={FiTrash2} className="mr-3" />
                  Prullenbak
                </button>
              </li>
            </ul>
          </nav>
        </div>

        {/* Hoofdinhoud */}
        <div className="flex-1 bg-white rounded-lg shadow-md">
          {loading ? (
            <div className="h-96 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : showCompose ? (
            <ComposeMessage
              onSend={handleSendMessage}
              onCancel={() => setShowCompose(false)}
            />
          ) : selectedMessage ? (
            <MessageDetail
              message={selectedMessage}
              onBack={() => setSelectedMessage(null)}
              onDelete={handleDeleteMessage}
            />
          ) : (
            <MessageList
              messages={messages}
              onSelect={handleMessageSelect}
              activeView={activeView}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default MessagesPage
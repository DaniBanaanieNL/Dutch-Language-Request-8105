import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import SafeIcon from '../../common/SafeIcon'
import { FiX, FiSend, FiPaperclip, FiUser, FiChevronDown } from 'react-icons/fi'
import { messageService } from '../../lib/supabase'

function ComposeMessage({ onSend, onCancel }) {
  const [recipient, setRecipient] = useState('')
  const [subject, setSubject] = useState('')
  const [content, setContent] = useState('')
  const [attachments, setAttachments] = useState([])
  const [sending, setSending] = useState(false)
  const [users, setUsers] = useState([])
  const [showUserSuggestions, setShowUserSuggestions] = useState(false)
  const [filteredUsers, setFilteredUsers] = useState([])

  // Laad gebruikers voor autocomplete
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const userData = await messageService.getUsers()
        setUsers(userData)
      } catch (error) {
        console.error('Fout bij laden gebruikers:', error)
      }
    }
    loadUsers()
  }, [])

  // Filter gebruikers op basis van input
  useEffect(() => {
    if (recipient.length > 0) {
      const filtered = users.filter(user => 
        user.email.toLowerCase().includes(recipient.toLowerCase()) ||
        (user.full_name && user.full_name.toLowerCase().includes(recipient.toLowerCase()))
      )
      setFilteredUsers(filtered)
      setShowUserSuggestions(filtered.length > 0 && recipient.length > 1)
    } else {
      setShowUserSuggestions(false)
    }
  }, [recipient, users])

  const handleSend = async (e) => {
    e.preventDefault()
    
    if (!recipient || !subject || !content) {
      alert('Vul alle verplichte velden in')
      return
    }

    // Valideer email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(recipient)) {
      alert('Voer een geldig e-mailadres in')
      return
    }

    setSending(true)

    try {
      await onSend({
        recipient,
        subject,
        content,
        attachments
      })
      
      // Reset form
      setRecipient('')
      setSubject('')
      setContent('')
      setAttachments([])
    } catch (error) {
      console.error('Fout bij het verzenden:', error)
      alert('Er is een fout opgetreden bij het verzenden van het bericht.')
    } finally {
      setSending(false)
    }
  }

  const handleUserSelect = (user) => {
    setRecipient(user.email)
    setShowUserSuggestions(false)
  }

  const handleAttachment = (e) => {
    const files = Array.from(e.target.files)
    setAttachments([...attachments, ...files])
  }

  const removeAttachment = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index))
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full flex flex-col"
    >
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Nieuw bericht</h2>
        <button
          onClick={onCancel}
          className="p-1 rounded-full hover:bg-gray-100"
          aria-label="Sluiten"
        >
          <SafeIcon icon={FiX} />
        </button>
      </div>

      <form onSubmit={handleSend} className="p-4 flex-1 flex flex-col">
        <div className="mb-4 relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Aan: <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center border border-gray-300 rounded-md p-2">
            <SafeIcon icon={FiUser} className="text-gray-400 mr-2" />
            <input
              type="email"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="flex-1 outline-none text-sm"
              placeholder="naam@school.nl"
              required
            />
            {users.length > 0 && (
              <SafeIcon icon={FiChevronDown} className="text-gray-400 ml-2" />
            )}
          </div>
          
          {/* Gebruiker suggesties */}
          {showUserSuggestions && (
            <div className="absolute top-full left-0 right-0 z-10 bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-40 overflow-y-auto">
              {filteredUsers.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => handleUserSelect(user)}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <SafeIcon icon={FiUser} className="text-blue-600 text-sm" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">
                        {user.full_name || user.email.split('@')[0]}
                      </div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                      <div className="text-xs text-blue-600">
                        {user.user_type === 'teacher' ? 'Leerkracht' : 'Leerling'}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Onderwerp: <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 text-sm"
            placeholder="Onderwerp van het bericht"
            required
          />
        </div>

        <div className="flex-1 mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bericht: <span className="text-red-500">*</span>
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-64 border border-gray-300 rounded-md p-2 text-sm resize-none"
            placeholder="Typ je bericht hier..."
            required
          />
        </div>

        {attachments.length > 0 && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bijlagen:
            </label>
            <ul className="space-y-2">
              {attachments.map((file, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between bg-gray-50 rounded-md p-2"
                >
                  <span className="text-sm truncate">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeAttachment(index)}
                    className="text-red-500 p-1 hover:bg-gray-200 rounded-full"
                  >
                    <SafeIcon icon={FiX} size={16} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex items-center justify-between">
          <label className="inline-flex items-center cursor-pointer text-blue-600 hover:text-blue-700">
            <SafeIcon icon={FiPaperclip} className="mr-1" />
            <span className="text-sm">Bijlage toevoegen</span>
            <input
              type="file"
              multiple
              onChange={handleAttachment}
              className="hidden"
            />
          </label>

          <button
            type="submit"
            disabled={sending}
            className={`flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${
              sending ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {sending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                <span>Verzenden...</span>
              </>
            ) : (
              <>
                <SafeIcon icon={FiSend} className="mr-2" />
                <span>Verzenden</span>
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  )
}

export default ComposeMessage
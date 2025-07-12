import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SafeIcon from '../common/SafeIcon'
import { useAuth } from '../context/AuthContext'
import { FiHome, FiSearch, FiUser, FiUserPlus, FiMail, FiLogOut } from 'react-icons/fi'
import { messageService } from '../lib/supabase'

function MobileNav() {
  const { isAuthenticated, logout } = useAuth()
  const [unreadCount, setUnreadCount] = useState(0)

  // Laad ongelezen berichten aantal
  useEffect(() => {
    if (isAuthenticated) {
      const loadUnreadCount = async () => {
        try {
          const count = await messageService.getUnreadCount()
          setUnreadCount(count)
        } catch (error) {
          console.error('Fout bij laden ongelezen berichten:', error)
        }
      }
      
      loadUnreadCount()
      
      // Herlaad elke 30 seconden
      const interval = setInterval(loadUnreadCount, 30000)
      return () => clearInterval(interval)
    }
  }, [isAuthenticated])

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Uitloggen mislukt:', error)
    }
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-top p-2">
      <div className="flex justify-around items-center">
        <Link to="/" className="flex flex-col items-center p-2">
          <SafeIcon icon={FiHome} className="text-xl" />
          <span className="text-xs mt-1">Home</span>
        </Link>

        {isAuthenticated ? (
          <>
            <Link to="/messages" className="flex flex-col items-center p-2 relative">
              <SafeIcon icon={FiMail} className="text-xl" />
              <span className="text-xs mt-1">Berichten</span>
              {unreadCount > 0 && (
                <span className="absolute -top-1 right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>
            <Link to="/dashboard" className="flex flex-col items-center p-2">
              <SafeIcon icon={FiUser} className="text-xl" />
              <span className="text-xs mt-1">Dashboard</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex flex-col items-center p-2"
            >
              <SafeIcon icon={FiLogOut} className="text-xl" />
              <span className="text-xs mt-1">Uitloggen</span>
            </button>
          </>
        ) : (
          <>
            <button className="flex flex-col items-center p-2">
              <SafeIcon icon={FiSearch} className="text-xl" />
              <span className="text-xs mt-1">Zoeken</span>
            </button>
            <Link to="/login" className="flex flex-col items-center p-2">
              <SafeIcon icon={FiUser} className="text-xl" />
              <span className="text-xs mt-1">Inloggen</span>
            </Link>
            <Link to="/register" className="flex flex-col items-center p-2">
              <SafeIcon icon={FiUserPlus} className="text-xl" />
              <span className="text-xs mt-1">Registreren</span>
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default MobileNav
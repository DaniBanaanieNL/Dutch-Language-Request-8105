import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SafeIcon from '../common/SafeIcon'
import { useAuth } from '../context/AuthContext'
import { FiHome, FiSearch, FiUser, FiUserPlus, FiMail, FiLogOut } from 'react-icons/fi'
import { messageService } from '../lib/supabase'

function Navbar() {
  const { user, isAuthenticated, logout, profile } = useAuth()
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

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Gebruiker'

  return (
    <nav className="hidden md:flex items-center justify-between p-4 bg-white shadow-md">
      <Link to="/" className="text-2xl font-bold text-blue-600">
        EduPlatform
      </Link>

      <div className="flex items-center space-x-6">
        <Link to="/" className="nav-link">
          <SafeIcon icon={FiHome} className="mr-2" />
          Home
        </Link>

        {isAuthenticated && (
          <Link to="/messages" className="nav-link relative">
            <SafeIcon icon={FiMail} className="mr-2" />
            Berichten
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Link>
        )}

        <Link to="/voor-leerkrachten" className="nav-link">
          Voor Leerkrachten
        </Link>

        <Link to="/voor-leerlingen" className="nav-link">
          Voor Leerlingen
        </Link>

        <button className="nav-link">
          <SafeIcon icon={FiSearch} />
        </button>

        {isAuthenticated ? (
          <div className="flex items-center space-x-4">
            <Link to="/dashboard" className="nav-link">
              <SafeIcon icon={FiUser} className="mr-2" />
              {displayName}
            </Link>
            <button
              onClick={handleLogout}
              className="btn-secondary flex items-center"
            >
              <SafeIcon icon={FiLogOut} className="mr-2" />
              Uitloggen
            </button>
          </div>
        ) : (
          <>
            <Link to="/login" className="btn-primary">
              <SafeIcon icon={FiUser} className="mr-2" />
              Inloggen
            </Link>
            <Link to="/register" className="btn-secondary">
              <SafeIcon icon={FiUserPlus} className="mr-2" />
              Registreren
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar
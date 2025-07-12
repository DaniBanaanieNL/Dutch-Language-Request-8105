import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import SafeIcon from '../common/SafeIcon'
import { useAuth } from '../context/AuthContext'
import { FiBook, FiCalendar, FiUsers, FiMessageSquare, FiLogOut } from 'react-icons/fi'

function Dashboard() {
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Uitloggen mislukt:', error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold"
        >
          Dashboard
        </motion.h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">
            Ingelogd als: <span className="font-medium">{user?.email}</span>
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <SafeIcon icon={FiLogOut} className="mr-2" />
            Uitloggen
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white p-6 rounded-lg shadow-md"
        >
          <SafeIcon icon={FiBook} className="text-3xl text-blue-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Mijn Taken</h2>
          <p className="text-gray-600">Bekijk en beheer je taken</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white p-6 rounded-lg shadow-md"
        >
          <SafeIcon icon={FiCalendar} className="text-3xl text-green-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Planning</h2>
          <p className="text-gray-600">Week- en maandoverzicht</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white p-6 rounded-lg shadow-md"
        >
          <SafeIcon icon={FiUsers} className="text-3xl text-purple-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Mijn Klas</h2>
          <p className="text-gray-600">Klasgenoten en groepen</p>
        </motion.div>

        <Link to="/messages">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <SafeIcon icon={FiMessageSquare} className="text-3xl text-orange-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Berichten</h2>
            <p className="text-gray-600">Communiceer met docenten</p>
            <p className="text-sm text-blue-600 mt-2">3 ongelezen berichten</p>
          </motion.div>
        </Link>
      </div>
    </div>
  )
}

export default Dashboard
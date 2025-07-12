import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import { FiBook, FiCalendar, FiUsers, FiMessageSquare } from 'react-icons/fi';

function Dashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-8"
      >
        Welkom terug, Gebruiker!
      </motion.h1>

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

        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-white p-6 rounded-lg shadow-md"
        >
          <SafeIcon icon={FiMessageSquare} className="text-3xl text-orange-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Berichten</h2>
          <p className="text-gray-600">Communiceer met docenten</p>
        </motion.div>
      </div>
    </div>
  );
}

export default Dashboard;
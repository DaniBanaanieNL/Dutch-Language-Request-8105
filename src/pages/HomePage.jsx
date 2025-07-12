import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import { FiBookOpen, FiUsers, FiAward } from 'react-icons/fi';

function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="hero-section text-center py-20 px-4">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-bold mb-6"
        >
          Leren met plezier
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl mb-8"
        >
          Voor leerkrachten én leerlingen!
        </motion.p>
        <div className="flex justify-center gap-4">
          <Link to="/login" className="btn-primary">
            Log in
          </Link>
          <Link to="/register" className="btn-secondary">
            Word lid
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto p-8">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="feature-card"
        >
          <SafeIcon icon={FiBookOpen} className="text-4xl mb-4 text-blue-500" />
          <h3 className="text-xl font-bold mb-2">Voor Leerkrachten</h3>
          <ul className="text-gray-600">
            <li>✓ Weektaken beheren</li>
            <li>✓ Lesideeën delen</li>
            <li>✓ Voortgang volgen</li>
          </ul>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="feature-card"
        >
          <SafeIcon icon={FiUsers} className="text-4xl mb-4 text-green-500" />
          <h3 className="text-xl font-bold mb-2">Voor Leerlingen</h3>
          <ul className="text-gray-600">
            <li>✓ Interactieve opdrachten</li>
            <li>✓ Leuke spelletjes</li>
            <li>✓ Persoonlijke voortgang</li>
          </ul>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="feature-card"
        >
          <SafeIcon icon={FiAward} className="text-4xl mb-4 text-purple-500" />
          <h3 className="text-xl font-bold mb-2">Voordelen</h3>
          <ul className="text-gray-600">
            <li>✓ Veilige omgeving</li>
            <li>✓ Gebruiksvriendelijk</li>
            <li>✓ Altijd toegankelijk</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}

export default HomePage;
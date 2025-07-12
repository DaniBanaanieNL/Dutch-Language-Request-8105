import React from 'react';
import { Link } from 'react-router-dom';
import SafeIcon from '../common/SafeIcon';
import { FiHome, FiSearch, FiUser, FiUserPlus } from 'react-icons/fi';

function Navbar() {
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
        <Link to="/voor-leerkrachten" className="nav-link">
          Voor Leerkrachten
        </Link>
        <Link to="/voor-leerlingen" className="nav-link">
          Voor Leerlingen
        </Link>
        <button className="nav-link">
          <SafeIcon icon={FiSearch} />
        </button>
        <Link to="/login" className="btn-primary">
          <SafeIcon icon={FiUser} className="mr-2" />
          Inloggen
        </Link>
        <Link to="/register" className="btn-secondary">
          <SafeIcon icon={FiUserPlus} className="mr-2" />
          Registreren
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
import React from 'react';
import { Link } from 'react-router-dom';
import SafeIcon from '../common/SafeIcon';
import { FiHome, FiSearch, FiUser, FiUserPlus } from 'react-icons/fi';

function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-top p-2">
      <div className="flex justify-around items-center">
        <Link to="/" className="flex flex-col items-center p-2">
          <SafeIcon icon={FiHome} className="text-xl" />
          <span className="text-xs mt-1">Home</span>
        </Link>
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
      </div>
    </nav>
  );
}

export default MobileNav;
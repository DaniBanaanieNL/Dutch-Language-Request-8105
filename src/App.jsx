import React from 'react';
import {HashRouter as Router, Routes, Route} from 'react-router-dom';
import Navbar from './components/Navbar';
import MobileNav from './components/MobileNav';
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MessagesPage from './pages/MessagesPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import DevModeErrorDisplay from './components/DevModeErrorDisplay';
import DevModeToggle from './components/DevModeToggle';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <DevModeErrorDisplay />
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>} />
          <Route path="/messages" element={<ProtectedRoute>
            <MessagesPage />
          </ProtectedRoute>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
        <MobileNav />
        <DevModeToggle />
      </div>
    </Router>
  );
}

export default App;
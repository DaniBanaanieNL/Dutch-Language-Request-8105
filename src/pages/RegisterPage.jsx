import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import SafeIcon from '../common/SafeIcon'
import { FiMail, FiLock, FiUser, FiLoader } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import { validatePasswordStrength } from '../utils/passwordUtils'
import PasswordStrengthIndicator from '../components/auth/PasswordStrengthIndicator'

function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: 'student'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPasswordStrength, setShowPasswordStrength] = useState(false)
  
  const navigate = useNavigate()
  const { register } = useAuth()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Valideer wachtwoordsterkte
    const passwordValidation = validatePasswordStrength(formData.password)
    if (!passwordValidation.isValid) {
      setError('Wachtwoord voldoet niet aan de minimale eisen.')
      setLoading(false)
      return
    }

    try {
      await register(formData.email, formData.password)
      // Na registratie wordt een bevestigingsmail verstuurd
      setError('')
      alert('Controleer je e-mail voor de bevestigingslink om je account te activeren.')
      navigate('/login')
    } catch (error) {
      console.error('Registratie error:', error)
      setError(
        error.message === 'User already registered'
          ? 'Dit e-mailadres is al geregistreerd.'
          : 'Er is een fout opgetreden bij het registreren. Probeer het opnieuw.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg"
      >
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Registreren
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Maak een nieuw account aan
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
            <p>{error}</p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="userType" className="block text-sm font-medium text-gray-700 mb-2">
                Ik ben een:
              </label>
              <select
                id="userType"
                name="userType"
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={formData.userType}
                onChange={handleChange}
              >
                <option value="student">Leerling</option>
                <option value="teacher">Leerkracht</option>
              </select>
            </div>

            <div>
              <label htmlFor="email" className="sr-only">E-mailadres</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SafeIcon icon={FiMail} className="text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="appearance-none rounded-lg relative block w-full pl-10 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="E-mailadres"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="sr-only">Wachtwoord</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SafeIcon icon={FiLock} className="text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none rounded-lg relative block w-full pl-10 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Wachtwoord"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setShowPasswordStrength(true)}
                />
              </div>
              {showPasswordStrength && (
                <PasswordStrengthIndicator password={formData.password} />
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <span className="flex items-center">
                  <SafeIcon icon={FiLoader} className="animate-spin mr-2" />
                  Even geduld...
                </span>
              ) : (
                'Account aanmaken'
              )}
            </button>
          </div>

          <div className="text-center">
            <Link to="/login" className="text-sm text-blue-600 hover:text-blue-500">
              Al een account? Log hier in
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default RegisterPage
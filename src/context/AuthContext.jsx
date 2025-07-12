import React, {createContext, useContext, useState, useEffect} from 'react'
import {supabase, profileService} from '../lib/supabase'
import { useDevMode } from './DevModeContext'

const AuthContext = createContext()

export function AuthProvider({children}) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState(null)
  const { logError, isDevMode } = useDevMode()

  useEffect(() => {
    // Check actieve sessie bij het laden
    supabase.auth.getSession().then(({data: {session}}) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        loadUserProfile(session.user)
      }
      setLoading(false)
    })

    // Luister naar auth veranderingen
    const {data: {subscription}} = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        loadUserProfile(session.user)
      } else {
        setProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadUserProfile = async (user) => {
    try {
      const profileData = await profileService.getProfile()
      setProfile(profileData)
    } catch (error) {
      console.error('Fout bij laden profiel:', error)
      if (isDevMode) logError(error)
      
      // Als profiel niet bestaat, maak een basis profiel aan
      try {
        await profileService.upsertProfile({
          email: user.email,
          full_name: user.email.split('@')[0]
        })
        const newProfile = await profileService.getProfile()
        setProfile(newProfile)
      } catch (createError) {
        console.error('Fout bij aanmaken profiel:', createError)
        if (isDevMode) logError(createError)
      }
    }
  }

  const login = async (email, password) => {
    try {
      const {data, error} = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) {
        if (isDevMode) logError(error)
        throw error
      }
      return data
    } catch (error) {
      if (isDevMode) logError(error)
      throw error
    }
  }

  const register = async (email, password, userData = {}) => {
    try {
      const {data, error} = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.full_name || email.split('@')[0],
            user_type: userData.user_type || 'student'
          }
        }
      })
      if (error) {
        if (isDevMode) logError(error)
        throw error
      }
      return data
    } catch (error) {
      if (isDevMode) logError(error)
      throw error
    }
  }

  const logout = async () => {
    try {
      const {error} = await supabase.auth.signOut()
      if (error) {
        if (isDevMode) logError(error)
        throw error
      }
      setProfile(null)
    } catch (error) {
      if (isDevMode) logError(error)
      throw error
    }
  }

  const updateProfile = async (profileData) => {
    try {
      const updatedProfile = await profileService.upsertProfile(profileData)
      setProfile(updatedProfile)
      return updatedProfile
    } catch (error) {
      console.error('Fout bij bijwerken profiel:', error)
      if (isDevMode) logError(error)
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      login,
      register,
      logout,
      updateProfile,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { loginUser, registerUser, fetchCurrentUser } from '../api/auth';
import { showSuccess, showError } from '../utils/toast';
import { useNavigate } from 'react-router-dom';
import { UserProfile } from '../types/api'; // Import UserProfile interface

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<UserProfile>) => void; // Added updateUser function
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('jwtToken'));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        const { user: fetchedUser, error } = await fetchCurrentUser(token);
        if (fetchedUser) {
          setUser(fetchedUser);
        } else if (error) {
          showError(error);
          setToken(null);
          localStorage.removeItem('jwtToken');
        }
      }
      setLoading(false);
    };
    loadUser();
  }, [token]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    const { token: newToken, user: loggedInUser, error } = await loginUser(email, password);
    if (newToken && loggedInUser) {
      localStorage.setItem('jwtToken', newToken);
      setToken(newToken);
      setUser(loggedInUser);
      showSuccess('Logged in successfully!');
      setLoading(false);
      return true;
    } else if (error) {
      showError(error);
    }
    setLoading(false);
    return false;
  };

  const register = async (email: string, password: string) => {
    setLoading(true);
    const { message, error } = await registerUser(email, password);
    if (message) {
      showSuccess(message);
      setLoading(false);
      return true;
    } else if (error) {
      showError(error);
    }
    setLoading(false);
    return false;
  };

  const logout = () => {
    localStorage.removeItem('jwtToken');
    setToken(null);
    setUser(null);
    showSuccess('Logged out successfully!');
    navigate('/login');
  };

  const updateUser = (userData: Partial<UserProfile>) => {
    setUser(prevUser => (prevUser ? { ...prevUser, ...userData } : null));
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
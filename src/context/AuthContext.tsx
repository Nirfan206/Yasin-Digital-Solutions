"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { loginUser, registerUser, fetchCurrentUser, verifyOtp as apiVerifyOtp, requestOtp as apiRequestOtp } from '../api/auth/auth'; // Updated import path and aliased
import { showSuccess, showError } from '../utils/toast';
import { useNavigate } from 'react-router-dom';
import { UserProfile, AuthResponse } from '../types/api'; // Import UserProfile and AuthResponse interface

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>; // Return AuthResponse
  register: (email: string, password: string) => Promise<AuthResponse>; // Return AuthResponse
  verifyOtp: (userId: string, otp: string) => Promise<AuthResponse>; // New function
  requestOtp: (userId: string) => Promise<AuthResponse>; // New function
  logout: () => void;
  updateUser: (userData: Partial<UserProfile>) => void;
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

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    setLoading(true);
    const response = await loginUser(email, password);
    if (response.token && response.user) {
      localStorage.setItem('jwtToken', response.token);
      setToken(response.token);
      setUser(response.user);
      showSuccess('Logged in successfully!');
    } else if (response.error) {
      // Don't show error here if OTP is required, let the component handle it
    }
    setLoading(false);
    return response;
  };

  const register = async (email: string, password: string): Promise<AuthResponse> => {
    setLoading(true);
    const response = await registerUser(email, password);
    if (response.token && response.user) {
      localStorage.setItem('jwtToken', response.token);
      setToken(response.token);
      setUser(response.user);
      showSuccess(response.message || 'Registered successfully!');
    } else if (response.error) {
      // Don't show error here if OTP is required, let the component handle it
    }
    setLoading(false);
    return response;
  };

  const verifyOtp = async (userId: string, otp: string): Promise<AuthResponse> => {
    setLoading(true);
    const response = await apiVerifyOtp(userId, otp);
    if (response.token && response.user) {
      localStorage.setItem('jwtToken', response.token);
      setToken(response.token);
      setUser(response.user);
      showSuccess(response.message || 'OTP verified successfully!');
    } else if (response.error) {
      showError(response.error);
    }
    setLoading(false);
    return response;
  };

  const requestOtp = async (userId: string): Promise<AuthResponse> => {
    setLoading(true);
    const response = await apiRequestOtp(userId);
    if (response.message) {
      showSuccess(response.message);
    } else if (response.error) {
      showError(response.error);
    }
    setLoading(false);
    return response;
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
    <AuthContext.Provider value={{ user, token, loading, login, register, verifyOtp, requestOtp, logout, updateUser }}>
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
"use client";

import { AuthResponse } from '../../types/api';

const API_BASE_URL = 'http://localhost:5000/api/auth';

export const registerUser = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  return response.json();
};

export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  return response.json();
};

export const verifyOtp = async (userId: string, otp: string): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/verify-otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, otp }),
  });
  return response.json();
};

export const requestOtp = async (userId: string): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/request-otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId }),
  });
  return response.json();
};

export const fetchCurrentUser = async (token: string): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.json();
};
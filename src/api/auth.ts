"use client";

// This file will contain functions to interact with your MERN backend's authentication endpoints.
// You will need to replace 'http://localhost:5000' with your actual backend URL.

const API_BASE_URL = 'http://localhost:5000/api/auth'; // Assuming your backend runs on port 5000

interface AuthResponse {
  token?: string;
  user?: {
    id: string;
    email: string;
    role: string;
  };
  message?: string;
  error?: string;
}

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
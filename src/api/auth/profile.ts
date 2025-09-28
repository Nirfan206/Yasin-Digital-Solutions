"use client";

import { ApiResponse, AuthResponse, UserProfile } from '../../types/api';

const API_BASE_URL = 'http://localhost:5000/api/auth';

export const updateUserProfile = async (token: string, name: string): Promise<ApiResponse<UserProfile>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to update profile');
    }
    return { data: data.user, message: data.message }; // Backend might return { user, message }
  } catch (error: any) {
    return { error: error.message || 'An unknown error occurred' };
  }
};

export const updateUserPassword = async (token: string, currentPassword: string, newPassword: string): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to update password');
    }
    return { message: data.message };
  } catch (error: any) {
    return { error: error.message || 'An unknown error occurred' };
  }
};
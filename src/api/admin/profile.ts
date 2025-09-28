"use client";

import { ApiResponse, UserProfile } from '../../types/api';

const API_BASE_URL = 'http://localhost:5000/api/admin';

export const updateAdminProfile = async (token: string, name: string): Promise<ApiResponse<UserProfile>> => {
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
      throw new Error(data.error || 'Failed to update admin profile');
    }
    return { data };
  } catch (error: any) {
    return { error: error.message || 'An unknown error occurred' };
  }
};
"use client";

import { ApiResponse, Client } from '../../types/api';

const API_BASE_URL = 'http://localhost:5000/api/admin';

export const fetchAllClients = async (token: string): Promise<ApiResponse<Client[]>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/clients`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch all clients');
    }
    return { data };
  } catch (error: any) {
    return { error: error.message || 'An unknown error occurred' };
  }
};

export const createClient = async (token: string, name: string, email: string, status: 'Active' | 'Inactive'): Promise<ApiResponse<Client>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/clients`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ name, email, status }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to create client');
    }
    return { data };
  } catch (error: any) {
    return { error: error.message || 'An unknown error occurred' };
  }
};

export const updateClient = async (token: string, clientId: string, name: string, email: string, status: 'Active' | 'Inactive'): Promise<ApiResponse<Client>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/clients/${clientId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ name, email, status }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to update client');
    }
    return { data };
  } catch (error: any) {
    return { error: error.message || 'An unknown error occurred' };
  }
};

export const deleteClient = async (token: string, clientId: string): Promise<ApiResponse<{ message: string }>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/clients/${clientId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to delete client');
    }
    return { data };
  } catch (error: any) {
    return { error: error.message || 'An unknown error occurred' };
  }
};
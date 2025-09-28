"use client";

// This file will contain functions to interact with your MERN backend's client-specific endpoints.
// You will need to replace 'http://localhost:5000' with your actual backend URL.

const API_BASE_URL = 'http://localhost:5000/api/client'; // Assuming your backend runs on port 5000

interface Order {
  _id: string; // Backend typically uses _id for MongoDB
  serviceType: string;
  requirements: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
  orderDate: string;
  clientId: string; // Assuming orders are linked to a client
}

interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

export const fetchClientOrders = async (token: string): Promise<ApiResponse<Order[]>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch client orders');
    }
    return { data };
  } catch (error: any) {
    return { error: error.message || 'An unknown error occurred' };
  }
};

export const createClientOrder = async (token: string, serviceType: string, requirements: string): Promise<ApiResponse<Order>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ serviceType, requirements }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to create order');
    }
    return { data };
  } catch (error: any) {
    return { error: error.message || 'An unknown error occurred' };
  }
};

// Placeholder for fetching client subscriptions (will be implemented later)
export const fetchClientSubscriptions = async (token: string): Promise<ApiResponse<any[]>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/subscriptions`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch client subscriptions');
    }
    return { data };
  } catch (error: any) {
    return { error: error.message || 'An unknown error occurred' };
  }
};
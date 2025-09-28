"use client";

import { ApiResponse, UserProfile, Order, Client, Employee } from '../types/api';

// This file will contain functions to interact with your MERN backend's admin-specific endpoints.
// You will need to replace 'http://localhost:5000' with your actual backend URL.

const API_BASE_URL = 'http://localhost:5000/api/admin'; // Assuming your backend runs on port 5000

// Admin Profile
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

// Order Management
export const fetchAllOrders = async (token: string): Promise<ApiResponse<Order[]>> => {
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
      throw new Error(data.error || 'Failed to fetch all orders');
    }
    return { data };
  } catch (error: any) {
    return { error: error.message || 'An unknown error occurred' };
  }
};

export const updateOrderStatus = async (token: string, orderId: string, newStatus: Order['status']): Promise<ApiResponse<Order>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ status: newStatus }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to update order status');
    }
    return { data };
  } catch (error: any) {
    return { error: error.message || 'An unknown error occurred' };
  }
};

// Client Management
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

// Employee Management
export const fetchAllEmployees = async (token: string): Promise<ApiResponse<Employee[]>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/employees`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch all employees');
    }
    return { data };
  } catch (error: any) {
    return { error: error.message || 'An unknown error occurred' };
  }
};

export const createEmployee = async (token: string, name: string, email: string, role: string, status: 'Active' | 'Inactive'): Promise<ApiResponse<Employee>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/employees`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ name, email, role, status }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to create employee');
    }
    return { data };
  } catch (error: any) {
    return { error: error.message || 'An unknown error occurred' };
  }
};

export const updateEmployee = async (token: string, employeeId: string, name: string, email: string, role: string, status: 'Active' | 'Inactive'): Promise<ApiResponse<Employee>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/employees/${employeeId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ name, email, role, status }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to update employee');
    }
    return { data };
  } catch (error: any) {
    return { error: error.message || 'An unknown error occurred' };
  }
};

export const deleteEmployee = async (token: string, employeeId: string): Promise<ApiResponse<{ message: string }>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/employees/${employeeId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to delete employee');
    }
    return { data };
  } catch (error: any) {
    return { error: error.message || 'An unknown error occurred' };
  }
};
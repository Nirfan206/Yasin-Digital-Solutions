"use client";

import { ApiResponse, UserProfile, Order, Client, Employee, Job, Subscription } from '../types/api';

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

// Job Management
export const fetchAllJobs = async (token: string): Promise<ApiResponse<Job[]>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/jobs`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch all jobs');
    }
    return { data };
  } catch (error: any) {
    return { error: error.message || 'An unknown error occurred' };
  }
};

export const createJob = async (
  token: string,
  title: string,
  client: string,
  dueDate: string,
  priority: Job['priority'],
  status: Job['status'],
  employeeId?: string
): Promise<ApiResponse<Job>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ title, client, dueDate, priority, status, employeeId }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to create job');
    }
    return { data };
  } catch (error: any) {
    return { error: error.message || 'An unknown error occurred' };
  }
};

export const updateJob = async (
  token: string,
  jobId: string,
  title: string,
  client: string,
  dueDate: string,
  priority: Job['priority'],
  status: Job['status'],
  employeeId?: string
): Promise<ApiResponse<Job>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ title, client, dueDate, priority, status, employeeId }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to update job');
    }
    return { data };
  } catch (error: any) {
    return { error: error.message || 'An unknown error occurred' };
  }
};

export const deleteJob = async (token: string, jobId: string): Promise<ApiResponse<{ message: string }>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to delete job');
    }
    return { data };
  } catch (error: any) {
    return { error: error.message || 'An unknown error occurred' };
  }
};

// Subscription Management (New)
export const fetchAllSubscriptions = async (token: string): Promise<ApiResponse<Subscription[]>> => {
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
      throw new Error(data.error || 'Failed to fetch all subscriptions');
    }
    return { data };
  } catch (error: any) {
    return { error: error.message || 'An unknown error occurred' };
  }
};

export const createSubscription = async (
  token: string,
  clientId: string,
  serviceName: string,
  startDate: string,
  nextRenewalDate: string,
  status: Subscription['status']
): Promise<ApiResponse<Subscription>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/subscriptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ clientId, serviceName, startDate, nextRenewalDate, status }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to create subscription');
    }
    return { data };
  } catch (error: any) {
    return { error: error.message || 'An unknown error occurred' };
  }
};

export const updateSubscription = async (
  token: string,
  subscriptionId: string,
  clientId: string,
  serviceName: string,
  startDate: string,
  nextRenewalDate: string,
  status: Subscription['status']
): Promise<ApiResponse<Subscription>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/subscriptions/${subscriptionId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ clientId, serviceName, startDate, nextRenewalDate, status }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to update subscription');
    }
    return { data };
  } catch (error: any) {
    return { error: error.message || 'An unknown error occurred' };
  }
};

export const deleteSubscription = async (token: string, subscriptionId: string): Promise<ApiResponse<{ message: string }>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/subscriptions/${subscriptionId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to delete subscription');
    }
    return { data };
  } catch (error: any) {
    return { error: error.message || 'An unknown error occurred' };
  }
};


// New functions for Admin Overview
export const fetchAdminOverviewData = async (token: string): Promise<ApiResponse<{ totalClients: number; totalEmployees: number; totalOrders: number; totalJobs: number; totalSubscriptions: number }>> => {
  try {
    // In a real backend, this would be a single endpoint returning all counts.
    // For now, we'll simulate by fetching all and getting the length.
    const [clientsResponse, employeesResponse, ordersResponse, jobsResponse, subscriptionsResponse] = await Promise.all([
      fetch(`${API_BASE_URL}/clients`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      }),
      fetch(`${API_BASE_URL}/employees`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      }),
      fetch(`${API_BASE_URL}/orders`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      }),
      fetch(`${API_BASE_URL}/jobs`, { // Fetch all jobs for overview
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      }),
      fetch(`${API_BASE_URL}/subscriptions`, { // Fetch all subscriptions for overview
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      }),
    ]);

    const clientsData = await clientsResponse.json();
    const employeesData = await employeesResponse.json();
    const ordersData = await ordersResponse.json();
    const jobsData = await jobsResponse.json();
    const subscriptionsData = await subscriptionsResponse.json();

    if (!clientsResponse.ok || !employeesResponse.ok || !ordersResponse.ok || !jobsResponse.ok || !subscriptionsResponse.ok) {
      throw new Error(clientsData.error || employeesData.error || ordersData.error || jobsData.error || subscriptionsData.error || 'Failed to fetch overview data');
    }

    return {
      data: {
        totalClients: clientsData.length,
        totalEmployees: employeesData.length,
        totalOrders: ordersData.length,
        totalJobs: jobsData.length,
        totalSubscriptions: subscriptionsData.length, // Include total subscriptions
      },
    };
  } catch (error: any) {
    return { error: error.message || 'An unknown error occurred' };
  }
};
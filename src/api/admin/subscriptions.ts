"use client";

import { ApiResponse, Subscription } from '../../types/api';

const API_BASE_URL = 'http://localhost:5000/api/admin';

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
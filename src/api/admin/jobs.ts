"use client";

import { ApiResponse, Job } from '../../types/api';

const API_BASE_URL = 'http://localhost:5000/api/admin';

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
  employeeId?: string,
  orderId?: string // New parameter
): Promise<ApiResponse<Job>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ title, client, dueDate, priority, status, employeeId, orderId }), // Include orderId
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
"use client";

import { ApiResponse, Job } from '../types/api';

// This file will contain functions to interact with your MERN backend's employee-specific endpoints.
// You will need to replace 'http://localhost:5000' with your actual backend URL.

const API_BASE_URL = 'http://localhost:5000/api/employee'; // Assuming your backend runs on port 5000

export const fetchAssignedJobs = async (token: string): Promise<ApiResponse<Job[]>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/jobs/assigned`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch assigned jobs');
    }
    return { data };
  } catch (error: any) {
    return { error: error.message || 'An unknown error occurred' };
  }
};

export const updateJobStatus = async (token: string, jobId: string, newStatus: Job['status']): Promise<ApiResponse<Job>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ status: newStatus }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to update job status');
    }
    return { data };
  } catch (error: any) {
    return { error: error.message || 'An unknown error occurred' };
  }
};

export const fetchCompletedJobs = async (token: string): Promise<ApiResponse<Job[]>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/jobs/completed`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch completed jobs');
    }
    return { data };
  } catch (error: any) {
    return { error: error.message || 'An unknown error occurred' };
  }
};
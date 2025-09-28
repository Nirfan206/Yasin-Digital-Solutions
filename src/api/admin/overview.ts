"use client";

import { ApiResponse, Order, Client, Employee, Job, Subscription } from '../../types/api';

const API_BASE_URL = 'http://localhost:5000/api/admin';

export const fetchAdminOverviewData = async (token: string): Promise<ApiResponse<{
  totalClients: number;
  totalEmployees: number;
  totalOrders: number;
  orderStatusCounts: { [key in Order['status']]: number };
  totalJobs: number;
  jobStatusCounts: { [key in Job['status']]: number };
  totalSubscriptions: number;
}>> => {
  try {
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
      fetch(`${API_BASE_URL}/jobs`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      }),
      fetch(`${API_BASE_URL}/subscriptions`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      }),
    ]);

    const clientsData: Client[] = await clientsResponse.json();
    const employeesData: Employee[] = await employeesResponse.json();
    const ordersData: Order[] = await ordersResponse.json();
    const jobsData: Job[] = await jobsResponse.json();
    const subscriptionsData: Subscription[] = await subscriptionsResponse.json();

    if (!clientsResponse.ok || !employeesResponse.ok || !ordersResponse.ok || !jobsResponse.ok || !subscriptionsResponse.ok) {
      throw new Error(
        clientsData.error || employeesData.error || ordersData.error || jobsData.error || subscriptionsData.error || 'Failed to fetch overview data'
      );
    }

    const orderStatusCounts: { [key in Order['status']]: number } = {
      'Pending': 0,
      'In Progress': 0,
      'Under Review': 0,
      'Completed': 0,
      'Cancelled': 0,
    };
    ordersData.forEach(order => {
      if (orderStatusCounts[order.status] !== undefined) {
        orderStatusCounts[order.status]++;
      }
    });

    const jobStatusCounts: { [key in Job['status']]: number } = {
      'Assigned': 0,
      'In Progress': 0,
      'Under Review': 0,
      'Completed': 0,
    };
    jobsData.forEach(job => {
      if (jobStatusCounts[job.status] !== undefined) {
        jobStatusCounts[job.status]++;
      }
    });

    return {
      data: {
        totalClients: clientsData.length,
        totalEmployees: employeesData.length,
        totalOrders: ordersData.length,
        orderStatusCounts,
        totalJobs: jobsData.length,
        jobStatusCounts,
        totalSubscriptions: subscriptionsData.length,
      },
    };
  } catch (error: any) {
    return { error: error.message || 'An unknown error occurred' };
  }
};
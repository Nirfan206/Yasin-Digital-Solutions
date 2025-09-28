"use client";

// src/types/api.ts

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  role: string;
}

export interface AuthResponse {
  token?: string;
  user?: UserProfile;
  message?: string;
  error?: string;
}

export interface Order {
  _id: string; // Backend typically uses _id for MongoDB
  serviceType: string;
  requirements: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled' | 'Under Review';
  orderDate: string;
  clientId: string; // Made non-optional for notification purposes
  clientName?: string; // Optional, for admin view
  clientEmail?: string; // Optional, for admin view
}

export interface Job {
  _id: string;
  title: string;
  client: string; // Client name
  dueDate: string;
  status: 'Assigned' | 'In Progress' | 'Under Review' | 'Completed';
  priority: 'High' | 'Medium' | 'Low';
  employeeId?: string; // Optional, for employee-specific jobs
  completionDate?: string; // Optional, for completed jobs
  feedback?: string; // Optional feedback field
}

export interface Subscription {
  _id: string;
  serviceName: string;
  startDate: string;
  nextRenewalDate: string;
  status: 'Active' | 'Expired' | 'Pending';
}

export interface Client {
  id: string;
  name: string;
  email: string;
  status: 'Active' | 'Inactive';
  registeredDate: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: string; // e.g., 'employee', 'manager'
  status: 'Active' | 'Inactive';
  hiredDate: string;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string; // Optional link to a related page
}

export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}
"use client";

import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { User, ListOrdered, Users, Building2 } from 'lucide-react';

const adminNav = [
  { path: '/admin/dashboard/profile', label: 'Profile', icon: User },
  { path: '/admin/dashboard/order-management', label: 'Order Management', icon: ListOrdered },
  { path: '/admin/dashboard/clients', label: 'Clients', icon: Users },
  { path: '/admin/dashboard/employees', label: 'Employees', icon: Building2 },
];

const AdminDashboard = () => {
  return (
    <DashboardLayout title="Admin Dashboard" sidebarNav={adminNav}>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Welcome, Admin!</h2>
        <p className="text-gray-600">This is your admin dashboard. You have full control over orders, clients, and employees.</p>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
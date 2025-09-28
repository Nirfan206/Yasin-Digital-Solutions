"use client";

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { User, ListOrdered, Users, Building2 } from 'lucide-react';
import UserProfileForm from '../../components/UserProfileForm'; // Import the new generic profile form
import AdminOrderManagement from './AdminOrderManagement';
import AdminClients from './AdminClients';
import AdminEmployees from './AdminEmployees';

const adminNav = [
  { path: 'profile', label: 'Profile', icon: User },
  { path: 'order-management', label: 'Order Management', icon: ListOrdered },
  { path: 'clients', label: 'Clients', icon: Users },
  { path: 'employees', label: 'Employees', icon: Building2 },
];

const AdminDashboard = () => {
  return (
    <DashboardLayout title="Admin Dashboard" sidebarNav={adminNav}>
      <Routes>
        <Route index element={<Navigate to="profile" replace />} />
        <Route path="profile" element={<UserProfileForm title="Your Admin Profile" />} /> {/* Use generic form */}
        <Route path="order-management" element={<AdminOrderManagement />} />
        <Route path="clients" element={<AdminClients />} />
        <Route path="employees" element={<AdminEmployees />} />
      </Routes>
    </DashboardLayout>
  );
};

export default AdminDashboard;
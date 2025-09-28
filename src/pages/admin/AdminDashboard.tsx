"use client";

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { User, ListOrdered, Users, Building2, LayoutDashboard, Briefcase, CalendarCheck } from 'lucide-react'; // Import CalendarCheck icon
import UserProfileForm from '../../components/UserProfileForm';
import AdminOrderManagement from './AdminOrderManagement';
import AdminClients from './AdminClients';
import AdminEmployees from './AdminEmployees';
import AdminOverview from './AdminOverview';
import AdminJobManagement from './AdminJobManagement';
import AdminSubscriptionManagement from './AdminSubscriptionManagement'; // Import AdminSubscriptionManagement
import { updateAdminProfile } from '../../api/admin';

const adminNav = [
  { path: 'overview', label: 'Overview', icon: LayoutDashboard },
  { path: 'profile', label: 'Profile', icon: User },
  { path: 'order-management', label: 'Order Management', icon: ListOrdered },
  { path: 'job-management', label: 'Job Management', icon: Briefcase },
  { path: 'subscription-management', label: 'Subscription Management', icon: CalendarCheck }, // Added Subscription Management
  { path: 'clients', label: 'Clients', icon: Users },
  { path: 'employees', label: 'Employees', icon: Building2 },
];

const AdminDashboard = () => {
  return (
    <DashboardLayout title="Admin Dashboard" sidebarNav={adminNav}>
      <Routes>
        <Route index element={<Navigate to="overview" replace />} />
        <Route path="overview" element={<AdminOverview />} />
        <Route path="profile" element={<UserProfileForm title="Your Admin Profile" onUpdateProfile={updateAdminProfile} />} />
        <Route path="order-management" element={<AdminOrderManagement />} />
        <Route path="job-management" element={<AdminJobManagement />} />
        <Route path="subscription-management" element={<AdminSubscriptionManagement />} /> {/* New route for AdminSubscriptionManagement */}
        <Route path="clients" element={<AdminClients />} />
        <Route path="employees" element={<AdminEmployees />} />
      </Routes>
    </DashboardLayout>
  );
};

export default AdminDashboard;
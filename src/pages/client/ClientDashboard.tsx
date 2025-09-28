"use client";

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { User, ListOrdered, CalendarCheck, LayoutDashboard } from 'lucide-react';
import UserProfileForm from '../../components/UserProfileForm';
import ClientOrders from './ClientOrders';
import ClientSubscriptions from './ClientSubscriptions';
import ClientOverview from './ClientOverview';
import { updateUserProfile } from '../../api/auth'; // Import the specific update function

const clientNav = [
  { path: 'overview', label: 'Overview', icon: LayoutDashboard },
  { path: 'profile', label: 'Profile', icon: User },
  { path: 'orders', label: 'Orders', icon: ListOrdered },
  { path: 'subscriptions', label: 'Subscriptions', icon: CalendarCheck },
];

const ClientDashboard = () => {
  return (
    <DashboardLayout title="Client Dashboard" sidebarNav={clientNav}>
      <Routes>
        <Route index element={<Navigate to="overview" replace />} />
        <Route path="overview" element={<ClientOverview />} />
        <Route path="profile" element={<UserProfileForm title="Your Profile" onUpdateProfile={updateUserProfile} />} /> {/* Pass updateUserProfile */}
        <Route path="orders" element={<ClientOrders />} />
        <Route path="subscriptions" element={<ClientSubscriptions />} />
      </Routes>
    </DashboardLayout>
  );
};

export default ClientDashboard;
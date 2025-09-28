"use client";

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { User, ListOrdered, CalendarCheck } from 'lucide-react';
import ClientProfile from './ClientProfile';
import ClientOrders from './ClientOrders';
import ClientSubscriptions from './ClientSubscriptions';

const clientNav = [
  { path: 'profile', label: 'Profile', icon: User },
  { path: 'orders', label: 'Orders', icon: ListOrdered },
  { path: 'subscriptions', label: 'Subscriptions', icon: CalendarCheck },
];

const ClientDashboard = () => {
  return (
    <DashboardLayout title="Client Dashboard" sidebarNav={clientNav}>
      <Routes>
        <Route index element={<Navigate to="profile" replace />} /> {/* Default route */}
        <Route path="profile" element={<ClientProfile />} />
        <Route path="orders" element={<ClientOrders />} />
        <Route path="subscriptions" element={<ClientSubscriptions />} />
        {/* Add more client-specific routes here */}
      </Routes>
    </DashboardLayout>
  );
};

export default ClientDashboard;
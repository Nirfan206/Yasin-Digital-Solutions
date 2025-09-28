"use client";

import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { User, Briefcase, CalendarCheck } from 'lucide-react';

const employeeNav = [
  { path: '/employee/dashboard/profile', label: 'Profile', icon: User },
  { path: '/employee/dashboard/assigned-jobs', label: 'Assigned Jobs', icon: Briefcase },
  { path: '/employee/dashboard/completed-jobs', label: 'Completed Jobs', icon: CalendarCheck },
];

const EmployeeDashboard = () => {
  return (
    <DashboardLayout title="Employee Dashboard" sidebarNav={employeeNav}>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Welcome, Employee!</h2>
        <p className="text-gray-600">This is your employee dashboard. Manage your assigned and completed jobs here.</p>
      </div>
    </DashboardLayout>
  );
};

export default EmployeeDashboard;
"use client";

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { User, Briefcase, CalendarCheck } from 'lucide-react';
import EmployeeProfile from './EmployeeProfile';
import EmployeeAssignedJobs from './EmployeeAssignedJobs';
import EmployeeCompletedJobs from './EmployeeCompletedJobs';

const employeeNav = [
  { path: 'profile', label: 'Profile', icon: User },
  { path: 'assigned-jobs', label: 'Assigned Jobs', icon: Briefcase },
  { path: 'completed-jobs', label: 'Completed Jobs', icon: CalendarCheck },
];

const EmployeeDashboard = () => {
  return (
    <DashboardLayout title="Employee Dashboard" sidebarNav={employeeNav}>
      <Routes>
        <Route index element={<Navigate to="profile" replace />} /> {/* Default route */}
        <Route path="profile" element={<EmployeeProfile />} />
        <Route path="assigned-jobs" element={<EmployeeAssignedJobs />} />
        <Route path="completed-jobs" element={<EmployeeCompletedJobs />} />
        {/* Add more employee-specific routes here */}
      </Routes>
    </DashboardLayout>
  );
};

export default EmployeeDashboard;
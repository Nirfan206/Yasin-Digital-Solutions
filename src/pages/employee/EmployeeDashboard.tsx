"use client";

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { User, Briefcase, CalendarCheck } from 'lucide-react';
import UserProfileForm from '../../components/UserProfileForm'; // Import the new generic profile form
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
        <Route index element={<Navigate to="profile" replace />} />
        <Route path="profile" element={<UserProfileForm title="Your Employee Profile" />} /> {/* Use generic form */}
        <Route path="assigned-jobs" element={<EmployeeAssignedJobs />} />
        <Route path="completed-jobs" element={<EmployeeCompletedJobs />} />
      </Routes>
    </DashboardLayout>
  );
};

export default EmployeeDashboard;
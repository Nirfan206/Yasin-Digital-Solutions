"use client";

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { User, Briefcase, CalendarCheck, LayoutDashboard } from 'lucide-react'; // Import LayoutDashboard icon
import UserProfileForm from '../../components/UserProfileForm';
import EmployeeAssignedJobs from './EmployeeAssignedJobs';
import EmployeeCompletedJobs from './EmployeeCompletedJobs';
import EmployeeOverview from './EmployeeOverview'; // Import EmployeeOverview
import { updateUserProfile } from '../../api/auth/profile'; // Import the specific update function from new file

const employeeNav = [
  { path: 'overview', label: 'Overview', icon: LayoutDashboard }, // Added Overview
  { path: 'profile', label: 'Profile', icon: User },
  { path: 'assigned-jobs', label: 'Assigned Jobs', icon: Briefcase },
  { path: 'completed-jobs', label: 'Completed Jobs', icon: CalendarCheck },
];

const EmployeeDashboard = () => {
  return (
    <DashboardLayout title="Employee Dashboard" sidebarNav={employeeNav}>
      <Routes>
        <Route index element={<Navigate to="overview" replace />} />
        <Route path="overview" element={<EmployeeOverview />} /> {/* New route for EmployeeOverview */}
        <Route path="profile" element={<UserProfileForm title="Your Employee Profile" onUpdateProfile={updateUserProfile} />} /> {/* Pass updateUserProfile */}
        <Route path="assigned-jobs" element={<EmployeeAssignedJobs />} />
        <Route path="completed-jobs" element={<EmployeeCompletedJobs />} />
      </Routes>
    </DashboardLayout>
  );
};

export default EmployeeDashboard;
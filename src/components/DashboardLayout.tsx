"use client";

import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Briefcase, Settings, LayoutDashboard, ListOrdered, CalendarCheck, Users, Building2, LucideIcon } from 'lucide-react'; // Import LucideIcon
import { Button } from './ui/button'; // Import shadcn/ui Button

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  sidebarNav: { path: string; label: string; icon: LucideIcon }[]; // Changed icon type to LucideIcon
}

const DashboardLayout = ({ children, title, sidebarNav }: DashboardLayoutProps) => {
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col p-4">
        <div className="text-2xl font-bold mb-8 text-center">
          <Link to="/" className="text-white hover:text-blue-400">YDS</Link>
        </div>
        <nav className="flex-grow">
          <ul className="space-y-2">
            {sidebarNav.map((item) => (
              <li key={item.path}>
                <Button
                  asChild // Renders the Link component inside the Button
                  variant="ghost"
                  className="w-full justify-start flex items-center space-x-3 p-3 rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
                >
                  <Link to={item.path}>
                    <item.icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                </Button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-auto pt-4 border-t border-gray-700">
          {user && (
            <div className="text-sm text-gray-400 mb-2">
              Logged in as: <span className="font-medium text-white">{user.email}</span>
            </div>
          )}
          <Button
            onClick={logout}
            className="w-full flex items-center justify-center space-x-2 p-3 rounded-md bg-red-600 hover:bg-red-700 text-white transition-colors duration-200"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm p-6">
          <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
        </header>
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
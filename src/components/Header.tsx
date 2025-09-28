"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard } from 'lucide-react'; // Importing icons
import { Button } from './ui/button'; // Import shadcn/ui Button

const Header = () => {
  const { user, logout } = useAuth();

  const getDashboardLink = () => {
    if (!user) return '/'; // Should not happen if user is null, but as a fallback
    switch (user.role) {
      case 'client':
        return '/client/dashboard';
      case 'employee':
        return '/employee/dashboard';
      case 'admin':
        return '/admin/dashboard';
      default:
        return '/';
    }
  };

  return (
    <header className="bg-white shadow-sm py-4 px-6 flex justify-between items-center">
      <div className="text-2xl font-bold text-blue-700">
        <Link to="/">Yasin Digital Solutions</Link>
      </div>
      <nav>
        <ul className="flex space-x-6 items-center">
          <li>
            <Link to="/" className="text-gray-700 hover:text-blue-700 font-medium">Home</Link>
          </li>
          <li>
            <Link to="/services" className="text-gray-700 hover:text-blue-700 font-medium">Services</Link>
          </li>
          {user ? (
            <>
              <li>
                <Link to={getDashboardLink()} className="text-gray-700 hover:text-blue-700 font-medium flex items-center space-x-1">
                  <LayoutDashboard size={18} />
                  <span>Dashboard</span>
                </Link>
              </li>
              <li>
                <Button
                  variant="ghost" // Use ghost variant to match previous link-like appearance
                  onClick={logout}
                  className="text-gray-700 hover:text-blue-700 font-medium flex items-center space-x-1"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </Button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/register" className="text-gray-700 hover:text-blue-700 font-medium">Register</Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-700 hover:text-blue-700 font-medium">Login</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
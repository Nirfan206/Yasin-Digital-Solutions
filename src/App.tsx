"use client";

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import Register from './pages/Register';
import Login from './pages/Login';
import ContactUs from './pages/ContactUs'; // New import
import { AuthProvider } from './context/AuthContext';
import ToastProvider from './components/ToastProvider';
import ProtectedRoute from './components/ProtectedRoute';
import { NotificationProvider } from './components/NotificationProvider';

// Dashboard Pages
import ClientDashboard from './pages/client/ClientDashboard';
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';

import './index.css';

function App() {
  return (
    <Router>
      <ToastProvider />
      <AuthProvider>
        <NotificationProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/services" element={<Services />} />
                <Route path="/contact" element={<ContactUs />} /> {/* New route */}
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />

                {/* Protected Routes for Dashboards */}
                <Route element={<ProtectedRoute allowedRoles={['client']} />}>
                  <Route path="/client/dashboard/*" element={<ClientDashboard />} />
                </Route>
                <Route element={<ProtectedRoute allowedRoles={['employee']} />}>
                  <Route path="/employee/dashboard/*" element={<EmployeeDashboard />} />
                </Route>
                <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                  <Route path="/admin/dashboard/*" element={<AdminDashboard />} />
                </Route>

                {/* Add more specific dashboard sub-routes later */}
              </Routes>
            </main>
            <Footer />
          </div>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
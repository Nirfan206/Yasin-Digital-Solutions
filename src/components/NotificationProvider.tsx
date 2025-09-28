"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { Notification } from '../types/api';
import { showError } from '../utils/toast';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  fetchNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const { user, token } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Simulate fetching notifications from an API
  const fetchNotifications = useCallback(async () => {
    if (!user || !token) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    setLoading(true);
    try {
      // In a real application, this would be an API call to your backend
      // For now, we'll use mock data
      const mockNotifications: Notification[] = [
        { id: '1', userId: user.id, message: 'Your order #12345 is now in progress.', read: false, createdAt: new Date().toISOString(), link: '/client/dashboard/orders' },
        { id: '2', userId: user.id, message: 'Welcome to Yasin Digital Solutions!', read: true, createdAt: new Date(Date.now() - 86400000).toISOString() },
        { id: '3', userId: user.id, message: 'New job assigned: Website Redesign for Acme Corp.', read: false, createdAt: new Date().toISOString(), link: '/employee/dashboard/assigned-jobs' },
        { id: '4', userId: user.id, message: 'Client John Doe registered.', read: false, createdAt: new Date().toISOString(), link: '/admin/dashboard/clients' },
        { id: '5', userId: user.id, message: 'Your subscription for "Premium Support" will renew in 7 days.', read: false, createdAt: new Date().toISOString(), link: '/client/dashboard/subscriptions' },
      ];

      // Filter notifications relevant to the current user's role
      const userNotifications = mockNotifications.filter(notif => {
        if (notif.userId === user.id) return true; // Direct notifications
        if (user.role === 'admin' && notif.link?.startsWith('/admin')) return true;
        if (user.role === 'employee' && notif.link?.startsWith('/employee')) return true;
        if (user.role === 'client' && notif.link?.startsWith('/client')) return true;
        return false;
      });

      setNotifications(userNotifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      setUnreadCount(userNotifications.filter(n => !n.read).length);
    } catch (error) {
      showError('Failed to fetch notifications.');
    } finally {
      setLoading(false);
    }
  }, [user, token]);

  useEffect(() => {
    fetchNotifications();
    // Optionally, poll for new notifications every X seconds
    const interval = setInterval(fetchNotifications, 60000); // Fetch every minute
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
    // In a real app, you'd send an API call to mark as read on the backend
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
    // In a real app, you'd send an API call to mark all as read on the backend
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead, fetchNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
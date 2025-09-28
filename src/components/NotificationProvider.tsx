"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { Notification } from '../types/api';
import { showError } from '../utils/toast';
import { fetchUserNotifications, markNotificationAsReadApi, markAllNotificationsAsReadApi } from '../api/notifications'; // Import new API functions

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
  const [loading, setLoading] = useState(false); // Keep loading state for fetching

  const fetchNotifications = useCallback(async () => {
    if (!user || !token) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await fetchUserNotifications(token);
      if (data) {
        setNotifications(data);
        setUnreadCount(data.filter(n => !n.read).length);
      } else if (error) {
        showError(error);
      }
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

  const markAsRead = async (id: string) => {
    if (!token) {
      showError('You must be logged in to mark notifications as read.');
      return;
    }
    try {
      const { data, error } = await markNotificationAsReadApi(token, id);
      if (data) {
        setNotifications(prev =>
          prev.map(n => (n._id === id ? { ...n, read: true } : n))
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      } else if (error) {
        showError(error);
      }
    } catch (error) {
      showError('Failed to mark notification as read.');
    }
  };

  const markAllAsRead = async () => {
    if (!token) {
      showError('You must be logged in to mark all notifications as read.');
      return;
    }
    try {
      const { data, error } = await markAllNotificationsAsReadApi(token);
      if (data) {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
        showSuccess(data.message || 'All notifications marked as read.');
      } else if (error) {
        showError(error);
      }
    } catch (error) {
      showError('Failed to mark all notifications as read.');
    }
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
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { ListOrdered, CalendarCheck, ClipboardList } from 'lucide-react'; // Changed DollarSign to ClipboardList
import { useAuth } from '../../context/AuthContext';
import { fetchClientOrders, fetchClientSubscriptions } from '../../api/client';
import { showError } from '../../utils/toast';
import { Order, Subscription } from '../../types/api';

const ClientOverview = () => {
  const { token } = useAuth();
  const [totalOrders, setTotalOrders] = useState(0);
  const [activeSubscriptions, setActiveSubscriptions] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const { data: ordersData, error: ordersError } = await fetchClientOrders(token);
        if (ordersData) {
          setTotalOrders(ordersData.length);
          setPendingOrders(ordersData.filter(order => order.status === 'Pending' || order.status === 'In Progress' || order.status === 'Under Review').length);
        } else if (ordersError) {
          showError(ordersError);
        }

        const { data: subscriptionsData, error: subscriptionsError } = await fetchClientSubscriptions(token);
        if (subscriptionsData) {
          setActiveSubscriptions(subscriptionsData.filter(sub => sub.status === 'Active').length);
        } else if (subscriptionsError) {
          showError(subscriptionsError);
        }
      } catch (err) {
        showError('Failed to fetch dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-[200px]">Loading client overview...</div>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          <ListOrdered className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalOrders}</div>
          <p className="text-xs text-muted-foreground">
            You have placed {totalOrders} orders in total.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
          <CalendarCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeSubscriptions}</div>
          <p className="text-xs text-muted-foreground">
            You have {activeSubscriptions} active subscriptions.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
          <ClipboardList className="h-4 w-4 text-muted-foreground" /> {/* Changed icon here */}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingOrders}</div>
          <p className="text-xs text-muted-foreground">
            {pendingOrders} orders are currently pending review or in progress.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientOverview;
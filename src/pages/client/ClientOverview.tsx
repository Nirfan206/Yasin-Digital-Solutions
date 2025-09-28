"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { ListOrdered, CalendarCheck, ClipboardList, Hourglass, SearchCheck, CheckCircle2, XCircle } from 'lucide-react'; // Added XCircle for cancelled orders
import { useAuth } from '../../context/AuthContext';
import { fetchClientOrders, fetchClientSubscriptions } from '../../api/client';
import { showError } from '../../utils/toast';
import { Order, Subscription } from '../../types/api';

const ClientOverview = () => {
  const { token } = useAuth();
  const [totalOrders, setTotalOrders] = useState(0);
  const [activeSubscriptions, setActiveSubscriptions] = useState(0);
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0); // For 'Pending' status
  const [inProgressOrdersCount, setInProgressOrdersCount] = useState(0); // For 'In Progress' status
  const [underReviewOrdersCount, setUnderReviewOrdersCount] = useState(0); // For 'Under Review' status
  const [completedOrdersCount, setCompletedOrdersCount] = useState(0); // For 'Completed' status
  const [cancelledOrdersCount, setCancelledOrdersCount] = useState(0); // New state for 'Cancelled' status
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
          setPendingOrdersCount(ordersData.filter(order => order.status === 'Pending').length);
          setInProgressOrdersCount(ordersData.filter(order => order.status === 'In Progress').length);
          setUnderReviewOrdersCount(ordersData.filter(order => order.status === 'Under Review').length);
          setCompletedOrdersCount(ordersData.filter(order => order.status === 'Completed').length);
          setCancelledOrdersCount(ordersData.filter(order => order.status === 'Cancelled').length); // Calculate cancelled orders
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
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"> {/* Adjusted grid for 3 cards per row */}
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
          <ClipboardList className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingOrdersCount}</div>
          <p className="text-xs text-muted-foreground">
            {pendingOrdersCount} orders are awaiting review.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Orders In Progress</CardTitle>
          <Hourglass className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{inProgressOrdersCount}</div>
          <p className="text-xs text-muted-foreground">
            {inProgressOrdersCount} orders are currently being worked on.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Orders Under Review</CardTitle>
          <SearchCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{underReviewOrdersCount}</div>
          <p className="text-xs text-muted-foreground">
            {underReviewOrdersCount} orders are under internal review.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completedOrdersCount}</div>
          <p className="text-xs text-muted-foreground">
            You have completed {completedOrdersCount} orders.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Cancelled Orders</CardTitle>
          <XCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{cancelledOrdersCount}</div>
          <p className="text-xs text-muted-foreground">
            {cancelledOrdersCount} orders have been cancelled.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientOverview;
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Users, Building2, ListOrdered, Briefcase, CalendarCheck, Hourglass, SearchCheck, CheckCircle2, XCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { fetchAdminOverviewData } from '../../api/admin/overview';
import { showError } from '../../utils/toast';
import { Order, Job } from '../../types/api';
import LoadingSpinner from '../../components/LoadingSpinner'; // Import the new LoadingSpinner

const AdminOverview = () => {
  const { token } = useAuth();
  const [totalClients, setTotalClients] = useState(0);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [orderStatusCounts, setOrderStatusCounts] = useState<Record<Order['status'], number>>({
    'Pending': 0,
    'In Progress': 0,
    'Under Review': 0,
    'Completed': 0,
    'Cancelled': 0,
  });
  const [totalJobs, setTotalJobs] = useState(0);
  const [jobStatusCounts, setJobStatusCounts] = useState<Record<Job['status'], number>>({
    'Assigned': 0,
    'In Progress': 0,
    'Under Review': 0,
    'Completed': 0,
  });
  const [totalSubscriptions, setTotalSubscriptions] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const { data, error } = await fetchAdminOverviewData(token);
        if (data) {
          setTotalClients(data.totalClients);
          setTotalEmployees(data.totalEmployees);
          setTotalOrders(data.totalOrders);
          setOrderStatusCounts(data.orderStatusCounts);
          setTotalJobs(data.totalJobs);
          setJobStatusCounts(data.jobStatusCounts);
          setTotalSubscriptions(data.totalSubscriptions);
        } else if (error) {
          showError(error);
        }
      } catch (err) {
        showError('Failed to fetch admin overview data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <LoadingSpinner size={40} /> {/* Use the LoadingSpinner component */}
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalClients}</div>
          <p className="text-xs text-muted-foreground">
            Registered clients in the system.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
          <Building2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalEmployees}</div>
          <p className="text-xs text-muted-foreground">
            Active employees managing projects.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          <ListOrdered className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalOrders}</div>
          <p className="text-xs text-muted-foreground">
            All orders placed by clients.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
          <Briefcase className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalJobs}</div>
          <p className="text-xs text-muted-foreground">
            All jobs currently in the system.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Subscriptions</CardTitle>
          <CalendarCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalSubscriptions}</div>
          <p className="text-xs text-muted-foreground">
            All active and pending client subscriptions.
          </p>
        </CardContent>
      </Card>

      {/* Order Status Cards */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Orders Pending</CardTitle>
          <Hourglass className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{orderStatusCounts.Pending}</div>
          <p className="text-xs text-muted-foreground">
            Orders awaiting review.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Orders In Progress</CardTitle>
          <Briefcase className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{orderStatusCounts['In Progress']}</div>
          <p className="text-xs text-muted-foreground">
            Orders currently being worked on.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Orders Under Review</CardTitle>
          <SearchCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{orderStatusCounts['Under Review']}</div>
          <p className="text-xs text-muted-foreground">
            Orders awaiting internal review.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Orders Completed</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{orderStatusCounts.Completed}</div>
          <p className="text-xs text-muted-foreground">
            Orders successfully delivered.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Orders Cancelled</CardTitle>
          <XCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{orderStatusCounts.Cancelled}</div>
          <p className="text-xs text-muted-foreground">
            Orders that were cancelled.
          </p>
        </CardContent>
      </Card>

      {/* Job Status Cards */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Jobs Assigned</CardTitle>
          <Briefcase className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{jobStatusCounts.Assigned}</div>
          <p className="text-xs text-muted-foreground">
            Jobs assigned to employees.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Jobs In Progress</CardTitle>
          <Hourglass className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{jobStatusCounts['In Progress']}</div>
          <p className="text-xs text-muted-foreground">
            Jobs currently being worked on.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Jobs Under Review</CardTitle>
          <SearchCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{jobStatusCounts['Under Review']}</div>
          <p className="text-xs text-muted-foreground">
            Jobs awaiting internal review.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Jobs Completed</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{jobStatusCounts.Completed}</div>
          <p className="text-xs text-muted-foreground">
            Jobs successfully completed.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOverview;
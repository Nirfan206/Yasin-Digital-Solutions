"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { showSuccess, showError } from '../../utils/toast';
import { useAuth } from '../../context/AuthContext';
import { fetchAllOrders, updateOrderStatus } from '../../api/admin/orders';
import { createJob } from '../../api/admin/jobs';
import { fetchAllEmployees } from '../../api/admin/employees';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import OrderFilters from '../../components/admin/orders/OrderFilters';
import OrderTable from '../../components/admin/orders/OrderTable';
import { Order, Job, Employee } from '../../types/api';
import OrderDetailsModal from '../../components/admin/orders/OrderDetailsModal';
import CreateJobFromOrderModal from '../../components/admin/orders/CreateJobFromOrderModal';
import LoadingSpinner from '../../components/LoadingSpinner'; // Import LoadingSpinner

const AdminOrderManagement = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [fetchingOrders, setFetchingOrders] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<Order['status'] | 'all'>('all');

  // State for "Create Job" modal
  const [isCreateJobModalOpen, setIsCreateJobModalOpen] = useState(false);
  const [selectedOrderForJob, setSelectedOrderForJob] = useState<Order | null>(null);
  const [creatingJob, setCreatingJob] = useState(false);

  // State for "View Order Details" modal
  const [isOrderDetailsModalOpen, setIsOrderDetailsModalOpen] = useState(false);
  const [selectedOrderForDetails, setSelectedOrderForDetails] = useState<Order | null>(null);


  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setFetchingOrders(false);
        return;
      }
      setFetchingOrders(true);
      const [ordersResponse, employeesResponse] = await Promise.all([
        fetchAllOrders(token),
        fetchAllEmployees(token),
      ]);

      if (ordersResponse.data) {
        setOrders(ordersResponse.data);
      } else if (ordersResponse.error) {
        showError(ordersResponse.error);
      }

      if (employeesResponse.data) {
        setEmployees(employeesResponse.data);
      } else if (employeesResponse.error) {
        showError(employeesResponse.error);
      }
      setFetchingOrders(false);
    };
    fetchData();
  }, [token]);

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    if (!token) {
      showError('You must be logged in to update order status.');
      return;
    }
    setUpdatingStatus(orderId);
    try {
      const { data: updatedOrder, error } = await updateOrderStatus(token, orderId, newStatus);
      if (updatedOrder) {
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order._id === orderId ? { ...order, status: updatedOrder.status } : order
          )
        );
        showSuccess(`Order ${orderId} status updated to ${newStatus}.`);
      } else if (error) {
        showError(error);
      }
    } catch (error) {
      showError('Failed to update order status.');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const openCreateJobModal = (order: Order) => {
    setSelectedOrderForJob(order);
    setIsCreateJobModalOpen(true);
  };

  const closeCreateJobModal = () => {
    setIsCreateJobModalOpen(false);
    setSelectedOrderForJob(null);
    setCreatingJob(false);
  };

  const handleCreateJobSubmit = async (jobData: {
    title: string;
    client: string;
    dueDate: string;
    priority: Job['priority'];
    status: Job['status'];
    employeeId?: string;
    orderId: string;
  }) => {
    if (!token) {
      showError('Authentication token missing.');
      return;
    }

    setCreatingJob(true);
    try {
      const { data: newJob, error } = await createJob(
        token,
        jobData.title,
        jobData.client,
        jobData.dueDate,
        jobData.priority,
        jobData.status,
        jobData.employeeId,
        jobData.orderId
      );

      if (newJob) {
        showSuccess('Job created successfully and linked to order!');
        // Refresh orders to reflect status change (order status should change to 'In Progress')
        const { data: updatedOrders, error: ordersError } = await fetchAllOrders(token);
        if (updatedOrders) {
          setOrders(updatedOrders);
        } else if (ordersError) {
          showError(ordersError);
        }
        closeCreateJobModal();
      } else if (error) {
        showError(error);
      }
    } catch (error) {
      showError('Failed to create job.');
    } finally {
      setCreatingJob(false);
    }
  };

  const openOrderDetailsModal = (order: Order) => {
    setSelectedOrderForDetails(order);
    setIsOrderDetailsModalOpen(true);
  };

  const closeOrderDetailsModal = () => {
    setIsOrderDetailsModalOpen(false);
    setSelectedOrderForDetails(null);
  };

  const filteredOrders = useMemo(() => {
    let currentOrders = orders;

    if (filterStatus !== 'all') {
      currentOrders = currentOrders.filter(order => order.status === filterStatus);
    }

    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      currentOrders = currentOrders.filter(order =>
        (order.clientName && order.clientName.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (order.clientEmail && order.clientEmail.toLowerCase().includes(lowerCaseSearchTerm)) ||
        order.serviceType.toLowerCase().includes(lowerCaseSearchTerm) ||
        order.requirements.toLowerCase().includes(lowerCaseSearchTerm) ||
        order._id.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }

    return currentOrders;
  }, [orders, searchTerm, filterStatus]);

  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-gray-800">Order Management</CardTitle>
      </CardHeader>
      <CardContent>
        <OrderFilters
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          filterStatus={filterStatus}
          onFilterStatusChange={setFilterStatus}
        />

        {fetchingOrders ? (
          <div className="flex justify-center items-center min-h-[100px]">
            <LoadingSpinner size={30} />
          </div>
        ) : filteredOrders.length === 0 ? (
          <p className="text-gray-600">No orders found matching your criteria.</p>
        ) : (
          <OrderTable
            orders={filteredOrders}
            updatingStatus={updatingStatus}
            onStatusChange={handleStatusChange}
            onOpenCreateJobModal={openCreateJobModal}
            onOpenOrderDetailsModal={openOrderDetailsModal}
            creatingJob={creatingJob}
          />
        )}

        {/* Create Job Modal */}
        <CreateJobFromOrderModal
          isOpen={isCreateJobModalOpen}
          onClose={closeCreateJobModal}
          order={selectedOrderForJob}
          employees={employees}
          onSubmit={handleCreateJobSubmit}
          loading={creatingJob}
        />

        {/* Order Details Modal */}
        <OrderDetailsModal
          isOpen={isOrderDetailsModalOpen}
          onClose={closeOrderDetailsModal}
          order={selectedOrderForDetails}
        />
      </CardContent>
    </Card>
  );
};

export default AdminOrderManagement;
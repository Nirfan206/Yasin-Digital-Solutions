"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { showSuccess, showError } from '../../utils/toast';
import { useAuth } from '../../context/AuthContext';
import { fetchAllOrders, updateOrderStatus } from '../../api/admin/orders';
import { createJob } from '../../api/admin/jobs'; // Import createJob
import { fetchAllEmployees } from '../../api/admin/employees'; // Import fetchAllEmployees
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Order, Job, Employee } from '../../types/api';
import { Loader2, Briefcase, Eye } from 'lucide-react'; // Import Eye icon
import OrderDetailsModal from '../../components/admin/orders/OrderDetailsModal'; // Import reusable OrderDetailsModal
import CreateJobFromOrderModal from '../../components/admin/orders/CreateJobFromOrderModal'; // Import new CreateJobFromOrderModal

const AdminOrderManagement = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]); // State for employees
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
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Input
            placeholder="Search by client, service, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow"
          />
          <Select value={filterStatus} onValueChange={(value: Order['status'] | 'all') => setFilterStatus(value)}>
            <SelectTrigger className="w-[180px] sm:w-[150px]">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Under Review">Under Review</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {fetchingOrders ? (
          <p className="text-gray-600">Loading orders...</p>
        ) : filteredOrders.length === 0 ? (
          <p className="text-gray-600">No orders found matching your criteria.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Service Type</TableHead>
                  <TableHead>Requirements</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Order Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell className="font-medium">...{order._id.slice(-6)}</TableCell> {/* Truncated ID */}
                    <TableCell>
                      {order.clientName || order.clientEmail || 'N/A'}
                      {order.clientName && order.clientEmail && ` (${order.clientEmail})`}
                    </TableCell>
                    <TableCell>{order.serviceType}</TableCell>
                    <TableCell className="max-w-xs truncate">{order.requirements}</TableCell>
                    <TableCell>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'Under Review' ? 'bg-purple-100 text-purple-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {order.status}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                    <TableCell className="flex items-center space-x-2">
                      <Select
                        value={order.status}
                        onValueChange={(value: Order['status']) => handleStatusChange(order._id, value)}
                        disabled={updatingStatus === order._id}
                      >
                        <SelectTrigger className="w-[180px]">
                          {updatingStatus === order._id ? (
                            <div className="flex items-center space-x-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span>Updating...</span>
                            </div>
                          ) : (
                            <SelectValue placeholder="Update Status" />
                          )}
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="Under Review">Under Review</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                          <SelectItem value="Cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      {order.status === 'Pending' && (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => openCreateJobModal(order)}
                          title="Create Job from Order"
                          disabled={creatingJob}
                        >
                          <Briefcase size={18} />
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openOrderDetailsModal(order)}
                        title="View Order Details"
                      >
                        <Eye size={18} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
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
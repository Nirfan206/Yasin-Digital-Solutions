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
import { Button } from '../../components/ui/button'; // Import Button
import { Label } from '../../components/ui/label'; // Import Label
import Modal from '../../components/Modal'; // Import Modal
import { Order, Job, Employee } from '../../types/api';
import { Loader2, Briefcase } from 'lucide-react'; // Import Briefcase icon

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
  const [jobTitle, setJobTitle] = useState('');
  const [jobDueDate, setJobDueDate] = useState('');
  const [jobPriority, setJobPriority] = useState<Job['priority']>('Medium');
  const [jobEmployeeId, setJobEmployeeId] = useState<string | undefined>(undefined);
  const [creatingJob, setCreatingJob] = useState(false);

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
    setJobTitle(order.serviceType); // Pre-fill title with service type
    setJobDueDate(''); // Clear due date
    setJobPriority('Medium');
    setJobEmployeeId(undefined);
    setIsCreateJobModalOpen(true);
  };

  const closeCreateJobModal = () => {
    setIsCreateJobModalOpen(false);
    setSelectedOrderForJob(null);
    setCreatingJob(false);
  };

  const handleCreateJobSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !selectedOrderForJob) {
      showError('Authentication token or selected order missing.');
      return;
    }
    if (!jobTitle || !jobDueDate || !jobPriority) {
      showError('Please fill in all required job fields.');
      return;
    }

    setCreatingJob(true);
    try {
      const { data: newJob, error } = await createJob(
        token,
        jobTitle,
        selectedOrderForJob.clientName || selectedOrderForJob.clientEmail || 'N/A',
        jobDueDate,
        jobPriority,
        'Assigned', // Default status for new job
        jobEmployeeId,
        selectedOrderForJob._id // Link to the order
      );

      if (newJob) {
        showSuccess('Job created successfully and linked to order!');
        // Refresh orders to reflect status change
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
                    <TableCell className="font-medium">{order._id}</TableCell>
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
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Create Job Modal */}
        <Modal
          isOpen={isCreateJobModalOpen}
          onClose={closeCreateJobModal}
          title={`Create Job for Order #${selectedOrderForJob?._id?.slice(-6)}`}
          description={`Service: ${selectedOrderForJob?.serviceType}`}
          footer={
            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={closeCreateJobModal}
                disabled={creatingJob}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                form="create-job-form"
                disabled={creatingJob}
              >
                {creatingJob ? 'Creating Job...' : 'Create Job'}
              </Button>
            </div>
          }
        >
          <form id="create-job-form" onSubmit={handleCreateJobSubmit} className="space-y-4">
            <div>
              <Label htmlFor="jobTitle">Job Title</Label>
              <Input
                type="text"
                id="jobTitle"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="jobClient">Client</Label>
              <Input
                type="text"
                id="jobClient"
                value={selectedOrderForJob?.clientName || selectedOrderForJob?.clientEmail || ''}
                disabled
              />
            </div>
            <div>
              <Label htmlFor="jobDueDate">Due Date</Label>
              <Input
                type="date"
                id="jobDueDate"
                value={jobDueDate}
                onChange={(e) => setJobDueDate(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="jobPriority">Priority</Label>
              <Select value={jobPriority} onValueChange={(value: Job['priority']) => setJobPriority(value)} disabled={creatingJob}>
                <SelectTrigger id="jobPriority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="jobEmployee">Assign Employee</Label>
              <Select
                value={jobEmployeeId || ''}
                onValueChange={(value: string) => setJobEmployeeId(value === 'unassigned' ? undefined : value)}
                disabled={creatingJob}
              >
                <SelectTrigger id="jobEmployee">
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {employees.map(emp => (
                    <SelectItem key={emp.id} value={emp.id}>{emp.name} ({emp.email})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </form>
        </Modal>
      </CardContent>
    </Card>
  );
};

export default AdminOrderManagement;
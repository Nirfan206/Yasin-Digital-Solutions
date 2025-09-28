"use client";

import React, { useState, useEffect } from 'react';
import { showSuccess, showError } from '../../utils/toast';
import { Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { fetchAllJobs, createJob, updateJob, deleteJob } from '../../api/admin/jobs';
import { fetchAllEmployees } from '../../api/admin/employees';
import { fetchAllOrders } from '../../api/admin/orders';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import JobTable from '../../components/admin/jobs/JobTable';
import JobFormModal from '../../components/admin/jobs/JobFormModal';
import JobDetailsModal from '../../components/admin/jobs/JobDetailsModal';
import OrderDetailsModal from '../../components/admin/orders/OrderDetailsModal'; // Reusable OrderDetailsModal
import { Job, Employee, Order } from '../../types/api';

const AdminJobManagement = () => {
  const { token } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [fetchingJobs, setFetchingJobs] = useState(true);
  const [loadingAction, setLoadingAction] = useState(false); // For delete/save actions

  // Modals state
  const [isJobFormModalOpen, setIsJobFormModalOpen] = useState(false);
  const [currentJobForForm, setCurrentJobForForm] = useState<Job | null>(null);
  const [isJobDetailsModalOpen, setIsJobDetailsModalOpen] = useState(false);
  const [selectedJobForDetails, setSelectedJobForDetails] = useState<Job | null>(null);
  const [isOrderDetailsModalOpen, setIsOrderDetailsModalOpen] = useState(false);
  const [selectedOrderForDetails, setSelectedOrderForDetails] = useState<Order | null>(null);

  // Filter and Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<Job['status'] | 'all'>('all');
  const [filterPriority, setFilterPriority] = useState<Job['priority'] | 'all'>('all');
  const [filterEmployeeId, setFilterEmployeeId] = useState<string | 'all'>('all');


  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setFetchingJobs(false);
        return;
      }
      setFetchingJobs(true);
      const [jobsResponse, employeesResponse, ordersResponse] = await Promise.all([
        fetchAllJobs(token),
        fetchAllEmployees(token),
        fetchAllOrders(token),
      ]);

      if (jobsResponse.data) {
        setJobs(jobsResponse.data);
      } else if (jobsResponse.error) {
        showError(jobsResponse.error);
      }

      if (employeesResponse.data) {
        setEmployees(employeesResponse.data);
      } else if (employeesResponse.error) {
        showError(employeesResponse.error);
      }

      if (ordersResponse.data) {
        setOrders(ordersResponse.data);
      } else if (ordersResponse.error) {
        showError(ordersResponse.error);
      }
      setFetchingJobs(false);
    };
    fetchData();
  }, [token]);

  const handleOpenJobFormModal = (job?: Job) => {
    setCurrentJobForForm(job || null);
    setIsJobFormModalOpen(true);
  };

  const handleCloseJobFormModal = () => {
    setIsJobFormModalOpen(false);
    setCurrentJobForForm(null);
  };

  const handleJobFormSubmit = async (jobData: Omit<Job, '_id' | 'createdAt' | 'updatedAt' | 'completionDate' | 'feedback'> & { employeeId?: string | undefined }) => {
    if (!token) {
      showError('You must be logged in to manage jobs.');
      return;
    }
    setLoadingAction(true);
    try {
      if (currentJobForForm) {
        // Update job
        const { data, error } = await updateJob(
          token,
          currentJobForForm._id,
          jobData.title,
          jobData.client,
          jobData.dueDate,
          jobData.priority,
          jobData.status,
          jobData.employeeId
        );
        if (data) {
          setJobs(prevJobs =>
            prevJobs.map(job =>
              job._id === currentJobForForm._id ? { ...job, ...data } : job
            )
          );
          showSuccess('Job updated successfully!');
        } else if (error) {
          showError(error);
        }
      } else {
        // Create new job
        const { data, error } = await createJob(
          token,
          jobData.title,
          jobData.client,
          jobData.dueDate,
          jobData.priority,
          jobData.status,
          jobData.employeeId,
          jobData.orderId // Pass orderId if it exists
        );
        if (data) {
          setJobs(prevJobs => [...prevJobs, data]);
          showSuccess('Job created successfully!');
        } else if (error) {
          showError(error);
        }
      }
      handleCloseJobFormModal();
    } catch (error) {
      showError('Failed to save job.');
    } finally {
      setLoadingAction(false);
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    if (!token) {
      showError('You must be logged in to delete jobs.');
      return;
    }

    setLoadingAction(true);
    try {
      const { message, error } = await deleteJob(token, jobId);
      if (message) {
        setJobs(prevJobs => prevJobs.filter(job => job._id !== jobId));
        showSuccess('Job deleted successfully!');
      } else if (error) {
        showError(error);
      }
    } catch (error) {
      showError('Failed to delete job.');
    } finally {
      setLoadingAction(false);
    }
  };

  const handleOpenJobDetailsModal = (job: Job) => {
    setSelectedJobForDetails(job);
    setIsJobDetailsModalOpen(true);
  };

  const handleCloseJobDetailsModal = () => {
    setIsJobDetailsModalOpen(false);
    setSelectedJobForDetails(null);
  };

  const handleOpenOrderDetailsModal = (orderId: string) => {
    const order = orders.find(o => o._id === orderId);
    if (order) {
      setSelectedOrderForDetails(order);
      setIsOrderDetailsModalOpen(true);
    } else {
      showError('Order details not found.');
    }
  };

  const handleCloseOrderDetailsModal = () => {
    setIsOrderDetailsModalOpen(false);
    setSelectedOrderForDetails(null);
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = searchTerm === '' ||
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job._id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || job.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || job.priority === filterPriority;
    const matchesEmployee = filterEmployeeId === 'all' || job.employeeId === filterEmployeeId;

    return matchesSearch && matchesStatus && matchesPriority && matchesEmployee;
  });

  return (
    <Card className="w-full mx-auto">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="text-2xl font-semibold text-gray-800">Job Management</CardTitle>
        <Button
          onClick={() => handleOpenJobFormModal()}
          className="flex items-center space-x-2"
        >
          <Plus size={18} />
          <span>Add Job</span>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Input
            placeholder="Search by title, client, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow"
          />
          <Select value={filterStatus} onValueChange={(value: Job['status'] | 'all') => setFilterStatus(value)}>
            <SelectTrigger className="w-[180px] sm:w-[150px]">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Assigned">Assigned</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Under Review">Under Review</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterPriority} onValueChange={(value: Job['priority'] | 'all') => setFilterPriority(value)}>
            <SelectTrigger className="w-[180px] sm:w-[150px]">
              <SelectValue placeholder="Filter by Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterEmployeeId} onValueChange={(value: string | 'all') => setFilterEmployeeId(value)}>
            <SelectTrigger className="w-[180px] sm:w-[150px]">
              <SelectValue placeholder="Filter by Employee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Employees</SelectItem>
              <SelectItem value="unassigned">Unassigned</SelectItem>
              {employees.map(emp => (
                <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {fetchingJobs ? (
          <p className="text-gray-600">Loading jobs...</p>
        ) : filteredJobs.length === 0 ? (
          <p className="text-gray-600">No jobs found matching your criteria.</p>
        ) : (
          <JobTable
            jobs={filteredJobs}
            employees={employees}
            onOpenEditModal={handleOpenJobFormModal}
            onDeleteJob={handleDeleteJob}
            onOpenJobDetailsModal={handleOpenJobDetailsModal}
            onOpenOrderDetailsModal={handleOpenOrderDetailsModal}
            loadingAction={loadingAction}
          />
        )}

        <JobFormModal
          isOpen={isJobFormModalOpen}
          onClose={handleCloseJobFormModal}
          currentJob={currentJobForForm}
          employees={employees}
          onSubmit={handleJobFormSubmit}
          loading={loadingAction}
        />

        <JobDetailsModal
          isOpen={isJobDetailsModalOpen}
          onClose={handleCloseJobDetailsModal}
          job={selectedJobForDetails}
          employees={employees}
          onViewLinkedOrder={handleOpenOrderDetailsModal}
        />

        <OrderDetailsModal
          isOpen={isOrderDetailsModalOpen}
          onClose={handleCloseOrderDetailsModal}
          order={selectedOrderForDetails}
        />
      </CardContent>
    </Card>
  );
};

export default AdminJobManagement;
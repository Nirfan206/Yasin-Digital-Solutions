"use client";

import React, { useState, useEffect } from 'react';
import { showSuccess, showError } from '../../utils/toast';
import { Plus, Edit, Trash2, Eye } from 'lucide-react'; // Added Eye icon
import { useAuth } from '../../context/AuthContext';
import { fetchAllJobs, createJob, updateJob, deleteJob } from '../../api/admin/jobs'; // Import job API functions from new file
import { fetchAllEmployees } from '../../api/admin/employees'; // Import employee API functions from new file
import { fetchAllOrders } from '../../api/admin/orders'; // Import fetchAllOrders for modal
import { Card, CardContent, CardHeader, CardTitle } = '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import Modal from '../../components/Modal';
import { Job, Employee, Order } from '../../types/api'; // Added Order to imports

const AdminJobManagement = () => {
  const { token } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [orders, setOrders] = useState<Order[]>([]); // State to store all orders for lookup
  const [fetchingJobs, setFetchingJobs] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentJob, setCurrentJob] = useState<Job | null>(null);
  const [title, setTitle] = useState('');
  const [client, setClient] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<Job['priority']>('Medium');
  const [status, setStatus] = useState<Job['status']>('Assigned');
  const [employeeId, setEmployeeId] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false); // For modal actions

  // State for "View Order Details" modal
  const [isOrderDetailsModalOpen, setIsOrderDetailsModalOpen] = useState(false);
  const [selectedOrderForDetails, setSelectedOrderForDetails] = useState<Order | null>(null);

  // State for "View Job Details" modal
  const [isJobDetailsModalOpen, setIsJobDetailsModalOpen] = useState(false);
  const [selectedJobForDetails, setSelectedJobForDetails] = useState<Job | null>(null);


  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setFetchingJobs(false);
        return;
      }
      setFetchingJobs(true);
      const [jobsResponse, employeesResponse, ordersResponse] = await Promise.all([ // Fetch orders too
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

      if (ordersResponse.data) { // Store fetched orders
        setOrders(ordersResponse.data);
      } else if (ordersResponse.error) {
        showError(ordersResponse.error);
      }
      setFetchingJobs(false);
    };
    fetchData();
  }, [token]);

  const openModal = (job?: Job) => {
    if (job) {
      setCurrentJob(job);
      setTitle(job.title);
      setClient(job.client);
      setDueDate(job.dueDate.split('T')[0]); // Format date for input type="date"
      setPriority(job.priority);
      setStatus(job.status);
      setEmployeeId(job.employeeId || undefined);
    } else {
      setCurrentJob(null);
      setTitle('');
      setClient('');
      setDueDate('');
      setPriority('Medium');
      setStatus('Assigned');
      setEmployeeId(undefined);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      showError('You must be logged in to manage jobs.');
      return;
    }
    setLoading(true);
    try {
      if (currentJob) {
        // Update job
        const { data, error } = await updateJob(
          token,
          currentJob._id,
          title,
          client,
          dueDate,
          priority,
          status,
          employeeId
        );
        if (data) {
          setJobs(prevJobs =>
            prevJobs.map(job =>
              job._id === currentJob._id ? { ...job, ...data } : job
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
          title,
          client,
          dueDate,
          priority,
          status,
          employeeId
        );
        if (data) {
          setJobs(prevJobs => [...prevJobs, data]);
          showSuccess('Job created successfully!');
        } else if (error) {
          showError(error);
        }
      }
      closeModal();
    } catch (error) {
      showError('Failed to save job.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId: string) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    if (!token) {
      showError('You must be logged in to delete jobs.');
      return;
    }

    setLoading(true);
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
      setLoading(false);
    }
  };

  const openOrderDetailsModal = (orderId: string) => {
    const order = orders.find(o => o._id === orderId);
    if (order) {
      setSelectedOrderForDetails(order);
      setIsOrderDetailsModalOpen(true);
    } else {
      showError('Order details not found.');
    }
  };

  const closeOrderDetailsModal = () => {
    setIsOrderDetailsModalOpen(false);
    setSelectedOrderForDetails(null);
  };

  const getEmployeeName = (id: string | undefined) => {
    return employees.find(emp => emp.id === id)?.name || 'N/A';
  };

  const openJobDetailsModal = (job: Job) => {
    setSelectedJobForDetails(job);
    setIsJobDetailsModalOpen(true);
  };

  const closeJobDetailsModal = () => {
    setIsJobDetailsModalOpen(false);
    setSelectedJobForDetails(null);
  };

  return (
    <Card className="w-full mx-auto">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="text-2xl font-semibold text-gray-800">Job Management</CardTitle>
        <Button
          onClick={() => openModal()}
          className="flex items-center space-x-2"
        >
          <Plus size={18} />
          <span>Add Job</span>
        </Button>
      </CardHeader>
      <CardContent>
        {fetchingJobs ? (
          <p className="text-gray-600">Loading jobs...</p>
        ) : jobs.length === 0 ? (
          <p className="text-gray-600">No jobs found.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Linked Order</TableHead> {/* New TableHead */}
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow key={job._id}>
                    <TableCell className="font-medium">{job.title}</TableCell>
                    <TableCell>{job.client}</TableCell>
                    <TableCell>{new Date(job.dueDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        job.priority === 'High' ? 'bg-red-100 text-red-800' :
                        job.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {job.priority}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        job.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        job.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                        job.status === 'Assigned' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {job.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      {job.employeeId
                        ? employees.find(emp => emp.id === job.employeeId)?.name || 'N/A'
                        : 'Unassigned'}
                    </TableCell>
                    <TableCell> {/* New TableCell for Linked Order */}
                      {job.orderId ? (
                        <div className="flex items-center space-x-1">
                          <span>{job.orderId.slice(-6)}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openOrderDetailsModal(job.orderId!)}
                            title="View Linked Order"
                          >
                            <Eye size={16} />
                          </Button>
                        </div>
                      ) : (
                        'N/A'
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openJobDetailsModal(job)}
                        className="mr-2"
                        title="View Job Details"
                      >
                        <Eye size={18} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openModal(job)}
                        className="mr-2"
                        disabled={loading}
                      >
                        <Edit size={18} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(job._id)}
                        disabled={loading}
                      >
                        <Trash2 size={18} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={currentJob ? 'Edit Job' : 'Add New Job'}
          footer={
            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={closeModal}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                form="job-form"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Job'}
              </Button>
            </div>
          }
        >
          <form id="job-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="jobTitle">Title</Label>
              <Input
                type="text"
                id="jobTitle"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="jobClient">Client</Label>
              <Input
                type="text"
                id="jobClient"
                value={client}
                onChange={(e) => setClient(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="jobDueDate">Due Date</Label>
              <Input
                type="date"
                id="jobDueDate"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="jobPriority">Priority</Label>
              <Select value={priority} onValueChange={(value: Job['priority']) => setPriority(value)} disabled={loading}>
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
              <Label htmlFor="jobStatus">Status</Label>
              <Select value={status} onValueChange={(value: Job['status']) => setStatus(value)} disabled={loading}>
                <SelectTrigger id="jobStatus">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Assigned">Assigned</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Under Review">Under Review</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="jobEmployee">Assign Employee</Label>
              <Select
                value={employeeId || ''}
                onValueChange={(value: string) => setEmployeeId(value === 'unassigned' ? undefined : value)}
                disabled={loading}
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

        {/* Job Details Modal */}
        <Modal
          isOpen={isJobDetailsModalOpen}
          onClose={closeJobDetailsModal}
          title={`Job Details: ${selectedJobForDetails?.title || 'N/A'}`}
          description={`Client: ${selectedJobForDetails?.client || 'N/A'}`}
          footer={
            <Button onClick={closeJobDetailsModal}>Close</Button>
          }
        >
          {selectedJobForDetails && (
            <div className="space-y-4 text-gray-700">
              <p><strong>Job ID:</strong> {selectedJobForDetails._id}</p>
              <p><strong>Title:</strong> {selectedJobForDetails.title}</p>
              <p><strong>Client:</strong> {selectedJobForDetails.client}</p>
              <p><strong>Due Date:</strong> {new Date(selectedJobForDetails.dueDate).toLocaleDateString()}</p>
              <p><strong>Priority:</strong>
                <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  selectedJobForDetails.priority === 'High' ? 'bg-red-100 text-red-800' :
                  selectedJobForDetails.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {selectedJobForDetails.priority}
                </span>
              </p>
              <p><strong>Status:</strong>
                <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  selectedJobForDetails.status === 'Completed' ? 'bg-green-100 text-green-800' :
                  selectedJobForDetails.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                  selectedJobForDetails.status === 'Assigned' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  {selectedJobForDetails.status}
                </span>
              </p>
              <p><strong>Assigned To:</strong> {getEmployeeName(selectedJobForDetails.employeeId)}</p>
              {selectedJobForDetails.orderId && (
                <p>
                  <strong>Linked Order ID:</strong> {selectedJobForDetails.orderId}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openOrderDetailsModal(selectedJobForDetails.orderId!)}
                    className="ml-2 h-auto px-2 py-1 text-xs"
                  >
                    <Eye size={14} className="mr-1" /> View Order
                  </Button>
                </p>
              )}
              {selectedJobForDetails.completionDate && (
                <p><strong>Completion Date:</strong> {new Date(selectedJobForDetails.completionDate).toLocaleDateString()}</p>
              )}
              {selectedJobForDetails.feedback && (
                <>
                  <p><strong>Feedback:</strong></p>
                  <p className="whitespace-pre-wrap border p-3 rounded-md bg-gray-50">{selectedJobForDetails.feedback}</p>
                </>
              )}
            </div>
          )}
        </Modal>

        {/* Order Details Modal (reused from AdminOrderManagement) */}
        <Modal
          isOpen={isOrderDetailsModalOpen}
          onClose={closeOrderDetailsModal}
          title={`Order Details: #${selectedOrderForDetails?._id?.slice(-6)}`}
          description={`Service: ${selectedOrderForDetails?.serviceType}`}
          footer={
            <Button onClick={closeOrderDetailsModal}>Close</Button>
          }
        >
          {selectedOrderForDetails && (
            <div className="space-y-4 text-gray-700">
              <p><strong>Client:</strong> {selectedOrderForDetails.clientName || selectedOrderForDetails.clientEmail || 'N/A'}</p>
              <p><strong>Client Email:</strong> {selectedOrderForDetails.clientEmail || 'N/A'}</p>
              <p><strong>Service Type:</strong> {selectedOrderForDetails.serviceType}</p>
              <p><strong>Status:</strong>
                <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  selectedOrderForDetails.status === 'Completed' ? 'bg-green-100 text-green-800' :
                  selectedOrderForDetails.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                  selectedOrderForDetails.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                  selectedOrderForDetails.status === 'Under Review' ? 'bg-purple-100 text-purple-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {selectedOrderForDetails.status}
                </span>
              </p>
              <p><strong>Order Date:</strong> {new Date(selectedOrderForDetails.orderDate).toLocaleString()}</p>
              <p><strong>Requirements:</strong></p>
              <p className="whitespace-pre-wrap border p-3 rounded-md bg-gray-50">{selectedOrderForDetails.requirements}</p>
            </div>
          )}
        </Modal>
      </CardContent>
    </Card>
  );
};

export default AdminJobManagement;
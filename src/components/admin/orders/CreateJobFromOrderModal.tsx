"use client";

import React, { useState, useEffect } from 'react';
import Modal from '../../Modal';
import { Button } from '../../ui/button';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Order, Job, Employee } from '../../../types/api';

interface CreateJobFromOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  employees: Employee[];
  onSubmit: (jobData: {
    title: string;
    client: string;
    dueDate: string;
    priority: Job['priority'];
    status: Job['status'];
    employeeId?: string;
    orderId: string;
  }) => void;
  loading: boolean;
}

const CreateJobFromOrderModal = ({
  isOpen,
  onClose,
  order,
  employees,
  onSubmit,
  loading,
}: CreateJobFromOrderModalProps) => {
  const [jobTitle, setJobTitle] = useState('');
  const [jobDueDate, setJobDueDate] = useState('');
  const [jobPriority, setJobPriority] = useState<Job['priority']>('Medium');
  const [jobEmployeeId, setJobEmployeeId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (order) {
      setJobTitle(order.serviceType); // Pre-fill title with service type
      setJobDueDate(''); // Clear due date on new open
      setJobPriority('Medium');
      setJobEmployeeId(undefined);
    }
  }, [order]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;

    onSubmit({
      title: jobTitle,
      client: order.clientName || order.clientEmail || 'N/A',
      dueDate: jobDueDate,
      priority: jobPriority,
      status: 'Assigned', // Default status for new job
      employeeId: jobEmployeeId === 'unassigned' ? undefined : jobEmployeeId,
      orderId: order._id,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Create Job for Order #${order?._id?.slice(-6)}`}
      description={`Service: ${order?.serviceType}`}
      footer={
        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="create-job-form"
            disabled={loading}
          >
            {loading ? 'Creating Job...' : 'Create Job'}
          </Button>
        </div>
      }
    >
      <form id="create-job-form" onSubmit={handleSubmit} className="space-y-4">
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
            value={order?.clientName || order?.clientEmail || ''}
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
          <Select value={jobPriority} onValueChange={(value: Job['priority']) => setJobPriority(value)} disabled={loading}>
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
  );
};

export default CreateJobFromOrderModal;
"use client";

import React, { useState, useEffect } from 'react';
import Modal from '../../Modal';
import { Button } from '../../ui/button';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Job, Employee } from '../../../types/api';

interface JobFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentJob: Job | null;
  employees: Employee[];
  onSubmit: (jobData: Omit<Job, '_id' | 'createdAt' | 'updatedAt' | 'completionDate' | 'feedback'> & { employeeId?: string | undefined }) => void;
  loading: boolean;
}

const JobFormModal = ({ isOpen, onClose, currentJob, employees, onSubmit, loading }: JobFormModalProps) => {
  const [title, setTitle] = useState('');
  const [client, setClient] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<Job['priority']>('Medium');
  const [status, setStatus] = useState<Job['status']>('Assigned');
  const [employeeId, setEmployeeId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (currentJob) {
      setTitle(currentJob.title);
      setClient(currentJob.client);
      setDueDate(currentJob.dueDate.split('T')[0]);
      setPriority(currentJob.priority);
      setStatus(currentJob.status);
      setEmployeeId(currentJob.employeeId || undefined);
    } else {
      setTitle('');
      setClient('');
      setDueDate('');
      setPriority('Medium');
      setStatus('Assigned');
      setEmployeeId(undefined);
    }
  }, [currentJob]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      client,
      dueDate,
      priority,
      status,
      employeeId: employeeId === 'unassigned' ? undefined : employeeId,
      orderId: currentJob?.orderId, // Preserve orderId if editing an existing job
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={currentJob ? 'Edit Job' : 'Add New Job'}
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
  );
};

export default JobFormModal;
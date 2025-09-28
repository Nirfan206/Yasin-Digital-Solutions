"use client";

import React from 'react';
import Modal from '../../Modal';
import { Button } from '../../ui/button';
import { Job, Employee } from '../../../types/api';
import { Eye } from 'lucide-react';

interface JobDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job | null;
  employees: Employee[];
  onViewLinkedOrder: (orderId: string) => void;
}

const JobDetailsModal = ({ isOpen, onClose, job, employees, onViewLinkedOrder }: JobDetailsModalProps) => {
  if (!job) return null;

  const getEmployeeName = (id: string | undefined) => {
    return employees.find(emp => emp.id === id)?.name || 'N/A';
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Job Details: ${job.title || 'N/A'}`}
      description={`Client: ${job.client || 'N/A'}`}
      footer={
        <Button onClick={onClose}>Close</Button>
      }
    >
      <div className="space-y-4 text-gray-700">
        <p><strong>Job ID:</strong> {job._id}</p>
        <p><strong>Title:</strong> {job.title}</p>
        <p><strong>Client:</strong> {job.client}</p>
        <p><strong>Due Date:</strong> {new Date(job.dueDate).toLocaleDateString()}</p>
        <p><strong>Priority:</strong>
          <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            job.priority === 'High' ? 'bg-red-100 text-red-800' :
            job.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-green-100 text-green-800'
          }`}>
            {job.priority}
          </span>
        </p>
        <p><strong>Status:</strong>
          <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            job.status === 'Completed' ? 'bg-green-100 text-green-800' :
            job.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
            job.status === 'Assigned' ? 'bg-yellow-100 text-yellow-800' :
            'bg-purple-100 text-purple-800'
          }`}>
            {job.status}
          </span>
        </p>
        <p><strong>Assigned To:</strong> {getEmployeeName(job.employeeId)}</p>
        {job.orderId && (
          <p>
            <strong>Linked Order ID:</strong> {job.orderId}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewLinkedOrder(job.orderId!)}
              className="ml-2 h-auto px-2 py-1 text-xs"
            >
              <Eye size={14} className="mr-1" /> View Order
            </Button>
          </p>
        )}
        {job.completionDate && (
          <p><strong>Completion Date:</strong> {new Date(job.completionDate).toLocaleDateString()}</p>
        )}
        {job.feedback && (
          <>
            <p><strong>Feedback:</strong></p>
            <p className="whitespace-pre-wrap border p-3 rounded-md bg-gray-50">{job.feedback}</p>
          </>
        )}
      </div>
    </Modal>
  );
};

export default JobDetailsModal;
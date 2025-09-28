"use client";

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Button } from '../../ui/button';
import { Job, Employee, Order } from '../../../types/api';
import { Edit, Trash2, Eye } from 'lucide-react';

interface JobTableProps {
  jobs: Job[];
  employees: Employee[];
  onOpenEditModal: (job: Job) => void;
  onDeleteJob: (jobId: string) => void;
  onOpenJobDetailsModal: (job: Job) => void;
  onOpenOrderDetailsModal: (orderId: string) => void;
  loadingAction: boolean;
}

const JobTable = ({
  jobs,
  employees,
  onOpenEditModal,
  onDeleteJob,
  onOpenJobDetailsModal,
  onOpenOrderDetailsModal,
  loadingAction,
}: JobTableProps) => {

  const getEmployeeName = (id: string | undefined) => {
    return employees.find(emp => emp.id === id)?.name || 'N/A';
  };

  return (
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
            <TableHead>Linked Order</TableHead>
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
                  ? getEmployeeName(job.employeeId)
                  : 'Unassigned'}
              </TableCell>
              <TableCell>
                {job.orderId ? (
                  <div className="flex items-center space-x-1">
                    <span>{job.orderId.slice(-6)}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onOpenOrderDetailsModal(job.orderId!)}
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
                  onClick={() => onOpenJobDetailsModal(job)}
                  className="mr-2"
                  title="View Job Details"
                >
                  <Eye size={18} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onOpenEditModal(job)}
                  className="mr-2"
                  disabled={loadingAction}
                >
                  <Edit size={18} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeleteJob(job._id)}
                  disabled={loadingAction}
                >
                  <Trash2 size={18} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default JobTable;
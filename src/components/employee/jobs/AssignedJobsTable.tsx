"use client";

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Job } from '../../../types/api';
import { Loader2 } from 'lucide-react';

interface AssignedJobsTableProps {
  jobs: Job[];
  updatingStatus: string | null;
  onStatusChange: (jobId: string, newStatus: Job['status']) => void;
}

const AssignedJobsTable = ({ jobs, updatingStatus, onStatusChange }: AssignedJobsTableProps) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Job ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.map((job) => (
            <TableRow key={job._id}>
              <TableCell className="font-medium">{job._id}</TableCell>
              <TableCell>{job.title}</TableCell>
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
                <Select
                  value={job.status}
                  onValueChange={(value: Job['status']) => onStatusChange(job._id, value)}
                  disabled={updatingStatus === job._id}
                >
                  <SelectTrigger className="w-[180px]">
                    {updatingStatus === job._id ? (
                      <div className="flex items-center space-x-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Updating...</span>
                      </div>
                    ) : (
                      <SelectValue placeholder="Update Status" />
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Assigned">Assigned</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Under Review">Under Review</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AssignedJobsTable;
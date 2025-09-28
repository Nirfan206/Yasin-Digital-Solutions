"use client";

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Job } from '../../../types/api';

interface CompletedJobsTableProps {
  jobs: Job[];
}

const CompletedJobsTable = ({ jobs }: CompletedJobsTableProps) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Job ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Completion Date</TableHead>
            <TableHead>Feedback</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.map((job) => (
            <TableRow key={job._id}>
              <TableCell className="font-medium">{job._id}</TableCell>
              <TableCell>{job.title}</TableCell>
              <TableCell>{job.client}</TableCell>
              <TableCell>{job.completionDate ? new Date(job.completionDate).toLocaleDateString() : 'N/A'}</TableCell>
              <TableCell className="max-w-xs truncate">{job.feedback || 'N/A'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CompletedJobsTable;
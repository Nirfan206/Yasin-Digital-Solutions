"use client";

import React, { useState, useEffect } from 'react';
import { showSuccess, showError } from '../../utils/toast';
import { useAuth } from '../../context/AuthContext';
import { fetchAssignedJobs, updateJobStatus } from '../../api/employee'; // Import API functions
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'; // Import shadcn/ui Select
import { Job } from '../../types/api'; // Import Job interface

const EmployeeAssignedJobs = () => {
  const { token } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [fetchingJobs, setFetchingJobs] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null); // To track which job is being updated

  useEffect(() => {
    const getAssignedJobs = async () => {
      if (!token) {
        setFetchingJobs(false);
        return;
      }
      setFetchingJobs(true);
      const { data, error } = await fetchAssignedJobs(token);
      if (data) {
        setJobs(data);
      } else if (error) {
        showError(error);
      }
      setFetchingJobs(false);
    };
    getAssignedJobs();
  }, [token]);

  const handleStatusChange = async (jobId: string, newStatus: Job['status']) => {
    if (!token) {
      showError('You must be logged in to update job status.');
      return;
    }
    setUpdatingStatus(jobId);
    try {
      const { data: updatedJob, error } = await updateJobStatus(token, jobId, newStatus);
      if (updatedJob) {
        setJobs(prevJobs =>
          prevJobs.map(job =>
            job._id === jobId ? { ...job, status: updatedJob.status } : job
          )
        );
        showSuccess(`Job ${jobId} status updated to ${newStatus}.`);
      } else if (error) {
        showError(error);
      }
    } catch (error) {
      showError('Failed to update job status.');
    } finally {
      setUpdatingStatus(null);
    }
  };

  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-gray-800">Your Assigned Jobs</CardTitle>
      </CardHeader>
      <CardContent>
        {fetchingJobs ? (
          <p className="text-gray-600">Loading assigned jobs...</p>
        ) : jobs.length === 0 ? (
          <p className="text-gray-600">You currently have no assigned jobs.</p>
        ) : (
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
                        onValueChange={(value: Job['status']) => handleStatusChange(job._id, value)}
                        disabled={updatingStatus === job._id}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Update Status" />
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
        )}
      </CardContent>
    </Card>
  );
};

export default EmployeeAssignedJobs;
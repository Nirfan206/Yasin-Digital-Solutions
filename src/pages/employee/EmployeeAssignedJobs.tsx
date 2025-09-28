"use client";

import React, { useState, useEffect } from 'react';
import { showSuccess, showError } from '../../utils/toast';
import { useAuth } from '../../context/AuthContext';
import { fetchAssignedJobs, updateJobStatus } from '../../api/employee';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import AssignedJobsTable from '../../components/employee/jobs/AssignedJobsTable'; // Import the new component
import { Job } from '../../types/api';
import LoadingSpinner from '../../components/LoadingSpinner'; // Import LoadingSpinner

const EmployeeAssignedJobs = () => {
  const { token } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [fetchingJobs, setFetchingJobs] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

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
          <div className="flex justify-center items-center min-h-[100px]">
            <LoadingSpinner size={30} />
          </div>
        ) : jobs.length === 0 ? (
          <p className="text-gray-600">You currently have no assigned jobs.</p>
        ) : (
          <AssignedJobsTable
            jobs={jobs}
            updatingStatus={updatingStatus}
            onStatusChange={handleStatusChange}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default EmployeeAssignedJobs;
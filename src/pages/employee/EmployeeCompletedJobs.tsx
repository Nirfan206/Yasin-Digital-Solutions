"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchCompletedJobs } from '../../api/employee';
import { showError } from '../../utils/toast';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import CompletedJobsTable from '../../components/employee/jobs/CompletedJobsTable'; // Import the new component
import { Job } from '../../types/api';

const EmployeeCompletedJobs = () => {
  const { token } = useAuth();
  const [completedJobs, setCompletedJobs] = useState<Job[]>([]);
  const [fetchingJobs, setFetchingJobs] = useState(true);

  useEffect(() => {
    const getCompletedJobs = async () => {
      if (!token) {
        setFetchingJobs(false);
        return;
      }
      setFetchingJobs(true);
      const { data, error } = await fetchCompletedJobs(token);
      if (data) {
        setCompletedJobs(data);
      } else if (error) {
        showError(error);
      }
      setFetchingJobs(false);
    };
    getCompletedJobs();
  }, [token]);

  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-gray-800">Your Completed Jobs</CardTitle>
      </CardHeader>
      <CardContent>
        {fetchingJobs ? (
          <p className="text-gray-600">Loading completed jobs...</p>
        ) : completedJobs.length === 0 ? (
          <p className="text-gray-600">You have not completed any jobs yet.</p>
        ) : (
          <CompletedJobsTable jobs={completedJobs} />
        )}
      </CardContent>
    </Card>
  );
};

export default EmployeeCompletedJobs;
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Briefcase, Hourglass, CheckCircle2, SearchCheck } from 'lucide-react'; // Icons for jobs, added SearchCheck for Under Review
import { useAuth } from '../../context/AuthContext';
import { fetchEmployeeAllJobs } from '../../api/employee'; // Import the new API function
import { showError } from '../../utils/toast';
import { Job } from '../../types/api';

const EmployeeOverview = () => {
  const { token } = useAuth();
  const [totalJobs, setTotalJobs] = useState(0);
  const [inProgressJobs, setInProgressJobs] = useState(0);
  const [underReviewJobs, setUnderReviewJobs] = useState(0); // New state for jobs under review
  const [completedJobs, setCompletedJobs] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const { data: jobsData, error: jobsError } = await fetchEmployeeAllJobs(token);
        if (jobsData) {
          setTotalJobs(jobsData.length);
          setInProgressJobs(jobsData.filter(job => job.status === 'In Progress').length);
          setUnderReviewJobs(jobsData.filter(job => job.status === 'Under Review').length); // Calculate jobs under review
          setCompletedJobs(jobsData.filter(job => job.status === 'Completed').length);
        } else if (jobsError) {
          showError(jobsError);
        }
      } catch (err) {
        showError('Failed to fetch employee overview data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-[200px]">Loading employee overview...</div>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"> {/* Adjusted grid for 4 cards */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Assigned Jobs</CardTitle>
          <Briefcase className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalJobs}</div>
          <p className="text-xs text-muted-foreground">
            All jobs assigned to you.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Jobs In Progress</CardTitle>
          <Hourglass className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{inProgressJobs}</div>
          <p className="text-xs text-muted-foreground">
            Currently working on {inProgressJobs} jobs.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Jobs Under Review</CardTitle>
          <SearchCheck className="h-4 w-4 text-muted-foreground" /> {/* New card for jobs under review */}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{underReviewJobs}</div>
          <p className="text-xs text-muted-foreground">
            {underReviewJobs} jobs are currently under review.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completed Jobs</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completedJobs}</div>
          <p className="text-xs text-muted-foreground">
            You have completed {completedJobs} jobs.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeOverview;
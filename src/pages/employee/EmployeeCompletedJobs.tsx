"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchCompletedJobs } from '../../api/employee'; // Import API function
import { showError } from '../../utils/toast';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';

interface CompletedJob {
  _id: string;
  title: string;
  client: string;
  completionDate: string; // Assuming the backend provides this
  feedback?: string; // Optional feedback field
}

const EmployeeCompletedJobs = () => {
  const { token } = useAuth();
  const [completedJobs, setCompletedJobs] = useState<CompletedJob[]>([]);
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
        setCompletedJobs(data.map(job => ({
          _id: job._id,
          title: job.title,
          client: job.client,
          completionDate: job.dueDate, // Using dueDate as completionDate for now
          feedback: "No feedback yet." // Placeholder feedback
        })));
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
                {completedJobs.map((job) => (
                  <TableRow key={job._id}>
                    <TableCell className="font-medium">{job._id}</TableCell>
                    <TableCell>{job.title}</TableCell>
                    <TableCell>{job.client}</TableCell>
                    <TableCell>{job.completionDate}</TableCell>
                    <TableCell className="max-w-xs truncate">{job.feedback}</TableCell>
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

export default EmployeeCompletedJobs;
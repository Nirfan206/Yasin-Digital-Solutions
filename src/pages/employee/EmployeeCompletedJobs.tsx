"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchCompletedJobs } from '../../api/employee'; // Import API function
import { showError } from '../../utils/toast';

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
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Completed Jobs</h2>
      {fetchingJobs ? (
        <p className="text-gray-600">Loading completed jobs...</p>
      ) : completedJobs.length === 0 ? (
        <p className="text-gray-600">You have not completed any jobs yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completion Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feedback</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {completedJobs.map((job) => (
                <tr key={job._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{job._id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.client}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.completionDate}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{job.feedback}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EmployeeCompletedJobs;
"use client";

import React, { useState, useEffect } from 'react';
import { showSuccess, showError } from '../../utils/toast';
import { useAuth } from '../../context/AuthContext';
import { fetchAssignedJobs, updateJobStatus } from '../../api/employee'; // Import API functions

interface Job {
  _id: string;
  title: string;
  client: string;
  dueDate: string;
  status: 'Assigned' | 'In Progress' | 'Under Review' | 'Completed';
  priority: 'High' | 'Medium' | 'Low';
}

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
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Assigned Jobs</h2>
      {fetchingJobs ? (
        <p className="text-gray-600">Loading assigned jobs...</p>
      ) : jobs.length === 0 ? (
        <p className="text-gray-600">You currently have no assigned jobs.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {jobs.map((job) => (
                <tr key={job._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{job._id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.client}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.dueDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      job.priority === 'High' ? 'bg-red-100 text-red-800' :
                      job.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {job.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      job.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      job.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                      job.status === 'Assigned' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <select
                      value={job.status}
                      onChange={(e) => handleStatusChange(job._id, e.target.value as Job['status'])}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      disabled={updatingStatus === job._id}
                    >
                      <option value="Assigned">Assigned</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EmployeeAssignedJobs;
"use client";

import React, { useState } from 'react';
import { showSuccess, showError } from '../../utils/toast';

interface Job {
  id: string;
  title: string;
  client: string;
  dueDate: string;
  status: 'Assigned' | 'In Progress' | 'Under Review';
  priority: 'High' | 'Medium' | 'Low';
}

const EmployeeAssignedJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([
    // Mock data for demonstration
    { id: 'JOB001', title: 'Develop E-commerce Frontend', client: 'Alice Smith', dueDate: '2024-04-30', status: 'In Progress', priority: 'High' },
    { id: 'JOB002', title: 'SEO Keyword Research', client: 'Bob Johnson', dueDate: '2024-04-20', status: 'Assigned', priority: 'Medium' },
    { id: 'JOB003', title: 'Bug Fix: Login Page', client: 'Charlie Brown', dueDate: '2024-04-15', status: 'Under Review', priority: 'High' },
  ]);

  const handleStatusChange = async (jobId: string, newStatus: Job['status']) => {
    // In a real MERN app, you'd send a PUT request to your backend to update the job status
    // For now, we'll simulate success and update mock data
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      setJobs(prevJobs =>
        prevJobs.map(job =>
          job.id === jobId ? { ...job, status: newStatus } : job
        )
      );
      showSuccess(`Job ${jobId} status updated to ${newStatus}.`);
    } catch (error) {
      showError('Failed to update job status.');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Assigned Jobs</h2>
      {jobs.length === 0 ? (
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
                <tr key={job.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{job.id}</td>
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
                      onChange={(e) => handleStatusChange(job.id, e.target.value as Job['status'])}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="Assigned">Assigned</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Under Review">Under Review</option>
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
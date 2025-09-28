"use client";

import React from 'react';

interface CompletedJob {
  id: string;
  title: string;
  client: string;
  completionDate: string;
  feedback: string;
}

const EmployeeCompletedJobs = () => {
  const completedJobs: CompletedJob[] = [
    // Mock data for demonstration
    { id: 'JOB004', title: 'Design Landing Page', client: 'Green Solutions', completionDate: '2024-03-25', feedback: 'Excellent work, very satisfied!' },
    { id: 'JOB005', title: 'Setup CRM Integration', client: 'Tech Innovations', completionDate: '2024-03-10', feedback: 'Smooth integration, no issues.' },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Completed Jobs</h2>
      {completedJobs.length === 0 ? (
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
                <tr key={job.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{job.id}</td>
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
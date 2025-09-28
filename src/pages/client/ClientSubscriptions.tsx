"use client";

import React from 'react';

interface Subscription {
  id: string;
  serviceName: string;
  startDate: string;
  nextRenewalDate: string;
  status: 'Active' | 'Expired' | 'Pending';
}

const ClientSubscriptions = () => {
  const subscriptions: Subscription[] = [
    // Mock data for demonstration
    { id: 'SUB001', serviceName: 'Premium Website Hosting', startDate: '2023-01-01', nextRenewalDate: '2024-01-01', status: 'Active' },
    { id: 'SUB002', serviceName: 'Monthly SEO Package', startDate: '2023-03-10', nextRenewalDate: '2024-03-10', status: 'Active' },
    { id: 'SUB003', serviceName: 'Basic App Maintenance', startDate: '2022-11-01', nextRenewalDate: '2023-11-01', status: 'Expired' },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Subscriptions</h2>
      {subscriptions.length === 0 ? (
        <p className="text-gray-600">You currently have no active subscriptions.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Renewal</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {subscriptions.map((sub) => (
                <tr key={sub.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{sub.serviceName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sub.startDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sub.nextRenewalDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      sub.status === 'Active' ? 'bg-green-100 text-green-800' :
                      sub.status === 'Expired' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {sub.status}
                    </span>
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

export default ClientSubscriptions;
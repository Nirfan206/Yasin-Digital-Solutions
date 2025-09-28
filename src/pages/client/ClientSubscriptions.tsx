"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchClientSubscriptions } from '../../api/client'; // Import API function
import { showError } from '../../utils/toast';

interface Subscription {
  _id: string; // Changed to _id to match typical MongoDB IDs
  serviceName: string;
  startDate: string;
  nextRenewalDate: string;
  status: 'Active' | 'Expired' | 'Pending';
}

const ClientSubscriptions = () => {
  const { token } = useAuth();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [fetchingSubscriptions, setFetchingSubscriptions] = useState(true);

  useEffect(() => {
    const getSubscriptions = async () => {
      if (!token) {
        setFetchingSubscriptions(false);
        return;
      }
      setFetchingSubscriptions(true);
      const { data, error } = await fetchClientSubscriptions(token);
      if (data) {
        setSubscriptions(data);
      } else if (error) {
        showError(error);
      }
      setFetchingSubscriptions(false);
    };
    getSubscriptions();
  }, [token]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Subscriptions</h2>
      {fetchingSubscriptions ? (
        <p className="text-gray-600">Loading subscriptions...</p>
      ) : subscriptions.length === 0 ? (
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
                <tr key={sub._id}>
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
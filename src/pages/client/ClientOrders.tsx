"use client";

import React, { useState, useEffect } from 'react';
import { showSuccess, showError } from '../../utils/toast';
import { useAuth } from '../../context/AuthContext';
import { fetchClientOrders, createClientOrder } from '../../api/client'; // Import API functions

interface Order {
  _id: string; // Changed to _id to match typical MongoDB IDs
  serviceType: string;
  requirements: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
  orderDate: string;
}

const ClientOrders = () => {
  const { token } = useAuth();
  const [serviceType, setServiceType] = useState('');
  const [requirements, setRequirements] = useState('');
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [fetchingOrders, setFetchingOrders] = useState(true);

  useEffect(() => {
    const getOrders = async () => {
      if (!token) {
        setFetchingOrders(false);
        return;
      }
      setFetchingOrders(true);
      const { data, error } = await fetchClientOrders(token);
      if (data) {
        setOrders(data);
      } else if (error) {
        showError(error);
      }
      setFetchingOrders(false);
    };
    getOrders();
  }, [token]);

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceType || !requirements) {
      showError('Please select a service type and describe your requirements.');
      return;
    }
    if (!token) {
      showError('You must be logged in to place an order.');
      return;
    }

    setLoading(true);
    try {
      const { data: newOrder, error } = await createClientOrder(token, serviceType, requirements);
      if (newOrder) {
        setOrders(prevOrders => [...prevOrders, newOrder]);
        showSuccess('Order placed successfully! We will review your request shortly.');
        setServiceType('');
        setRequirements('');
      } else if (error) {
        showError(error);
      }
    } catch (error) {
      showError('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Book a New Order</h2>
        <form onSubmit={handleOrderSubmit} className="space-y-4 max-w-lg">
          <div>
            <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700">Service Type</label>
            <select
              id="serviceType"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              required
            >
              <option value="">Select a service</option>
              <option value="Website Building">Website Building</option>
              <option value="App Development">App Development</option>
              <option value="Digital Marketing">Digital Marketing</option>
            </select>
          </div>
          <div>
            <label htmlFor="requirements" className="block text-sm font-medium text-gray-700">Project Requirements</label>
            <textarea
              id="requirements"
              rows={5}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              placeholder="Describe your project in detail..."
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Place Order'}
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Orders</h2>
        {fetchingOrders ? (
          <p className="text-gray-600">Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-600">You have no orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Type</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requirements</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order._id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.serviceType}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{order.requirements}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.orderDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientOrders;
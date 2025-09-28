"use client";

import React, { useState } from 'react';
import { showSuccess, showError } from '../../utils/toast';

interface Order {
  id: string;
  clientName: string;
  clientEmail: string;
  serviceType: string;
  requirements: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
  orderDate: string;
}

const AdminOrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>([
    // Mock data for demonstration
    { id: 'ORD001', clientName: 'Alice Smith', clientEmail: 'alice@example.com', serviceType: 'Website Building', requirements: 'E-commerce site for clothing brand.', status: 'In Progress', orderDate: '2023-01-15' },
    { id: 'ORD002', clientName: 'Bob Johnson', clientEmail: 'bob@example.com', serviceType: 'Digital Marketing', requirements: 'SEO campaign for local business.', status: 'Completed', orderDate: '2023-02-01' },
    { id: 'ORD003', clientName: 'Charlie Brown', clientEmail: 'charlie@example.com', serviceType: 'App Development', requirements: 'Mobile app for fitness tracking.', status: 'Pending', orderDate: '2023-03-10' },
  ]);

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    // In a real MERN app, you'd send a PUT request to your backend to update the order status
    // For now, we'll simulate success and update mock data
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      showSuccess(`Order ${orderId} status updated to ${newStatus}.`);
    } catch (error) {
      showError('Failed to update order status.');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Order Management</h2>
      {orders.length === 0 ? (
        <p className="text-gray-600">No orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Type</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requirements</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.clientName} ({order.clientEmail})</td>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
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

export default AdminOrderManagement;
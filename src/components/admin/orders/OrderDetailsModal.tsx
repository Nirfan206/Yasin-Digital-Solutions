"use client";

import React from 'react';
import Modal from '../../Modal';
import { Button } from '../../ui/button';
import { Order } from '../../../types/api';

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

const OrderDetailsModal = ({ isOpen, onClose, order }: OrderDetailsModalProps) => {
  if (!order) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Order Details: #${order._id?.slice(-6)}`}
      description={`Service: ${order.serviceType}`}
      footer={
        <Button onClick={onClose}>Close</Button>
      }
    >
      <div className="space-y-4 text-gray-700">
        <p><strong>Order ID:</strong> {order._id}</p>
        <p><strong>Client:</strong> {order.clientName || order.clientEmail || 'N/A'}</p>
        <p><strong>Client Email:</strong> {order.clientEmail || 'N/A'}</p>
        <p><strong>Service Type:</strong> {order.serviceType}</p>
        <p><strong>Status:</strong>
          <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            order.status === 'Completed' ? 'bg-green-100 text-green-800' :
            order.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
            order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
            order.status === 'Under Review' ? 'bg-purple-100 text-purple-800' :
            'bg-red-100 text-red-800'
          }`}>
            {order.status}
          </span>
        </p>
        <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleString()}</p>
        <p><strong>Requirements:</strong></p>
        <p className="whitespace-pre-wrap border p-3 rounded-md bg-gray-50">{order.requirements}</p>
      </div>
    </Modal>
  );
};

export default OrderDetailsModal;
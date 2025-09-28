"use client";

import React from 'react';
import Modal from '../../Modal';
import { Button } from '../../ui/button';
import { Subscription, Client } from '../../../types/api';

interface SubscriptionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscription: Subscription | null;
  getClientName: (clientId: string | undefined) => string;
}

const SubscriptionDetailsModal = ({ isOpen, onClose, subscription, getClientName }: SubscriptionDetailsModalProps) => {
  if (!subscription) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Subscription Details: #${subscription._id?.slice(-6)}`}
      description={`Service: ${subscription.serviceName}`}
      footer={
        <Button onClick={onClose}>Close</Button>
      }
    >
      <div className="space-y-4 text-gray-700">
        <p><strong>Subscription ID:</strong> {subscription._id}</p>
        <p><strong>Client:</strong> {getClientName(subscription.clientId)}</p>
        <p><strong>Service Name:</strong> {subscription.serviceName}</p>
        <p><strong>Start Date:</strong> {new Date(subscription.startDate).toLocaleDateString()}</p>
        <p><strong>Next Renewal Date:</strong> {new Date(subscription.nextRenewalDate).toLocaleDateString()}</p>
        <p><strong>Status:</strong>
          <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            subscription.status === 'Active' ? 'bg-green-100 text-green-800' :
            subscription.status === 'Expired' ? 'bg-red-100 text-red-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {subscription.status}
          </span>
        </p>
      </div>
    </Modal>
  );
};

export default SubscriptionDetailsModal;
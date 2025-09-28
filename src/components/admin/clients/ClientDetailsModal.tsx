"use client";

import React from 'react';
import Modal from '../../Modal';
import { Button } from '../../ui/button';
import { Client } from '../../../types/api';

interface ClientDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client | null;
}

const ClientDetailsModal = ({ isOpen, onClose, client }: ClientDetailsModalProps) => {
  if (!client) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Client Details: ${client.name || 'N/A'}`}
      description={client.email}
      footer={
        <Button onClick={onClose}>Close</Button>
      }
    >
      <div className="space-y-4 text-gray-700">
        <p><strong>Client ID:</strong> {client.id}</p>
        <p><strong>Name:</strong> {client.name}</p>
        <p><strong>Email:</strong> {client.email}</p>
        <p><strong>Status:</strong>
          <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            client.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {client.status}
          </span>
        </p>
        <p><strong>Registered Date:</strong> {new Date(client.registeredDate).toLocaleDateString()}</p>
      </div>
    </Modal>
  );
};

export default ClientDetailsModal;
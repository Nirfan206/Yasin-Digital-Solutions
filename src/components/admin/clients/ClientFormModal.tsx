"use client";

import React, { useState, useEffect } from 'react';
import Modal from '../../Modal';
import { Button } from '../../ui/button';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Client } from '../../../types/api';

interface ClientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentClient: Client | null;
  onSubmit: (clientData: Omit<Client, 'id' | 'registeredDate'>) => void;
  loading: boolean;
}

const ClientFormModal = ({ isOpen, onClose, currentClient, onSubmit, loading }: ClientFormModalProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');

  useEffect(() => {
    if (currentClient) {
      setName(currentClient.name);
      setEmail(currentClient.email);
      setStatus(currentClient.status);
    } else {
      setName('');
      setEmail('');
      setStatus('Active');
    }
  }, [currentClient]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, email, status });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={currentClient ? 'Edit Client' : 'Add New Client'}
      footer={
        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="client-form"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Client'}
          </Button>
        </div>
      }
    >
      <form id="client-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="clientName">Name</Label>
          <Input
            type="text"
            id="clientName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="clientEmail">Email</Label>
          <Input
            type="email"
            id="clientEmail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="clientStatus">Status</Label>
          <Select value={status} onValueChange={(value: 'Active' | 'Inactive') => setStatus(value)} disabled={loading}>
            <SelectTrigger id="clientStatus">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </form>
    </Modal>
  );
};

export default ClientFormModal;
"use client";

import React, { useState, useEffect } from 'react';
import Modal from '../../Modal';
import { Button } from '../../ui/button';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Subscription, Client } from '../../../types/api';

interface SubscriptionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSubscription: Subscription | null;
  clients: Client[];
  onSubmit: (subscriptionData: Omit<Subscription, '_id'>) => void;
  loading: boolean;
}

const SubscriptionFormModal = ({ isOpen, onClose, currentSubscription, clients, onSubmit, loading }: SubscriptionFormModalProps) => {
  const [clientId, setClientId] = useState('');
  const [serviceName, setServiceName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [nextRenewalDate, setNextRenewalDate] = useState('');
  const [status, setStatus] = useState<Subscription['status']>('Active');

  useEffect(() => {
    if (currentSubscription) {
      setClientId(currentSubscription.clientId || '');
      setServiceName(currentSubscription.serviceName);
      setStartDate(currentSubscription.startDate.split('T')[0]);
      setNextRenewalDate(currentSubscription.nextRenewalDate.split('T')[0]);
      setStatus(currentSubscription.status);
    } else {
      setClientId('');
      setServiceName('');
      setStartDate('');
      setNextRenewalDate('');
      setStatus('Active');
    }
  }, [currentSubscription]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      clientId,
      serviceName,
      startDate,
      nextRenewalDate,
      status,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={currentSubscription ? 'Edit Subscription' : 'Add New Subscription'}
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
            form="subscription-form"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Subscription'}
          </Button>
        </div>
      }
    >
      <form id="subscription-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="clientId">Client</Label>
          <Select value={clientId} onValueChange={setClientId} disabled={loading} required>
            <SelectTrigger id="clientId">
              <SelectValue placeholder="Select a client" />
            </SelectTrigger>
            <SelectContent>
              {clients.map(client => (
                <SelectItem key={client.id} value={client.id}>{client.name} ({client.email})</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="serviceName">Service Name</Label>
          <Input
            type="text"
            id="serviceName"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="nextRenewalDate">Next Renewal Date</Label>
          <Input
            type="date"
            id="nextRenewalDate"
            value={nextRenewalDate}
            onChange={(e) => setNextRenewalDate(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Select value={status} onValueChange={(value: Subscription['status']) => setStatus(value)} disabled={loading}>
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Expired">Expired</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </form>
    </Modal>
  );
};

export default SubscriptionFormModal;
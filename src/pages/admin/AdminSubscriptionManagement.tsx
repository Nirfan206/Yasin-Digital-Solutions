"use client";

import React, { useState, useEffect } from 'react';
import { showSuccess, showError } from '../../utils/toast';
import { Plus, Edit, Trash2, Eye } from 'lucide-react'; // Added Eye icon
import { useAuth } from '../../context/AuthContext';
import { fetchAllSubscriptions, createSubscription, updateSubscription, deleteSubscription } from '../../api/admin/subscriptions'; // Import subscription API functions from new file
import { fetchAllClients } from '../../api/admin/clients'; // Import client API functions from new file
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import Modal from '../../components/Modal';
import { Subscription, Client } from '../../types/api';

const AdminSubscriptionManagement = () => {
  const { token } = useAuth();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [fetchingData, setFetchingData] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);
  const [clientId, setClientId] = useState('');
  const [serviceName, setServiceName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [nextRenewalDate, setNextRenewalDate] = useState('');
  const [status, setStatus] = useState<Subscription['status']>('Active');
  const [loading, setLoading] = useState(false); // For modal actions

  // State for "View Subscription Details" modal
  const [isSubscriptionDetailsModalOpen, setIsSubscriptionDetailsModalOpen] = useState(false);
  const [selectedSubscriptionForDetails, setSelectedSubscriptionForDetails] = useState<Subscription | null>(null);


  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setFetchingData(false);
        return;
      }
      setFetchingData(true);
      const [subscriptionsResponse, clientsResponse] = await Promise.all([
        fetchAllSubscriptions(token),
        fetchAllClients(token),
      ]);

      if (subscriptionsResponse.data) {
        setSubscriptions(subscriptionsResponse.data);
      } else if (subscriptionsResponse.error) {
        showError(subscriptionsResponse.error);
      }

      if (clientsResponse.data) {
        setClients(clientsResponse.data);
      } else if (clientsResponse.error) {
        showError(clientsResponse.error);
      }
      setFetchingData(false);
    };
    fetchData();
  }, [token]);

  const openModal = (subscription?: Subscription) => {
    if (subscription) {
      setCurrentSubscription(subscription);
      setClientId(subscription.clientId || ''); // Assuming clientId is part of Subscription
      setServiceName(subscription.serviceName);
      setStartDate(subscription.startDate.split('T')[0]);
      setNextRenewalDate(subscription.nextRenewalDate.split('T')[0]);
      setStatus(subscription.status);
    } else {
      setCurrentSubscription(null);
      setClientId('');
      setServiceName('');
      setStartDate('');
      setNextRenewalDate('');
      setStatus('Active');
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      showError('You must be logged in to manage subscriptions.');
      return;
    }
    if (!clientId || !serviceName || !startDate || !nextRenewalDate) {
      showError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      if (currentSubscription) {
        // Update subscription
        const { data, error } = await updateSubscription(
          token,
          currentSubscription._id,
          clientId,
          serviceName,
          startDate,
          nextRenewalDate,
          status
        );
        if (data) {
          setSubscriptions(prevSubs =>
            prevSubs.map(sub =>
              sub._id === currentSubscription._id ? { ...sub, ...data } : sub
            )
          );
          showSuccess('Subscription updated successfully!');
        } else if (error) {
          showError(error);
        }
      } else {
        // Create new subscription
        const { data, error } = await createSubscription(
          token,
          clientId,
          serviceName,
          startDate,
          nextRenewalDate,
          status
        );
        if (data) {
          setSubscriptions(prevSubs => [...prevSubs, data]);
          showSuccess('Subscription created successfully!');
        } else if (error) {
          showError(error);
        }
      }
      closeModal();
    } catch (error) {
      showError('Failed to save subscription.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (subscriptionId: string) => {
    if (!window.confirm('Are you sure you want to delete this subscription?')) return;
    if (!token) {
      showError('You must be logged in to delete subscriptions.');
      return;
    }

    setLoading(true);
    try {
      const { message, error } = await deleteSubscription(token, subscriptionId);
      if (message) {
        setSubscriptions(prevSubs => prevSubs.filter(sub => sub._id !== subscriptionId));
        showSuccess('Subscription deleted successfully!');
      } else if (error) {
        showError(error);
      }
    } catch (error) {
      showError('Failed to delete subscription.');
    } finally {
      setLoading(false);
    }
  };

  const getClientName = (id: string | undefined) => {
    return clients.find(client => client.id === id)?.name || 'N/A';
  };

  const openSubscriptionDetailsModal = (subscription: Subscription) => {
    setSelectedSubscriptionForDetails(subscription);
    setIsSubscriptionDetailsModalOpen(true);
  };

  const closeSubscriptionDetailsModal = () => {
    setIsSubscriptionDetailsModalOpen(false);
    setSelectedSubscriptionForDetails(null);
  };

  return (
    <Card className="w-full mx-auto">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="text-2xl font-semibold text-gray-800">Subscription Management</CardTitle>
        <Button
          onClick={() => openModal()}
          className="flex items-center space-x-2"
        >
          <Plus size={18} />
          <span>Add Subscription</span>
        </Button>
      </CardHeader>
      <CardContent>
        {fetchingData ? (
          <p className="text-gray-600">Loading subscriptions...</p>
        ) : subscriptions.length === 0 ? (
          <p className="text-gray-600">No subscriptions found.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subscription ID</TableHead> {/* Added Subscription ID */}
                  <TableHead>Client</TableHead>
                  <TableHead>Service Name</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>Next Renewal</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscriptions.map((sub) => (
                  <TableRow key={sub._id}>
                    <TableCell className="font-medium">...{sub._id.slice(-6)}</TableCell> {/* Truncated ID */}
                    <TableCell className="font-medium">{getClientName(sub.clientId)}</TableCell>
                    <TableCell>{sub.serviceName}</TableCell>
                    <TableCell>{new Date(sub.startDate).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(sub.nextRenewalDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        sub.status === 'Active' ? 'bg-green-100 text-green-800' :
                        sub.status === 'Expired' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {sub.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openSubscriptionDetailsModal(sub)}
                        className="mr-2"
                        title="View Subscription Details"
                      >
                        <Eye size={18} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openModal(sub)}
                        className="mr-2"
                        disabled={loading}
                      >
                        <Edit size={18} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(sub._id)}
                        disabled={loading}
                      >
                        <Trash2 size={18} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={currentSubscription ? 'Edit Subscription' : 'Add New Subscription'}
          footer={
            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={closeModal}
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

        {/* Subscription Details Modal */}
        <Modal
          isOpen={isSubscriptionDetailsModalOpen}
          onClose={closeSubscriptionDetailsModal}
          title={`Subscription Details: #${selectedSubscriptionForDetails?._id?.slice(-6)}`}
          description={`Service: ${selectedSubscriptionForDetails?.serviceName}`}
          footer={
            <Button onClick={closeSubscriptionDetailsModal}>Close</Button>
          }
        >
          {selectedSubscriptionForDetails && (
            <div className="space-y-4 text-gray-700">
              <p><strong>Subscription ID:</strong> {selectedSubscriptionForDetails._id}</p>
              <p><strong>Client:</strong> {getClientName(selectedSubscriptionForDetails.clientId)}</p>
              <p><strong>Service Name:</strong> {selectedSubscriptionForDetails.serviceName}</p>
              <p><strong>Start Date:</strong> {new Date(selectedSubscriptionForDetails.startDate).toLocaleDateString()}</p>
              <p><strong>Next Renewal Date:</strong> {new Date(selectedSubscriptionForDetails.nextRenewalDate).toLocaleDateString()}</p>
              <p><strong>Status:</strong>
                <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  selectedSubscriptionForDetails.status === 'Active' ? 'bg-green-100 text-green-800' :
                  selectedSubscriptionForDetails.status === 'Expired' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {selectedSubscriptionForDetails.status}
                </span>
              </p>
            </div>
          )}
        </Modal>
      </CardContent>
    </Card>
  );
};

export default AdminSubscriptionManagement;
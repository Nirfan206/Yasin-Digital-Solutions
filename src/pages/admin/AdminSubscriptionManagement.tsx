"use client";

import React, { useState, useEffect } from 'react';
import { showSuccess, showError } from '../../utils/toast';
import { Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { fetchAllSubscriptions, createSubscription, updateSubscription, deleteSubscription } from '../../api/admin/subscriptions';
import { fetchAllClients } from '../../api/admin/clients';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import SubscriptionTable from '../../components/admin/subscriptions/SubscriptionTable';
import SubscriptionFormModal from '../../components/admin/subscriptions/SubscriptionFormModal';
import SubscriptionDetailsModal from '../../components/admin/subscriptions/SubscriptionDetailsModal';
import { Subscription, Client } from '../../types/api';
import LoadingSpinner from '../../components/LoadingSpinner'; // Import LoadingSpinner

const AdminSubscriptionManagement = () => {
  const { token } = useAuth();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [fetchingData, setFetchingData] = useState(true);
  const [loadingAction, setLoadingAction] = useState(false); // For modal actions (save/delete)

  // Modals state
  const [isSubscriptionFormModalOpen, setIsSubscriptionFormModalOpen] = useState(false);
  const [currentSubscriptionForForm, setCurrentSubscriptionForForm] = useState<Subscription | null>(null);
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

  const handleOpenSubscriptionFormModal = (subscription?: Subscription) => {
    setCurrentSubscriptionForForm(subscription || null);
    setIsSubscriptionFormModalOpen(true);
  };

  const handleCloseSubscriptionFormModal = () => {
    setIsSubscriptionFormModalOpen(false);
    setCurrentSubscriptionForForm(null);
  };

  const handleSubscriptionFormSubmit = async (subscriptionData: Omit<Subscription, '_id'>) => {
    if (!token) {
      showError('You must be logged in to manage subscriptions.');
      return;
    }
    setLoadingAction(true);
    try {
      if (currentSubscriptionForForm) {
        // Update subscription
        const { data, error } = await updateSubscription(
          token,
          currentSubscriptionForForm._id,
          subscriptionData.clientId,
          subscriptionData.serviceName,
          subscriptionData.startDate,
          subscriptionData.nextRenewalDate,
          subscriptionData.status
        );
        if (data) {
          setSubscriptions(prevSubs =>
            prevSubs.map(sub =>
              sub._id === currentSubscriptionForForm._id ? { ...sub, ...data } : sub
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
          subscriptionData.clientId,
          subscriptionData.serviceName,
          subscriptionData.startDate,
          subscriptionData.nextRenewalDate,
          subscriptionData.status
        );
        if (data) {
          setSubscriptions(prevSubs => [...prevSubs, data]);
          showSuccess('Subscription created successfully!');
        } else if (error) {
          showError(error);
        }
      }
      handleCloseSubscriptionFormModal();
    } catch (error) {
      showError('Failed to save subscription.');
    } finally {
      setLoadingAction(false);
    }
  };

  const handleDeleteSubscription = async (subscriptionId: string) => {
    if (!window.confirm('Are you sure you want to delete this subscription?')) return;
    if (!token) {
      showError('You must be logged in to delete subscriptions.');
      return;
    }

    setLoadingAction(true);
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
      setLoadingAction(false);
    }
  };

  const handleOpenSubscriptionDetailsModal = (subscription: Subscription) => {
    setSelectedSubscriptionForDetails(subscription);
    setIsSubscriptionDetailsModalOpen(true);
  };

  const handleCloseSubscriptionDetailsModal = () => {
    setIsSubscriptionDetailsModalOpen(false);
    setSelectedSubscriptionForDetails(null);
  };

  const getClientName = (id: string | undefined) => {
    return clients.find(client => client.id === id)?.name || 'N/A';
  };

  return (
    <Card className="w-full mx-auto">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="text-2xl font-semibold text-gray-800">Subscription Management</CardTitle>
        <Button
          onClick={() => handleOpenSubscriptionFormModal()}
          className="flex items-center space-x-2"
        >
          <Plus size={18} />
          <span>Add Subscription</span>
        </Button>
      </CardHeader>
      <CardContent>
        {fetchingData ? (
          <div className="flex justify-center items-center min-h-[100px]">
            <LoadingSpinner size={30} />
          </div>
        ) : subscriptions.length === 0 ? (
          <p className="text-gray-600">No subscriptions found.</p>
        ) : (
          <SubscriptionTable
            subscriptions={subscriptions}
            getClientName={getClientName}
            onOpenEditModal={handleOpenSubscriptionFormModal}
            onDeleteSubscription={handleDeleteSubscription}
            onOpenSubscriptionDetailsModal={handleOpenSubscriptionDetailsModal}
            loadingAction={loadingAction}
          />
        )}

        <SubscriptionFormModal
          isOpen={isSubscriptionFormModalOpen}
          onClose={handleCloseSubscriptionFormModal}
          currentSubscription={currentSubscriptionForForm}
          clients={clients}
          onSubmit={handleSubscriptionFormSubmit}
          loading={loadingAction}
        />

        <SubscriptionDetailsModal
          isOpen={isSubscriptionDetailsModalOpen}
          onClose={handleCloseSubscriptionDetailsModal}
          subscription={selectedSubscriptionForDetails}
          getClientName={getClientName}
        />
      </CardContent>
    </Card>
  );
};

export default AdminSubscriptionManagement;
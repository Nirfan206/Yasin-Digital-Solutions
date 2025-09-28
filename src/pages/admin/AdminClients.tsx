"use client";

import React, { useState, useEffect } from 'react';
import { showSuccess, showError } from '../../utils/toast';
import { Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { fetchAllClients, createClient, updateClient, deleteClient } from '../../api/admin/clients';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import ClientTable from '../../components/admin/clients/ClientTable';
import ClientFormModal from '../../components/admin/clients/ClientFormModal';
import ClientDetailsModal from '../../components/admin/clients/ClientDetailsModal';
import { Client } from '../../types/api';

const AdminClients = () => {
  const { token } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [fetchingClients, setFetchingClients] = useState(true);
  const [loadingAction, setLoadingAction] = useState(false); // For modal actions (save/delete)

  // Modals state
  const [isClientFormModalOpen, setIsClientFormModalOpen] = useState(false);
  const [currentClientForForm, setCurrentClientForForm] = useState<Client | null>(null);
  const [isClientDetailsModalOpen, setIsClientDetailsModalOpen] = useState(false);
  const [selectedClientForDetails, setSelectedClientForDetails] = useState<Client | null>(null);

  useEffect(() => {
    const getClients = async () => {
      if (!token) {
        setFetchingClients(false);
        return;
      }
      setFetchingClients(true);
      const { data, error } = await fetchAllClients(token);
      if (data) {
        setClients(data);
      } else if (error) {
        showError(error);
      }
      setFetchingClients(false);
    };
    getClients();
  }, [token]);

  const handleOpenClientFormModal = (client?: Client) => {
    setCurrentClientForForm(client || null);
    setIsClientFormModalOpen(true);
  };

  const handleCloseClientFormModal = () => {
    setIsClientFormModalOpen(false);
    setCurrentClientForForm(null);
  };

  const handleClientFormSubmit = async (clientData: Omit<Client, 'id' | 'registeredDate'>) => {
    if (!token) {
      showError('You must be logged in to manage clients.');
      return;
    }
    setLoadingAction(true);
    try {
      if (currentClientForForm) {
        // Update client
        const { data, error } = await updateClient(token, currentClientForForm.id, clientData.name, clientData.email, clientData.status);
        if (data) {
          setClients(prevClients =>
            prevClients.map(client =>
              client.id === currentClientForForm.id ? { ...client, name: data.name, email: data.email, status: data.status } : client
            )
          );
          showSuccess('Client updated successfully!');
        } else if (error) {
          showError(error);
        }
      } else {
        // Create new client
        const { data, error } = await createClient(token, clientData.name, clientData.email, clientData.status);
        if (data) {
          setClients(prevClients => [...prevClients, data]);
          showSuccess('Client created successfully!');
        } else if (error) {
          showError(error);
        }
      }
      handleCloseClientFormModal();
    } catch (error) {
      showError('Failed to save client.');
    } finally {
      setLoadingAction(false);
    }
  };

  const handleDeleteClient = async (clientId: string) => {
    if (!window.confirm('Are you sure you want to delete this client?')) return;
    if (!token) {
      showError('You must be logged in to delete clients.');
      return;
    }

    setLoadingAction(true);
    try {
      const { message, error } = await deleteClient(token, clientId);
      if (message) {
        setClients(prevClients => prevClients.filter(client => client.id !== clientId));
        showSuccess('Client deleted successfully!');
      } else if (error) {
        showError(error);
      }
    } catch (error) {
      showError('Failed to delete client.');
    } finally {
      setLoadingAction(false);
    }
  };

  const handleOpenClientDetailsModal = (client: Client) => {
    setSelectedClientForDetails(client);
    setIsClientDetailsModalOpen(true);
  };

  const handleCloseClientDetailsModal = () => {
    setIsClientDetailsModalOpen(false);
    setSelectedClientForDetails(null);
  };

  return (
    <Card className="w-full mx-auto">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="text-2xl font-semibold text-gray-800">Client Management</CardTitle>
        <Button
          onClick={() => handleOpenClientFormModal()}
          className="flex items-center space-x-2"
        >
          <Plus size={18} />
          <span>Add Client</span>
        </Button>
      </CardHeader>
      <CardContent>
        {fetchingClients ? (
          <p className="text-gray-600">Loading clients...</p>
        ) : clients.length === 0 ? (
          <p className="text-gray-600">No clients found.</p>
        ) : (
          <ClientTable
            clients={clients}
            onOpenEditModal={handleOpenClientFormModal}
            onDeleteClient={handleDeleteClient}
            onOpenClientDetailsModal={handleOpenClientDetailsModal}
            loadingAction={loadingAction}
          />
        )}

        <ClientFormModal
          isOpen={isClientFormModalOpen}
          onClose={handleCloseClientFormModal}
          currentClient={currentClientForForm}
          onSubmit={handleClientFormSubmit}
          loading={loadingAction}
        />

        <ClientDetailsModal
          isOpen={isClientDetailsModalOpen}
          onClose={handleCloseClientDetailsModal}
          client={selectedClientForDetails}
        />
      </CardContent>
    </Card>
  );
};

export default AdminClients;
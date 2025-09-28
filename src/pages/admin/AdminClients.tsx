"use client";

import React, { useState, useEffect } from 'react';
import { showSuccess, showError } from '../../utils/toast';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { fetchAllClients, createClient, updateClient, deleteClient } from '../../api/admin/clients'; // Import API functions from new file
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import Modal from '../../components/Modal';
import { Client } from '../../types/api';

const AdminClients = () => {
  const { token } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [fetchingClients, setFetchingClients] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentClient, setCurrentClient] = useState<Client | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');
  const [loading, setLoading] = useState(false); // For modal actions

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

  const openModal = (client?: Client) => {
    if (client) {
      setCurrentClient(client);
      setName(client.name);
      setEmail(client.email);
      setStatus(client.status);
    } else {
      setCurrentClient(null);
      setName('');
      setEmail('');
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
      showError('You must be logged in to manage clients.');
      return;
    }
    setLoading(true);
    try {
      if (currentClient) {
        // Update client
        const { data, error } = await updateClient(token, currentClient.id, name, email, status);
        if (data) {
          setClients(prevClients =>
            prevClients.map(client =>
              client.id === currentClient.id ? { ...client, name: data.name, email: data.email, status: data.status } : client
            )
          );
          showSuccess('Client updated successfully!');
        } else if (error) {
          showError(error);
        }
      } else {
        // Create new client
        const { data, error } = await createClient(token, name, email, status);
        if (data) {
          setClients(prevClients => [...prevClients, data]);
          showSuccess('Client created successfully!');
        } else if (error) {
          showError(error);
        }
      }
      closeModal();
    } catch (error) {
      showError('Failed to save client.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (clientId: string) => {
    if (!window.confirm('Are you sure you want to delete this client?')) return;
    if (!token) {
      showError('You must be logged in to delete clients.');
      return;
    }

    setLoading(true);
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
      setLoading(false);
    }
  };

  return (
    <Card className="w-full mx-auto">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="text-2xl font-semibold text-gray-800">Client Management</CardTitle>
        <Button
          onClick={() => openModal()}
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
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Registered Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        client.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {client.status}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(client.registeredDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openModal(client)}
                        className="mr-2"
                        disabled={loading}
                      >
                        <Edit size={18} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(client.id)}
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
          title={currentClient ? 'Edit Client' : 'Add New Client'}
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
                form="client-form" // Link button to the form
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
      </CardContent>
    </Card>
  );
};

export default AdminClients;
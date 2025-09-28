"use client";

import React, { useState, useEffect } from 'react';
import { showSuccess, showError } from '../../utils/toast';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { fetchAllClients, createClient, updateClient, deleteClient } from '../../api/admin'; // Import API functions

interface Client {
  id: string;
  name: string;
  email: string;
  status: 'Active' | 'Inactive';
  registeredDate: string;
}

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
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">Client Management</h2>
        <button
          onClick={() => openModal()}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} />
          <span>Add Client</span>
        </button>
      </div>

      {fetchingClients ? (
        <p className="text-gray-600">Loading clients...</p>
      ) : clients.length === 0 ? (
        <p className="text-gray-600">No clients found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registered Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clients.map((client) => (
                <tr key={client.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{client.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      client.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {client.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.registeredDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => openModal(client)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                      disabled={loading}
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(client.id)}
                      className="text-red-600 hover:text-red-900"
                      disabled={loading}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for Add/Edit Client */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">{currentClient ? 'Edit Client' : 'Add New Client'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="clientName" className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  id="clientName"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="clientEmail" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  id="clientEmail"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="clientStatus" className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  id="clientStatus"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as 'Active' | 'Inactive')}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminClients;
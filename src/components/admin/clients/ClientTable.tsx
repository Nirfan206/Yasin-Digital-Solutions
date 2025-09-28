"use client";

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Button } from '../../ui/button';
import { Client } from '../../../types/api';
import { Edit, Trash2, Eye } from 'lucide-react';

interface ClientTableProps {
  clients: Client[];
  onOpenEditModal: (client: Client) => void;
  onDeleteClient: (clientId: string) => void;
  onOpenClientDetailsModal: (client: Client) => void;
  loadingAction: boolean;
}

const ClientTable = ({
  clients,
  onOpenEditModal,
  onDeleteClient,
  onOpenClientDetailsModal,
  loadingAction,
}: ClientTableProps) => {
  return (
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
                  onClick={() => onOpenClientDetailsModal(client)}
                  className="mr-2"
                  title="View Client Details"
                >
                  <Eye size={18} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onOpenEditModal(client)}
                  className="mr-2"
                  disabled={loadingAction}
                >
                  <Edit size={18} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeleteClient(client.id)}
                  disabled={loadingAction}
                >
                  <Trash2 size={18} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ClientTable;
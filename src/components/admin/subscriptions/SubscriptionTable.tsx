"use client";

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Button } from '../../ui/button';
import { Subscription } from '../../../types/api';
import { Edit, Trash2, Eye } from 'lucide-react';

interface SubscriptionTableProps {
  subscriptions: Subscription[];
  getClientName: (clientId: string | undefined) => string;
  onOpenEditModal: (subscription: Subscription) => void;
  onDeleteSubscription: (subscriptionId: string) => void;
  onOpenSubscriptionDetailsModal: (subscription: Subscription) => void;
  loadingAction: boolean;
}

const SubscriptionTable = ({
  subscriptions,
  getClientName,
  onOpenEditModal,
  onDeleteSubscription,
  onOpenSubscriptionDetailsModal,
  loadingAction,
}: SubscriptionTableProps) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Subscription ID</TableHead>
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
              <TableCell className="font-medium">...{sub._id.slice(-6)}</TableCell>
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
                  onClick={() => onOpenSubscriptionDetailsModal(sub)}
                  className="mr-2"
                  title="View Subscription Details"
                >
                  <Eye size={18} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onOpenEditModal(sub)}
                  className="mr-2"
                  disabled={loadingAction}
                >
                  <Edit size={18} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeleteSubscription(sub._id)}
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

export default SubscriptionTable;
"use client";

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Button } from '../../ui/button';
import { Order } from '../../../types/api';
import { Loader2, Briefcase, Eye } from 'lucide-react';

interface OrderTableProps {
  orders: Order[];
  updatingStatus: string | null;
  onStatusChange: (orderId: string, newStatus: Order['status']) => void;
  onOpenCreateJobModal: (order: Order) => void;
  onOpenOrderDetailsModal: (order: Order) => void;
  creatingJob: boolean;
}

const OrderTable = ({
  orders,
  updatingStatus,
  onStatusChange,
  onOpenCreateJobModal,
  onOpenOrderDetailsModal,
  creatingJob,
}: OrderTableProps) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Service Type</TableHead>
            <TableHead>Requirements</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Order Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order._id}>
              <TableCell className="font-medium">...{order._id.slice(-6)}</TableCell>
              <TableCell>
                {order.clientName || order.clientEmail || 'N/A'}
                {order.clientName && order.clientEmail && ` (${order.clientEmail})`}
              </TableCell>
              <TableCell>{order.serviceType}</TableCell>
              <TableCell className="max-w-xs truncate">{order.requirements}</TableCell>
              <TableCell>
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                  order.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                  order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                  order.status === 'Under Review' ? 'bg-purple-100 text-purple-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {order.status}
                </span>
              </TableCell>
              <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
              <TableCell className="flex items-center space-x-2">
                <Select
                  value={order.status}
                  onValueChange={(value: Order['status']) => onStatusChange(order._id, value)}
                  disabled={updatingStatus === order._id}
                >
                  <SelectTrigger className="w-[180px]">
                    {updatingStatus === order._id ? (
                      <div className="flex items-center space-x-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Updating...</span>
                      </div>
                    ) : (
                      <SelectValue placeholder="Update Status" />
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Under Review">Under Review</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                {order.status === 'Pending' && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onOpenCreateJobModal(order)}
                    title="Create Job from Order"
                    disabled={creatingJob}
                  >
                    <Briefcase size={18} />
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onOpenOrderDetailsModal(order)}
                  title="View Order Details"
                >
                  <Eye size={18} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrderTable;
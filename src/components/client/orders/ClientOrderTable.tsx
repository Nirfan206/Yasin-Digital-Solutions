"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Order } from '../../../types/api';

interface ClientOrderTableProps {
  orders: Order[];
  fetchingOrders: boolean;
}

const ClientOrderTable = ({ orders, fetchingOrders }: ClientOrderTableProps) => {
  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-gray-800">Your Orders</CardTitle>
      </CardHeader>
      <CardContent>
        {fetchingOrders ? (
          <p className="text-gray-600">Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-600">You have no orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Service Type</TableHead>
                  <TableHead>Requirements</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Order Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell className="font-medium">{order._id.slice(-6)}</TableCell>
                    <TableCell>{order.serviceType}</TableCell>
                    <TableCell className="max-w-xs truncate">{order.requirements}</TableCell>
                    <TableCell>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {order.status}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientOrderTable;
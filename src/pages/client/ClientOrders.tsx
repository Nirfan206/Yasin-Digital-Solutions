"use client";

import React, { useState, useEffect } from 'react';
import { showSuccess, showError } from '../../utils/toast';
import { useAuth } from '../../context/AuthContext';
import { fetchClientOrders, createClientOrder } from '../../api/client'; // Import API functions
import { Label } from '../../components/ui/label';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Textarea } from '../../components/ui/textarea'; // Using shadcn/ui Textarea
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'; // Import shadcn/ui Select
import { Order } from '../../types/api'; // Import Order interface

const ClientOrders = () => {
  const { token } = useAuth();
  const [serviceType, setServiceType] = useState('');
  const [requirements, setRequirements] = useState('');
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [fetchingOrders, setFetchingOrders] = useState(true);

  useEffect(() => {
    const getOrders = async () => {
      if (!token) {
        setFetchingOrders(false);
        return;
      }
      setFetchingOrders(true);
      const { data, error } = await fetchClientOrders(token);
      if (data) {
        setOrders(data);
      } else if (error) {
        showError(error);
      }
      setFetchingOrders(false);
    };
    getOrders();
  }, [token]);

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceType || !requirements) {
      showError('Please select a service type and describe your requirements.');
      return;
    }
    if (!token) {
      showError('You must be logged in to place an order.');
      return;
    }

    setLoading(true);
    try {
      const { data: newOrder, error } = await createClientOrder(token, serviceType, requirements);
      if (newOrder) {
        setOrders(prevOrders => [...prevOrders, newOrder]);
        showSuccess('Order placed successfully! We will review your request shortly.');
        setServiceType('');
        setRequirements('');
      } else if (error) {
        showError(error);
      }
    } catch (error) {
      showError('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card className="w-full max-w-lg mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-gray-800">Book a New Order</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleOrderSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="serviceType">Service Type</Label>
              <Select value={serviceType} onValueChange={setServiceType} required>
                <SelectTrigger id="serviceType">
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Website Building">Website Building</SelectItem>
                  <SelectItem value="App Development">App Development</SelectItem>
                  <SelectItem value="Digital Marketing">Digital Marketing</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="requirements">Project Requirements</Label>
              <Textarea
                id="requirements"
                rows={5}
                placeholder="Describe your project in detail..."
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Submitting...' : 'Place Order'}
            </Button>
          </form>
        </CardContent>
      </Card>

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
                      <TableCell className="font-medium">{order._id}</TableCell>
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
    </div>
  );
};

export default ClientOrders;
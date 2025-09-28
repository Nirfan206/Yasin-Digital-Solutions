"use client";

import React, { useState, useEffect } from 'react';
import { showSuccess, showError } from '../../utils/toast';
import { useAuth } from '../../context/AuthContext';
import { fetchClientOrders, createClientOrder } from '../../api/client';
import { Order } from '../../types/api';
import ClientOrderForm from '../../components/client/orders/ClientOrderForm';
import ClientOrderTable from '../../components/client/orders/ClientOrderTable';

const ClientOrders = () => {
  const { token } = useAuth();
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

  const handleOrderSubmit = async (serviceType: string, requirements: string) => {
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
      <ClientOrderForm onSubmit={handleOrderSubmit} loading={loading} />
      <ClientOrderTable orders={orders} fetchingOrders={fetchingOrders} />
    </div>
  );
};

export default ClientOrders;
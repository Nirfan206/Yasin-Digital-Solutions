"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchClientSubscriptions } from '../../api/client'; // Import API function
import { showError } from '../../utils/toast';
import ClientSubscriptionTable from '../../components/client/subscriptions/ClientSubscriptionTable'; // Import new component
import { Subscription } from '../../types/api'; // Import Subscription interface

const ClientSubscriptions = () => {
  const { token } = useAuth();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [fetchingSubscriptions, setFetchingSubscriptions] = useState(true);

  useEffect(() => {
    const getSubscriptions = async () => {
      if (!token) {
        setFetchingSubscriptions(false);
        return;
      }
      setFetchingSubscriptions(true);
      const { data, error } = await fetchClientSubscriptions(token);
      if (data) {
        setSubscriptions(data);
      } else if (error) {
        showError(error);
      }
      setFetchingSubscriptions(false);
    };
    getSubscriptions();
  }, [token]);

  return (
    <ClientSubscriptionTable
      subscriptions={subscriptions}
      fetchingSubscriptions={fetchingSubscriptions}
    />
  );
};

export default ClientSubscriptions;
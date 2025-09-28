"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchClientSubscriptions } from '../../api/client'; // Import API function
import { showError } from '../../utils/toast';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';

interface Subscription {
  _id: string; // Changed to _id to match typical MongoDB IDs
  serviceName: string;
  startDate: string;
  nextRenewalDate: string;
  status: 'Active' | 'Expired' | 'Pending';
}

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
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-gray-800">Your Subscriptions</CardTitle>
      </CardHeader>
      <CardContent>
        {fetchingSubscriptions ? (
          <p className="text-gray-600">Loading subscriptions...</p>
        ) : subscriptions.length === 0 ? (
          <p className="text-gray-600">You currently have no active subscriptions.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>Next Renewal</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscriptions.map((sub) => (
                  <TableRow key={sub._id}>
                    <TableCell className="font-medium">{sub.serviceName}</TableCell>
                    <TableCell>{sub.startDate}</TableCell>
                    <TableCell>{sub.nextRenewalDate}</TableCell>
                    <TableCell>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        sub.status === 'Active' ? 'bg-green-100 text-green-800' :
                        sub.status === 'Expired' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {sub.status}
                      </span>
                    </TableCell>
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

export default ClientSubscriptions;
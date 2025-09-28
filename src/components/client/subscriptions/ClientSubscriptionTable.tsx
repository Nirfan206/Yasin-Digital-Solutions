"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Subscription } from '../../../types/api';
import LoadingSpinner from '../../LoadingSpinner'; // Import LoadingSpinner

interface ClientSubscriptionTableProps {
  subscriptions: Subscription[];
  fetchingSubscriptions: boolean;
}

const ClientSubscriptionTable = ({ subscriptions, fetchingSubscriptions }: ClientSubscriptionTableProps) => {
  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-gray-800">Your Subscriptions</CardTitle>
      </CardHeader>
      <CardContent>
        {fetchingSubscriptions ? (
          <div className="flex justify-center items-center min-h-[100px]">
            <LoadingSpinner size={30} />
          </div>
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

export default ClientSubscriptionTable;
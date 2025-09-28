"use client";

import React, { useState } from 'react';
import { Label } from '../../ui/label';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { showError } from '../../../utils/toast';
import { Order } from '../../../types/api';

interface ClientOrderFormProps {
  onSubmit: (serviceType: string, requirements: string) => Promise<void>;
  loading: boolean;
}

const ClientOrderForm = ({ onSubmit, loading }: ClientOrderFormProps) => {
  const [serviceType, setServiceType] = useState('');
  const [requirements, setRequirements] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceType || !requirements) {
      showError('Please select a service type and describe your requirements.');
      return;
    }
    await onSubmit(serviceType, requirements);
    setServiceType('');
    setRequirements('');
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-gray-800">Book a New Order</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="serviceType">Service Type</Label>
            <Select value={serviceType} onValueChange={setServiceType} required disabled={loading}>
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
              disabled={loading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Submitting...' : 'Place Order'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ClientOrderForm;
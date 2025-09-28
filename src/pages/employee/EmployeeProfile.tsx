"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { showError, showSuccess } from '../../utils/toast';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

const EmployeeProfile = () => {
  const { user, token } = useAuth();
  const [email, setEmail] = useState(user?.email || '');
  const [name, setName] = useState(''); // Assuming a name field will be added to user profile
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setEmail(user.email);
      // If you add a 'name' field to your user model in the backend, fetch it here
      // setName(user.name || '');
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // In a real MERN app, you'd send a PUT request to your backend to update the user profile
    // For now, we'll just simulate success/failure
    try {
      // Example: const response = await fetch('http://localhost:5000/api/employees/profile', {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${token}`,
      //   },
      //   body: JSON.stringify({ email, name }),
      // });
      // const data = await response.json();
      // if (response.ok) {
      //   showSuccess('Employee profile updated successfully!');
      //   // Optionally update the user context with new data
      // } else {
      //   showError(data.error || 'Failed to update employee profile.');
      // }
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      showSuccess('Employee profile updated successfully! (Backend integration needed)');
    } catch (error) {
      showError('An error occurred while updating employee profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-gray-800">Your Employee Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              disabled // Email is often not directly editable or requires special handling
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Updating...' : 'Update Profile'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default EmployeeProfile;
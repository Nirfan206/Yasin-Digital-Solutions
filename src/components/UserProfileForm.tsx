"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { showError, showSuccess } from '../utils/toast';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ApiResponse, UserProfile } from '../types/api'; // Import ApiResponse and UserProfile

interface UserProfileFormProps {
  title: string;
  onUpdateProfile: (token: string, name: string) => Promise<ApiResponse<UserProfile>>; // New prop for update logic
}

const UserProfileForm = ({ title, onUpdateProfile }: UserProfileFormProps) => {
  const { user, token, updateUser } = useAuth();
  const [email, setEmail] = useState(user?.email || '');
  const [name, setName] = useState(user?.name || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setEmail(user.email);
      setName(user.name || '');
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      showError('You must be logged in to update your profile.');
      return;
    }
    setLoading(true);
    try {
      // Use the onUpdateProfile prop instead of a hardcoded API call
      const { data: updatedUser, error } = await onUpdateProfile(token, name);
      if (updatedUser) {
        updateUser({ name: updatedUser.name });
        showSuccess('Profile updated successfully!');
      } else if (error) {
        showError(error);
      }
    } catch (error) {
      showError('An error occurred while updating profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-gray-800">{title}</CardTitle>
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
              disabled
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

export default UserProfileForm;
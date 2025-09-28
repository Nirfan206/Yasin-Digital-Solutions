"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { showError, showSuccess } from '../utils/toast';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ApiResponse, UserProfile } from '../types/api'; // Import ApiResponse and UserProfile
import { updateUserPassword, updateUserProfile as apiUpdateUserProfile } from '../api/auth/profile'; // Updated import path and aliased updateUserProfile

interface UserProfileFormProps {
  title: string;
  onUpdateProfile: (token: string, name: string) => Promise<ApiResponse<UserProfile>>; // Prop for name update logic
}

const UserProfileForm = ({ title, onUpdateProfile }: UserProfileFormProps) => {
  const { user, token, updateUser } = useAuth();
  const [email, setEmail] = useState(user?.email || '');
  const [name, setName] = useState(user?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [loadingNameUpdate, setLoadingNameUpdate] = useState(false);
  const [loadingPasswordUpdate, setLoadingPasswordUpdate] = useState(false);

  useEffect(() => {
    if (user) {
      setEmail(user.email);
      setName(user.name || '');
    }
  }, [user]);

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      showError('You must be logged in to update your profile.');
      return;
    }
    setLoadingNameUpdate(true);
    try {
      // Use the prop function for updating the name
      const { data: updatedUser, error } = await onUpdateProfile(token, name);
      if (updatedUser) {
        updateUser({ name: updatedUser.name });
        showSuccess('Profile name updated successfully!');
      } else if (error) {
        showError(error);
      }
    } catch (error) {
      showError('An error occurred while updating profile name.');
    } finally {
      setLoadingNameUpdate(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      showError('You must be logged in to update your password.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      showError('New password and confirmation do not match.');
      return;
    }
    if (!currentPassword || !newPassword) {
      showError('Please fill in all password fields.');
      return;
    }

    setLoadingPasswordUpdate(true);
    try {
      const { message, error } = await updateUserPassword(token, currentPassword, newPassword);
      if (message) {
        showSuccess(message);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      } else if (error) {
        showError(error);
      }
    } catch (error) {
      showError('An error occurred while updating password.');
    } finally {
      setLoadingPasswordUpdate(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="w-full max-w-lg mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-gray-800">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateName} className="space-y-4">
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
            <Button type="submit" className="w-full" disabled={loadingNameUpdate}>
              {loadingNameUpdate ? 'Updating Name...' : 'Update Name'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="w-full max-w-lg mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-gray-800">Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
              <Input
                id="confirmNewPassword"
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loadingPasswordUpdate}>
              {loadingPasswordUpdate ? 'Updating Password...' : 'Update Password'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfileForm;
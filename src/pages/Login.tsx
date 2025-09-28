"use client";

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { showSuccess, showError } from '../utils/toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState(''); // New state for OTP
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false); // New state to control OTP input visibility
  const [currentUserId, setCurrentUserId] = useState<string | null>(null); // To store userId for OTP verification
  const { login: authLogin, verifyOtp: authVerifyOtp, requestOtp: authRequestOtp } = useAuth(); // Destructure verifyOtp and requestOtp from useAuth
  const navigate = useNavigate();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await authLogin(email, password);
    if (result.success && result.otpRequired && result.userId) {
      showSuccess(result.message || 'OTP sent to your email. Please verify.');
      setOtpSent(true);
      setCurrentUserId(result.userId);
    } else if (result.success) {
      // This case should ideally not happen if OTP is always required for login
      navigate('/'); // Redirect to home or dashboard after successful login
    } else if (result.error) {
      showError(result.error);
    }
    setLoading(false);
  };

  const handleVerifyOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUserId) {
      showError('User ID not found for OTP verification.');
      return;
    }
    setLoading(true);
    const result = await authVerifyOtp(currentUserId, otp);
    if (result.success) {
      showSuccess(result.message || 'OTP verified successfully. You are now logged in.');
      navigate('/'); // Redirect to home or dashboard after successful login
    } else if (result.error) {
      showError(result.error);
    }
    setLoading(false);
  };

  const handleResendOtp = async () => {
    if (!currentUserId) {
      showError('User ID not found to resend OTP.');
      return;
    }
    setLoading(true);
    const result = await authRequestOtp(currentUserId);
    if (result.success) {
      showSuccess(result.message || 'New OTP sent to your email.');
    } else if (result.error) {
      showError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto px-6 py-16 min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-800">Login</CardTitle>
          <CardDescription className="text-gray-600">
            {otpSent ? 'Enter the OTP sent to your email to complete login.' : 'Enter your credentials to access your account.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!otpSent ? (
            <form onSubmit={handleLoginSubmit} className="space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtpSubmit} className="space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="otp">One-Time Password (OTP)</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  maxLength={6}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Verifying OTP...' : 'Verify OTP'}
              </Button>
              <Button
                type="button"
                variant="link"
                onClick={handleResendOtp}
                disabled={loading}
                className="w-full text-sm"
              >
                Resend OTP
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="text-center text-sm text-gray-600 justify-center">
          {otpSent ? (
            <p>Check your inbox for the OTP.</p>
          ) : (
            <>
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500 ml-1">
                Register here
              </Link>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
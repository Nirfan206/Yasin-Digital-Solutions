"use client";

import React, { useState, useEffect } from 'react';
import Modal from '../../Modal';
import { Button } from '../../ui/button';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Employee } from '../../../types/api';

interface EmployeeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentEmployee: Employee | null;
  onSubmit: (employeeData: Omit<Employee, 'id' | 'hiredDate'>) => void;
  loading: boolean;
}

const EmployeeFormModal = ({ isOpen, onClose, currentEmployee, onSubmit, loading }: EmployeeFormModalProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('employee');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');

  useEffect(() => {
    if (currentEmployee) {
      setName(currentEmployee.name);
      setEmail(currentEmployee.email);
      setRole(currentEmployee.role);
      setStatus(currentEmployee.status);
    } else {
      setName('');
      setEmail('');
      setRole('employee');
      setStatus('Active');
    }
  }, [currentEmployee]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, email, role, status });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={currentEmployee ? 'Edit Employee' : 'Add New Employee'}
      footer={
        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="employee-form"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Employee'}
          </Button>
        </div>
      }
    >
      <form id="employee-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="employeeName">Name</Label>
          <Input
            type="text"
            id="employeeName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="employeeEmail">Email</Label>
          <Input
            type="email"
            id="employeeEmail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="employeeRole">Role</Label>
          <Select value={role} onValueChange={setRole} disabled={loading}>
            <SelectTrigger id="employeeRole">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="employee">Employee</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              {/* Add other roles as needed */}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="employeeStatus">Status</Label>
          <Select value={status} onValueChange={(value: 'Active' | 'Inactive') => setStatus(value)} disabled={loading}>
            <SelectTrigger id="employeeStatus">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </form>
    </Modal>
  );
};

export default EmployeeFormModal;
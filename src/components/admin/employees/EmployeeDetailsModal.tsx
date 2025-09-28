"use client";

import React from 'react';
import Modal from '../../Modal';
import { Button } from '../../ui/button';
import { Employee } from '../../../types/api';

interface EmployeeDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
}

const EmployeeDetailsModal = ({ isOpen, onClose, employee }: EmployeeDetailsModalProps) => {
  if (!employee) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Employee Details: ${employee.name || 'N/A'}`}
      description={employee.email}
      footer={
        <Button onClick={onClose}>Close</Button>
      }
    >
      <div className="space-y-4 text-gray-700">
        <p><strong>Employee ID:</strong> {employee.id}</p>
        <p><strong>Name:</strong> {employee.name}</p>
        <p><strong>Email:</strong> {employee.email}</p>
        <p><strong>Role:</strong> {employee.role}</p>
        <p><strong>Status:</strong>
          <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            employee.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {employee.status}
          </span>
        </p>
        <p><strong>Hired Date:</strong> {new Date(employee.hiredDate).toLocaleDateString()}</p>
      </div>
    </Modal>
  );
};

export default EmployeeDetailsModal;
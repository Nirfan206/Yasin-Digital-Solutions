"use client";

import React from 'react';
import { Input } from '../../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Order } from '../../../types/api';

interface OrderFiltersProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  filterStatus: Order['status'] | 'all';
  onFilterStatusChange: (status: Order['status'] | 'all') => void;
}

const OrderFilters = ({
  searchTerm,
  onSearchTermChange,
  filterStatus,
  onFilterStatusChange,
}: OrderFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <Input
        placeholder="Search by client, service, or ID..."
        value={searchTerm}
        onChange={(e) => onSearchTermChange(e.target.value)}
        className="flex-grow"
      />
      <Select value={filterStatus} onValueChange={onFilterStatusChange}>
        <SelectTrigger className="w-[180px] sm:w-[150px]">
          <SelectValue placeholder="Filter by Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="Pending">Pending</SelectItem>
          <SelectItem value="In Progress">In Progress</SelectItem>
          <SelectItem value="Under Review">Under Review</SelectItem>
          <SelectItem value="Completed">Completed</SelectItem>
          <SelectItem value="Cancelled">Cancelled</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default OrderFilters;
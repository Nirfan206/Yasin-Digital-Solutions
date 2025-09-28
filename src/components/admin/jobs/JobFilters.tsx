"use client";

import React from 'react';
import { Input } from '../../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Job, Employee } from '../../../types/api';

interface JobFiltersProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  filterStatus: Job['status'] | 'all';
  onFilterStatusChange: (status: Job['status'] | 'all') => void;
  filterPriority: Job['priority'] | 'all';
  onFilterPriorityChange: (priority: Job['priority'] | 'all') => void;
  filterEmployeeId: string | 'all';
  onFilterEmployeeIdChange: (employeeId: string | 'all') => void;
  employees: Employee[];
}

const JobFilters = ({
  searchTerm,
  onSearchTermChange,
  filterStatus,
  onFilterStatusChange,
  filterPriority,
  onFilterPriorityChange,
  filterEmployeeId,
  onFilterEmployeeIdChange,
  employees,
}: JobFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <Input
        placeholder="Search by title, client, or ID..."
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
          <SelectItem value="Assigned">Assigned</SelectItem>
          <SelectItem value="In Progress">In Progress</SelectItem>
          <SelectItem value="Under Review">Under Review</SelectItem>
          <SelectItem value="Completed">Completed</SelectItem>
        </SelectContent>
      </Select>
      <Select value={filterPriority} onValueChange={onFilterPriorityChange}>
        <SelectTrigger className="w-[180px] sm:w-[150px]">
          <SelectValue placeholder="Filter by Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Priorities</SelectItem>
          <SelectItem value="High">High</SelectItem>
          <SelectItem value="Medium">Medium</SelectItem>
          <SelectItem value="Low">Low</SelectItem>
        </SelectContent>
      </Select>
      <Select value={filterEmployeeId} onValueChange={onFilterEmployeeIdChange}>
        <SelectTrigger className="w-[180px] sm:w-[150px]">
          <SelectValue placeholder="Filter by Employee" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Employees</SelectItem>
          <SelectItem value="unassigned">Unassigned</SelectItem>
          {employees.map(emp => (
            <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default JobFilters;
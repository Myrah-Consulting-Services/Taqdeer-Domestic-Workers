export type EmployeeRole = 'Receptionist' | 'HR Manager' | 'Accountant' | 'Sales Executive' | 'Operations Manager';

export type EmployeeStatus = 'active' | 'inactive' | 'on-leave' | 'terminated';

export interface Employee {
  id: string;
  employeeCode: string; // Auto-generated (EMP001, EMP002, etc.)
  
  // Personal Information
  fullName: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  dateOfBirth: Date;
  nationality: string;
  emiratesId?: string;
  passportNumber?: string;
  gender: 'male' | 'female';
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';
  
  // Employment Details
  role: EmployeeRole;
  department: string;
  joiningDate: Date;
  employmentType: 'full-time' | 'part-time' | 'contract';
  workingHours: string; // e.g., "9:00 AM - 6:00 PM"
  
  // Salary & Benefits
  basicSalary: number;
  allowances?: number;
  totalSalary: number;
  paymentMode: 'bank-transfer' | 'cash' | 'cheque';
  bankName?: string;
  accountNumber?: string;
  iban?: string;
  
  // Access & Authentication
  username: string;
  password: string; // In production, this should be hashed
  hasSystemAccess: boolean;
  lastLogin?: Date;
  
  // Status & Tracking
  status: EmployeeStatus;
  reportingTo?: string; // Employee ID of manager
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  
  // Address
  address?: string;
  city?: string;
  country: string;
  
  // Documents
  contractDocument?: string;
  visaDocument?: string;
  emiratesIdDocument?: string;
  
  // Additional Info
  notes?: string;
  skills?: string[];
  
  // System Fields
  createdBy: string;
  createdDate: Date;
  lastUpdated: Date;
}

export interface EmployeeFormData {
  fullName: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  dateOfBirth: Date;
  nationality: string;
  emiratesId?: string;
  passportNumber?: string;
  gender: 'male' | 'female';
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';
  role: EmployeeRole;
  department: string;
  joiningDate: Date;
  employmentType: 'full-time' | 'part-time' | 'contract';
  workingHours: string;
  basicSalary: number;
  allowances?: number;
  paymentMode: 'bank-transfer' | 'cash' | 'cheque';
  bankName?: string;
  accountNumber?: string;
  iban?: string;
  username: string;
  password: string;
  hasSystemAccess: boolean;
  status: EmployeeStatus;
  reportingTo?: string;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  address?: string;
  city?: string;
  country: string;
  notes?: string;
  skills?: string[];
}

// Role-based permissions
export const ROLE_PERMISSIONS = {
  'Receptionist': ['view_workers', 'view_sponsors', 'schedule_appointments', 'answer_calls'],
  'HR Manager': ['manage_employees', 'view_reports', 'approve_leaves', 'recruitment'],
  'Accountant': ['manage_payments', 'view_financial_reports', 'process_invoices', 'track_expenses'],
  'Sales Executive': ['manage_sponsors', 'manage_workers', 'generate_quotations', 'follow_ups'],
  'Operations Manager': ['view_all', 'manage_assignments', 'monitor_operations', 'generate_reports']
};














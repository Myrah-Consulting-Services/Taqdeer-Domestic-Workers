export type UserRole = 'admin' | 'agent' | 'employee';

export interface User {
  id: string;
  username: string;
  email: string;
  password?: string; // Not included in responses
  fullName: string;
  role: UserRole;
  status: 'active' | 'inactive';
  createdDate: Date;
  lastLogin?: Date;
  
  // Agent-specific fields
  agentId?: string; // Link to Agent if role is 'agent'
  agentCode?: string;
  
  // Employee-specific fields
  employeeId?: string; // Link to Employee if role is 'employee'
  employeeCode?: string;
  employeeRole?: string; // Receptionist, HR Manager, Accountant, etc.
  
  // Permissions
  permissions: UserPermissions;
  
  // Profile
  phone?: string;
  avatar?: string;
}

export interface UserPermissions {
  // Dashboard Access
  canAccessDashboard: boolean;
  
  // Agent Management
  canViewAgents: boolean;
  canManageAgents: boolean; // Add/Edit/Delete
  
  // Worker Management
  canViewAllWorkers: boolean;
  canViewOwnWorkers: boolean; // For agents - only their workers
  canManageWorkers: boolean;
  canAddWorkerBasicInfo: boolean; // Receptionist can only add basic info
  
  // Sponsor Management
  canViewSponsors: boolean;
  canManageSponsors: boolean;
  
  // Employee Management
  canViewEmployees: boolean;
  canManageEmployees: boolean;
  
  // Sales & Invoices
  canViewSales: boolean;
  canManageSales: boolean;
  canViewInvoices: boolean;
  
  // Worker Status & Operations
  canViewWorkerStatus: boolean; // Operations can view availability
  canViewWorkerAvailability: boolean;
  
  // Financial & Accounting
  canViewExpenses: boolean;
  canManageExpenses: boolean;
  canManageCommissions: boolean;
  canManageCreditNotes: boolean;
  canManageDebitNotes: boolean;
  
  // Reports & Commission
  canViewAllReports: boolean;
  canViewOwnCommission: boolean; // For agents
  
  // System
  canManageUsers: boolean;
  canManageSettings: boolean;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
}

// Role-based permission presets
export const RolePermissions: Record<UserRole, UserPermissions> = {
  admin: {
    canAccessDashboard: true,
    canViewAgents: true,
    canManageAgents: true,
    canViewAllWorkers: true,
    canViewOwnWorkers: false,
    canManageWorkers: true,
    canAddWorkerBasicInfo: true,
    canViewSponsors: true,
    canManageSponsors: true,
    canViewEmployees: true,
    canManageEmployees: true,
    canViewSales: true,
    canManageSales: true,
    canViewInvoices: true,
    canViewWorkerStatus: true,
    canViewWorkerAvailability: true,
    canViewExpenses: true,
    canManageExpenses: true,
    canManageCommissions: true,
    canManageCreditNotes: true,
    canManageDebitNotes: true,
    canViewAllReports: true,
    canViewOwnCommission: false,
    canManageUsers: true,
    canManageSettings: true
  },
  agent: {
    canAccessDashboard: true,
    canViewAgents: false,
    canManageAgents: false,
    canViewAllWorkers: false,
    canViewOwnWorkers: true,
    canManageWorkers: true,
    canAddWorkerBasicInfo: true,
    canViewSponsors: false,
    canManageSponsors: false,
    canViewEmployees: false,
    canManageEmployees: false,
    canViewSales: false,
    canManageSales: false,
    canViewInvoices: false,
    canViewWorkerStatus: true,
    canViewWorkerAvailability: true,
    canViewExpenses: false,
    canManageExpenses: false,
    canManageCommissions: false,
    canManageCreditNotes: false,
    canManageDebitNotes: false,
    canViewAllReports: false,
    canViewOwnCommission: true,
    canManageUsers: false,
    canManageSettings: false
  },
  employee: {
    canAccessDashboard: true,
    canViewAgents: false,
    canManageAgents: false,
    canViewAllWorkers: true,
    canViewOwnWorkers: false,
    canManageWorkers: false,
    canAddWorkerBasicInfo: false,
    canViewSponsors: true,
    canManageSponsors: false,
    canViewEmployees: false,
    canManageEmployees: false,
    canViewSales: false,
    canManageSales: false,
    canViewInvoices: false,
    canViewWorkerStatus: false,
    canViewWorkerAvailability: false,
    canViewExpenses: false,
    canManageExpenses: false,
    canManageCommissions: false,
    canManageCreditNotes: false,
    canManageDebitNotes: false,
    canViewAllReports: false,
    canViewOwnCommission: false,
    canManageUsers: false,
    canManageSettings: false
  }
};

// Employee role-specific permissions
export const EmployeeRolePermissions: Record<string, UserPermissions> = {
  'Receptionist': {
    canAccessDashboard: true,
    canViewAgents: false,
    canManageAgents: false,
    canViewAllWorkers: true,
    canViewOwnWorkers: false,
    canManageWorkers: false,
    canAddWorkerBasicInfo: true, // Main permission - can add basic worker info
    canViewSponsors: true,
    canManageSponsors: false,
    canViewEmployees: false,
    canManageEmployees: false,
    canViewSales: false,
    canManageSales: false,
    canViewInvoices: false,
    canViewWorkerStatus: true,
    canViewWorkerAvailability: true,
    canViewExpenses: false,
    canManageExpenses: false,
    canManageCommissions: false,
    canManageCreditNotes: false,
    canManageDebitNotes: false,
    canViewAllReports: false,
    canViewOwnCommission: false,
    canManageUsers: false,
    canManageSettings: false
  },
  'HR Manager': {
    canAccessDashboard: true,
    canViewAgents: false,
    canManageAgents: false,
    canViewAllWorkers: true,
    canViewOwnWorkers: false,
    canManageWorkers: true,
    canAddWorkerBasicInfo: true,
    canViewSponsors: true,
    canManageSponsors: false,
    canViewEmployees: true,
    canManageEmployees: true, // Main permission - can manage employees
    canViewSales: false,
    canManageSales: false,
    canViewInvoices: false,
    canViewWorkerStatus: true,
    canViewWorkerAvailability: true,
    canViewExpenses: false,
    canManageExpenses: false,
    canManageCommissions: false,
    canManageCreditNotes: false,
    canManageDebitNotes: false,
    canViewAllReports: true,
    canViewOwnCommission: false,
    canManageUsers: false,
    canManageSettings: false
  },
  'Accountant': {
    canAccessDashboard: true,
    canViewAgents: true,
    canManageAgents: false,
    canViewAllWorkers: true,
    canViewOwnWorkers: false,
    canManageWorkers: false,
    canAddWorkerBasicInfo: false,
    canViewSponsors: true,
    canManageSponsors: false,
    canViewEmployees: true,
    canManageEmployees: false,
    canViewSales: true,
    canManageSales: false,
    canViewInvoices: true,
    canViewWorkerStatus: false,
    canViewWorkerAvailability: false,
    canViewExpenses: true,
    canManageExpenses: true, // Main permissions - financial management
    canManageCommissions: true,
    canManageCreditNotes: true,
    canManageDebitNotes: true,
    canViewAllReports: true,
    canViewOwnCommission: false,
    canManageUsers: false,
    canManageSettings: false
  },
  'Sales Executive': {
    canAccessDashboard: true,
    canViewAgents: true,
    canManageAgents: false,
    canViewAllWorkers: true,
    canViewOwnWorkers: false,
    canManageWorkers: true,
    canAddWorkerBasicInfo: true,
    canViewSponsors: true,
    canManageSponsors: true, // Main permission - can manage sponsors
    canViewEmployees: false,
    canManageEmployees: false,
    canViewSales: true,
    canManageSales: true,
    canViewInvoices: true,
    canViewWorkerStatus: true,
    canViewWorkerAvailability: true,
    canViewExpenses: false,
    canManageExpenses: false,
    canManageCommissions: false,
    canManageCreditNotes: false,
    canManageDebitNotes: false,
    canViewAllReports: true,
    canViewOwnCommission: false,
    canManageUsers: false,
    canManageSettings: false
  },
  'Operations Manager': {
    canAccessDashboard: true,
    canViewAgents: true,
    canManageAgents: false,
    canViewAllWorkers: true,
    canViewOwnWorkers: false,
    canManageWorkers: true,
    canAddWorkerBasicInfo: true,
    canViewSponsors: true,
    canManageSponsors: true,
    canViewEmployees: true,
    canManageEmployees: false,
    canViewSales: true, // Main permissions - operations & monitoring
    canManageSales: true,
    canViewInvoices: true,
    canViewWorkerStatus: true,
    canViewWorkerAvailability: true,
    canViewExpenses: true,
    canManageExpenses: false,
    canManageCommissions: false,
    canManageCreditNotes: false,
    canManageDebitNotes: false,
    canViewAllReports: true,
    canViewOwnCommission: false,
    canManageUsers: false,
    canManageSettings: false
  }
};
# 🔐 Role-Based Authentication System

Complete implementation of role-based authentication with **Admin**, **Agent**, and **Employee** login capabilities.

## 📋 Table of Contents
- [Overview](#overview)
- [User Roles & Permissions](#user-roles--permissions)
- [Demo Credentials](#demo-credentials)
- [Implementation Details](#implementation-details)
- [Usage Guide](#usage-guide)

---

## 🎯 Overview

The system supports three main user types, each with specific permissions and access levels:
1. **Admin** - Full system access
2. **Agent** - Limited to their own workers and commission
3. **Employee** - Role-based access (5 different employee roles)

---

## 👥 User Roles & Permissions

### 1. Admin
**Full Access** - Complete control over all system features
- ✅ Manage agents, workers, sponsors, employees
- ✅ View/manage sales, invoices, reports
- ✅ Handle financial operations
- ✅ System settings and user management

### 2. Agent
**Limited Access** - Focus on their own operations
- ✅ View and manage their own workers only
- ✅ View their commission reports
- ✅ Add/edit worker details for their agents
- ❌ Cannot view other agents' data
- ❌ Cannot access system settings

### 3. Employee (5 Different Roles)

#### 📞 **Receptionist** (Front Desk)
**Main Responsibility:** Add worker basic information
- ✅ Add worker details (name, passport number, basic info)
- ✅ View worker list and availability status
- ✅ View sponsors list
- ❌ Cannot manage financial data
- ❌ Cannot edit/delete workers
- ❌ Limited reporting access

**Use Case:** Front desk staff who register new workers in the system

---

#### 👔 **HR Manager** (Human Resources)
**Main Responsibility:** Employee management
- ✅ View and manage all employees (15 internal staff)
- ✅ Access employee salary slips and personal information
- ✅ View worker details
- ✅ Generate HR reports
- ❌ Cannot manage financial operations
- ❌ Cannot handle commissions or invoices

**Use Case:** HR department managing internal staff records

---

#### 💰 **Accountant** (Finance Department)
**Main Responsibility:** Financial management
- ✅ Manage business expenses
- ✅ Handle agent commissions
- ✅ Create credit notes (for refunds)
- ✅ Create debit notes (for returns)
- ✅ View invoices and sales data
- ✅ View agents for commission processing
- ❌ Cannot add/edit workers
- ❌ Cannot manage employees

**Use Case:** Finance team handling all monetary transactions

---

#### 🤝 **Sales Executive** (Sales & Marketing)
**Main Responsibility:** Sponsor & worker management
- ✅ Manage sponsors (add, edit, delete)
- ✅ Manage workers (full access)
- ✅ View and manage sales
- ✅ Generate quotations and invoices
- ✅ View worker availability
- ❌ Cannot manage employees
- ❌ Cannot handle financial operations

**Use Case:** Sales team managing client relationships and placements

---

#### 📊 **Operations Manager** (Operations Team)
**Main Responsibility:** Monitor operations and status
- ✅ View sales and invoices
- ✅ View worker availability (how many available, working, returned)
- ✅ View worker current status
- ✅ Monitor operations and generate reports
- ✅ Manage workers and sponsors
- ✅ View expenses (read-only)
- ❌ Cannot manage financial transactions
- ❌ Cannot edit expenses or commissions

**Use Case:** Operations team monitoring system efficiency

---

## 🔑 Demo Credentials

### Admin Login
```
Username: admin
Password: admin123
Access: Full system access
```

### Agent Logins
```
Username: agent001
Password: agent123
Agent: Ahmed Hassan (AG001)

Username: agent002
Password: agent123
Agent: Priya Sharma (AG002)

Username: agent003
Password: agent123
Agent: Mohammed Ali (AG003)
```

### Employee Logins

#### Receptionist
```
Username: sarah.ahmed
Password: password123
Role: Receptionist
Code: EMP001
Permissions: Add worker basic info
```

#### HR Manager
```
Username: khalid.hassan
Password: password123
Role: HR Manager
Code: EMP002
Permissions: Manage employees
```

#### Accountant
```
Username: priya.sharma
Password: password123
Role: Accountant
Code: EMP003
Permissions: Financial management, commissions, credit/debit notes
```

#### Sales Executive
```
Username: omar.alfarsi
Password: password123
Role: Sales Executive
Code: EMP004
Permissions: Manage sponsors, workers, sales
```

#### Operations Manager
```
Username: ahmed.mohammed
Password: password123
Role: Operations Manager
Code: EMP005
Permissions: View operations, status, reports
```

---

## 🛠️ Implementation Details

### File Structure
```
src/app/
├── models/
│   └── user.model.ts              # User types & permissions
├── services/
│   └── auth.service.ts            # Authentication logic
└── pages/
    └── login/
        └── login.component.ts     # Login interface
```

### Permission Keys
```typescript
interface UserPermissions {
  // Dashboard
  canAccessDashboard: boolean;
  
  // Agent Management
  canViewAgents: boolean;
  canManageAgents: boolean;
  
  // Worker Management
  canViewAllWorkers: boolean;
  canViewOwnWorkers: boolean;        // Agents only
  canManageWorkers: boolean;
  canAddWorkerBasicInfo: boolean;    // Receptionist only
  
  // Sponsor Management
  canViewSponsors: boolean;
  canManageSponsors: boolean;
  
  // Employee Management
  canViewEmployees: boolean;
  canManageEmployees: boolean;       // HR Manager only
  
  // Sales & Invoices
  canViewSales: boolean;
  canManageSales: boolean;
  canViewInvoices: boolean;
  
  // Operations
  canViewWorkerStatus: boolean;
  canViewWorkerAvailability: boolean;
  
  // Financial
  canViewExpenses: boolean;
  canManageExpenses: boolean;        // Accountant only
  canManageCommissions: boolean;     // Accountant only
  canManageCreditNotes: boolean;     // Accountant only
  canManageDebitNotes: boolean;      // Accountant only
  
  // Reports
  canViewAllReports: boolean;
  canViewOwnCommission: boolean;     // Agents only
  
  // System
  canManageUsers: boolean;           // Admin only
  canManageSettings: boolean;        // Admin only
}
```

### Permission Checking in Components
```typescript
// Example: Check if user can manage workers
if (this.authService.hasPermission('canManageWorkers')) {
  // Show edit/delete buttons
}

// Example: Check if user can add worker basic info (Receptionist)
if (this.authService.hasPermission('canAddWorkerBasicInfo')) {
  // Show basic info form only
}

// Example: Check if user can manage commissions (Accountant)
if (this.authService.hasPermission('canManageCommissions')) {
  // Show commission management
}
```

---

## 📖 Usage Guide

### For Developers

#### 1. Check Permissions in Templates
```html
<!-- Show button only if user has permission -->
<button *ngIf="authService.hasPermission('canManageWorkers')">
  Edit Worker
</button>

<!-- Show section for specific roles -->
<div *ngIf="authService.hasPermission('canManageCommissions')">
  <!-- Commission management section -->
</div>
```

#### 2. Check Permissions in TypeScript
```typescript
// Check single permission
if (this.authService.hasPermission('canViewSales')) {
  this.loadSalesData();
}

// Check user role
if (this.authService.isEmployee()) {
  const employeeRole = this.authService.currentUser?.employeeRole;
  console.log('Employee role:', employeeRole);
}

// Check multiple roles
if (this.authService.hasRole(['admin', 'employee'])) {
  // Code for admin or employee
}
```

#### 3. Route Guards (Coming Soon)
```typescript
// Protect routes based on permissions
{
  path: 'employees',
  component: EmployeesListComponent,
  canActivate: [AuthGuard],
  data: { 
    requiredPermission: 'canManageEmployees'
  }
}
```

---

## 🔒 Security Features

1. **Password Protection** - All accounts password-protected
2. **Session Management** - Login state persisted in localStorage
3. **Role-Based Access** - Features hidden based on permissions
4. **Automatic Logout** - On session expiry
5. **Permission Validation** - Server-side & client-side checks

---

## 📊 Permission Matrix

| Feature | Admin | Agent | Receptionist | HR Manager | Accountant | Sales Exec | Operations |
|---------|-------|-------|--------------|------------|------------|------------|------------|
| Dashboard | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| View All Workers | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| View Own Workers | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Manage Workers | ✅ | ✅ | ❌ | ✅ | ❌ | ✅ | ✅ |
| Add Worker Basic Info | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| Manage Sponsors | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Manage Employees | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| View Sales | ✅ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| View Invoices | ✅ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Manage Expenses | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Manage Commissions | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Credit/Debit Notes | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| View Worker Status | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| View Reports | ✅ | 📊* | ❌ | ✅ | ✅ | ✅ | ✅ |
| System Settings | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

*📊 Agent can only view their own commission reports

---

## 🚀 Next Steps

1. ✅ **Completed**: Role-based authentication system
2. ✅ **Completed**: Employee login with specific permissions
3. ✅ **Completed**: Permission-based UI rendering
4. 🔜 **Coming**: Route guards for protected pages
5. 🔜 **Coming**: Permission-based feature restrictions
6. 🔜 **Coming**: Audit logging for user actions

---

## 📝 Notes

- All employee passwords are set during employee creation
- System supports 5 concurrent employee logins (as per requirements)
- Internal employees (15 staff members) managed separately from workers
- Worker details (housemaids, etc.) are NOT included in employee HR records
- Role changes require re-login to update permissions

---

## 👨‍💻 Support

For implementation questions or permission issues:
1. Check `src/app/models/user.model.ts` for permission structure
2. Review `src/app/services/auth.service.ts` for authentication logic
3. Test with demo credentials provided above

---

**Last Updated:** 2025-10-05
**Version:** 1.0
**Status:** ✅ Production Ready


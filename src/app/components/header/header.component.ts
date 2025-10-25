import { Component, OnInit, HostListener, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  currentUser: User | null = null;
  userName = 'User';
  userEmail = '';
  userInitials = 'U';
  userRole = '';
  
  isDropdownOpen = false;
  isMobileMenuOpen = false;
  isNotificationPanelOpen = false;

  // Notification data
  notifications: Array<{
    id: string;
    type: 'worker-trial' | 'expense-approval' | 'employee-leave';
    workerId?: string;
    workerName?: string;
    agentName?: string;
    endDate?: string;
    expenseId?: string;
    expenseDescription?: string;
    expenseAmount?: number;
    expenseCategory?: string;
    employeeId?: string;
    employeeName?: string;
    leaveType?: string;
    leaveStartDate?: string;
    leaveEndDate?: string;
    leaveDays?: number;
    leaveReason?: string;
    time: string;
  }> = [];

  constructor(
    private router: Router, 
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {
    // Initialize sample notifications for demonstration
    this.notifications = [
      {
        id: '1',
        type: 'worker-trial',
        workerId: 'WRK-001',
        workerName: 'Maria Santos',
        agentName: 'John Doe',
        endDate: '2024-12-20',
        time: '2 hours ago'
      },
      {
        id: '2',
        type: 'expense-approval',
        expenseId: 'EXP-2024-045',
        expenseDescription: 'Office Supplies - Stationery',
        expenseAmount: 1250.00,
        expenseCategory: 'office-supplies',
        time: '3 hours ago'
      },
      {
        id: '3',
        type: 'employee-leave',
        employeeId: 'EMP-001',
        employeeName: 'Sarah Johnson',
        leaveType: 'Annual Leave',
        leaveStartDate: '2024-12-25',
        leaveEndDate: '2024-12-30',
        leaveDays: 5,
        leaveReason: 'Family vacation during holidays',
        time: '4 hours ago'
      },
      {
        id: '4',
        type: 'worker-trial',
        workerId: 'WRK-002',
        workerName: 'Anita Sharma',
        agentName: 'Jane Smith',
        endDate: '2024-12-19',
        time: '5 hours ago'
      },
      {
        id: '5',
        type: 'employee-leave',
        employeeId: 'EMP-002',
        employeeName: 'Ahmed Al-Rashid',
        leaveType: 'Sick Leave',
        leaveStartDate: '2024-12-22',
        leaveEndDate: '2024-12-24',
        leaveDays: 3,
        leaveReason: 'Medical treatment and recovery',
        time: '6 hours ago'
      },
      {
        id: '6',
        type: 'expense-approval',
        expenseId: 'EXP-2024-046',
        expenseDescription: 'Marketing Campaign - Social Media',
        expenseAmount: 3500.00,
        expenseCategory: 'marketing',
        time: '7 hours ago'
      }
    ];
  }

  ngOnInit() {
    // Subscribe to current user changes
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.userName = user.fullName;
        this.userEmail = user.email;
        this.setUserRoleDisplay();
        this.setUserInitials();
      }
      this.cdr.detectChanges();
    });
  }

  private setUserRoleDisplay() {
    if (!this.currentUser) return;
    
    switch (this.currentUser.role) {
      case 'admin':
        this.userRole = 'Administrator';
        break;
      case 'agent':
        this.userRole = `Agent - ${this.currentUser.agentCode}`;
        break;
      case 'employee':
        this.userRole = this.currentUser.employeeRole || 'Employee';
        break;
      default:
        this.userRole = 'User';
    }
  }

  private setUserInitials() {
    const names = this.userName.split(' ');
    this.userInitials = names.map(name => name.charAt(0).toUpperCase()).join('');
  }

  // Permission checks
  get isAdmin(): boolean {
    const result = this.authService.isAdmin();
    console.log('Header - isAdmin:', result, 'currentUser:', this.currentUser);
    return result;
  }

  get isAgent(): boolean {
    return this.authService.isAgent();
  }

  get canViewAgents(): boolean {
    return this.authService.hasPermission('canViewAgents');
  }

  get canViewWorkers(): boolean {
    return this.authService.hasPermission('canViewAllWorkers') || 
           this.authService.hasPermission('canViewOwnWorkers');
  }

  // Employee role-specific navigation checks
  get isOperationsManager(): boolean {
    return this.currentUser?.role === 'employee' && this.currentUser?.employeeRole === 'Operations Manager';
  }

  get isSalesExecutive(): boolean {
    return this.currentUser?.role === 'employee' && this.currentUser?.employeeRole === 'Sales Executive';
  }

  get isAccountant(): boolean {
    return this.currentUser?.role === 'employee' && this.currentUser?.employeeRole === 'Accountant';
  }

  get isHRManager(): boolean {
    const result = this.currentUser?.role === 'employee' && this.currentUser?.employeeRole === 'HR Manager';
    console.log('Header - isHRManager:', result, 'role:', this.currentUser?.role, 'employeeRole:', this.currentUser?.employeeRole);
    return result;
  }

  get isReceptionist(): boolean {
    return this.currentUser?.role === 'employee' && this.currentUser?.employeeRole === 'Receptionist';
  }

  get notificationCount(): number {
    return this.notifications.length;
  }

  // Navigation permission checks for employees
  get canViewSales(): boolean {
    return this.authService.hasPermission('canViewSales');
  }

  get canManageSales(): boolean {
    return this.authService.hasPermission('canManageSales');
  }

  get canViewAccountsFinance(): boolean {
    return this.authService.hasPermission('canViewExpenses') || 
           this.authService.hasPermission('canManageExpenses') ||
           this.authService.hasPermission('canManageCommissions');
  }

  get canViewEmployees(): boolean {
    return this.authService.hasPermission('canViewEmployees');
  }

  get canManageEmployees(): boolean {
    return this.authService.hasPermission('canManageEmployees');
  }

  get canViewSponsors(): boolean {
    return this.authService.hasPermission('canViewSponsors');
  }

  get canManageSponsors(): boolean {
    return this.authService.hasPermission('canManageSponsors');
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
    // Close mobile menu and notification panel if open
    if (this.isMobileMenuOpen) {
      this.isMobileMenuOpen = false;
    }
    if (this.isNotificationPanelOpen) {
      this.isNotificationPanelOpen = false;
    }
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    // Close dropdown and notification panel if open
    if (this.isDropdownOpen) {
      this.isDropdownOpen = false;
    }
    if (this.isNotificationPanelOpen) {
      this.isNotificationPanelOpen = false;
    }
  }

  toggleNotificationPanel() {
    this.isNotificationPanelOpen = !this.isNotificationPanelOpen;
    // Close dropdown and mobile menu if open
    if (this.isDropdownOpen) {
      this.isDropdownOpen = false;
    }
    if (this.isMobileMenuOpen) {
      this.isMobileMenuOpen = false;
    }
  }

  confirmWorker(notification: any) {
    console.log('Confirming worker:', notification);
    // TODO: Implement confirmation logic
    // Remove notification from list
    this.notifications = this.notifications.filter(n => n.id !== notification.id);
    
    // TODO: Update worker status in backend
    // Example: this.workerService.confirmWorker(notification.workerId);
    
    // Show success message
    alert(`Worker ${notification.workerName} confirmed successfully`);
  }

  returnWorker(notification: any) {
    console.log('Returning worker:', notification);
    // TODO: Implement return logic
    // Remove notification from list
    this.notifications = this.notifications.filter(n => n.id !== notification.id);
    
    // TODO: Update worker status in backend
    // Example: this.workerService.returnWorker(notification.workerId);
    
    // Show success message
    alert(`Worker ${notification.workerName} returned successfully`);
  }

  approveExpense(notification: any) {
    console.log('Approving expense:', notification);
    // TODO: Implement expense approval logic
    // Remove notification from list
    this.notifications = this.notifications.filter(n => n.id !== notification.id);
    
    // TODO: Update expense status in backend
    // Example: this.accountsFinanceService.approveExpense(notification.expenseId);
    
    // Show success message
    alert(`Expense ${notification.expenseId} approved successfully`);
  }

  rejectExpense(notification: any) {
    console.log('Rejecting expense:', notification);
    // TODO: Implement expense rejection logic
    // Remove notification from list
    this.notifications = this.notifications.filter(n => n.id !== notification.id);
    
    // TODO: Update expense status in backend
    // Example: this.accountsFinanceService.rejectExpense(notification.expenseId);
    
    // Show success message
    alert(`Expense ${notification.expenseId} rejected`);
  }

  approveLeaveRequest(notification: any) {
    console.log('Approving leave request:', notification);
    // TODO: Implement leave approval logic
    // Remove notification from list
    this.notifications = this.notifications.filter(n => n.id !== notification.id);
    
    // TODO: Update leave status in backend
    // Example: this.employeeService.approveLeaveRequest(notification.employeeId, notification.id);
    
    // Show success message
    alert(`Leave request for ${notification.employeeName} approved successfully`);
  }

  rejectLeaveRequest(notification: any) {
    console.log('Rejecting leave request:', notification);
    // TODO: Implement leave rejection logic
    // Remove notification from list
    this.notifications = this.notifications.filter(n => n.id !== notification.id);
    
    // TODO: Update leave status in backend
    // Example: this.employeeService.rejectLeaveRequest(notification.employeeId, notification.id);
    
    // Show success message
    alert(`Leave request for ${notification.employeeName} rejected`);
  }

  formatCurrency(amount: number): string {
    return `AED ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  getCategoryDisplayName(category: string): string {
    const categoryMap: { [key: string]: string } = {
      'office-rent': 'Office Rent',
      'utilities': 'Utilities',
      'staff-salaries': 'Staff Salaries',
      'marketing': 'Marketing',
      'transportation': 'Transportation',
      'office-supplies': 'Office Supplies',
      'professional-services': 'Professional Services',
      'insurance': 'Insurance',
      'maintenance': 'Maintenance',
      'telecommunications': 'Telecommunications',
      'training': 'Training',
      'other': 'Other'
    };
    return categoryMap[category] || category;
  }

  // Close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    const userMenuButton = document.getElementById('user-menu-button');
    const dropdownMenu = document.querySelector('.absolute');
    
    // Check if click is outside the dropdown and notification panel
    // Don't close if clicking on notification bell or its panel
    if (userMenuButton && !userMenuButton.contains(target) && 
        (!dropdownMenu || !dropdownMenu.contains(target))) {
      const notificationButton = target.closest('button[class*="p-2 text-gray-600"]');
      const notificationPanel = target.closest('.w-80.bg-white.rounded-lg');
      if (!notificationButton && !notificationPanel) {
        this.isDropdownOpen = false;
        this.isNotificationPanelOpen = false;
      }
    }
  }

  // Close menus on escape key
  @HostListener('document:keydown.escape')
  onEscapeKey() {
    this.isDropdownOpen = false;
    this.isMobileMenuOpen = false;
    this.isNotificationPanelOpen = false;
  }

  logout() {
    this.authService.logout();
  }
}
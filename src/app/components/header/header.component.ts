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

  constructor(
    private router: Router, 
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

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
    // Close mobile menu if open
    if (this.isMobileMenuOpen) {
      this.isMobileMenuOpen = false;
    }
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    // Close dropdown if open
    if (this.isDropdownOpen) {
      this.isDropdownOpen = false;
    }
  }

  // Close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    const userMenuButton = document.getElementById('user-menu-button');
    
    // Check if click is outside the dropdown
    if (userMenuButton && !userMenuButton.contains(target) && !target.closest('.absolute')) {
      this.isDropdownOpen = false;
    }
  }

  // Close menus on escape key
  @HostListener('document:keydown.escape')
  onEscapeKey() {
    this.isDropdownOpen = false;
    this.isMobileMenuOpen = false;
  }

  logout() {
    this.authService.logout();
  }
}
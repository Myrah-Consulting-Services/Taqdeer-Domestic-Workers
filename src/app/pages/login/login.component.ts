import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginCredentials } from '../../models/user.model';

interface LoginData {
  username: string;
  password: string;
  rememberMe: boolean;
}

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginData: LoginData = {
    username: '',
    password: '',
    rememberMe: false
  };

  showPassword = false;
  isLoading = false;
  errorMessage = '';
  showDemoCredentials = true;

  // Demo credentials
  demoUsers = [
    { username: 'admin', password: 'admin123', role: 'Admin (Full Access)', type: 'admin' },
    { username: 'agent001', password: 'agent123', role: 'Agent - Ahmed Hassan (AG001)', type: 'agent' },
    { username: 'agent002', password: 'agent123', role: 'Agent - Priya Sharma (AG002)', type: 'agent' },
    { username: 'agent003', password: 'agent123', role: 'Agent - Mohammed Ali (AG003)', type: 'agent' },
    { username: 'sarah.ahmed', password: 'password123', role: 'Employee - Receptionist (EMP001)', type: 'employee' },
    { username: 'khalid.hassan', password: 'password123', role: 'Employee - HR Manager (EMP002)', type: 'employee' },
    { username: 'priya.sharma', password: 'password123', role: 'Employee - Accountant (EMP003)', type: 'employee' },
    { username: 'omar.alfarsi', password: 'password123', role: 'Employee - Sales Executive (EMP004)', type: 'employee' },
    { username: 'ahmed.mohammed', password: 'password123', role: 'Employee - Operations Manager (EMP005)', type: 'employee' }
  ];

  constructor(
    private router: Router, 
    private authService: AuthService
  ) {
    // Check if already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  useDemoCredentials(username: string, password: string) {
    this.loginData.username = username;
    this.loginData.password = password;
  }

  onSubmit() {
    if (this.isLoading) return;

    if (!this.loginData.username || !this.loginData.password) {
      this.errorMessage = 'Please enter username and password';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const credentials: LoginCredentials = {
      username: this.loginData.username,
      password: this.loginData.password
    };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        if (response.success && response.user) {
          console.log('Login successful!', response.user);
          
          // Navigate based on role
          if (response.user.role === 'admin') {
            this.router.navigate(['/dashboard']);
          } else if (response.user.role === 'agent') {
            this.router.navigate(['/dashboard']);
          } else if (response.user.role === 'employee') {
            // Employee ko dashboard par bhejo with role-based access
            this.router.navigate(['/dashboard']);
          }
        } else {
          this.errorMessage = response.message || 'Invalid username or password';
          this.isLoading = false;
        }
      },
      error: (error) => {
        console.error('Login error:', error);
        this.errorMessage = 'An error occurred. Please try again.';
        this.isLoading = false;
      }
    });
  }
}
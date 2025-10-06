import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { EmployeeService } from '../../services/employee.service';
import { User } from '../../models/user.model';
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-hr-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './hr-dashboard.component.html',
  styleUrl: './hr-dashboard.component.css'
})
export class HrDashboardComponent implements OnInit {
  currentUser: User | null = null;
  employees: Employee[] = [];
  
  // HR Dashboard Data - will be populated from real employee data
  hrData = {
    // Key Performance Indicators
    totalEmployees: 0,
    onLeave: 0,
    underProbation: 0,
    warningLetterIssued: 0,
    
    // Employee Demographics - Gender
    employeesByGender: {
      female: { count: 0, percentage: 0 },
      male: { count: 0, percentage: 0 }
    },
    
    // Employee Demographics - Age
    employeesByAge: [
      { range: '0-19', count: 0, color: '#FF6384' },
      { range: '20-29', count: 0, color: '#36A2EB' },
      { range: '30-39', count: 0, color: '#FFCE56' },
      { range: '40-49', count: 0, color: '#4BC0C0' },
      { range: '50-59', count: 0, color: '#9966FF' },
      { range: '60-69', count: 0, color: '#FF9F40' }
    ],
    
    // Employee Demographics - Marital Status
    employeesByMaritalStatus: {
      married: { count: 0, percentage: 0 },
      single: { count: 0, percentage: 0 }
    },
    
    // Employee Demographics - Role (instead of Grade)
    employeesByRole: [
      { role: 'Receptionist', count: 0, color: '#FF6384' },
      { role: 'HR Manager', count: 0, color: '#36A2EB' },
      { role: 'Accountant', count: 0, color: '#FFCE56' },
      { role: 'Sales Executive', count: 0, color: '#4BC0C0' },
      { role: 'Operations Manager', count: 0, color: '#9966FF' }
    ],
    
    // Employee Tenure
    employeesByTenure: [
      { range: '0-1', count: 0 },
      { range: '1-3', count: 0 },
      { range: '3-5', count: 0 },
      { range: '5-10', count: 0 },
      { range: '10-15', count: 0 },
      { range: '15-20', count: 0 },
      { range: 'More than 20', count: 0 }
    ],
    
    // Employee by Department
    employeesByDepartment: [
      { department: 'Front Desk', count: 0 },
      { department: 'Human Resources', count: 0 },
      { department: 'Finance', count: 0 },
      { department: 'Sales & Marketing', count: 0 },
      { department: 'Operations', count: 0 },
      { department: 'Administration', count: 0 }
    ]
  };

  constructor(
    private authService: AuthService,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    
    // Load employee data
    this.loadEmployeeData();
  }

  loadEmployeeData(): void {
    this.employeeService.getEmployees().subscribe(employees => {
      this.employees = employees;
      this.calculateHRData();
    });
  }

  calculateHRData(): void {
    // Calculate KPIs
    this.hrData.totalEmployees = this.employees.length;
    
    // Hardcoded data for demo purposes
    this.hrData.onLeave = 1; // Hardcoded: 1 employee on leave
    this.hrData.underProbation = 1; // Hardcoded: 1 employee under probation
    this.hrData.warningLetterIssued = 0; // Keep at 0 as requested

    // Calculate Gender Distribution
    const femaleCount = this.employees.filter(e => e.gender === 'female').length;
    const maleCount = this.employees.filter(e => e.gender === 'male').length;
    const totalGender = femaleCount + maleCount;
    
    this.hrData.employeesByGender = {
      female: { 
        count: femaleCount, 
        percentage: totalGender > 0 ? Math.round((femaleCount / totalGender) * 100) : 0 
      },
      male: { 
        count: maleCount, 
        percentage: totalGender > 0 ? Math.round((maleCount / totalGender) * 100) : 0 
      }
    };

    // Calculate Age Distribution
    this.hrData.employeesByAge = this.hrData.employeesByAge.map(ageGroup => {
      const currentYear = new Date().getFullYear();
      let count = 0;
      
      switch (ageGroup.range) {
        case '0-19':
          count = this.employees.filter(e => {
            const age = currentYear - new Date(e.dateOfBirth).getFullYear();
            return age >= 0 && age <= 19;
          }).length;
          break;
        case '20-29':
          count = this.employees.filter(e => {
            const age = currentYear - new Date(e.dateOfBirth).getFullYear();
            return age >= 20 && age <= 29;
          }).length;
          break;
        case '30-39':
          count = this.employees.filter(e => {
            const age = currentYear - new Date(e.dateOfBirth).getFullYear();
            return age >= 30 && age <= 39;
          }).length;
          break;
        case '40-49':
          count = this.employees.filter(e => {
            const age = currentYear - new Date(e.dateOfBirth).getFullYear();
            return age >= 40 && age <= 49;
          }).length;
          break;
        case '50-59':
          count = this.employees.filter(e => {
            const age = currentYear - new Date(e.dateOfBirth).getFullYear();
            return age >= 50 && age <= 59;
          }).length;
          break;
        case '60-69':
          count = this.employees.filter(e => {
            const age = currentYear - new Date(e.dateOfBirth).getFullYear();
            return age >= 60 && age <= 69;
          }).length;
          break;
      }
      
      return { ...ageGroup, count };
    });

    // Calculate Marital Status Distribution
    const marriedCount = this.employees.filter(e => e.maritalStatus === 'married').length;
    const singleCount = this.employees.filter(e => e.maritalStatus === 'single').length;
    const totalMarital = marriedCount + singleCount;
    
    this.hrData.employeesByMaritalStatus = {
      married: { 
        count: marriedCount, 
        percentage: totalMarital > 0 ? Math.round((marriedCount / totalMarital) * 100) : 0 
      },
      single: { 
        count: singleCount, 
        percentage: totalMarital > 0 ? Math.round((singleCount / totalMarital) * 100) : 0 
      }
    };

    // Calculate Role Distribution
    this.hrData.employeesByRole = this.hrData.employeesByRole.map(roleGroup => {
      const count = this.employees.filter(e => e.role === roleGroup.role).length;
      return { ...roleGroup, count };
    });

    // Calculate Tenure Distribution
    this.hrData.employeesByTenure = this.hrData.employeesByTenure.map(tenureGroup => {
      let count = 0;
      const currentDate = new Date();
      
      switch (tenureGroup.range) {
        case '0-1':
          count = this.employees.filter(e => {
            const years = (currentDate.getTime() - new Date(e.joiningDate).getTime()) / (1000 * 60 * 60 * 24 * 365);
            return years >= 0 && years < 1;
          }).length;
          break;
        case '1-3':
          count = this.employees.filter(e => {
            const years = (currentDate.getTime() - new Date(e.joiningDate).getTime()) / (1000 * 60 * 60 * 24 * 365);
            return years >= 1 && years < 3;
          }).length;
          break;
        case '3-5':
          count = this.employees.filter(e => {
            const years = (currentDate.getTime() - new Date(e.joiningDate).getTime()) / (1000 * 60 * 60 * 24 * 365);
            return years >= 3 && years < 5;
          }).length;
          break;
        case '5-10':
          count = this.employees.filter(e => {
            const years = (currentDate.getTime() - new Date(e.joiningDate).getTime()) / (1000 * 60 * 60 * 24 * 365);
            return years >= 5 && years < 10;
          }).length;
          break;
        case '10-15':
          count = this.employees.filter(e => {
            const years = (currentDate.getTime() - new Date(e.joiningDate).getTime()) / (1000 * 60 * 60 * 24 * 365);
            return years >= 10 && years < 15;
          }).length;
          break;
        case '15-20':
          count = this.employees.filter(e => {
            const years = (currentDate.getTime() - new Date(e.joiningDate).getTime()) / (1000 * 60 * 60 * 24 * 365);
            return years >= 15 && years < 20;
          }).length;
          break;
        case 'More than 20':
          count = this.employees.filter(e => {
            const years = (currentDate.getTime() - new Date(e.joiningDate).getTime()) / (1000 * 60 * 60 * 24 * 365);
            return years >= 20;
          }).length;
          break;
      }
      
      return { ...tenureGroup, count };
    });

    // Calculate Department Distribution
    this.hrData.employeesByDepartment = this.hrData.employeesByDepartment.map(deptGroup => {
      const count = this.employees.filter(e => e.department === deptGroup.department).length;
      return { ...deptGroup, count };
    });
  }

  get isHRManager(): boolean {
    return this.currentUser?.role === 'employee' && this.currentUser?.employeeRole === 'HR Manager';
  }

  formatNumber(num: number): string {
    return num.toLocaleString();
  }

  getGenderColor(gender: string): string {
    return gender === 'female' ? '#4CAF50' : '#2196F3';
  }

  getAgeColor(index: number): string {
    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];
    return colors[index % colors.length];
  }

  getMaritalStatusColor(status: string): string {
    return status === 'married' ? '#4CAF50' : '#2196F3';
  }

  getRoleColor(index: number): string {
    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];
    return colors[index % colors.length];
  }

  getDepartmentColor(index: number): string {
    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384', '#36A2EB'];
    return colors[index % colors.length];
  }


  // Chart calculation methods
  getTotalAgeCount(): number {
    return this.hrData.employeesByAge.reduce((sum, age) => sum + age.count, 0);
  }

  getTotalRoleCount(): number {
    return this.hrData.employeesByRole.reduce((sum, role) => sum + role.count, 0);
  }

  getAgeDashArray(count: number, index: number): string {
    const total = this.getTotalAgeCount();
    const percentage = (count / total) * 100;
    const circumference = 2 * Math.PI * 40;
    const dashLength = (percentage / 100) * circumference;
    return `${dashLength} ${circumference}`;
  }

  getAgeDashOffset(index: number): number {
    let offset = 0;
    for (let i = 0; i < index; i++) {
      const total = this.getTotalAgeCount();
      const percentage = (this.hrData.employeesByAge[i].count / total) * 100;
      const circumference = 2 * Math.PI * 40;
      offset += (percentage / 100) * circumference;
    }
    return -offset;
  }

  getRoleDashArray(count: number, index: number): string {
    const total = this.getTotalRoleCount();
    const percentage = (count / total) * 100;
    const circumference = 2 * Math.PI * 40;
    const dashLength = (percentage / 100) * circumference;
    return `${dashLength} ${circumference}`;
  }

  getRoleDashOffset(index: number): number {
    let offset = 0;
    for (let i = 0; i < index; i++) {
      const total = this.getTotalRoleCount();
      const percentage = (this.hrData.employeesByRole[i].count / total) * 100;
      const circumference = 2 * Math.PI * 40;
      offset += (percentage / 100) * circumference;
    }
    return -offset;
  }

  getTenurePercentage(count: number): number {
    const maxCount = Math.max(...this.hrData.employeesByTenure.map(t => t.count));
    return (count / maxCount) * 100;
  }

  getDepartmentPercentage(count: number): number {
    const maxCount = Math.max(...this.hrData.employeesByDepartment.map(d => d.count));
    return (count / maxCount) * 100;
  }


  // Gender chart methods
  getGenderDashArray(gender: string): string {
    const percentage = gender === 'female' ? 
      this.hrData.employeesByGender.female.percentage : 
      this.hrData.employeesByGender.male.percentage;
    const circumference = 2 * Math.PI * 40;
    const dashLength = (percentage / 100) * circumference;
    return `${dashLength} ${circumference}`;
  }

  getGenderDashOffset(gender: string): number {
    if (gender === 'male') {
      const circumference = 2 * Math.PI * 40;
      const femalePercentage = this.hrData.employeesByGender.female.percentage;
      return -(femalePercentage / 100) * circumference;
    }
    return 0;
  }

  // Marital status chart methods
  getMaritalStatusDashArray(status: string): string {
    const percentage = status === 'married' ? 
      this.hrData.employeesByMaritalStatus.married.percentage : 
      this.hrData.employeesByMaritalStatus.single.percentage;
    const circumference = 2 * Math.PI * 40;
    const dashLength = (percentage / 100) * circumference;
    return `${dashLength} ${circumference}`;
  }

  getMaritalStatusDashOffset(status: string): number {
    if (status === 'single') {
      const circumference = 2 * Math.PI * 40;
      const marriedPercentage = this.hrData.employeesByMaritalStatus.married.percentage;
      return -(marriedPercentage / 100) * circumference;
    }
    return 0;
  }
}

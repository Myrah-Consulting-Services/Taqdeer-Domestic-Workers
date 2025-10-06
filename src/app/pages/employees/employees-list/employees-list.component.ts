import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Employee, EmployeeRole, EmployeeStatus, EmployeeFormData } from '../../../models/employee.model';
import { EmployeeService } from '../../../services/employee.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-employees-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './employees-list.component.html',
  styleUrl: './employees-list.component.css'
})
export class EmployeesListComponent implements OnInit {
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  
  // Filter states
  searchTerm: string = '';
  roleFilter: string = 'all';
  statusFilter: string = 'all';
  departmentFilter: string = 'all';
  stats: any = {};
  
  // Modal states
  showFormModal = false;
  showDeleteModal = false;
  
  // Alert states
  showSuccessAlert = false;
  alertMessage = '';
  
  // Current data
  selectedEmployee: Employee | null = null;
  employeeToDelete: Employee | null = null;
  isEditMode = false;
  
  // Form data
  formData: any = {
    employeeCode: '',
    fullName: '',
    email: '',
    phone: '',
    alternatePhone: '',
    dateOfBirth: new Date(),
    nationality: 'UAE',
    emiratesId: '',
    passportNumber: '',
    gender: 'male',
    maritalStatus: 'single',
    role: 'Receptionist',
    department: '',
    joiningDate: new Date(),
    employmentType: 'full-time',
    workingHours: '9:00 AM - 6:00 PM',
    basicSalary: 0,
    allowances: 0,
    paymentMode: 'bank-transfer',
    bankName: '',
    accountNumber: '',
    iban: '',
    username: '',
    password: '',
    hasSystemAccess: true,
    status: 'active',
    reportingTo: '',
    address: '',
    city: 'Dubai',
    country: 'UAE',
    notes: '',
    emergencyContact: {
      name: '',
      relationship: '',
      phone: ''
    }
  };

  roles: EmployeeRole[] = ['Receptionist', 'HR Manager', 'Accountant', 'Sales Executive', 'Operations Manager'];
  departments: string[] = ['Front Desk', 'Human Resources', 'Finance', 'Sales & Marketing', 'Operations', 'Administration'];

  constructor(
    private employeeService: EmployeeService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
    this.loadStats();
  }

  loadEmployees(): void {
    this.employeeService.getEmployees().subscribe(employees => {
      this.employees = employees;
      this.applyFilters();
    });
  }

  loadStats(): void {
    this.stats = this.employeeService.getStats();
  }

  applyFilters(): void {
    this.filteredEmployees = this.employees.filter(employee => {
      const matchesSearch = !this.searchTerm || 
        employee.fullName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        employee.employeeCode.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesRole = this.roleFilter === 'all' || employee.role === this.roleFilter;
      const matchesStatus = this.statusFilter === 'all' || employee.status === this.statusFilter;
      const matchesDepartment = this.departmentFilter === 'all' || employee.department === this.departmentFilter;
      
      return matchesSearch && matchesRole && matchesStatus && matchesDepartment;
    });
  }

  viewEmployeeDetails(employee: Employee): void {
    this.router.navigate(['/employees', employee.id]);
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.resetForm();
    this.formData.employeeCode = this.employeeService.generateEmployeeCode();
    this.showFormModal = true;
  }

  openEditModal(employee: Employee): void {
    this.isEditMode = true;
    this.selectedEmployee = employee;
    this.formData = {
      ...employee,
      dateOfBirth: new Date(employee.dateOfBirth),
      joiningDate: new Date(employee.joiningDate),
      emergencyContact: employee.emergencyContact || { name: '', relationship: '', phone: '' }
    };
    this.showFormModal = true;
  }

  closeFormModal(): void {
    this.showFormModal = false;
    this.selectedEmployee = null;
    this.resetForm();
  }

  submitForm(): void {
    if (this.isEditMode && this.selectedEmployee) {
      const updatedEmployee: Employee = {
        ...this.selectedEmployee,
        ...this.formData,
        totalSalary: this.formData.basicSalary + (this.formData.allowances || 0),
        lastUpdated: new Date()
      };
      this.employeeService.updateEmployee(updatedEmployee);
      this.showSuccessMessage(`✓ Employee ${updatedEmployee.fullName} updated successfully!`);
    } else {
      const newEmployee: Employee = {
        id: '',
        ...this.formData,
        totalSalary: this.formData.basicSalary + (this.formData.allowances || 0),
        createdBy: this.authService.currentUser?.username || 'admin',
        createdDate: new Date(),
        lastUpdated: new Date()
      };
      this.employeeService.addEmployee(newEmployee);
      this.showSuccessMessage(`✓ Employee ${newEmployee.fullName} added successfully!`);
    }
    this.closeFormModal();
    this.loadEmployees();
    this.loadStats();
  }

  openDeleteModal(employee: Employee): void {
    this.employeeToDelete = employee;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.employeeToDelete = null;
  }

  confirmDelete(): void {
    if (this.employeeToDelete) {
      const employeeName = this.employeeToDelete.fullName;
      this.employeeService.deleteEmployee(this.employeeToDelete.id);
      this.closeDeleteModal();
      this.loadEmployees();
      this.loadStats();
      this.showSuccessMessage(`✓ Employee ${employeeName} deleted successfully!`);
    }
  }

  resetForm(): void {
    this.formData = {
      employeeCode: '',
      fullName: '',
      email: '',
      phone: '',
      alternatePhone: '',
      dateOfBirth: new Date(),
      nationality: 'UAE',
      emiratesId: '',
      passportNumber: '',
      gender: 'male',
      maritalStatus: 'single',
      role: 'Receptionist',
      department: '',
      joiningDate: new Date(),
      employmentType: 'full-time',
      workingHours: '9:00 AM - 6:00 PM',
      basicSalary: 0,
      allowances: 0,
      paymentMode: 'bank-transfer',
      bankName: '',
      accountNumber: '',
      iban: '',
      username: '',
      password: '',
      hasSystemAccess: true,
      status: 'active',
      reportingTo: '',
      address: '',
      city: 'Dubai',
      country: 'UAE',
      notes: '',
      emergencyContact: {
        name: '',
        relationship: '',
        phone: ''
      }
    };
  }

  getStatusClass(status: EmployeeStatus): string {
    const statusMap: { [key: string]: string } = {
      'active': 'bg-green-100 text-green-800',
      'inactive': 'bg-gray-100 text-gray-800',
      'on-leave': 'bg-yellow-100 text-yellow-800',
      'terminated': 'bg-red-100 text-red-800'
    };
    return statusMap[status] || 'bg-gray-100 text-gray-800';
  }

  getRoleBadgeClass(role: EmployeeRole): string {
    const roleMap: { [key: string]: string } = {
      'Receptionist': 'bg-blue-100 text-blue-800',
      'HR Manager': 'bg-purple-100 text-purple-800',
      'Accountant': 'bg-green-100 text-green-800',
      'Sales Executive': 'bg-orange-100 text-orange-800',
      'Operations Manager': 'bg-indigo-100 text-indigo-800'
    };
    return roleMap[role] || 'bg-gray-100 text-gray-800';
  }

  formatCurrency(amount: number): string {
    return `AED ${amount.toLocaleString()}`;
  }

  formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  showSuccessMessage(message: string): void {
    this.alertMessage = message;
    this.showSuccessAlert = true;
    setTimeout(() => {
      this.showSuccessAlert = false;
    }, 3000);
  }

  exportToExcel(): void {
    this.showSuccessMessage('Export to Excel functionality will be implemented soon!');
  }

  printList(): void {
    window.print();
  }
}


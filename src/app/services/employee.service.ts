import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Employee, EmployeeRole, EmployeeStatus } from '../models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private employees: Employee[] = [
    {
      id: '1',
      employeeCode: 'EMP001',
      fullName: 'Sarah Ahmed',
      email: 'sarah.ahmed@taqdeer.ae',
      phone: '+971501234567',
      dateOfBirth: new Date('1990-05-15'),
      nationality: 'UAE',
      emiratesId: '784-1990-1234567-1',
      gender: 'female',
      maritalStatus: 'single',
      role: 'Receptionist',
      department: 'Front Desk',
      joiningDate: new Date('2023-01-15'),
      employmentType: 'full-time',
      workingHours: '9:00 AM - 6:00 PM',
      basicSalary: 4500,
      allowances: 500,
      totalSalary: 5000,
      paymentMode: 'bank-transfer',
      bankName: 'Emirates NBD',
      accountNumber: '1234567890',
      iban: 'AE070331234567890123456',
      username: 'sarah.ahmed',
      password: 'password123',
      hasSystemAccess: true,
      status: 'active',
      address: 'Apartment 304, Marina Tower',
      city: 'Dubai',
      country: 'UAE',
      emergencyContact: {
        name: 'Mohammed Ahmed',
        relationship: 'Brother',
        phone: '+971509876543'
      },
      skills: ['Customer Service', 'MS Office', 'Communication'],
      createdBy: 'admin',
      createdDate: new Date('2023-01-15'),
      lastUpdated: new Date('2023-01-15')
    },
    {
      id: '2',
      employeeCode: 'EMP002',
      fullName: 'Khalid Hassan',
      email: 'khalid.hassan@taqdeer.ae',
      phone: '+971521234567',
      dateOfBirth: new Date('1988-08-20'),
      nationality: 'UAE',
      gender: 'male',
      maritalStatus: 'married',
      role: 'HR Manager',
      department: 'Human Resources',
      joiningDate: new Date('2022-03-01'),
      employmentType: 'full-time',
      workingHours: '8:00 AM - 5:00 PM',
      basicSalary: 8000,
      allowances: 2000,
      totalSalary: 10000,
      paymentMode: 'bank-transfer',
      bankName: 'Abu Dhabi Commercial Bank',
      accountNumber: '9876543210',
      iban: 'AE070339876543210987654',
      username: 'khalid.hassan',
      password: 'password123',
      hasSystemAccess: true,
      status: 'active',
      address: 'Villa 12, Al Nahda',
      city: 'Dubai',
      country: 'UAE',
      emergencyContact: {
        name: 'Fatima Hassan',
        relationship: 'Wife',
        phone: '+971509876544'
      },
      skills: ['Recruitment', 'Employee Relations', 'HR Policies', 'Performance Management'],
      createdBy: 'admin',
      createdDate: new Date('2022-03-01'),
      lastUpdated: new Date('2022-03-01')
    },
    {
      id: '3',
      employeeCode: 'EMP003',
      fullName: 'Priya Sharma',
      email: 'priya.sharma@taqdeer.ae',
      phone: '+971531234567',
      dateOfBirth: new Date('1992-11-10'),
      nationality: 'India',
      passportNumber: 'IN5432167',
      gender: 'female',
      maritalStatus: 'single',
      role: 'Accountant',
      department: 'Finance',
      joiningDate: new Date('2022-06-15'),
      employmentType: 'full-time',
      workingHours: '9:00 AM - 6:00 PM',
      basicSalary: 6000,
      allowances: 1000,
      totalSalary: 7000,
      paymentMode: 'bank-transfer',
      bankName: 'Mashreq Bank',
      accountNumber: '5551234567',
      iban: 'AE070335551234567555555',
      username: 'priya.sharma',
      password: 'password123',
      hasSystemAccess: true,
      status: 'active',
      address: 'Building 7, Apartment 102, JLT',
      city: 'Dubai',
      country: 'UAE',
      emergencyContact: {
        name: 'Rajesh Sharma',
        relationship: 'Father',
        phone: '+971509876545'
      },
      skills: ['Accounting', 'QuickBooks', 'Excel', 'Financial Reporting'],
      createdBy: 'admin',
      createdDate: new Date('2022-06-15'),
      lastUpdated: new Date('2022-06-15')
    },
    {
      id: '4',
      employeeCode: 'EMP004',
      fullName: 'Omar Al Farsi',
      email: 'omar.alfarsi@taqdeer.ae',
      phone: '+971541234567',
      dateOfBirth: new Date('1995-03-25'),
      nationality: 'UAE',
      emiratesId: '784-1995-7654321-2',
      gender: 'male',
      maritalStatus: 'single',
      role: 'Sales Executive',
      department: 'Sales & Marketing',
      joiningDate: new Date('2023-02-01'),
      employmentType: 'full-time',
      workingHours: '9:00 AM - 6:00 PM',
      basicSalary: 5000,
      allowances: 1500,
      totalSalary: 6500,
      paymentMode: 'bank-transfer',
      bankName: 'Dubai Islamic Bank',
      accountNumber: '7771234567',
      iban: 'AE070337771234567777777',
      username: 'omar.alfarsi',
      password: 'password123',
      hasSystemAccess: true,
      status: 'active',
      address: 'Villa 45, Jumeirah',
      city: 'Dubai',
      country: 'UAE',
      emergencyContact: {
        name: 'Abdullah Al Farsi',
        relationship: 'Father',
        phone: '+971509876546'
      },
      skills: ['Sales', 'Customer Relations', 'Negotiation', 'Marketing'],
      createdBy: 'admin',
      createdDate: new Date('2023-02-01'),
      lastUpdated: new Date('2023-02-01')
    },
    {
      id: '5',
      employeeCode: 'EMP005',
      fullName: 'Ahmed Mohammed',
      email: 'ahmed.mohammed@taqdeer.ae',
      phone: '+971551234567',
      dateOfBirth: new Date('1985-07-12'),
      nationality: 'UAE',
      emiratesId: '784-1985-5555555-5',
      gender: 'male',
      maritalStatus: 'married',
      role: 'Operations Manager',
      department: 'Operations',
      joiningDate: new Date('2021-09-01'),
      employmentType: 'full-time',
      workingHours: '8:00 AM - 5:00 PM',
      basicSalary: 10000,
      allowances: 3000,
      totalSalary: 13000,
      paymentMode: 'bank-transfer',
      bankName: 'First Abu Dhabi Bank',
      accountNumber: '8881234567',
      iban: 'AE070338881234567888888',
      username: 'ahmed.mohammed',
      password: 'password123',
      hasSystemAccess: true,
      status: 'active',
      address: 'Villa 78, Al Barsha',
      city: 'Dubai',
      country: 'UAE',
      emergencyContact: {
        name: 'Layla Mohammed',
        relationship: 'Wife',
        phone: '+971509876547'
      },
      skills: ['Operations Management', 'Team Leadership', 'Process Optimization', 'Strategic Planning'],
      createdBy: 'admin',
      createdDate: new Date('2021-09-01'),
      lastUpdated: new Date('2021-09-01')
    }
  ];

  private employeesSubject = new BehaviorSubject<Employee[]>(this.employees);
  employees$ = this.employeesSubject.asObservable();

  constructor() { }

  // CRUD Operations
  getEmployees(): Observable<Employee[]> {
    return this.employees$;
  }

  getAllEmployees(): Employee[] {
    return [...this.employees];
  }

  getEmployeeById(id: string): Employee | undefined {
    return this.employees.find(e => e.id === id);
  }

  getEmployeeByUsername(username: string): Employee | undefined {
    return this.employees.find(e => e.username === username);
  }

  getEmployeesByRole(role: EmployeeRole): Employee[] {
    return this.employees.filter(e => e.role === role);
  }

  getActiveEmployees(): Employee[] {
    return this.employees.filter(e => e.status === 'active');
  }

  addEmployee(employee: Employee): void {
    employee.id = (this.employees.length + 1).toString();
    employee.createdDate = new Date();
    employee.lastUpdated = new Date();
    employee.totalSalary = employee.basicSalary + (employee.allowances || 0);
    this.employees.push(employee);
    this.employeesSubject.next([...this.employees]);
  }

  updateEmployee(updatedEmployee: Employee): void {
    const index = this.employees.findIndex(e => e.id === updatedEmployee.id);
    if (index > -1) {
      updatedEmployee.lastUpdated = new Date();
      updatedEmployee.totalSalary = updatedEmployee.basicSalary + (updatedEmployee.allowances || 0);
      this.employees[index] = updatedEmployee;
      this.employeesSubject.next([...this.employees]);
    }
  }

  deleteEmployee(id: string): void {
    this.employees = this.employees.filter(e => e.id !== id);
    this.employeesSubject.next([...this.employees]);
  }

  generateEmployeeCode(): string {
    const lastEmployee = this.employees
      .sort((a, b) => a.employeeCode.localeCompare(b.employeeCode))
      .pop();
    
    if (lastEmployee) {
      const lastNumber = parseInt(lastEmployee.employeeCode.replace('EMP', ''), 10);
      return 'EMP' + String(lastNumber + 1).padStart(3, '0');
    }
    return 'EMP001';
  }

  // Authentication
  authenticateEmployee(username: string, password: string): Employee | null {
    const employee = this.employees.find(
      e => e.username === username && 
           e.password === password && 
           e.hasSystemAccess && 
           e.status === 'active'
    );
    
    if (employee) {
      employee.lastLogin = new Date();
      this.updateEmployee(employee);
      return employee;
    }
    return null;
  }

  // Statistics
  getStats() {
    return {
      totalEmployees: this.employees.length,
      activeEmployees: this.employees.filter(e => e.status === 'active').length,
      inactiveEmployees: this.employees.filter(e => e.status === 'inactive').length,
      onLeave: this.employees.filter(e => e.status === 'on-leave').length,
      byRole: {
        receptionist: this.employees.filter(e => e.role === 'Receptionist').length,
        hrManager: this.employees.filter(e => e.role === 'HR Manager').length,
        accountant: this.employees.filter(e => e.role === 'Accountant').length,
        salesExecutive: this.employees.filter(e => e.role === 'Sales Executive').length,
        operationsManager: this.employees.filter(e => e.role === 'Operations Manager').length
      },
      totalSalaryExpense: this.employees
        .filter(e => e.status === 'active')
        .reduce((sum, e) => sum + e.totalSalary, 0)
    };
  }
}














import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { User, LoginCredentials, LoginResponse, RolePermissions, UserRole, EmployeeRolePermissions } from '../models/user.model';
import { EmployeeService } from './employee.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;
  
  // Mock users for demonstration
  private users: User[] = [
    // Admin Users
    {
      id: '1',
      username: 'admin',
      email: 'admin@taqdeer.com',
      password: 'admin123',
      fullName: 'System Administrator',
      role: 'admin',
      status: 'active',
      createdDate: new Date('2024-01-01'),
      phone: '+971501111111',
      permissions: RolePermissions.admin
    },
    // Agent Users - Linked to existing agents
    {
      id: '2',
      username: 'agent001',
      email: 'ahmed@globalrecruitment.com',
      password: 'agent123',
      fullName: 'Ahmed Hassan',
      role: 'agent',
      status: 'active',
      createdDate: new Date('2024-01-15'),
      agentId: '1',
      agentCode: 'AG001',
      phone: '+971501234567',
      permissions: RolePermissions.agent
    },
    {
      id: '3',
      username: 'agent002',
      email: 'priya@asiapacific.com',
      password: 'agent123',
      fullName: 'Priya Sharma',
      role: 'agent',
      status: 'active',
      createdDate: new Date('2024-01-20'),
      agentId: '2',
      agentCode: 'AG002',
      phone: '+971509876543',
      permissions: RolePermissions.agent
    },
    {
      id: '4',
      username: 'agent003',
      email: 'mohammed@eastafrica.com',
      password: 'agent123',
      fullName: 'Mohammed Ali',
      role: 'agent',
      status: 'active',
      createdDate: new Date('2024-01-25'),
      agentId: '3',
      agentCode: 'AG003',
      phone: '+971505555555',
      permissions: RolePermissions.agent
    }
  ];

  constructor(
    private router: Router,
    private employeeService: EmployeeService
  ) {
    // Load user from localStorage if exists
    const storedUser = localStorage.getItem('currentUser');
    const user = storedUser ? JSON.parse(storedUser) : null;
    console.log('Auth Service - Loading user from localStorage:', user);
    this.currentUserSubject = new BehaviorSubject<User | null>(user);
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  public get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  login(credentials: LoginCredentials): Observable<LoginResponse> {
    return new Observable(observer => {
      // Simulate API call delay
      setTimeout(() => {
        // First check regular users (admin, agent)
        let user = this.users.find(
          u => (u.username === credentials.username || u.email === credentials.username) 
          && u.password === credentials.password
          && u.status === 'active'
        );

        // If not found, check employee credentials
        if (!user) {
          console.log('Auth Service - Checking employee credentials for:', credentials.username);
          const employee = this.employeeService.authenticateEmployee(credentials.username, credentials.password);
          console.log('Auth Service - Employee found:', employee);
          if (employee) {
            // Get role-specific permissions for employee
            const employeePermissions = EmployeeRolePermissions[employee.role] || RolePermissions.employee;
            
            // Convert employee to user format
            user = {
              id: employee.id,
              username: employee.username,
              email: employee.email,
              password: employee.password,
              fullName: employee.fullName,
              role: 'employee',
              status: employee.status === 'active' ? 'active' : 'inactive',
              createdDate: employee.createdDate,
              employeeId: employee.id,
              employeeCode: employee.employeeCode,
              employeeRole: employee.role,
              phone: employee.phone,
              permissions: employeePermissions // Use role-specific permissions
            };
            console.log('Auth Service - Created user object:', user);
          }
        }

        if (user) {
          // Don't send password in response
          const { password, ...userWithoutPassword } = user;
          
          // Update last login
          user.lastLogin = new Date();
          
          // Store user in localStorage
          localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
          localStorage.setItem('authToken', 'mock-jwt-token-' + user.id);
          
          // Update subject
          this.currentUserSubject.next(userWithoutPassword as User);

          observer.next({
            success: true,
            message: 'Login successful',
            user: userWithoutPassword as User,
            token: 'mock-jwt-token-' + user.id
          });
        } else {
          observer.next({
            success: false,
            message: 'Invalid username or password'
          });
        }
        observer.complete();
      }, 500);
    });
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this.currentUser !== null;
  }

  isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }

  isAgent(): boolean {
    return this.currentUser?.role === 'agent';
  }

  isEmployee(): boolean {
    return this.currentUser?.role === 'employee';
  }

  hasRole(roles: UserRole[]): boolean {
    const user = this.currentUser;
    return user ? roles.includes(user.role) : false;
  }

  hasPermission(permissionKey: keyof User['permissions']): boolean {
    const user = this.currentUser;
    return user ? user.permissions[permissionKey] : false;
  }

  canAccessRoute(requiredRoles?: UserRole[]): boolean {
    if (!this.isLoggedIn()) {
      return false;
    }
    
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }
    
    return this.hasRole(requiredRoles);
  }

  getUsersByRole(role: UserRole): User[] {
    return this.users.filter(u => u.role === role && u.status === 'active')
      .map(({ password, ...user }) => user as User);
  }

  getAllUsers(): User[] {
    return this.users.map(({ password, ...user }) => user as User);
  }

  getUserById(id: string): User | undefined {
    const user = this.users.find(u => u.id === id);
    if (user) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword as User;
    }
    return undefined;
  }

  updateUser(id: string, userData: Partial<User>): boolean {
    const index = this.users.findIndex(u => u.id === id);
    if (index !== -1) {
      this.users[index] = { ...this.users[index], ...userData };
      
      // Update current user if it's the same
      if (this.currentUser?.id === id) {
        const { password, ...userWithoutPassword } = this.users[index];
        localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
        this.currentUserSubject.next(userWithoutPassword as User);
      }
      
      return true;
    }
    return false;
  }

  addUser(userData: Omit<User, 'id' | 'createdDate'>, password: string = 'default123'): User {
    const newUser: any = {
      ...userData,
      id: this.generateId(),
      createdDate: new Date(),
      password: password
    };
    
    this.users.push(newUser);
    
    const { password: pwd, ...userWithoutPassword } = newUser;
    return userWithoutPassword as User;
  }

  deleteUser(id: string): boolean {
    const index = this.users.findIndex(u => u.id === id);
    if (index !== -1) {
      this.users.splice(index, 1);
      return true;
    }
    return false;
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Get all mock users for demo purposes
  getMockUsers(): Array<{username: string, password: string, role: UserRole}> {
    return this.users.map(u => ({
      username: u.username,
      password: u.password || '',
      role: u.role
    }));
  }
}
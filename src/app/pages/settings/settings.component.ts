import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkerService } from '../../services/worker.service';
import { Worker } from '../../models/worker.model';

interface ModulePermission {
  moduleName: string;
  moduleId: string;
  permissions: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
  };
}

interface RolePermission {
  roleId: string;
  roleName: string;
  department: string;
  modules: ModulePermission[];
}

@Component({
  selector: 'app-settings',
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit {
  // Tab management
  activeTab: 'configuration' | 'permissions' = 'configuration';

  // Permissions management
  availableRoles: RolePermission[] = [];
  selectedRole: RolePermission | null = null;
  departments: string[] = ['HR', 'Sales', 'Accounts & Finance', 'Operations', 'Admin'];
  
  // Modal management
  showCreateRoleModal = false;
  newRole = {
    roleId: '',
    roleName: '',
    department: '',
    modules: [] as ModulePermission[]
  };
  
  availableModules = [
    { id: 'workers', name: 'Workers Management' },
    { id: 'sponsors', name: 'Sponsors Management' },
    { id: 'agents', name: 'Agents Management' },
    { id: 'sales', name: 'Sales Management' },
    { id: 'accounts', name: 'Accounts & Finance' },
    { id: 'employees', name: 'Employee Management' },
    { id: 'attendance', name: 'Attendance' },
    { id: 'dashboard', name: 'Dashboard' },
    { id: 'settings', name: 'Settings' }
  ];

  // Auto-fetch settings
  autoFetchEnabled = false;
  fetchInterval = 30; // minutes
  fetchSources = {
    email: true,
    whatsapp: true,
    website: true
  };

  // Email settings
  emailSettings = {
    imapServer: '',
    imapPort: 993,
    username: '',
    password: '',
    folder: 'INBOX',
    sslEnabled: true
  };

  // WhatsApp settings
  whatsappSettings = {
    apiKey: '',
    webhookUrl: '',
    phoneNumber: '',
    businessAccountId: ''
  };

  // Website settings
  websiteSettings = {
    apiEndpoint: '',
    apiKey: '',
    fetchUrl: '',
    headers: {}
  };

  // Data processing settings
  processingSettings = {
    autoCreateWorkers: true,
    duplicateCheck: true,
    dataValidation: true,
    notificationEnabled: true
  };

  // Recent fetched data
  recentFetchedData: any[] = [];
  isFetching = false;
  lastFetchTime: Date | null = null;

  constructor(private workerService: WorkerService) {}

  ngOnInit() {
    this.loadSettings();
    this.loadRecentData();
    this.loadRolePermissions();
  }

  // Tab switching
  switchTab(tab: 'configuration' | 'permissions') {
    this.activeTab = tab;
  }

  // Permissions management methods
  loadRolePermissions() {
    const savedPermissions = localStorage.getItem('rolePermissions');
    if (savedPermissions) {
      this.availableRoles = JSON.parse(savedPermissions);
    } else {
      // Initialize default roles
      this.availableRoles = [
        this.createDefaultRole('admin', 'Administrator', 'Admin'),
        this.createDefaultRole('hr_manager', 'HR Manager', 'HR'),
        this.createDefaultRole('sales_manager', 'Sales Manager', 'Sales'),
        this.createDefaultRole('accountant', 'Accountant', 'Accounts & Finance'),
        this.createDefaultRole('operations', 'Operations Manager', 'Operations')
      ];
      this.saveRolePermissions();
    }
  }

  createDefaultRole(roleId: string, roleName: string, department: string): RolePermission {
    const modules: ModulePermission[] = this.availableModules.map(module => ({
      moduleName: module.name,
      moduleId: module.id,
      permissions: {
        view: roleId === 'admin', // Admin has all permissions by default
        create: roleId === 'admin',
        edit: roleId === 'admin',
        delete: roleId === 'admin'
      }
    }));

    return {
      roleId,
      roleName,
      department,
      modules
    };
  }

  saveRolePermissions() {
    localStorage.setItem('rolePermissions', JSON.stringify(this.availableRoles));
  }

  onRoleSelect(event: any) {
    const roleId = event.target.value;
    this.selectedRole = this.availableRoles.find(role => role.roleId === roleId) || null;
  }

  togglePermission(moduleId: string, permissionType: 'view' | 'create' | 'edit' | 'delete') {
    if (!this.selectedRole) return;

    const module = this.selectedRole.modules.find(m => m.moduleId === moduleId);
    if (module) {
      module.permissions[permissionType] = !module.permissions[permissionType];
      
      // If disabling view, disable all other permissions
      if (permissionType === 'view' && !module.permissions.view) {
        module.permissions.create = false;
        module.permissions.edit = false;
        module.permissions.delete = false;
      }
      
      // If enabling create/edit/delete, automatically enable view
      if ((permissionType === 'create' || permissionType === 'edit' || permissionType === 'delete') 
          && module.permissions[permissionType]) {
        module.permissions.view = true;
      }

      this.saveRolePermissions();
    }
  }

  toggleAllPermissions(moduleId: string, enabled: boolean) {
    if (!this.selectedRole) return;

    const module = this.selectedRole.modules.find(m => m.moduleId === moduleId);
    if (module) {
      module.permissions.view = enabled;
      module.permissions.create = enabled;
      module.permissions.edit = enabled;
      module.permissions.delete = enabled;
      this.saveRolePermissions();
    }
  }

  // Modal management methods
  openCreateRoleModal() {
    this.showCreateRoleModal = true;
    this.resetNewRoleForm();
  }

  closeCreateRoleModal() {
    this.showCreateRoleModal = false;
    this.resetNewRoleForm();
  }

  resetNewRoleForm() {
    this.newRole = {
      roleId: '',
      roleName: '',
      department: '',
      modules: this.availableModules.map(module => ({
        moduleName: module.name,
        moduleId: module.id,
        permissions: {
          view: false,
          create: false,
          edit: false,
          delete: false
        }
      }))
    };
  }

  createNewRole() {
    // Validate form
    if (!this.newRole.roleName || !this.newRole.department) {
      alert('Please fill in all required fields');
      return;
    }

    // Generate role ID from role name
    this.newRole.roleId = this.newRole.roleName.toLowerCase().replace(/\s+/g, '_');

    // Check if role ID already exists
    if (this.availableRoles.some(role => role.roleId === this.newRole.roleId)) {
      alert('A role with this name already exists');
      return;
    }

    // Add new role to available roles
    const newRolePermission: RolePermission = {
      roleId: this.newRole.roleId,
      roleName: this.newRole.roleName,
      department: this.newRole.department,
      modules: [...this.newRole.modules]
    };

    this.availableRoles.push(newRolePermission);
    this.saveRolePermissions();

    // Close modal and select the new role
    this.closeCreateRoleModal();
    this.selectedRole = newRolePermission;
    
    alert('Role created successfully!');
  }

  toggleNewRolePermission(moduleId: string, permissionType: 'view' | 'create' | 'edit' | 'delete') {
    const module = this.newRole.modules.find(m => m.moduleId === moduleId);
    if (module) {
      module.permissions[permissionType] = !module.permissions[permissionType];
      
      // If disabling view, disable all other permissions
      if (permissionType === 'view' && !module.permissions.view) {
        module.permissions.create = false;
        module.permissions.edit = false;
        module.permissions.delete = false;
      }
      
      // If enabling create/edit/delete, automatically enable view
      if ((permissionType === 'create' || permissionType === 'edit' || permissionType === 'delete') 
          && module.permissions[permissionType]) {
        module.permissions.view = true;
      }
    }
  }

  toggleAllNewRolePermissions(moduleId: string, enabled: boolean) {
    const module = this.newRole.modules.find(m => m.moduleId === moduleId);
    if (module) {
      module.permissions.view = enabled;
      module.permissions.create = enabled;
      module.permissions.edit = enabled;
      module.permissions.delete = enabled;
    }
  }

  deleteRole(roleId: string) {
    if (roleId === 'admin') {
      alert('Cannot delete Administrator role');
      return;
    }

    if (confirm('Are you sure you want to delete this role?')) {
      this.availableRoles = this.availableRoles.filter(role => role.roleId !== roleId);
      this.saveRolePermissions();
      
      if (this.selectedRole?.roleId === roleId) {
        this.selectedRole = null;
      }
      
      alert('Role deleted successfully!');
    }
  }

  private loadSettings() {
    // Load settings from localStorage or API
    const savedSettings = localStorage.getItem('autoFetchSettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      this.autoFetchEnabled = settings.autoFetchEnabled || false;
      this.fetchInterval = settings.fetchInterval || 30;
      this.fetchSources = settings.fetchSources || this.fetchSources;
      this.emailSettings = settings.emailSettings || this.emailSettings;
      this.whatsappSettings = settings.whatsappSettings || this.whatsappSettings;
      this.websiteSettings = settings.websiteSettings || this.websiteSettings;
      this.processingSettings = settings.processingSettings || this.processingSettings;
    }
  }

  private saveSettings() {
    const settings = {
      autoFetchEnabled: this.autoFetchEnabled,
      fetchInterval: this.fetchInterval,
      fetchSources: this.fetchSources,
      emailSettings: this.emailSettings,
      whatsappSettings: this.whatsappSettings,
      websiteSettings: this.websiteSettings,
      processingSettings: this.processingSettings
    };
    localStorage.setItem('autoFetchSettings', JSON.stringify(settings));
  }

  private loadRecentData() {
    const recentData = localStorage.getItem('recentFetchedData');
    if (recentData) {
      this.recentFetchedData = JSON.parse(recentData);
    }
  }

  toggleAutoFetch() {
    this.autoFetchEnabled = !this.autoFetchEnabled;
    this.saveSettings();
    
    if (this.autoFetchEnabled) {
      this.startAutoFetch();
    } else {
      this.stopAutoFetch();
    }
  }

  private startAutoFetch() {
    // Start interval for auto-fetching
    setInterval(() => {
      if (this.autoFetchEnabled) {
        this.fetchDataFromAllSources();
      }
    }, this.fetchInterval * 60 * 1000); // Convert minutes to milliseconds
  }

  private stopAutoFetch() {
    // Stop auto-fetching logic
    console.log('Auto-fetch stopped');
  }

  async fetchDataFromAllSources() {
    if (this.isFetching) return;
    
    this.isFetching = true;
    this.lastFetchTime = new Date();

    try {
      const fetchedData = [];

      // Fetch from email
      if (this.fetchSources.email) {
        const emailData = await this.fetchFromEmail();
        fetchedData.push(...emailData);
      }

      // Fetch from WhatsApp
      if (this.fetchSources.whatsapp) {
        const whatsappData = await this.fetchFromWhatsApp();
        fetchedData.push(...whatsappData);
      }

      // Fetch from website
      if (this.fetchSources.website) {
        const websiteData = await this.fetchFromWebsite();
        fetchedData.push(...websiteData);
      }

      // Process and save data
      await this.processFetchedData(fetchedData);
      
      // Update recent data
      this.recentFetchedData = fetchedData.slice(0, 10); // Keep last 10 items
      localStorage.setItem('recentFetchedData', JSON.stringify(this.recentFetchedData));

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      this.isFetching = false;
    }
  }

  private async fetchFromEmail(): Promise<any[]> {
    // Simulate email fetching
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            source: 'email',
            data: {
              subject: 'New Worker Application',
              from: 'applicant@example.com',
              content: 'Worker details: Name, Phone, Skills',
              timestamp: new Date()
            }
          }
        ]);
      }, 1000);
    });
  }

  private async fetchFromWhatsApp(): Promise<any[]> {
    // Simulate WhatsApp fetching
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            source: 'whatsapp',
            data: {
              message: 'New worker inquiry',
              from: '+1234567890',
              content: 'Worker information via WhatsApp',
              timestamp: new Date()
            }
          }
        ]);
      }, 1000);
    });
  }

  private async fetchFromWebsite(): Promise<any[]> {
    // Simulate website fetching
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            source: 'website',
            data: {
              form: 'Worker Registration Form',
              fields: {
                name: 'John Doe',
                phone: '+1234567890',
                skills: 'Housekeeping, Cooking'
              },
              timestamp: new Date()
            }
          }
        ]);
      }, 1000);
    });
  }

  private async processFetchedData(data: any[]) {
    for (const item of data) {
      if (this.processingSettings.autoCreateWorkers) {
        // Extract worker information and create worker record
        const workerData = this.extractWorkerData(item);
        if (workerData) {
          try {
            await this.workerService.addWorker(workerData);
            console.log('Worker created from fetched data:', workerData);
          } catch (error) {
            console.error('Error creating worker:', error);
          }
        }
      }
    }
  }

  private extractWorkerData(item: any): any | null {
    // Extract worker data based on source
    switch (item.source) {
      case 'email':
        return this.extractFromEmail(item.data);
      case 'whatsapp':
        return this.extractFromWhatsApp(item.data);
      case 'website':
        return this.extractFromWebsite(item.data);
      default:
        return null;
    }
  }

  private extractFromEmail(data: any): any | null {
    // Extract worker data from email content
    // This would use NLP or regex to extract structured data
    return {
      fullName: 'Extracted from Email',
      dateOfBirth: new Date('1990-01-01'),
      nationality: 'Ethiopia',
      gender: 'female',
      maritalStatus: 'single',
      passportNumber: 'TEMP123456',
      passportIssueDate: new Date(),
      passportExpiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      visaType: 'visit',
      workerType: 'housemaid',
      experience: 1,
      languages: ['English'],
      skills: ['General'],
      agentId: '1',
      notes: 'Source: Email'
    };
  }

  private extractFromWhatsApp(data: any): any | null {
    // Extract worker data from WhatsApp message
    return {
      fullName: 'Extracted from WhatsApp',
      dateOfBirth: new Date('1990-01-01'),
      nationality: 'Ethiopia',
      gender: 'female',
      maritalStatus: 'single',
      passportNumber: 'TEMP123456',
      passportIssueDate: new Date(),
      passportExpiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      visaType: 'visit',
      workerType: 'housemaid',
      experience: 1,
      languages: ['English'],
      skills: ['General'],
      agentId: '1',
      notes: `Source: WhatsApp - ${data.from}`
    };
  }

  private extractFromWebsite(data: any): any | null {
    // Extract worker data from website form
    return {
      fullName: data.fields.name,
      dateOfBirth: new Date('1990-01-01'),
      nationality: 'Ethiopia',
      gender: 'female',
      maritalStatus: 'single',
      passportNumber: 'TEMP123456',
      passportIssueDate: new Date(),
      passportExpiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      visaType: 'visit',
      workerType: 'housemaid',
      experience: 1,
      languages: ['English'],
      skills: data.fields.skills ? data.fields.skills.split(',').map((s: string) => s.trim()) : ['General'],
      agentId: '1',
      notes: 'Source: Website'
    };
  }

  onSettingsChange() {
    this.saveSettings();
  }

  testConnection(source: string) {
    console.log(`Testing ${source} connection...`);
    // Implement connection testing logic
  }

  manualFetch() {
    this.fetchDataFromAllSources();
  }

  clearRecentData() {
    this.recentFetchedData = [];
    localStorage.removeItem('recentFetchedData');
  }
}

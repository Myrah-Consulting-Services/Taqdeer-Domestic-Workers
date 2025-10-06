import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { WorkerService } from '../../../services/worker.service';
import { AuthService } from '../../../services/auth.service';
import { Worker, WorkerFormData, WorkerType, WorkerNationality, NationalityPricing, WorkerTypeLabels, WorkerStatusLabels } from '../../../models/worker.model';

@Component({
  selector: 'app-workers-list',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './workers-list.component.html',
  styleUrl: './workers-list.component.css'
})
export class WorkersListComponent implements OnInit {
  workers: Worker[] = [];
  filteredWorkers: Worker[] = [];
  searchTerm: string = '';
  statusFilter: string = 'all';
  nationalityFilter: string = 'all';
  typeFilter: string = 'all';
  stats: any = {};
  
  // Modal states
  showDeleteModal = false;
  showFormModal = false;
  showDetailsModal = false;
  showQuickImportModal = false;
  
  // Modal data
  workerToDelete: Worker | null = null;
  selectedWorker: Worker | null = null;
  isEditMode = false;
  
  // Form data
  formData: WorkerFormData = this.getEmptyFormData();
  
  // Options
  workerTypes: WorkerType[] = ['housemaid', 'cleaner', 'cook', 'babysitter', 'driver', 'gardener'];
  nationalities: WorkerNationality[] = ['Ethiopia', 'India', 'Sri Lanka', 'Nepal', 'Philippines', 'Bangladesh', 'Indonesia', 'Kenya', 'Uganda'];
  visaTypes: ('visit' | 'work' | 'employment')[] = ['visit', 'work', 'employment'];
  genders: ('male' | 'female')[] = ['male', 'female'];
  maritalStatuses: ('single' | 'married' | 'divorced' | 'widowed')[] = ['single', 'married', 'divorced', 'widowed'];
  
  // Language and skills
  availableLanguages: string[] = ['English', 'Arabic', 'Hindi', 'Urdu', 'Tagalog', 'Amharic', 'Sinhala', 'Nepali', 'Bengali'];
  selectedLanguages: string[] = [];
  newLanguage: string = '';
  
  availableSkills: string[] = ['Cooking', 'Cleaning', 'Childcare', 'Elderly Care', 'Laundry', 'Ironing', 'Driving', 'Gardening', 'Pet Care'];
  selectedSkills: string[] = [];
  newSkill: string = '';

  showSuccessAlert = false;
  alertMessage = '';
  
  // Quick Import
  importText: string = '';
  parsedData: any = null;
  showImportPreview = false;
  
  // Current user info
  currentUser: any = null;
  isAdmin = false;
  isReceptionist = false;
  
  // Available agents list for admin
  availableAgents: any[] = [];

  constructor(
    private workerService: WorkerService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser;
    this.isAdmin = this.authService.isAdmin();
    this.isReceptionist = this.currentUser?.role === 'employee' && this.currentUser?.employeeRole === 'Receptionist';
    this.loadAvailableAgents();
    this.loadWorkers();
    this.loadStats();
  }
  
  loadAvailableAgents(): void {
    // Load agents for dropdown (only for admin)
    if (this.isAdmin) {
      // Import AgentService dynamically or inject it
      // For now, using hardcoded list matching agent IDs
      this.availableAgents = [
        { id: '1', code: 'AG001', name: 'Global Recruitment Services' },
        { id: '2', code: 'AG002', name: 'Asia Pacific Manpower' },
        { id: '3', code: 'AG003', name: 'East Africa Recruitment' },
        { id: '4', code: 'AG004', name: 'Lanka Manpower Services' },
        { id: '5', code: 'AG005', name: 'Nepal Overseas Employment' }
      ];
    }
  }

  loadWorkers(): void {
    this.workerService.getWorkers().subscribe(workers => {
      this.workers = workers;
      this.applyFilters();
    });
  }

  loadStats(): void {
    this.stats = this.workerService.getWorkerStats();
  }

  applyFilters(): void {
    this.filteredWorkers = this.workers.filter(worker => {
      const matchesSearch = !this.searchTerm || 
        worker.fullName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        worker.workerCode.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        worker.passportNumber.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = this.statusFilter === 'all' || worker.currentStatus === this.statusFilter;
      const matchesNationality = this.nationalityFilter === 'all' || worker.nationality === this.nationalityFilter;
      const matchesType = this.typeFilter === 'all' || worker.workerType === this.typeFilter;
      
      return matchesSearch && matchesStatus && matchesNationality && matchesType;
    });
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  // Form Modal Methods
  openAddWorkerModal(): void {
    this.isEditMode = false;
    this.formData = this.getEmptyFormData();
    
    // Set agent ID automatically if agent is logged in
    if (this.currentUser?.role === 'agent' && this.currentUser.agentId) {
      this.formData.agentId = this.currentUser.agentId;
    } else if (this.isAdmin && this.availableAgents.length > 0) {
      // For admin, set first agent as default
      this.formData.agentId = this.availableAgents[0].id;
    }
    
    this.selectedLanguages = [];
    this.selectedSkills = [];
    this.showFormModal = true;
  }

  openEditWorkerModal(worker: Worker): void {
    this.isEditMode = true;
    this.selectedWorker = worker;
    this.formData = {
      fullName: worker.fullName,
      dateOfBirth: worker.dateOfBirth,
      nationality: worker.nationality,
      gender: worker.gender,
      maritalStatus: worker.maritalStatus,
      religion: worker.religion,
      passportNumber: worker.passportNumber,
      passportIssueDate: worker.passportIssueDate,
      passportExpiryDate: worker.passportExpiryDate,
      visaType: worker.visaType,
      visaNumber: worker.visaNumber,
      visaIssueDate: worker.visaIssueDate,
      visaExpiryDate: worker.visaExpiryDate,
      arrivalDate: worker.arrivalDate,
      workerType: worker.workerType,
      experience: worker.experience,
      languages: [...worker.languages],
      skills: [...worker.skills],
      agentId: worker.agentId,
      notes: worker.notes
    };
    this.selectedLanguages = [...worker.languages];
    this.selectedSkills = [...worker.skills];
    this.showFormModal = true;
  }

  closeFormModal(): void {
    this.showFormModal = false;
    this.selectedWorker = null;
    this.formData = this.getEmptyFormData();
    this.selectedLanguages = [];
    this.selectedSkills = [];
  }

  onFormSubmit(): void {
    // Update languages and skills
    this.formData.languages = [...this.selectedLanguages];
    this.formData.skills = [...this.selectedSkills];
    
    if (this.isEditMode && this.selectedWorker) {
      this.workerService.updateWorker(this.selectedWorker.id, this.formData);
      this.alertMessage = 'Worker updated successfully!';
    } else {
      this.workerService.addWorker(this.formData);
      this.alertMessage = 'Worker added successfully!';
    }
    
    this.showSuccessAlert = true;
    this.closeFormModal();
    this.loadWorkers();
    this.loadStats();
    
    setTimeout(() => {
      this.showSuccessAlert = false;
    }, 3000);
  }

  // Details Modal Methods
  openDetailsModal(worker: Worker): void {
    this.selectedWorker = worker;
    this.showDetailsModal = true;
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedWorker = null;
  }

  // Navigate to worker details page
  viewWorkerDetails(worker: Worker): void {
    this.router.navigate(['/workers', worker.id]);
  }

  editFromDetails(): void {
    if (this.selectedWorker) {
      this.closeDetailsModal();
      this.openEditWorkerModal(this.selectedWorker);
    }
  }

  deleteFromDetails(): void {
    if (this.selectedWorker) {
      this.workerToDelete = this.selectedWorker;
      this.closeDetailsModal();
      this.openDeleteModal(this.workerToDelete);
    }
  }

  // Delete Modal Methods
  openDeleteModal(worker: Worker): void {
    this.workerToDelete = worker;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.workerToDelete = null;
  }

  confirmDelete(): void {
    if (this.workerToDelete) {
      this.workerService.deleteWorker(this.workerToDelete.id);
      this.closeDeleteModal();
      this.loadWorkers();
      this.loadStats();
      this.alertMessage = 'Worker deleted successfully!';
      this.showSuccessAlert = true;
      setTimeout(() => {
        this.showSuccessAlert = false;
      }, 3000);
    }
  }

  // Language Management
  addLanguage(): void {
    if (this.newLanguage && !this.selectedLanguages.includes(this.newLanguage)) {
      this.selectedLanguages.push(this.newLanguage);
      this.newLanguage = '';
    }
  }

  removeLanguage(language: string): void {
    this.selectedLanguages = this.selectedLanguages.filter(l => l !== language);
  }

  // Skill Management
  addSkill(): void {
    if (this.newSkill && !this.selectedSkills.includes(this.newSkill)) {
      this.selectedSkills.push(this.newSkill);
      this.newSkill = '';
    }
  }

  removeSkill(skill: string): void {
    this.selectedSkills = this.selectedSkills.filter(s => s !== skill);
  }

  // Helper Methods
  formatCurrency(amount: number): string {
    return `AED ${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  }

  formatDate(date: Date | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  getWorkerTypeLabel(type: WorkerType): string {
    return WorkerTypeLabels[type];
  }

  getStatusLabel(status: string): string {
    return WorkerStatusLabels[status as keyof typeof WorkerStatusLabels] || status;
  }

  getPackageAmount(nationality: WorkerNationality): number {
    return NationalityPricing[nationality];
  }

  calculateAge(dateOfBirth: Date): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  getStatusBadgeClass(status: string): string {
    const statusClasses: Record<string, string> = {
      'available': 'bg-green-100 text-green-800',
      'interview': 'bg-blue-100 text-blue-800',
      'trial': 'bg-yellow-100 text-yellow-800',
      'placed': 'bg-purple-100 text-purple-800',
      'returned': 'bg-red-100 text-red-800',
      'absconded': 'bg-gray-100 text-gray-800'
    };
    return statusClasses[status] || 'bg-gray-100 text-gray-800';
  }

  // Visa Tracking Methods (CRM Requirements)
  getVisaDaysRemaining(visaExpiryDate: Date | undefined): number {
    if (!visaExpiryDate) return 0;
    const expiry = new Date(visaExpiryDate);
    const today = new Date();
    const diff = expiry.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  getVisaDuration(visaIssueDate: Date | undefined, visaExpiryDate: Date | undefined): number {
    if (!visaIssueDate || !visaExpiryDate) return 0;
    const issue = new Date(visaIssueDate);
    const expiry = new Date(visaExpiryDate);
    const diff = expiry.getTime() - issue.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  getDaysInUAE(arrivalDate: Date | undefined): number {
    if (!arrivalDate) return 0;
    const arrival = new Date(arrivalDate);
    const today = new Date();
    const diff = today.getTime() - arrival.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  // Expose Math for template
  Math = Math;

  private getEmptyFormData(): WorkerFormData {
    return {
      fullName: '',
      dateOfBirth: new Date(),
      nationality: 'Ethiopia',
      gender: 'female',
      maritalStatus: 'single',
      religion: '',
      passportNumber: '',
      passportIssueDate: new Date(),
      passportExpiryDate: new Date(),
      visaType: 'visit',
      visaNumber: '',
      visaIssueDate: new Date(),
      visaExpiryDate: new Date(),
      arrivalDate: new Date(),
      workerType: 'housemaid',
      experience: 0,
      languages: [],
      skills: [],
      agentId: '',
      notes: ''
    };
  }

  // Quick Import Methods
  openQuickImportModal(): void {
    console.log('Quick Import button clicked!');
    this.importText = '';
    this.parsedData = null;
    this.showImportPreview = false;
    this.showQuickImportModal = true;
    console.log('showQuickImportModal set to:', this.showQuickImportModal);
  }

  closeQuickImportModal(): void {
    this.showQuickImportModal = false;
    this.importText = '';
    this.parsedData = null;
    this.showImportPreview = false;
  }

  parseImportText(): void {
    if (!this.importText.trim()) {
      alert('Please enter worker data to import');
      return;
    }

    const text = this.importText.toLowerCase();
    const lines = this.importText.split('\n');
    
    // Initialize parsed data
    this.parsedData = {
      fullName: '',
      passportNumber: '',
      dateOfBirth: new Date(),
      nationality: 'Ethiopia',
      gender: 'female',
      maritalStatus: 'single',
      religion: '',
      workerType: 'housemaid',
      experience: 0,
      phone: '',
      agentId: '',
      languages: [],
      skills: []
    };

    // Parse each line
    lines.forEach(line => {
      const lowerLine = line.toLowerCase().trim();
      
      // Name parsing
      if (lowerLine.includes('name:') || lowerLine.includes('worker name:')) {
        this.parsedData.fullName = line.split(':')[1]?.trim() || '';
      }
      
      // Passport parsing
      if (lowerLine.includes('passport:') || lowerLine.includes('passport no:') || lowerLine.includes('passport number:')) {
        this.parsedData.passportNumber = line.split(':')[1]?.trim() || '';
      }
      
      // Nationality parsing
      if (lowerLine.includes('nationality:') || lowerLine.includes('country:')) {
        const nat = line.split(':')[1]?.trim() || '';
        const nationalityMap: any = {
          'ethiopia': 'Ethiopia', 'ethiopian': 'Ethiopia',
          'india': 'India', 'indian': 'India',
          'sri lanka': 'Sri Lanka', 'srilanka': 'Sri Lanka', 'srilankan': 'Sri Lanka',
          'nepal': 'Nepal', 'nepali': 'Nepal', 'nepalese': 'Nepal',
          'philippines': 'Philippines', 'filipino': 'Philippines', 'filipina': 'Philippines',
          'bangladesh': 'Bangladesh', 'bangladeshi': 'Bangladesh',
          'indonesia': 'Indonesia', 'indonesian': 'Indonesia',
          'kenya': 'Kenya', 'kenyan': 'Kenya',
          'uganda': 'Uganda', 'ugandan': 'Uganda'
        };
        this.parsedData.nationality = nationalityMap[nat.toLowerCase()] || 'Ethiopia';
      }
      
      // Gender parsing
      if (lowerLine.includes('gender:') || lowerLine.includes('sex:')) {
        const gender = line.split(':')[1]?.trim().toLowerCase() || '';
        this.parsedData.gender = gender.includes('male') && !gender.includes('female') ? 'male' : 'female';
      }
      
      // Worker Type parsing
      if (lowerLine.includes('type:') || lowerLine.includes('position:') || lowerLine.includes('role:')) {
        const type = line.split(':')[1]?.trim().toLowerCase() || '';
        if (type.includes('housemaid') || type.includes('maid')) this.parsedData.workerType = 'housemaid';
        else if (type.includes('cook')) this.parsedData.workerType = 'cook';
        else if (type.includes('babysitter') || type.includes('nanny')) this.parsedData.workerType = 'babysitter';
        else if (type.includes('clean')) this.parsedData.workerType = 'cleaner';
        else if (type.includes('driver')) this.parsedData.workerType = 'driver';
        else if (type.includes('garden')) this.parsedData.workerType = 'gardener';
      }
      
      // Experience parsing
      if (lowerLine.includes('experience:') || lowerLine.includes('exp:')) {
        const exp = line.split(':')[1]?.trim() || '0';
        this.parsedData.experience = parseInt(exp.match(/\d+/)?.[0] || '0');
      }
      
      // DOB parsing
      if (lowerLine.includes('dob:') || lowerLine.includes('date of birth:') || lowerLine.includes('birth date:')) {
        const dobStr = line.split(':')[1]?.trim() || '';
        if (dobStr) {
          try {
            this.parsedData.dateOfBirth = new Date(dobStr);
          } catch (e) {
            this.parsedData.dateOfBirth = new Date();
          }
        }
      }
      
      // Age parsing (calculate DOB)
      if (lowerLine.includes('age:')) {
        const age = parseInt(line.split(':')[1]?.trim().match(/\d+/)?.[0] || '25');
        const year = new Date().getFullYear() - age;
        this.parsedData.dateOfBirth = new Date(year, 0, 1);
      }
      
      // Religion parsing
      if (lowerLine.includes('religion:')) {
        this.parsedData.religion = line.split(':')[1]?.trim() || '';
      }
      
      // Marital Status parsing
      if (lowerLine.includes('marital:') || lowerLine.includes('married:')) {
        const status = line.split(':')[1]?.trim().toLowerCase() || '';
        if (status.includes('single')) this.parsedData.maritalStatus = 'single';
        else if (status.includes('married')) this.parsedData.maritalStatus = 'married';
        else if (status.includes('divorced')) this.parsedData.maritalStatus = 'divorced';
        else if (status.includes('widow')) this.parsedData.maritalStatus = 'widowed';
      }
      
      // Agent parsing
      if (lowerLine.includes('agent:') || lowerLine.includes('agent code:')) {
        const agentCode = line.split(':')[1]?.trim().toUpperCase() || '';
        const agentMap: any = {
          'AG001': '1', 'AG002': '2', 'AG003': '3', 'AG004': '4', 'AG005': '5'
        };
        this.parsedData.agentId = agentMap[agentCode] || '';
      }
      
      // Languages parsing
      if (lowerLine.includes('language:') || lowerLine.includes('languages:')) {
        const langs = line.split(':')[1]?.trim() || '';
        this.parsedData.languages = langs.split(',').map((l: string) => l.trim()).filter((l: string) => l);
      }
      
      // Skills parsing
      if (lowerLine.includes('skill:') || lowerLine.includes('skills:')) {
        const skills = line.split(':')[1]?.trim() || '';
        this.parsedData.skills = skills.split(',').map((s: string) => s.trim()).filter((s: string) => s);
      }
      
      // Phone parsing
      if (lowerLine.includes('phone:') || lowerLine.includes('mobile:') || lowerLine.includes('contact:')) {
        this.parsedData.phone = line.split(':')[1]?.trim() || '';
      }
    });

    this.showImportPreview = true;
  }

  useImportedData(): void {
    if (!this.parsedData) return;

    // Close import modal
    this.closeQuickImportModal();

    // Open add worker form with parsed data
    this.isEditMode = false;
    this.formData = {
      fullName: this.parsedData.fullName || '',
      dateOfBirth: this.parsedData.dateOfBirth || new Date(),
      nationality: this.parsedData.nationality || 'Ethiopia',
      gender: this.parsedData.gender || 'female',
      maritalStatus: this.parsedData.maritalStatus || 'single',
      religion: this.parsedData.religion || '',
      passportNumber: this.parsedData.passportNumber || '',
      passportIssueDate: new Date(),
      passportExpiryDate: new Date(),
      visaType: 'visit',
      visaNumber: '',
      visaIssueDate: new Date(),
      visaExpiryDate: new Date(),
      arrivalDate: new Date(),
      workerType: this.parsedData.workerType || 'housemaid',
      experience: this.parsedData.experience || 0,
      languages: this.parsedData.languages || [],
      skills: this.parsedData.skills || [],
      agentId: this.parsedData.agentId || (this.availableAgents.length > 0 ? this.availableAgents[0].id : ''),
      notes: ''
    };
    
    this.selectedLanguages = this.parsedData.languages || [];
    this.selectedSkills = this.parsedData.skills || [];
    this.showFormModal = true;

    // Show success message
    this.alertMessage = 'Data imported successfully! Please review and complete the form.';
    this.showSuccessAlert = true;
    setTimeout(() => {
      this.showSuccessAlert = false;
    }, 3000);
  }

  fillSampleData(): void {
    this.importText = `Name: Fatima Hassan
Passport: ET1234567
DOB: 15/05/1992
Age: 32
Nationality: Ethiopia
Gender: Female
Marital Status: Single
Religion: Muslim
Type: Housemaid
Experience: 5 years
Languages: English, Arabic, Amharic
Skills: Cooking, Cleaning, Childcare
Agent: AG001
Phone: +251912345678`;
    
    this.parseImportText();
  }
}
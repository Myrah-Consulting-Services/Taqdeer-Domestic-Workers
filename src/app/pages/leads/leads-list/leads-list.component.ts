import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Lead, LeadActivity } from '../../../models/lead.model';
import { LeadService } from '../../../services/lead.service';
import { SponsorService } from '../../../services/sponsor.service';
import { AuthService } from '../../../services/auth.service';
import { Sponsor } from '../../../models/sponsor.model';

@Component({
  selector: 'app-leads-list',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './leads-list.component.html',
  styleUrl: './leads-list.component.css'
})
export class LeadsListComponent implements OnInit {
  leads: Lead[] = [];
  filteredLeads: Lead[] = [];
  activities: LeadActivity[] = [];
  
  // Filter states
  searchTerm: string = '';
  statusFilter: string = 'all';
  urgencyFilter: string = 'all';
  emiratesFilter: string = 'all';
  stats: any = {};
  
  // Modal states
  showFormModal = false;
  showDetailsModal = false;
  showDeleteModal = false;
  showActivityModal = false;
  showConvertModal = false;
  showAlertModal = false;
  
  // Current data
  selectedLead: Lead | null = null;
  leadToDelete: Lead | null = null;
  isEditMode = false;
  
  // Alert
  alertModalMessage = '';
  alertModalType: 'success' | 'error' | 'warning' | 'info' = 'info';
  
  // Form data
  formData: any = {
    fullName: '',
    phone: '',
    alternatePhone: '',
    email: '',
    emirates: 'Dubai',
    area: '',
    address: '',
    workerType: 'Housemaid',
    preferredNationality: '',
    numberOfWorkers: 1,
    urgencyLevel: 'medium',
    budgetRange: '',
    source: 'phone-call',
    notes: '',
    requirements: '',
    nextFollowUpDate: '',
    assignedTo: '',
    assignedToName: ''
  };
  
  // Activity form
  activityFormData = {
    activityType: 'call',
    description: '',
    nextAction: ''
  };
  
  emiratesList = ['Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman', 'Umm Al Quwain', 'Ras Al Khaimah', 'Fujairah'];
  workerTypes = ['Housemaid', 'Cook', 'Nanny', 'Driver', 'Gardener', 'Caregiver', 'Cleaner'];
  nationalityList = ['Ethiopia', 'India', 'Sri Lanka', 'Nepal', 'Philippines', 'Bangladesh', 'Indonesia', 'Kenya', 'Uganda'];
  
  constructor(
    private leadService: LeadService,
    private sponsorService: SponsorService,
    private authService: AuthService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    this.loadLeads();
    this.loadStats();
  }
  
  loadLeads(): void {
    this.leadService.getLeads().subscribe(leads => {
      this.leads = leads;
      this.applyFilters();
    });
  }
  
  loadStats(): void {
    this.stats = this.leadService.getStats();
  }
  
  applyFilters(): void {
    this.filteredLeads = this.leads.filter(lead => {
      const matchesSearch = !this.searchTerm || 
        lead.fullName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        lead.phone.includes(this.searchTerm) ||
        lead.leadNumber.includes(this.searchTerm);
      
      const matchesStatus = this.statusFilter === 'all' || lead.status === this.statusFilter;
      const matchesUrgency = this.urgencyFilter === 'all' || lead.urgencyLevel === this.urgencyFilter;
      const matchesEmirates = this.emiratesFilter === 'all' || lead.emirates === this.emiratesFilter;
      
      return matchesSearch && matchesStatus && matchesUrgency && matchesEmirates;
    });
  }
  
  onSearchChange(): void {
    this.applyFilters();
  }
  
  onFilterChange(): void {
    this.applyFilters();
  }
  
  // Modal handlers
  openAddModal(): void {
    this.isEditMode = false;
    this.formData = {
      fullName: '',
      phone: '',
      alternatePhone: '',
      email: '',
      emirates: 'Dubai',
      area: '',
      address: '',
      workerType: 'Housemaid',
      preferredNationality: '',
      numberOfWorkers: 1,
      urgencyLevel: 'medium',
      budgetRange: '',
      source: 'phone-call',
      notes: '',
      requirements: '',
      nextFollowUpDate: '',
      assignedTo: '',
      assignedToName: ''
    };
    this.showFormModal = true;
  }
  
  openEditModal(lead: Lead): void {
    this.isEditMode = true;
    this.formData = { ...lead };
    this.showFormModal = true;
  }
  
  closeFormModal(): void {
    this.showFormModal = false;
  }
  
  openDetailsModal(lead: Lead): void {
    this.selectedLead = lead;
    this.showDetailsModal = true;
  }
  
  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedLead = null;
  }
  
  openDeleteModal(lead: Lead): void {
    this.leadToDelete = lead;
    this.showDeleteModal = true;
  }
  
  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.leadToDelete = null;
  }
  
  openActivityModal(lead: Lead): void {
    this.selectedLead = lead;
    this.activityFormData = {
      activityType: 'call',
      description: '',
      nextAction: ''
    };
    this.showActivityModal = true;
  }
  
  closeActivityModal(): void {
    this.showActivityModal = false;
    this.selectedLead = null;
  }
  
  // CRUD operations
  onSubmit(): void {
    if (this.isEditMode && this.formData.id) {
      this.leadService.updateLead(this.formData);
      this.showAlert('Lead updated successfully!', 'success');
    } else {
      // Auto-assign to current user
      const currentUser = this.authService.currentUser;
      if (currentUser) {
        this.formData.createdBy = currentUser.id;
        this.formData.assignedTo = currentUser.id;
        this.formData.assignedToName = currentUser.fullName;
      }
      this.leadService.addLead(this.formData);
      this.showAlert('Lead added successfully!', 'success');
    }
    this.closeFormModal();
    this.loadStats();
  }
  
  confirmDelete(): void {
    if (this.leadToDelete) {
      this.leadService.deleteLead(this.leadToDelete.id);
      this.showAlert('Lead deleted successfully!', 'success');
      this.closeDeleteModal();
      this.loadStats();
    }
  }
  
  // Status management
  updateStatus(lead: Lead, newStatus: Lead['status']): void {
    const currentUser = this.authService.currentUser;
    this.leadService.updateLeadStatus(
      lead.id, 
      newStatus, 
      currentUser?.id, 
      currentUser?.fullName
    );
    this.showAlert(`Lead status updated to ${newStatus}`, 'success');
    this.loadStats();
  }
  
  // Activity management
  addActivity(): void {
    if (!this.selectedLead) return;
    
    const currentUser = this.authService.currentUser;
    if (!currentUser) return;
    
    const activity: LeadActivity = {
      id: '',
      leadId: this.selectedLead.id,
      activityType: this.activityFormData.activityType as any,
      description: this.activityFormData.description,
      performedBy: currentUser.id,
      performedByName: currentUser.fullName,
      activityDate: new Date().toISOString(),
      nextAction: this.activityFormData.nextAction
    };
    
    this.leadService.addActivity(activity);
    this.showAlert('Activity added successfully!', 'success');
    this.closeActivityModal();
  }
  
  // Navigate to lead details
  viewLeadDetails(lead: Lead): void {
    this.router.navigate(['/leads', lead.id]);
  }
  
  // Convert to sponsor
  convertToSponsor(lead: Lead): void {
    if (lead.isConverted) {
      this.showAlert('This lead has already been converted to a sponsor!', 'warning');
      return;
    }

    // Create new sponsor from lead data
    const newSponsor: Sponsor = {
      id: '',
      sponsorCode: this.sponsorService.generateSponsorCode(),
      fullName: lead.fullName,
      emiratesId: '', // This needs to be filled later
      nationality: 'UAE', // Default, can be changed later
      phone: lead.phone,
      alternatePhone: lead.alternatePhone,
      email: lead.email,
      emirates: lead.emirates,
      area: lead.area,
      address: lead.address || '',
      status: 'active',
      totalHired: 0,
      currentWorkers: 0,
      createdAt: '',
      updatedAt: ''
    };

    // Add sponsor to the list
    this.sponsorService.addSponsor(newSponsor);
    
    // Get the newly created sponsor (it will be the last one added)
    const allSponsors: Sponsor[] = [];
    this.sponsorService.getSponsors().subscribe(sponsors => {
      const convertedSponsor = sponsors[sponsors.length - 1];
      
      // Mark lead as converted
      this.leadService.convertLeadToSponsor(lead.id, convertedSponsor.id);
      
      // Show success message
      this.showAlert(`✅ Lead successfully converted to Sponsor! Sponsor Code: ${convertedSponsor.sponsorCode}`, 'success');
      
      // Refresh the leads list
      this.loadLeads();
      this.loadStats();
      
      // Navigate to the sponsor details page after a short delay
      setTimeout(() => {
        this.router.navigate(['/sponsors', convertedSponsor.id]);
      }, 2000);
    });
  }
  
  // Helper methods
  getStatusClass(status: string): string {
    const classes: any = {
      'new': 'bg-blue-100 text-blue-800',
      'contacted': 'bg-yellow-100 text-yellow-800',
      'interested': 'bg-purple-100 text-purple-800',
      'negotiation': 'bg-orange-100 text-orange-800',
      'converted': 'bg-green-100 text-green-800',
      'lost': 'bg-red-100 text-red-800'
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
  }
  
  getUrgencyClass(urgency: string): string {
    const classes: any = {
      'high': 'bg-red-100 text-red-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'low': 'bg-green-100 text-green-800'
    };
    return classes[urgency] || 'bg-gray-100 text-gray-800';
  }
  
  showAlert(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info'): void {
    this.alertModalMessage = message;
    this.alertModalType = type;
    this.showAlertModal = true;
  }
  
  closeAlertModal(): void {
    this.showAlertModal = false;
    this.alertModalMessage = '';
  }
  
  formatDate(dateString: string): string {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-GB');
  }
  
  isFollowUpDue(lead: Lead): boolean {
    if (!lead.nextFollowUpDate) return false;
    return new Date(lead.nextFollowUpDate) <= new Date();
  }
  
  getDaysUntilFollowUp(lead: Lead): number {
    if (!lead.nextFollowUpDate) return 0;
    const followUpDate = new Date(lead.nextFollowUpDate);
    const today = new Date();
    const diff = followUpDate.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }
}


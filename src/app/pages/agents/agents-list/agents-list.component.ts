import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AgentService } from '../../../services/agent.service';
import { Agent, AgentFormData } from '../../../models/agent.model';

@Component({
  selector: 'app-agents-list',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './agents-list.component.html',
  styleUrl: './agents-list.component.css'
})
export class AgentsListComponent implements OnInit {
  agents: Agent[] = [];
  filteredAgents: Agent[] = [];
  searchTerm: string = '';
  statusFilter: string = 'all';
  stats: any = {};
  
  // Modal states
  showDeleteModal = false;
  showFormModal = false;
  showDetailsModal = false;
  
  // Modal data
  agentToDelete: Agent | null = null;
  selectedAgent: Agent | null = null;
  isEditMode = false;
  
  // Form data
  formData: AgentFormData = this.getEmptyFormData();
  
  countries = [
    'UAE', 'Saudi Arabia', 'Qatar', 'Kuwait', 'Bahrain', 'Oman',
    'India', 'Pakistan', 'Bangladesh', 'Sri Lanka', 'Nepal',
    'Philippines', 'Indonesia', 'Ethiopia', 'Kenya', 'Uganda'
  ];

  showSuccessAlert = false;
  alertMessage = '';

  constructor(
    private agentService: AgentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAgents();
    this.loadStats();
  }

  loadAgents(): void {
    this.agentService.getAllAgents().subscribe(agents => {
      this.agents = agents;
      this.applyFilters();
    });
  }

  loadStats(): void {
    this.stats = this.agentService.getAgentStats();
  }

  applyFilters(): void {
    this.filteredAgents = this.agents.filter(agent => {
      const matchesSearch = !this.searchTerm || 
        agent.agentName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        agent.agentCode.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        agent.contactPerson.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        agent.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = this.statusFilter === 'all' || agent.status === this.statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onStatusFilterChange(): void {
    this.applyFilters();
  }

  // Form Modal Methods
  openAddAgentModal(): void {
    this.isEditMode = false;
    this.formData = this.getEmptyFormData();
    this.formData.agentCode = this.agentService.generateAgentCode();
    this.showFormModal = true;
  }

  openEditAgentModal(agent: Agent): void {
    this.isEditMode = true;
    this.selectedAgent = agent;
    this.formData = {
      agentCode: agent.agentCode,
      agentName: agent.agentName,
      companyName: agent.companyName,
      contactPerson: agent.contactPerson,
      email: agent.email,
      phone: agent.phone,
      alternatePhone: agent.alternatePhone,
      country: agent.country,
      city: agent.city,
      address: agent.address,
      commissionType: agent.commissionType,
      commissionValue: agent.commissionValue,
      bankName: agent.bankName,
      accountNumber: agent.accountNumber,
      iban: agent.iban,
      swiftCode: agent.swiftCode,
      status: agent.status,
      notes: agent.notes
    };
    this.showFormModal = true;
  }

  closeFormModal(): void {
    this.showFormModal = false;
    this.selectedAgent = null;
    this.formData = this.getEmptyFormData();
  }

  onFormSubmit(): void {
    if (this.isEditMode && this.selectedAgent) {
      this.agentService.updateAgent(this.selectedAgent.id, this.formData);
      this.alertMessage = 'Agent updated successfully!';
    } else {
      this.agentService.addAgent(this.formData);
      this.alertMessage = 'Agent added successfully!';
    }
    
    this.showSuccessAlert = true;
    this.closeFormModal();
    this.loadAgents();
    this.loadStats();
    
    setTimeout(() => {
      this.showSuccessAlert = false;
    }, 3000);
  }

  // Details Modal Methods
  openDetailsModal(agent: Agent): void {
    this.selectedAgent = agent;
    this.showDetailsModal = true;
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedAgent = null;
  }

  // Navigate to agent details page
  viewAgentDetails(agent: Agent): void {
    this.router.navigate(['/agents', agent.id]);
  }

  editFromDetails(): void {
    if (this.selectedAgent) {
      this.closeDetailsModal();
      this.openEditAgentModal(this.selectedAgent);
    }
  }

  deleteFromDetails(): void {
    if (this.selectedAgent) {
      this.agentToDelete = this.selectedAgent;
      this.closeDetailsModal();
      this.openDeleteModal(this.agentToDelete);
    }
  }

  toggleStatusFromDetails(): void {
    if (this.selectedAgent) {
      const newStatus = this.selectedAgent.status === 'active' ? 'inactive' : 'active';
      this.agentService.updateAgentStatus(this.selectedAgent.id, newStatus);
      this.loadAgents();
      this.loadStats();
      // Reload the selected agent data
      this.selectedAgent = this.agentService.getAgentById(this.selectedAgent.id) || null;
    }
  }

  // Delete Modal Methods
  openDeleteModal(agent: Agent): void {
    this.agentToDelete = agent;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.agentToDelete = null;
  }

  confirmDelete(): void {
    if (this.agentToDelete) {
      this.agentService.deleteAgent(this.agentToDelete.id);
      this.closeDeleteModal();
      this.loadAgents();
      this.loadStats();
      this.alertMessage = 'Agent deleted successfully!';
      this.showSuccessAlert = true;
      setTimeout(() => {
        this.showSuccessAlert = false;
      }, 3000);
    }
  }

  toggleAgentStatus(agent: Agent): void {
    const newStatus = agent.status === 'active' ? 'inactive' : 'active';
    this.agentService.updateAgentStatus(agent.id, newStatus);
    this.loadAgents();
    this.loadStats();
  }

  formatCurrency(amount: number): string {
    return `AED ${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  formatDateLong(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  private getEmptyFormData(): AgentFormData {
    return {
      agentCode: '',
      agentName: '',
      companyName: '',
      contactPerson: '',
      email: '',
      phone: '',
      alternatePhone: '',
      country: '',
      city: '',
      address: '',
      commissionType: 'fixed',
      commissionValue: 0,
      bankName: '',
      accountNumber: '',
      iban: '',
      swiftCode: '',
      status: 'active',
      notes: ''
    };
  }
}
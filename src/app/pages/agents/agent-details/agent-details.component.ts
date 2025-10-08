import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AgentService } from '../../../services/agent.service';
import { WorkerService } from '../../../services/worker.service';
import { Agent, AgentFormData } from '../../../models/agent.model';
import { Worker } from '../../../models/worker.model';

@Component({
  selector: 'app-agent-details',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './agent-details.component.html',
  styleUrl: './agent-details.component.css'
})
export class AgentDetailsComponent implements OnInit {
  agent: Agent | undefined;
  showEditModal = false;
  activeTab: string = 'overview';
  agentWorkers: Worker[] = [];
  
  // Form data for edit modal
  formData: AgentFormData = this.getEmptyFormData();
  
  countries = [
    'UAE', 'Saudi Arabia', 'Qatar', 'Kuwait', 'Bahrain', 'Oman',
    'India', 'Pakistan', 'Bangladesh', 'Sri Lanka', 'Nepal',
    'Philippines', 'Indonesia', 'Ethiopia', 'Kenya', 'Uganda'
  ];

  constructor(
    private agentService: AgentService,
    private workerService: WorkerService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.loadAgent(params['id']);
      }
    });
  }

  loadAgent(id: string): void {
    this.agent = this.agentService.getAgentById(id);
    if (!this.agent) {
      this.router.navigate(['/agents']);
    } else {
      this.loadAgentWorkers(id);
    }
  }

  loadAgentWorkers(agentId: string): void {
    const allWorkers = this.workerService.getAllWorkers();
    this.agentWorkers = allWorkers.filter(w => w.agentId === agentId);
  }

  switchTab(tab: string): void {
    this.activeTab = tab;
  }

  navigateToEdit(): void {
    if (this.agent) {
      this.formData = {
        agentCode: this.agent.agentCode,
        agentName: this.agent.agentName,
        companyName: this.agent.companyName,
        contactPerson: this.agent.contactPerson,
        email: this.agent.email,
        phone: this.agent.phone,
        alternatePhone: this.agent.alternatePhone,
        country: this.agent.country,
        city: this.agent.city,
        address: this.agent.address,
        commissionType: this.agent.commissionType,
        commissionValue: this.agent.commissionValue,
        bankName: this.agent.bankName,
        accountNumber: this.agent.accountNumber,
        iban: this.agent.iban,
        swiftCode: this.agent.swiftCode,
        status: this.agent.status,
        notes: this.agent.notes
      };
      this.showEditModal = true;
    }
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.formData = this.getEmptyFormData();
  }

  onEditSubmit(): void {
    if (this.agent) {
      this.agentService.updateAgent(this.agent.id, this.formData);
      this.closeEditModal();
      this.loadAgent(this.agent.id);
    }
  }

  navigateBack(): void {
    this.router.navigate(['/agents']);
  }

  toggleStatus(): void {
    if (this.agent) {
      const newStatus = this.agent.status === 'active' ? 'inactive' : 'active';
      this.agentService.updateAgentStatus(this.agent.id, newStatus);
      this.loadAgent(this.agent.id);
    }
  }

  onStatusChange(): void {
    if (this.agent) {
      this.agentService.updateAgentStatus(this.agent.id, this.agent.status);
    }
  }

  formatCurrency(amount: number): string {
    return `AED ${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  }

  formatDate(date: Date): string {
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
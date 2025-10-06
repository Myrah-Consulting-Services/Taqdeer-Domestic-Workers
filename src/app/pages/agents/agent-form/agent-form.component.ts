import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AgentService } from '../../../services/agent.service';
import { AgentFormData } from '../../../models/agent.model';

@Component({
  selector: 'app-agent-form',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './agent-form.component.html',
  styleUrl: './agent-form.component.css'
})
export class AgentFormComponent implements OnInit {
  isEditMode = false;
  agentId: string | null = null;
  
  formData: AgentFormData = {
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

  countries = [
    'UAE', 'Saudi Arabia', 'Qatar', 'Kuwait', 'Bahrain', 'Oman',
    'India', 'Pakistan', 'Bangladesh', 'Sri Lanka', 'Nepal',
    'Philippines', 'Indonesia', 'Ethiopia', 'Kenya', 'Uganda'
  ];

  showSuccessAlert = false;
  alertMessage = '';

  constructor(
    private agentService: AgentService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.agentId = params['id'];
        this.loadAgent(params['id']); // Use params['id'] directly since we know it exists here
      } else {
        this.formData.agentCode = this.agentService.generateAgentCode();
      }
    });
  }

  loadAgent(id: string): void {
    const agent = this.agentService.getAgentById(id);
    if (agent) {
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
    }
  }

  onSubmit(): void {
    if (this.isEditMode && this.agentId) {
      this.agentService.updateAgent(this.agentId, this.formData);
      this.alertMessage = 'Agent updated successfully!';
    } else {
      this.agentService.addAgent(this.formData);
      this.alertMessage = 'Agent added successfully!';
    }
    
    this.showSuccessAlert = true;
    setTimeout(() => {
      this.router.navigate(['/agents']);
    }, 1500);
  }

  onCancel(): void {
    this.router.navigate(['/agents']);
  }
}
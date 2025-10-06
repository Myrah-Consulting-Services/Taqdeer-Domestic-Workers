import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AgentService } from '../../../services/agent.service';
import { WorkerService } from '../../../services/worker.service';
import { Agent } from '../../../models/agent.model';
import { Worker } from '../../../models/worker.model';

@Component({
  selector: 'app-agent-details',
  imports: [CommonModule, RouterModule],
  templateUrl: './agent-details.component.html',
  styleUrl: './agent-details.component.css'
})
export class AgentDetailsComponent implements OnInit {
  agent: Agent | undefined;
  showDeleteModal = false;
  activeTab: string = 'overview';
  agentWorkers: Worker[] = [];

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
      this.router.navigate(['/agents/edit', this.agent.id]);
    }
  }

  navigateBack(): void {
    this.router.navigate(['/agents']);
  }

  openDeleteModal(): void {
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
  }

  confirmDelete(): void {
    if (this.agent) {
      this.agentService.deleteAgent(this.agent.id);
      this.router.navigate(['/agents']);
    }
  }

  toggleStatus(): void {
    if (this.agent) {
      const newStatus = this.agent.status === 'active' ? 'inactive' : 'active';
      this.agentService.updateAgentStatus(this.agent.id, newStatus);
      this.loadAgent(this.agent.id);
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
}
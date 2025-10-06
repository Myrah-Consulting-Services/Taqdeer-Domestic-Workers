import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { WorkerService } from '../../../services/worker.service';
import { Worker, WorkerTypeLabels, WorkerStatusLabels } from '../../../models/worker.model';

@Component({
  selector: 'app-worker-details',
  imports: [CommonModule, RouterModule],
  templateUrl: './worker-details.component.html',
  styleUrl: './worker-details.component.css'
})
export class WorkerDetailsComponent implements OnInit {
  worker: Worker | undefined;
  showDeleteModal = false;
  activeTab: string = 'overview';

  constructor(
    private workerService: WorkerService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.loadWorker(params['id']);
      }
    });
  }

  loadWorker(id: string): void {
    this.worker = this.workerService.getWorkerById(id);
    if (!this.worker) {
      this.router.navigate(['/workers']);
    }
  }

  switchTab(tab: string): void {
    this.activeTab = tab;
  }

  navigateToEdit(): void {
    if (this.worker) {
      // Navigate to edit - you can implement this later
      this.router.navigate(['/workers']);
    }
  }

  navigateBack(): void {
    this.router.navigate(['/workers']);
  }

  openDeleteModal(): void {
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
  }

  confirmDelete(): void {
    if (this.worker) {
      this.workerService.deleteWorker(this.worker.id);
      this.router.navigate(['/workers']);
    }
  }

  getWorkerTypeLabel(type: string): string {
    return WorkerTypeLabels[type as keyof typeof WorkerTypeLabels] || type;
  }

  getStatusLabel(status: string): string {
    return WorkerStatusLabels[status as keyof typeof WorkerStatusLabels] || status;
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



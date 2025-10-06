import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { SponsorService } from '../../../services/sponsor.service';
import { Sponsor, WorkerAssignment, WorkerInterview } from '../../../models/sponsor.model';

@Component({
  selector: 'app-sponsor-details',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './sponsor-details.component.html',
  styleUrl: './sponsor-details.component.css'
})
export class SponsorDetailsComponent implements OnInit {
  sponsor: Sponsor | undefined;
  sponsorAssignments: WorkerAssignment[] = [];
  sponsorInterviews: WorkerInterview[] = [];
  showDeleteModal = false;
  showPaymentModal = false;
  activeTab: string = 'overview';
  selectedAssignment: WorkerAssignment | null = null;
  
  // Payment form data
  paymentFormData = {
    finalPaymentAmount: 0,
    paymentDate: new Date().toISOString().split('T')[0],
    notes: ''
  };

  constructor(
    private sponsorService: SponsorService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.loadSponsor(params['id']);
      }
    });
  }

  loadSponsor(id: string): void {
    this.sponsor = this.sponsorService.getSponsorById(id);
    if (!this.sponsor) {
      this.router.navigate(['/sponsors']);
    } else {
      this.loadSponsorAssignments(id);
      this.loadSponsorInterviews(id);
    }
  }

  loadSponsorAssignments(sponsorId: string): void {
    this.sponsorAssignments = this.sponsorService.getAssignmentsBySponsors(sponsorId);
  }

  loadSponsorInterviews(sponsorId: string): void {
    this.sponsorInterviews = this.sponsorService.getInterviewsBySponsor(sponsorId);
  }

  switchTab(tab: string): void {
    this.activeTab = tab;
  }

  navigateToEdit(): void {
    if (this.sponsor) {
      this.router.navigate(['/sponsors']);
    }
  }

  navigateBack(): void {
    this.router.navigate(['/sponsors']);
  }

  openDeleteModal(): void {
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
  }

  confirmDelete(): void {
    if (this.sponsor) {
      this.sponsorService.deleteSponsor(this.sponsor.id);
      this.router.navigate(['/sponsors']);
    }
  }

  formatCurrency(amount: number): string {
    return `AED ${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  }

  formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  getStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'on-trial': 'bg-blue-100 text-blue-800',
      'active': 'bg-green-100 text-green-800',
      'returned': 'bg-red-100 text-red-800',
      'replaced': 'bg-purple-100 text-purple-800',
      'refunded': 'bg-gray-100 text-gray-800'
    };
    return statusMap[status] || 'bg-gray-100 text-gray-800';
  }

  getContractStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'trial': 'bg-yellow-100 text-yellow-800',
      'confirmed': 'bg-green-100 text-green-800',
      'completed': 'bg-blue-100 text-blue-800',
      'terminated': 'bg-red-100 text-red-800'
    };
    return statusMap[status] || 'bg-gray-100 text-gray-800';
  }

  // Helper methods for calculations
  calculateDaysRemaining(date: string | Date): number {
    const endDate = new Date(date);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  getMonthsWorked(startDate: string | Date): number {
    const start = new Date(startDate);
    const today = new Date();
    const diffTime = today.getTime() - start.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return Math.floor(diffDays / 30);
  }

  // Action methods
  confirmAssignment(assignment: WorkerAssignment): void {
    if (confirm(`Confirm assignment and generate invoice for ${assignment.workerName}?`)) {
      this.sponsorService.confirmAssignment(assignment.id, assignment.remainingAmount);
      this.loadSponsorAssignments(this.sponsor!.id);
      alert('✅ Assignment Confirmed! Invoice generated.');
    }
  }

  returnWorker(assignment: WorkerAssignment): void {
    const reason = prompt('Enter return reason (e.g., performance, illness, pregnancy):');
    if (reason) {
      this.sponsorService.returnWorker(assignment.id, reason);
      this.loadSponsorAssignments(this.sponsor!.id);
      alert('↩️ Worker returned successfully.');
    }
  }

  replaceWorker(assignment: WorkerAssignment): void {
    alert('🔄 Replacement functionality: Navigate to sponsors list to assign a new worker.');
    this.router.navigate(['/sponsors']);
  }

  processRefund(assignment: WorkerAssignment): void {
    const refundReason = prompt('Enter refund reason (illness/pregnancy/absconded/performance/other):') || 'other';
    
    // Calculate refund amount to show preview
    const refundAmount = this.sponsorService.calculateRefund(assignment.id, refundReason);

    if (confirm(`Process refund of AED ${refundAmount.toLocaleString()} for ${assignment.workerName}?`)) {
      this.sponsorService.processRefund(assignment.id, refundReason);
      this.loadSponsorAssignments(this.sponsor!.id);
      alert(`💰 Refund of AED ${refundAmount.toLocaleString()} processed successfully.`);
    }
  }

  // Payment Modal Methods
  openPaymentModal(assignment: WorkerAssignment): void {
    this.selectedAssignment = assignment;
    this.paymentFormData = {
      finalPaymentAmount: assignment.remainingAmount,
      paymentDate: new Date().toISOString().split('T')[0],
      notes: ''
    };
    this.showPaymentModal = true;
  }

  closePaymentModal(): void {
    this.showPaymentModal = false;
    this.selectedAssignment = null;
    this.paymentFormData = {
      finalPaymentAmount: 0,
      paymentDate: new Date().toISOString().split('T')[0],
      notes: ''
    };
  }

  processPayment(): void {
    if (!this.selectedAssignment) return;

    const finalPayment = this.paymentFormData.finalPaymentAmount;
    const assignment = this.selectedAssignment;

    // Validate payment
    if (finalPayment < assignment.remainingAmount) {
      alert(`⚠️ Payment must be at least AED ${assignment.remainingAmount.toLocaleString()}`);
      return;
    }

    // Process confirmation
    this.sponsorService.confirmAssignment(assignment.id, finalPayment);

    alert(`✅ Assignment Confirmed! Invoice generated for AED ${(assignment.advanceAmount + finalPayment).toLocaleString()}`);

    this.closePaymentModal();
    this.loadSponsorAssignments(this.sponsor!.id);
  }

  getRemainingAfterPayment(): number {
    if (!this.selectedAssignment) return 0;
    return this.selectedAssignment.remainingAmount - this.paymentFormData.finalPaymentAmount;
  }

  getPaymentProgress(): number {
    if (!this.selectedAssignment) return 0;
    const total = this.selectedAssignment.totalAmount;
    const paid = this.selectedAssignment.advanceAmount + this.paymentFormData.finalPaymentAmount;
    return (paid / total) * 100;
  }

  // Interview Management Methods
  getInterviewStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'scheduled': 'bg-blue-100 text-blue-800',
      'completed': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800',
      'rescheduled': 'bg-yellow-100 text-yellow-800'
    };
    return statusMap[status] || 'bg-gray-100 text-gray-800';
  }

  getInterviewResultClass(result: string | undefined): string {
    const resultMap: { [key: string]: string } = {
      'selected': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800',
      'pending': 'bg-yellow-100 text-yellow-800'
    };
    return resultMap[result || 'pending'] || 'bg-gray-100 text-gray-800';
  }

  updateInterviewResult(interview: WorkerInterview, result: 'selected' | 'rejected'): void {
    let feedback = '';
    let rejectionReason = '';
    
    if (result === 'selected') {
      feedback = prompt('Enter feedback for selected worker:') || '';
    } else {
      rejectionReason = prompt('Enter rejection reason:') || '';
      feedback = prompt('Enter additional feedback (optional):') || '';
    }

    this.sponsorService.updateInterviewResult(interview.id, result, feedback, rejectionReason);
    this.loadSponsorInterviews(this.sponsor!.id);
    
    const message = result === 'selected' 
      ? `✅ Worker ${interview.workerName} selected!`
      : `❌ Worker ${interview.workerName} rejected.`;
    alert(message);
  }

  cancelInterview(interview: WorkerInterview): void {
    if (confirm(`Cancel interview with ${interview.workerName}?`)) {
      this.sponsorService.cancelInterview(interview.id);
      this.loadSponsorInterviews(this.sponsor!.id);
      alert('Interview cancelled successfully.');
    }
  }

  rescheduleInterview(interview: WorkerInterview): void {
    const newDate = prompt('Enter new date (YYYY-MM-DD):', interview.interviewDate);
    const newTime = prompt('Enter new time (HH:MM):', interview.interviewTime);
    
    if (newDate && newTime) {
      this.sponsorService.rescheduleInterview(interview.id, newDate, newTime);
      this.loadSponsorInterviews(this.sponsor!.id);
      alert('Interview rescheduled successfully.');
    }
  }
}

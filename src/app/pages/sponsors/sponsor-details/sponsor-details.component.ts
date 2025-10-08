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
  showEditModal = false;
  showPaymentModal = false;
  showReturnModal = false;
  showSelectWorkerModal = false;
  showRejectWorkerModal = false;
  showRescheduleModal = false;
  showCancelInterviewModal = false;
  activeTab: string = 'overview';
  selectedAssignment: WorkerAssignment | null = null;
  selectedInterview: WorkerInterview | null = null;
  isEditMode = false;
  
  // Form data for edit modal
  formData: any = {};
  
  // Form data for interview modals
  interviewFormData = {
    notes: '',
    rescheduleDate: '',
    rescheduleTime: '',
    reason: '',
    selectionType: '',
    trialDuration: ''
  };
  
  // Payment form data
  paymentFormData = {
    finalPaymentAmount: 0,
    paymentDate: new Date().toISOString().split('T')[0],
    notes: ''
  };
  
  // Return form data
  returnFormData = {
    returnDate: new Date().toISOString().split('T')[0],
    returnReason: '',
    refundAmount: 0,
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
      this.formData = {
        sponsorCode: this.sponsor.sponsorCode,
        fullName: this.sponsor.fullName,
        emiratesId: this.sponsor.emiratesId,
        nationality: this.sponsor.nationality,
        phone: this.sponsor.phone,
        alternatePhone: this.sponsor.alternatePhone,
        email: this.sponsor.email,
        emirates: this.sponsor.emirates,
        area: this.sponsor.area,
        address: this.sponsor.address,
        status: this.sponsor.status
      };
      this.isEditMode = true;
      this.showEditModal = true;
    }
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.isEditMode = false;
    this.formData = {};
  }

  onEditSubmit(): void {
    if (this.sponsor) {
      // Update sponsor with form data
      Object.assign(this.sponsor, this.formData);
      this.sponsorService.updateSponsor(this.sponsor);
      this.closeEditModal();
    }
  }

  navigateBack(): void {
    this.router.navigate(['/sponsors']);
  }

  onStatusChange(): void {
    if (this.sponsor) {
      this.sponsorService.updateSponsor(this.sponsor);
    }
  }

  // Interview modal methods
  openSelectWorkerModal(interview: WorkerInterview): void {
    this.selectedInterview = interview;
    this.interviewFormData = { notes: '', rescheduleDate: '', rescheduleTime: '', reason: '', selectionType: '', trialDuration: '' };
    this.showSelectWorkerModal = true;
  }

  openRejectWorkerModal(interview: WorkerInterview): void {
    this.selectedInterview = interview;
    this.interviewFormData = { notes: '', rescheduleDate: '', rescheduleTime: '', reason: '', selectionType: '', trialDuration: '' };
    this.showRejectWorkerModal = true;
  }

  openRescheduleModal(interview: WorkerInterview): void {
    this.selectedInterview = interview;
    this.interviewFormData = { notes: '', rescheduleDate: '', rescheduleTime: '', reason: '', selectionType: '', trialDuration: '' };
    this.showRescheduleModal = true;
  }

  openCancelInterviewModal(interview: WorkerInterview): void {
    this.selectedInterview = interview;
    this.interviewFormData = { notes: '', rescheduleDate: '', rescheduleTime: '', reason: '', selectionType: '', trialDuration: '' };
    this.showCancelInterviewModal = true;
  }

  closeInterviewModals(): void {
    this.showSelectWorkerModal = false;
    this.showRejectWorkerModal = false;
    this.showRescheduleModal = false;
    this.showCancelInterviewModal = false;
    this.selectedInterview = null;
    this.interviewFormData = { notes: '', rescheduleDate: '', rescheduleTime: '', reason: '', selectionType: '', trialDuration: '' };
  }

  onSelectWorker(): void {
    if (this.selectedInterview && this.sponsor && this.interviewFormData.selectionType) {
      // Prepare notes with selection details
      let notes = this.interviewFormData.notes || '';
      if (this.interviewFormData.selectionType === 'trial') {
        notes = `Trial Basis - ${this.interviewFormData.trialDuration} month(s). ${notes}`.trim();
      } else if (this.interviewFormData.selectionType === 'full') {
        notes = `Pay Full - Permanent hire. ${notes}`.trim();
      }
      
      // Update interview result to selected
      this.sponsorService.updateInterviewResult(
        this.selectedInterview.id, 
        'selected', 
        notes
      );

      // Create worker assignment
      const assignment: WorkerAssignment = {
        id: '', // Will be set by the service
        workerId: this.selectedInterview.workerId,
        workerName: this.selectedInterview.workerName,
        workerPassport: this.selectedInterview.workerPassport,
        workerNationality: this.selectedInterview.workerNationality,
        workerType: this.selectedInterview.workerType,
        sponsorId: this.sponsor.id,
        sponsorName: this.sponsor.fullName,
        totalAmount: 0, // Will be calculated by the service based on nationality
        advanceAmount: 5000, // Default advance amount
        remainingAmount: 0, // Will be calculated by the service
        paidAmount: 5000, // Default paid amount (advance)
        contractStartDate: new Date().toISOString(),
        contractEndDate: '', // Will be set by the service (2 years from start)
        isOnTrial: this.interviewFormData.selectionType === 'trial',
        assignmentStatus: this.interviewFormData.selectionType === 'trial' ? 'on-trial' : 'pending',
        contractStatus: this.interviewFormData.selectionType === 'trial' ? 'trial' : 'confirmed',
        quotationNumber: `QT-2024-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        notes: notes,
        createdAt: '', // Will be set by the service
        updatedAt: '' // Will be set by the service
      };

      // Assign worker to sponsor
      this.sponsorService.assignWorkerToSponsor(assignment);

      // Reload sponsor interviews and assignments to reflect changes
      this.loadSponsorInterviews(this.sponsor.id);
      this.loadSponsorAssignments(this.sponsor.id);
      this.closeInterviewModals();
    }
  }

  onRejectWorker(): void {
    if (this.selectedInterview && this.sponsor) {
      // Update interview result to rejected
      this.sponsorService.updateInterviewResult(
        this.selectedInterview.id, 
        'rejected', 
        undefined, 
        this.interviewFormData.reason
      );
      // Reload sponsor interviews to reflect changes
      this.loadSponsorInterviews(this.sponsor.id);
      this.closeInterviewModals();
    }
  }

  onReschedule(): void {
    if (this.selectedInterview && this.sponsor && this.interviewFormData.rescheduleDate && this.interviewFormData.rescheduleTime) {
      // Combine date and time for the service call
      const newDateTime = `${this.interviewFormData.rescheduleDate}T${this.interviewFormData.rescheduleTime}`;
      this.sponsorService.rescheduleInterview(
        this.selectedInterview.id, 
        newDateTime, 
        this.interviewFormData.rescheduleTime
      );
      // Reload sponsor interviews to reflect changes
      this.loadSponsorInterviews(this.sponsor.id);
      this.closeInterviewModals();
    }
  }

  onCancelInterview(): void {
    if (this.selectedInterview && this.sponsor) {
      // Cancel the interview
      this.sponsorService.cancelInterview(this.selectedInterview.id);
      // Reload sponsor interviews to reflect changes
      this.loadSponsorInterviews(this.sponsor.id);
      this.closeInterviewModals();
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

  // Return Modal Methods
  openReturnModal(assignment: WorkerAssignment): void {
    this.selectedAssignment = assignment;
    this.returnFormData = {
      returnDate: new Date().toISOString().split('T')[0],
      returnReason: '',
      refundAmount: this.calculateRefundAmount(assignment),
      notes: ''
    };
    this.showReturnModal = true;
  }

  closeReturnModal(): void {
    this.showReturnModal = false;
    this.selectedAssignment = null;
    this.returnFormData = {
      returnDate: new Date().toISOString().split('T')[0],
      returnReason: '',
      refundAmount: 0,
      notes: ''
    };
  }

  calculateRefundAmount(assignment: WorkerAssignment): number {
    // Calculate refund based on contract terms and time worked
    const monthsWorked = this.getMonthsWorked(assignment.contractStartDate);
    const totalAmount = assignment.totalAmount;
    
    // Standard refund policy: 50% refund if returned within 6 months
    if (monthsWorked <= 6) {
      return Math.round(totalAmount * 0.5);
    }
    // 25% refund if returned within 12 months
    else if (monthsWorked <= 12) {
      return Math.round(totalAmount * 0.25);
    }
    // No refund after 12 months
    return 0;
  }

  processReturn(): void {
    if (!this.selectedAssignment) return;

    // Process return through service (only assignmentId and returnReason are supported)
    this.sponsorService.returnWorker(
      this.selectedAssignment.id,
      this.returnFormData.returnReason
    );

    // Show success message with refund information
    const refundMessage = this.returnFormData.refundAmount > 0 
      ? `Refund of AED ${this.returnFormData.refundAmount.toLocaleString()} will be processed.`
      : 'No refund applicable based on contract terms.';
    
    alert(`✅ Worker Return Processed! ${refundMessage}`);
    
    this.closeReturnModal();
    this.loadSponsorAssignments(this.sponsor!.id);
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

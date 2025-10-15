import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Sponsor, WorkerAssignment, WorkerInterview, WORKER_PRICING } from '../../../models/sponsor.model';
import { Worker } from '../../../models/worker.model';
import { SponsorService } from '../../../services/sponsor.service';
import { WorkerService } from '../../../services/worker.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-sponsors-list',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './sponsors-list.component.html',
  styleUrl: './sponsors-list.component.css'
})
export class SponsorsListComponent implements OnInit {
  sponsors: Sponsor[] = [];
  filteredSponsors: Sponsor[] = [];
  workers: Worker[] = [];
  availableWorkers: Worker[] = [];
  assignments: WorkerAssignment[] = [];
  interviews: WorkerInterview[] = [];
  
  // Filter states
  searchTerm: string = '';
  emiratesFilter: string = 'all';
  statusFilter: string = 'all';
  stats: any = {};
  
  // Modal states
  showFormModal = false;
  showDetailsModal = false;
  showAssignModal = false;
  showInterviewModal = false;
  showDeleteModal = false;
  showPaymentModal = false;
  showReturnModal = false;
  showRefundModal = false;
  showReplaceModal = false;
  showInterviewFeedbackModal = false;
  showSuccessModal = false;
  
  // Current data
  selectedSponsor: Sponsor | null = null;
  sponsorToDelete: Sponsor | null = null;
  selectedAssignment: WorkerAssignment | null = null;
  selectedInterview: WorkerInterview | null = null;
  isEditMode = false;
  activeTab: 'interviews' | 'assignments' = 'interviews';
  
  // Payment form data
  paymentFormData = {
    finalPaymentAmount: 0,
    paymentDate: new Date().toISOString().split('T')[0],
    notes: ''
  };

  // Interview form data
  interviewFormData = {
    workerId: '',
    interviewDate: '',
    interviewTime: '10:00',
    interviewLocation: '',
    interviewNotes: ''
  };

  // Return worker form data
  returnFormData = {
    returnReason: '',
    returnDate: new Date().toISOString().split('T')[0],
    notes: ''
  };

  // Refund form data
  refundFormData = {
    refundReason: 'performance',
    refundDate: new Date().toISOString().split('T')[0],
    notes: ''
  };

  // Interview feedback form data
  feedbackFormData = {
    result: 'selected',
    feedback: '',
    rejectionReason: ''
  };

  // Rejection reason for quick reject
  quickRejectReason: string = '';

  // Success modal data
  successMessage: string = '';
  successType: 'accept' | 'reject' = 'accept';

  // Feedback modal
  showFeedbackFormModal = false;
  feedbackAction: 'accept' | 'reject' = 'accept';
  interviewFeedback: string = '';

  // Generic alert modal
  showAlertModal = false;
  alertModalMessage = '';
  alertModalType: 'success' | 'error' | 'warning' | 'info' = 'info';
  
  // Form data
  formData: any = {
    sponsorCode: '',
    fullName: '',
    emiratesId: '',
    nationality: 'UAE',
    phone: '',
    alternatePhone: '',
    email: '',
    emirates: 'Dubai',
    area: '',
    address: '',
    status: 'active'
  };
  
  // Assignment form
  assignmentData: any = {
    workerId: '',
    advanceAmount: 0,
    isOnTrial: true,
    contractStartDate: new Date().toISOString().split('T')[0]
  };
  
  // Success alert
  showSuccessAlert = false;
  alertMessage = '';
  
  emiratesList = ['Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman', 'Umm Al Quwain', 'Ras Al Khaimah', 'Fujairah'];
  
  constructor(
    private sponsorService: SponsorService,
    private workerService: WorkerService,
    private authService: AuthService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    this.loadSponsors();
    this.loadWorkers();
    this.loadAssignments();
    this.loadInterviews();
    this.loadStats();
  }
  
  loadSponsors(): void {
    this.sponsorService.getSponsors().subscribe(sponsors => {
      this.sponsors = sponsors;
      this.applyFilters();
    });
  }
  
  loadWorkers(): void {
    this.workerService.getWorkers().subscribe(workers => {
      this.workers = workers;
      this.updateAvailableWorkers();
    });
  }
  
  loadAssignments(): void {
    this.sponsorService.getAssignments().subscribe(assignments => {
      this.assignments = assignments;
      this.updateAvailableWorkers();
    });
  }

  loadInterviews(): void {
    this.sponsorService.getInterviews().subscribe(interviews => {
      this.interviews = interviews;
    });
  }
  
  updateAvailableWorkers(): void {
    const assignedWorkerIds = this.assignments
      .filter(a => ['on-trial', 'active'].includes(a.assignmentStatus))
      .map(a => a.workerId);
    
    this.availableWorkers = this.workers.filter(w => 
      w.currentStatus === 'available' && !assignedWorkerIds.includes(w.id)
    );
  }
  
  loadStats(): void {
    this.stats = this.sponsorService.getStats();
  }
  
  applyFilters(): void {
    this.filteredSponsors = this.sponsors.filter(sponsor => {
      const matchesSearch = !this.searchTerm || 
        sponsor.fullName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        sponsor.phone.includes(this.searchTerm) ||
        sponsor.emiratesId.includes(this.searchTerm);
      
      const matchesEmirates = this.emiratesFilter === 'all' || sponsor.emirates === this.emiratesFilter;
      const matchesStatus = this.statusFilter === 'all' || sponsor.status === this.statusFilter;
      
      return matchesSearch && matchesEmirates && matchesStatus;
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
      sponsorCode: this.sponsorService.generateSponsorCode(),
      fullName: '',
      emiratesId: '',
      nationality: 'UAE',
      phone: '',
      alternatePhone: '',
      email: '',
      emirates: 'Dubai',
      area: '',
      address: '',
      status: 'active'
    };
    this.showFormModal = true;
  }
  
  openEditModal(sponsor: Sponsor): void {
    this.isEditMode = true;
    this.formData = { ...sponsor };
    this.showFormModal = true;
  }
  
  openDetailsModal(sponsor: Sponsor): void {
    this.selectedSponsor = sponsor;
    this.showDetailsModal = true;
  }

  // Navigate to sponsor details page
  viewSponsorDetails(sponsor: Sponsor): void {
    this.router.navigate(['/sponsors', sponsor.id]);
  }
  
  openAssignModal(sponsor: Sponsor): void {
    this.selectedSponsor = sponsor;
    this.assignmentData = {
      workerId: this.availableWorkers.length > 0 ? this.availableWorkers[0].id : '',
      advanceAmount: 0,
      isOnTrial: true,
      contractStartDate: new Date().toISOString().split('T')[0]
    };
    this.updateAdvanceAmount();
    this.showAssignModal = true;
  }
  
  closeFormModal(): void {
    this.showFormModal = false;
  }
  
  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedSponsor = null;
  }
  
  closeAssignModal(): void {
    this.showAssignModal = false;
    this.selectedSponsor = null;
  }
  
  openDeleteModal(sponsor: Sponsor): void {
    this.sponsorToDelete = sponsor;
    this.showDeleteModal = true;
  }
  
  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.sponsorToDelete = null;
  }
  
  // CRUD operations
  onSubmit(): void {
    if (this.isEditMode) {
      this.sponsorService.updateSponsor(this.formData);
      this.showAlert('Sponsor updated successfully!');
    } else {
      this.sponsorService.addSponsor(this.formData);
      this.showAlert('Sponsor added successfully!');
    }
    this.closeFormModal();
    this.loadStats();
  }
  
  confirmDelete(): void {
    if (this.sponsorToDelete) {
      this.sponsorService.deleteSponsor(this.sponsorToDelete.id);
      this.showAlert('Sponsor deleted successfully!');
      this.closeDeleteModal();
      this.loadStats();
    }
  }
  
  // Worker assignment
  updateAdvanceAmount(): void {
    const selectedWorker = this.workers.find(w => w.id === this.assignmentData.workerId);
    if (selectedWorker) {
      const totalAmount = WORKER_PRICING[selectedWorker.nationality] || 10000;
      this.assignmentData.advanceAmount = Math.floor(totalAmount * 0.3); // 30% advance default
    }
  }
  
  onWorkerSelect(): void {
    this.updateAdvanceAmount();
  }
  
  assignWorker(): void {
    if (!this.selectedSponsor || !this.assignmentData.workerId) return;
    
    const selectedWorker = this.workers.find(w => w.id === this.assignmentData.workerId);
    if (!selectedWorker) return;
    
    const assignment: WorkerAssignment = {
      id: '',
      workerId: selectedWorker.id,
      workerName: selectedWorker.fullName,
      workerPassport: selectedWorker.passportNumber,
      workerNationality: selectedWorker.nationality,
      workerType: selectedWorker.workerType,
      sponsorId: this.selectedSponsor.id,
      sponsorName: this.selectedSponsor.fullName,
      totalAmount: WORKER_PRICING[selectedWorker.nationality] || 10000,
      advanceAmount: this.assignmentData.advanceAmount,
      remainingAmount: 0,
      paidAmount: this.assignmentData.advanceAmount,
      contractStartDate: new Date(this.assignmentData.contractStartDate).toISOString(),
      contractEndDate: '',
      contractStatus: this.assignmentData.isOnTrial ? 'trial' : 'confirmed',
      isOnTrial: this.assignmentData.isOnTrial,
      assignmentStatus: this.assignmentData.isOnTrial ? 'on-trial' : 'pending',
      quotationNumber: 'QT-' + new Date().getFullYear() + '-' + String(Date.now()).slice(-6),
      createdAt: '',
      updatedAt: ''
    };
    
    this.sponsorService.assignWorkerToSponsor(assignment);
    
    // Update worker status
    this.workerService.updateWorker(selectedWorker.id, {
      currentStatus: 'trial',
      sponsorId: this.selectedSponsor.id,
      sponsorName: this.selectedSponsor.fullName,
      sponsorPhone: this.selectedSponsor.phone,
      sponsorEmirates: this.selectedSponsor.emirates
    });
    
    this.showAlert(`Worker assigned to ${this.selectedSponsor.fullName} successfully!`);
    this.closeAssignModal();
    this.loadSponsors();
    this.loadWorkers();
    this.loadAssignments();
    this.loadStats();
  }
  
  // Assignment details
  getSponsorAssignments(sponsorId: string): WorkerAssignment[] {
    return this.assignments.filter(a => a.sponsorId === sponsorId);
  }
  
  getStatusClass(status: string): string {
    const classes: any = {
      'on-trial': 'bg-yellow-100 text-yellow-800',
      'active': 'bg-green-100 text-green-800',
      'returned': 'bg-red-100 text-red-800',
      'replaced': 'bg-blue-100 text-blue-800',
      'refunded': 'bg-purple-100 text-purple-800'
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
  }
  
  getContractStatusClass(status: string): string {
    const classes: any = {
      'trial': 'bg-yellow-100 text-yellow-800',
      'confirmed': 'bg-green-100 text-green-800',
      'completed': 'bg-blue-100 text-blue-800',
      'terminated': 'bg-red-100 text-red-800'
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
  }
  
  confirmAssignment(assignment: WorkerAssignment): void {
    // Open payment modal
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
      this.showAlert(`⚠️ Payment must be at least AED ${assignment.remainingAmount.toLocaleString()}`);
      return;
    }

    // Process confirmation
    this.sponsorService.confirmAssignment(assignment.id, finalPayment);

    // Update worker status to "placed"
    const worker = this.workers.find(w => w.id === assignment.workerId);
    if (worker) {
      this.workerService.updateWorker(worker.id, {
        currentStatus: 'placed'
      });
    }

    this.showAlert(`✅ Assignment Confirmed! Invoice generated for AED ${(assignment.advanceAmount + finalPayment).toLocaleString()}`);

    this.closePaymentModal();
    this.loadSponsors();
    this.loadWorkers();
    this.loadAssignments();
    this.loadStats();
  }

  getPaymentProgress(): number {
    if (!this.selectedAssignment) return 0;
    const totalPaid = this.selectedAssignment.advanceAmount + this.paymentFormData.finalPaymentAmount;
    return (totalPaid / this.selectedAssignment.totalAmount) * 100;
  }

  getTotalAfterPayment(): number {
    if (!this.selectedAssignment) return 0;
    return this.selectedAssignment.advanceAmount + this.paymentFormData.finalPaymentAmount;
  }

  getRemainingAfterPayment(): number {
    if (!this.selectedAssignment) return 0;
    return this.selectedAssignment.totalAmount - this.getTotalAfterPayment();
  }
  
  // Open Return Worker Modal
  openReturnModal(assignment: WorkerAssignment): void {
    this.selectedAssignment = assignment;
    this.returnFormData = {
      returnReason: '',
      returnDate: new Date().toISOString().split('T')[0],
      notes: ''
    };
    this.showReturnModal = true;
  }

  closeReturnModal(): void {
    this.showReturnModal = false;
    this.selectedAssignment = null;
    this.returnFormData = {
      returnReason: '',
      returnDate: new Date().toISOString().split('T')[0],
      notes: ''
    };
  }

  returnWorker(): void {
    if (!this.selectedAssignment || !this.returnFormData.returnReason) {
      this.showAlert('⚠️ Please provide a return reason');
      return;
    }

    const assignment = this.selectedAssignment;
    this.sponsorService.returnWorker(assignment.id, this.returnFormData.returnReason);
    
    // Update worker status back to available
    const worker = this.workers.find(w => w.id === assignment.workerId);
    if (worker) {
      this.workerService.updateWorker(worker.id, {
        currentStatus: 'available',
        sponsorId: undefined,
        sponsorName: undefined,
        sponsorPhone: undefined,
        sponsorEmirates: undefined
      });
    }
    
    this.showAlert(`✅ Worker ${assignment.workerName} returned successfully!`);
    this.closeReturnModal();
    this.loadAssignments();
    this.loadWorkers();
    this.loadSponsors();
    this.loadStats();
  }
  
  // Open Refund Modal
  openRefundModal(assignment: WorkerAssignment): void {
    this.selectedAssignment = assignment;
    this.refundFormData = {
      refundReason: 'performance',
      refundDate: new Date().toISOString().split('T')[0],
      notes: ''
    };
    this.showRefundModal = true;
  }

  closeRefundModal(): void {
    this.showRefundModal = false;
    this.selectedAssignment = null;
    this.refundFormData = {
      refundReason: 'performance',
      refundDate: new Date().toISOString().split('T')[0],
      notes: ''
    };
  }

  getCalculatedRefundAmount(): number {
    if (!this.selectedAssignment) return 0;
    return this.sponsorService.calculateRefund(this.selectedAssignment.id, this.refundFormData.refundReason);
  }

  isFullRefund(): boolean {
    return ['illness', 'pregnancy', 'absconded'].includes(this.refundFormData.refundReason);
  }

  processRefund(): void {
    if (!this.selectedAssignment) return;

    const assignment = this.selectedAssignment;
    const refundAmount = this.getCalculatedRefundAmount();

    this.sponsorService.processRefund(assignment.id, this.refundFormData.refundReason);
    
    this.showAlert(`✅ Refund of AED ${refundAmount.toLocaleString()} processed successfully!`);
    this.closeRefundModal();
    this.loadAssignments();
    this.loadSponsors();
    this.loadStats();
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
    return new Date(dateString).toLocaleDateString('en-GB');
  }
  
  calculateDaysRemaining(endDate: string): number {
    const end = new Date(endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  // Helper methods for assignment modal
  getSelectedWorkerTotalAmount(): number {
    const selectedWorker = this.workers.find(w => w.id === this.assignmentData.workerId);
    if (!selectedWorker) return 0;
    return WORKER_PRICING[selectedWorker.nationality] || 10000;
  }

  getSelectedWorkerRemainingAmount(): number {
    const total = this.getSelectedWorkerTotalAmount();
    const advance = this.assignmentData.advanceAmount || 0;
    return total - advance;
  }

  getMonthsWorked(contractStartDate: string): number {
    const start = new Date(contractStartDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.floor(diffDays / 30.44); // Average days in a month
  }

  getSponsorById(sponsorId: string): Sponsor | undefined {
    return this.sponsors.find(s => s.id === sponsorId);
  }

  replaceWorker(assignment: WorkerAssignment): void {
    const sponsor = this.getSponsorById(assignment.sponsorId);
    if (!sponsor) return;
    
    // Close details modal and open assign modal for replacement
    this.closeDetailsModal();
    this.openAssignModal(sponsor);
    
    // Show info message
    this.showAlert(`Select a replacement worker for ${assignment.workerName}. No additional payment required within guarantee period.`);
  }

  // Interview Management Methods
  getCurrentDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  openInterviewModal(sponsor: Sponsor): void {
    this.selectedSponsor = sponsor;
    this.interviewFormData = {
      workerId: '',
      interviewDate: '',
      interviewTime: '10:00',
      interviewLocation: `${sponsor.address}, ${sponsor.area}, ${sponsor.emirates}`,
      interviewNotes: ''
    };
    this.showInterviewModal = true;
  }

  closeInterviewModal(): void {
    this.showInterviewModal = false;
    this.selectedSponsor = null;
    this.interviewFormData = {
      workerId: '',
      interviewDate: '',
      interviewTime: '10:00',
      interviewLocation: '',
      interviewNotes: ''
    };
  }

  scheduleInterview(): void {
    if (!this.selectedSponsor || !this.interviewFormData.workerId) {
      this.showAlert('⚠️ Please select a worker for the interview.');
      return;
    }

    if (!this.interviewFormData.interviewDate) {
      this.showAlert('⚠️ Please select an interview date.');
      return;
    }

    const selectedWorker = this.availableWorkers.find(w => w.id === this.interviewFormData.workerId);
    if (!selectedWorker) {
      this.showAlert('⚠️ Selected worker not found.');
      return;
    }

    const interview: WorkerInterview = {
      id: '',
      sponsorId: this.selectedSponsor.id,
      sponsorName: this.selectedSponsor.fullName,
      workerId: selectedWorker.id,
      workerName: selectedWorker.fullName,
      workerPassport: selectedWorker.passportNumber,
      workerNationality: selectedWorker.nationality,
      workerType: selectedWorker.workerType,
      interviewDate: this.interviewFormData.interviewDate,
      interviewTime: this.interviewFormData.interviewTime,
      interviewLocation: this.interviewFormData.interviewLocation,
      interviewStatus: 'scheduled',
      result: 'pending',
      interviewNotes: this.interviewFormData.interviewNotes,
      createdAt: '',
      updatedAt: ''
    };

    this.sponsorService.scheduleInterview(interview);
    this.showAlert(`✅ Interview scheduled with ${selectedWorker.fullName} on ${this.interviewFormData.interviewDate} at ${this.interviewFormData.interviewTime}`);
    this.closeInterviewModal();
    this.loadSponsors();
    this.loadInterviews();
  }

  // Get interviews for sponsor
  getSponsorInterviews(sponsorId: string): WorkerInterview[] {
    return this.interviews.filter(i => i.sponsorId === sponsorId);
  }

  // Interview Feedback Methods
  openInterviewFeedbackModal(interview: WorkerInterview): void {
    this.selectedInterview = interview;
    this.feedbackFormData = {
      result: 'selected',
      feedback: '',
      rejectionReason: ''
    };
    this.showInterviewFeedbackModal = true;
  }

  closeInterviewFeedbackModal(): void {
    this.showInterviewFeedbackModal = false;
    this.selectedInterview = null;
    this.feedbackFormData = {
      result: 'selected',
      feedback: '',
      rejectionReason: ''
    };
  }

  submitInterviewFeedback(): void {
    if (!this.selectedInterview) return;

    const result = this.feedbackFormData.result as 'selected' | 'rejected';
    
    this.sponsorService.updateInterviewResult(
      this.selectedInterview.id,
      result,
      this.feedbackFormData.feedback,
      result === 'rejected' ? this.feedbackFormData.rejectionReason : undefined
    );

    if (result === 'selected') {
      this.showAlert(`✅ Worker ${this.selectedInterview.workerName} selected! You can now proceed to assign this worker.`);
    } else {
      this.showAlert(`❌ Worker ${this.selectedInterview.workerName} rejected. Feedback recorded.`);
    }

    this.closeInterviewFeedbackModal();
    this.loadInterviews();
  }

  getInterviewResultClass(result: string | undefined): string {
    if (!result) return 'bg-yellow-100 text-yellow-800';
    const classes: any = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'selected': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800'
    };
    return classes[result] || 'bg-gray-100 text-gray-800';
  }

  getInterviewStatusClass(status: string): string {
    const classes: any = {
      'scheduled': 'bg-blue-100 text-blue-800',
      'completed': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
  }

  // Switch tabs in sponsor details
  switchTab(tab: 'interviews' | 'assignments'): void {
    this.activeTab = tab;
  }

  // Get pending interviews only
  getPendingInterviews(sponsorId: string): WorkerInterview[] {
    return this.interviews.filter(i => 
      i.sponsorId === sponsorId && 
      i.result === 'pending' && 
      i.interviewStatus === 'scheduled'
    );
  }

  // Quick Accept - Open feedback modal first
  acceptInterview(interview: WorkerInterview): void {
    this.selectedInterview = interview;
    this.feedbackAction = 'accept';
    this.interviewFeedback = '';
    this.showFeedbackFormModal = true;
  }

  // Process accept with feedback
  processAccept(): void {
    if (!this.selectedInterview) return;

    // Mark interview as selected
    this.sponsorService.updateInterviewResult(
      this.selectedInterview.id,
      'selected',
      this.interviewFeedback || 'Worker accepted after interview. Moving to trial period.'
    );

    // Find the worker
    const worker = this.workers.find(w => w.id === this.selectedInterview!.workerId);
    if (!worker) {
      this.showAlert('⚠️ Worker not found!');
      return;
    }

    // Get sponsor
    const sponsor = this.sponsors.find(s => s.id === this.selectedInterview!.sponsorId);
    if (!sponsor) {
      this.showAlert('⚠️ Sponsor not found!');
      return;
    }

    // Get worker pricing based on nationality
    const totalAmount = WORKER_PRICING[worker.nationality] || 12000;
    const advanceAmount = totalAmount * 0.5; // 50% advance

    // Create assignment on trial
    const assignment: WorkerAssignment = {
      id: '',
      sponsorId: sponsor.id,
      sponsorName: sponsor.fullName,
      workerId: worker.id,
      workerName: worker.fullName,
      workerPassport: worker.passportNumber,
      workerNationality: worker.nationality,
      workerType: worker.workerType,
      totalAmount: totalAmount,
      advanceAmount: advanceAmount,
      remainingAmount: totalAmount - advanceAmount,
      paidAmount: advanceAmount,
      contractStartDate: new Date().toISOString().split('T')[0],
      contractEndDate: this.calculateContractEndDate(new Date().toISOString().split('T')[0]),
      contractStatus: 'trial',
      trialStartDate: new Date().toISOString().split('T')[0],
      trialEndDate: this.calculateTrialEndDate(new Date().toISOString().split('T')[0]),
      isOnTrial: true,
      assignmentStatus: 'on-trial',
      notes: `Worker accepted after interview on ${this.selectedInterview.interviewDate}. Feedback: ${this.interviewFeedback || 'N/A'}`,
      createdAt: '',
      updatedAt: ''
    };

    // Add assignment
    this.sponsorService.assignWorkerToSponsor(assignment);

    // Update worker status to trial
    this.workerService.updateWorker(worker.id, {
      currentStatus: 'trial',
      sponsorId: sponsor.id,
      sponsorName: sponsor.fullName,
      sponsorPhone: sponsor.phone,
      sponsorEmirates: sponsor.emirates
    });

    // Close feedback modal
    this.closeFeedbackFormModal();

    // Show success modal
    this.successMessage = `Worker ${worker.fullName} has been accepted and moved to trial period!`;
    this.successType = 'accept';
    this.showSuccessModal = true;
    
    this.loadInterviews();
    this.loadAssignments();
    this.loadWorkers();
    this.loadSponsors();
    this.loadStats();
  }

  // Open Rejection Modal (first select reason)
  openRejectModal(interview: WorkerInterview): void {
    this.selectedInterview = interview;
    this.quickRejectReason = '';
    this.showInterviewFeedbackModal = true;
  }

  // After selecting reason, open feedback modal
  rejectInterview(): void {
    if (!this.selectedInterview || !this.quickRejectReason) {
      this.showAlert('⚠️ Please select a rejection reason');
      return;
    }

    // Close rejection reason modal
    this.closeInterviewFeedbackModal();
    
    // Open feedback modal for reject
    this.feedbackAction = 'reject';
    this.interviewFeedback = '';
    this.showFeedbackFormModal = true;
  }

  // Process reject with feedback
  processReject(): void {
    if (!this.selectedInterview) return;

    const workerName = this.selectedInterview.workerName;

    this.sponsorService.updateInterviewResult(
      this.selectedInterview.id,
      'rejected',
      this.interviewFeedback || 'Worker rejected after interview.',
      this.quickRejectReason
    );

    // Close feedback modal
    this.closeFeedbackFormModal();
    
    // Show success modal
    this.successMessage = `Worker ${workerName} has been rejected. Worker remains available for other sponsors.`;
    this.successType = 'reject';
    this.showSuccessModal = true;
    
    this.loadInterviews();
  }

  closeSuccessModal(): void {
    this.showSuccessModal = false;
    this.successMessage = '';
  }

  closeFeedbackFormModal(): void {
    this.showFeedbackFormModal = false;
    this.interviewFeedback = '';
    this.selectedInterview = null;
  }

  submitFeedback(): void {
    if (this.feedbackAction === 'accept') {
      this.processAccept();
    } else {
      this.processReject();
    }
  }

  calculateTrialEndDate(startDate: string): string {
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + 3); // 3 months trial
    return date.toISOString().split('T')[0];
  }

  calculateContractEndDate(startDate: string): string {
    const date = new Date(startDate);
    date.setFullYear(date.getFullYear() + 2); // 2 years contract
    return date.toISOString().split('T')[0];
  }
}
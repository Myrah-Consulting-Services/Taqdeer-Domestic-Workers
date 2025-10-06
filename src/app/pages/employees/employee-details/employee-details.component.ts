import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { EmployeeService } from '../../../services/employee.service';
import { Employee } from '../../../models/employee.model';
import { WorkerInterview } from '../../../models/sponsor.model';

@Component({
  selector: 'app-employee-details',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './employee-details.component.html',
  styleUrl: './employee-details.component.css'
})
export class EmployeeDetailsComponent implements OnInit {
  employee: Employee | undefined;
  showDeleteModal = false;
  activeTab: string = 'overview';

  // Interview-related properties
  employeeInterviews: WorkerInterview[] = [];
  selectedInterview: WorkerInterview | null = null;
  
  // Modal states
  showSelectWorkerModal = false;
  showRejectWorkerModal = false;
  showRescheduleModal = false;
  showCancelInterviewModal = false;

  // Form data
  interviewFeedback: string = '';
  rejectionReason: string = '';
  rescheduleDate: string = '';
  rescheduleTime: string = '';
  rescheduleReason: string = '';
  cancellationReason: string = '';

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.loadEmployee(params['id']);
        this.loadEmployeeInterviews(params['id']);
      }
    });
  }

  loadEmployeeInterviews(employeeId: string): void {
    // Mock data - in production, this would come from a service
    this.employeeInterviews = [
      {
        id: '1',
        sponsorId: 'S001',
        sponsorName: 'Ahmed Al Mansouri',
        workerId: 'W001',
        workerName: 'Maria Santos',
        workerPassport: 'P1234567',
        workerNationality: 'Philippines',
        workerType: 'housemaid',
        interviewDate: '2024-03-20',
        interviewTime: '10:00 AM',
        interviewLocation: 'Abu Dhabi Office',
        interviewStatus: 'scheduled',
        result: 'pending',
        interviewNotes: 'Initial screening completed. Ready for final interview.',
        createdAt: '2024-03-15',
        updatedAt: '2024-03-15'
      },
      {
        id: '2',
        sponsorId: 'S002',
        sponsorName: 'Fatima Hassan',
        workerId: 'W002',
        workerName: 'Lakshmi Devi',
        workerPassport: 'P7654321',
        workerNationality: 'India',
        workerType: 'cook',
        interviewDate: '2024-03-18',
        interviewTime: '2:00 PM',
        interviewLocation: 'Dubai Branch',
        interviewStatus: 'completed',
        result: 'selected',
        sponsorFeedback: 'Excellent candidate with great experience',
        createdAt: '2024-03-10',
        updatedAt: '2024-03-18'
      }
    ];
  }

  loadEmployee(id: string): void {
    this.employee = this.employeeService.getEmployeeById(id);
    if (!this.employee) {
      this.router.navigate(['/employees']);
    }
  }

  switchTab(tab: string): void {
    this.activeTab = tab;
  }

  navigateToEdit(): void {
    if (this.employee) {
      this.router.navigate(['/employees']);
    }
  }

  navigateBack(): void {
    this.router.navigate(['/employees']);
  }

  openDeleteModal(): void {
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
  }

  confirmDelete(): void {
    if (this.employee) {
      this.employeeService.deleteEmployee(this.employee.id);
      this.router.navigate(['/employees']);
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
      'active': 'bg-green-100 text-green-800',
      'inactive': 'bg-gray-100 text-gray-800',
      'on-leave': 'bg-yellow-100 text-yellow-800',
      'terminated': 'bg-red-100 text-red-800'
    };
    return statusMap[status] || 'bg-gray-100 text-gray-800';
  }

  getRoleBadgeClass(role: string): string {
    const roleMap: { [key: string]: string } = {
      'Receptionist': 'bg-blue-100 text-blue-800',
      'HR Manager': 'bg-purple-100 text-purple-800',
      'Accountant': 'bg-green-100 text-green-800',
      'Sales Executive': 'bg-orange-100 text-orange-800',
      'Operations Manager': 'bg-indigo-100 text-indigo-800'
    };
    return roleMap[role] || 'bg-gray-100 text-gray-800';
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

  calculateExperience(joiningDate: Date): string {
    const today = new Date();
    const joinDate = new Date(joiningDate);
    const years = today.getFullYear() - joinDate.getFullYear();
    const months = today.getMonth() - joinDate.getMonth();
    
    if (years === 0) {
      return `${months} month${months !== 1 ? 's' : ''}`;
    } else if (months < 0) {
      return `${years - 1} year${years - 1 !== 1 ? 's' : ''} ${12 + months} month${12 + months !== 1 ? 's' : ''}`;
    } else {
      return `${years} year${years !== 1 ? 's' : ''} ${months} month${months !== 1 ? 's' : ''}`;
    }
  }

  // Interview Modal Methods
  getInterviewResultClass(result?: string): string {
    const classMap: { [key: string]: string } = {
      'selected': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800',
      'pending': 'bg-yellow-100 text-yellow-800'
    };
    return classMap[result || 'pending'] || 'bg-gray-100 text-gray-800';
  }

  getInterviewStatusClass(status: string): string {
    const classMap: { [key: string]: string } = {
      'scheduled': 'bg-blue-100 text-blue-800',
      'completed': 'bg-green-100 text-green-800',
      'cancelled': 'bg-gray-100 text-gray-800',
      'rescheduled': 'bg-purple-100 text-purple-800'
    };
    return classMap[status] || 'bg-gray-100 text-gray-800';
  }

  // Select Worker Modal
  openSelectWorkerModal(interview: WorkerInterview): void {
    this.selectedInterview = interview;
    this.interviewFeedback = '';
    this.showSelectWorkerModal = true;
  }

  closeSelectWorkerModal(): void {
    this.showSelectWorkerModal = false;
    this.selectedInterview = null;
    this.interviewFeedback = '';
  }

  confirmSelectWorker(): void {
    if (!this.selectedInterview) return;

    // Update interview
    this.selectedInterview.result = 'selected';
    this.selectedInterview.interviewStatus = 'completed';
    this.selectedInterview.sponsorFeedback = this.interviewFeedback || 'Worker selected';
    this.selectedInterview.updatedAt = new Date().toISOString();

    this.closeSelectWorkerModal();
  }

  // Reject Worker Modal
  openRejectWorkerModal(interview: WorkerInterview): void {
    this.selectedInterview = interview;
    this.rejectionReason = '';
    this.showRejectWorkerModal = true;
  }

  closeRejectWorkerModal(): void {
    this.showRejectWorkerModal = false;
    this.selectedInterview = null;
    this.rejectionReason = '';
  }

  confirmRejectWorker(): void {
    if (!this.selectedInterview) return;

    if (!this.rejectionReason.trim()) {
      return;
    }

    // Update interview
    this.selectedInterview.result = 'rejected';
    this.selectedInterview.interviewStatus = 'completed';
    this.selectedInterview.rejectionReason = this.rejectionReason;
    this.selectedInterview.updatedAt = new Date().toISOString();

    this.closeRejectWorkerModal();
  }

  // Reschedule Modal
  openRescheduleModal(interview: WorkerInterview): void {
    this.selectedInterview = interview;
    this.rescheduleDate = interview.interviewDate;
    this.rescheduleTime = interview.interviewTime.replace(' AM', '').replace(' PM', '');
    this.rescheduleReason = '';
    this.showRescheduleModal = true;
  }

  closeRescheduleModal(): void {
    this.showRescheduleModal = false;
    this.selectedInterview = null;
    this.rescheduleDate = '';
    this.rescheduleTime = '';
    this.rescheduleReason = '';
  }

  confirmReschedule(): void {
    if (!this.selectedInterview) return;

    if (!this.rescheduleDate || !this.rescheduleTime) {
      return;
    }

    // Update interview
    this.selectedInterview.interviewDate = this.rescheduleDate;
    this.selectedInterview.interviewTime = this.rescheduleTime;
    this.selectedInterview.interviewStatus = 'rescheduled';
    if (this.rescheduleReason) {
      this.selectedInterview.interviewNotes = 
        (this.selectedInterview.interviewNotes || '') + 
        `\n\nRescheduled: ${this.rescheduleReason}`;
    }
    this.selectedInterview.updatedAt = new Date().toISOString();

    this.closeRescheduleModal();
  }

  // Cancel Interview Modal
  openCancelInterviewModal(interview: WorkerInterview): void {
    this.selectedInterview = interview;
    this.cancellationReason = '';
    this.showCancelInterviewModal = true;
  }

  closeCancelInterviewModal(): void {
    this.showCancelInterviewModal = false;
    this.selectedInterview = null;
    this.cancellationReason = '';
  }

  confirmCancelInterview(): void {
    if (!this.selectedInterview) return;

    if (!this.cancellationReason.trim()) {
      return;
    }

    // Update interview
    this.selectedInterview.interviewStatus = 'cancelled';
    this.selectedInterview.interviewNotes = 
      (this.selectedInterview.interviewNotes || '') + 
      `\n\nCancellation Reason: ${this.cancellationReason}`;
    this.selectedInterview.updatedAt = new Date().toISOString();

    this.closeCancelInterviewModal();
  }
}


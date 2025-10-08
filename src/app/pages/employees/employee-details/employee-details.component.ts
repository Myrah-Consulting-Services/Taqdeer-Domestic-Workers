import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { EmployeeService } from '../../../services/employee.service';
import { Employee } from '../../../models/employee.model';
import { WorkerInterview } from '../../../models/sponsor.model';

// Leave Management Models
interface LeaveRequest {
  id: string;
  employeeId: string;
  leaveType: 'sick' | 'annual' | 'emergency' | 'personal' | 'maternity' | 'paternity';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedDate: string;
  approvedBy?: string;
  approvedDate?: string;
  rejectionReason?: string;
}

// Attendance Models
interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  status: 'present' | 'absent' | 'late' | 'half-day';
  workingHours: number;
  overtimeHours: number;
  notes?: string;
}

@Component({
  selector: 'app-employee-details',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './employee-details.component.html',
  styleUrl: './employee-details.component.css'
})
export class EmployeeDetailsComponent implements OnInit {
  employee: Employee | undefined;
  activeTab: string = 'personal';

  // Interview-related properties
  employeeInterviews: WorkerInterview[] = [];
  selectedInterview: WorkerInterview | null = null;
  
  // Leave Management Properties
  leaveRequests: LeaveRequest[] = [];
  attendanceRecords: AttendanceRecord[] = [];
  
  // Modal states
  showSelectWorkerModal = false;
  showRejectWorkerModal = false;
  showRescheduleModal = false;
  showCancelInterviewModal = false;
  showLeaveRequestModal = false;
  showAttendanceModal = false;

  // Form data
  interviewFeedback: string = '';
  rejectionReason: string = '';
  rescheduleDate: string = '';
  rescheduleTime: string = '';
  rescheduleReason: string = '';
  cancellationReason: string = '';
  
  // Leave Request Form
  leaveRequestForm = {
    leaveType: 'annual',
    startDate: '',
    endDate: '',
    reason: ''
  };
  
  // Attendance Form
  attendanceForm = {
    date: '',
    checkIn: '',
    checkOut: '',
    status: 'present',
    notes: ''
  };

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
        this.loadLeaveRequests(params['id']);
        this.loadAttendanceRecords(params['id']);
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

  // Leave Management Methods
  loadLeaveRequests(employeeId: string): void {
    // Mock data - in production, this would come from a service
    this.leaveRequests = [
      {
        id: '1',
        employeeId: employeeId,
        leaveType: 'annual',
        startDate: '2024-03-15',
        endDate: '2024-03-20',
        days: 5,
        reason: 'Family vacation',
        status: 'approved',
        appliedDate: '2024-03-01',
        approvedBy: 'HR Manager',
        approvedDate: '2024-03-02'
      },
      {
        id: '2',
        employeeId: employeeId,
        leaveType: 'sick',
        startDate: '2024-03-10',
        endDate: '2024-03-12',
        days: 3,
        reason: 'Fever and cold',
        status: 'approved',
        appliedDate: '2024-03-09',
        approvedBy: 'HR Manager',
        approvedDate: '2024-03-09'
      },
      {
        id: '3',
        employeeId: employeeId,
        leaveType: 'personal',
        startDate: '2024-04-01',
        endDate: '2024-04-03',
        days: 3,
        reason: 'Personal matters',
        status: 'pending',
        appliedDate: '2024-03-25'
      }
    ];
  }

  loadAttendanceRecords(employeeId: string): void {
    // Mock data - in production, this would come from a service
    this.attendanceRecords = [
      {
        id: '1',
        employeeId: employeeId,
        date: '2024-03-20',
        checkIn: '09:00',
        checkOut: '18:00',
        status: 'present',
        workingHours: 8,
        overtimeHours: 1,
        notes: 'Regular working day'
      },
      {
        id: '2',
        employeeId: employeeId,
        date: '2024-03-19',
        checkIn: '09:15',
        checkOut: '17:45',
        status: 'late',
        workingHours: 7.5,
        overtimeHours: 0,
        notes: 'Late due to traffic'
      },
      {
        id: '3',
        employeeId: employeeId,
        date: '2024-03-18',
        checkIn: '09:00',
        checkOut: '18:30',
        status: 'present',
        workingHours: 8.5,
        overtimeHours: 0.5,
        notes: 'Overtime for project completion'
      },
      {
        id: '4',
        employeeId: employeeId,
        date: '2024-03-17',
        checkIn: '',
        checkOut: '',
        status: 'absent',
        workingHours: 0,
        overtimeHours: 0,
        notes: 'Sick leave'
      },
      {
        id: '5',
        employeeId: employeeId,
        date: '2024-03-16',
        checkIn: '09:00',
        checkOut: '14:00',
        status: 'half-day',
        workingHours: 4,
        overtimeHours: 0,
        notes: 'Half day for personal work'
      }
    ];
  }

  // Leave Request Modal Methods
  openLeaveRequestModal(): void {
    this.leaveRequestForm = {
      leaveType: 'annual',
      startDate: '',
      endDate: '',
      reason: ''
    };
    this.showLeaveRequestModal = true;
  }

  closeLeaveRequestModal(): void {
    this.showLeaveRequestModal = false;
  }

  submitLeaveRequest(): void {
    if (!this.employee || !this.leaveRequestForm.startDate || !this.leaveRequestForm.endDate) {
      return;
    }

    const startDate = new Date(this.leaveRequestForm.startDate);
    const endDate = new Date(this.leaveRequestForm.endDate);
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    const newLeaveRequest: LeaveRequest = {
      id: (this.leaveRequests.length + 1).toString(),
      employeeId: this.employee.id,
      leaveType: this.leaveRequestForm.leaveType as any,
      startDate: this.leaveRequestForm.startDate,
      endDate: this.leaveRequestForm.endDate,
      days: days,
      reason: this.leaveRequestForm.reason,
      status: 'pending',
      appliedDate: new Date().toISOString().split('T')[0]
    };

    this.leaveRequests.unshift(newLeaveRequest);
    this.closeLeaveRequestModal();
  }

  // Attendance Modal Methods
  openAttendanceModal(): void {
    this.attendanceForm = {
      date: new Date().toISOString().split('T')[0],
      checkIn: '09:00',
      checkOut: '18:00',
      status: 'present',
      notes: ''
    };
    this.showAttendanceModal = true;
  }

  closeAttendanceModal(): void {
    this.showAttendanceModal = false;
  }

  submitAttendance(): void {
    if (!this.employee || !this.attendanceForm.date) {
      return;
    }

    const checkInTime = new Date(`2000-01-01T${this.attendanceForm.checkIn}`);
    const checkOutTime = new Date(`2000-01-01T${this.attendanceForm.checkOut}`);
    const workingHours = (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60);
    const overtimeHours = Math.max(0, workingHours - 8);

    const newAttendanceRecord: AttendanceRecord = {
      id: (this.attendanceRecords.length + 1).toString(),
      employeeId: this.employee.id,
      date: this.attendanceForm.date,
      checkIn: this.attendanceForm.checkIn,
      checkOut: this.attendanceForm.checkOut,
      status: this.attendanceForm.status as any,
      workingHours: workingHours,
      overtimeHours: overtimeHours,
      notes: this.attendanceForm.notes
    };

    this.attendanceRecords.unshift(newAttendanceRecord);
    this.closeAttendanceModal();
  }

  // Utility Methods
  getLeaveTypeClass(leaveType: string): string {
    const classMap: { [key: string]: string } = {
      'sick': 'bg-red-100 text-red-800',
      'annual': 'bg-blue-100 text-blue-800',
      'emergency': 'bg-orange-100 text-orange-800',
      'personal': 'bg-purple-100 text-purple-800',
      'maternity': 'bg-pink-100 text-pink-800',
      'paternity': 'bg-green-100 text-green-800'
    };
    return classMap[leaveType] || 'bg-gray-100 text-gray-800';
  }

  getLeaveStatusClass(status: string): string {
    const classMap: { [key: string]: string } = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'approved': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800'
    };
    return classMap[status] || 'bg-gray-100 text-gray-800';
  }

  getAttendanceStatusClass(status: string): string {
    const classMap: { [key: string]: string } = {
      'present': 'bg-green-100 text-green-800',
      'absent': 'bg-red-100 text-red-800',
      'late': 'bg-yellow-100 text-yellow-800',
      'half-day': 'bg-blue-100 text-blue-800'
    };
    return classMap[status] || 'bg-gray-100 text-gray-800';
  }

  getTotalLeaveDays(): number {
    return this.leaveRequests
      .filter(leave => leave.status === 'approved')
      .reduce((total, leave) => total + leave.days, 0);
  }

  getTotalWorkingDays(): number {
    return this.attendanceRecords
      .filter(record => record.status === 'present' || record.status === 'late')
      .length;
  }

  getTotalOvertimeHours(): number {
    return this.attendanceRecords
      .reduce((total, record) => total + record.overtimeHours, 0);
  }

  getPendingLeaveRequests(): number {
    return this.leaveRequests.filter(l => l.status === 'pending').length;
  }

  getApprovedLeaveRequests(): number {
    return this.leaveRequests.filter(l => l.status === 'approved').length;
  }

  getAbsentDays(): number {
    return this.attendanceRecords.filter(a => a.status === 'absent').length;
  }

  getLateDays(): number {
    return this.attendanceRecords.filter(a => a.status === 'late').length;
  }

  updateEmployeeStatus(): void {
    if (this.employee) {
      // Update the employee status in the service
      this.employeeService.updateEmployee(this.employee);
      
      // Show success message
      console.log(`Employee status updated to: ${this.employee.status}`);
      
      // You can add a toast notification here if you have one
      // this.toastService.success(`Employee status updated to ${this.employee.status}`);
    }
  }
}


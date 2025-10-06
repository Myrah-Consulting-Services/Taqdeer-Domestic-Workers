import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

// Attendance Models
interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  status: 'pending' | 'approved' | 'rejected';
  workingHours: number;
  overtimeHours: number;
  notes?: string;
  submittedBy: string;
  submittedDate: string;
  approvedBy?: string;
  approvedDate?: string;
  rejectionReason?: string;
}

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.css'
})
export class AttendanceComponent implements OnInit {
  currentUser: User | null = null;
  employees: Employee[] = [];
  attendanceRecords: AttendanceRecord[] = [];
  
  // Filter and search
  searchTerm: string = '';
  statusFilter: string = 'all';
  dateFilter: string = '';
  
  // Modal states
  showApprovalModal = false;
  showRejectionModal = false;
  selectedAttendance: AttendanceRecord | null = null;
  rejectionReason: string = '';

  constructor(
    private employeeService: EmployeeService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    this.loadEmployees();
    this.loadAttendanceRecords();
  }

  loadEmployees(): void {
    this.employeeService.getEmployees().subscribe(employees => {
      this.employees = employees;
    });
  }

  loadAttendanceRecords(): void {
    // Mock data - in production, this would come from a service
    this.attendanceRecords = [
      {
        id: '1',
        employeeId: 'EMP001',
        employeeName: 'John Smith',
        employeeCode: 'EMP001',
        date: '2024-03-20',
        checkIn: '09:00',
        checkOut: '18:00',
        status: 'pending',
        workingHours: 8,
        overtimeHours: 1,
        notes: 'Regular working day with overtime',
        submittedBy: 'John Smith',
        submittedDate: '2024-03-20'
      },
      {
        id: '2',
        employeeId: 'EMP002',
        employeeName: 'Sarah Johnson',
        employeeCode: 'EMP002',
        date: '2024-03-20',
        checkIn: '09:15',
        checkOut: '17:45',
        status: 'pending',
        workingHours: 7.5,
        overtimeHours: 0,
        notes: 'Late due to traffic',
        submittedBy: 'Sarah Johnson',
        submittedDate: '2024-03-20'
      },
      {
        id: '3',
        employeeId: 'EMP003',
        employeeName: 'Mike Wilson',
        employeeCode: 'EMP003',
        date: '2024-03-19',
        checkIn: '09:00',
        checkOut: '18:30',
        status: 'approved',
        workingHours: 8.5,
        overtimeHours: 0.5,
        notes: 'Overtime for project completion',
        submittedBy: 'Mike Wilson',
        submittedDate: '2024-03-19',
        approvedBy: 'HR Manager',
        approvedDate: '2024-03-19'
      },
      {
        id: '4',
        employeeId: 'EMP004',
        employeeName: 'Lisa Brown',
        employeeCode: 'EMP004',
        date: '2024-03-19',
        checkIn: '',
        checkOut: '',
        status: 'rejected',
        workingHours: 0,
        overtimeHours: 0,
        notes: 'Sick leave without proper documentation',
        submittedBy: 'Lisa Brown',
        submittedDate: '2024-03-19',
        approvedBy: 'HR Manager',
        approvedDate: '2024-03-19',
        rejectionReason: 'Medical certificate required'
      },
      {
        id: '5',
        employeeId: 'EMP005',
        employeeName: 'David Lee',
        employeeCode: 'EMP005',
        date: '2024-03-18',
        checkIn: '09:00',
        checkOut: '14:00',
        status: 'approved',
        workingHours: 4,
        overtimeHours: 0,
        notes: 'Half day for personal work',
        submittedBy: 'David Lee',
        submittedDate: '2024-03-18',
        approvedBy: 'HR Manager',
        approvedDate: '2024-03-18'
      }
    ];
  }

  // Filter methods
  getFilteredAttendanceRecords(): AttendanceRecord[] {
    let filtered = this.attendanceRecords;

    // Search filter
    if (this.searchTerm) {
      filtered = filtered.filter(record => 
        record.employeeName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        record.employeeCode.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (this.statusFilter !== 'all') {
      filtered = filtered.filter(record => record.status === this.statusFilter);
    }

    // Date filter
    if (this.dateFilter) {
      filtered = filtered.filter(record => record.date === this.dateFilter);
    }

    return filtered;
  }

  // Approval methods
  openApprovalModal(attendance: AttendanceRecord): void {
    this.selectedAttendance = attendance;
    this.showApprovalModal = true;
  }

  closeApprovalModal(): void {
    this.showApprovalModal = false;
    this.selectedAttendance = null;
  }

  approveAttendance(): void {
    if (!this.selectedAttendance) return;

    this.selectedAttendance.status = 'approved';
    this.selectedAttendance.approvedBy = this.currentUser?.fullName || 'HR Manager';
    this.selectedAttendance.approvedDate = new Date().toISOString().split('T')[0];

    this.closeApprovalModal();
  }

  // Rejection methods
  openRejectionModal(attendance: AttendanceRecord): void {
    this.selectedAttendance = attendance;
    this.rejectionReason = '';
    this.showRejectionModal = true;
  }

  closeRejectionModal(): void {
    this.showRejectionModal = false;
    this.selectedAttendance = null;
    this.rejectionReason = '';
  }

  rejectAttendance(): void {
    if (!this.selectedAttendance || !this.rejectionReason.trim()) return;

    this.selectedAttendance.status = 'rejected';
    this.selectedAttendance.approvedBy = this.currentUser?.fullName || 'HR Manager';
    this.selectedAttendance.approvedDate = new Date().toISOString().split('T')[0];
    this.selectedAttendance.rejectionReason = this.rejectionReason;

    this.closeRejectionModal();
  }

  // Utility methods
  getStatusClass(status: string): string {
    const classMap: { [key: string]: string } = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'approved': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800'
    };
    return classMap[status] || 'bg-gray-100 text-gray-800';
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  formatTime(time: string | undefined): string {
    if (!time) return 'N/A';
    return time;
  }

  getTotalPendingRecords(): number {
    return this.attendanceRecords.filter(record => record.status === 'pending').length;
  }

  getTotalApprovedRecords(): number {
    return this.attendanceRecords.filter(record => record.status === 'approved').length;
  }

  getTotalRejectedRecords(): number {
    return this.attendanceRecords.filter(record => record.status === 'rejected').length;
  }
}

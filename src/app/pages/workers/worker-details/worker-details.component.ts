import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { WorkerService } from '../../../services/worker.service';
import { Worker, WorkerTypeLabels, WorkerStatusLabels } from '../../../models/worker.model';

interface WorkerDocument {
  id: string;
  title: string;
  documentName: string;
  description: string;
  uploadedDate: Date;
  fileSize?: string;
  fileType?: string;
}

interface WorkerInterview {
  id: string;
  sponsorName: string;
  interviewDate: Date;
  interviewTime: string;
  location: string;
  status: 'scheduled' | 'completed' | 'selected' | 'rejected';
  notes?: string;
  workDescription?: string;
}

@Component({
  selector: 'app-worker-details',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './worker-details.component.html',
  styleUrl: './worker-details.component.css'
})
export class WorkerDetailsComponent implements OnInit {
  worker: Worker | undefined;
  showEditModal = false;
  activeTab: string = 'overview';
  workerActiveStatus: 'active' | 'inactive' = 'active';
  
  // Edit form data
  editFormData: any = {};
  
  // Documents
  showDocumentModal = false;
  isEditingDocument = false;
  documents: WorkerDocument[] = [];
  documentFormData: WorkerDocument = {
    id: '',
    title: '',
    documentName: '',
    description: '',
    uploadedDate: new Date()
  };
  selectedDocument: WorkerDocument | null = null;
  selectedFile: File | null = null;
  selectedFileName: string = '';

  // Interviews
  showScheduleInterviewModal = false;
  showInterviewDetailsModal = false;
  interviews: WorkerInterview[] = [];
  selectedInterview: WorkerInterview | null = null;
  interviewFormData: WorkerInterview = {
    id: '',
    sponsorName: '',
    interviewDate: new Date(),
    interviewTime: '',
    location: '',
    status: 'scheduled',
    notes: '',
    workDescription: ''
  };

  constructor(
    private workerService: WorkerService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.loadWorker(params['id']);
        this.loadDocuments();
        this.loadInterviews();
      }
    });
  }

  loadInterviews(): void {
    // Load sample interview data
    this.interviews = [
      {
        id: '1',
        sponsorName: 'Ahmed Al Maktoum',
        interviewDate: new Date('2024-03-15'),
        interviewTime: '10:00 AM',
        location: 'Dubai Marina Office',
        status: 'selected',
        notes: 'Great interview, sponsor was very impressed',
        workDescription: 'Full-time housemaid position\n- General cleaning and housekeeping\n- Meal preparation (3 meals daily)\n- Laundry and ironing\n- Light childcare assistance\n- 6 days work per week\n- Private room provided'
      },
      {
        id: '2',
        sponsorName: 'Sarah Johnson',
        interviewDate: new Date('2024-03-10'),
        interviewTime: '2:30 PM',
        location: 'Jumeirah Lakes Towers',
        status: 'rejected',
        notes: 'Sponsor looking for someone with more experience',
        workDescription: 'Housemaid with cooking expertise\n- Advanced cooking skills required\n- International cuisine experience preferred\n- Household management'
      },
      {
        id: '3',
        sponsorName: 'Mohammed Hassan',
        interviewDate: new Date('2024-03-20'),
        interviewTime: '11:00 AM',
        location: 'Business Bay',
        status: 'scheduled',
        notes: 'First interview scheduled',
        workDescription: 'Live-in housemaid\n- Complete household maintenance\n- Cooking for family of 4\n- Childcare for 2 children (ages 5 and 8)\n- Weekly day off\n- Accommodation and meals provided'
      }
    ];
  }

  loadDocuments(): void {
    // Load default documents for the worker
    this.documents = [
      {
        id: '1',
        title: 'Passport Copy',
        documentName: 'passport_copy.pdf',
        description: 'Copy of worker passport',
        uploadedDate: new Date('2024-01-15'),
        fileSize: '2.5 MB',
        fileType: 'PDF'
      },
      {
        id: '2',
        title: 'Visa Document',
        documentName: 'visa_document.pdf',
        description: 'UAE work visa document',
        uploadedDate: new Date('2024-02-01'),
        fileSize: '1.8 MB',
        fileType: 'PDF'
      },
      {
        id: '3',
        title: 'Medical Certificate',
        documentName: 'medical_certificate.pdf',
        description: 'Medical fitness certificate',
        uploadedDate: new Date('2024-02-10'),
        fileSize: '890 KB',
        fileType: 'PDF'
      },
      {
        id: '4',
        title: 'Contract Agreement',
        documentName: 'contract_agreement.pdf',
        description: 'Employment contract signed by worker',
        uploadedDate: new Date('2024-02-20'),
        fileSize: '3.2 MB',
        fileType: 'PDF'
      }
    ];
  }

  loadWorker(id: string): void {
    this.worker = this.workerService.getWorkerById(id);
    if (!this.worker) {
      this.router.navigate(['/workers']);
    } else {
      // Initialize worker active status (you can store this in the worker model later)
      this.workerActiveStatus = 'active';
    }
  }

  toggleWorkerStatus(): void {
    if (this.worker) {
      const statusText = this.workerActiveStatus === 'active' ? 'activated' : 'deactivated';
      console.log(`Worker ${this.worker.fullName} has been ${statusText}`);
      // Here you can update the worker status in the service/backend
      // this.workerService.updateWorkerStatus(this.worker.id, this.workerActiveStatus);
      
      // Show confirmation
      alert(`Worker has been ${statusText} successfully!`);
    }
  }

  switchTab(tab: string): void {
    this.activeTab = tab;
  }

  openEditModal(): void {
    if (this.worker) {
      // Auto-populate form with worker data
      this.editFormData = {
        fullName: this.worker.fullName,
        dateOfBirth: this.worker.dateOfBirth,
        gender: this.worker.gender,
        nationality: this.worker.nationality,
        maritalStatus: this.worker.maritalStatus,
        religion: this.worker.religion,
        passportNumber: this.worker.passportNumber,
        passportExpiryDate: this.worker.passportExpiryDate,
        workerType: this.worker.workerType,
        experience: this.worker.experience,
        notes: this.worker.notes
      };
      this.showEditModal = true;
    }
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.editFormData = {};
  }

  saveWorkerChanges(): void {
    if (this.worker) {
      // Update worker with form data
      Object.assign(this.worker, this.editFormData);
      // In real implementation, call service to update backend
      // this.workerService.updateWorker(this.worker.id, this.editFormData);
      
      this.closeEditModal();
      alert('Worker updated successfully!');
    }
  }

  navigateBack(): void {
    this.router.navigate(['/workers']);
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

  // Document Management Methods
  openAddDocumentModal(): void {
    this.isEditingDocument = false;
    this.documentFormData = {
      id: '',
      title: '',
      documentName: '',
      description: '',
      uploadedDate: new Date()
    };
    this.selectedFile = null;
    this.selectedFileName = '';
    this.showDocumentModal = true;
  }

  openEditDocumentModal(document: WorkerDocument): void {
    this.isEditingDocument = true;
    this.selectedDocument = document;
    this.documentFormData = { ...document };
    this.selectedFileName = document.documentName;
    this.showDocumentModal = true;
  }

  closeDocumentModal(): void {
    this.showDocumentModal = false;
    this.isEditingDocument = false;
    this.selectedDocument = null;
    this.selectedFile = null;
    this.selectedFileName = '';
    this.documentFormData = {
      id: '',
      title: '',
      documentName: '',
      description: '',
      uploadedDate: new Date()
    };
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      // Check file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (file.size > maxSize) {
        alert('File size exceeds 10MB. Please select a smaller file.');
        return;
      }

      this.selectedFile = file;
      this.selectedFileName = file.name;
      this.documentFormData.documentName = file.name;

      // Get file type
      const extension = file.name.split('.').pop()?.toUpperCase() || 'FILE';
      this.documentFormData.fileType = extension;

      // Get file size in readable format
      const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
      this.documentFormData.fileSize = `${sizeInMB} MB`;
    }
  }

  removeSelectedFile(): void {
    this.selectedFile = null;
    this.selectedFileName = '';
    this.documentFormData.documentName = '';
    this.documentFormData.fileType = undefined;
    this.documentFormData.fileSize = undefined;
  }

  saveDocument(): void {
    if (!this.selectedFileName) {
      alert('Please select a file to upload');
      return;
    }

    if (this.isEditingDocument && this.selectedDocument) {
      // Update existing document
      const index = this.documents.findIndex(d => d.id === this.selectedDocument!.id);
      if (index !== -1) {
        this.documents[index] = {
          ...this.documentFormData,
          id: this.selectedDocument.id,
          uploadedDate: this.selectedDocument.uploadedDate,
          documentName: this.selectedFileName
        };
      }
    } else {
      // Add new document
      const newDocument: WorkerDocument = {
        ...this.documentFormData,
        id: Date.now().toString(),
        documentName: this.selectedFileName,
        uploadedDate: new Date(),
        fileSize: this.documentFormData.fileSize || '1.5 MB',
        fileType: this.documentFormData.fileType || 'PDF'
      };
      this.documents.push(newDocument);
    }

    // In real implementation, you would upload the file to server here
    // Example: this.uploadFileToServer(this.selectedFile);
    
    this.closeDocumentModal();
  }

  deleteDocument(document: WorkerDocument): void {
    if (confirm(`Are you sure you want to delete "${document.title}"?`)) {
      this.documents = this.documents.filter(d => d.id !== document.id);
    }
  }

  downloadDocument(document: WorkerDocument): void {
    // Implement download logic here
    alert(`Downloading ${document.documentName}...`);
  }

  // Interview Management Methods
  openScheduleInterviewModal(): void {
    this.interviewFormData = {
      id: '',
      sponsorName: '',
      interviewDate: new Date(),
      interviewTime: '',
      location: '',
      status: 'scheduled',
      notes: ''
    };
    this.showScheduleInterviewModal = true;
  }

  closeScheduleInterviewModal(): void {
    this.showScheduleInterviewModal = false;
    this.interviewFormData = {
      id: '',
      sponsorName: '',
      interviewDate: new Date(),
      interviewTime: '',
      location: '',
      status: 'scheduled',
      notes: ''
    };
  }

  scheduleInterview(): void {
    if (!this.interviewFormData.sponsorName || !this.interviewFormData.interviewDate || 
        !this.interviewFormData.interviewTime || !this.interviewFormData.location) {
      alert('Please fill in all required fields');
      return;
    }

    const newInterview: WorkerInterview = {
      ...this.interviewFormData,
      id: Date.now().toString(),
      status: 'scheduled'
    };

    this.interviews.unshift(newInterview);
    this.closeScheduleInterviewModal();
  }

  updateInterviewStatus(interview: WorkerInterview, status: 'selected' | 'rejected'): void {
    const index = this.interviews.findIndex(i => i.id === interview.id);
    if (index !== -1) {
      this.interviews[index].status = status;
    }
  }

  viewInterviewDetails(interview: WorkerInterview): void {
    this.selectedInterview = interview;
    this.showInterviewDetailsModal = true;
  }

  closeInterviewDetailsModal(): void {
    this.showInterviewDetailsModal = false;
    this.selectedInterview = null;
  }
}




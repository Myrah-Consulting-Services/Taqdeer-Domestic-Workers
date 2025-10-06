import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkerService } from '../../services/worker.service';
import { Worker } from '../../models/worker.model';

@Component({
  selector: 'app-settings',
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit {
  // Auto-fetch settings
  autoFetchEnabled = false;
  fetchInterval = 30; // minutes
  fetchSources = {
    email: true,
    whatsapp: true,
    website: true
  };

  // Email settings
  emailSettings = {
    imapServer: '',
    imapPort: 993,
    username: '',
    password: '',
    folder: 'INBOX',
    sslEnabled: true
  };

  // WhatsApp settings
  whatsappSettings = {
    apiKey: '',
    webhookUrl: '',
    phoneNumber: '',
    businessAccountId: ''
  };

  // Website settings
  websiteSettings = {
    apiEndpoint: '',
    apiKey: '',
    fetchUrl: '',
    headers: {}
  };

  // Data processing settings
  processingSettings = {
    autoCreateWorkers: true,
    duplicateCheck: true,
    dataValidation: true,
    notificationEnabled: true
  };

  // Recent fetched data
  recentFetchedData: any[] = [];
  isFetching = false;
  lastFetchTime: Date | null = null;

  constructor(private workerService: WorkerService) {}

  ngOnInit() {
    this.loadSettings();
    this.loadRecentData();
  }

  private loadSettings() {
    // Load settings from localStorage or API
    const savedSettings = localStorage.getItem('autoFetchSettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      this.autoFetchEnabled = settings.autoFetchEnabled || false;
      this.fetchInterval = settings.fetchInterval || 30;
      this.fetchSources = settings.fetchSources || this.fetchSources;
      this.emailSettings = settings.emailSettings || this.emailSettings;
      this.whatsappSettings = settings.whatsappSettings || this.whatsappSettings;
      this.websiteSettings = settings.websiteSettings || this.websiteSettings;
      this.processingSettings = settings.processingSettings || this.processingSettings;
    }
  }

  private saveSettings() {
    const settings = {
      autoFetchEnabled: this.autoFetchEnabled,
      fetchInterval: this.fetchInterval,
      fetchSources: this.fetchSources,
      emailSettings: this.emailSettings,
      whatsappSettings: this.whatsappSettings,
      websiteSettings: this.websiteSettings,
      processingSettings: this.processingSettings
    };
    localStorage.setItem('autoFetchSettings', JSON.stringify(settings));
  }

  private loadRecentData() {
    const recentData = localStorage.getItem('recentFetchedData');
    if (recentData) {
      this.recentFetchedData = JSON.parse(recentData);
    }
  }

  toggleAutoFetch() {
    this.autoFetchEnabled = !this.autoFetchEnabled;
    this.saveSettings();
    
    if (this.autoFetchEnabled) {
      this.startAutoFetch();
    } else {
      this.stopAutoFetch();
    }
  }

  private startAutoFetch() {
    // Start interval for auto-fetching
    setInterval(() => {
      if (this.autoFetchEnabled) {
        this.fetchDataFromAllSources();
      }
    }, this.fetchInterval * 60 * 1000); // Convert minutes to milliseconds
  }

  private stopAutoFetch() {
    // Stop auto-fetching logic
    console.log('Auto-fetch stopped');
  }

  async fetchDataFromAllSources() {
    if (this.isFetching) return;
    
    this.isFetching = true;
    this.lastFetchTime = new Date();

    try {
      const fetchedData = [];

      // Fetch from email
      if (this.fetchSources.email) {
        const emailData = await this.fetchFromEmail();
        fetchedData.push(...emailData);
      }

      // Fetch from WhatsApp
      if (this.fetchSources.whatsapp) {
        const whatsappData = await this.fetchFromWhatsApp();
        fetchedData.push(...whatsappData);
      }

      // Fetch from website
      if (this.fetchSources.website) {
        const websiteData = await this.fetchFromWebsite();
        fetchedData.push(...websiteData);
      }

      // Process and save data
      await this.processFetchedData(fetchedData);
      
      // Update recent data
      this.recentFetchedData = fetchedData.slice(0, 10); // Keep last 10 items
      localStorage.setItem('recentFetchedData', JSON.stringify(this.recentFetchedData));

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      this.isFetching = false;
    }
  }

  private async fetchFromEmail(): Promise<any[]> {
    // Simulate email fetching
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            source: 'email',
            data: {
              subject: 'New Worker Application',
              from: 'applicant@example.com',
              content: 'Worker details: Name, Phone, Skills',
              timestamp: new Date()
            }
          }
        ]);
      }, 1000);
    });
  }

  private async fetchFromWhatsApp(): Promise<any[]> {
    // Simulate WhatsApp fetching
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            source: 'whatsapp',
            data: {
              message: 'New worker inquiry',
              from: '+1234567890',
              content: 'Worker information via WhatsApp',
              timestamp: new Date()
            }
          }
        ]);
      }, 1000);
    });
  }

  private async fetchFromWebsite(): Promise<any[]> {
    // Simulate website fetching
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            source: 'website',
            data: {
              form: 'Worker Registration Form',
              fields: {
                name: 'John Doe',
                phone: '+1234567890',
                skills: 'Housekeeping, Cooking'
              },
              timestamp: new Date()
            }
          }
        ]);
      }, 1000);
    });
  }

  private async processFetchedData(data: any[]) {
    for (const item of data) {
      if (this.processingSettings.autoCreateWorkers) {
        // Extract worker information and create worker record
        const workerData = this.extractWorkerData(item);
        if (workerData) {
          try {
            await this.workerService.addWorker(workerData);
            console.log('Worker created from fetched data:', workerData);
          } catch (error) {
            console.error('Error creating worker:', error);
          }
        }
      }
    }
  }

  private extractWorkerData(item: any): any | null {
    // Extract worker data based on source
    switch (item.source) {
      case 'email':
        return this.extractFromEmail(item.data);
      case 'whatsapp':
        return this.extractFromWhatsApp(item.data);
      case 'website':
        return this.extractFromWebsite(item.data);
      default:
        return null;
    }
  }

  private extractFromEmail(data: any): any | null {
    // Extract worker data from email content
    // This would use NLP or regex to extract structured data
    return {
      fullName: 'Extracted from Email',
      dateOfBirth: new Date('1990-01-01'),
      nationality: 'Ethiopia',
      gender: 'female',
      maritalStatus: 'single',
      passportNumber: 'TEMP123456',
      passportIssueDate: new Date(),
      passportExpiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      visaType: 'visit',
      workerType: 'housemaid',
      experience: 1,
      languages: ['English'],
      skills: ['General'],
      agentId: '1',
      notes: 'Source: Email'
    };
  }

  private extractFromWhatsApp(data: any): any | null {
    // Extract worker data from WhatsApp message
    return {
      fullName: 'Extracted from WhatsApp',
      dateOfBirth: new Date('1990-01-01'),
      nationality: 'Ethiopia',
      gender: 'female',
      maritalStatus: 'single',
      passportNumber: 'TEMP123456',
      passportIssueDate: new Date(),
      passportExpiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      visaType: 'visit',
      workerType: 'housemaid',
      experience: 1,
      languages: ['English'],
      skills: ['General'],
      agentId: '1',
      notes: `Source: WhatsApp - ${data.from}`
    };
  }

  private extractFromWebsite(data: any): any | null {
    // Extract worker data from website form
    return {
      fullName: data.fields.name,
      dateOfBirth: new Date('1990-01-01'),
      nationality: 'Ethiopia',
      gender: 'female',
      maritalStatus: 'single',
      passportNumber: 'TEMP123456',
      passportIssueDate: new Date(),
      passportExpiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      visaType: 'visit',
      workerType: 'housemaid',
      experience: 1,
      languages: ['English'],
      skills: data.fields.skills ? data.fields.skills.split(',').map((s: string) => s.trim()) : ['General'],
      agentId: '1',
      notes: 'Source: Website'
    };
  }

  onSettingsChange() {
    this.saveSettings();
  }

  testConnection(source: string) {
    console.log(`Testing ${source} connection...`);
    // Implement connection testing logic
  }

  manualFetch() {
    this.fetchDataFromAllSources();
  }

  clearRecentData() {
    this.recentFetchedData = [];
    localStorage.removeItem('recentFetchedData');
  }
}

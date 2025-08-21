export interface SystemMetrics {
  totalUsers: number;
  verifiedUsers: number;
  pendingVerifications: number;
  totalDomains: number;
  activeDomains: number;
  totalJobs: number;
  totalApplications: number;
  systemUptime: string;
}

export const mockSystemMetrics: SystemMetrics = {
  totalUsers: 12547,
  verifiedUsers: 8234,
  pendingVerifications: 45,
  totalDomains: 11890,
  activeDomains: 10234,
  totalJobs: 1567,
  totalApplications: 23456,
  systemUptime: '99.9%'
};

export interface SystemAlert {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: string;
  acknowledged: boolean;
}

export const mockSystemAlerts: SystemAlert[] = [
  {
    id: 'alert_1',
    type: 'warning',
    title: 'Pending Verifications',
    message: '45 verification requests require immediate attention',
    timestamp: '2024-01-16T10:30:00Z',
    acknowledged: false
  },
  {
    id: 'alert_2',
    type: 'success',
    title: 'Monthly Report Generated',
    message: 'January 2024 compliance report has been generated successfully',
    timestamp: '2024-01-15T09:00:00Z',
    acknowledged: true
  },
  {
    id: 'alert_3',
    type: 'info',
    title: 'System Maintenance',
    message: 'Scheduled maintenance window: Sunday 2 AM - 4 AM EAT',
    timestamp: '2024-01-14T16:45:00Z',
    acknowledged: false
  },
  {
    id: 'alert_4',
    type: 'error',
    title: 'NHIF Integration Issue',
    message: 'NHIF verification service is currently experiencing connectivity issues',
    timestamp: '2024-01-14T14:20:00Z',
    acknowledged: false
  }
];

export interface ComplianceReport {
  id: string;
  title: string;
  period: string;
  generatedAt: string;
  status: 'completed' | 'generating' | 'failed';
  fileSize: string;
  downloadUrl?: string;
}

export const mockComplianceReports: ComplianceReport[] = [
  {
    id: 'report_1',
    title: 'January 2024 User Verification Report',
    period: 'January 2024',
    generatedAt: '2024-01-15T09:00:00Z',
    status: 'completed',
    fileSize: '2.4 MB',
    downloadUrl: '/reports/jan-2024-verification.pdf'
  },
  {
    id: 'report_2',
    title: 'Q4 2023 System Analytics',
    period: 'Q4 2023',
    generatedAt: '2024-01-01T10:30:00Z',
    status: 'completed',
    fileSize: '5.1 MB',
    downloadUrl: '/reports/q4-2023-analytics.pdf'
  },
  {
    id: 'report_3',
    title: 'December 2023 Domain Registration Report',
    period: 'December 2023',
    generatedAt: '2024-01-16T11:15:00Z',
    status: 'generating',
    fileSize: 'Generating...'
  }
];
export interface Certificate {
  id: string;
  studentName: string;
  studentId: string;
  course: string;
  degree: string;
  graduationDate: string;
  issuedAt: string;
  verificationCode: string;
  status: 'issued' | 'pending' | 'revoked';
  gpa?: string;
}

export const mockCertificates: Certificate[] = [
  {
    id: 'cert_1',
    studentName: 'John Doe',
    studentId: 'UON/2020/12345',
    course: 'Computer Science',
    degree: 'Bachelor of Science',
    graduationDate: '2024-01-15',
    issuedAt: '2024-01-16T10:00:00Z',
    verificationCode: 'UON-CS-2024-001',
    status: 'issued',
    gpa: '3.8'
  },
  {
    id: 'cert_2',
    studentName: 'Jane Smith',
    studentId: 'UON/2021/67890',
    course: 'Engineering',
    degree: 'Diploma',
    graduationDate: '2024-01-14',
    issuedAt: '2024-01-15T14:30:00Z',
    verificationCode: 'UON-ENG-2024-002',
    status: 'issued',
    gpa: '3.6'
  },
  {
    id: 'cert_3',
    studentName: 'Michael Johnson',
    studentId: 'UON/2022/11111',
    course: 'Business Administration',
    degree: 'Master of Business Administration',
    graduationDate: '2024-01-13',
    issuedAt: '2024-01-14T09:15:00Z',
    verificationCode: 'UON-MBA-2024-003',
    status: 'pending'
  }
];

export interface Student {
  id: string;
  fullName: string;
  studentId: string;
  email: string;
  phone: string;
  course: string;
  year: number;
  status: 'active' | 'graduated' | 'suspended';
  enrollmentDate: string;
  expectedGraduation: string;
}

export const mockStudents: Student[] = [
  {
    id: 'student_1',
    fullName: 'Alice Wanjiku',
    studentId: 'UON/2021/22222',
    email: 'alice.wanjiku@students.uonbi.ac.ke',
    phone: '+254712345678',
    course: 'Computer Science',
    year: 3,
    status: 'active',
    enrollmentDate: '2021-09-01',
    expectedGraduation: '2025-06-30'
  },
  {
    id: 'student_2',
    fullName: 'David Kimani',
    studentId: 'UON/2020/33333',
    email: 'david.kimani@students.uonbi.ac.ke',
    phone: '+254723456789',
    course: 'Engineering',
    year: 4,
    status: 'active',
    enrollmentDate: '2020-09-01',
    expectedGraduation: '2024-06-30'
  },
  {
    id: 'student_3',
    fullName: 'Grace Muthoni',
    studentId: 'UON/2022/44444',
    email: 'grace.muthoni@students.uonbi.ac.ke',
    phone: '+254734567890',
    course: 'Business Administration',
    year: 2,
    status: 'active',
    enrollmentDate: '2022-09-01',
    expectedGraduation: '2026-06-30'
  }
];

export interface VerificationRequest {
  id: string;
  requesterName: string;
  requesterEmail: string;
  requesterOrganization: string;
  certificateId: string;
  studentName: string;
  verificationCode: string;
  requestedAt: string;
  status: 'pending' | 'verified' | 'rejected';
  purpose: string;
}

export const mockVerificationRequests: VerificationRequest[] = [
  {
    id: 'verify_1',
    requesterName: 'HR Manager',
    requesterEmail: 'hr@safaricom.co.ke',
    requesterOrganization: 'Safaricom PLC',
    certificateId: 'cert_1',
    studentName: 'John Doe',
    verificationCode: 'UON-CS-2024-001',
    requestedAt: '2024-01-16T08:30:00Z',
    status: 'pending',
    purpose: 'Employment verification'
  },
  {
    id: 'verify_2',
    requesterName: 'Admissions Officer',
    requesterEmail: 'admissions@strathmore.edu',
    requesterOrganization: 'Strathmore University',
    certificateId: 'cert_2',
    studentName: 'Jane Smith',
    verificationCode: 'UON-ENG-2024-002',
    requestedAt: '2024-01-15T11:20:00Z',
    status: 'verified',
    purpose: 'Graduate school application'
  }
];
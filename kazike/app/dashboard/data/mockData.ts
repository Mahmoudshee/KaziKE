export const mockJobs = [
    {
      id: '1',
      title: 'Senior Software Engineer',
      company: 'TechCorp Kenya',
      location: 'Nairobi',
      salary: 'KSh 150,000 - 200,000',
      applications: 24,
      status: 'Active',
      postedDate: '2024-01-15',
      type: 'Full-time'
    },
    {
      id: '2', 
      title: 'Marketing Manager',
      company: 'Digital Solutions Ltd',
      location: 'Mombasa',
      salary: 'KSh 80,000 - 120,000',
      applications: 12,
      status: 'Active',
      postedDate: '2024-01-10',
      type: 'Full-time'
    },
    {
      id: '3',
      title: 'Data Analyst',
      company: 'Analytics Pro',
      location: 'Kisumu',
      salary: 'KSh 60,000 - 90,000',
      applications: 8,
      status: 'Closed',
      postedDate: '2024-01-05',
      type: 'Contract'
    }
  ];
  
  export const mockCandidates = [
    {
      id: '1',
      name: 'John Kamau',
      title: 'Software Engineer',
      experience: '5 years',
      education: 'BSc Computer Science - University of Nairobi',
      skills: ['React', 'Node.js', 'Python'],
      eduIdVerified: true,
      location: 'Nairobi',
      appliedFor: 'Senior Software Engineer'
    },
    {
      id: '2',
      name: 'Mary Wanjiku',
      title: 'Marketing Specialist', 
      experience: '3 years',
      education: 'BA Marketing - Kenyatta University',
      skills: ['Digital Marketing', 'SEO', 'Content Creation'],
      eduIdVerified: true,
      location: 'Nairobi',
      appliedFor: 'Marketing Manager'
    },
    {
      id: '3',
      name: 'Peter Ochieng',
      title: 'Data Scientist',
      experience: '4 years', 
      education: 'MSc Statistics - University of Nairobi',
      skills: ['Python', 'R', 'Machine Learning'],
      eduIdVerified: false,
      location: 'Kisumu',
      appliedFor: 'Data Analyst'
    }
  ];
  
  export const mockStats = {
    totalJobs: 15,
    activeJobs: 8,
    totalApplications: 156,
    shortlistedCandidates: 23
  };
  
  export const mockActivity = [
    {
      id: '1',
      type: 'application',
      message: 'New application for Senior Software Engineer',
      time: '2 hours ago'
    },
    {
      id: '2',
      type: 'job',
      message: 'Marketing Manager job posted successfully',
      time: '1 day ago'
    },
    {
      id: '3',
      type: 'candidate',
      message: 'John Kamau profile viewed',
      time: '2 days ago'
    }
  ];
  
  export const mockCompany = {
    name: 'TechCorp Kenya',
    domain: 'techcorp.ke',
    email: 'hr@techcorp.ke',
    phone: '+254 700 123 456',
    location: 'Nairobi, Kenya',
    verified: true,
    registrationDate: '2024-01-01'
  };
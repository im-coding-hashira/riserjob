
import { Job, User } from './types';

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'user@example.com',
    name: 'Test User',
    savedJobs: ['1', '3']
  },
  {
    id: '2',
    email: 'admin@example.com',
    name: 'Admin User',
    savedJobs: ['2']
  }
];

export const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Frontend Developer',
    company: 'TechCorp Inc.',
    location: 'San Francisco, CA',
    salary_min: 90000,
    salary_max: 130000,
    job_type: 'Full-time',
    experience_level: 'Mid',
    remote: true,
    description: 'We are looking for a skilled Frontend Developer to join our team. The ideal candidate should have experience with React, TypeScript, and modern CSS frameworks.',
    posted_at: '2023-04-15T10:00:00Z',
    source: 'LinkedIn'
  },
  {
    id: '2',
    title: 'Backend Engineer',
    company: 'DataFlow Systems',
    location: 'New York, NY',
    salary_min: 110000,
    salary_max: 150000,
    job_type: 'Full-time',
    experience_level: 'Senior',
    remote: false,
    description: 'DataFlow Systems is seeking an experienced Backend Engineer to develop and maintain our core API services. Strong knowledge of Node.js and PostgreSQL is required.',
    posted_at: '2023-04-10T14:30:00Z',
    source: 'Indeed'
  },
  {
    id: '3',
    title: 'UX/UI Designer',
    company: 'Creative Solutions',
    location: 'Seattle, WA',
    salary_min: 85000,
    salary_max: 115000,
    job_type: 'Full-time',
    experience_level: 'Mid',
    remote: true,
    description: 'Creative Solutions is looking for a talented UX/UI Designer to create amazing user experiences. You should have a portfolio demonstrating your design skills and user-centered approach.',
    posted_at: '2023-04-12T09:15:00Z',
    source: 'Glassdoor'
  },
  {
    id: '4',
    title: 'Data Scientist',
    company: 'Analytics Pro',
    location: 'Boston, MA',
    salary_min: 100000,
    salary_max: 140000,
    job_type: 'Full-time',
    experience_level: 'Senior',
    remote: true,
    description: 'Analytics Pro is seeking a Data Scientist to join our research team. The ideal candidate will have experience with machine learning, statistical analysis, and big data technologies.',
    posted_at: '2023-04-08T11:45:00Z',
    source: 'LinkedIn'
  },
  {
    id: '5',
    title: 'DevOps Engineer',
    company: 'CloudTech Solutions',
    location: 'Austin, TX',
    salary_min: 95000,
    salary_max: 135000,
    job_type: 'Full-time',
    experience_level: 'Mid',
    remote: false,
    description: 'CloudTech Solutions is looking for a DevOps Engineer to help us build and maintain our cloud infrastructure. Experience with AWS, Docker, and CI/CD pipelines is essential.',
    posted_at: '2023-04-05T13:20:00Z',
    source: 'Indeed'
  },
  {
    id: '6',
    title: 'Product Manager',
    company: 'InnovateTech',
    location: 'Chicago, IL',
    salary_min: 105000,
    salary_max: 145000,
    job_type: 'Full-time',
    experience_level: 'Senior',
    remote: true,
    description: 'InnovateTech is seeking an experienced Product Manager to lead our product development efforts. You will work closely with engineering, design, and marketing teams to build successful products.',
    posted_at: '2023-04-03T10:10:00Z',
    source: 'Glassdoor'
  },
  {
    id: '7',
    title: 'Mobile Developer (iOS)',
    company: 'AppGenius',
    location: 'Los Angeles, CA',
    salary_min: 95000,
    salary_max: 140000,
    job_type: 'Full-time',
    experience_level: 'Mid',
    remote: false,
    description: 'AppGenius is looking for an iOS Developer to join our mobile team. Experience with Swift, UIKit, and iOS app lifecycle is required.',
    posted_at: '2023-04-01T09:30:00Z',
    source: 'LinkedIn'
  },
  {
    id: '8',
    title: 'QA Engineer',
    company: 'Quality Systems',
    location: 'Denver, CO',
    salary_min: 80000,
    salary_max: 110000,
    job_type: 'Full-time',
    experience_level: 'Mid',
    remote: true,
    description: 'Quality Systems is seeking a QA Engineer to ensure the quality of our software products. Experience with automated testing frameworks and QA methodologies is required.',
    posted_at: '2023-03-30T14:15:00Z',
    source: 'Indeed'
  },
  {
    id: '9',
    title: 'Technical Writer',
    company: 'DocuTech',
    location: 'Portland, OR',
    salary_min: 75000,
    salary_max: 95000,
    job_type: 'Full-time',
    experience_level: 'Entry',
    remote: true,
    description: 'DocuTech is looking for a Technical Writer to create clear documentation for our software products. Strong writing skills and the ability to understand complex technical concepts are required.',
    posted_at: '2023-03-28T11:00:00Z',
    source: 'Glassdoor'
  },
  {
    id: '10',
    title: 'Marketing Specialist',
    company: 'Growth Hackers',
    location: 'Miami, FL',
    salary_min: 70000,
    salary_max: 90000,
    job_type: 'Full-time',
    experience_level: 'Entry',
    remote: false,
    description: 'Growth Hackers is seeking a Marketing Specialist to help grow our digital presence. Experience with digital marketing channels and analytics tools is preferred.',
    posted_at: '2023-03-25T10:45:00Z',
    source: 'LinkedIn'
  },
  {
    id: '11',
    title: 'Project Manager',
    company: 'Delivery Masters',
    location: 'Atlanta, GA',
    salary_min: 90000,
    salary_max: 120000,
    job_type: 'Full-time',
    experience_level: 'Mid',
    remote: true,
    description: 'Delivery Masters is looking for a Project Manager to oversee our software development projects. PMP certification and experience with Agile methodologies are preferred.',
    posted_at: '2023-03-23T09:20:00Z',
    source: 'Indeed'
  },
  {
    id: '12',
    title: 'Network Administrator',
    company: 'SecureNet',
    location: 'Dallas, TX',
    salary_min: 85000,
    salary_max: 115000,
    job_type: 'Full-time',
    experience_level: 'Mid',
    remote: false,
    description: 'SecureNet is seeking a Network Administrator to maintain and secure our IT infrastructure. Experience with Cisco networking equipment and network security protocols is required.',
    posted_at: '2023-03-20T13:30:00Z',
    source: 'Glassdoor'
  }
];

export const getUser = (id: string): User | undefined => {
  return mockUsers.find(user => user.id === id);
};

export const getJob = (id: string): Job | undefined => {
  return mockJobs.find(job => job.id === id);
};

export const getSavedJobs = (userId: string): Job[] => {
  const user = mockUsers.find(user => user.id === userId);
  if (!user || !user.savedJobs) return [];
  return mockJobs.filter(job => user.savedJobs?.includes(job.id));
};

export const toggleSaveJob = (userId: string, jobId: string): boolean => {
  const userIndex = mockUsers.findIndex(user => user.id === userId);
  if (userIndex === -1) return false;
  
  if (!mockUsers[userIndex].savedJobs) {
    mockUsers[userIndex].savedJobs = [];
  }
  
  const savedJobIndex = mockUsers[userIndex].savedJobs!.indexOf(jobId);
  
  if (savedJobIndex === -1) {
    mockUsers[userIndex].savedJobs!.push(jobId);
    return true;
  } else {
    mockUsers[userIndex].savedJobs!.splice(savedJobIndex, 1);
    return false;
  }
};

export const isJobSaved = (userId: string, jobId: string): boolean => {
  const user = mockUsers.find(user => user.id === userId);
  if (!user || !user.savedJobs) return false;
  return user.savedJobs.includes(jobId);
};

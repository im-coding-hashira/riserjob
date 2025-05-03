
export type User = {
  id: string;
  email: string;
  name: string;
  savedJobs?: string[];
};

export type JobType = 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
export type ExperienceLevel = 'Entry' | 'Mid' | 'Senior';

export type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  salary_min?: number;
  salary_max?: number;
  job_type: JobType;
  experience_level: ExperienceLevel;
  remote: boolean;
  description: string;
  posted_at: string;
  source: string;
};

export type SearchFilters = {
  keyword?: string;
  location?: string;
  salary_min?: number;
  salary_max?: number;
  job_type?: JobType[];
  experience_level?: ExperienceLevel[];
  remote?: boolean;
  company?: string[];
  date_posted?: string;
};

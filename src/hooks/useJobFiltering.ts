
import { useState, useEffect, useCallback } from 'react';
import { Job, SearchFilters } from '@/lib/types';

export const useJobFiltering = (jobs: Job[], initialFilters?: SearchFilters) => {
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(jobs);
  const [loading, setLoading] = useState(true);
  
  // Filter jobs based on criteria
  const filterJobs = useCallback((filters: SearchFilters) => {
    setLoading(true);
    
    let results = [...jobs];
    
    // Filter by keyword in title or company
    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase();
      results = results.filter(job => 
        job.title.toLowerCase().includes(keyword) || 
        job.company.toLowerCase().includes(keyword) ||
        job.description.toLowerCase().includes(keyword)
      );
    }
    
    // Filter by location
    if (filters.location) {
      const location = filters.location.toLowerCase();
      results = results.filter(job => job.location.toLowerCase().includes(location));
    }
    
    // Filter by job type
    if (filters.job_type && filters.job_type.length > 0) {
      results = results.filter(job => filters.job_type!.includes(job.job_type as any));
    }
    
    // Filter by experience level
    if (filters.experience_level && filters.experience_level.length > 0) {
      results = results.filter(job => filters.experience_level!.includes(job.experience_level as any));
    }
    
    // Filter by salary range
    if (filters.salary_min !== undefined) {
      results = results.filter(job => !job.salary_max || job.salary_max >= filters.salary_min!);
    }
    if (filters.salary_max !== undefined) {
      results = results.filter(job => !job.salary_min || job.salary_min <= filters.salary_max!);
    }
    
    // Filter by remote option
    if (filters.remote) {
      results = results.filter(job => job.remote);
    }
    
    setFilteredJobs(results);
    setLoading(false);
    return results;
  }, [jobs]);
  
  return {
    filteredJobs,
    loading,
    filterJobs
  };
};

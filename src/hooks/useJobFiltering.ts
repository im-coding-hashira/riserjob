
import { useState, useCallback, useEffect } from 'react';
import { Job, SearchFilters } from '@/lib/types';

export const useJobFiltering = (jobs: Job[]) => {
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(jobs);
  const [loading, setLoading] = useState(false);
  
  // Filter jobs based on criteria
  const filterJobs = useCallback((filters: SearchFilters) => {
    setLoading(true);
    console.log('Filtering jobs with criteria:', filters);
    console.log('Initial jobs to filter:', jobs.length);
    
    let results = [...jobs];
    
    // Filter by keyword in title, company or description
    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase();
      results = results.filter(job => 
        job.title.toLowerCase().includes(keyword) || 
        job.company.toLowerCase().includes(keyword) ||
        job.description.toLowerCase().includes(keyword)
      );
      console.log(`After keyword "${filters.keyword}" filter:`, results.length);
    }
    
    // Filter by location
    if (filters.location) {
      const location = filters.location.toLowerCase();
      results = results.filter(job => 
        job.location.toLowerCase().includes(location)
      );
      console.log(`After location "${filters.location}" filter:`, results.length);
    }
    
    // Filter by job type
    if (filters.job_type && filters.job_type.length > 0) {
      results = results.filter(job => filters.job_type!.includes(job.job_type));
      console.log('After job type filter:', results.length);
    }
    
    // Filter by experience level
    if (filters.experience_level && filters.experience_level.length > 0) {
      results = results.filter(job => filters.experience_level!.includes(job.experience_level));
      console.log('After experience level filter:', results.length);
    }
    
    // Filter by salary range
    if (filters.salary_min !== undefined) {
      results = results.filter(job => !job.salary_max || job.salary_max >= filters.salary_min!);
      console.log('After min salary filter:', results.length);
    }
    if (filters.salary_max !== undefined) {
      results = results.filter(job => !job.salary_min || job.salary_min <= filters.salary_max!);
      console.log('After max salary filter:', results.length);
    }
    
    // Filter by remote option
    if (filters.remote) {
      results = results.filter(job => job.remote);
      console.log('After remote filter:', results.length);
    }
    
    console.log('Final filtered jobs:', results.length);
    setFilteredJobs(results);
    setLoading(false);
    return results;
  }, [jobs]);

  // Update filtered jobs when job list changes
  useEffect(() => {
    console.log('Jobs list changed, updating filtered jobs');
    setFilteredJobs(jobs);
  }, [jobs]);
  
  return {
    filteredJobs,
    loading,
    filterJobs
  };
};

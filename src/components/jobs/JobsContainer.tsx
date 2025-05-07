
import React, { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { SearchFilters } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';
import JobListings from '@/components/jobs/JobListings';
import { useJobsData } from '@/hooks/useJobsData';
import { useJobFiltering } from '@/hooks/useJobFiltering';
import { usePagination } from '@/hooks/usePagination';
import { useSavedJobs } from '@/hooks/useSavedJobs';

interface JobsContainerProps {
  onOpenAuth: () => void;
}

const JobsContainer: React.FC<JobsContainerProps> = ({ onOpenAuth }) => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { user } = useAuth();
  
  const jobsPerPage = 5;
  const initialKeyword = searchParams.get('keyword') || '';
  const initialLocation = searchParams.get('location') || '';
  
  // Get jobs data
  const { jobs, loading: jobsLoading } = useJobsData();
  
  // Filter jobs
  const { filteredJobs, filterJobs } = useJobFiltering(jobs);
  
  // Pagination
  const { 
    currentPage, 
    totalPages, 
    paginate, 
    indexOfFirstItem, 
    indexOfLastItem 
  } = usePagination(filteredJobs.length, jobsPerPage);
  
  // Saved jobs
  const { savedJobs, toggleSaveJob } = useSavedJobs(user);
  
  // Get current jobs to display
  const currentJobs = filteredJobs.slice(indexOfFirstItem, indexOfLastItem);
  
  // Parse search filters from URL on component mount or when location.search changes
  useEffect(() => {
    const initialFilters: SearchFilters = {};
    
    if (initialKeyword) initialFilters.keyword = initialKeyword;
    if (initialLocation) initialFilters.location = initialLocation;
    
    filterJobs(initialFilters);
  }, [location.search, filterJobs]);
  
  const handleFilterChange = (filters: SearchFilters) => {
    filterJobs(filters);
  };
  
  const handleToggleSave = async (jobId: string) => {
    if (!user) {
      onOpenAuth();
      return;
    }
    
    await toggleSaveJob(jobId);
  };
  
  return (
    <JobListings
      jobs={currentJobs}
      loading={jobsLoading}
      savedJobs={savedJobs}
      onToggleSave={handleToggleSave}
      onFilterChange={handleFilterChange}
      initialFilters={{
        keyword: initialKeyword,
        location: initialLocation
      }}
      currentPage={currentPage}
      onPageChange={paginate}
      totalPages={totalPages}
      indexOfFirstJob={indexOfFirstItem}
      indexOfLastJob={indexOfLastItem}
      isLoggedIn={!!user}
      onLogin={onOpenAuth}
    />
  );
};

export default JobsContainer;

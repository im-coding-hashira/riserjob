
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
  
  console.log('Initial search params:', { keyword: initialKeyword, location: initialLocation });
  
  // Get jobs data
  const { jobs, loading: jobsLoading } = useJobsData();
  console.log('Jobs loaded from useJobsData:', jobs.length);
  
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
  console.log('Current jobs to display:', currentJobs.length);
  
  // Parse search filters from URL on component mount or when location.search changes
  useEffect(() => {
    const initialFilters: SearchFilters = {};
    
    if (initialKeyword) initialFilters.keyword = initialKeyword;
    if (initialLocation) initialFilters.location = initialLocation;
    
    console.log('Applying initial filters:', initialFilters);
    filterJobs(initialFilters);
  }, [location.search, filterJobs, initialKeyword, initialLocation]);
  
  const handleFilterChange = (filters: SearchFilters) => {
    console.log('Filter changed:', filters);
    filterJobs(filters);
  };
  
  const handleToggleSave = async (jobId: string) => {
    if (!user) {
      console.log('User not logged in, opening auth modal');
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

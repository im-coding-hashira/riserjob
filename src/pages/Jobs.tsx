
import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { mockJobs } from '@/lib/mockData';
import { Job, SearchFilters } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
import UserAuth from '@/components/UserAuth';
import JobsHeader from '@/components/jobs/JobsHeader';
import JobListings from '@/components/jobs/JobListings';

const Jobs = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(mockJobs);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;
  
  const initialKeyword = searchParams.get('keyword') || '';
  const initialLocation = searchParams.get('location') || '';
  
  // Process and filter jobs based on URL params and filters
  // Using useCallback to avoid recreating this function on every render
  const filterJobs = useCallback((filters: SearchFilters) => {
    setLoading(true);
    
    let results = [...mockJobs];
    
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
      results = results.filter(job => filters.job_type!.includes(job.job_type));
    }
    
    // Filter by experience level
    if (filters.experience_level && filters.experience_level.length > 0) {
      results = results.filter(job => filters.experience_level!.includes(job.experience_level));
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
    
    // Remove the setTimeout to prevent flickering and unnecessary delays
    setFilteredJobs(results);
    setCurrentPage(1);
    setLoading(false);
  }, []);
  
  // Parse search filters from URL on component mount or when location.search changes
  useEffect(() => {
    const initialFilters: SearchFilters = {};
    
    if (initialKeyword) initialFilters.keyword = initialKeyword;
    if (initialLocation) initialFilters.location = initialLocation;
    
    filterJobs(initialFilters);
  }, [location.search, filterJobs]); // Add filterJobs to dependencies since we're using useCallback
  
  const handleFilterChange = (filters: SearchFilters) => {
    filterJobs(filters);
  };
  
  const handleToggleSave = (jobId: string) => {
    if (savedJobs.includes(jobId)) {
      setSavedJobs(prev => prev.filter(id => id !== jobId));
      toast({
        title: "Job removed from saved jobs",
        description: "You can add it back anytime.",
      });
    } else {
      setSavedJobs(prev => [...prev, jobId]);
      toast({
        title: "Job saved successfully",
        description: "You can view all saved jobs in your profile.",
      });
    }
  };
  
  // Pagination
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  
  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar onLogin={() => setIsAuthModalOpen(true)} />
      
      <main className="flex-1 bg-gray-50">
        <JobsHeader />
        
        <JobListings
          jobs={currentJobs}
          loading={loading}
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
          indexOfFirstJob={indexOfFirstJob}
          indexOfLastJob={indexOfLastJob}
          isLoggedIn={!!user}
          onLogin={() => setIsAuthModalOpen(true)}
        />
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="container mx-auto px-4">
          <div className="text-center md:text-left">
            <p className="text-sm text-gray-600">© 2023 RiserJobs. All rights reserved.</p>
          </div>
        </div>
      </footer>
      
      <UserAuth 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
};

export default Jobs;


import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { Job, SearchFilters } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import JobListings from '@/components/jobs/JobListings';

interface JobsContainerProps {
  onOpenAuth: () => void;
}

const JobsContainer: React.FC<JobsContainerProps> = ({ onOpenAuth }) => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;
  
  const initialKeyword = searchParams.get('keyword') || '';
  const initialLocation = searchParams.get('location') || '';

  // Fetch jobs from Supabase
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .order('posted_at', { ascending: false }) as any;
          
        if (error) throw error;
        
        if (data) {
          setJobs(data as Job[]);
          setFilteredJobs(data as Job[]);
        }
      } catch (error: any) {
        console.error('Error fetching jobs:', error.message);
        toast({
          title: 'Error fetching jobs',
          description: 'Failed to load job listings. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobs();
  }, [toast]);
  
  // Fetch saved jobs if user is logged in
  useEffect(() => {
    const fetchSavedJobs = async () => {
      if (!user) {
        setSavedJobs([]);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('saved_jobs')
          .select('job_id')
          .eq('user_id', user.id) as any;
          
        if (error) throw error;
        
        if (data) {
          const savedJobIds = data.map((item: any) => item.job_id);
          setSavedJobs(savedJobIds);
        }
      } catch (error: any) {
        console.error('Error fetching saved jobs:', error.message);
      }
    };
    
    fetchSavedJobs();
  }, [user]);
  
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
    
    setFilteredJobs(results);
    setCurrentPage(1);
    setLoading(false);
  }, [jobs]);
  
  // Parse search filters from URL on component mount or when location.search changes
  useEffect(() => {
    const initialFilters: SearchFilters = {};
    
    if (initialKeyword) initialFilters.keyword = initialKeyword;
    if (initialLocation) initialFilters.location = initialLocation;
    
    filterJobs(initialFilters);
  }, [location.search, filterJobs, jobs]);
  
  const handleFilterChange = (filters: SearchFilters) => {
    filterJobs(filters);
  };
  
  const handleToggleSave = async (jobId: string) => {
    if (!user) {
      onOpenAuth();
      return;
    }
    
    try {
      if (savedJobs.includes(jobId)) {
        // Remove from saved jobs
        const { error } = await supabase
          .from('saved_jobs')
          .delete()
          .eq('user_id', user.id)
          .eq('job_id', jobId) as any;
          
        if (error) throw error;
        
        setSavedJobs(prev => prev.filter(id => id !== jobId));
        toast({
          title: "Job removed from saved jobs",
          description: "You can add it back anytime.",
        });
      } else {
        // Add to saved jobs
        const { error } = await supabase
          .from('saved_jobs')
          .insert({
            user_id: user.id,
            job_id: jobId
          }) as any;
          
        if (error) throw error;
        
        setSavedJobs(prev => [...prev, jobId]);
        toast({
          title: "Job saved successfully",
          description: "You can view all saved jobs in your profile.",
        });
      }
    } catch (error: any) {
      console.error('Error toggling saved job:', error.message);
      toast({
        title: "Error saving job",
        description: error.message,
        variant: 'destructive',
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
      onLogin={onOpenAuth}
    />
  );
};

export default JobsContainer;

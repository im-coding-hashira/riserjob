
import React, { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import SearchBar from '@/components/SearchBar';
import JobCard from '@/components/JobCard';
import JobFilters from '@/components/JobFilters';
import UserAuth from '@/components/UserAuth';
import { mockJobs } from '@/lib/mockData';
import { Job, SearchFilters } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

const Jobs = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(mockJobs);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;
  
  const initialKeyword = searchParams.get('keyword') || '';
  const initialLocation = searchParams.get('location') || '';
  
  // Process and filter jobs based on URL params and filters
  const filterJobs = (filters: SearchFilters) => {
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
    
    // Simulate API call delay
    setTimeout(() => {
      setFilteredJobs(results);
      setCurrentPage(1);
      setLoading(false);
    }, 500);
  };
  
  // Parse search filters from URL on component mount
  useEffect(() => {
    const initialFilters: SearchFilters = {};
    
    if (initialKeyword) initialFilters.keyword = initialKeyword;
    if (initialLocation) initialFilters.location = initialLocation;
    
    filterJobs(initialFilters);
  }, [location.search]);
  
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
  
  const handleLogin = (email: string, password: string) => {
    // Here you'd typically call your authentication API
    console.log('Login attempt with:', email, password);
    
    // Simulate successful login
    setIsLoggedIn(true);
    setIsAuthModalOpen(false);
    toast({
      title: 'Welcome back!',
      description: 'You have successfully logged in.',
    });
  };
  
  const handleSignup = (name: string, email: string, password: string) => {
    // Here you'd typically call your registration API
    console.log('Signup attempt with:', name, email, password);
    
    // Simulate successful registration
    setIsLoggedIn(true);
    setIsAuthModalOpen(false);
    toast({
      title: 'Account created!',
      description: 'Welcome to RiserJobs.',
    });
  };
  
  const handleLogout = () => {
    setIsLoggedIn(false);
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out.',
    });
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
      <Navbar 
        isLoggedIn={isLoggedIn} 
        onLogin={() => setIsAuthModalOpen(true)} 
        onLogout={handleLogout} 
      />
      
      <main className="flex-1 bg-gray-50">
        <div className="bg-riser-light-purple py-6">
          <div className="container mx-auto px-4">
            <h1 className="text-2xl md:text-3xl font-bold mb-6">Find Your Perfect Job</h1>
            <SearchBar />
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar Filters */}
            <div className="w-full md:w-1/4">
              <JobFilters 
                onFilterChange={handleFilterChange} 
                initialFilters={{
                  keyword: initialKeyword,
                  location: initialLocation
                }}
              />
            </div>
            
            {/* Job Listings */}
            <div className="w-full md:w-3/4">
              <div className="mb-4 flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  Showing {filteredJobs.length > 0 ? indexOfFirstJob + 1 : 0}-
                  {Math.min(indexOfLastJob, filteredJobs.length)} of {filteredJobs.length} jobs
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled>
                    Sort by: Relevance
                  </Button>
                </div>
              </div>
              
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-riser-purple"></div>
                </div>
              ) : filteredJobs.length > 0 ? (
                <div className="space-y-4">
                  {currentJobs.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      isSaved={savedJobs.includes(job.id)}
                      onToggleSave={handleToggleSave}
                      isLoggedIn={isLoggedIn}
                      onLogin={() => setIsAuthModalOpen(true)}
                    />
                  ))}
                  
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center mt-8">
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          onClick={() => paginate(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          Previous
                        </Button>
                        {Array.from({ length: totalPages }, (_, i) => (
                          <Button 
                            key={i + 1}
                            variant={currentPage === i + 1 ? "default" : "outline"}
                            onClick={() => paginate(i + 1)}
                            className={
                              currentPage === i + 1 
                                ? "bg-riser-purple hover:bg-riser-secondary-purple" 
                                : ""
                            }
                          >
                            {i + 1}
                          </Button>
                        ))}
                        <Button 
                          variant="outline" 
                          onClick={() => paginate(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white p-8 text-center rounded-lg border">
                  <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your search criteria or removing some filters.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => filterJobs({})}
                  >
                    Clear all filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
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
        onLogin={handleLogin}
        onSignup={handleSignup}
      />
    </div>
  );
};

export default Jobs;

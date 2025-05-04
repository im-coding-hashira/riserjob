
import React from 'react';
import JobCard from '@/components/JobCard';
import JobFilters from '@/components/JobFilters';
import { Job, SearchFilters } from '@/lib/types';
import { Button } from '@/components/ui/button';
import JobsPagination from '@/components/jobs/JobsPagination';

interface JobListingsProps {
  jobs: Job[];
  loading: boolean;
  savedJobs: string[];
  onToggleSave: (jobId: string) => void;
  onFilterChange: (filters: SearchFilters) => void;
  initialFilters: SearchFilters;
  currentPage: number;
  onPageChange: (page: number) => void;
  totalPages: number;
  indexOfFirstJob: number;
  indexOfLastJob: number;
  isLoggedIn: boolean;
  onLogin: () => void;
}

const JobListings: React.FC<JobListingsProps> = ({
  jobs,
  loading,
  savedJobs,
  onToggleSave,
  onFilterChange,
  initialFilters,
  currentPage,
  onPageChange,
  totalPages,
  indexOfFirstJob,
  indexOfLastJob,
  isLoggedIn,
  onLogin
}) => {
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Filters */}
        <div className="w-full md:w-1/4">
          <JobFilters 
            onFilterChange={onFilterChange} 
            initialFilters={initialFilters}
          />
        </div>
        
        {/* Job Listings */}
        <div className="w-full md:w-3/4">
          <div className="mb-4 flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Showing {jobs.length > 0 ? indexOfFirstJob + 1 : 0}-
              {Math.min(indexOfLastJob, jobs.length)} of {jobs.length} jobs
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
          ) : jobs.length > 0 ? (
            <div className="space-y-4">
              {jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  isSaved={savedJobs.includes(job.id)}
                  onToggleSave={onToggleSave}
                  isLoggedIn={isLoggedIn}
                  onLogin={onLogin}
                />
              ))}
              
              {/* Pagination */}
              {totalPages > 1 && (
                <JobsPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={onPageChange}
                />
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
                onClick={() => onFilterChange({})}
              >
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobListings;

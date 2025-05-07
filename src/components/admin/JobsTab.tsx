
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import AddJobForm from './AddJobForm';
import { Job } from '@/lib/types';
import JobSearch from './JobSearch';
import JobExport from './JobExport';
import JobsTable from './JobsTable';
import { useJobsAdmin } from '@/hooks/useJobsAdmin';

interface JobsTabProps {
  jobs: Job[];
  setJobs: React.Dispatch<React.SetStateAction<Job[]>>;
}

const JobsTab: React.FC<JobsTabProps> = ({ jobs: initialJobs, setJobs: setParentJobs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const {
    jobs,
    isLoading,
    editingJob,
    setEditingJob,
    fetchJobs,
    deleteJob,
    updateJob
  } = useJobsAdmin(initialJobs);

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    // Sync with parent state when our local state changes
    setParentJobs(jobs);
  }, [jobs, setParentJobs]);

  // Filter jobs based on search term
  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white p-6 rounded-lg border">
      <div className="flex justify-between mb-6">
        <JobSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <JobExport jobs={filteredJobs} />
      </div>
      
      <JobsTable 
        jobs={filteredJobs} 
        isLoading={isLoading} 
        onEdit={setEditingJob}
        onDelete={deleteJob}
      />
      
      {filteredJobs.length === 0 && !isLoading && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No jobs found matching your search.</p>
        </div>
      )}

      <Dialog open={editingJob !== null} onOpenChange={() => setEditingJob(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {editingJob && (
            <AddJobForm 
              initialData={editingJob}
              onJobAdded={updateJob} 
              onCancel={() => setEditingJob(null)} 
              isEditing
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JobsTab;

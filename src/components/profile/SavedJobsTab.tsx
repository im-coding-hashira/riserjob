
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Job } from '@/lib/types';
import JobCard from '@/components/JobCard';

const SavedJobsTab = () => {
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchSavedJobs = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Get all saved job IDs for the current user
        const { data: savedJobIds, error: savedJobsError } = await supabase
          .from('saved_jobs')
          .select('job_id')
          .eq('user_id', user.id);
          
        if (savedJobsError) throw savedJobsError;
        
        if (!savedJobIds || savedJobIds.length === 0) {
          setSavedJobs([]);
          setLoading(false);
          return;
        }
        
        // Get all job details based on saved job IDs
        const jobIds = savedJobIds.map((item: any) => item.job_id).filter(Boolean);
        
        if (jobIds.length === 0) {
          setSavedJobs([]);
          setLoading(false);
          return;
        }
        
        const { data: jobsData, error: jobsError } = await supabase
          .from('jobs')
          .select('*')
          .in('job_id', jobIds);
          
        if (jobsError) throw jobsError;
        
        if (jobsData) {
          // Map the database fields to our Job type
          const formattedJobs: Job[] = jobsData.map(job => ({
            id: job.job_id || '',
            title: job.title || '',
            company: job.company || '',
            location: job.location || '',
            job_type: job.job_type as any || 'Full-time',
            experience_level: 'Mid', // Default value since it might not exist in DB
            remote: job.is_remote || false,
            description: job.description || '',
            posted_at: new Date().toISOString(), // Using current date since posted_at doesn't exist in DB
            source: job.source_portal || '',
          }));
          
          setSavedJobs(formattedJobs);
        }
      } catch (error: any) {
        console.error('Error fetching saved jobs:', error.message);
        toast({
          title: 'Error fetching saved jobs',
          description: error.message,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchSavedJobs();
  }, [user, toast]);
  
  const handleUnsaveJob = async (jobId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('saved_jobs')
        .delete()
        .eq('user_id', user.id)
        .eq('job_id', jobId);
        
      if (error) throw error;
      
      // Update UI
      setSavedJobs(prev => prev.filter(job => job.id !== jobId));
      
      toast({
        title: 'Job removed',
        description: 'This job has been removed from your saved jobs.',
      });
    } catch (error: any) {
      console.error('Error removing saved job:', error.message);
      toast({
        title: 'Error removing job',
        description: error.message,
        variant: 'destructive',
      });
    }
  };
  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Saved Jobs</h2>
      
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-riser-purple"></div>
        </div>
      ) : savedJobs.length > 0 ? (
        <div className="space-y-4">
          {savedJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              isSaved={true}
              onToggleSave={handleUnsaveJob}
              isLoggedIn={true}
              onLogin={() => {}}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white p-8 text-center rounded-lg border">
          <h3 className="text-xl font-semibold mb-2">No saved jobs yet</h3>
          <p className="text-gray-600 mb-4">
            You haven't saved any jobs yet. Browse the job listings and save the jobs you're interested in!
          </p>
        </div>
      )}
    </div>
  );
};

export default SavedJobsTab;

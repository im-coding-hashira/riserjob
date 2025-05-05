
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import JobCard from '@/components/JobCard';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Job } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const SavedJobsTab = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  
  useEffect(() => {
    if (user) {
      fetchSavedJobs();
    }
  }, [user]);
  
  // Fetch saved jobs from Supabase
  const fetchSavedJobs = async () => {
    if (!user) return;
    
    try {
      setIsLoadingJobs(true);
      
      // First get the saved job IDs
      const { data: savedJobsData, error: savedJobsError } = await supabase
        .from('saved_jobs')
        .select('job_id')
        .eq('user_id', user.id);
        
      if (savedJobsError) throw savedJobsError;
      
      if (savedJobsData && savedJobsData.length > 0) {
        const jobIds = savedJobsData.map(item => item.job_id);
        
        // Then fetch the actual job details
        const { data: jobsData, error: jobsError } = await supabase
          .from('jobs')
          .select('*')
          .in('id', jobIds);
          
        if (jobsError) throw jobsError;
        
        if (jobsData) {
          setSavedJobs(jobsData as Job[]);
        }
      } else {
        setSavedJobs([]);
      }
    } catch (error: any) {
      console.error('Error fetching saved jobs:', error.message);
      toast({
        title: 'Error fetching saved jobs',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoadingJobs(false);
    }
  };
  
  const handleRemoveSavedJob = async (jobId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('saved_jobs')
        .delete()
        .eq('user_id', user.id)
        .eq('job_id', jobId);
        
      if (error) throw error;
      
      setSavedJobs(prev => prev.filter(job => job.id !== jobId));
      
      toast({
        title: "Job removed from saved jobs",
        description: "You can add it back anytime.",
      });
    } catch (error: any) {
      console.error('Error removing saved job:', error.message);
      toast({
        title: 'Error removing saved job',
        description: error.message,
        variant: 'destructive',
      });
    }
  };
  
  return (
    <div className="bg-white p-6 rounded-lg border">
      <h2 className="text-xl font-semibold mb-4">Your Saved Jobs</h2>
      
      {isLoadingJobs ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-riser-purple"></div>
        </div>
      ) : savedJobs.length > 0 ? (
        <div className="space-y-4">
          {savedJobs.map(job => (
            <JobCard 
              key={job.id} 
              job={job} 
              isSaved={true}
              onToggleSave={handleRemoveSavedJob}
              isLoggedIn={!!user}
              onLogin={() => {}}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">You haven't saved any jobs yet.</p>
          <Button 
            onClick={() => navigate('/jobs')}
            className="bg-riser-purple hover:bg-riser-secondary-purple"
          >
            Browse Jobs
          </Button>
        </div>
      )}
    </div>
  );
};

export default SavedJobsTab;

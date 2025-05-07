
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Job } from '@/lib/types';

export const useJobsAdmin = (initialJobs: Job[] = []) => {
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [isLoading, setIsLoading] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const { toast } = useToast();

  const fetchJobs = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('jobs')
        .select('*');
        
      if (error) throw error;
      
      if (data) {
        // Map the database fields to our Job type based on actual DB schema
        const formattedJobs: Job[] = data.map(job => ({
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
        
        setJobs(formattedJobs);
      }
    } catch (error: any) {
      console.error('Error fetching jobs:', error.message);
      toast({
        title: 'Error fetching jobs',
        description: 'Failed to load job listings. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const deleteJob = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('job_id', id);
        
      if (error) throw error;
      
      // Update local state
      setJobs(jobs => jobs.filter(job => job.id !== id));
      
      toast({
        title: 'Job deleted',
        description: 'Job has been successfully deleted.',
      });
    } catch (error: any) {
      console.error('Error deleting job:', error.message);
      toast({
        title: 'Error deleting job',
        description: 'Failed to delete job. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const updateJob = useCallback(async (updatedJob: Job) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('jobs')
        .update({
          title: updatedJob.title,
          company: updatedJob.company,
          location: updatedJob.location,
          job_type: updatedJob.job_type,
          is_remote: updatedJob.remote,
          description: updatedJob.description,
          source_portal: updatedJob.source
        })
        .eq('job_id', updatedJob.id);
        
      if (error) throw error;
      
      // Update local state
      setJobs(jobs => jobs.map(job => job.id === updatedJob.id ? updatedJob : job));
      
      toast({
        title: 'Job updated',
        description: 'Job has been successfully updated.',
      });
      
      // Clear editing job
      setEditingJob(null);
    } catch (error: any) {
      console.error('Error updating job:', error.message);
      toast({
        title: 'Error updating job',
        description: 'Failed to update job. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return {
    jobs,
    isLoading,
    editingJob,
    setEditingJob,
    fetchJobs,
    deleteJob,
    updateJob
  };
};

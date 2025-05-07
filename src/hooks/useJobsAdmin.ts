
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Job } from '@/lib/types';
import { customSupabaseClient as supabase } from '@/lib/supabase';

export const useJobsAdmin = (initialJobs: Job[]) => {
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [isLoading, setIsLoading] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const { toast } = useToast();

  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('posted_at', { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        setJobs(data as unknown as Job[]);
      }
    } catch (error: any) {
      console.error('Error fetching jobs:', error.message);
      toast({
        title: 'Error fetching jobs',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteJob = async (jobId: string) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', jobId);
        
      if (error) throw error;
      
      // Update local state after successful delete
      setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
      
      toast({
        title: 'Job deleted',
        description: `Job has been removed successfully.`,
      });
    } catch (error: any) {
      console.error('Error deleting job:', error.message);
      toast({
        title: 'Error deleting job',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateJob = async (updatedJob: Job) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('jobs')
        .update({
          title: updatedJob.title,
          company: updatedJob.company,
          location: updatedJob.location,
          job_type: updatedJob.job_type,
          experience_level: updatedJob.experience_level,
          salary_min: updatedJob.salary_min,
          salary_max: updatedJob.salary_max,
          remote: updatedJob.remote,
          description: updatedJob.description,
          updated_at: new Date().toISOString(),
        })
        .eq('id', updatedJob.id);
        
      if (error) throw error;
      
      // Update local state after successful update
      setJobs(prevJobs => 
        prevJobs.map(job => job.id === updatedJob.id ? updatedJob : job)
      );
      
      setEditingJob(null);
      
      toast({
        title: 'Job updated',
        description: `"${updatedJob.title}" has been updated.`,
      });
    } catch (error: any) {
      console.error('Error updating job:', error.message);
      toast({
        title: 'Error updating job',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    jobs,
    setJobs,
    isLoading,
    editingJob,
    setEditingJob,
    fetchJobs,
    deleteJob,
    updateJob
  };
};

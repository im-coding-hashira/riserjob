
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User } from '@supabase/supabase-js';

export const useSavedJobs = (user: User | null) => {
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      setSavedJobs([]);
      return;
    }

    const fetchSavedJobs = async () => {
      try {
        setLoading(true);
        console.log('Fetching saved jobs for user:', user.id);
        
        const { data, error } = await supabase
          .from('saved_jobs')
          .select('job_id')
          .eq('user_id', user.id);

        if (error) {
          console.error('Supabase error fetching saved jobs:', error);
          throw error;
        }

        console.log('Saved jobs data:', data);
        
        if (data) {
          const jobIds = data.map(item => item.job_id).filter(Boolean) as string[];
          console.log('Saved job IDs:', jobIds);
          setSavedJobs(jobIds);
        }
      } catch (error: any) {
        console.error('Error fetching saved jobs:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedJobs();
  }, [user]);

  const toggleSaveJob = async (jobId: string) => {
    if (!user) return;

    try {
      console.log('Toggle save job:', jobId, 'for user:', user.id);
      const isSaved = savedJobs.includes(jobId);

      if (isSaved) {
        // Remove job from saved_jobs
        const { error } = await supabase
          .from('saved_jobs')
          .delete()
          .eq('user_id', user.id)
          .eq('job_id', jobId);

        if (error) {
          console.error('Supabase error removing saved job:', error);
          throw error;
        }

        setSavedJobs(savedJobs.filter(id => id !== jobId));

        toast({
          title: 'Job removed',
          description: 'Job has been removed from your saved list',
        });
      } else {
        // Add job to saved_jobs
        const { error } = await supabase
          .from('saved_jobs')
          .insert({
            user_id: user.id,
            job_id: jobId,
          });

        if (error) {
          console.error('Supabase error adding saved job:', error);
          throw error;
        }

        setSavedJobs([...savedJobs, jobId]);

        toast({
          title: 'Job saved',
          description: 'Job has been added to your saved list',
        });
      }
    } catch (error: any) {
      console.error('Error toggling saved job:', error.message);
      toast({
        title: 'Error',
        description: 'Failed to update saved jobs. Please try again later.',
        variant: 'destructive',
      });
    }
  };

  return { savedJobs, toggleSaveJob, loading };
};

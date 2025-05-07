
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
        const { data, error } = await supabase
          .from('saved_jobs')
          .select('job_id')
          .eq('user_id', user.id);

        if (error) throw error;

        if (data) {
          const jobIds = data.map(item => item.job_id).filter(Boolean) as string[];
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
      const isSaved = savedJobs.includes(jobId);

      if (isSaved) {
        // Remove job from saved_jobs
        await supabase
          .from('saved_jobs')
          .delete()
          .eq('user_id', user.id)
          .eq('job_id', jobId);

        setSavedJobs(savedJobs.filter(id => id !== jobId));

        toast({
          title: 'Job removed',
          description: 'Job has been removed from your saved list',
        });
      } else {
        // Add job to saved_jobs
        await supabase
          .from('saved_jobs')
          .insert({
            user_id: user.id,
            job_id: jobId,
          });

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

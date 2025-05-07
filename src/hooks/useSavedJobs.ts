
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { customSupabaseClient as supabase } from '@/lib/supabase';
import { User } from '@/lib/types';

export const useSavedJobs = (user: User | null) => {
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const { toast } = useToast();
  
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
          .eq('user_id', user.id);
          
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
  
  const toggleSaveJob = async (jobId: string) => {
    if (!user) return false;
    
    try {
      if (savedJobs.includes(jobId)) {
        // Remove from saved jobs
        const { error } = await supabase
          .from('saved_jobs')
          .delete()
          .eq('user_id', user.id)
          .eq('job_id', jobId);
          
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
          });
          
        if (error) throw error;
        
        setSavedJobs(prev => [...prev, jobId]);
        toast({
          title: "Job saved successfully",
          description: "You can view all saved jobs in your profile.",
        });
      }
      return true;
    } catch (error: any) {
      console.error('Error toggling saved job:', error.message);
      toast({
        title: "Error saving job",
        description: error.message,
        variant: 'destructive',
      });
      return false;
    }
  };
  
  return { savedJobs, toggleSaveJob };
};

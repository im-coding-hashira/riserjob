
import { useState, useEffect } from 'react';
import { customSupabaseClient as supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Job } from '@/lib/types';

export const useJobsData = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .order('posted_at', { ascending: false });
          
        if (error) throw error;
        
        if (data) {
          setJobs(data);
        }
      } catch (error: any) {
        console.error('Error fetching jobs:', error.message);
        toast({
          title: 'Error fetching jobs',
          description: 'Failed to load job listings. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobs();
  }, [toast]);

  return { jobs, loading };
};

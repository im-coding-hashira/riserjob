
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
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
        console.log('Fetching jobs from Supabase...');
        
        const { data, error } = await supabase
          .from('jobs')
          .select('*');
          
        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }
        
        console.log('Jobs data received from Supabase:', data);
        
        if (data && data.length > 0) {
          // Map the database fields to our Job type based on actual DB schema
          const formattedJobs: Job[] = data.map(job => ({
            id: job.job_id || '',
            title: job.title || '',
            company: job.company || '',
            location: job.location || '',
            job_type: (job.job_type as any) || 'Full-time',
            experience_level: 'Mid', // Default value since experience_level doesn't exist in DB
            remote: job.is_remote || false,
            description: job.description || '',
            posted_at: new Date().toISOString(), // Using current date since posted_at doesn't exist in DB
            source: job.source_portal || '',
            salary_min: undefined,
            salary_max: undefined,
          }));
          
          console.log('Formatted jobs:', formattedJobs);
          setJobs(formattedJobs);
        } else {
          console.log('No jobs returned from the database');
          setJobs([]);
        }
      } catch (error: any) {
        console.error('Error fetching jobs:', error.message);
        toast({
          title: 'Error fetching jobs',
          description: 'Failed to load job listings. Please try again later.',
          variant: 'destructive',
        });
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobs();
  }, [toast]);

  return { jobs, loading };
};

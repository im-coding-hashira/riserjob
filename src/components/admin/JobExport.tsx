
import React from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Job } from '@/lib/types';

interface JobExportProps {
  jobs: Job[];
}

const JobExport: React.FC<JobExportProps> = ({ jobs }) => {
  const { toast } = useToast();

  const handleExportJobs = () => {
    // Create CSV content
    const headers = ['id', 'title', 'company', 'location', 'job_type', 'posted_at'];
    const csvContent = [
      headers.join(','),
      ...jobs.map(job => [
        job.id,
        job.title,
        job.company,
        job.location,
        job.job_type,
        new Date(job.posted_at).toLocaleDateString()
      ].join(','))
    ].join('\n');
    
    // Create a Blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `job-listings-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: 'Export successful',
      description: `${jobs.length} job listings have been exported.`,
    });
  };

  return (
    <Button 
      variant="outline" 
      className="flex items-center gap-2"
      onClick={handleExportJobs}
    >
      <Download className="h-4 w-4" /> Export
    </Button>
  );
};

export default JobExport;


import React, { useState, useEffect } from 'react';
import { Search, Download, Trash2, Edit } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Job } from '@/lib/types';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import AddJobForm from './AddJobForm';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

interface JobsTabProps {
  jobs: Job[];
  setJobs: React.Dispatch<React.SetStateAction<Job[]>>;
}

const JobsTab: React.FC<JobsTabProps> = ({ jobs, setJobs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchJobs();
  }, []);

  // Fetch jobs from Supabase
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
        setJobs(data);
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

  // Filter jobs based on search term
  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteJob = async (jobId: string) => {
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

  const handleEditJob = (job: Job) => {
    setEditingJob(job);
  };

  const handleJobUpdated = async (updatedJob: Job) => {
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
    <div className="bg-white p-6 rounded-lg border">
      <div className="flex justify-between mb-6">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input 
            type="text" 
            placeholder="Search jobs..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={handleExportJobs}
        >
          <Download className="h-4 w-4" /> Export
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-riser-purple" />
        </div>
      ) : (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Posted On</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredJobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">{job.id.slice(0, 5)}...</TableCell>
                    <TableCell>{job.title}</TableCell>
                    <TableCell>{job.company}</TableCell>
                    <TableCell>{job.job_type}</TableCell>
                    <TableCell>{job.location}</TableCell>
                    <TableCell>{new Date(job.posted_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditJob(job)}
                        className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteJob(job.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredJobs.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {isLoading ? "Loading jobs..." : "No jobs found matching your search."}
              </p>
            </div>
          )}
        </>
      )}

      <Dialog open={editingJob !== null} onOpenChange={() => setEditingJob(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {editingJob && (
            <AddJobForm 
              initialData={editingJob}
              onJobAdded={handleJobUpdated} 
              onCancel={() => setEditingJob(null)} 
              isEditing
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JobsTab;

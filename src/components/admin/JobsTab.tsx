
import React, { useState } from 'react';
import { Search, Download, Trash2, Edit } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Job } from '@/lib/types';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import AddJobForm from './AddJobForm';

interface JobsTabProps {
  jobs: Job[];
  setJobs: React.Dispatch<React.SetStateAction<Job[]>>;
}

const JobsTab: React.FC<JobsTabProps> = ({ jobs, setJobs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const { toast } = useToast();

  // Filter jobs based on search term
  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteJob = (jobId: string) => {
    // In a real implementation, this would delete from Supabase
    setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
    
    toast({
      title: 'Job deleted',
      description: `Job ID: ${jobId} has been removed.`,
    });
  };

  const handleEditJob = (job: Job) => {
    setEditingJob(job);
  };

  const handleJobUpdated = (updatedJob: Job) => {
    setJobs(prevJobs => 
      prevJobs.map(job => job.id === updatedJob.id ? updatedJob : job)
    );
    
    setEditingJob(null);
    
    toast({
      title: 'Job updated',
      description: `"${updatedJob.title}" has been updated.`,
    });
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
          <p className="text-muted-foreground">No jobs found matching your search.</p>
        </div>
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

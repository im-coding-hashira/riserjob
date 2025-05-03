
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bookmark, Building, MapPin, Clock, Briefcase, Banknote } from 'lucide-react';
import { Job } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';

interface JobCardProps {
  job: Job;
  isSaved?: boolean;
  onToggleSave?: (jobId: string) => void;
  isLoggedIn: boolean;
  onLogin: () => void;
}

const JobCard: React.FC<JobCardProps> = ({ 
  job, 
  isSaved = false, 
  onToggleSave,
  isLoggedIn,
  onLogin
}) => {
  const formattedDate = formatDistanceToNow(new Date(job.posted_at), { addSuffix: true });

  const handleSaveClick = () => {
    if (!isLoggedIn) {
      onLogin();
      return;
    }
    if (onToggleSave) {
      onToggleSave(job.id);
    }
  };

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'Not specified';
    if (min && !max) return `$${min.toLocaleString()}+`;
    if (!min && max) return `Up to $${max.toLocaleString()}`;
    return `$${min?.toLocaleString()} - $${max?.toLocaleString()}`;
  };

  return (
    <Card className="job-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-all">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Building className="h-4 w-4" />
            <span>{job.company}</span>
            <span className="h-1 w-1 rounded-full bg-muted-foreground"></span>
            <MapPin className="h-4 w-4" />
            <span>{job.location}</span>
            {job.remote && <span className="bg-riser-light-purple text-riser-purple px-2 py-0.5 rounded text-xs font-medium">Remote</span>}
          </div>
          
          <h3 className="text-lg font-semibold mb-2">{job.title}</h3>
          
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Briefcase className="h-4 w-4" />
              <span>{job.job_type}</span>
            </div>
            
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{formattedDate}</span>
            </div>
            
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Banknote className="h-4 w-4" />
              <span>{formatSalary(job.salary_min, job.salary_max)}</span>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{job.description}</p>
          
          <div className="flex flex-wrap gap-2">
            <span className="bg-riser-light-gray px-2 py-1 rounded text-xs font-medium text-riser-secondary-purple">
              {job.experience_level}
            </span>
            <span className="bg-riser-light-gray px-2 py-1 rounded text-xs font-medium text-riser-secondary-purple">
              {job.source}
            </span>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          className="ml-2 rounded-full"
          onClick={handleSaveClick}
        >
          <Bookmark className={`h-5 w-5 ${isSaved ? 'fill-riser-purple text-riser-purple' : ''}`} />
        </Button>
      </div>
      
      <div className="flex justify-end mt-4">
        <Button className="bg-riser-purple hover:bg-riser-secondary-purple">
          View Job
        </Button>
      </div>
    </Card>
  );
};

export default JobCard;

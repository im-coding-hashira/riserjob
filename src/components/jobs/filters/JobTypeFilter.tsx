
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { JobType } from '@/lib/types';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface JobTypeFilterProps {
  selectedTypes: JobType[];
  onJobTypeChange: (type: JobType) => void;
}

const JOB_TYPES: JobType[] = ['Full-time', 'Part-time', 'Contract', 'Internship'];

const JobTypeFilter: React.FC<JobTypeFilterProps> = ({ selectedTypes, onJobTypeChange }) => {
  return (
    <AccordionItem value="jobType">
      <AccordionTrigger>Job Type</AccordionTrigger>
      <AccordionContent className="space-y-2">
        {JOB_TYPES.map((type) => (
          <div key={type}>
            <Checkbox
              id={`job-${type.toLowerCase()}`}
              checked={selectedTypes.includes(type)}
              onCheckedChange={() => onJobTypeChange(type)}
            />
            <Label htmlFor={`job-${type.toLowerCase()}`} className="ml-2">
              {type}
            </Label>
          </div>
        ))}
      </AccordionContent>
    </AccordionItem>
  );
};

export default JobTypeFilter;

import React, { useState, useEffect } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { JobType, ExperienceLevel, SearchFilters } from '@/lib/types';

interface JobFiltersProps {
  onFilterChange: (filters: SearchFilters) => void;
  initialFilters?: SearchFilters;
}

const JobFilters: React.FC<JobFiltersProps> = ({ onFilterChange, initialFilters }) => {
  const [keyword, setKeyword] = useState(initialFilters?.keyword || '');
  const [location, setLocation] = useState(initialFilters?.location || '');
  const [salaryRange, setSalaryRange] = useState<number[]>([
    initialFilters?.salary_min || 0,
    initialFilters?.salary_max || 100000,
  ]);
  const [jobType, setJobType] = useState<JobType[]>(initialFilters?.job_type || []);
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel[]>(initialFilters?.experience_level || []);
  const [remote, setRemote] = useState(initialFilters?.remote || false);

  useEffect(() => {
    const filters: SearchFilters = {
      keyword,
      location,
      salary_min: salaryRange[0],
      salary_max: salaryRange[1],
      job_type: jobType.length > 0 ? jobType : undefined,
      experience_level: experienceLevel.length > 0 ? experienceLevel : undefined,
      remote: remote || undefined,
    };
    onFilterChange(filters);
  }, [keyword, location, salaryRange, jobType, experienceLevel, remote, onFilterChange]);

  const handleSalaryChange = (value: number[]) => {
    setSalaryRange(value);
  };

  const handleJobTypeChange = (type: JobType) => {
    setJobType((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleExperienceLevelChange = (level: ExperienceLevel) => {
    setExperienceLevel((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
  };

  const handleRemoteChange = (checked: boolean) => {
    setRemote(checked);
  };

  return (
    <div className="bg-white p-6 rounded-lg border">
      <h2 className="text-xl font-semibold mb-4">Filter Jobs</h2>

      <div className="space-y-4">
        {/* Keyword Search */}
        <div>
          <Label htmlFor="keyword">Keyword</Label>
          <Input
            type="text"
            id="keyword"
            placeholder="e.g., React Developer"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>

        {/* Location Search */}
        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            type="text"
            id="location"
            placeholder="e.g., San Francisco"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <Accordion type="single" collapsible>
          {/* Salary Range */}
          <AccordionItem value="salary">
            <AccordionTrigger>Salary Range</AccordionTrigger>
            <AccordionContent>
              <div className="mt-2">
                <Slider
                  defaultValue={salaryRange}
                  min={0}
                  max={200000}
                  step={1000}
                  onValueChange={handleSalaryChange}
                  aria-label="Salary Range"
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-2">
                  <span>${salaryRange[0].toLocaleString()}</span>
                  <span>${salaryRange[1].toLocaleString()}</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Job Type */}
          <AccordionItem value="jobType">
            <AccordionTrigger>Job Type</AccordionTrigger>
            <AccordionContent className="space-y-2">
              <div>
                <Checkbox
                  id="full-time"
                  checked={jobType.includes('Full-time')}
                  onCheckedChange={() => handleJobTypeChange('Full-time')}
                />
                <Label htmlFor="full-time" className="ml-2">
                  Full-time
                </Label>
              </div>
              <div>
                <Checkbox
                  id="part-time"
                  checked={jobType.includes('Part-time')}
                  onCheckedChange={() => handleJobTypeChange('Part-time')}
                />
                <Label htmlFor="part-time" className="ml-2">
                  Part-time
                </Label>
              </div>
              <div>
                <Checkbox
                  id="contract"
                  checked={jobType.includes('Contract')}
                  onCheckedChange={() => handleJobTypeChange('Contract')}
                />
                <Label htmlFor="contract" className="ml-2">
                  Contract
                </Label>
              </div>
              <div>
                <Checkbox
                  id="internship"
                  checked={jobType.includes('Internship')}
                  onCheckedChange={() => handleJobTypeChange('Internship')}
                />
                <Label htmlFor="internship" className="ml-2">
                  Internship
                </Label>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Experience Level */}
          <AccordionItem value="experienceLevel">
            <AccordionTrigger>Experience Level</AccordionTrigger>
            <AccordionContent className="space-y-2">
              <div>
                <Checkbox
                  id="entry"
                  checked={experienceLevel.includes('Entry')}
                  onCheckedChange={() => handleExperienceLevelChange('Entry')}
                />
                <Label htmlFor="entry" className="ml-2">
                  Entry Level
                </Label>
              </div>
              <div>
                <Checkbox
                  id="mid"
                  checked={experienceLevel.includes('Mid')}
                  onCheckedChange={() => handleExperienceLevelChange('Mid')}
                />
                <Label htmlFor="mid" className="ml-2">
                  Mid Level
                </Label>
              </div>
              <div>
                <Checkbox
                  id="senior"
                  checked={experienceLevel.includes('Senior')}
                  onCheckedChange={() => handleExperienceLevelChange('Senior')}
                />
                <Label htmlFor="senior" className="ml-2">
                  Senior Level
                </Label>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Remote */}
          <AccordionItem value="remote">
            <AccordionTrigger>Remote</AccordionTrigger>
            <AccordionContent>
              <div className="mt-2">
                <Checkbox
                  id="remote"
                  checked={remote}
                  onCheckedChange={(checked) => handleRemoteChange(!!checked)}
                />
                <Label htmlFor="remote" className="ml-2">
                  Remote Only
                </Label>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default JobFilters;

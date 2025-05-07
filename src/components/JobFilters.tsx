
import React, { useState, useEffect, useCallback } from 'react';
import { Accordion } from "@/components/ui/accordion";
import { JobType, ExperienceLevel, SearchFilters } from '@/lib/types';
import FilterContainer from './jobs/filters/FilterContainer';
import SearchInputs from './jobs/filters/SearchInputs';
import SalaryRangeFilter from './jobs/filters/SalaryRangeFilter';
import JobTypeFilter from './jobs/filters/JobTypeFilter';
import ExperienceLevelFilter from './jobs/filters/ExperienceLevelFilter';
import RemoteFilter from './jobs/filters/RemoteFilter';

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

  // Use callback to prevent infinite re-renders
  const updateFilters = useCallback(() => {
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

  // Only trigger filter changes when dependencies change
  useEffect(() => {
    updateFilters();
  }, [updateFilters]);

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

  return (
    <FilterContainer title="Filter Jobs">
      <SearchInputs
        keyword={keyword}
        location={location}
        onKeywordChange={setKeyword}
        onLocationChange={setLocation}
      />

      <Accordion type="single" collapsible>
        <SalaryRangeFilter 
          salaryRange={salaryRange} 
          onSalaryChange={setSalaryRange} 
        />
        
        <JobTypeFilter 
          selectedTypes={jobType} 
          onJobTypeChange={handleJobTypeChange} 
        />
        
        <ExperienceLevelFilter 
          selectedLevels={experienceLevel} 
          onExperienceLevelChange={handleExperienceLevelChange} 
        />
        
        <RemoteFilter 
          remote={remote} 
          onRemoteChange={setRemote} 
        />
      </Accordion>
    </FilterContainer>
  );
};

export default JobFilters;

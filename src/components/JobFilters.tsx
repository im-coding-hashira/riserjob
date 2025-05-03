
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { SearchFilters, ExperienceLevel, JobType } from '@/lib/types';
import { Filter, X } from 'lucide-react';

interface JobFiltersProps {
  onFilterChange: (filters: SearchFilters) => void;
  initialFilters?: SearchFilters;
}

const JobFilters: React.FC<JobFiltersProps> = ({ 
  onFilterChange,
  initialFilters = {}
}) => {
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);
  const [salary, setSalary] = useState<[number, number]>([
    filters.salary_min || 0,
    filters.salary_max || 200000
  ]);
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  
  const handleCheckboxChange = (
    filterType: 'job_type' | 'experience_level',
    value: JobType | ExperienceLevel
  ) => {
    setFilters(prev => {
      const currentValues = prev[filterType] || [];
      const isAlreadySelected = currentValues.includes(value as any);
      
      const updatedValues = isAlreadySelected
        ? currentValues.filter(item => item !== value)
        : [...currentValues, value];
      
      return { 
        ...prev, 
        [filterType]: updatedValues.length > 0 ? updatedValues : undefined 
      };
    });
  };
  
  const handleRemoteChange = (checked: boolean | "indeterminate") => {
    if (typeof checked === "boolean") {
      setFilters(prev => ({ ...prev, remote: checked || undefined }));
    }
  };
  
  const handleSalaryChange = (values: number[]) => {
    setSalary([values[0], values[1]]);
    setFilters(prev => ({
      ...prev,
      salary_min: values[0] > 0 ? values[0] : undefined,
      salary_max: values[1] < 200000 ? values[1] : undefined
    }));
  };
  
  const applyFilters = () => {
    onFilterChange(filters);
    if (window.innerWidth < 768) {
      setIsFiltersVisible(false);
    }
  };
  
  const resetFilters = () => {
    setFilters({});
    setSalary([0, 200000]);
    onFilterChange({});
  };
  
  const experienceLevels: ExperienceLevel[] = ['Entry', 'Mid', 'Senior'];
  const jobTypes: JobType[] = ['Full-time', 'Part-time', 'Contract', 'Internship'];
  
  return (
    <div className="w-full">
      {/* Mobile filter button */}
      <Button 
        variant="outline" 
        onClick={() => setIsFiltersVisible(!isFiltersVisible)}
        className="flex items-center gap-2 md:hidden w-full mb-4"
      >
        <Filter className="h-4 w-4" />
        {isFiltersVisible ? 'Hide Filters' : 'Show Filters'}
      </Button>
      
      <div 
        className={`
          ${isFiltersVisible ? 'block' : 'hidden'} 
          md:block 
          bg-white 
          rounded-lg 
          border 
          p-4
        `}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Filter Jobs</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs h-7 px-2"
            onClick={resetFilters}
          >
            Clear All
          </Button>
        </div>
        
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="job-type">
            <AccordionTrigger className="py-3">Job Type</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col space-y-2">
                {jobTypes.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`job-type-${type}`} 
                      checked={filters.job_type?.includes(type)}
                      onCheckedChange={() => handleCheckboxChange('job_type', type)}
                    />
                    <Label htmlFor={`job-type-${type}`}>{type}</Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="experience">
            <AccordionTrigger className="py-3">Experience Level</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col space-y-2">
                {experienceLevels.map((level) => (
                  <div key={level} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`exp-level-${level}`}
                      checked={filters.experience_level?.includes(level)}
                      onCheckedChange={() => handleCheckboxChange('experience_level', level)}
                    />
                    <Label htmlFor={`exp-level-${level}`}>{level}</Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="salary">
            <AccordionTrigger className="py-3">Salary Range</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <Slider
                  min={0}
                  max={200000}
                  step={10000}
                  value={salary}
                  onValueChange={handleSalaryChange}
                  className="my-6"
                />
                <div className="flex justify-between text-sm">
                  <span>${salary[0].toLocaleString()}</span>
                  <span>${salary[1].toLocaleString()}</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="remote">
            <AccordionTrigger className="py-3">Remote Work</AccordionTrigger>
            <AccordionContent>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="remote-work" 
                  checked={filters.remote || false}
                  onCheckedChange={handleRemoteChange}
                />
                <Label htmlFor="remote-work">Remote Only</Label>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        <Button 
          onClick={applyFilters}
          className="w-full mt-4 bg-riser-purple hover:bg-riser-secondary-purple"
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );
};

export default JobFilters;

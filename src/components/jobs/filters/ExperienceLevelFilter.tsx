
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ExperienceLevel } from '@/lib/types';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface ExperienceLevelFilterProps {
  selectedLevels: ExperienceLevel[];
  onExperienceLevelChange: (level: ExperienceLevel) => void;
}

const EXPERIENCE_LEVELS: ExperienceLevel[] = ['Entry', 'Mid', 'Senior'];
const EXPERIENCE_LABELS = {
  'Entry': 'Entry Level',
  'Mid': 'Mid Level',
  'Senior': 'Senior Level'
};

const ExperienceLevelFilter: React.FC<ExperienceLevelFilterProps> = ({ 
  selectedLevels, 
  onExperienceLevelChange 
}) => {
  return (
    <AccordionItem value="experienceLevel">
      <AccordionTrigger>Experience Level</AccordionTrigger>
      <AccordionContent className="space-y-2">
        {EXPERIENCE_LEVELS.map((level) => (
          <div key={level}>
            <Checkbox
              id={`experience-${level.toLowerCase()}`}
              checked={selectedLevels.includes(level)}
              onCheckedChange={() => onExperienceLevelChange(level)}
            />
            <Label htmlFor={`experience-${level.toLowerCase()}`} className="ml-2">
              {EXPERIENCE_LABELS[level]}
            </Label>
          </div>
        ))}
      </AccordionContent>
    </AccordionItem>
  );
};

export default ExperienceLevelFilter;

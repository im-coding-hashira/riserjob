
import React from 'react';
import { Slider } from "@/components/ui/slider";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface SalaryRangeFilterProps {
  salaryRange: number[];
  onSalaryChange: (values: number[]) => void;
}

const SalaryRangeFilter: React.FC<SalaryRangeFilterProps> = ({ 
  salaryRange, 
  onSalaryChange 
}) => {
  return (
    <AccordionItem value="salary">
      <AccordionTrigger>Salary Range</AccordionTrigger>
      <AccordionContent>
        <div className="mt-2">
          <Slider
            defaultValue={salaryRange}
            value={salaryRange}
            min={0}
            max={200000}
            step={1000}
            onValueChange={onSalaryChange}
            aria-label="Salary Range"
          />
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>${salaryRange[0].toLocaleString()}</span>
            <span>${salaryRange[1].toLocaleString()}</span>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default SalaryRangeFilter;

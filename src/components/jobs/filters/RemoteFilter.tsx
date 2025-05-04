
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface RemoteFilterProps {
  remote: boolean;
  onRemoteChange: (checked: boolean) => void;
}

const RemoteFilter: React.FC<RemoteFilterProps> = ({ remote, onRemoteChange }) => {
  return (
    <AccordionItem value="remote">
      <AccordionTrigger>Remote</AccordionTrigger>
      <AccordionContent>
        <div className="mt-2">
          <Checkbox
            id="remote"
            checked={remote}
            onCheckedChange={(checked) => onRemoteChange(!!checked)}
          />
          <Label htmlFor="remote" className="ml-2">
            Remote Only
          </Label>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default RemoteFilter;

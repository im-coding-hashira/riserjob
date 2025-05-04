
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SearchInputsProps {
  keyword: string;
  location: string;
  onKeywordChange: (value: string) => void;
  onLocationChange: (value: string) => void;
}

const SearchInputs: React.FC<SearchInputsProps> = ({ 
  keyword, 
  location, 
  onKeywordChange, 
  onLocationChange 
}) => {
  return (
    <>
      <div>
        <Label htmlFor="keyword">Keyword</Label>
        <Input
          type="text"
          id="keyword"
          placeholder="e.g., React Developer"
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          type="text"
          id="location"
          placeholder="e.g., San Francisco"
          value={location}
          onChange={(e) => onLocationChange(e.target.value)}
        />
      </div>
    </>
  );
};

export default SearchInputs;

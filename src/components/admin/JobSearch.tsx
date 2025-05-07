
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface JobSearchProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

const JobSearch: React.FC<JobSearchProps> = ({ searchTerm, setSearchTerm }) => {
  return (
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
  );
};

export default JobSearch;

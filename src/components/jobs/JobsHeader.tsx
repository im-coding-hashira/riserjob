
import React from 'react';
import SearchBar from '@/components/SearchBar';

const JobsHeader: React.FC = () => {
  return (
    <div className="bg-riser-light-purple py-6">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Find Your Perfect Job</h1>
        <SearchBar />
      </div>
    </div>
  );
};

export default JobsHeader;

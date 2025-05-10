
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import UserAuth from '@/components/UserAuth';
import Footer from '@/components/Footer';
import SearchBar from '@/components/SearchBar';
import { useSearchParams } from 'react-router-dom';
import { useJobsData } from '@/hooks/useJobsData';
import JobsContainer from '@/components/jobs/JobsContainer';

const Search = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('keyword') || '';
  const location = searchParams.get('location') || '';
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar onLogin={() => setIsAuthModalOpen(true)} />
      
      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Find Your Perfect Job</h1>
          <div className="mb-8">
            <SearchBar />
          </div>
          
          {(keyword || location) && (
            <div className="mb-4">
              <h2 className="text-xl font-semibold">
                {keyword && location
                  ? `Search results for "${keyword}" in "${location}"`
                  : keyword
                  ? `Search results for "${keyword}"`
                  : `Search results in "${location}"`}
              </h2>
            </div>
          )}
          
          <JobsContainer onOpenAuth={() => setIsAuthModalOpen(true)} />
        </div>
      </main>
      
      <Footer />
      
      <UserAuth 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
};

export default Search;


import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin } from 'lucide-react';

const SearchBar: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const navigate = useNavigate();

  // Update state when URL params change
  useEffect(() => {
    const keywordParam = searchParams.get('keyword');
    const locationParam = searchParams.get('location');
    
    if (keywordParam !== null) setKeyword(keywordParam);
    if (locationParam !== null) setLocation(locationParam);
    
    console.log('SearchBar detected URL params:', { keyword: keywordParam, location: locationParam });
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const searchParams = new URLSearchParams();
    if (keyword) searchParams.set('keyword', keyword);
    if (location) searchParams.set('location', location);
    
    console.log('Initiating job search with params:', { keyword, location });
    navigate(`/jobs?${searchParams.toString()}`);
  };

  return (
    <form 
      onSubmit={handleSearch}
      className="w-full max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-3 md:p-2 flex flex-col md:flex-row"
    >
      <div className="relative flex-1 mb-2 md:mb-0 md:mr-2">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input
          type="text"
          placeholder="Job title, keywords, or company"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="pl-10 h-12 w-full focus-visible:ring-riser-purple"
        />
      </div>
      
      <div className="relative flex-1 mb-2 md:mb-0 md:mr-2">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input
          type="text"
          placeholder="City, state, or zip code"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="pl-10 h-12 w-full focus-visible:ring-riser-purple"
        />
      </div>
      
      <Button 
        type="submit" 
        className="h-12 px-6 bg-riser-purple hover:bg-riser-secondary-purple"
      >
        Search Jobs
      </Button>
    </form>
  );
};

export default SearchBar;

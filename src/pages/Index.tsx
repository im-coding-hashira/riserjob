
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import SearchBar from '@/components/SearchBar';
import JobCard from '@/components/JobCard';
import UserAuth from '@/components/UserAuth';
import { mockJobs } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';
import { Briefcase, Search, Users, TrendingUp } from 'lucide-react';

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { toast } = useToast();
  
  const featuredJobs = mockJobs.slice(0, 4);
  
  const handleLogin = (email: string, password: string) => {
    // Here you'd typically call your authentication API
    console.log('Login attempt with:', email, password);
    
    // Simulate successful login
    setIsLoggedIn(true);
    setIsAuthModalOpen(false);
    toast({
      title: 'Welcome back!',
      description: 'You have successfully logged in.',
    });
  };
  
  const handleSignup = (name: string, email: string, password: string) => {
    // Here you'd typically call your registration API
    console.log('Signup attempt with:', name, email, password);
    
    // Simulate successful registration
    setIsLoggedIn(true);
    setIsAuthModalOpen(false);
    toast({
      title: 'Account created!',
      description: 'Welcome to RiserJobs.',
    });
  };
  
  const handleLogout = () => {
    setIsLoggedIn(false);
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out.',
    });
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar 
        isLoggedIn={isLoggedIn} 
        onLogin={() => setIsAuthModalOpen(true)} 
        onLogout={handleLogout} 
      />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-riser-light-purple to-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
                Find Your Dream Job Today
              </h1>
              <p className="text-lg md:text-xl text-gray-700 mb-8">
                Search jobs from multiple platforms in one place. RiserJobs helps you find the perfect opportunity faster.
              </p>
              
              <SearchBar />
              
              <div className="flex flex-wrap justify-center gap-4 mt-8">
                <Button variant="outline" className="gap-2">
                  <Briefcase className="h-4 w-4" />
                  Browse Jobs
                </Button>
                <Button variant="outline" className="gap-2">
                  <Users className="h-4 w-4" />
                  Popular Companies
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Stats Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-riser-purple mb-2">100K+</p>
                <p className="text-gray-600">Active Jobs</p>
              </div>
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-riser-purple mb-2">500+</p>
                <p className="text-gray-600">Companies</p>
              </div>
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-riser-purple mb-2">10M+</p>
                <p className="text-gray-600">Job Seekers</p>
              </div>
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-riser-purple mb-2">98%</p>
                <p className="text-gray-600">Success Rate</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Featured Jobs Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold">Featured Jobs</h2>
              <Link to="/jobs" className="text-riser-purple hover:underline font-medium flex items-center gap-1">
                View All <TrendingUp className="h-4 w-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredJobs.map((job) => (
                <JobCard 
                  key={job.id} 
                  job={job} 
                  isLoggedIn={isLoggedIn}
                  onLogin={() => setIsAuthModalOpen(true)}
                />
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-riser-dark-purple text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Take the Next Step in Your Career?</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Create an account to save jobs, get personalized recommendations, and apply with just one click.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                onClick={() => setIsAuthModalOpen(true)}
                className="bg-riser-purple hover:bg-riser-secondary-purple"
              >
                Get Started
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-riser-dark-purple">
                Learn More
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <Link to="/" className="flex items-center gap-2 font-bold text-xl">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-riser-purple"
                >
                  <path
                    d="M14 7L18 11L14 15M8 7L4 11L8 15"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="gradient-text">RiserJobs</span>
              </Link>
            </div>
            <div className="text-sm text-center md:text-right">
              <p className="text-gray-600">© 2023 RiserJobs. All rights reserved.</p>
              <div className="flex justify-center md:justify-end gap-4 mt-2">
                <a href="#" className="text-gray-600 hover:text-riser-purple">Privacy Policy</a>
                <a href="#" className="text-gray-600 hover:text-riser-purple">Terms of Service</a>
                <a href="#" className="text-gray-600 hover:text-riser-purple">Contact</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
      
      <UserAuth 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
        onSignup={handleSignup}
      />
    </div>
  );
};

export default Index;

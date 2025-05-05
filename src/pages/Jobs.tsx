
import React from 'react';
import Navbar from '@/components/Navbar';
import UserAuth from '@/components/UserAuth';
import JobsHeader from '@/components/jobs/JobsHeader';
import JobsContainer from '@/components/jobs/JobsContainer';
import Footer from '@/components/Footer';

const Jobs = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar onLogin={() => setIsAuthModalOpen(true)} />
      
      <main className="flex-1 bg-gray-50">
        <JobsHeader />
        <JobsContainer onOpenAuth={() => setIsAuthModalOpen(true)} />
      </main>
      
      <Footer />
      
      <UserAuth 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
};

export default Jobs;

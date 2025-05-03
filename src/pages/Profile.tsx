
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import JobCard from '@/components/JobCard';
import UserAuth from '@/components/UserAuth';
import { mockUsers, mockJobs } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Job } from '@/lib/types';

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Default to true for profile page
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [userProfile, setUserProfile] = useState({
    name: 'Test User',
    email: 'user@example.com',
    password: '********',
  });
  
  // Simulate loading saved jobs from API
  useEffect(() => {
    // In a real app, you'd fetch the user's saved jobs from your backend
    const mockSavedJobIds = mockUsers[0].savedJobs || [];
    const userSavedJobs = mockJobs.filter(job => mockSavedJobIds.includes(job.id));
    setSavedJobs(userSavedJobs);
  }, []);
  
  const handleRemoveSavedJob = (jobId: string) => {
    setSavedJobs(prev => prev.filter(job => job.id !== jobId));
    toast({
      title: "Job removed from saved jobs",
      description: "You can add it back anytime.",
    });
  };
  
  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd send the updated profile to your backend
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
    });
  };
  
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
  
  const handleLogout = () => {
    setIsLoggedIn(false);
    // Redirect to home page after logout
    navigate('/');
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out.',
    });
  };
  
  const handleSignup = (name: string, email: string, password: string) => {
    // This shouldn't be needed in the profile page, but including for completeness
    setIsLoggedIn(true);
    setIsAuthModalOpen(false);
  };
  
  // Redirect to home if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar 
        isLoggedIn={isLoggedIn} 
        onLogin={() => setIsAuthModalOpen(true)} 
        onLogout={handleLogout} 
      />
      
      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-6">Your Profile</h1>
          
          <Tabs defaultValue="saved-jobs" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="saved-jobs">Saved Jobs</TabsTrigger>
              <TabsTrigger value="account">Account Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="saved-jobs">
              <div className="bg-white p-6 rounded-lg border">
                <h2 className="text-xl font-semibold mb-4">Your Saved Jobs</h2>
                
                {savedJobs.length > 0 ? (
                  <div className="space-y-4">
                    {savedJobs.map(job => (
                      <JobCard 
                        key={job.id} 
                        job={job} 
                        isSaved={true}
                        onToggleSave={handleRemoveSavedJob}
                        isLoggedIn={isLoggedIn}
                        onLogin={() => {}}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">You haven't saved any jobs yet.</p>
                    <Button 
                      onClick={() => navigate('/jobs')}
                      className="bg-riser-purple hover:bg-riser-secondary-purple"
                    >
                      Browse Jobs
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="account">
              <div className="bg-white p-6 rounded-lg border">
                <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
                
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        value={userProfile.name}
                        onChange={e => setUserProfile({...userProfile, name: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        type="email"
                        value={userProfile.email}
                        onChange={e => setUserProfile({...userProfile, email: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input 
                        id="current-password" 
                        type="password"
                        placeholder="Enter your current password"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input 
                        id="new-password" 
                        type="password"
                        placeholder="Enter a new password"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      type="submit"
                      className="bg-riser-purple hover:bg-riser-secondary-purple"
                    >
                      Save Changes
                    </Button>
                  </div>
                </form>
                
                <div className="mt-12 pt-6 border-t">
                  <h3 className="text-lg font-semibold mb-4 text-red-600">Danger Zone</h3>
                  <Button variant="destructive">Delete Account</Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="container mx-auto px-4">
          <div className="text-center md:text-left">
            <p className="text-sm text-gray-600">© 2023 RiserJobs. All rights reserved.</p>
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

export default Profile;

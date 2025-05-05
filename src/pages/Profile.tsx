
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import JobCard from '@/components/JobCard';
import UserAuth from '@/components/UserAuth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Job } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isLoading: authLoading, signOut } = useAuth();
  
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: '',
    email: '',
    password: '********',
  });
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Redirect to home if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/');
    } else if (user) {
      // Fetch user profile data from Supabase
      const fetchUserProfile = async () => {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('name, email')
            .eq('id', user.id)
            .single();
            
          if (error) throw error;
          
          if (data) {
            setUserProfile({
              name: data.name || '',
              email: data.email || user.email || '',
              password: '********'
            });
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      };
      
      fetchUserProfile();
      fetchSavedJobs();
    }
  }, [user, authLoading, navigate]);
  
  // Fetch saved jobs from Supabase
  const fetchSavedJobs = async () => {
    if (!user) return;
    
    try {
      setIsLoadingJobs(true);
      
      // First get the saved job IDs
      const { data: savedJobsData, error: savedJobsError } = await supabase
        .from('saved_jobs')
        .select('job_id')
        .eq('user_id', user.id);
        
      if (savedJobsError) throw savedJobsError;
      
      if (savedJobsData && savedJobsData.length > 0) {
        const jobIds = savedJobsData.map(item => item.job_id);
        
        // Then fetch the actual job details
        const { data: jobsData, error: jobsError } = await supabase
          .from('jobs')
          .select('*')
          .in('id', jobIds);
          
        if (jobsError) throw jobsError;
        
        if (jobsData) {
          setSavedJobs(jobsData);
        }
      } else {
        setSavedJobs([]);
      }
    } catch (error: any) {
      console.error('Error fetching saved jobs:', error.message);
      toast({
        title: 'Error fetching saved jobs',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoadingJobs(false);
    }
  };
  
  const handleRemoveSavedJob = async (jobId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('saved_jobs')
        .delete()
        .eq('user_id', user.id)
        .eq('job_id', jobId);
        
      if (error) throw error;
      
      setSavedJobs(prev => prev.filter(job => job.id !== jobId));
      
      toast({
        title: "Job removed from saved jobs",
        description: "You can add it back anytime.",
      });
    } catch (error: any) {
      console.error('Error removing saved job:', error.message);
      toast({
        title: 'Error removing saved job',
        description: error.message,
        variant: 'destructive',
      });
    }
  };
  
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    try {
      setIsUpdating(true);
      
      // Update profile in Supabase
      const { error } = await supabase
        .from('profiles')
        .update({ 
          name: userProfile.name,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message || "An error occurred while updating your profile.",
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleLogout = () => {
    signOut();
  };
  
  if (authLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar onLogin={() => setIsAuthModalOpen(true)} />
        <main className="flex-1 bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-riser-purple"></div>
        </main>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar onLogin={() => setIsAuthModalOpen(true)} />
      
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
                
                {isLoadingJobs ? (
                  <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-riser-purple"></div>
                  </div>
                ) : savedJobs.length > 0 ? (
                  <div className="space-y-4">
                    {savedJobs.map(job => (
                      <JobCard 
                        key={job.id} 
                        job={job} 
                        isSaved={true}
                        onToggleSave={handleRemoveSavedJob}
                        isLoggedIn={!!user}
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
                        disabled={isUpdating}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        type="email"
                        value={userProfile.email}
                        disabled={true} // Email can't be changed directly
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input 
                        id="current-password" 
                        type="password"
                        placeholder="Enter your current password"
                        disabled={isUpdating}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input 
                        id="new-password" 
                        type="password"
                        placeholder="Enter a new password"
                        disabled={isUpdating}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      type="submit"
                      className="bg-riser-purple hover:bg-riser-secondary-purple"
                      disabled={isUpdating}
                    >
                      {isUpdating ? 'Saving...' : 'Save Changes'}
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
      />
    </div>
  );
};

export default Profile;

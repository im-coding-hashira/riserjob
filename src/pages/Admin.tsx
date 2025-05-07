import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockUsers } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { customSupabaseClient as supabase } from '@/lib/supabase';
import { 
  Plus,
  FileText,
  Users,
  Upload,
  Loader2
} from 'lucide-react';
import JobsTab from '@/components/admin/JobsTab';
import UsersTab from '@/components/admin/UsersTab';
import CsvUploadTab from '@/components/admin/CsvUploadTab';
import AddJobForm from '@/components/admin/AddJobForm';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Job } from '@/lib/types';

// This is the admin email that is allowed to access this page
const ADMIN_EMAIL = 'iam.refiction@gmail.com';

const AdminPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  
  const [isLoading, setIsLoading] = useState(true);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [users, setUsers] = useState(mockUsers);
  const [isAddJobDialogOpen, setIsAddJobDialogOpen] = useState(false);
  
  // Verify admin access
  useEffect(() => {
    const checkAdminAccess = async () => {
      setIsLoading(true);
      
      // Add a small delay to ensure auth state is properly loaded
      setTimeout(() => {
        if (!user) {
          console.log("No user logged in, redirecting to home");
          toast({
            title: 'Authentication required',
            description: 'Please sign in to access the admin panel.',
            variant: 'destructive',
          });
          navigate('/');
          return;
        }
        
        console.log("Current user email:", user.email);
        console.log("Admin email required:", ADMIN_EMAIL);
        
        if (user.email !== ADMIN_EMAIL) {
          console.log("User is not admin, redirecting to home");
          toast({
            title: 'Access denied',
            description: 'You do not have permission to access the admin panel.',
            variant: 'destructive',
          });
          navigate('/');
          return;
        }
        
        console.log("Admin access granted");
        setIsLoading(false);
      }, 500);
    };
    
    checkAdminAccess();
  }, [user, navigate, toast]);
  
  const handleAddJob = () => {
    setIsAddJobDialogOpen(true);
  };
  
  const handleJobAdded = async (newJob: Job) => {
    try {
      setIsLoading(true);
      
      // Insert job into Supabase
      const { data, error } = await supabase
        .from('jobs')
        .insert({
          title: newJob.title,
          company: newJob.company,
          location: newJob.location,
          job_type: newJob.job_type,
          experience_level: newJob.experience_level,
          salary_min: newJob.salary_min,
          salary_max: newJob.salary_max,
          remote: newJob.remote,
          description: newJob.description,
        } as any)
        .select();
        
      if (error) throw error;
      
      // Update local state with the newly created job
      if (data) {
        setJobs(prevJobs => [data[0] as unknown as Job, ...prevJobs]);
      }
      
      setIsAddJobDialogOpen(false);
      
      toast({
        title: 'Success',
        description: 'Job has been added successfully.',
      });
    } catch (error: any) {
      console.error('Error adding job:', error.message);
      toast({
        title: 'Error adding job',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar onLogin={() => {}} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-riser-purple" />
            <p>Loading admin panel...</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar onLogin={() => {}} />
      
      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground mr-2">
                Logged in as: {user?.email}
              </p>
              <Button className="bg-riser-purple hover:bg-riser-secondary-purple" onClick={handleAddJob}>
                <Plus className="mr-2 h-4 w-4" /> Add New Job
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="jobs" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="jobs" className="flex items-center gap-2">
                <FileText className="h-4 w-4" /> Job Listings
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="h-4 w-4" /> Users
              </TabsTrigger>
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <Upload className="h-4 w-4" /> CSV Upload
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="jobs">
              <JobsTab jobs={jobs} setJobs={setJobs} />
            </TabsContent>
            
            <TabsContent value="users">
              <UsersTab users={users} setUsers={setUsers} />
            </TabsContent>
            
            <TabsContent value="upload">
              <CsvUploadTab />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Dialog open={isAddJobDialogOpen} onOpenChange={setIsAddJobDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <AddJobForm 
            onJobAdded={handleJobAdded} 
            onCancel={() => setIsAddJobDialogOpen(false)} 
          />
        </DialogContent>
      </Dialog>
      
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="container mx-auto px-4">
          <div className="text-center md:text-left">
            <p className="text-sm text-gray-600">© 2023 RiserJobs Admin Panel</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AdminPage;

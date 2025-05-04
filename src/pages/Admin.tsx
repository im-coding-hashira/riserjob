
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockJobs, mockUsers } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
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

const ADMIN_EMAIL = 'iam.refiction@gmail.com';

const AdminPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  
  const [isLoading, setIsLoading] = useState(true);
  const [jobs, setJobs] = useState(mockJobs);
  const [users, setUsers] = useState(mockUsers);
  
  // Verify admin access
  useEffect(() => {
    const checkAdminAccess = async () => {
      setIsLoading(true);
      
      if (!user) {
        toast({
          title: 'Authentication required',
          description: 'Please sign in to access the admin panel.',
          variant: 'destructive',
        });
        navigate('/');
        return;
      }
      
      if (user.email !== ADMIN_EMAIL) {
        toast({
          title: 'Access denied',
          description: 'You do not have permission to access the admin panel.',
          variant: 'destructive',
        });
        navigate('/');
        return;
      }
      
      // Load real data from Supabase here when we integrate it
      setIsLoading(false);
    };
    
    checkAdminAccess();
  }, [user, navigate, toast]);
  
  const handleAddJob = () => {
    toast({
      title: 'Feature in development',
      description: 'The add job feature will be available soon.',
    });
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
            <div>
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

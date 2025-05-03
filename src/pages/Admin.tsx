
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockJobs, mockUsers } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';
import { 
  Upload,
  Download,
  Trash2,
  Search,
  Plus,
  FileCheck2,
  Users,
  FileText
} from 'lucide-react';

const AdminPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Assume admin is logged in
  const [searchTerm, setSearchTerm] = useState('');
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // Filter jobs based on search term
  const filteredJobs = mockJobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Filter users based on search term
  const filteredUsers = mockUsers.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCsvFile(e.target.files[0]);
    }
  };
  
  const handleUpload = () => {
    if (!csvFile) {
      toast({
        title: 'No file selected',
        description: 'Please select a CSV file to upload.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsUploading(true);
    
    // Simulate file upload
    setTimeout(() => {
      setIsUploading(false);
      setCsvFile(null);
      toast({
        title: 'Upload successful',
        description: `${csvFile.name} has been processed successfully.`,
      });
    }, 2000);
  };
  
  const handleDeleteJob = (jobId: string) => {
    toast({
      title: 'Job deleted',
      description: `Job ID: ${jobId} has been removed.`,
    });
  };
  
  const handleDeleteUser = (userId: string) => {
    toast({
      title: 'User deleted',
      description: `User ID: ${userId} has been removed.`,
    });
  };
  
  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('/');
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar 
        isLoggedIn={isLoggedIn} 
        onLogin={() => {}} 
        onLogout={handleLogout} 
      />
      
      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
            <div>
              <Button className="bg-riser-purple hover:bg-riser-secondary-purple">
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
              <div className="bg-white p-6 rounded-lg border">
                <div className="flex justify-between mb-6">
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
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" /> Export
                  </Button>
                </div>
                
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">ID</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Posted On</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredJobs.map((job) => (
                        <TableRow key={job.id}>
                          <TableCell className="font-medium">{job.id.slice(0, 5)}...</TableCell>
                          <TableCell>{job.title}</TableCell>
                          <TableCell>{job.company}</TableCell>
                          <TableCell>{job.job_type}</TableCell>
                          <TableCell>{job.location}</TableCell>
                          <TableCell>{new Date(job.posted_at).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeleteJob(job.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                {filteredJobs.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No jobs found matching your search.</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="users">
              <div className="bg-white p-6 rounded-lg border">
                <div className="flex justify-between mb-6">
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input 
                      type="text" 
                      placeholder="Search users..." 
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Saved Jobs</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.id}</TableCell>
                          <TableCell>{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.savedJobs?.length || 0}</TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="upload">
              <div className="bg-white p-6 rounded-lg border">
                <h2 className="text-xl font-semibold mb-4">Upload CSV File</h2>
                <p className="text-muted-foreground mb-6">
                  Upload a CSV file containing job listings. The file should include columns for title, company, location,
                  description, salary, job type, and more.
                </p>
                
                <div className="space-y-6">
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="csv-file">CSV File</Label>
                    <Input 
                      id="csv-file"
                      type="file" 
                      accept=".csv" 
                      onChange={handleFileChange}
                    />
                  </div>
                  
                  <div>
                    <Button
                      onClick={handleUpload}
                      disabled={!csvFile || isUploading}
                      className="bg-riser-purple hover:bg-riser-secondary-purple"
                    >
                      {isUploading ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Upload and Process
                        </>
                      )}
                    </Button>
                    {csvFile && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        Selected file: {csvFile.name}
                      </p>
                    )}
                  </div>
                  
                  <div className="mt-8 p-4 bg-green-50 text-green-800 rounded-md flex items-start">
                    <FileCheck2 className="h-5 w-5 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium">CSV Format Requirements:</p>
                      <ul className="list-disc pl-5 text-sm mt-1 space-y-1">
                        <li>Include headers: title, company, location, salary_min, salary_max, etc.</li>
                        <li>Use UTF-8 encoding</li>
                        <li>Max file size: 5MB</li>
                        <li>Required fields: title, company, location, job_type</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
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

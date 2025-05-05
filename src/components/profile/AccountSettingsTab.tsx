
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const AccountSettingsTab = () => {
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  
  const [userProfile, setUserProfile] = useState({
    name: '',
    email: '',
    password: '********',
  });
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Fetch user profile data
  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);
  
  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('name, email')
        .eq('id', user!.id)
        .single();
        
      if (error) throw error;
      
      if (data) {
        setUserProfile({
          name: data.name || '',
          email: data.email || user!.email || '',
          password: '********'
        });
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
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
  
  return (
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
  );
};

export default AccountSettingsTab;

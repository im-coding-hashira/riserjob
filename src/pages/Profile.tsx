
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProfileLayout from '@/components/profile/ProfileLayout';
import SavedJobsTab from '@/components/profile/SavedJobsTab';
import AccountSettingsTab from '@/components/profile/AccountSettingsTab';

const Profile = () => {
  return (
    <ProfileLayout>
      <Tabs defaultValue="saved-jobs" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="saved-jobs">Saved Jobs</TabsTrigger>
          <TabsTrigger value="account">Account Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="saved-jobs">
          <SavedJobsTab />
        </TabsContent>
        
        <TabsContent value="account">
          <AccountSettingsTab />
        </TabsContent>
      </Tabs>
    </ProfileLayout>
  );
};

export default Profile;

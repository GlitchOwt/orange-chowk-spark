import { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface ProfileSectionProps {
  userData: any;
}

const cities = [
  'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 
  'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Kochi', 'Chandigarh', 'Other'
];

export const ProfileSection = ({ userData }: ProfileSectionProps) => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileData, setProfileData] = useState({
    name: userData.name,
    profession: userData.profession,
    city: userData.city,
    email: userData.email,
    portfolio: userData.portfolio || ''
  });
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSaveProfile = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to update your profile.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Update profile in the profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          name: profileData.name,
          profession: profileData.profession,
          city: profileData.city,
          portfolio: profileData.portfolio
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Update user metadata to keep name consistent across the app
      const { error: authError } = await supabase.auth.updateUser({
        data: { name: profileData.name }
      });

      if (authError) throw authError;

      setIsEditingProfile(false);
      toast({
        title: "Profile updated!",
        description: "Your profile changes have been saved successfully.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card className="bg-white/80 backdrop-blur-sm border-orange-100/50 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-orange-900">Profile Settings</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditingProfile(!isEditingProfile)}
            disabled={isSubmitting}
            className="border-orange-200 text-orange-700 hover:bg-orange-50"
          >
            <Edit className="w-4 h-4 mr-2" />
            {isEditingProfile ? 'Cancel' : 'Edit'}
          </Button>
        </div>
        
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="bg-orange-500 text-white text-xl">
                {profileData.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-orange-900 font-semibold text-lg">{profileData.name}</h3>
              <p className="text-orange-700">{profileData.profession}</p>
              <p className="text-orange-700 text-sm">{profileData.city}</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label className="text-orange-800 mb-2">Name</Label>
              <Input 
                value={profileData.name}
                onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                disabled={!isEditingProfile || isSubmitting}
                className="bg-white/50 border-orange-200 focus:border-orange-500"
              />
            </div>
            <div>
              <Label className="text-orange-800 mb-2">Profession</Label>
              <Input 
                value={profileData.profession}
                onChange={(e) => setProfileData({...profileData, profession: e.target.value})}
                disabled={!isEditingProfile || isSubmitting}
                className="bg-white/50 border-orange-200 focus:border-orange-500"
              />
            </div>
            <div>
              <Label className="text-orange-800 mb-2">City</Label>
              <select
                value={profileData.city}
                onChange={(e) => setProfileData({...profileData, city: e.target.value})}
                disabled={!isEditingProfile || isSubmitting}
                className="flex h-10 w-full rounded-md border border-orange-200 bg-white/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select your city</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
            <div>
              <Label className="text-orange-800 mb-2">Email</Label>
              <Input 
                type="email" 
                value={profileData.email} 
                disabled
                className="bg-orange-50/50 border-orange-200 text-orange-600"
              />
            </div>
            <div className="md:col-span-2">
              <Label className="text-orange-800 mb-2">Portfolio</Label>
              <Input 
                type="url" 
                value={profileData.portfolio}
                onChange={(e) => setProfileData({...profileData, portfolio: e.target.value})}
                placeholder="https://your-portfolio.com"
                disabled={!isEditingProfile || isSubmitting}
                className="bg-white/50 border-orange-200 focus:border-orange-500"
              />
            </div>
          </div>
          
          {isEditingProfile && (
            <div className="flex gap-4">
              <Button 
                onClick={handleSaveProfile}
                disabled={isSubmitting}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </div>
                ) : (
                  'Save Changes'
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsEditingProfile(false)}
                disabled={isSubmitting}
                className="border-orange-200 text-orange-700 hover:bg-orange-50"
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};
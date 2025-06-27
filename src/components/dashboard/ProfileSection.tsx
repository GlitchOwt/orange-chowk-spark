
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface ProfileSectionProps {
  userData: any;
}

export const ProfileSection = ({ userData }: ProfileSectionProps) => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: userData.name,
    profession: userData.profession,
    city: userData.city,
    email: userData.email,
    portfolio: userData.portfolio || ''
  });
  const { toast } = useToast();

  const handleSaveProfile = () => {
    setIsEditingProfile(false);
    toast({
      title: "Profile updated!",
      description: "Your profile changes have been saved.",
    });
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
                disabled={!isEditingProfile}
                className="bg-white/50 border-orange-200 focus:border-orange-500"
              />
            </div>
            <div>
              <Label className="text-orange-800 mb-2">Profession</Label>
              <Input 
                value={profileData.profession}
                onChange={(e) => setProfileData({...profileData, profession: e.target.value})}
                disabled={!isEditingProfile}
                className="bg-white/50 border-orange-200 focus:border-orange-500"
              />
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
            <div>
              <Label className="text-orange-800 mb-2">Portfolio</Label>
              <Input 
                type="url" 
                value={profileData.portfolio}
                onChange={(e) => setProfileData({...profileData, portfolio: e.target.value})}
                placeholder="https://your-portfolio.com"
                disabled={!isEditingProfile}
                className="bg-white/50 border-orange-200 focus:border-orange-500"
              />
            </div>
          </div>
          
          {isEditingProfile && (
            <div className="flex gap-4">
              <Button 
                onClick={handleSaveProfile}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                Save Changes
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsEditingProfile(false)}
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

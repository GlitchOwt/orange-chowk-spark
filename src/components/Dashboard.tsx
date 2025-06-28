
import { useState } from 'react';
import { 
  User, 
  Calendar, 
  Users, 
  MessageSquare
} from 'lucide-react';
import { DashboardHeader } from './dashboard/DashboardHeader';
import { CommunityFeed } from './dashboard/CommunityFeed';
import { EventsSection } from './dashboard/EventsSection';
import { CityGroups } from './dashboard/CityGroups';
import { ProfileSection } from './dashboard/ProfileSection';

interface DashboardProps {
  userData: any;
}

export const Dashboard = ({ userData }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState('feed');
  const [selectedCityGroups] = useState(['Mumbai', 'Delhi']);

  const tabs = [
    { id: 'feed', label: 'Community Feed', icon: MessageSquare },
    { id: 'events', label: 'My Events', icon: Calendar },
    { id: 'groups', label: 'Groups', icon: Users },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-rose-50">
      <DashboardHeader 
        userData={userData}
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="max-w-6xl mx-auto px-6 pb-8">
        {activeTab === 'feed' && <CommunityFeed userData={userData} />}
        {activeTab === 'events' && <EventsSection userData={userData} />}
        {activeTab === 'groups' && <CityGroups selectedCityGroups={selectedCityGroups} />}
        {activeTab === 'profile' && <ProfileSection userData={userData} />}
      </div>
    </div>
  );
};

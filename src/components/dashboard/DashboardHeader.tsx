
import { User, Calendar, Users, MessageSquare } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface Tab {
  id: string;
  label: string;
  icon: any;
}

interface DashboardHeaderProps {
  userData: any;
  tabs: Tab[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const DashboardHeader = ({ userData, tabs, activeTab, setActiveTab }: DashboardHeaderProps) => {
  return (
    <>
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-orange-200/50 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-2xl font-bold text-orange-900">
                orange <span className="text-orange-500">chowk</span>
              </div>
              <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                Member
              </Badge>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-orange-800">Welcome, {userData.name}</span>
              <Avatar>
                <AvatarFallback className="bg-orange-500 text-white">
                  {userData.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex space-x-1 bg-white/70 backdrop-blur-sm rounded-lg p-1 mb-8 border border-orange-100/50 shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                activeTab === tab.id
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-orange-700 hover:text-orange-800 hover:bg-orange-50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

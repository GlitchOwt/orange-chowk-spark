
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Calendar, 
  Users, 
  MessageSquare, 
  Settings, 
  ExternalLink,
  Heart,
  MessageCircle,
  Share2,
  MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface DashboardProps {
  userData: any;
}

const mockEvents = [
  {
    id: 1,
    title: 'Creative Minds Meetup',
    date: '2024-01-15',
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=300&object=cover',
    location: 'Mumbai'
  },
  {
    id: 2,
    title: 'Design Thinking Workshop',
    date: '2024-01-20',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&object=cover',
    location: 'Delhi'
  }
];

const mockPosts = [
  {
    id: 1,
    author: 'Priya Sharma',
    content: 'Just launched my new illustration series inspired by Indian folklore! Would love to collaborate with fellow storytellers.',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=400&object=cover',
    likes: 24,
    comments: 8,
    time: '2 hours ago'
  },
  {
    id: 2,
    author: 'Arjun Mehta',
    content: 'Looking for a filmmaker to work on a documentary about street art in Bangalore. DM me if interested!',
    likes: 15,
    comments: 5,
    time: '4 hours ago'
  }
];

export const Dashboard = ({ userData }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState('feed');
  const [selectedCityGroups, setSelectedCityGroups] = useState(['Mumbai', 'Delhi']);

  const tabs = [
    { id: 'feed', label: 'Community Feed', icon: MessageSquare },
    { id: 'events', label: 'My Events', icon: Calendar },
    { id: 'groups', label: 'City Groups', icon: Users },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-900/10 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/80 backdrop-blur-sm border-b border-orange-500/20">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-2xl font-bold text-white">
                Orange <span className="text-orange-500">Chowk</span>
              </div>
              <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30">
                Member
              </Badge>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-slate-300">Welcome, {userData.name}</span>
              <Avatar>
                <AvatarFallback className="bg-orange-500 text-white">
                  {userData.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-slate-800/50 rounded-lg p-1 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                activeTab === tab.id
                  ? 'bg-orange-500 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Community Feed */}
        {activeTab === 'feed' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card className="bg-slate-800/80 border-slate-700 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Community Feed</h2>
              
              <div className="space-y-6">
                {mockPosts.map((post) => (
                  <motion.div
                    key={post.id}
                    className="bg-slate-700/50 rounded-lg p-4 border border-slate-600"
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar>
                        <AvatarFallback className="bg-orange-500/20 text-orange-300">
                          {post.author.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="text-white font-medium">{post.author}</h4>
                        <p className="text-slate-400 text-sm">{post.time}</p>
                      </div>
                    </div>
                    
                    <p className="text-slate-300 mb-4">{post.content}</p>
                    
                    {post.image && (
                      <img 
                        src={post.image} 
                        alt="Post content" 
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                    )}
                    
                    <div className="flex items-center gap-6 text-slate-400">
                      <button className="flex items-center gap-2 hover:text-orange-400 transition-colors">
                        <Heart className="w-4 h-4" />
                        {post.likes}
                      </button>
                      <button className="flex items-center gap-2 hover:text-orange-400 transition-colors">
                        <MessageCircle className="w-4 h-4" />
                        {post.comments}
                      </button>
                      <button className="flex items-center gap-2 hover:text-orange-400 transition-colors">
                        <Share2 className="w-4 h-4" />
                        Share
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card className="bg-slate-800/80 border-slate-700 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Your Event History</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {mockEvents.map((event) => (
                  <motion.div
                    key={event.id}
                    className="bg-slate-700/50 rounded-lg overflow-hidden border border-slate-600"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <img 
                      src={event.image} 
                      alt={event.title} 
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-white font-semibold mb-2">{event.title}</h3>
                      <div className="flex items-center gap-2 text-slate-400 text-sm">
                        <Calendar className="w-4 h-4" />
                        {event.date}
                      </div>
                      <div className="flex items-center gap-2 text-slate-400 text-sm mt-1">
                        <MapPin className="w-4 h-4" />
                        {event.location}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {/* City Groups Tab */}
        {activeTab === 'groups' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card className="bg-slate-800/80 border-slate-700 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">City Groups</h2>
              <p className="text-slate-400 mb-6">You can join up to 2 city groups at a time.</p>
              
              <div className="space-y-4">
                {selectedCityGroups.map((city) => (
                  <div key={city} className="flex items-center justify-between bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-orange-400" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">{city} Creatives</h3>
                        <p className="text-slate-400 text-sm">Active community group</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="bg-orange-500 hover:bg-orange-600 text-white"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Join WhatsApp
                    </Button>
                  </div>
                ))}
                
                <div className="text-center py-4">
                  <p className="text-slate-400 text-sm">
                    Want to switch groups? Contact us to make changes.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card className="bg-slate-800/80 border-slate-700 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Profile Settings</h2>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarFallback className="bg-orange-500 text-white text-xl">
                      {userData.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-white font-semibold text-lg">{userData.name}</h3>
                    <p className="text-slate-400">{userData.profession}</p>
                    <p className="text-slate-400 text-sm">{userData.city}</p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 mb-2">Email</label>
                    <input 
                      type="email" 
                      value={userData.email} 
                      readOnly
                      className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-2">Portfolio</label>
                    <input 
                      type="url" 
                      value={userData.portfolio || ''} 
                      placeholder="https://your-portfolio.com"
                      className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white"
                    />
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                    Save Changes
                  </Button>
                  <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

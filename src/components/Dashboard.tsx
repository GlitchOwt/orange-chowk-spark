
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
  MapPin,
  Plus,
  Edit
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

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
    time: '2 hours ago',
    liked: false
  },
  {
    id: 2,
    author: 'Arjun Mehta',
    content: 'Looking for a filmmaker to work on a documentary about street art in Bangalore. DM me if interested!',
    likes: 15,
    comments: 5,
    time: '4 hours ago',
    liked: false
  }
];

export const Dashboard = ({ userData }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState('feed');
  const [selectedCityGroups, setSelectedCityGroups] = useState(['Mumbai', 'Delhi']);
  const [posts, setPosts] = useState(mockPosts);
  const [newPost, setNewPost] = useState('');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: userData.name,
    profession: userData.profession,
    city: userData.city,
    email: userData.email,
    portfolio: userData.portfolio || ''
  });
  const { toast } = useToast();

  const tabs = [
    { id: 'feed', label: 'Community Feed', icon: MessageSquare },
    { id: 'events', label: 'My Events', icon: Calendar },
    { id: 'groups', label: 'City Groups', icon: Users },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  const handleLike = (postId: number) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const handleShare = (postId: number) => {
    navigator.clipboard.writeText(`${window.location.origin}/post/${postId}`);
    toast({
      title: "Link copied!",
      description: "Post link has been copied to clipboard.",
    });
  };

  const handleCreatePost = () => {
    if (newPost.trim()) {
      const post = {
        id: posts.length + 1,
        author: userData.name,
        content: newPost,
        image: null,
        likes: 0,
        comments: 0,
        time: 'Just now',
        liked: false
      };
      setPosts([post, ...posts]);
      setNewPost('');
      toast({
        title: "Post created!",
        description: "Your post has been shared with the community.",
      });
    }
  };

  const handleJoinWhatsApp = (city: string) => {
    toast({
      title: "WhatsApp group link sent!",
      description: `Check your email for the ${city} Creatives WhatsApp group link.`,
    });
  };

  const handleSaveProfile = () => {
    setIsEditingProfile(false);
    toast({
      title: "Profile updated!",
      description: "Your profile changes have been saved.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-rose-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-orange-200/50 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-2xl font-bold text-slate-800">
                orange <span className="text-orange-500">chowk</span>
              </div>
              <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                Member
              </Badge>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-slate-700">Welcome, {userData.name}</span>
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
        <div className="flex space-x-1 bg-white/70 backdrop-blur-sm rounded-lg p-1 mb-8 border border-orange-100/50 shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                activeTab === tab.id
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-800 hover:bg-orange-50'
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
            {/* Create Post */}
            <Card className="bg-white/80 backdrop-blur-sm border-orange-100/50 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Share with the community</h3>
              <div className="space-y-4">
                <textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="What's on your creative mind?"
                  className="w-full p-3 border border-orange-200 rounded-lg resize-none h-24 focus:outline-none focus:ring-2 focus:ring-orange-500/50 bg-white/50"
                />
                <Button 
                  onClick={handleCreatePost}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                  disabled={!newPost.trim()}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Share Post
                </Button>
              </div>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-orange-100/50 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">Community Feed</h2>
              
              <div className="space-y-6">
                {posts.map((post) => (
                  <motion.div
                    key={post.id}
                    className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-orange-100/30 shadow-sm"
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar>
                        <AvatarFallback className="bg-orange-100 text-orange-700">
                          {post.author.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="text-slate-800 font-medium">{post.author}</h4>
                        <p className="text-slate-600 text-sm">{post.time}</p>
                      </div>
                    </div>
                    
                    <p className="text-slate-700 mb-4">{post.content}</p>
                    
                    {post.image && (
                      <img 
                        src={post.image} 
                        alt="Post content" 
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                    )}
                    
                    <div className="flex items-center gap-6 text-slate-600">
                      <button 
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center gap-2 hover:text-orange-500 transition-colors ${
                          post.liked ? 'text-orange-500' : ''
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${post.liked ? 'fill-current' : ''}`} />
                        {post.likes}
                      </button>
                      <button className="flex items-center gap-2 hover:text-orange-500 transition-colors">
                        <MessageCircle className="w-4 h-4" />
                        {post.comments}
                      </button>
                      <button 
                        onClick={() => handleShare(post.id)}
                        className="flex items-center gap-2 hover:text-orange-500 transition-colors"
                      >
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
            <Card className="bg-white/80 backdrop-blur-sm border-orange-100/50 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">Your Event History</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {mockEvents.map((event) => (
                  <motion.div
                    key={event.id}
                    className="bg-white/60 backdrop-blur-sm rounded-lg overflow-hidden border border-orange-100/30 shadow-sm"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <img 
                      src={event.image} 
                      alt={event.title} 
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-slate-800 font-semibold mb-2">{event.title}</h3>
                      <div className="flex items-center gap-2 text-slate-600 text-sm">
                        <Calendar className="w-4 h-4" />
                        {event.date}
                      </div>
                      <div className="flex items-center gap-2 text-slate-600 text-sm mt-1">
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
            <Card className="bg-white/80 backdrop-blur-sm border-orange-100/50 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">City Groups</h2>
              <p className="text-slate-600 mb-6">You can join up to 2 city groups at a time.</p>
              
              <div className="space-y-4">
                {selectedCityGroups.map((city) => (
                  <div key={city} className="flex items-center justify-between bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-orange-100/30 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="text-slate-800 font-semibold">{city} Creatives</h3>
                        <p className="text-slate-600 text-sm">Active community group</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleJoinWhatsApp(city)}
                      className="bg-orange-500 hover:bg-orange-600 text-white"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Join WhatsApp
                    </Button>
                  </div>
                ))}
                
                <div className="text-center py-4">
                  <p className="text-slate-600 text-sm">
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
            <Card className="bg-white/80 backdrop-blur-sm border-orange-100/50 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-slate-800">Profile Settings</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  className="border-orange-200 text-slate-700 hover:bg-orange-50"
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
                    <h3 className="text-slate-800 font-semibold text-lg">{profileData.name}</h3>
                    <p className="text-slate-600">{profileData.profession}</p>
                    <p className="text-slate-600 text-sm">{profileData.city}</p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-700 mb-2">Name</Label>
                    <Input 
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      disabled={!isEditingProfile}
                      className="bg-white/50 border-orange-200 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-700 mb-2">Profession</Label>
                    <Input 
                      value={profileData.profession}
                      onChange={(e) => setProfileData({...profileData, profession: e.target.value})}
                      disabled={!isEditingProfile}
                      className="bg-white/50 border-orange-200 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-700 mb-2">Email</Label>
                    <Input 
                      type="email" 
                      value={profileData.email} 
                      disabled
                      className="bg-orange-50/50 border-orange-200 text-slate-500"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-700 mb-2">Portfolio</Label>
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
                      className="border-orange-200 text-slate-700 hover:bg-orange-50"
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

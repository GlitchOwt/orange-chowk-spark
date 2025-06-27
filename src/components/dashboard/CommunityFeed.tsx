
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart,
  MessageCircle,
  Share2,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

interface Post {
  id: number;
  author: string;
  content: string;
  image?: string | null;
  likes: number;
  comments: number;
  time: string;
  liked: boolean;
}

interface CommunityFeedProps {
  userData: any;
}

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

export const CommunityFeed = ({ userData }: CommunityFeedProps) => {
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [newPost, setNewPost] = useState('');
  const { toast } = useToast();

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Create Post */}
      <Card className="bg-white/80 backdrop-blur-sm border-orange-100/50 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-orange-900 mb-4">Share with the community</h3>
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
        <h2 className="text-xl font-semibold text-orange-900 mb-4">Community Feed</h2>
        
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
                  <h4 className="text-orange-900 font-medium">{post.author}</h4>
                  <p className="text-orange-700 text-sm">{post.time}</p>
                </div>
              </div>
              
              <p className="text-orange-800 mb-4">{post.content}</p>
              
              {post.image && (
                <img 
                  src={post.image} 
                  alt="Post content" 
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}
              
              <div className="flex items-center gap-6 text-orange-700">
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
  );
};

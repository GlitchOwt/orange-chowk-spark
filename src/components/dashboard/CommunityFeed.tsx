
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart,
  MessageCircle,
  Share2,
  Plus,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { usePosts } from '@/hooks/usePosts';
import { formatDistanceToNow } from 'date-fns';

interface CommunityFeedProps {
  userData: any;
}

export const CommunityFeed = ({ userData }: CommunityFeedProps) => {
  const [newPost, setNewPost] = useState('');
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const { posts, loading, createPost, toggleLike } = usePosts();

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleShare = (postId: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/post/${postId}`);
    toast({
      title: "Link copied!",
      description: "Post link has been copied to clipboard.",
    });
  };

  const handleCreatePost = async () => {
    if (newPost.trim()) {
      await createPost(newPost.trim());
      setNewPost('');
    }
  };

  const handleLike = async (postId: string) => {
    await toggleLike(postId);
  };

  const isLiked = (post: any) => {
    return post.post_likes.some((like: any) => like.user_id === user?.id);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-orange-600">Loading posts...</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header with sign out */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-orange-900">Welcome, {userData?.name}!</h2>
        <Button
          onClick={signOut}
          variant="outline"
          size="sm"
          className="border-orange-200 text-orange-700 hover:bg-orange-50"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>

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
        
        {posts.length === 0 ? (
          <div className="text-center py-8 text-orange-700">
            <p>No posts yet. Be the first to share something!</p>
          </div>
        ) : (
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
                      {getInitials(post.profiles.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="text-orange-900 font-medium">{post.profiles.name}</h4>
                    <p className="text-orange-700 text-sm">
                      {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                
                <p className="text-orange-800 mb-4">{post.content}</p>
                
                {post.image_url && (
                  <img 
                    src={post.image_url} 
                    alt="Post content" 
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                
                <div className="flex items-center gap-6 text-orange-700">
                  <button 
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-2 hover:text-orange-500 transition-colors ${
                      isLiked(post) ? 'text-orange-500' : ''
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isLiked(post) ? 'fill-current' : ''}`} />
                    {post.post_likes.length}
                  </button>
                  <button className="flex items-center gap-2 hover:text-orange-500 transition-colors">
                    <MessageCircle className="w-4 h-4" />
                    {post.post_comments.length}
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
        )}
      </Card>
    </motion.div>
  );
};

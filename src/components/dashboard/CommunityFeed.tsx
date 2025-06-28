import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart,
  MessageCircle,
  Share2,
  Plus,
  LogOut,
  Send,
  Trash2
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

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const postVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  },
  hover: {
    y: -4,
    scale: 1.01,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  }
};

const buttonVariants = {
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2
    }
  },
  tap: {
    scale: 0.95
  }
};

const likeVariants = {
  liked: {
    scale: [1, 1.3, 1],
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

const commentVariants = {
  hidden: { opacity: 0, height: 0, y: -10 },
  visible: {
    opacity: 1,
    height: "auto",
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
  exit: {
    opacity: 0,
    height: 0,
    y: -10,
    transition: {
      duration: 0.2
    }
  }
};

export const CommunityFeed = ({ userData }: CommunityFeedProps) => {
  const [newPost, setNewPost] = useState('');
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [newComments, setNewComments] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const { posts, loading, createPost, toggleLike, addComment, deleteComment } = usePosts();

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

  const toggleComments = (postId: string) => {
    const newExpanded = new Set(expandedComments);
    if (newExpanded.has(postId)) {
      newExpanded.delete(postId);
    } else {
      newExpanded.add(postId);
    }
    setExpandedComments(newExpanded);
  };

  const handleAddComment = async (postId: string) => {
    const content = newComments[postId];
    if (content?.trim()) {
      await addComment(postId, content);
      setNewComments(prev => ({ ...prev, [postId]: '' }));
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    await deleteComment(commentId);
  };

  const isLiked = (post: any) => {
    return post.post_likes.some((like: any) => like.user_id === user?.id);
  };

  const isCommentOwner = (comment: any) => {
    return comment.user_id === user?.id;
  };

  if (loading) {
    return (
      <motion.div 
        className="flex items-center justify-center py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div 
          className="text-orange-600"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Loading posts...
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header with sign out */}
      <motion.div 
        className="flex justify-between items-center"
        variants={itemVariants}
      >
        <h2 className="text-2xl font-bold text-orange-900">Welcome, {userData?.name}!</h2>
        <motion.div
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <Button
            onClick={signOut}
            variant="outline"
            size="sm"
            className="border-orange-200 text-orange-700 hover:bg-orange-50"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </motion.div>
      </motion.div>

      {/* Create Post */}
      <motion.div variants={itemVariants}>
        <Card className="bg-white/80 backdrop-blur-sm border-orange-100/50 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-orange-900 mb-4">Share with the community</h3>
          <div className="space-y-4">
            <motion.textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="What's on your creative mind?"
              className="w-full p-3 border border-orange-200 rounded-lg resize-none h-24 focus:outline-none focus:ring-2 focus:ring-orange-500/50 bg-white/50 transition-all duration-200"
              whileFocus={{ scale: 1.01 }}
            />
            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Button 
                onClick={handleCreatePost}
                className="bg-orange-500 hover:bg-orange-600 text-white"
                disabled={!newPost.trim()}
              >
                <Plus className="w-4 h-4 mr-2" />
                Share Post
              </Button>
            </motion.div>
          </div>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="bg-white/80 backdrop-blur-sm border-orange-100/50 p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-orange-900 mb-4">Community Feed</h2>
          
          {posts.length === 0 ? (
            <motion.div 
              className="text-center py-8 text-orange-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p>No posts yet. Be the first to share something!</p>
            </motion.div>
          ) : (
            <motion.div 
              className="space-y-6"
              variants={containerVariants}
            >
              <AnimatePresence>
                {posts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-orange-100/30 shadow-sm"
                    variants={postVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    layout
                    transition={{ delay: index * 0.1 }}
                  >
                    <motion.div 
                      className="flex items-center gap-3 mb-3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                    >
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
                    </motion.div>
                    
                    <motion.p 
                      className="text-orange-800 mb-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                    >
                      {post.content}
                    </motion.p>
                    
                    {post.image_url && (
                      <motion.img 
                        src={post.image_url} 
                        alt="Post content" 
                        className="w-full h-48 object-cover rounded-lg mb-4"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 + 0.4 }}
                        whileHover={{ scale: 1.02 }}
                      />
                    )}
                    
                    <motion.div 
                      className="flex items-center gap-6 text-orange-700 mb-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 + 0.5 }}
                    >
                      <motion.button 
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center gap-2 hover:text-orange-500 transition-colors ${
                          isLiked(post) ? 'text-orange-500' : ''
                        }`}
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        animate={isLiked(post) ? "liked" : ""}
                      >
                        <motion.div variants={likeVariants}>
                          <Heart className={`w-4 h-4 ${isLiked(post) ? 'fill-current' : ''}`} />
                        </motion.div>
                        {post.post_likes.length}
                      </motion.button>
                      <motion.button 
                        onClick={() => toggleComments(post.id)}
                        className="flex items-center gap-2 hover:text-orange-500 transition-colors"
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                      >
                        <MessageCircle className="w-4 h-4" />
                        {post.post_comments.length}
                      </motion.button>
                      <motion.button 
                        onClick={() => handleShare(post.id)}
                        className="flex items-center gap-2 hover:text-orange-500 transition-colors"
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                      >
                        <Share2 className="w-4 h-4" />
                        Share
                      </motion.button>
                    </motion.div>

                    {/* Comments Section */}
                    <AnimatePresence>
                      {expandedComments.has(post.id) && (
                        <motion.div
                          className="border-t border-orange-100 pt-4 space-y-4"
                          variants={commentVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                        >
                          {/* Existing Comments */}
                          {post.post_comments.length > 0 && (
                            <div className="space-y-3">
                              <AnimatePresence>
                                {post.post_comments.map((comment, commentIndex) => (
                                  <motion.div 
                                    key={comment.id} 
                                    className="flex gap-3 bg-orange-50/50 rounded-lg p-3"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ delay: commentIndex * 0.05 }}
                                  >
                                    <Avatar className="w-8 h-8">
                                      <AvatarFallback className="bg-orange-200 text-orange-700 text-xs">
                                        {getInitials(comment.profiles.name)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                          <span className="text-orange-900 font-medium text-sm">
                                            {comment.profiles.name}
                                          </span>
                                          <span className="text-orange-600 text-xs">
                                            {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                                          </span>
                                        </div>
                                        {isCommentOwner(comment) && (
                                          <motion.button
                                            onClick={() => handleDeleteComment(comment.id)}
                                            className="text-orange-400 hover:text-red-500 transition-colors"
                                            variants={buttonVariants}
                                            whileHover="hover"
                                            whileTap="tap"
                                          >
                                            <Trash2 className="w-3 h-3" />
                                          </motion.button>
                                        )}
                                      </div>
                                      <p className="text-orange-800 text-sm mt-1">{comment.content}</p>
                                    </div>
                                  </motion.div>
                                ))}
                              </AnimatePresence>
                            </div>
                          )}

                          {/* Add Comment */}
                          <motion.div 
                            className="flex gap-3"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                          >
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="bg-orange-100 text-orange-700 text-xs">
                                {getInitials(userData?.name || 'U')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 flex gap-2">
                              <motion.input
                                type="text"
                                value={newComments[post.id] || ''}
                                onChange={(e) => setNewComments(prev => ({ 
                                  ...prev, 
                                  [post.id]: e.target.value 
                                }))}
                                placeholder="Write a comment..."
                                className="flex-1 px-3 py-2 border border-orange-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 bg-white/50 transition-all duration-200"
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    handleAddComment(post.id);
                                  }
                                }}
                                whileFocus={{ scale: 1.01 }}
                              />
                              <motion.div
                                variants={buttonVariants}
                                whileHover="hover"
                                whileTap="tap"
                              >
                                <Button
                                  size="sm"
                                  onClick={() => handleAddComment(post.id)}
                                  disabled={!newComments[post.id]?.trim()}
                                  className="bg-orange-500 hover:bg-orange-600 text-white px-3"
                                >
                                  <Send className="w-3 h-3" />
                                </Button>
                              </motion.div>
                            </div>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </Card>
      </motion.div>
    </motion.div>
  );
};
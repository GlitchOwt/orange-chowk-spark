import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Post {
  id: string;
  content: string;
  image_url?: string;
  created_at: string;
  user_id: string;
  profiles: {
    name: string;
    avatar_url?: string;
  };
  post_likes: { user_id: string }[];
  post_comments: { 
    id: string; 
    content: string; 
    created_at: string;
    profiles: { name: string } 
  }[];
}

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles!posts_user_id_fkey (name, avatar_url),
          post_likes (user_id),
          post_comments (
            id,
            content,
            created_at,
            profiles!post_comments_user_id_fkey (name)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Sort comments by creation date for each post
      const postsWithSortedComments = data?.map(post => ({
        ...post,
        post_comments: post.post_comments.sort((a, b) => 
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        )
      })) || [];
      
      setPosts(postsWithSortedComments);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: "Error",
        description: "Failed to load posts",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (content: string, imageUrl?: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('posts')
        .insert([{
          content,
          image_url: imageUrl,
          user_id: user.id
        }]);

      if (error) throw error;

      toast({
        title: "Post created!",
        description: "Your post has been shared with the community."
      });

      fetchPosts(); // Refresh posts
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Error",
        description: "Failed to create post",
        variant: "destructive"
      });
    }
  };

  const toggleLike = async (postId: string) => {
    if (!user) return;

    try {
      const existingLike = posts
        .find(p => p.id === postId)
        ?.post_likes
        .find(like => like.user_id === user.id);

      if (existingLike) {
        const { error } = await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('post_likes')
          .insert([{ post_id: postId, user_id: user.id }]);

        if (error) throw error;
      }

      fetchPosts(); // Refresh posts
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "Error",
        description: "Failed to update like",
        variant: "destructive"
      });
    }
  };

  const addComment = async (postId: string, content: string) => {
    if (!user || !content.trim()) return;

    try {
      const { error } = await supabase
        .from('post_comments')
        .insert([{
          post_id: postId,
          user_id: user.id,
          content: content.trim()
        }]);

      if (error) throw error;

      toast({
        title: "Comment added!",
        description: "Your comment has been posted."
      });

      fetchPosts(); // Refresh posts to show new comment
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive"
      });
    }
  };

  const deleteComment = async (commentId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('post_comments')
        .delete()
        .eq('id', commentId)
        .eq('user_id', user.id); // Ensure user can only delete their own comments

      if (error) throw error;

      toast({
        title: "Comment deleted",
        description: "Your comment has been removed."
      });

      fetchPosts(); // Refresh posts
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast({
        title: "Error",
        description: "Failed to delete comment",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchPosts();

    // Set up real-time subscription for posts
    const channel = supabase
      .channel('posts-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'posts'
      }, () => {
        fetchPosts();
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'post_likes'
      }, () => {
        fetchPosts();
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'post_comments'
      }, () => {
        fetchPosts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    posts,
    loading,
    createPost,
    toggleLike,
    addComment,
    deleteComment,
    refetch: fetchPosts
  };
};
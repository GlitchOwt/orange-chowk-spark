
-- First, let's check what foreign key constraints already exist and fix them properly
-- Drop existing constraints if they reference auth.users instead of profiles
ALTER TABLE public.posts 
DROP CONSTRAINT IF EXISTS posts_user_id_fkey;

ALTER TABLE public.post_comments 
DROP CONSTRAINT IF EXISTS post_comments_user_id_fkey;

ALTER TABLE public.post_likes 
DROP CONSTRAINT IF EXISTS post_likes_user_id_fkey;

-- Now add the correct foreign key relationships to profiles table
ALTER TABLE public.posts 
ADD CONSTRAINT posts_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.post_comments 
ADD CONSTRAINT post_comments_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.post_likes 
ADD CONSTRAINT post_likes_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

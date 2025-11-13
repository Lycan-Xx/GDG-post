import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Post } from '../types/models';
import type { PostContextValue } from '../types/props';
import { postService } from '../services/postService';
import { useAuth } from './AuthContext';

const PostContext = createContext<PostContextValue | undefined>(undefined);

const POSTS_PER_PAGE = 10;

export function PostProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const refreshPosts = useCallback(async () => {
    setLoading(true);
    try {
      const newPosts = await postService.getPosts(POSTS_PER_PAGE, 0);
      setPosts(newPosts);
      setOffset(POSTS_PER_PAGE);
      setHasMore(newPosts.length === POSTS_PER_PAGE);
    } catch (error) {
      console.error('Failed to refresh posts:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMorePosts = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const newPosts = await postService.getPosts(POSTS_PER_PAGE, offset);
      if (newPosts.length === 0) {
        setHasMore(false);
      } else {
        setPosts(prev => [...prev, ...newPosts]);
        setOffset(prev => prev + POSTS_PER_PAGE);
        setHasMore(newPosts.length === POSTS_PER_PAGE);
      }
    } catch (error) {
      console.error('Failed to load more posts:', error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, offset]);

  const createPost = useCallback(async (post: Omit<Post, 'id' | 'timestamp'>) => {
    try {
      const newPost = await postService.createPost(post);
      setPosts(prev => [newPost, ...prev]);
    } catch (error) {
      console.error('Failed to create post:', error);
      throw error;
    }
  }, []);

  const deletePost = useCallback(async (postId: string) => {
    try {
      await postService.deletePost(postId);
      setPosts(prev => prev.filter(post => post.id !== postId));
    } catch (error) {
      console.error('Failed to delete post:', error);
      throw error;
    }
  }, []);

  const likePost = useCallback(async (postId: string) => {
    if (!user) return;

    try {
      await postService.likePost(postId, user.id);
      
      // Update local state optimistically
      setPosts(prev => prev.map(post => {
        if (post.id !== postId) return post;

        const hasLiked = post.likedBy.includes(user.id);
        return {
          ...post,
          likes: hasLiked ? post.likes - 1 : post.likes + 1,
          likedBy: hasLiked
            ? post.likedBy.filter(id => id !== user.id)
            : [...post.likedBy, user.id],
        };
      }));
    } catch (error) {
      console.error('Failed to like post:', error);
      throw error;
    }
  }, [user]);

  const value: PostContextValue = {
    posts,
    loading,
    refreshPosts,
    loadMorePosts,
    createPost,
    deletePost,
    likePost,
  };

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
}

export function usePosts() {
  const context = useContext(PostContext);
  if (context === undefined) {
    throw new Error('usePosts must be used within a PostProvider');
  }
  return context;
}

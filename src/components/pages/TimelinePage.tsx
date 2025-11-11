import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { usePosts } from '../../contexts/PostContext';
import { PostCardSkeleton } from '../shared/SkeletonLoader';
import { PostCard } from '../PostCard/PostCard';
import './TimelinePage.css';

export function TimelinePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { posts, loading, refreshPosts, loadMorePosts, likePost } = usePosts();
  const observerTarget = useRef<HTMLDivElement>(null);

  // Load initial posts
  useEffect(() => {
    refreshPosts();
  }, [refreshPosts]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          loadMorePosts();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [loading, loadMorePosts]);

  // Pull to refresh (future enhancement)
  // const handleRefresh = useCallback(async () => {
  //   setIsRefreshing(true);
  //   await refreshPosts();
  //   setIsRefreshing(false);
  // }, [refreshPosts]);

  const handleOwnProfileClick = () => {
    if (user) {
      navigate(`/profile/${user.id}`);
    }
  };

  const handleUploadClick = () => {
    navigate('/upload');
  };

  const handleLike = (postId: string) => {
    likePost(postId);
  };

  const handleProfileClick = (userId: string) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <div className="timeline-page">
      {/* Header */}
      <header className="timeline-header">
        <h1 className="timeline-logo">GDG Post</h1>
        <button 
          className="timeline-profile-button"
          onClick={handleOwnProfileClick}
          aria-label="View profile"
        >
          <img 
            src={user?.profilePicture} 
            alt={user?.displayName}
            className="timeline-profile-pic"
          />
          <span className="timeline-profile-name">{user?.displayName}</span>
        </button>
      </header>



      {/* Posts Feed */}
      <main className="timeline-feed">
        {loading && posts.length === 0 ? (
          // Initial loading state
          <>
            <PostCardSkeleton />
            <PostCardSkeleton />
            <PostCardSkeleton />
          </>
        ) : posts.length === 0 ? (
          // Empty state
          <div className="timeline-empty">
            <p>No posts yet. Be the first to share!</p>
          </div>
        ) : (
          // Posts list
          <>
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLike={handleLike}
                onProfileClick={handleProfileClick}
              />
            ))}
            
            {/* Loading more indicator */}
            {loading && <PostCardSkeleton />}
            
            {/* Intersection observer target */}
            <div ref={observerTarget} style={{ height: '20px' }} />
          </>
        )}
      </main>

      {/* Floating Upload Button */}
      <button 
        className="timeline-upload-button"
        onClick={handleUploadClick}
        aria-label="Upload post"
      >
        <span className="upload-icon">+</span>
        <span className="upload-text">upload</span>
      </button>
    </div>
  );
}

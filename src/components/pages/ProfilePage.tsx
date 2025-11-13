import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';
import { usePosts } from '../../contexts/PostContext';
import { postService } from '../../services/postService';
import type { Post } from '../../types/models';
import { Button } from '../shared/Button';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import { Card } from '../shared/Card';
import './ProfilePage.css';

export function ProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { user: currentUser, signOut } = useAuth();
  const { deletePost } = usePosts();

  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const isOwnProfile = currentUser?.id === userId;
  const profileUser = isOwnProfile ? currentUser : null;

  useEffect(() => {
    const loadUserPosts = async () => {
      if (!userId) return;

      setLoading(true);
      try {
        const posts = await postService.getUserPosts(userId);
        setUserPosts(posts);
      } catch (error) {
        console.error('Failed to load user posts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserPosts();
  }, [userId]);

  const handleBack = () => {
    navigate('/timeline');
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  const handleDeleteClick = (postId: string) => {
    setDeleteConfirm(postId);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;

    try {
      await deletePost(deleteConfirm);
      setUserPosts(prev => prev.filter(p => p.id !== deleteConfirm));
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm(null);
  };

  const handlePostClick = (postId: string) => {
    navigate(`/post/${postId}`);
  };

  if (!profileUser && isOwnProfile) {
    return (
      <div className="profile-page">
        <div className="profile-error">User not found</div>
      </div>
    );
  }

  const totalLikes = userPosts.reduce((sum, post) => sum + post.likes, 0);

  return (
    <div className="profile-page">
      {/* Back Button */}
      <button className="profile-back-button" onClick={handleBack}>
        ← Back to Timeline
      </button>

      {/* Profile Header */}
      <Card className="profile-header">
        <div className="profile-header-content">
          <img 
            src={profileUser?.profilePicture} 
            alt={profileUser?.displayName}
            className="profile-picture"
          />
          <div className="profile-info">
            <h1 className="profile-name">{profileUser?.displayName}</h1>
            {isOwnProfile && (
              <p className="profile-email">{profileUser?.email}</p>
            )}
            <p className="profile-join-date">
              Member since {profileUser?.joinDate ? format(profileUser.joinDate, 'MMMM yyyy') : 'Unknown'}
            </p>
            <p className="profile-stats">
              {userPosts.length} posts • {totalLikes} total likes received
            </p>
          </div>
        </div>
        {isOwnProfile && (
          <Button variant="secondary" onClick={handleSignOut} className="profile-signout">
            sign out
          </Button>
        )}
      </Card>

      {/* Posts Section */}
      <div className="profile-posts-section">
        <h2 className="profile-section-title">
          {isOwnProfile ? 'My uploads' : 'Posts'}
        </h2>

        {loading ? (
          <div className="profile-loading">
            <LoadingSpinner size="large" />
          </div>
        ) : userPosts.length === 0 ? (
          <div className="profile-empty">
            <p>
              {isOwnProfile 
                ? "You haven't posted yet. Share your first memory!"
                : "This user hasn't posted yet."}
            </p>
          </div>
        ) : (
          <div className="profile-posts-grid">
            {userPosts.map((post) => (
              <div key={post.id} className="profile-post-item">
                <div 
                  className="profile-post-thumbnail"
                  onClick={() => handlePostClick(post.id)}
                  role="button"
                  tabIndex={0}
                >
                  <img 
                    src={post.media[0].url} 
                    alt={post.description}
                    className="profile-post-image"
                  />
                  {post.media[0].type === 'video' && (
                    <span className="profile-post-play-icon">▶</span>
                  )}
                  <div className="profile-post-overlay">
                    <span className="profile-post-likes">
                      👍 {post.likes}
                    </span>
                  </div>
                </div>

                {isOwnProfile && (
                  <button
                    className="profile-post-menu"
                    onClick={() => handleDeleteClick(post.id)}
                    aria-label="Delete post"
                  >
                    ⋮
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteConfirm && (
        <div className="profile-dialog-overlay">
          <Card className="profile-dialog">
            <h3 className="profile-dialog-title">Delete this post?</h3>
            <p className="profile-dialog-message">This cannot be undone.</p>
            <div className="profile-dialog-actions">
              <Button variant="secondary" onClick={handleDeleteCancel}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDeleteConfirm}>
                Delete
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

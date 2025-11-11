import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { postService } from '../../services/postService';
import { usePosts } from '../../contexts/PostContext';
import type { Post } from '../../types/models';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import './FullScreenGallery.css';

export function FullScreenGallery() {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { likePost } = usePosts();

  const [post, setPost] = useState<Post | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      if (!postId) return;

      setLoading(true);
      try {
        const posts = await postService.getPosts(100, 0);
        const foundPost = posts.find(p => p.id === postId);
        if (foundPost) {
          setPost(foundPost);
          // Set initial index from location state if provided
          const initialIndex = (location.state as { initialIndex?: number })?.initialIndex;
          if (initialIndex !== undefined) {
            setCurrentIndex(initialIndex);
          }
        }
      } catch (error) {
        console.error('Failed to load post:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [postId, location.state]);

  const handleClose = () => {
    navigate(-1);
  };

  const handlePrev = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    if (post) {
      setCurrentIndex(prev => Math.min(post.media.length - 1, prev + 1));
    }
  };

  const handleLike = () => {
    if (post) {
      likePost(post.id);
      // Update local state optimistically
      setPost(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          likes: prev.likes + 1,
        };
      });
    }
  };

  const handleDownload = async () => {
    if (!post) return;
    const media = post.media[currentIndex];
    
    try {
      const response = await fetch(media.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `gdg-post-${post.id}-${currentIndex}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleShare = async () => {
    if (!post) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'GDG Post',
          text: post.description,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Share failed:', error);
      }
    } else {
      // Fallback: copy link to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [post]);

  if (loading) {
    return (
      <div className="fullscreen-gallery">
        <div className="gallery-loading">
          <LoadingSpinner size="large" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="fullscreen-gallery">
        <div className="gallery-error">
          <p>Post not found</p>
          <button onClick={handleClose} className="gallery-close-button">
            Close
          </button>
        </div>
      </div>
    );
  }

  const currentMedia = post.media[currentIndex];
  const relativeTime = formatDistanceToNow(post.timestamp, { addSuffix: true });

  return (
    <div className="fullscreen-gallery">
      {/* Close Button */}
      <button 
        className="gallery-close"
        onClick={handleClose}
        aria-label="Close gallery"
      >
        ×
      </button>

      {/* Media Display */}
      <div className="gallery-media-container">
        {currentMedia.type === 'image' ? (
          <img 
            src={currentMedia.url} 
            alt="Full size"
            className="gallery-media-image"
          />
        ) : (
          <video 
            src={currentMedia.url}
            className="gallery-media-video"
            controls
            autoPlay
          />
        )}

        {/* Navigation Arrows */}
        {post.media.length > 1 && (
          <>
            {currentIndex > 0 && (
              <button 
                className="gallery-nav gallery-nav-prev"
                onClick={handlePrev}
                aria-label="Previous"
              >
                ‹
              </button>
            )}

            {currentIndex < post.media.length - 1 && (
              <button 
                className="gallery-nav gallery-nav-next"
                onClick={handleNext}
                aria-label="Next"
              >
                ›
              </button>
            )}

            {/* Page Indicators */}
            <div className="gallery-indicators">
              {currentIndex + 1} / {post.media.length}
            </div>
          </>
        )}
      </div>

      {/* Post Info */}
      <div className="gallery-info">
        <div className="gallery-author">
          <img 
            src={post.userProfilePicture} 
            alt={post.userName}
            className="gallery-author-pic"
          />
          <div className="gallery-author-details">
            <span className="gallery-author-name">{post.userName}</span>
            <span className="gallery-timestamp">{relativeTime}</span>
          </div>
        </div>

        {post.description && (
          <p className="gallery-description">{post.description}</p>
        )}

        {/* Actions */}
        <div className="gallery-actions">
          <button 
            className="gallery-action-button"
            onClick={handleLike}
            aria-label="Like"
          >
            <span className="action-icon">👍</span>
            <span>{post.likes}</span>
          </button>

          <button 
            className="gallery-action-button"
            onClick={handleDownload}
            aria-label="Download"
          >
            <span className="action-icon">⬇️</span>
            <span>Download</span>
          </button>

          <button 
            className="gallery-action-button"
            onClick={handleShare}
            aria-label="Share"
          >
            <span className="action-icon">↗️</span>
            <span>Share</span>
          </button>
        </div>
      </div>
    </div>
  );
}

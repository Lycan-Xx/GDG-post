import { useState, useRef } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import type { PostCardProps } from '../../types/props';
import { Card } from '../shared/Card';
import './PostCard.css';

export function PostCard({ post, onLike, onProfileClick }: PostCardProps) {
  const navigate = useNavigate();
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const lastTapRef = useRef<number>(0);

  const handleImageClick = () => {
    // Navigate to full-screen gallery
    navigate(`/post/${post.id}`, { state: { initialIndex: currentMediaIndex } });
  };

  const handleDoubleTap = () => {
    const now = Date.now();
    const timeSinceLastTap = now - lastTapRef.current;
    
    if (timeSinceLastTap < 300 && timeSinceLastTap > 0) {
      // Double tap detected
      onLike(post.id);
    }
    
    lastTapRef.current = now;
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLike(post.id);
  };

  const handleProfileClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onProfileClick(post.userId);
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const media = post.media[currentMediaIndex];
    
    try {
      const response = await fetch(media.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `gdg-post-${post.id}-${currentMediaIndex}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handlePrevMedia = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentMediaIndex(prev => Math.max(0, prev - 1));
  };

  const handleNextMedia = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentMediaIndex(prev => Math.min(post.media.length - 1, prev + 1));
  };

  const currentMedia = post.media[currentMediaIndex];
  const relativeTime = formatDistanceToNow(post.timestamp, { addSuffix: true });

  return (
    <Card className="post-card">
      {/* Post Header */}
      <div className="post-header">
        <button 
          className="post-author"
          onClick={handleProfileClick}
        >
          <img 
            src={post.userProfilePicture} 
            alt={post.userName}
            className="post-author-pic"
          />
          <div className="post-author-info">
            <span className="post-author-name">{post.userName}</span>
            <span className="post-timestamp">{relativeTime}</span>
          </div>
        </button>
      </div>

      {/* Post Description */}
      {post.description && (
        <p className="post-description">{post.description}</p>
      )}

      {/* Post Media */}
      <div className="post-media-container">
        <div 
          className="post-media"
          onClick={handleImageClick}
          onTouchEnd={handleDoubleTap}
        >
          {currentMedia.type === 'image' ? (
            <img 
              src={currentMedia.url} 
              alt="Post content"
              className="post-media-image"
            />
          ) : (
            <div className="post-media-video-wrapper">
              <video 
                src={currentMedia.url}
                className="post-media-video"
                controls
                onClick={(e) => e.stopPropagation()}
              />
              {currentMedia.duration && (
                <span className="post-video-duration">
                  {Math.floor(currentMedia.duration / 60)}:{String(currentMedia.duration % 60).padStart(2, '0')}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Media Navigation */}
        {post.media.length > 1 && (
          <>
            <div className="post-media-indicators">
              {post.media.map((_, index) => (
                <button
                  key={index}
                  className={`media-indicator ${index === currentMediaIndex ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentMediaIndex(index);
                  }}
                  aria-label={`View image ${index + 1}`}
                />
              ))}
            </div>

            {currentMediaIndex > 0 && (
              <button 
                className="media-nav media-nav-prev"
                onClick={handlePrevMedia}
                aria-label="Previous image"
              >
                ‹
              </button>
            )}

            {currentMediaIndex < post.media.length - 1 && (
              <button 
                className="media-nav media-nav-next"
                onClick={handleNextMedia}
                aria-label="Next image"
              >
                ›
              </button>
            )}
          </>
        )}
      </div>

      {/* Post Actions */}
      <div className="post-actions">
        <button 
          className="post-action-button"
          onClick={handleLikeClick}
          aria-label="Like post"
        >
          <span className="action-icon">👍</span>
          <span className="action-text">{post.likes}</span>
        </button>

        <button 
          className="post-action-button"
          onClick={handleDownload}
          aria-label="Download"
        >
          <span className="action-icon">⬇️</span>
          <span className="action-text">save</span>
        </button>
      </div>
    </Card>
  );
}

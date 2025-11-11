import './SkeletonLoader.css';

interface SkeletonLoaderProps {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string;
  height?: string;
  className?: string;
}

export function SkeletonLoader({ 
  variant = 'rectangular', 
  width = '100%', 
  height = '20px',
  className = ''
}: SkeletonLoaderProps) {
  return (
    <div 
      className={`skeleton skeleton--${variant} ${className}`}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}

export function PostCardSkeleton() {
  return (
    <div className="skeleton-post-card">
      <div className="skeleton-post-header">
        <SkeletonLoader variant="circular" width="40px" height="40px" />
        <div className="skeleton-post-header-text">
          <SkeletonLoader width="120px" height="16px" />
          <SkeletonLoader width="80px" height="14px" />
        </div>
      </div>
      <SkeletonLoader height="300px" className="skeleton-post-media" />
      <SkeletonLoader width="60%" height="16px" />
      <div className="skeleton-post-actions">
        <SkeletonLoader width="60px" height="32px" />
        <SkeletonLoader width="60px" height="32px" />
      </div>
    </div>
  );
}

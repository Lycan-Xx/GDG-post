import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
}

export function LoadingSpinner({ size = 'medium' }: LoadingSpinnerProps) {
  return (
    <div className={`spinner spinner--${size}`} role="status" aria-label="Loading">
      <div className="spinner-circle"></div>
    </div>
  );
}

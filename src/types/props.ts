import type { Post, User } from './models';

// Component Props Types
export interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onProfileClick: (userId: string) => void;
}

export interface UploadFlowProps {
  onComplete: () => void;
  onCancel: () => void;
}

export interface ProfilePageProps {
  userId: string;
  isOwnProfile: boolean;
}

export interface FullScreenGalleryProps {
  media: Post['media'];
  initialIndex: number;
  onClose: () => void;
}

export interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

export interface PostContextValue {
  posts: Post[];
  loading: boolean;
  refreshPosts: () => Promise<void>;
  loadMorePosts: () => Promise<void>;
  createPost: (post: Omit<Post, 'id' | 'timestamp'>) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
  likePost: (postId: string) => Promise<void>;
}

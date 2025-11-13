export interface User {
  id: string;
  displayName: string;
  email: string;
  profilePicture: string;
  joinDate: Date;
  totalPosts: number;
  totalLikes: number;
}

export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnailUrl?: string;
  duration?: number; // For videos, in seconds
  fileSize: number;
}

export interface Post {
  id: string;
  userId: string;
  userName: string;
  userProfilePicture: string;
  description: string;
  media: MediaItem[];
  likes: number;
  likedBy: string[]; // Array of user IDs who liked this post
  timestamp: Date;
}

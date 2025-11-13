import type { User, Post } from './models';

export interface AuthService {
  signInWithGoogle(): Promise<User>;
  signOut(): Promise<void>;
  getCurrentUser(): User | null;
}

export interface PostService {
  getPosts(limit: number, offset: number): Promise<Post[]>;
  createPost(post: Omit<Post, 'id' | 'timestamp'>): Promise<Post>;
  deletePost(postId: string): Promise<void>;
  likePost(postId: string, userId: string): Promise<void>;
  getUserPosts(userId: string): Promise<Post[]>;
}

export interface MediaService {
  compressImage(file: File, maxWidth: number, quality: number): Promise<Blob>;
  compressVideo(file: File): Promise<Blob>;
  generateThumbnail(file: File): Promise<string>;
  getVideoDuration(file: File): Promise<number>;
  validateFile(file: File): { valid: boolean; error?: string };
}

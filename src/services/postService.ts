import type { Post } from '../types/models';
import type { PostService } from '../types/services';

const STORAGE_KEY = 'gdg_post_posts';

// Mock posts data with placeholder images
const initialMockPosts: Post[] = [
  {
    id: '1',
    userId: '1',
    userName: "Moh'd Bello",
    userProfilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
    description: 'Amazing GDG event! Great talks and networking. #GDG #Community',
    media: [
      {
        id: 'm1',
        type: 'image',
        url: 'https://picsum.photos/seed/gdg1/800/600',
        fileSize: 2048000,
      },
    ],
    likes: 12,
    likedBy: [],
    timestamp: new Date('2024-11-10T10:00:00'),
  },
  {
    id: '2',
    userId: '2',
    userName: 'Jane Developer',
    userProfilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
    description: 'Learned so much about cloud architecture today! 🚀',
    media: [
      {
        id: 'm2',
        type: 'image',
        url: 'https://picsum.photos/seed/gdg2/800/600',
        fileSize: 1856000,
      },
      {
        id: 'm3',
        type: 'image',
        url: 'https://picsum.photos/seed/gdg3/800/600',
        fileSize: 1920000,
      },
    ],
    likes: 8,
    likedBy: [],
    timestamp: new Date('2024-11-09T15:30:00'),
  },
  {
    id: '3',
    userId: '3',
    userName: 'Alex Coder',
    userProfilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
    description: 'Workshop on AI and Machine Learning was incredible! #AI #ML',
    media: [
      {
        id: 'm4',
        type: 'image',
        url: 'https://picsum.photos/seed/gdg4/800/600',
        fileSize: 2100000,
      },
      {
        id: 'm5',
        type: 'image',
        url: 'https://picsum.photos/seed/gdg5/800/600',
        fileSize: 1980000,
      },
      {
        id: 'm6',
        type: 'image',
        url: 'https://picsum.photos/seed/gdg6/800/600',
        fileSize: 2050000,
      },
    ],
    likes: 15,
    likedBy: [],
    timestamp: new Date('2024-11-08T12:00:00'),
  },
];

class MockPostService implements PostService {
  private posts: Post[] = [];

  constructor() {
    this.loadPosts();
  }

  private loadPosts(): void {
    const storedPosts = localStorage.getItem(STORAGE_KEY);
    if (storedPosts) {
      try {
        this.posts = JSON.parse(storedPosts).map((post: Post) => ({
          ...post,
          timestamp: new Date(post.timestamp),
        }));
      } catch {
        this.posts = initialMockPosts;
        this.savePosts();
      }
    } else {
      this.posts = initialMockPosts;
      this.savePosts();
    }
  }

  private savePosts(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.posts));
  }

  async getPosts(limit: number, offset: number): Promise<Post[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Sort by timestamp (newest first)
    const sortedPosts = [...this.posts].sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
    );

    // Return paginated results
    return sortedPosts.slice(offset, offset + limit);
  }

  async createPost(post: Omit<Post, 'id' | 'timestamp'>): Promise<Post> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newPost: Post = {
      ...post,
      id: Date.now().toString(),
      timestamp: new Date(),
    };

    this.posts.unshift(newPost);
    this.savePosts();

    return newPost;
  }

  async deletePost(postId: string): Promise<void> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    this.posts = this.posts.filter(post => post.id !== postId);
    this.savePosts();
  }

  async likePost(postId: string, userId: string): Promise<void> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const post = this.posts.find(p => p.id === postId);
    if (!post) return;

    const hasLiked = post.likedBy.includes(userId);

    if (hasLiked) {
      // Unlike
      post.likedBy = post.likedBy.filter(id => id !== userId);
      post.likes = Math.max(0, post.likes - 1);
    } else {
      // Like
      post.likedBy.push(userId);
      post.likes += 1;
    }

    this.savePosts();
  }

  async getUserPosts(userId: string): Promise<Post[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 600));

    return this.posts
      .filter(post => post.userId === userId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }
}

export const postService = new MockPostService();

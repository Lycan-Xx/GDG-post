import type { User } from '../types/models';
import type { AuthService } from '../types/services';

const STORAGE_KEY = 'gdg_post_user';

// Mock user data
const mockUser: User = {
  id: '1',
  displayName: "Moh'd Bello",
  email: 'myemail@gmail.com',
  profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
  joinDate: new Date('2024-11-01'),
  totalPosts: 0,
  totalLikes: 0,
};

class MockAuthService implements AuthService {
  async signInWithGoogle(): Promise<User> {
    // Simulate OAuth flow with delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Store user in localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockUser));
    
    return mockUser;
  }

  async signOut(): Promise<void> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Remove user from localStorage
    localStorage.removeItem(STORAGE_KEY);
  }

  getCurrentUser(): User | null {
    const userJson = localStorage.getItem(STORAGE_KEY);
    
    if (!userJson) {
      return null;
    }

    try {
      const user = JSON.parse(userJson);
      // Convert joinDate string back to Date object
      user.joinDate = new Date(user.joinDate);
      return user;
    } catch {
      return null;
    }
  }
}

export const authService = new MockAuthService();

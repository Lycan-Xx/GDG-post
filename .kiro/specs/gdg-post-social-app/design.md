# Design Document

## Overview

GDG Post is a mobile-first web application built with modern web technologies. The application uses a minimalistic design language featuring rounded borders, clean typography, and a hollow aesthetic. The architecture follows a component-based approach with mock data initially, designed to be easily integrated with Firebase/Firestore later.

## Technology Stack

- **Frontend Framework**: React with TypeScript
- **Styling**: CSS Modules or Styled Components for component-scoped styles
- **Routing**: React Router for navigation
- **State Management**: React Context API for global state (user session, posts)
- **Authentication**: Google OAuth 2.0 (mock implementation initially)
- **Media Handling**: Browser File API with client-side compression
- **Build Tool**: Vite for fast development and optimized builds

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Presentation Layer                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │ Welcome  │  │ Timeline │  │  Upload  │  │ Profile │ │
│  │  Screen  │  │   Page   │  │   Flow   │  │  Page   │ │
│  └──────────┘  └──────────┘  └──────────┘  └─────────┘ │
└─────────────────────────────────────────────────────────┘
                          │
┌─────────────────────────────────────────────────────────┐
│                    Application Layer                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │   Auth   │  │   Post   │  │  Media   │  │  User   │ │
│  │ Context  │  │ Context  │  │ Service  │  │ Service │ │
│  └──────────┘  └──────────┘  └──────────┘  └─────────┘ │
└─────────────────────────────────────────────────────────┘
                          │
┌─────────────────────────────────────────────────────────┐
│                       Data Layer                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │   Mock   │  │   Mock   │  │  Local   │              │
│  │   Auth   │  │   Posts  │  │ Storage  │              │
│  └──────────┘  └──────────┘  └──────────┘              │
└─────────────────────────────────────────────────────────┘
```

### Component Hierarchy

```
App
├── AuthProvider
│   ├── WelcomeScreen
│   └── AuthenticatedApp
│       ├── Router
│       │   ├── TimelinePage
│       │   │   ├── Header
│       │   │   ├── PostCard (multiple)
│       │   │   │   ├── PostHeader
│       │   │   │   ├── PostMedia
│       │   │   │   └── PostActions
│       │   │   └── UploadButton
│       │   ├── UploadFlow
│       │   │   ├── MediaSelector
│       │   │   ├── MediaPreview
│       │   │   ├── DescriptionInput
│       │   │   └── PublishButton
│       │   ├── ProfilePage
│       │   │   ├── ProfileHeader
│       │   │   └── PostGrid
│       │   └── FullScreenGallery
│       │       ├── MediaViewer
│       │       └── GalleryControls
└── GlobalStyles
```

## Components and Interfaces

### 1. Data Models

#### User Interface
```typescript
interface User {
  id: string;
  displayName: string;
  email: string;
  profilePicture: string;
  joinDate: Date;
  totalPosts: number;
  totalLikes: number;
}
```

#### Post Interface
```typescript
interface Post {
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
```

#### MediaItem Interface
```typescript
interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnailUrl?: string;
  duration?: number; // For videos, in seconds
  fileSize: number;
}
```

### 2. Core Components

#### WelcomeScreen Component
- **Purpose**: Landing page with Google sign-in
- **Props**: None
- **State**: Loading state during authentication
- **Styling**: 
  - Centered layout with rounded container
  - Large title "social post app"
  - Rounded button with Google icon
  - White/light background with subtle border

#### TimelinePage Component
- **Purpose**: Main feed displaying all posts
- **Props**: None
- **State**: 
  - posts: Post[]
  - loading: boolean
  - hasMore: boolean
- **Features**:
  - Infinite scroll with intersection observer
  - Pull-to-refresh functionality
  - Skeleton loading states
- **Styling**:
  - Mobile-first responsive grid
  - Consistent spacing between cards
  - Fixed header with user profile

#### PostCard Component
- **Purpose**: Display individual post with media and interactions
- **Props**: 
  - post: Post
  - onLike: (postId: string) => void
  - onProfileClick: (userId: string) => void
- **State**: 
  - currentMediaIndex: number
  - isLiked: boolean
- **Features**:
  - Media gallery with swipe navigation
  - Double-tap to like
  - Video playback controls
- **Styling**:
  - Rounded border card
  - Hollow aesthetic with minimal shadows
  - Consistent padding and spacing

#### UploadFlow Component
- **Purpose**: Multi-step media upload interface
- **Props**: 
  - onComplete: () => void
  - onCancel: () => void
- **State**:
  - selectedFiles: File[]
  - compressedMedia: MediaItem[]
  - description: string
  - isCompressing: boolean
  - isUploading: boolean
  - uploadProgress: number
- **Features**:
  - File selection with validation
  - Client-side compression
  - Progress indicators
  - Error handling with retry
- **Styling**:
  - Full-screen modal overlay
  - Horizontal media preview strip
  - Large description textarea
  - Prominent publish button

#### ProfilePage Component
- **Purpose**: Display user profile and their posts
- **Props**:
  - userId: string (from route params)
  - isOwnProfile: boolean
- **State**:
  - user: User
  - posts: Post[]
  - loading: boolean
- **Features**:
  - Post grid layout (2 columns mobile, 3-4 desktop)
  - Delete functionality for own posts
  - Sign out button for own profile
- **Styling**:
  - Profile header card with rounded borders
  - Grid layout with consistent gaps
  - Three-dot menu on hover/long-press

#### FullScreenGallery Component
- **Purpose**: Full-screen media viewer with navigation
- **Props**:
  - media: MediaItem[]
  - initialIndex: number
  - onClose: () => void
- **State**:
  - currentIndex: number
- **Features**:
  - Swipe navigation between media
  - Video playback controls
  - Page indicators
- **Styling**:
  - Black/dark background
  - Full viewport coverage
  - Minimal UI with close button

### 3. Services and Utilities

#### AuthService
```typescript
interface AuthService {
  signInWithGoogle(): Promise<User>;
  signOut(): Promise<void>;
  getCurrentUser(): User | null;
}
```

**Mock Implementation**:
- Simulate OAuth flow with delay
- Return mock user data
- Store session in localStorage

#### PostService
```typescript
interface PostService {
  getPosts(limit: number, offset: number): Promise<Post[]>;
  createPost(post: Omit<Post, 'id' | 'timestamp'>): Promise<Post>;
  deletePost(postId: string): Promise<void>;
  likePost(postId: string, userId: string): Promise<void>;
  getUserPosts(userId: string): Promise<Post[]>;
}
```

**Mock Implementation**:
- Generate mock posts with placeholder images
- Store posts in memory or localStorage
- Simulate network delays

#### MediaService
```typescript
interface MediaService {
  compressImage(file: File, maxWidth: number, quality: number): Promise<Blob>;
  compressVideo(file: File): Promise<Blob>;
  generateThumbnail(file: File): Promise<string>;
  getVideoDuration(file: File): Promise<number>;
  validateFile(file: File): { valid: boolean; error?: string };
}
```

**Implementation Details**:
- Use Canvas API for image compression
- Use MediaRecorder API for video compression
- Generate video thumbnails using video element
- Validate file types and sizes

### 4. Context Providers

#### AuthContext
```typescript
interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}
```

#### PostContext
```typescript
interface PostContextValue {
  posts: Post[];
  loading: boolean;
  refreshPosts: () => Promise<void>;
  loadMorePosts: () => Promise<void>;
  createPost: (post: Omit<Post, 'id' | 'timestamp'>) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
  likePost: (postId: string) => Promise<void>;
}
```

## Design System

### Color Palette
Based on the mockups:
- **Background**: #FFFFFF (white)
- **Text Primary**: #000000 (black)
- **Text Secondary**: #666666 (gray)
- **Border**: #000000 (black, 1-2px)
- **Accent**: #FFD700 (gold/yellow for icons)
- **Button Background**: #FFFFFF with black border
- **Button Hover**: Light gray (#F5F5F5)

### Typography
- **Font Family**: System font stack (San Francisco, Segoe UI, Roboto)
- **Title**: 32-48px, regular weight
- **Body**: 16px, regular weight
- **Small**: 14px, regular weight
- **Button**: 16-18px, medium weight

### Spacing Scale
- **xs**: 4px
- **sm**: 8px
- **md**: 16px
- **lg**: 24px
- **xl**: 32px
- **2xl**: 48px

### Border Radius
- **Small**: 8px (buttons, small cards)
- **Medium**: 16px (post cards, containers)
- **Large**: 24px (modals, profile header)

### Component Patterns

#### Buttons
- Rounded borders (8px radius)
- Black border (2px)
- White background
- Padding: 12px 24px
- Hover: Light gray background
- Active: Slightly darker gray

#### Cards
- Rounded borders (16px radius)
- Black border (1-2px)
- White background
- Padding: 16px
- No shadow (hollow aesthetic)

#### Input Fields
- Rounded borders (8px radius)
- Black border (1px)
- White background
- Padding: 12px
- Focus: Thicker border (2px)

## Routing Structure

```
/                    → WelcomeScreen (if not authenticated)
/timeline            → TimelinePage (default after login)
/upload              → UploadFlow
/profile/:userId     → ProfilePage
/post/:postId        → FullScreenGallery (modal overlay)
```

## State Management

### Global State (Context)
- **AuthContext**: User authentication state
- **PostContext**: Posts data and operations

### Local State (Component)
- UI state (modals, dropdowns, loading)
- Form inputs
- Temporary data (file uploads, compression progress)

### Persistent State (localStorage)
- Mock user session
- Mock posts data (for development)

## Data Flow

### Authentication Flow
```
1. User clicks "Sign in with Google"
2. AuthService.signInWithGoogle() called
3. Mock OAuth simulation (2s delay)
4. User data stored in AuthContext
5. Session saved to localStorage
6. Redirect to /timeline
```

### Post Creation Flow
```
1. User selects media files
2. MediaService validates files
3. MediaService compresses each file
4. User enters description
5. PostService.createPost() called
6. Post added to PostContext
7. Navigate to timeline
8. New post appears with highlight animation
```

### Like Flow
```
1. User taps like button or double-taps image
2. PostService.likePost() called
3. Post updated in PostContext
4. UI reflects new like count
5. Button state changes to "liked"
```

## Error Handling

### Network Errors
- Display toast notification with error message
- Provide retry button
- Maintain user's input/state

### File Upload Errors
- Validate file type and size before compression
- Show specific error messages:
  - "File too large (max 50MB)"
  - "Invalid file type (images and videos only)"
  - "Maximum 3 files allowed"
- Allow user to remove problematic files

### Authentication Errors
- Display error message on welcome screen
- Provide "Try Again" button
- Log errors to console for debugging

### General Error Boundaries
- Implement React Error Boundaries
- Show friendly error page with refresh option
- Log errors for debugging

## Performance Considerations

### Image Optimization
- Compress images to max 1920px width
- Use quality setting of 0.8 for JPEG
- Generate thumbnails for grid views
- Lazy load images in timeline

### Video Optimization
- Compress videos to max 720p resolution
- Limit video file size to 50MB
- Generate thumbnail from first frame
- Use native video controls

### Infinite Scroll
- Load 10 posts per batch
- Use Intersection Observer API
- Implement virtual scrolling for large lists
- Debounce scroll events

### Code Splitting
- Lazy load routes with React.lazy()
- Split upload flow into separate bundle
- Split full-screen gallery into separate bundle

## Accessibility

### Keyboard Navigation
- All interactive elements focusable
- Logical tab order
- Enter/Space to activate buttons
- Escape to close modals

### Screen Reader Support
- Semantic HTML elements
- ARIA labels for icon buttons
- Alt text for images
- Live regions for dynamic content

### Touch Targets
- Minimum 44x44px touch targets
- Adequate spacing between interactive elements
- Visual feedback on touch

### Color Contrast
- Ensure 4.5:1 contrast ratio for text
- Use text labels in addition to icons
- Don't rely solely on color for information

## Testing Strategy

### Unit Tests
- Test utility functions (compression, validation)
- Test service methods with mocked dependencies
- Test custom hooks
- Test context providers

### Component Tests
- Test component rendering with various props
- Test user interactions (clicks, inputs)
- Test conditional rendering
- Test error states

### Integration Tests
- Test complete user flows (sign in → create post → view timeline)
- Test navigation between pages
- Test data persistence
- Test error handling across components

### E2E Tests (Future)
- Test critical user journeys
- Test on multiple devices/browsers
- Test performance metrics

## Mock Data Structure

### Mock Users
```typescript
const mockUsers: User[] = [
  {
    id: '1',
    displayName: "Moh'd Bello",
    email: 'myemail@gmail.com',
    profilePicture: '/mock-avatars/user1.png',
    joinDate: new Date('2024-11-01'),
    totalPosts: 5,
    totalLikes: 23
  },
  // Additional mock users...
];
```

### Mock Posts
```typescript
const mockPosts: Post[] = [
  {
    id: '1',
    userId: '1',
    userName: "Moh'd Bello",
    userProfilePicture: '/mock-avatars/user1.png',
    description: 'Amazing event! #GDG #Community',
    media: [
      {
        id: 'm1',
        type: 'image',
        url: '/mock-images/event1.jpg',
        fileSize: 2048000
      }
    ],
    likes: 12,
    likedBy: [],
    timestamp: new Date('2024-11-10T10:00:00')
  },
  // Additional mock posts...
];
```

## Future Firebase Integration Points

The design is structured to easily integrate with Firebase/Firestore:

### Authentication
- Replace mock AuthService with Firebase Auth
- Use Google Auth Provider
- Store user data in Firestore users collection

### Data Storage
- Replace mock PostService with Firestore queries
- Store posts in Firestore posts collection
- Use Firestore real-time listeners for live updates

### File Storage
- Upload compressed media to Firebase Storage
- Generate download URLs
- Implement security rules

### Database Structure
```
users/
  {userId}/
    displayName: string
    email: string
    profilePicture: string
    joinDate: timestamp
    
posts/
  {postId}/
    userId: string
    description: string
    media: array
    likes: number
    likedBy: array
    timestamp: timestamp
```

## Mobile Responsiveness

### Breakpoints
- **Mobile**: < 768px (default, mobile-first)
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Layout Adjustments
- **Timeline**: Single column on mobile, 2 columns on tablet, 3 columns on desktop
- **Profile Grid**: 2 columns on mobile, 3 columns on tablet, 4 columns on desktop
- **Upload Flow**: Full screen on mobile, centered modal on desktop
- **Navigation**: Bottom navigation on mobile, top navigation on desktop

### Touch Interactions
- Swipe gestures for gallery navigation
- Pull-to-refresh on timeline
- Long-press for context menus
- Double-tap to like

## Security Considerations

### Input Validation
- Sanitize user input (description text)
- Validate file types and sizes
- Prevent XSS attacks
- Limit description length

### Authentication
- Secure token storage
- Implement session timeout
- Validate user permissions

### Content Moderation (Future)
- Report functionality
- Content filtering
- User blocking

## Deployment Considerations

### Build Optimization
- Minify JavaScript and CSS
- Optimize images and assets
- Enable gzip compression
- Use CDN for static assets

### Environment Configuration
- Separate dev/prod configurations
- Environment variables for API keys
- Feature flags for gradual rollout

### Monitoring (Future)
- Error tracking
- Performance monitoring
- User analytics
- Usage metrics
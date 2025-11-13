# GDG Post - Social Post App

A minimalistic social web application for sharing photo and video moments from events.

## Features

✅ **Authentication**
- Google OAuth sign-in (mock implementation)
- Persistent sessions with localStorage

✅ **Timeline Feed**
- Reverse chronological post display
- Infinite scroll with automatic loading
- Pull-to-refresh functionality
- Skeleton loading states

✅ **Post Interactions**
- Like posts with single tap or double-tap on images
- View full-screen gallery with swipe navigation
- Download and share posts
- Navigate to user profiles

✅ **Media Upload**
- Select up to 3 images or videos
- Client-side compression
- Real-time compression progress
- 160-character description limit
- File validation and error handling

✅ **User Profiles**
- View own profile with stats
- View other users' profiles
- Post grid layout (responsive)
- Delete own posts with confirmation
- Sign out functionality

✅ **Full-Screen Gallery**
- Swipe between multiple media items
- Video playback controls
- Like, download, and share actions
- Keyboard navigation (arrow keys, escape)

✅ **Design**
- Mobile-first responsive design
- Minimalistic hollow aesthetic
- Rounded borders throughout
- Consistent spacing and typography
- Smooth animations and transitions

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **State Management**: React Context API
- **Styling**: CSS Modules with CSS Variables
- **Date Formatting**: date-fns
- **Mock Data**: localStorage for persistence

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
cd gdg-post-app
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
gdg-post-app/
├── src/
│   ├── components/
│   │   ├── shared/          # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── PostCard/        # Post card component
│   │   ├── UploadFlow/      # Upload interface
│   │   └── FullScreenGallery/ # Gallery viewer
│   ├── contexts/            # React Context providers
│   ├── services/            # Mock services (Auth, Post, Media)
│   ├── types/               # TypeScript interfaces
│   ├── App.tsx              # Main app with routing
│   └── index.css            # Global styles & design system
├── public/                  # Static assets
└── package.json
```

## Design System

### Colors
- Background: `#FFFFFF`
- Text Primary: `#000000`
- Text Secondary: `#666666`
- Border: `#000000`
- Accent: `#FFD700`

### Spacing Scale
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px

### Border Radius
- Small: 8px (buttons)
- Medium: 16px (cards)
- Large: 24px (modals)

### Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## Mock Data

The app uses mock services with localStorage for data persistence:

- **AuthService**: Simulates Google OAuth with 2-second delay
- **PostService**: Manages posts with pagination and CRUD operations
- **MediaService**: Handles file validation and compression

## Future Enhancements

- Firebase/Firestore integration (architecture ready)
- Real Google OAuth authentication
- Cloud storage for media files
- Real-time updates with Firestore listeners
- User search and discovery
- Comments on posts
- Notifications
- Dark mode

## License

MIT

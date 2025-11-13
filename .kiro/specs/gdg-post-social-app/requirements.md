# Requirements Document

## Introduction

GDG Post is a minimalistic social web application that enables users to share photo and video moments from events. The application provides Google OAuth authentication, media upload capabilities with compression, a chronological timeline feed, user interactions through likes and downloads, and personal profile management. The design follows a mobile-first approach with a clean, hollow aesthetic featuring rounded borders and minimal styling.

## Glossary

- **Application**: The GDG Post web application system
- **User**: An authenticated individual who has signed in with their Google account
- **Post**: A content item containing 1-3 media files (images or videos), a description, and metadata
- **Timeline**: The main feed displaying posts in reverse chronological order
- **Media**: Images or videos uploaded by users (maximum 3 per post)
- **Profile**: A user's personal page displaying their information and uploaded posts
- **Gallery**: A full-screen view for displaying media content with navigation

## Requirements

### Requirement 1: User Authentication

**User Story:** As a new visitor, I want to sign in with my Google account, so that I can access the application and create posts.

#### Acceptance Criteria

1. THE Application SHALL display a welcome screen with the title "social post app" centered on the screen
2. THE Application SHALL display a "sign in with google" button with a Google icon on the welcome screen
3. WHEN a user clicks the sign-in button, THE Application SHALL initiate the Google OAuth authentication flow
4. WHEN authentication succeeds, THE Application SHALL redirect the user to the main timeline page
5. THE Application SHALL store the user's profile picture, display name, and email address from their Google account

### Requirement 2: Timeline Feed Display

**User Story:** As an authenticated user, I want to view a timeline of posts from all users, so that I can see recent event moments.

#### Acceptance Criteria

1. WHEN a user completes authentication, THE Application SHALL display the main timeline page
2. THE Application SHALL display the current user's profile picture and name in the top right corner of the timeline
3. THE Application SHALL display posts in reverse chronological order with the newest post first
4. THE Application SHALL load additional posts automatically when the user scrolls to the bottom of the feed
5. WHEN a user pulls down on the timeline, THE Application SHALL refresh the feed and display any new posts

### Requirement 3: Post Card Display

**User Story:** As a user viewing the timeline, I want to see detailed information about each post, so that I can understand the content and context.

#### Acceptance Criteria

1. THE Application SHALL display each post as a card with rounded borders following the minimalistic design
2. THE Application SHALL display the post author's profile picture and name at the top left of each post card
3. THE Application SHALL display a relative timestamp next to the author's name
4. THE Application SHALL display the post description with a maximum of 160 characters
5. THE Application SHALL display up to 3 media items in a gallery format with navigation indicators
6. WHEN a post contains a video, THE Application SHALL display a play button overlay and duration indicator
7. THE Application SHALL display a like button with a thumbs-up icon and the current like count
8. THE Application SHALL display a download button with a download icon at the bottom of each post card

### Requirement 4: Post Interactions

**User Story:** As a user, I want to interact with posts through likes and viewing full-screen media, so that I can engage with content.

#### Acceptance Criteria

1. WHEN a user taps the like button on a post, THE Application SHALL increment the like count by one
2. WHEN a user double-taps a post image, THE Application SHALL increment the like count by one
3. WHEN a user taps on a post image, THE Application SHALL open the media in full-screen gallery mode
4. WHEN viewing full-screen media, THE Application SHALL allow the user to swipe between multiple media items
5. THE Application SHALL display page indicators showing the current position in the gallery
6. WHEN a user taps the close button in full-screen mode, THE Application SHALL return to the timeline
7. WHEN a user taps on a profile picture or name, THE Application SHALL navigate to that user's profile page

### Requirement 5: Media Upload Flow

**User Story:** As a user, I want to upload photos and videos with a description, so that I can share my event moments.

#### Acceptance Criteria

1. THE Application SHALL display a floating upload button with a plus icon in the bottom right corner of the timeline
2. WHEN a user taps the upload button, THE Application SHALL request gallery permissions on mobile devices
3. WHEN a user taps the upload button, THE Application SHALL open a file picker filtered to images and videos
4. THE Application SHALL allow users to select up to 3 media files
5. WHEN files are selected, THE Application SHALL display a media selection screen with thumbnails
6. THE Application SHALL display a small X button on each thumbnail to allow removal of individual items
7. THE Application SHALL display a play icon overlay on video thumbnails
8. THE Application SHALL display file size below each thumbnail
9. WHEN fewer than 3 items are selected, THE Application SHALL display an "Add More" button
10. THE Application SHALL provide a description text box with a placeholder "Share your experience... #EventName"
11. THE Application SHALL display a character counter showing "0/160" that updates as the user types
12. THE Application SHALL limit the description to 160 characters maximum

### Requirement 6: Media Compression and Publishing

**User Story:** As a user uploading media, I want my files to be compressed automatically, so that uploads are faster and storage is optimized.

#### Acceptance Criteria

1. WHEN a user selects media files, THE Application SHALL compress the images and videos
2. WHILE compression is in progress, THE Application SHALL display a compression status indicator with progress
3. THE Application SHALL disable the Publish button until compression completes
4. WHEN compression completes and a description is added, THE Application SHALL enable the Publish button
5. WHEN a user taps the Publish button, THE Application SHALL display a loading overlay with "Uploading your post..." text
6. WHEN upload succeeds, THE Application SHALL display a success message "Post published! ✓"
7. WHEN upload succeeds, THE Application SHALL redirect the user to the timeline
8. WHEN upload succeeds, THE Application SHALL display the new post at the top of the timeline with a highlight animation
9. IF upload fails, THEN THE Application SHALL display an error message "Upload failed. Check your connection and try again."
10. IF upload fails, THEN THE Application SHALL provide a Retry button

### Requirement 7: User Profile Page (Own)

**User Story:** As a user, I want to view and manage my own profile, so that I can see my posts and account information.

#### Acceptance Criteria

1. WHEN a user taps their profile picture in the top right corner, THE Application SHALL navigate to their profile page
2. THE Application SHALL display a profile header card with the user's large profile picture
3. THE Application SHALL display the user's display name and email address in the profile header
4. THE Application SHALL display the join date in the format "Member since [Month Year]"
5. THE Application SHALL display statistics showing total posts and total likes received
6. THE Application SHALL display a "sign out" button in the profile header
7. THE Application SHALL display a "My uploads" section below the profile header
8. THE Application SHALL display the user's posts in a grid layout with 2 columns on mobile
9. THE Application SHALL display the first media item from each post as a thumbnail
10. THE Application SHALL display the like count in the bottom left corner of each post thumbnail
11. THE Application SHALL display a three-dot menu on each post thumbnail
12. WHEN a user selects delete from the three-dot menu, THE Application SHALL display a confirmation dialog
13. WHEN a user confirms deletion, THE Application SHALL remove the post from the database and update the grid
14. WHEN a user has no posts, THE Application SHALL display "You haven't posted yet. Share your first memory!"

### Requirement 8: Other User Profile Page

**User Story:** As a user, I want to view other users' profiles, so that I can see their posts and public information.

#### Acceptance Criteria

1. WHEN a user taps another user's profile picture or name, THE Application SHALL navigate to that user's profile page
2. THE Application SHALL display the other user's profile picture and display name
3. THE Application SHALL display the other user's join date
4. THE Application SHALL display statistics showing the other user's total posts and total likes received
5. THE Application SHALL display the other user's posts in a grid layout
6. THE Application SHALL NOT display the other user's email address
7. THE Application SHALL NOT display a sign out button on other users' profiles
8. THE Application SHALL NOT display delete options on other users' posts
9. THE Application SHALL display a back button in the top left corner
10. WHEN a user taps the back button, THE Application SHALL return to the previous screen

### Requirement 9: Loading and Error States

**User Story:** As a user, I want to see appropriate feedback during loading and error conditions, so that I understand the application state.

#### Acceptance Criteria

1. WHILE the timeline is loading, THE Application SHALL display skeleton screens with animated placeholders
2. WHILE media is uploading, THE Application SHALL display a percentage indicator
3. WHILE media is uploading, THE Application SHALL provide a cancel option
4. IF the device has no internet connection, THEN THE Application SHALL display a friendly error page with a retry button
5. THE Application SHALL display loading indicators for all asynchronous operations

### Requirement 10: Design Consistency

**User Story:** As a user, I want a consistent and minimalistic design across all pages, so that the application is visually cohesive and easy to use.

#### Acceptance Criteria

1. THE Application SHALL use a mobile-first responsive design approach
2. THE Application SHALL apply rounded borders to all cards, buttons, and containers
3. THE Application SHALL use a minimalistic hollow aesthetic with consistent spacing
4. THE Application SHALL maintain consistent typography across all pages
5. THE Application SHALL use the color scheme shown in the provided mockups
6. THE Application SHALL ensure all interactive elements have appropriate touch targets for mobile devices
7. THE Application SHALL maintain visual consistency between the welcome screen, timeline, upload flow, and profile pages
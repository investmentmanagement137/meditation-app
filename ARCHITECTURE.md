# Meditation App Architecture & Documentation

## Overview
This is a React-based Progressive Web App (PWA) designed for meditation sessions. It features a customizable timer, interval bells, background audio (including YouTube integration), and detailed session logging. The app is built with a focus on "Pro Max" UI/UX aesthetics, using glassmorphism, dark mode by default, and smooth animations.

## Technology Stack
- **Framework**: React (Vite)
- **Styling**: Vanilla CSS (Variables, Glassmorphism, Responsive Mobile-First, Dark Theme)
- **State Persistence**: `localStorage` (via custom `useLocalStorage` hook)
- **Icons**: `lucide-react`
- **Audio Engine**: Native `AudioContext` + `YouTube IFrame API`
- **Routing**: `react-router-dom`

## Project Structure
```
src/
├── components/       # Reusable UI components
│   ├── AudioSelector.jsx      # Audio picker component
│   ├── BottomNavigation.jsx   # Main app navigation
│   ├── Layout.jsx             # Layout wrapper with outlet
│   ├── QuoteCarousel.jsx      # Rotating quotes for timer
│   ├── TimerRing.jsx          # visual progress ring
│   └── ... (Selectors, Modals wrappers)
├── hooks/            # Custom hooks
│   ├── useAudio.js            # Audio control logic
│   ├── useLocalStorage.js     # Persistence wrapper
│   └── useTimer.js            # Timer countdown logic
├── modals/           # Feature-specific modals
│   ├── AudioModal.jsx         # Library & YouTube management
│   ├── DurationModal.jsx      # Custom duration input
│   ├── EndNoteModal.jsx       # Post-session reflection
│   ├── IntervalModal.jsx      # Interval bell configuration
│   └── LogModal.jsx           # (Reserved/Legacy)
├── screens/          # Main views
│   ├── SetupScreen.jsx        # Home/Config screen
│   ├── TimerView.jsx          # Active session screen
│   ├── DashboardScreen.jsx    # Analytics & Entry to logs
│   ├── LogsScreen.jsx         # Detailed history & CSV export
│   └── MyAIScreen.jsx         # AI Settings (Gemini)
├── styles/           # Global styles
│   └── index.css              # Main stylesheet
└── App.jsx           # Root component, Routing, Global State
```

## Core Features

### 1. Setup Screen & Navigation
The entry point (`/`) allows users to configure their session:
- **Duration**: Preset or custom time selection.
- **Interval Bells**: Configurable chimes during the session.
- **Background Audio**: Selection of local sounds or YouTube tracks.
- **Intention**: Optional pre-session note.
- **Navigation**: Bottom bar provides access to Home, Dashboard, and My AI.

### 2. Timer View (`/timer`)
The active meditation interface:
- **Visuals**: Large digital clock, progress ring, and motivational quotes.
- **Controls**: Play/Pause, Stop (Early End).
- **Audio Control**: Dynamic volume control and track toggling.
- **End Session**: Triggers `EndNoteModal` to capture reflection, emotions, and causes.

### 3. Dashboard (`/dashboard`)
A hub for progress tracking:
- **Analytics**: Overview of total sessions, average time, and completion rate.
- **Actions**:
  - **View Session Logs**: Navigates to the detailed Logs screen.
  - **Background Audio**: Quick access to manage the audio library.

### 4. Logs Screen (`/logs`)
A dedicated history view:
- **List View**: Detailed cards for each past session showing date, planned vs. actual time, audio used, and notes.
- **Audio Details**: Displays thumbnail, title, and creator of the audio track used. Includes "Watch" link for YouTube videos.
- **Management**: Ability to delete individual logs.
- **Export**: Generate and download a CSV file of all session history, complete with audio details and URLs.

### 5. My AI (`/my-ai`)
Settings for AI integration:
- **API Management**: interface to input and save Gemini API key.
- **Future Features**: Placeholder for session analysis and personalized insights.

### 6. Audio Manager
Managed via `AudioModal.jsx` and `useAudio.js`:
- **Library**: Stores both local and YouTube tracks.
- **Collections**: Group tracks into playlists/folders.
- **YouTube Integration**:
  - Validates URLs and fetches metadata (Title, Creator, Thumbnail).
  - Global `window.ytPlayer` instance for uninterrupted playback.
  - Supports adding tracks via URL or Playlist Webhook.

## Data Models (LocalStorage)

| Key | Description |
|-----|-------------|
| `meditation_logs` | Array of session objects `{id, startTime, endTime, duration, audioDetails, ...}` |
| `meditation_audios` | Library of available audio tracks |
| `meditation_collections` | User-created playlists |
| `meditation_durations` | Custom duration presets |
| `gemini_api_key` | User's API key for AI features |
| `theme` | UI Theme preference ('dark'/'light') |

## Key Workflows

### Session Flow
1. **Setup**: User selects configuration in `SetupScreen`.
2. **Start**: `handleStartSession` in `App.jsx` initializes state.
3. **Timer**: `TimerView` manages the countdown and audio playback.
4. **End**: Session finishes. `EndNoteModal` collects reflection.
5. **Save**: Session data, including full `audioDetails` object, is saved to `meditation_logs`.
6. **Redirect**: User is sent to `/dashboard`.

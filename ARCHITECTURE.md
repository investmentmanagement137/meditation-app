# Meditation App Architecture & Documentation

## Overview
This is a React-based Progressive Web App (PWA) designed for meditation sessions. It features a customizable timer, interval bells, background audio (including YouTube integration), and session logging with intention/reflection notes.

## Technology Stack
- **Framework**: React (Vite)
- **Styling**: Vanilla CSS (Variables, Glassmorphism, Responsive Mobile-First)
- **State Persistence**: `localStorage` (via custom `useLocalStorage` hook)
- **Audio Engine**: Native `AudioContext` + `YouTube IFrame API`
- **Routing**: `react-router-dom`

## Project Structure
```
src/
├── components/       # Reusable UI components (Buttons, Selectors, Layout)
├── hooks/           # Custom hooks (useAudio, useLocalStorage, useTimer)
├── modals/          # Feature-specific modals (Audio, Duration, Logs)
├── screens/         # Main views (Setup, Timer, Dashboard)
├── styles/          # Global styles (index.css)
└── App.jsx          # Root component, Routing, Global State
```

## Core Features

### 1. Setup Screen (`SetupScreen.jsx`)
The entry point for a session. Users verify and configure:
- **Duration**: Select from presets (max 5 + add) or add custom minutes.
- **Interval Bells**: Periodic chimes during meditation.
- **Background Audio**: Choose from local tracks or YouTube playlists.
- **Intention**: Optional note to set the session's purpose.

### 2. Timer View (`TimerView.jsx`, `useTimer.js`)
The active session interface.
- **Visuals**: Digital clock, SVG progress ring, and motivational quotes.
- **Controls**: Play/Pause, Stop (Early End).
- **Audio Control**: Dynamic volume/track toggling.
- **End Session**: Triggers the `EndNoteModal` to capture reflection.

### 3. Dashboard (`DashboardScreen.jsx`)
Review past sessions.
- **Analytics**: Total sessions, total minutes, average duration.
- **Logs**: Detailed history with date, duration, audio used, and notes (Intention/Reflection).
- **Management**: Delete individual logs or clear history.

### 4. Audio Manager (`AudioModal.jsx`, `useAudio.js`)
- **Library**: Pre-loaded ambient tracks.
- **YouTube Integration**:
  - Validates YouTube URLs.
  - Supports Playlists via Webhook (intercepts `list=` param).
  - Global `window.ytPlayer` instance for reliable background playback.
- **UI**: Glassmorphism overlay for adding new tracks.

## State Management
Global state is lifted to `App.jsx` and passed via props, supplemented by `useLocalStorage` for long-term persistence.

| Key | Purpose |
|-----|---------|
| `meditation_durations` | User saved duration presets |
| `meditation_logs` | History of completed sessions |
| `meditation_audio_library` | User added custom audio tracks |

## Key Workflows

### Session Flow
1. **Setup**: User picks Duration (e.g., 10m) + Audio.
2. **Start**: `handleStartSession` in `App.jsx` creates a session object with `startTime`.
3. **Timer**: Navigates to `/timer`. `TimerView` counts down.
4. **End**: Timer hits 0 or User stops. `handleSessionComplete`.
5. **Reflection**: `EndNoteModal` appears.
6. **Save**: Data saved to `meditation_logs` and user routed to `/dashboard`.

### Audio Flow
- **Direct**: HTML5 `Audio` element for local files.
- **YouTube**: Hidden IFrame. `useAudio` hook bridges the control (play/pause/volume) to the global IFrame instance.

## Optimization & Performance
- **Assets**: minimal heavy assets only needed for icons/sounds.
- **Storage**: JSON-based local storage, efficient for text-based logs.
- **Rendering**: React functional components with `useEffect` for side-effects (timer, audio).

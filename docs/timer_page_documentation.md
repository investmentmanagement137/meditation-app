# Timer Page Documentation

## Overview
The **Timer Page** (`TimerView.jsx`) is the active session screen. It handles the countdown, audio playback, and immersive experience.

## Architecture

### Components
- **TimerScreen (`TimerView.jsx`)**: Main container.
- **Visual Timer**:
    - **Digital**: Numeric countdown.
    - **Analog**: SVG Ring calculation (`stroke-dasharray`).
- **Controls**: Play/Pause, Stop/Finish.
- **YouTube Interface**: Global player connection for background audio.

### Data Flow
- **Input**: Receives `sessionConfig` (duration, audioId, intent) from props.
- **State**:
    - `timeLeft`: Seconds remaining.
    - `isActive`: Running state.
    - `isPaused`: Pause state.
    - `audioVolume`: 0-100.

---

## Features

### 1. Immersive Modes
*   **Fullscreen**: Automatically attempted on entry.
*   **Wake Lock**: Prevents screen sleep (via `navigator.wakeLock` where supported).
*   **Minimalist Mode**: (Configurable in Settings) Hides quotes/extra UI.

### 2. Audio Management
*   **Background Audio**: seamless loop of selected track/video.
*   **Bells**:
    - **Start Bell**: Plays once at T-0.
    - **Interval Bells**: Plays at defined frequencies.
    - **End Bell**: Plays at T-End.
*   **Swipe Control**: Users can swipe the audio icon left/right to change tracks mid-session.

### 3. Timer Logic
*   Uses `setInterval` or `requestAnimationFrame` (via `useInterval` hook usually) for accurate countdown.
*   Handles "backgrounding" issues by checking `Date.now()` delta.

### 4. Completion
*   When timer hits 0:
    1.  Plays End Bell.
    2.  Fades out background audio.
    3.  Opens **End Note Modal** to reflect on session.
    4.  Saves Log.

---

## Dependencies
*   `use-sound`: For handling bells.
*   `react-swipeable`: For audio swipe gestures.

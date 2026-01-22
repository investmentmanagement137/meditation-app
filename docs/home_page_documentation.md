# Home Page Documentation

## Overview
The **Home Page** (`SetupScreen.jsx`) is the landing screen where users configure their meditation session before starting. It focuses on simplicity and quick setup.

## Architecture

### Components
- **SetupScreen (`SetupScreen.jsx`)**: Main container.
- **DurationSelector**: Horizontal scrollable list to pick session length.
- **AudioSelector**: Card to pick background sound (Navigates to Audio Library).
- **IntervalSelector**: Card to configure interval bells.
- **Start Button**: The primary action to begin the timer.

### Data Flow
- **State**: Manages `selectedDuration`, `selectedInterval`, `sessionNote`.
- **Modals**:
    - **Add Duration**: Opens `DurationModal` (passed from App) to add custom minutes.
    - **Change Interval**: Opens `IntervalModal` (passed from App) to select bell frequency.
    - **Audio**: Opens `AudioModal`.

---

## Features

### 1. Duration Selection
*   **Presets**: 5, 10, 15, 20 minutes (configurable).
*   **Custom**: Users can add custom durations via the "+" button.
*   **UI**: Horizontal pill selector.

### 2. Audio Selection
*   Displays currently selected background track.
*   Clicking opens the Audio Library to browse/select new sounds (Rain, Forest, etc).

### 3. Interval Configuration
*   Configure mid-session bells (e.g., "Every 5 Minutes").
*   Useful for maintaining focus or timing breathing exercises.

### 4. Intent Setting
*   **Input Field**: "What is your intent?"
*   Allows users to set a mental note or goal for the session, which is saved to the log.

### 5. Quick Actions
*   **Settings Icon**: Navigates to Settings.
*   **Logs Icon**: Navigates to History.

---

## Key Interactions
*   **Start Session**: Validates inputs -> Navigates to `/timer` -> Enter Fullscreen.

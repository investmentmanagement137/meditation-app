# Settings Page Documentation

## Overview
The **Settings Page** (`SettingsScreen.jsx`) is the configuration hub for the Meditation App. It has been refactored (Jan 2026) to follow a **"Pro Max" UI/UX** philosophy, featuring dedicated modals for key settings, solid "popups", and a premium cleaner interface.

## Architecture

### Parent Component (`App.jsx`)
`App.jsx` acts as the global state manager. It hoists the state for all settings to ensure they persist across the app (e.g., Timer, Dashboard).
*   **State Managed**: `startSound`, `intervalSound`, `clockLayout`, `apiKey`, `theme` (via localStorage).
*   **Modals Managed**: `StartBellModal`, `IntervalBellModal`, `ThemeModal`, `ClockModal`, `APIKeyModal`.
*   **Handlers**: `App.jsx` passes functions like `onOpenThemeModal` to `SettingsScreen`.

### Settings Screen (`SettingsScreen.jsx`)
A presentation component that displays settings in categorized cards.
*   **Audio Settings**: Total Silence (Toggle), Starting Bell (Modal), Interval Bell (Modal), Background Audios (Nav).
*   **Display Settings**: Disable Quotes (Toggle), Themes (Modal), Clock Layout (Modal).
*   **My AI**: Gemini API Key (Modal).
*   **Support**: Share, Contact, Privacy, Terms.

---

## Modals & Popups

All settings popups use `BaseModal.jsx` with a **solid background** (removed transparency for better readability).

### 1. Theme Modal (`ThemeModal.jsx`)
*   **Purpose**: Switch between Light and Dark themes.
*   **Action**: Updates CSS variables globally (`:root` vs `.dark` class).
*   **UI**: Single selection list.

### 2. Clock Modal (`ClockModal.jsx`)
*   **Purpose**: Choose Timer display style.
*   **Options**:
    *   **Digital**: Large numeric countdown (e.g., 10:00).
    *   **Analog**: Visual ring countdown.

### 3. Bell Modals (`StartBellModal.jsx`, `IntervalBellModal.jsx`)
*   **Purpose**: Dedicated audio selection.
*   **Start Bell**: Choose sound to play at session start (None, Bell 1).
*   **Interval Bell**: Choose sound to play at intervals (None, Bell 2).
*   **Note**: Unlike previous versions, these do *not* handle duration/frequency logic (that's now in Setup Screen).

### 4. API Key Modal (`APIKeyModal.jsx`)
*   **Purpose**: Secure entry for Google Gemini API Key.
*   **Features**: Masked input, persistent storage.

---

## Data Keys (LocalStorage)
*   `theme`: `dark` | `light`
*   `clock_layout`: `digital` | `analog`
*   `start_bell_sound`: String ID
*   `interval_bell_sound`: String ID
*   `gemini_api_key`: String
*   `pref_total_silence`: Boolean
*   `pref_minimal_design`: Boolean (Disable Quotes)

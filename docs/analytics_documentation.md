# Analytics Page Documentation

## Overview
The **Analytics Page** (`DashboardScreen.jsx`) visualizes the user's meditation history and provides insights into their practice. It parses session logs to display key metrics and charts.

## Architecture

### Components
1.  **DashboardScreen (`DashboardScreen.jsx`)**: Main container.
2.  **AnalyticsChart (`AnalyticsChart.jsx`)**: A chart component (using Recharts) to visualize minutes practiced over time.
3.  **Logs List**: Displays a history of recent sessions.

### Data Flow
- **Logs Source**: `App.jsx` manages `logs` state (persisted in local storage).
- **Props**: `DashboardScreen` receives `logs` array.
- **Calculations**: `DashboardScreen` calculates totals (Total Sessions, Total Minutes, Streak) on the fly based on the `logs` array.

---

## Features

### 1. Key Metrics
*   **Total Sessions**: Count of all logs.
*   **Total Minutes**: Sum of duration of all logs.
*   **Current Streak**: Consecutive days with at least one session.

### 2. Activity Chart
*   **Library**: `Recharts`.
*   **Data**: Maps last 7 days of activity.
*   **Visual**: Area chart showing duration (minutes) per day.

### 3. Recent History
*   List of recent sessions showing:
    *   Date & Time.
    *   Duration.
    *   Audio Track used.
    *   Mood/Tags (if AI analysis enabled).

---

## Dependencies
*   `recharts`: For rendering the chart.
*   `lucide-react`: For icons.

## Future Improvements
*   Weekly/Monthly aggregation toggle.
*   Export data to CSV.

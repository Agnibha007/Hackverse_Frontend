# Frontend Documentation

## Overview

The Phi frontend is a React application built with Vite, providing a high-performance UI for the study dashboard. The app uses Zustand for state management and TailwindCSS for styling with custom neon components.

## Project Structure

```
src/
├── components/
│   ├── NeonComponents.jsx      # Core UI components
│   ├── DashboardComponents.jsx # Dashboard-specific components
│   └── Layout.jsx              # Navigation and routing
├── pages/
│   ├── AuthPages.jsx           # Login/Signup pages
│   ├── DashboardPage.jsx       # Main dashboard
│   └── FocusAndAnalyticsPages.jsx # Focus mode & analytics
├── services/
│   └── api.js                  # Axios API client
├── store/
│   └── index.js                # Zustand stores
├── styles/
│   └── globals.css             # Global styles
├── App.jsx                     # Main app component
└── main.jsx                    # React DOM entry
```

## State Management (Zustand)

### useAuthStore

Manages authentication and user state.

```javascript
const {
  user, // Current user object
  token, // JWT token
  isLoading, // Loading state
  error, // Error messages
  signup, // (email, password, username) => Promise
  login, // (email, password) => Promise
  logout, // () => void
  fetchProfile, // () => Promise
  updateProfile, // (username, imageUrl) => Promise
} = useAuthStore();
```

### useMissionStore

Manages missions/tasks.

```javascript
const {
  missions, // Array of mission objects
  isLoading, // Loading state
  error, // Error messages
  overview, // Mission statistics
  fetchMissions, // (filters) => Promise
  createMission, // (data) => Promise
  updateMission, // (id, updates) => Promise
  deleteMission, // (id) => Promise
  fetchOverview, // () => Promise
} = useMissionStore();
```

### useFocusStore

Manages focus sessions.

```javascript
const {
  focusHistory, // Array of sessions
  dailyMetrics, // Today's metrics
  weeklyMetrics, // Weekly data
  streak, // Current streak
  isLoading, // Loading state
  recordSession, // (data) => Promise
  fetchHistory, // (days) => Promise
  fetchDailyMetrics, // (date) => Promise
  fetchWeeklyMetrics, // () => Promise
  fetchStreak, // () => Promise
} = useFocusStore();
```

### useAnalyticsStore

Manages analytics data.

```javascript
const {
  dashboardStats, // Overall dashboard statistics
  productivityTrend, // Trend data
  systemStats, // Gamified system stats
  isLoading, // Loading state
  fetchDashboardStats, // () => Promise
  fetchProductivityTrend, // (months) => Promise
  fetchSystemStats, // () => Promise
} = useAnalyticsStore();
```

## Core Components

### NeonButton

```jsx
<NeonButton
  variant="primary" // 'primary' | 'secondary' | 'tertiary' | 'danger'
  size="md" // 'sm' | 'md' | 'lg' | 'xl'
  disabled={false}
  onClick={handler}
>
  Click Me
</NeonButton>
```

### NeonCard

```jsx
<NeonCard glowing={false} className="custom-class">
  Card content
</NeonCard>
```

### NeonInput

```jsx
<NeonInput
  type="text"
  placeholder="Enter text..."
  value={state}
  onChange={handler}
/>
```

### CircleProgress

```jsx
<CircleProgress percentage={75} size={120} strokeWidth={4}>
  <div>75%</div>
</CircleProgress>
```

### GlitchText

```jsx
<GlitchText text="GLITCH" className="text-2xl" />
```

## Pages

### Login/Signup Pages

Located in `AuthPages.jsx`. Handles user authentication with form validation.

### Dashboard Page

Main page displaying:

- User stats (level, XP, streak)
- Active missions
- Quick action buttons
- Weekly metrics
- System status

### Focus Mode Page

Immersive focus timer with:

- Countdown timer
- Focus quality selector
- Session recording
- Ambient background effects

### Analytics Page

Displays comprehensive statistics:

- Daily performance
- User progression
- All-time stats
- Weekly trends

## API Integration

The frontend uses Axios with automatic token attachment:

```javascript
import api from "./services/api.js";

// Automatically includes Authorization header
const response = await api.get("/missions");
const data = await api.post("/missions", missionData);
```

## Styling System

### Color Palette

```javascript
neon: {
  pink: '#ff0080',
  blue: '#00eaff',
  purple: '#8a2be2',
  black: '#0a0a0f',
  dark: '#1a1a2e',
  darker: '#16213e',
}
```

### Custom Classes

- `shadow-neon` - Neon glow shadow
- `shadow-neon-blue` - Blue glow
- `shadow-neon-pink` - Pink glow
- `text-glow` - Animated text glow
- `flicker` - Flicker animation

### TailwindCSS Extensions

Custom animations added:

- `animate-glow` - Text glow animation
- `animate-flicker` - Flicker effect
- `animate-scan` - Scanline effect

## Routing

Protected routes require authentication via `ProtectedRoute` wrapper:

```jsx
<ProtectedRoute>
  <DashboardPage />
</ProtectedRoute>
```

Routes:

- `/login` - Login page
- `/signup` - Signup page
- `/dashboard` - Main dashboard (protected)
- `/focus` - Focus mode (protected)
- `/analytics` - Analytics (protected)

## Development Workflow

### Environment Variables

Create `.env.local`:

```
VITE_API_URL=http://localhost:5000/api
```

### Running the Development Server

```bash
npm run dev
```

### Building for Production

```bash
npm run build
```

Output in `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Performance Optimizations

1. **Code Splitting**: Vite automatically handles this
2. **Lazy Loading**: Routes loaded on demand
3. **Image Optimization**: Lazy load images
4. **State Management**: Zustand prevents unnecessary renders
5. **Memoization**: Components wrapped with React.memo when needed
6. **CSS**: Optimized Tailwind output

## Component Development Best Practices

1. **Keep components small and focused**

   ```jsx
   export function StatBox({ icon: Icon, label, value }) {
     // One responsibility
   }
   ```

2. **Use composition over inheritance**

   ```jsx
   <NeonCard>
     <StatBox />
   </NeonCard>
   ```

3. **Separate container and presentation components**
   - Pages handle data fetching
   - Components handle rendering

4. **Use custom hooks for logic**
   ```jsx
   const useFetchMissions = () => {
     // Fetch and return missions
   };
   ```

## Error Handling

API errors are caught and handled gracefully:

```javascript
const result = await createMission(data);
if (!result.success) {
  setError(result.error);
}
```

## Testing

Component tests would use React Testing Library:

```javascript
import { render, screen } from "@testing-library/react";
import { MissionCard } from "./components/DashboardComponents";

test("renders mission card", () => {
  render(<MissionCard mission={mockMission} />);
  expect(screen.getByText("Mission Title")).toBeInTheDocument();
});
```

## Common Tasks

### Adding a New Store

```javascript
export const useNewStore = create((set) => ({
  data: [],
  fetchData: async () => {
    // Fetch logic
  },
}));
```

### Adding a New Page

1. Create component in `pages/`
2. Add route in `App.jsx`
3. Add navigation link in `Layout.jsx`

### Adding a New API Endpoint

1. Call in component using `api.get/post/patch/delete`
2. Zustand store handles caching
3. UI updates automatically

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers

## Accessibility

- Semantic HTML elements
- ARIA labels where needed
- Keyboard navigation support
- Color contrast compliance

---

For API documentation, see `../backend/API_DOCS.md`

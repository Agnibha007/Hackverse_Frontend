# Phi — Frontend

React 18 + Vite app. Zustand for state, TailwindCSS for styling, React Router v6 for navigation. Deployed on Vercel.

---

## Project structure

```
src/
├── components/
│   ├── NeonComponents.jsx        design system primitives
│   ├── DashboardComponents.jsx   mission cards, stat boxes, forms
│   ├── Layout.jsx                nav bar, protected route, profile dropdown
│   ├── MissionWorkspace.jsx      todos/thoughts/lists modal
│   ├── TourOverlay.jsx           first-time feature walkthrough
│   ├── CollectibleToast.jsx      celebration popup when a meme drops
│   └── social/
│       ├── FriendsPanel.jsx      friends list, search, requests
│       ├── ChatWindow.jsx        floating 1-on-1 chat
│       ├── StudySessionModal.jsx create/join shared Pomodoro sessions
│       └── Leaderboard.jsx       friends ranked by collectibles
├── pages/
│   ├── AuthPages.jsx             login, signup, OTP verification
│   ├── DashboardPage.jsx         main command center
│   ├── FocusAndAnalyticsPages.jsx timer + analytics
│   ├── SubjectsPage.jsx          subject management
│   ├── AiMentorPage.jsx          aria.ai chat interface
│   ├── SocialPage.jsx            squad hub
│   ├── CollectiblesPage.jsx      drops/meme cards
│   ├── OnboardingPage.jsx        new user setup
│   ├── VerifyEmailPage.jsx       OTP entry after signup
│   └── GoogleCallbackPage.jsx    OAuth redirect handler
├── store/
│   └── index.js                  all Zustand stores
├── services/
│   └── api.js                    Axios instance + 401 interceptor
├── styles/
│   └── globals.css               Orbitron font, custom animations
├── App.jsx                       routes + global components
└── main.jsx                      entry point
```

---

## Stores

Everything lives in `src/store/index.js`. Each store handles its own API calls — components just call store actions and read state.

`useAuthStore` — user, token, onboarding state (including callsign and main_goal). Handles signup, OTP verification, Google login, profile updates, account deletion.

`useMissionStore` — missions array, CRUD actions, activation.

`useMissionItemStore` — workspace items (todos, thoughts, lists) for the active mission.

`useFocusStore` — session history, daily/weekly metrics, streak, daily goal.

`useAnalyticsStore` — dashboard stats, productivity trend, system stats.

`useSubjectStore` — subjects with aggregated stats.

`useAiStore` — aria.ai message history, send/clear actions.

`useCollectibleStore` — earned collectibles, `newCollectible` state that triggers the celebration popup.

`useSocialStore` — friends list, pending/sent requests, search results, unread counts, friend sessions, leaderboard. Polls friends and unread counts every 15 seconds when the friends panel is mounted.

`useChatStore` — conversations keyed by friend ID, active chat ID. Polls the active conversation every 5 seconds.

`useStudySessionStore` — current shared study session, create/join/end/leave actions.

---

## Pages

**Dashboard** — The main page. Shows stat cards (active missions, XP, level, focus minutes), daily goal progress bar, XP bar, streak counter, quick action buttons, weekly bar chart, and the missions grid. Refreshes all stats after any action that changes them.

**Focus** — Pomodoro timer with preset durations (15, 25, 45, 60, 90 min), focus quality selector, and a status footer. Sessions are saved on finish or early stop. Also has a manual log form.

**Subjects** — Color-coded subject cards with inline edit. Stats show total minutes, completed missions, and a progress bar scaled to 10 hours.

**Stats** — Today's productivity score (circle), agent profile card, all-time records card, weekly bar chart, monthly trend summary.

**Squad** — Friends panel on the left (2/3 width on desktop), leaderboard on the right. Study Together button opens the session modal. Presence is set to "online" on mount and "offline" on unmount.

**aria.ai** — Full-height chat interface. Suggestion chips on empty state. Messages poll every 5 seconds (handled by the store). Clear history button.

**Drops** — Grid of all 11 collectible slots. Earned ones show the meme image with earned date. Locked ones show a padlock icon. Progress counter at the top.

**Onboarding** — Two-step form (callsign + main objective). Sets `sessionStorage.showTour = "1"` before navigating to dashboard so the tour fires once.

---

## Components

**NeonCard** — Base card with optional `glowing` prop that adds a pink/blue shadow.

**GlitchText** — Animated gradient text with flicker effect. Used for page headers.

**CircleProgress** — SVG ring progress indicator. Used for productivity score and focus timer.

**GridBg / ScanlineOverlay** — Fixed-position decorative backgrounds. Every page uses both.

**Badge** — Small colored label. Variants: blue, pink, purple, green, red, gray.

**MissionCard** — Shows mission title, priority badge, XP reward, deadline, and action buttons (Activate / Workspace / Complete / Delete). Active missions show a Workspace button instead of Activate.

**MissionWorkspace** — Modal with three tabs: Todos (checkable), Thoughts (freeform notes), Lists (named groups of checkable items). All items saved to DB in real time.

**FriendsPanel** — Collapsible panel. Shows online friends (with studying subject if applicable) and offline friends separately. Unread message badges on the chat button. Search panel with debounced input. Incoming request accept/reject inline.

**ChatWindow** — Floating window anchored bottom-right. Opens when you click the chat button on a friend. Polls every 5 seconds. Messages grouped by sender with timestamps.

**StudySessionModal** — Two tabs: Start Session (subject + duration picker) and Join Friend (list of active friend sessions). Active session view shows a live countdown timer and participant chips.

**Leaderboard** — Compact ranked list. Gold/silver/bronze colors for top 3. Current user highlighted in pink. Shows collectible count and XP.

**CollectibleToast** — Full-screen centered modal with CSS confetti particles (20 randomized dots that fall and spin), spring pop-in animation, meme image, title, flavor text, and a Claim button. Auto-dismisses after 6 seconds.

**TourOverlay** — 7-slide walkthrough shown once after onboarding. Slides cover: welcome (uses callsign + goal), missions, focus sessions, subjects, stats, aria.ai, XP/levels. Progress dots at the top, skip/back/next buttons.

---

## Routing

```
/login                  public
/signup                 public
/verify-email           public (OTP entry)
/auth/google/callback   public (OAuth redirect)
/onboarding             redirects to /dashboard if already completed
/dashboard              protected
/focus                  protected
/subjects               protected
/analytics              protected
/social                 protected
/ai                     protected
/collectibles           protected
```

`ProtectedRoute` checks for a valid token and whether onboarding is complete. If onboarding isn't done, it redirects to `/onboarding`. While the onboarding status is loading from the API, it renders null (blank screen) to avoid a flash redirect.

---

## Design tokens

```
neon-black:  #0a0a0f   page backgrounds
neon-dark:   #1a1a2e   card backgrounds
neon-darker: #16213e   input backgrounds, nav
neon-pink:   #ff0080   primary actions, active states
neon-blue:   #00eaff   secondary, info, links
neon-purple: #8a2be2   XP, levels, tertiary
```

Custom animations: `animate-glow` (text pulse), `animate-flicker` (GlitchText), `animate-slide-in` (toasts). The confetti in CollectibleToast uses inline `@keyframes` injected via a `<style>` tag.

---

## Environment variables

```
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

---

## Adding things

New page: create in `pages/`, add a lazy import in `App.jsx`, add a route, add a nav link in `Layout.jsx` if needed.

New store: add to `store/index.js` following the existing pattern — `create((set, get) => ({ ... }))`.

New API call: add to the relevant store action. The Axios instance in `api.js` automatically attaches the auth token and handles 401s (redirects to login unless already on a public page).

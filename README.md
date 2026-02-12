# My Sync App

# mobile root screen code exist in app/(tabs)/index.tsx
# web code exist in App.tsx and all components are exist in components folder


## 1. Safe Area Handling
- Used `document.documentElement.style.setProperty('--bento-safe-top', '40px');` in WebView for web content inside mobile app.
- Ensured top padding avoids notch and status bar.
- On mobile, wrapped content in `View` with proper padding if needed.

## 2. Android Back Button Handling
- Implemented `BackHandler` in React Native:
  - If WebView can go back (`canGoBack`), navigate web history.
  - If WebView is at root, let default system handle (exit app).
- Prevented accidental app closure during navigation.

## 3. Sync Strategy
- Web detects if running inside app via user-agent `BentoShell`.
- Mobile app sends `sync` message via `postMessage`.
- Web receives the sync response and updates UI.
- On web, simulates device response if outside app.

## 4. Screen Recording
- 60-second video shows:
  - Web in browser → Navbar, Sidebar, Footer visible.
  - Web in mobile app → Navbar, Sidebar, Footer hidden, sync button works, safe area respected.

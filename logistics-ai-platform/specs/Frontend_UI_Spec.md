# Frontend UI Specification

## 1. Stack
- **Framework:** React 19 (via Vite)
- **Styling:** Vanilla CSS (CSS Variables for themes)
- **Icons:** Inlined professional SVG vector library.
- **Client:** Native `fetch` (Zero external HTTP deps).

## 2. Design System
- **Theme Support:** Managed via `[data-theme='light'|'dark']` on root.
- **Typography:** Inter (Sans) for UI, JetBrains Mono for data.
- **Color Palette:**
  - Primary: Blue (#3b82f6)
  - Dark Mode BG: #0a0d14
  - Light Mode BG: #f8fafc

## 3. Component Architecture
- `App.jsx`: Main state container and layout organizer.
- `Sidebar`: Session management, theme toggle, and branding.
- `ChatArea`: Active workspace containing message history.
- `WelcomeScreen`: Displayed when no active analysis exists. Contains suggestion cards.
- `SQLCard`: Specialized component for rendering generated SQL queries and tabular result sets.

## 4. State Management
- `messages`: Array of chat objects { role, content, sql, data }.
- `theme`: String ['light', 'dark'], persisted to LocalStorage.
- `loading`: Boolean for UI feedback during API calls.

## 5. Visual Standards
- Micro-animations for button hovers and list entry.
- Glassmorphism effects for cards and headers.
- Semantic status chips for data rows (Delivered, Delayed, etc.).

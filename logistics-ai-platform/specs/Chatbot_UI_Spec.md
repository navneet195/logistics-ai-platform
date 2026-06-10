# Enterprise Chatbot UI Specification

## 1. Overview

The Enterprise Chatbot is a modern, multi-agent conversational interface built into the Logistics AI Platform. It allows users to select from available AI agents and engage in natural-language conversations about logistics operations, shipment tracking, route optimization, and supply chain analytics.

### Design Philosophy
- **SaaS Enterprise Style**: Inspired by ChatGPT Enterprise, Microsoft Copilot, and Azure AI Studio
- **Visual Language**: White cards, subtle shadows (`box-shadow`), rounded corners (`border-radius: 12–16px`), gray borders (`#e2e8f0`), green status accents (`#22c55e`)
- **Typography**: Inter (UI), JetBrains Mono (data/code)
- **Animations**: Framer Motion for smooth view transitions, message entry, and micro-interactions

---

## 2. Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 (Vite) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 (with `@theme` design tokens) |
| UI Primitives | ShadCN-style components (Radix UI + CVA) |
| Animations | Framer Motion |
| Icons | Lucide React |
| State | React `useState` / `useCallback` (local state) |

---

## 3. User Flow

```
┌──────────────────┐      ┌──────────────────────────────────────────────┐
│ Agent Dashboard   │─────▶│ Chatbot Page                                │
│                   │      │ ┌──────────┬────────────────┬──────────────┐ │
│ • Agent Cards     │      │ │ Sidebar  │  Chat Area     │ Agent Detail │ │
│ • Status Badges   │      │ │          │  (Welcome →    │              │ │
│ • "Start Chat"    │      │ │          │   Conversation)│              │ │
│                   │      │ └──────────┴────────────────┴──────────────┘ │
└──────────────────┘      └──────────────────────────────────────────────┘
```

1. **Agent Dashboard** — User sees all available agents as cards
2. **Click "Start Chat"** — Transitions to the 3-column chatbot layout
3. **Welcome State** — Centered robot icon, heading, and agent-specific description
4. **First Message** — Welcome state disappears; conversation begins
5. **Ongoing Chat** — Message bubbles, typing indicator, agent responses

---

## 4. Views & Components

### 4.1 Agent Dashboard (`AgentDashboard.tsx`)
- **Location**: Full-screen, replaces 3-column layout
- **Layout**: Responsive grid — 1 col (mobile), 2 col (tablet), 3 col (desktop)
- **Agent Card** contents:
  - Avatar emoji (gradient background)
  - Agent name + role subtitle
  - Status badge (Online / Busy / Offline) — top-right corner
  - Description text (3-line clamp)
  - Capability tags (first 3 + "+N more")
  - **"Start Chat"** button (primary blue, disabled if offline)
- **Animations**: Staggered card entry via Framer Motion

### 4.2 Chatbot Page — 3-Column Layout

#### Left Sidebar (`Sidebar.tsx`, 300px)
| Element | Details |
|---------|---------|
| Logo | Gradient icon + "Logistics AI / Enterprise Platform" |
| "← Back to Agents" | Returns to Agent Dashboard |
| New Conversation | Primary CTA button |
| Search | Input with focus ring animation |
| Recent Chats | List with avatar, title, preview, timestamp, unread badge |
| Settings | Footer button with chevron |

#### Center — Chat Area (`ChatArea.tsx`, flex-1)
| Element | Details |
|---------|---------|
| Agent Header | Avatar, name, status badge (Online/Busy/Offline), role subtitle |
| Welcome State | Robot icon (🤖, bouncing), "Start a conversation" heading, agent-specific description |
| Message Bubbles | User = blue right-aligned, Agent = white left-aligned with avatar |
| Markdown Support | Bold text, tables, code blocks rendered inline |
| Typing Indicator | Three animated dots + "{Agent} is typing..." |
| Input Bar | Sticky bottom, auto-resize textarea, paperclip, emoji, send button |
| Disclaimer | "Logistics AI can make mistakes. Verify important data." |

#### Right — Agent Details (`AgentDetails.tsx`, 320px)
| Element | Details |
|---------|---------|
| Header | "Agent Details" with info icon |
| Profile Card | Large avatar, name, role, status indicator |
| Description | Full agent description text |
| Capabilities | List with bullet indicators |
| Stats | 2-col grid: Trust Score (98.7%), Avg Response (1.2s) |
| Suggested Prompts | Clickable cards with chevron that auto-send the prompt |

---

## 5. Responsive Behavior

| Breakpoint | Sidebar | Chat Area | Agent Details |
|-----------|---------|-----------|--------------|
| Desktop (≥1280px) | Visible | Visible | Visible |
| Tablet (≥1024px) | Visible | Visible | Hidden (toggle via ⋮ button) |
| Mobile (<1024px) | Hidden (hamburger toggle, overlay) | Visible | Hidden (toggle via ⋮ button) |

- Sidebar and Agent Details use **slide-in overlays** on smaller screens with backdrop blur
- All panels animate in/out via CSS transforms

---

## 6. State Management

```typescript
interface AppState {
  currentView: "dashboard" | "chat";    // View routing
  activeAgent: Agent | null;            // Selected agent
  messages: Message[];                  // Current conversation
  chatSessions: ChatSession[];          // Sidebar history
  activeChatId: string | null;          // Selected session
  isTyping: boolean;                    // Typing indicator
  sidebarOpen: boolean;                 // Mobile sidebar toggle
  detailsOpen: boolean;                 // Mobile details toggle
}
```

### Key Types
```typescript
interface Agent {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: "online" | "offline" | "busy";
  description: string;
  capabilities: string[];
  suggestedPrompts: string[];
}

interface Message {
  id: string;
  content: string;
  role: "user" | "agent";
  timestamp: Date;
  agentId?: string;
}

interface ChatSession {
  id: string;
  title: string;
  agentId: string;
  lastMessage: string;
  lastMessageTime: Date;
  unread: number;
}
```

---

## 7. Mock Chat Behavior

- User sends a message → message appears immediately
- `isTyping = true` for 1.2–2.7 seconds (randomized)
- Agent responds with a contextual mock response (per-agent response pool)
- Chat session sidebar updates with latest message preview + timestamp

---

## 8. Design Tokens (Tailwind CSS v4 `@theme`)

```css
--color-primary: #1e40af;
--color-background: #f8fafc;
--color-card: #ffffff;
--color-border: #e2e8f0;
--color-success: #22c55e;
--color-success-light: #dcfce7;
--color-muted-foreground: #64748b;
--color-user-bubble: #1e40af;
--color-agent-bubble: #eff6ff;
--shadow-card: 0 1px 3px rgba(0,0,0,0.06);
--shadow-card-hover: 0 4px 12px rgba(0,0,0,0.08);
--radius-xl: 1rem;
--radius-2xl: 1.5rem;
```

---

## 9. File Structure

```
src/
├── components/
│   ├── AgentDashboard.tsx    # Agent selection grid
│   ├── AgentDetails.tsx      # Right panel — details & prompts
│   ├── ChatArea.tsx          # Center — messages & input
│   └── Sidebar.tsx           # Left — navigation & history
├── data/
│   └── mockData.ts           # Agents, sessions, messages, responses
├── lib/
│   └── utils.ts              # cn(), formatTime(), formatDate()
├── types/
│   └── index.ts              # TypeScript interfaces
├── App.tsx                   # Root — view switching & state
├── main.tsx                  # Entry point
├── index.css                 # Tailwind + design tokens
└── vite-env.d.ts             # Vite types
```

---

## 10. Accessibility & SEO

- All interactive elements have unique `id` attributes for testing
- Semantic HTML (`<aside>`, `<main>`, `<button>`, `<nav>`)
- Keyboard navigation: `Enter` to send messages, `Shift+Enter` for newlines
- ARIA labels on icon-only buttons
- `<title>` and `<meta description>` set in `index.html`
- Responsive viewport meta tag

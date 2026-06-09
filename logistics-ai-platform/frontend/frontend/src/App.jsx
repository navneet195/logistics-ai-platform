import { useState, useRef, useEffect, useCallback } from 'react'

// ─── SVG Icons (Lucide-style) ──────────────────────────────
const Icons = {
  Ship: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" /><path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76" /><path d="M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6" /><path d="M12 10v4" /><path d="M12 2v3" /></svg>
  ),
  Box: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" /></svg>
  ),
  Database: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5V19A9 3 0 0 0 21 19V5" /><path d="M3 12A9 3 0 0 0 21 12" /></svg>
  ),
  MessageSquare: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
  ),
  Send: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
  ),
  Plus: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y2="12" x2="19" y2="12" /></svg>
  ),
  Moon: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></svg>
  ),
  Sun: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" /></svg>
  ),
  TrendingUp: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>
  ),
  AlertTriangle: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
  ),
  Code: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
  )
}

// ─── Constants ──────────────────────────────────────────────
const API_BASE = 'http://localhost:8000'

const SUGGESTIONS = [
  { label: 'Delayed Shipments', query: 'Show me all delayed shipments', icon: <Icons.AlertTriangle /> },
  { label: 'Profit Analysis', query: 'Show profit analysis by customer', icon: <Icons.TrendingUp /> },
  { label: 'Route Registry', query: 'Show me all available shipping routes', icon: <Icons.Ship /> },
  { label: 'Inventory Overview', query: 'Show me recent shipments with container count', icon: <Icons.Box /> },
]

// ─── Components ─────────────────────────────────────────────

function SQLCard({ sql, data }) {
  if (!data) return null
  return (
    <div className="sql-card">
      <div className="sql-header">
        <span className="sql-title"><Icons.Code /> Generated SQL Query</span>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{data.length} results</span>
      </div>
      <div className="sql-code">{sql}</div>
      <div className="sql-table-container">
        <table className="sql-table">
          <thead>
            <tr>
              {data.length > 0 && Object.keys(data[0]).map(k => <th key={k}>{k.replace(/_/g, ' ')}</th>)}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i}>
                {Object.keys(row).map(k => (
                  <td key={k}>
                    {k.toLowerCase().includes('status')
                      ? <span className={`status-chip ${row[k]}`}>{row[k]}</span>
                      : String(row[k] ?? '—')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function WelcomeScreen({ onSend }) {
  return (
    <div className="welcome-screen">
      <div className="welcome-logo">
        <img src="/app_icon.png" alt="LogisticsAI" style={{ width: '100%', borderRadius: 'inherit' }} />
      </div>
      <div>
        <h1 className="welcome-title">Welcome to Logistics AI</h1>
        <p className="welcome-sub">Analyze your fleet, shipments, and financial performance using natural language queries.</p>
      </div>
      <div className="suggestion-grid">
        {SUGGESTIONS.map(s => (
          <div key={s.label} className="suggestion-card" onClick={() => onSend(s.query)}>
            <div className="suggestion-header">
              <div className="suggestion-icon">{s.icon}</div>
              <span className="suggestion-label">{s.label}</span>
            </div>
            <span className="suggestion-query">{s.query}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark')
  const [sessions, setSessions] = useState([
    { id: '1', title: 'Delayed shipments analytics', createdAt: new Date() },
    { id: '2', title: 'Q4 Revenue per route', createdAt: new Date() }
  ])
  const [activeSessionId, setActiveSessionId] = useState(null)
  const [messages, setMessages] = useState([])
  const [inputText, setInputText] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark')

  const handleSend = async (text = inputText) => {
    if (!text.trim()) return
    const userMsg = { role: 'user', content: text, time: new Date() }
    setMessages(prev => [...prev, userMsg])
    setInputText('')
    setLoading(true)

    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: 'Query processed successfully.', ...data, time: new Date() }])
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Failed to connect to backend.', error: true, time: new Date() }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="brand-icon">
              <img src="/app_icon.png" alt="L" />
            </div>
            <div>
              <div className="brand-text">LogisticsAI</div>
              <div className="brand-sub">Smart Platform</div>
            </div>
          </div>
          <button className="new-chat-btn" onClick={() => { setMessages([]); setActiveSessionId(null); }}>
            <Icons.Plus /> New Analysis
          </button>
        </div>

        <div className="sidebar-sessions">
          <div className="sessions-label">Recent Activity</div>
          {sessions.map(s => (
            <div key={s.id} className={`session-item ${activeSessionId === s.id ? 'active' : ''}`} onClick={() => setActiveSessionId(s.id)}>
              <div className="session-icon"><Icons.MessageSquare /></div>
              <div className="session-content">
                <div className="session-title">{s.title}</div>
                <div className="session-time">Today, 2:30 PM</div>
              </div>
            </div>
          ))}
        </div>

        <div className="sidebar-footer">
          <button className="theme-toggle-btn" onClick={toggleTheme}>
            {theme === 'dark' ? <><Icons.Sun /> Switch to Light</> : <><Icons.Moon /> Switch to Dark</>}
          </button>
          <div className="db-status">
            <div className="status-dot" />
            <span>Connected: PostgreSQL</span>
          </div>
        </div>
      </aside>

      <main className="chat-area">
        <header className="chat-topbar">
          <div>
            <div className="topbar-title">{activeSessionId ? 'Analysis Report' : 'Global Workspace'}</div>
            <div className="topbar-subtitle">Active Engine: SQL-GPT-4</div>
          </div>
          <div className="topbar-badges">
            <span className="badge badge-blue">Ready</span>
            <span className="badge badge-green">Secured</span>
          </div>
        </header>

        <div className="chat-window">
          {messages.length === 0 ? (
            <WelcomeScreen onSend={handleSend} />
          ) : (
            messages.map((m, i) => (
              <div key={i} className={`message-group ${m.role}`}>
                <div className="message-row">
                  <div className="bubble">
                    {m.content}
                  </div>
                </div>
                {m.sql && <SQLCard sql={m.sql} data={m.data} />}
                <div className="bubble-meta">{m.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              </div>
            ))
          )}
          {loading && (
            <div className="message-group assistant">
              <div className="bubble assistant">
                <div className="typing-dots"><div className="dot" /><div className="dot" /><div className="dot" /></div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="input-container">
          <div className="input-box">
            <textarea
              className="chat-textarea"
              placeholder="Query database... (e.g. show me late shipments)"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
              rows={1}
            />
            <button className="send-btn" onClick={() => handleSend()} disabled={!inputText.trim() || loading}>
              <Icons.Send />
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

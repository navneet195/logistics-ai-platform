import { useState, useRef, useEffect, useCallback } from 'react'

// ─── Constants ──────────────────────────────────────────────
const API_BASE = 'http://localhost:8000'

const SUGGESTIONS = [
  { label: 'Delayed shipments', query: 'Show me all delayed shipments', icon: '🚨' },
  { label: 'Cost breakdown', query: 'Show profit analysis by customer', icon: '📊' },
  { label: 'Recent shipments', query: 'Show me recent shipments', icon: '📦' },
  { label: 'Overdue invoices', query: 'Show overdue invoices', icon: '💰' },
]

// ─── Utility Helpers ────────────────────────────────────────
function formatTime(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function formatCell(value, key) {
  if (value === null || value === undefined) return <span style={{ color: 'var(--text-muted)' }}>—</span>

  const keyLower = key.toLowerCase()
  const strVal = String(value)

  // Status chips
  const statusKeys = ['status', 'invoice_status', 'claim_status', 'payment_status']
  if (statusKeys.includes(keyLower)) {
    return <span className={`status-chip ${value}`}>{value}</span>
  }

  // Numeric formatting for money/cost fields
  const moneyKeys = ['amount', 'cost', 'revenue', 'profit', 'limit', 'credit', 'tax']
  if (moneyKeys.some(k => keyLower.includes(k)) && !isNaN(value)) {
    return (
      <span className="numeric">
        ${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </span>
    )
  }

  // Generic numeric
  if (!isNaN(value) && strVal !== '' && keyLower !== 'id' && !keyLower.endsWith('_id')) {
    return <span className="numeric">{Number(value).toLocaleString()}</span>
  }

  return strVal
}

function isNumericCol(key, data) {
  const moneyKeys = ['amount', 'cost', 'revenue', 'profit', 'limit', 'credit', 'tax']
  if (moneyKeys.some(k => key.toLowerCase().includes(k))) return true
  if (data.length > 0 && !isNaN(data[0][key]) && data[0][key] !== null) return true
  return false
}

// ─── SQL Result Card ────────────────────────────────────────
function SQLCard({ sql, data }) {
  const [expanded, setExpanded] = useState(true)

  if (!data || data.length === 0) {
    return (
      <div className="sql-card">
        <div className="sql-card-header">
          <span className="sql-label">⚙ SQL Query</span>
          <span className="row-count">0 rows</span>
        </div>
        <div className="sql-code">{sql}</div>
        <div style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '13px' }}>
          No results found.
        </div>
      </div>
    )
  }

  const cols = Object.keys(data[0])

  return (
    <div className="sql-card">
      <div className="sql-card-header">
        <span className="sql-label">⚙ Generated SQL</span>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span className="row-count">{data.length} rows</span>
          <button
            onClick={() => setExpanded(e => !e)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text-muted)', fontSize: '12px', padding: '2px 6px',
              borderRadius: '4px', transition: 'color 0.2s'
            }}
            onMouseEnter={e => e.target.style.color = 'var(--text-primary)'}
            onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
          >
            {expanded ? '▲ hide' : '▼ show'}
          </button>
        </div>
      </div>

      <div className="sql-code">{sql.trim()}</div>

      {expanded && (
        <div className="sql-table-wrap">
          <table className="sql-table">
            <thead>
              <tr>
                {cols.map(c => (
                  <th key={c} style={{ textAlign: isNumericCol(c, data) ? 'right' : 'left' }}>
                    {c.replace(/_/g, ' ')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={i}>
                  {cols.map(c => (
                    <td key={c} style={{ textAlign: isNumericCol(c, data) ? 'right' : 'left' }}>
                      {formatCell(row[c], c)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ─── Message Bubble ─────────────────────────────────────────
function MessageBubble({ msg }) {
  const isUser = msg.role === 'user'

  return (
    <div className="message-group">
      <div className={`message-row ${msg.role}`}>
        <div className={`avatar ${isUser ? 'user-avatar' : 'bot-avatar'}`}>
          {isUser ? 'U' : '🤖'}
        </div>
        <div>
          <div className={`bubble ${msg.role}`}>
            {isUser ? msg.content : (
              msg.error
                ? <span style={{ color: '#fc8181' }}>{msg.content}</span>
                : msg.content
            )}
          </div>
          <div className={`bubble-meta`} style={{ textAlign: isUser ? 'right' : 'left' }}>
            {formatTime(msg.time || new Date())}
          </div>
        </div>
      </div>

      {!isUser && msg.sql && msg.data && (
        <div style={{ paddingLeft: '44px' }}>
          <SQLCard sql={msg.sql} data={msg.data} />
        </div>
      )}
    </div>
  )
}

// ─── Typing Indicator ───────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="message-group">
      <div className="message-row assistant">
        <div className="avatar bot-avatar">🤖</div>
        <div className="bubble assistant">
          <div className="typing-indicator">
            <div className="typing-dot" />
            <div className="typing-dot" />
            <div className="typing-dot" />
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Chat Input ─────────────────────────────────────────────
function ChatInput({ onSend, disabled }) {
  const [text, setText] = useState('')
  const ref = useRef(null)

  const handleSend = () => {
    const trimmed = text.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setText('')
    if (ref.current) {
      ref.current.style.height = 'auto'
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleInput = (e) => {
    setText(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 140) + 'px'
  }

  return (
    <div className="input-area">
      <div className="input-wrap">
        <textarea
          ref={ref}
          className="chat-textarea"
          placeholder="Ask anything about shipments, routes, invoices, claims…"
          value={text}
          onChange={handleInput}
          onKeyDown={handleKey}
          rows={1}
          disabled={disabled}
          id="chat-input"
        />
        <button
          className="send-btn"
          onClick={handleSend}
          disabled={!text.trim() || disabled}
          id="send-btn"
          title="Send message"
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
      <div className="input-hint">
        Press <kbd>Enter</kbd> to send · <kbd>Shift+Enter</kbd> for new line
      </div>
    </div>
  )
}

// ─── Sidebar ────────────────────────────────────────────────
function Sidebar({ sessions, activeId, onSelect, onNew }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <div className="brand-icon">🚢</div>
          <div>
            <div className="brand-text">LogisticsAI</div>
            <div className="brand-sub">Analytics Platform</div>
          </div>
        </div>
        <button className="new-chat-btn" onClick={onNew} id="new-chat-btn">
          <span>＋</span> New Analysis
        </button>
      </div>

      <div className="sidebar-sessions">
        {sessions.length > 0 && (
          <div className="sessions-label">Recent Sessions</div>
        )}
        {sessions.map(s => (
          <div
            key={s.id}
            className={`session-item ${s.id === activeId ? 'active' : ''}`}
            onClick={() => onSelect(s.id)}
          >
            <div className="session-title">{s.title}</div>
            <div className="session-time">{formatTime(s.createdAt)}</div>
          </div>
        ))}
      </div>

      <div className="sidebar-footer">
        <div className="db-status">
          <div className="status-dot" />
          <span>logistics_db · 100K shipments</span>
        </div>
      </div>
    </aside>
  )
}

// ─── Welcome Screen ─────────────────────────────────────────
function WelcomeScreen({ onSuggestion }) {
  return (
    <div className="welcome-screen">
      <div className="welcome-icon">🚢</div>
      <div>
        <h1 className="welcome-title">Logistics AI Platform</h1>
        <p className="welcome-sub">
          Query your logistics database in plain English. Ask about shipments,
          delays, routes, invoices, and claims.
        </p>
      </div>
      <div className="suggestion-grid">
        {SUGGESTIONS.map(s => (
          <button
            key={s.query}
            className="suggestion-card"
            onClick={() => onSuggestion(s.query)}
            id={`suggestion-${s.label.replace(/\s+/g, '-').toLowerCase()}`}
          >
            <strong>{s.icon} {s.label}</strong>
            {s.query}
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Main App ───────────────────────────────────────────────
export default function App() {
  const [sessions, setSessions] = useState([])
  const [activeSessionId, setActiveSessionId] = useState(null)
  const [messagesBySession, setMessagesBySession] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const bottomRef = useRef(null)

  const activeMessages = activeSessionId ? (messagesBySession[activeSessionId] || []) : []

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeMessages, loading])

  const createSession = useCallback((firstQuery) => {
    const id = crypto.randomUUID()
    const session = {
      id,
      title: firstQuery.length > 40 ? firstQuery.slice(0, 40) + '…' : firstQuery,
      createdAt: new Date(),
    }
    setSessions(prev => [session, ...prev])
    setActiveSessionId(id)
    return id
  }, [])

  const sendMessage = useCallback(async (text) => {
    setError(null)
    let sessionId = activeSessionId

    // Create a new session for first message
    if (!sessionId) {
      sessionId = createSession(text)
    }

    const userMsg = { role: 'user', content: text, time: new Date() }

    setMessagesBySession(prev => ({
      ...prev,
      [sessionId]: [...(prev[sessionId] || []), userMsg],
    }))

    setLoading(true)

    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.detail || `Server error: ${res.status}`)
      }

      const json = await res.json()

      const botMsg = {
        role: 'assistant',
        content: `Found ${json.data?.length ?? 0} result${json.data?.length !== 1 ? 's' : ''}.`,
        sql: json.sql,
        data: json.data,
        time: new Date(),
      }

      setMessagesBySession(prev => ({
        ...prev,
        [sessionId]: [...(prev[sessionId] || []), botMsg],
      }))
    } catch (err) {
      const errMsg = {
        role: 'assistant',
        content: `Error: ${err.message}. Make sure the backend is running at ${API_BASE}.`,
        error: true,
        time: new Date(),
      }
      setMessagesBySession(prev => ({
        ...prev,
        [sessionId]: [...(prev[sessionId] || []), errMsg],
      }))
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [activeSessionId, createSession])

  const handleNewChat = () => {
    setActiveSessionId(null)
    setError(null)
  }

  const handleSelectSession = (id) => {
    setActiveSessionId(id)
    setError(null)
  }

  return (
    <div className="app-layout">
      <Sidebar
        sessions={sessions}
        activeId={activeSessionId}
        onSelect={handleSelectSession}
        onNew={handleNewChat}
      />

      <div className="chat-area">
        {/* Top bar */}
        <div className="chat-topbar">
          <div>
            <div className="topbar-title">
              {activeSessionId
                ? sessions.find(s => s.id === activeSessionId)?.title || 'Analysis'
                : 'New Analysis'}
            </div>
            <div className="topbar-subtitle">Natural language → SQL → Results</div>
          </div>
          <div className="topbar-badges">
            <span className="badge badge-blue">FastAPI</span>
            <span className="badge badge-green">PostgreSQL</span>
          </div>
        </div>

        {/* Messages */}
        <div className="chat-window">
          {activeMessages.length === 0 ? (
            <WelcomeScreen onSuggestion={sendMessage} />
          ) : (
            activeMessages.map((msg, i) => (
              <MessageBubble key={i} msg={msg} />
            ))
          )}
          {loading && <TypingIndicator />}
          {error && (
            <div className="error-toast">
              ⚠ {error} — is the backend running? <code>uvicorn app.main:app --reload</code>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <ChatInput onSend={sendMessage} disabled={loading} />
      </div>
    </div>
  )
}

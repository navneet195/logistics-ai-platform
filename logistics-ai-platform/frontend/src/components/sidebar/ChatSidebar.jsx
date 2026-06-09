export default function ChatSidebar({ sessions, onSelect }) {
    return (
        <div className="sidebar">
            <h3>Sessions</h3>
            {sessions.map(s => (
                <div key={s.id} onClick={() => onSelect(s.id)}>
                    {s.title || "New Chat"}
                </div>
            ))}
        </div>
    );
}
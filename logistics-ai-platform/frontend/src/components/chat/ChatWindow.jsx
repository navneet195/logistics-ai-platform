import SQLCard from "../viz/SQLCard";

export default function ChatWindow({ messages }) {
    return (
        <div className="chat-window">
            {messages.map((msg, i) => (
                <div key={i}>
                    <div className={`msg ${msg.role}`}>
                        {msg.content}
                    </div>

                    {msg.sql && (
                        <SQLCard sql={msg.sql} data={JSON.parse(msg.content)} />
                    )}
                </div>
            ))}
        </div>
    );
}
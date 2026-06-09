import { useState, useEffect } from "react";
import axios from "axios";
import { v4 as uuid } from "uuid";

export default function useChat() {

    const [messages, setMessages] = useState([]);
    const [sessionId, setSessionId] = useState(uuid());

    const sendMessage = async (text) => {

        const userMsg = { role: "user", content: text };
        setMessages(prev => [...prev, userMsg]);

        const res = await axios.post("http://localhost:8000/chat", {
            message: text
        });

        const botMsg = {
            role: "assistant",
            content: JSON.stringify(res.data.data),
            sql: res.data.sql
        };

        setMessages(prev => [...prev, botMsg]);
    };

    return { messages, sendMessage, sessionId };
}
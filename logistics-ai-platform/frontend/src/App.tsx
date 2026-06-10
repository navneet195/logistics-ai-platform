import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sidebar } from "@/components/Sidebar";
import { ChatArea } from "@/components/ChatArea";
import { AgentDetails } from "@/components/AgentDetails";
import { AgentDashboard } from "@/components/AgentDashboard";
import { Agent, Message, ChatSession } from "@/types";
import {
    agents,
    mockChatSessions,
    getAgentResponse,
} from "@/data/mockData";

type View = "dashboard" | "chat";

function App() {
    const [currentView, setCurrentView] = useState<View>("dashboard");
    const [activeAgent, setActiveAgent] = useState<Agent | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [chatSessions, setChatSessions] =
        useState<ChatSession[]>(mockChatSessions);
    const [activeChatId, setActiveChatId] = useState<string | null>(null);
    const [isTyping, setIsTyping] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [detailsOpen, setDetailsOpen] = useState(false);

    /* ── Agent Dashboard → Chat ── */
    const handleStartChat = useCallback((agent: Agent) => {
        setActiveAgent(agent);
        setMessages([]); // empty → shows welcome state
        const newSession: ChatSession = {
            id: `chat-${Date.now()}`,
            title: `Chat with ${agent.name}`,
            agentId: agent.id,
            lastMessage: "Start a new conversation...",
            lastMessageTime: new Date(),
            unread: 0,
        };
        setChatSessions((prev) => [newSession, ...prev]);
        setActiveChatId(newSession.id);
        setCurrentView("chat");
    }, []);

    const handleBackToDashboard = useCallback(() => {
        setCurrentView("dashboard");
        setActiveAgent(null);
        setMessages([]);
        setActiveChatId(null);
        setSidebarOpen(false);
        setDetailsOpen(false);
    }, []);

    /* ── Messaging ── */
    const handleSendMessage = useCallback(
        (content: string) => {
            if (!activeAgent) return;

            const userMsg: Message = {
                id: `msg-${Date.now()}`,
                content,
                role: "user",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, userMsg]);

            // Update active chat session
            if (activeChatId) {
                setChatSessions((prev) =>
                    prev.map((s) =>
                        s.id === activeChatId
                            ? { ...s, lastMessage: content, lastMessageTime: new Date() }
                            : s
                    )
                );
            }

            // Simulate agent response
            setIsTyping(true);
            const delay = 1200 + Math.random() * 1500;
            setTimeout(() => {
                const agentMsg: Message = {
                    id: `msg-${Date.now()}-agent`,
                    content: getAgentResponse(activeAgent.id),
                    role: "agent",
                    timestamp: new Date(),
                    agentId: activeAgent.id,
                };
                setMessages((prev) => [...prev, agentMsg]);
                setIsTyping(false);

                if (activeChatId) {
                    setChatSessions((prev) =>
                        prev.map((s) =>
                            s.id === activeChatId
                                ? {
                                    ...s,
                                    lastMessage: agentMsg.content.substring(0, 60) + "...",
                                    lastMessageTime: new Date(),
                                }
                                : s
                        )
                    );
                }
            }, delay);
        },
        [activeAgent, activeChatId]
    );

    /* ── Sidebar actions ── */
    const handleSelectChat = useCallback((chatId: string) => {
        setActiveChatId(chatId);
        setSidebarOpen(false);
        setChatSessions((prev) =>
            prev.map((s) => (s.id === chatId ? { ...s, unread: 0 } : s))
        );
    }, []);

    const handleNewChat = useCallback(() => {
        if (!activeAgent) return;
        const newSession: ChatSession = {
            id: `chat-${Date.now()}`,
            title: "New Conversation",
            agentId: activeAgent.id,
            lastMessage: "Start a new conversation...",
            lastMessageTime: new Date(),
            unread: 0,
        };
        setChatSessions((prev) => [newSession, ...prev]);
        setActiveChatId(newSession.id);
        setMessages([]);
        setSidebarOpen(false);
    }, [activeAgent]);

    const handlePromptClick = useCallback(
        (prompt: string) => {
            handleSendMessage(prompt);
            setDetailsOpen(false);
        },
        [handleSendMessage]
    );

    /* ── Render ── */
    return (
        <AnimatePresence mode="wait">
            {currentView === "dashboard" ? (
                <motion.div
                    key="dashboard"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                    className="h-screen w-full bg-background"
                >
                    <AgentDashboard agents={agents} onStartChat={handleStartChat} />
                </motion.div>
            ) : activeAgent ? (
                <motion.div
                    key="chat"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="flex h-screen w-full overflow-hidden bg-background"
                >
                    <Sidebar
                        chatSessions={chatSessions}
                        activeChatId={activeChatId}
                        onSelectChat={handleSelectChat}
                        onNewChat={handleNewChat}
                        onBackToAgents={handleBackToDashboard}
                        isOpen={sidebarOpen}
                        onToggle={() => setSidebarOpen(!sidebarOpen)}
                    />
                    <ChatArea
                        agent={activeAgent}
                        messages={messages}
                        onSend={handleSendMessage}
                        isTyping={isTyping}
                        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                        onToggleDetails={() => setDetailsOpen(!detailsOpen)}
                    />
                    <AgentDetails
                        agent={activeAgent}
                        onPromptClick={handlePromptClick}
                        isOpen={detailsOpen}
                        onClose={() => setDetailsOpen(false)}
                    />
                </motion.div>
            ) : null}
        </AnimatePresence>
    );
}

export default App;

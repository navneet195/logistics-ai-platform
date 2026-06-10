import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Paperclip, Smile, MoreVertical, Bot } from "lucide-react";
import { cn, formatTime } from "@/lib/utils";
import { Agent, Message } from "@/types";
import { SidebarTrigger } from "./Sidebar";

interface ChatAreaProps {
    agent: Agent;
    messages: Message[];
    onSend: (content: string) => void;
    isTyping: boolean;
    onToggleSidebar: () => void;
    onToggleDetails: () => void;
}

/* ── Welcome State ── */
function WelcomeState({ agent }: { agent: Agent }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.35 }}
            className="flex-1 flex items-center justify-center px-6"
        >
            <div className="text-center max-w-md">
                {/* Animated robot icon */}
                <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                    className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center mx-auto mb-6 border border-blue-200/60 shadow-sm"
                >
                    <Bot className="w-10 h-10 text-primary" />
                </motion.div>

                <h2 className="text-xl font-semibold text-foreground mb-2">
                    Start a conversation
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    Ask{" "}
                    <span className="font-medium text-foreground">{agent.name}</span>{" "}
                    anything about logistics operations, shipment tracking, delivery
                    management, inventory monitoring, and supply chain workflows.
                </p>

                {/* Quick-start hint */}
                <div className="mt-8 flex flex-wrap justify-center gap-2">
                    {agent.suggestedPrompts.slice(0, 3).map((prompt, i) => (
                        <motion.span
                            key={prompt}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + i * 0.1 }}
                            className="inline-block px-3 py-1.5 bg-secondary/60 text-xs text-muted-foreground rounded-lg border border-border"
                        >
                            "{prompt}"
                        </motion.span>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

/* ── Typing Indicator ── */
function TypingIndicator({ agentName, avatar }: { agentName: string; avatar: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex items-end gap-2.5 max-w-[75%]"
        >
            <div className="w-8 h-8 rounded-full bg-agent-bubble flex items-center justify-center text-sm flex-shrink-0 border border-border">
                {avatar}
            </div>
            <div className="bg-white border border-border rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                <div className="flex items-center gap-1.5">
                    <div className="typing-dot w-2 h-2 rounded-full bg-muted-foreground/50" />
                    <div className="typing-dot w-2 h-2 rounded-full bg-muted-foreground/50" />
                    <div className="typing-dot w-2 h-2 rounded-full bg-muted-foreground/50" />
                </div>
                <p className="text-[10px] text-muted-foreground mt-1.5">
                    {agentName} is typing...
                </p>
            </div>
        </motion.div>
    );
}

/* ── Message Bubble ── */
function MessageBubble({ message, agent }: { message: Message; agent: Agent }) {
    const isUser = message.role === "user";

    const renderContent = (content: string) => {
        const parts = content.split("\n");
        const elements: React.ReactNode[] = [];
        let tableRows: string[] = [];
        let inTable = false;

        parts.forEach((line, idx) => {
            if (line.startsWith("|") && line.endsWith("|")) {
                if (!inTable) inTable = true;
                tableRows.push(line);
            } else {
                if (inTable) {
                    elements.push(renderTable(tableRows, elements.length));
                    tableRows = [];
                    inTable = false;
                }
                if (line.startsWith("```")) {
                    // skip code fence markers
                } else if (line.trim()) {
                    elements.push(
                        <p key={`p-${idx}`} className="mb-1 last:mb-0">
                            {renderInlineFormatting(line)}
                        </p>
                    );
                } else {
                    elements.push(<br key={`br-${idx}`} />);
                }
            }
        });

        if (inTable) {
            elements.push(renderTable(tableRows, elements.length));
        }

        return elements;
    };

    const renderInlineFormatting = (text: string) => {
        const parts = text.split(/(\*\*[^*]+\*\*)/g);
        return parts.map((part, i) => {
            if (part.startsWith("**") && part.endsWith("**")) {
                return (
                    <strong key={i} className="font-semibold">
                        {part.slice(2, -2)}
                    </strong>
                );
            }
            return <span key={i}>{part}</span>;
        });
    };

    const renderTable = (rows: string[], key: number) => {
        const headerCells = rows[0]
            ?.split("|")
            .filter(Boolean)
            .map((c) => c.trim());
        const dataRows = rows.slice(2);

        return (
            <div
                key={`table-${key}`}
                className="my-2 overflow-x-auto rounded-lg border border-border"
            >
                <table className="w-full text-xs">
                    <thead>
                        <tr className="bg-secondary/60">
                            {headerCells?.map((cell, i) => (
                                <th
                                    key={i}
                                    className="px-3 py-2 text-left font-semibold text-foreground"
                                >
                                    {cell}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {dataRows.map((row, ri) => {
                            const cells = row
                                .split("|")
                                .filter(Boolean)
                                .map((c) => c.trim());
                            return (
                                <tr
                                    key={ri}
                                    className="border-t border-border hover:bg-secondary/30 transition-colors"
                                >
                                    {cells.map((cell, ci) => (
                                        <td key={ci} className="px-3 py-2 text-muted-foreground">
                                            {cell}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className={cn(
                "flex gap-2.5 max-w-[80%]",
                isUser ? "ml-auto flex-row-reverse" : ""
            )}
        >
            {!isUser && (
                <div className="w-8 h-8 rounded-full bg-agent-bubble flex items-center justify-center text-sm flex-shrink-0 border border-border self-end">
                    {agent.avatar}
                </div>
            )}
            <div
                className={cn(
                    "rounded-2xl px-4 py-3 shadow-sm",
                    isUser
                        ? "bg-user-bubble text-user-bubble-text rounded-br-md"
                        : "bg-white text-foreground border border-border rounded-bl-md"
                )}
            >
                <div
                    className={cn("text-[13.5px] leading-relaxed", isUser ? "text-white" : "")}
                >
                    {renderContent(message.content)}
                </div>
                <p
                    className={cn(
                        "text-[10px] mt-2",
                        isUser ? "text-white/60 text-right" : "text-muted-foreground/60"
                    )}
                >
                    {formatTime(message.timestamp)}
                </p>
            </div>
        </motion.div>
    );
}

/* ── Main Chat Area ── */
export function ChatArea({
    agent,
    messages,
    onSend,
    isTyping,
    onToggleSidebar,
    onToggleDetails,
}: ChatAreaProps) {
    const [input, setInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const hasMessages = messages.length > 0;

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping, scrollToBottom]);

    const handleSend = () => {
        if (!input.trim()) return;
        onSend(input.trim());
        setInput("");
        if (inputRef.current) {
            inputRef.current.style.height = "auto";
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value);
        const el = e.target;
        el.style.height = "auto";
        el.style.height = Math.min(el.scrollHeight, 120) + "px";
    };

    return (
        <div className="flex-1 flex flex-col min-w-0 bg-chat-bg">
            {/* Agent Header */}
            <div className="flex items-center justify-between px-5 py-3 bg-white border-b border-border">
                <div className="flex items-center gap-3">
                    <SidebarTrigger onClick={onToggleSidebar} />
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center text-lg border border-border">
                        {agent.avatar}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-sm font-semibold text-foreground">
                                {agent.name}
                            </h2>
                            <span
                                className={cn(
                                    "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium",
                                    agent.status === "online"
                                        ? "bg-success-light text-success"
                                        : agent.status === "busy"
                                            ? "bg-amber-50 text-warning"
                                            : "bg-gray-100 text-gray-400"
                                )}
                            >
                                <span
                                    className={cn(
                                        "w-1.5 h-1.5 rounded-full",
                                        agent.status === "online"
                                            ? "bg-success"
                                            : agent.status === "busy"
                                                ? "bg-warning"
                                                : "bg-gray-400"
                                    )}
                                />
                                {agent.status === "online"
                                    ? "Online"
                                    : agent.status === "busy"
                                        ? "Busy"
                                        : "Offline"}
                            </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground">{agent.role}</p>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={onToggleDetails}
                        className="p-2 rounded-lg hover:bg-secondary transition-colors cursor-pointer xl:hidden"
                        id="toggle-details"
                    >
                        <MoreVertical className="w-4 h-4 text-muted-foreground" />
                    </button>
                </div>
            </div>

            {/* Body: Welcome State or Messages */}
            <AnimatePresence mode="wait">
                {!hasMessages && !isTyping ? (
                    <WelcomeState key="welcome" agent={agent} />
                ) : (
                    <motion.div
                        key="messages"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex-1 overflow-y-auto px-5 py-5"
                    >
                        <div className="max-w-3xl mx-auto space-y-5">
                            {/* Date separator */}
                            <div className="flex items-center gap-3 my-4">
                                <div className="flex-1 h-px bg-border" />
                                <span className="text-[11px] text-muted-foreground font-medium px-2">
                                    Today
                                </span>
                                <div className="flex-1 h-px bg-border" />
                            </div>

                            <AnimatePresence mode="popLayout">
                                {messages.map((msg) => (
                                    <MessageBubble key={msg.id} message={msg} agent={agent} />
                                ))}
                            </AnimatePresence>

                            <AnimatePresence>
                                {isTyping && (
                                    <TypingIndicator agentName={agent.name} avatar={agent.avatar} />
                                )}
                            </AnimatePresence>

                            <div ref={messagesEndRef} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Input Area */}
            <div className="border-t border-border bg-white px-5 py-3">
                <div className="max-w-3xl mx-auto">
                    <div
                        className={cn(
                            "flex items-end gap-2 px-4 py-2.5 rounded-2xl border",
                            "bg-secondary/30 border-border",
                            "focus-within:border-primary/30 focus-within:bg-white focus-within:shadow-sm",
                            "transition-all duration-200"
                        )}
                    >
                        <button className="p-1.5 rounded-lg hover:bg-secondary transition-colors cursor-pointer mb-0.5">
                            <Paperclip className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <textarea
                            ref={inputRef}
                            value={input}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            placeholder={`Ask ${agent.name} anything...`}
                            rows={1}
                            className={cn(
                                "flex-1 bg-transparent text-sm text-foreground resize-none",
                                "placeholder:text-muted-foreground outline-none",
                                "max-h-[120px] leading-relaxed py-1"
                            )}
                            id="chat-input"
                        />
                        <button className="p-1.5 rounded-lg hover:bg-secondary transition-colors cursor-pointer mb-0.5">
                            <Smile className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button
                            onClick={handleSend}
                            disabled={!input.trim()}
                            className={cn(
                                "p-2 rounded-xl transition-all duration-150 mb-0.5 cursor-pointer",
                                input.trim()
                                    ? "bg-primary text-white hover:bg-primary/90 shadow-sm"
                                    : "bg-secondary text-muted-foreground"
                            )}
                            id="send-message-btn"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                    <p className="text-[10px] text-muted-foreground/50 text-center mt-2">
                        Logistics AI can make mistakes. Verify important data with your team.
                    </p>
                </div>
            </div>
        </div>
    );
}

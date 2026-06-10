import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    Settings,
    Plus,
    ChevronRight,
    ChevronLeft,
    Menu,
    X,
} from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { Agent, ChatSession } from "@/types";
import { agents } from "@/data/mockData";

interface SidebarProps {
    chatSessions: ChatSession[];
    activeChatId: string | null;
    onSelectChat: (chatId: string) => void;
    onNewChat: () => void;
    onBackToAgents: () => void;
    isOpen: boolean;
    onToggle: () => void;
}

export function Sidebar({
    chatSessions,
    activeChatId,
    onSelectChat,
    onNewChat,
    onBackToAgents,
    isOpen,
    onToggle,
}: SidebarProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchFocused, setSearchFocused] = useState(false);

    const filteredSessions = chatSessions.filter((s) =>
        s.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getAgent = useCallback(
        (agentId: string): Agent | undefined =>
            agents.find((a) => a.id === agentId),
        []
    );

    return (
        <>
            {/* Mobile overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
                        onClick={onToggle}
                    />
                )}
            </AnimatePresence>

            <motion.aside
                className={cn(
                    "fixed lg:relative z-50 lg:z-auto",
                    "h-full w-[300px] bg-white border-r border-border",
                    "flex flex-col",
                    "transition-transform duration-300 ease-out",
                    isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                )}
            >
                {/* Logo Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center shadow-sm">
                            <span className="text-white text-base font-bold">L</span>
                        </div>
                        <div>
                            <h1 className="text-sm font-semibold text-foreground tracking-tight">
                                Logistics AI
                            </h1>
                            <p className="text-[11px] text-muted-foreground">
                                Enterprise Platform
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onToggle}
                        className="lg:hidden p-1.5 rounded-lg hover:bg-secondary transition-colors"
                    >
                        <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                </div>

                {/* Back to Agents */}
                <div className="px-4 pt-3 pb-1">
                    <button
                        id="back-to-agents"
                        onClick={onBackToAgents}
                        className={cn(
                            "w-full flex items-center gap-2 px-3 py-2 rounded-xl",
                            "text-xs text-muted-foreground hover:text-foreground",
                            "hover:bg-secondary/80 transition-all duration-150 cursor-pointer"
                        )}
                    >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        Back to Agents
                    </button>
                </div>

                {/* New Chat Button */}
                <div className="px-4 pt-2 pb-2">
                    <button
                        id="new-chat-btn"
                        onClick={onNewChat}
                        className={cn(
                            "w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl",
                            "bg-primary text-white text-sm font-medium",
                            "hover:bg-primary/90 active:scale-[0.98]",
                            "transition-all duration-150 shadow-sm",
                            "cursor-pointer"
                        )}
                    >
                        <Plus className="w-4 h-4" />
                        New Conversation
                    </button>
                </div>

                {/* Search */}
                <div className="px-4 py-2">
                    <div
                        className={cn(
                            "flex items-center gap-2.5 px-3 py-2 rounded-xl border transition-all duration-200",
                            searchFocused
                                ? "border-primary/40 bg-blue-50/50 shadow-sm"
                                : "border-border bg-secondary/50"
                        )}
                    >
                        <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <input
                            type="text"
                            placeholder="Search conversations..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => setSearchFocused(true)}
                            onBlur={() => setSearchFocused(false)}
                            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                            id="search-conversations"
                        />
                    </div>
                </div>

                {/* Chat List */}
                <div className="flex-1 overflow-y-auto px-3 py-1">
                    <p className="px-2 py-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                        Recent Chats
                    </p>
                    <div className="space-y-0.5">
                        <AnimatePresence>
                            {filteredSessions.map((session, i) => {
                                const agent = getAgent(session.agentId);
                                return (
                                    <motion.button
                                        key={session.id}
                                        initial={{ opacity: 0, x: -12 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.04 }}
                                        onClick={() => onSelectChat(session.id)}
                                        id={`chat-session-${session.id}`}
                                        className={cn(
                                            "w-full flex items-start gap-3 p-3 rounded-xl text-left",
                                            "transition-all duration-150 cursor-pointer group",
                                            activeChatId === session.id
                                                ? "bg-primary/[0.06] border border-primary/10"
                                                : "hover:bg-secondary/80 border border-transparent"
                                        )}
                                    >
                                        <span className="text-lg flex-shrink-0 mt-0.5">
                                            {agent?.avatar || "💬"}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2">
                                                <p
                                                    className={cn(
                                                        "text-sm font-medium truncate",
                                                        activeChatId === session.id
                                                            ? "text-primary"
                                                            : "text-foreground"
                                                    )}
                                                >
                                                    {session.title}
                                                </p>
                                                {session.unread > 0 && (
                                                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary text-[10px] text-white font-bold flex items-center justify-center">
                                                        {session.unread}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-muted-foreground truncate mt-0.5">
                                                {session.lastMessage}
                                            </p>
                                            <p className="text-[10px] text-muted-foreground/60 mt-1">
                                                {formatDate(session.lastMessageTime)}
                                            </p>
                                        </div>
                                    </motion.button>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Settings Footer */}
                <div className="border-t border-border px-4 py-3">
                    <button
                        id="settings-btn"
                        className={cn(
                            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl",
                            "text-sm text-muted-foreground hover:text-foreground",
                            "hover:bg-secondary/80 transition-all duration-150 cursor-pointer"
                        )}
                    >
                        <Settings className="w-4 h-4" />
                        Settings
                        <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-40" />
                    </button>
                </div>
            </motion.aside>
        </>
    );
}

export function SidebarTrigger({ onClick }: { onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="lg:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
            id="sidebar-trigger"
        >
            <Menu className="w-5 h-5 text-muted-foreground" />
        </button>
    );
}

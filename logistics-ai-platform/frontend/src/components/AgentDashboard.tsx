import { motion } from "framer-motion";
import { MessageSquare, Zap, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Agent } from "@/types";

interface AgentDashboardProps {
    agents: Agent[];
    onStartChat: (agent: Agent) => void;
}

function AgentCard({
    agent,
    index,
    onStartChat,
}: {
    agent: Agent;
    index: number;
    onStartChat: (agent: Agent) => void;
}) {
    const statusColors = {
        online: { bg: "bg-success-light", text: "text-success", dot: "bg-success" },
        busy: {
            bg: "bg-amber-50",
            text: "text-amber-600",
            dot: "bg-amber-500",
        },
        offline: { bg: "bg-gray-100", text: "text-gray-400", dot: "bg-gray-400" },
    };
    const status = statusColors[agent.status];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.35 }}
            className={cn(
                "group relative bg-white rounded-2xl border border-border",
                "p-6 flex flex-col",
                "shadow-card hover:shadow-card-hover",
                "transition-all duration-300 ease-out",
                "hover:-translate-y-1"
            )}
        >
            {/* Status badge — top right */}
            <span
                className={cn(
                    "absolute top-4 right-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium",
                    status.bg,
                    status.text
                )}
            >
                <span className={cn("w-1.5 h-1.5 rounded-full", status.dot)} />
                {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
            </span>

            {/* Avatar */}
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-50 flex items-center justify-center text-3xl border border-blue-100/80 shadow-sm mb-4">
                {agent.avatar}
            </div>

            {/* Info */}
            <h3 className="text-base font-semibold text-foreground">{agent.name}</h3>
            <p className="text-xs text-primary/70 font-medium mt-0.5">{agent.role}</p>
            <p className="text-[13px] text-muted-foreground leading-relaxed mt-3 flex-1 line-clamp-3">
                {agent.description}
            </p>

            {/* Capabilities preview */}
            <div className="flex flex-wrap gap-1.5 mt-4">
                {agent.capabilities.slice(0, 3).map((cap) => (
                    <span
                        key={cap}
                        className="inline-flex items-center gap-1 px-2 py-0.5 bg-secondary/70 rounded-md text-[10px] text-muted-foreground font-medium"
                    >
                        <Zap className="w-2.5 h-2.5" />
                        {cap}
                    </span>
                ))}
                {agent.capabilities.length > 3 && (
                    <span className="inline-flex items-center px-2 py-0.5 bg-secondary/50 rounded-md text-[10px] text-muted-foreground">
                        +{agent.capabilities.length - 3} more
                    </span>
                )}
            </div>

            {/* Start Chat CTA */}
            <button
                id={`start-chat-${agent.id}`}
                onClick={() => onStartChat(agent)}
                disabled={agent.status === "offline"}
                className={cn(
                    "mt-5 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl",
                    "text-sm font-medium transition-all duration-200 cursor-pointer",
                    agent.status === "offline"
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-primary text-white hover:bg-primary/90 active:scale-[0.98] shadow-sm"
                )}
            >
                <MessageSquare className="w-4 h-4" />
                Start Chat
                <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-0.5 transition-transform" />
            </button>
        </motion.div>
    );
}

export function AgentDashboard({ agents, onStartChat }: AgentDashboardProps) {
    return (
        <div className="flex-1 overflow-y-auto bg-background">
            <div className="max-w-5xl mx-auto px-6 py-10">
                {/* Dashboard Header */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center shadow-sm">
                            <span className="text-white text-lg font-bold">L</span>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-foreground tracking-tight">
                                AI Agents
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Select an agent to start a conversation
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Agents Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {agents.map((agent, i) => (
                        <AgentCard
                            key={agent.id}
                            agent={agent}
                            index={i}
                            onStartChat={onStartChat}
                        />
                    ))}
                </div>

                {/* Footer note */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center text-xs text-muted-foreground/50 mt-12"
                >
                    Logistics AI Platform · Enterprise Edition · All agents are AI-powered
                </motion.p>
            </div>
        </div>
    );
}

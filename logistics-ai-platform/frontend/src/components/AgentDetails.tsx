import { motion, AnimatePresence } from "framer-motion";
import {
    Zap,
    MessageCircle,
    Info,
    ChevronRight,
    Sparkles,
    X,
    Shield,
    Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Agent } from "@/types";

interface AgentDetailsProps {
    agent: Agent;
    onPromptClick: (prompt: string) => void;
    isOpen: boolean;
    onClose: () => void;
}

export function AgentDetails({
    agent,
    onPromptClick,
    isOpen,
    onClose,
}: AgentDetailsProps) {
    return (
        <>
            {/* Mobile overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 xl:hidden"
                        onClick={onClose}
                    />
                )}
            </AnimatePresence>

            <motion.aside
                className={cn(
                    "fixed xl:relative right-0 top-0 z-50 xl:z-auto",
                    "h-full w-[320px] bg-white border-l border-border",
                    "flex flex-col overflow-y-auto",
                    "transition-transform duration-300 ease-out",
                    isOpen ? "translate-x-0" : "translate-x-full xl:translate-x-0"
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                    <div className="flex items-center gap-2">
                        <Info className="w-4 h-4 text-muted-foreground" />
                        <h3 className="text-sm font-semibold text-foreground">
                            Agent Details
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="xl:hidden p-1.5 rounded-lg hover:bg-secondary transition-colors cursor-pointer"
                    >
                        <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                </div>

                <div className="p-5 space-y-6">
                    {/* Agent Profile Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-50 flex items-center justify-center text-3xl mx-auto border border-border shadow-sm">
                            {agent.avatar}
                        </div>
                        <h3 className="text-base font-semibold text-foreground mt-3">
                            {agent.name}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{agent.role}</p>
                        <div className="flex items-center justify-center gap-1.5 mt-2">
                            <span
                                className={cn(
                                    "w-2 h-2 rounded-full",
                                    agent.status === "online"
                                        ? "bg-success"
                                        : agent.status === "busy"
                                            ? "bg-warning"
                                            : "bg-gray-400"
                                )}
                            />
                            <span className="text-xs text-muted-foreground capitalize">
                                {agent.status}
                            </span>
                        </div>
                    </motion.div>

                    {/* Description */}
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 }}
                    >
                        <div className="flex items-center gap-2 mb-2.5">
                            <MessageCircle className="w-3.5 h-3.5 text-muted-foreground" />
                            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">
                                Description
                            </h4>
                        </div>
                        <p className="text-[13px] text-muted-foreground leading-relaxed">
                            {agent.description}
                        </p>
                    </motion.div>

                    {/* Capabilities */}
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <div className="flex items-center gap-2 mb-2.5">
                            <Zap className="w-3.5 h-3.5 text-muted-foreground" />
                            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">
                                Capabilities
                            </h4>
                        </div>
                        <div className="space-y-1.5">
                            {agent.capabilities.map((cap, i) => (
                                <motion.div
                                    key={cap}
                                    initial={{ opacity: 0, x: -8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.12 + i * 0.03 }}
                                    className="flex items-center gap-2.5 px-3 py-2 bg-secondary/50 rounded-lg"
                                >
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary/60 flex-shrink-0" />
                                    <span className="text-xs text-foreground">{cap}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Stats Row */}
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="grid grid-cols-2 gap-2.5"
                    >
                        <div className="flex items-center gap-2 px-3 py-2.5 bg-secondary/40 rounded-xl">
                            <Shield className="w-3.5 h-3.5 text-success" />
                            <div>
                                <p className="text-[10px] text-muted-foreground">Trust Score</p>
                                <p className="text-sm font-semibold text-foreground">98.7%</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-2.5 bg-secondary/40 rounded-xl">
                            <Clock className="w-3.5 h-3.5 text-primary" />
                            <div>
                                <p className="text-[10px] text-muted-foreground">Avg Response</p>
                                <p className="text-sm font-semibold text-foreground">1.2s</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Suggested Prompts */}
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="flex items-center gap-2 mb-2.5">
                            <Sparkles className="w-3.5 h-3.5 text-muted-foreground" />
                            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">
                                Suggested Prompts
                            </h4>
                        </div>
                        <div className="space-y-1.5">
                            {agent.suggestedPrompts.map((prompt, i) => (
                                <motion.button
                                    key={prompt}
                                    initial={{ opacity: 0, x: 8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.22 + i * 0.03 }}
                                    onClick={() => onPromptClick(prompt)}
                                    id={`suggested-prompt-${i}`}
                                    className={cn(
                                        "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left",
                                        "text-xs text-foreground",
                                        "bg-gradient-to-r from-blue-50/80 to-indigo-50/40",
                                        "border border-blue-100/60",
                                        "hover:from-blue-50 hover:to-indigo-50/80 hover:border-blue-200/60",
                                        "hover:shadow-sm active:scale-[0.98]",
                                        "transition-all duration-150 cursor-pointer group"
                                    )}
                                >
                                    <ChevronRight className="w-3 h-3 text-primary/40 group-hover:text-primary/70 transition-colors flex-shrink-0" />
                                    <span className="flex-1 leading-relaxed">{prompt}</span>
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </motion.aside>
        </>
    );
}
